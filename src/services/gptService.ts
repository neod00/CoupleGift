/**
 * 브라우저에서 실행되는 추천 서비스.
 *
 * 서버(/api/recommendations)가 각 추천에 실제 쿠팡 상품(추적 링크, 실제 이미지, 실제 가격)을 붙여
 * 돌려주므로 여기서는 그 값을 우선 사용하고, 서버가 채우지 못한 항목(구버전 응답, 매칭 실패)에만
 * 카테고리 기반 대체 이미지와 쿠팡 검색 링크를 채운다.
 *
 * 주의: 이 파일은 클라이언트 번들에 포함된다. '@/lib/coupang/client' (Secret Key 사용) 를 절대 import 하지 말 것.
 * 평점/리뷰 수는 실제 데이터가 있을 때만 채운다 — 임의의 값을 만들어 넣지 않는다.
 */
import type { CoupangProduct } from '@/lib/coupang/types';
import { GiftFormData, GiftRecommendation, GiftLinkSource, GPTResponse } from '../types/gift';

// API 호출을 Next.js API Route로 변경
const API_FUNCTION_URL = '/api/recommendations';

const isDev = process.env.NODE_ENV === 'development';

/** 서버 응답 한 건 (필드가 일부 빠져 있을 수 있음) */
interface ServerRecommendation {
  id?: string | number;
  title?: string;
  description?: string;
  price?: string;
  estimatedPrice?: string;
  category?: string;
  searchKeyword?: string;
  imageUrl?: string;
  coupangUrl?: string;
  products?: CoupangProduct[];
  source?: GiftLinkSource;
  rating?: number;
  reviewCount?: number;
}

function isLinkSource(value: unknown): value is GiftLinkSource {
  return value === 'api' || value === 'catalog' || value === 'fallback';
}

/** 서버 응답을 화면용 GiftRecommendation 으로 정규화 */
function toGiftRecommendation(rec: ServerRecommendation, index: number): GiftRecommendation {
  const title = (rec.title || '').trim() || `추천 선물 ${index + 1}`;
  const category = (rec.category || '').trim() || '기타';
  const searchKeyword = (rec.searchKeyword || '').trim() || title;
  const products = Array.isArray(rec.products) ? rec.products.filter((p) => p && p.productUrl) : [];

  // 서버가 붙인 실제 상품 값을 우선 사용. 없을 때만 클라이언트 폴백
  const imageUrl = (rec.imageUrl || '').trim() || getStableImageUrl(category, title);
  const coupangUrl = (rec.coupangUrl || '').trim() || generateCoupangSearchLink(searchKeyword);
  const source: GiftLinkSource = isLinkSource(rec.source)
    ? rec.source
    : products.length > 0
      ? 'catalog'
      : 'fallback';

  const gift: GiftRecommendation = {
    id: rec.id !== undefined && rec.id !== null ? String(rec.id) : String(index + 1),
    title,
    description: (rec.description || '').trim(),
    price: (rec.price || '').trim() || (rec.estimatedPrice || '').trim(),
    imageUrl,
    coupangUrl,
    category,
    searchKeyword,
    source,
  };

  if (rec.estimatedPrice) gift.estimatedPrice = rec.estimatedPrice;
  if (products.length > 0) gift.products = products;
  // 평점/리뷰 수는 서버가 실제 값을 준 경우에만 그대로 전달 (허위 사회적 증거 금지)
  if (typeof rec.rating === 'number' && Number.isFinite(rec.rating)) gift.rating = rec.rating;
  if (typeof rec.reviewCount === 'number' && Number.isFinite(rec.reviewCount)) gift.reviewCount = rec.reviewCount;

  return gift;
}

export const getGiftRecommendations = async (formData: GiftFormData): Promise<GPTResponse> => {
  if (isDev) {
    console.log('🚀 추천 API 호출 시작:', { url: API_FUNCTION_URL });
  }

  try {
    const response = await fetch(API_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (isDev) {
      console.log('📡 추천 API 응답 상태:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('❌ 추천 API 오류:', errorData);
      throw new Error('서버에서 추천을 받아오는 중 오류가 발생했습니다.');
    }

    let parsedResponse: { recommendations?: ServerRecommendation[] };
    try {
      parsedResponse = await response.json();
    } catch (error) {
      console.error('❌ 응답 JSON 파싱 오류:', error);
      throw new Error('서버 응답을 파싱할 수 없습니다.');
    }

    const serverList = Array.isArray(parsedResponse?.recommendations) ? parsedResponse.recommendations : [];
    const recommendations = serverList.map(toGiftRecommendation);

    if (isDev) {
      console.log(
        '✅ 추천 수신:',
        recommendations.map((r) => ({
          title: r.title,
          source: r.source,
          products: r.products?.length ?? 0,
          coupangUrl: r.coupangUrl,
        }))
      );
    }

    return {
      recommendations,
      success: recommendations.length > 0,
      ...(recommendations.length === 0 ? { error: '추천 결과가 비어 있습니다.' } : {}),
    };
  } catch (error) {
    console.error('💥 전체 API 호출 오류:', error);

    // 오류 발생 시 사용자에게 보여줄 메시지와 함께 실패 응답 반환
    return {
      recommendations: [],
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
};

// 실제 상품 이미지가 없을 때만 쓰는 카테고리 기반 대체 이미지 (Unsplash)
const getStableImageUrl = (category: string, productTitle?: string): string => {
  // 세부 키워드별 이미지 1:1 매칭 풀 (AI가 자주 추천하는 베스트셀러 위주)
  const exactKeywordImages: { [key: string]: string[] } = {
    '조명': ['https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=400&h=300&fit=crop'],
    '무드등': ['https://images.unsplash.com/photo-1534346894562-b9b5a882d334?w=400&h=300&fit=crop'],
    '디퓨저': ['https://images.unsplash.com/photo-1602928321679-560bb453f190?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1596431252119-94fcad55cbf3?w=400&h=300&fit=crop'],
    '캔들': ['https://images.unsplash.com/photo-1603006905393-41dcdec20bbb?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1599818816900-580798be1f60?w=400&h=300&fit=crop'],
    '향수': ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1592945403244-b3faa1b8d0b5?w=400&h=300&fit=crop'],
    '다이어리': ['https://images.unsplash.com/photo-1531346878377-380d46d0a790?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=300&fit=crop'],
    '지갑': ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1551065103-ba21af288339?w=400&h=300&fit=crop'],
    '가방': ['https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=300&fit=crop'],
    '시계': ['https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=400&h=300&fit=crop'],
    '목걸이': ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&h=300&fit=crop'],
    '반지': ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop'],
    '꽃': ['https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=300&fit=crop'],
    '텀블러': ['https://images.unsplash.com/photo-1597818469335-db7c7621c13d?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1614051070764-16a7eb14eb2b?w=400&h=300&fit=crop'],
    '거치대': ['https://images.unsplash.com/photo-1586942007804-ac0cc9ca40ba?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=400&h=300&fit=crop'],
    '이어폰': ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1606220588913-b3eea415843b?w=400&h=300&fit=crop'],
    '오일': ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1570196884351-a2bc0a417e92?w=400&h=300&fit=crop'],
    '초콜릿': ['https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&h=300&fit=crop'],
    '와인': ['https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1559564104-e5e1a14845ed?w=400&h=300&fit=crop'],
    '마사지': ['https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop'],
  };

  // 기존 대분류 카테고리 풀
  const categoryImagePools: { [key: string]: string[] } = {
    '액세서리': exactKeywordImages['지갑'].concat(exactKeywordImages['목걸이']),
    '뷰티': exactKeywordImages['오일'].concat(['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop']),
    '향수': exactKeywordImages['향수'].concat(exactKeywordImages['디퓨저']),
    'IT기기': exactKeywordImages['이어폰'].concat(['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop']),
    '패션': exactKeywordImages['가방'].concat(['https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop']),
    '생활용품': exactKeywordImages['텀블러'].concat(['https://images.unsplash.com/photo-1586880244386-8b3e34734ed8?w=400&h=300&fit=crop']),
    '기본': ['https://images.unsplash.com/photo-1549465220-1d8c9d9c67cf?w=400&h=300&fit=crop'],
  };

  const title = (productTitle || '').toLowerCase();

  // 1순위: 제품명(Title) 내 특정 키워드와 1:1 매칭 확인
  for (const [keyword, imageUrls] of Object.entries(exactKeywordImages)) {
    if (title.includes(keyword)) {
      return imageUrls[Math.floor(Math.random() * imageUrls.length)];
    }
  }

  // 2순위: 카테고리 정규화 매칭
  const normalizedCategory = (category || '').toLowerCase().trim();
  const categoryMappings: { [key: string]: string } = {
    '액세서리': '액세서리', '악세서리': '액세서리', '쥬얼리': '액세서리',
    '뷰티': '뷰티', '화장품': '뷰티', '미용': '뷰티',
    '전자제품': 'IT기기', '전자': 'IT기기', 'it': 'IT기기',
    '패션': '패션', '의류': '패션',
    '생활용품': '생활용품', '생활': '생활용품', '인테리어': '생활용품',
  };

  const mappedCategory = categoryMappings[normalizedCategory] || '기본';
  const images = categoryImagePools[mappedCategory] || categoryImagePools['기본'];

  return images[Math.floor(Math.random() * images.length)];
};

// 쿠팡 검색 링크 생성 함수 (서버가 링크를 주지 못했을 때만 사용하는 폴백)
//
// ⚠️ 주의: lptag 파라미터는 쿠팡 파트너스의 공식 문서화된 추적 방법이 아니며, 이 링크로 발생한
// 구매는 파트너스 계정에 귀속되지 않을 수 있습니다. 실제 수수료가 잡히는 링크는 서버가
// 파트너스 API/카탈로그에서 가져온 상품의 productUrl(추적 코드 포함) 입니다. MONETIZATION.md 참고.
const generateCoupangSearchLink = (keyword: string): string => {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const encodedKeyword = encodeURIComponent(keyword);

  // 기본 쿠팡 검색 URL
  const baseSearchUrl = `https://www.coupang.com/np/search?component=&q=${encodedKeyword}&channel=user`;

  if (partnerId) {
    return `${baseSearchUrl}&lptag=${partnerId}`;
  }
  return baseSearchUrl;
};

// 더미 데이터 생성 함수 (개발/테스트 및 폴백용) — 평점/리뷰 수는 실제 값이 아니므로 넣지 않는다
export const getDummyRecommendations = async (_formData: GiftFormData): Promise<GPTResponse> => {
  if (isDev) console.log('🎭 더미 데이터 생성 중...');
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const dummyItems: Array<{ id: string; title: string; description: string; price: string; category: string; searchKeyword: string }> = [
    {
      id: '1',
      title: '커플 목걸이 세트',
      description: '사랑스러운 하트 모양의 커플 목걸이로 특별한 기념일을 축하하세요',
      price: '45,000원',
      category: '액세서리',
      searchKeyword: '커플 목걸이',
    },
    {
      id: '2',
      title: '프리미엄 향수 세트',
      description: '고급스러운 향으로 특별한 순간을 더욱 기억에 남게 만드는 향수',
      price: '89,000원',
      category: '향수',
      searchKeyword: '향수 세트',
    },
    {
      id: '3',
      title: '무선 블루투스 이어폰',
      description: '고음질 사운드로 함께 음악을 즐길 수 있는 스타일리시한 이어폰',
      price: '129,000원',
      category: '전자제품',
      searchKeyword: '무선 이어폰',
    },
    {
      id: '4',
      title: '로맨틱 꽃다발',
      description: '신선한 장미와 계절 꽃으로 구성된 아름다운 꽃다발',
      price: '35,000원',
      category: '꽃',
      searchKeyword: '꽃다발',
    },
  ];

  const dummyRecommendations: GiftRecommendation[] = dummyItems.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    price: item.price,
    estimatedPrice: item.price,
    imageUrl: getStableImageUrl(item.category, item.title),
    coupangUrl: generateCoupangSearchLink(item.searchKeyword),
    category: item.category,
    searchKeyword: item.searchKeyword,
    source: 'fallback',
  }));

  return {
    recommendations: dummyRecommendations,
    success: true,
  };
};
