import { GiftFormData, GiftRecommendation, GPTResponse } from '../types/gift';

// API 호출을 Next.js API Route로 변경
const API_FUNCTION_URL = '/api/recommendations';

export const getGiftRecommendations = async (formData: GiftFormData): Promise<GPTResponse> => {
  console.log('🚀 Netlify Function 호출 시작:', {
    url: API_FUNCTION_URL,
    environment: process.env.NODE_ENV
  });

  try {
    const response = await fetch(API_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    console.log('📡 Netlify Function 응답 상태:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => response.text());
      console.error('❌ Netlify Function 오류:', errorData);
      throw new Error('서버에서 추천을 받아오는 중 오류가 발생했습니다.');
    }

    let parsedResponse;
    try {
      parsedResponse = await response.json();
    } catch (error) {
      console.error('❌ 응답 JSON 파싱 오류:', error);
      throw new Error('서버 응답을 파싱할 수 없습니다.');
    }

    console.log('✅ 서버로부터 성공적인 응답 받음:', parsedResponse);

    // 각 추천 상품에 대해 쿠팡 검색 링크 및 이미지 생성
    const recommendationsWithLinks = parsedResponse.recommendations.map((rec: any, index: number) => {
      const searchKeyword = rec.searchKeyword || rec.title;
      const coupangUrl = generateCoupangSearchLink(searchKeyword);
      const imageUrl = getStableImageUrl(rec.category, rec.title);

      console.log(`🔍 추천 ${index + 1}:`, {
        title: rec.title,
        searchKeyword: searchKeyword,
        coupangUrl: coupangUrl,
        imageUrl: imageUrl
      });

      return {
        id: rec.id,
        title: rec.title,
        description: rec.description,
        price: rec.price,
        imageUrl: imageUrl,
        coupangUrl: coupangUrl,
        category: rec.category,
        rating: 4.5, // 기본 평점
        reviewCount: Math.floor(Math.random() * 500) + 50 // 랜덤 리뷰 수
      };
    });

    return {
      recommendations: recommendationsWithLinks,
      success: true
    };
  } catch (error) {
    console.error('💥 전체 API 호출 오류:', error);

    // 오류 발생 시 사용자에게 보여줄 메시지와 함께 실패 응답 반환
    return {
      recommendations: [],
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
    };
  }
};

// 더 안정적이고 다양한 이미지 URL 생성 함수
const getStableImageUrl = (category: string, productTitle?: string): string => {
  // 세부 키워드별 고품질 이미지 1:1 매칭 풀 (AI가 자주 추천하는 베스트셀러 위주)
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
    '기본': ['https://images.unsplash.com/photo-1549465220-1d8c9d9c67cf?w=400&h=300&fit=crop']
  };

  const title = (productTitle || '').toLowerCase();
  
  // 1순위: 제품명(Title) 내 특정 키워드와 1:1 매칭 확인
  for (const [keyword, imageUrls] of Object.entries(exactKeywordImages)) {
    if (title.includes(keyword)) {
      const imgUrl = imageUrls[Math.floor(Math.random() * imageUrls.length)];
      console.log(`🖼️ 정확도 상승 매칭 완료: [키워드: ${keyword}] → ${imgUrl}`);
      return imgUrl;
    }
  }

  // 2순위: 카테고리 정규화 매칭
  const normalizedCategory = category.toLowerCase().trim();
  const categoryMappings: { [key: string]: string } = {
    '액세서리': '액세서리', '악세서리': '액세서리', '쥬얼리': '액세서리', 
    '뷰티': '뷰티', '화장품': '뷰티', '미용': '뷰티',
    '전자제품': 'IT기기', '전자': 'IT기기', 'it': 'IT기기',
    '패션': '패션', '의류': '패션',
    '생활용품': '생활용품', '생활': '생활용품', '인테리어': '생활용품'
  };

  const mappedCategory = categoryMappings[normalizedCategory] || '기본';
  const images = categoryImagePools[mappedCategory] || categoryImagePools['기본'];
  
  const selectedImage = images[Math.floor(Math.random() * images.length)];
  console.log(`🖼️ 카테고리 매칭: [${category}] → ${mappedCategory}`);
  return selectedImage;
};

// 쿠팡 파트너스 검색 링크 생성 함수
// lptag 파라미터를 사용하여 파트너스 추적 코드를 검색 URL에 삽입
const generateCoupangSearchLink = (keyword: string): string => {
  const partnerId = process.env.NEXT_PUBLIC_COUPANG_PARTNER_ID;
  const encodedKeyword = encodeURIComponent(keyword);

  console.log(`🔗 쿠팡 링크 생성: "${keyword}", 파트너ID: ${partnerId ? '설정됨' : '없음'}`);

  // 기본 쿠팡 검색 URL
  const baseSearchUrl = `https://www.coupang.com/np/search?component=&q=${encodedKeyword}&channel=user`;

  if (partnerId) {
    // 파트너스 추적 파라미터(lptag) 추가
    const partnerLink = `${baseSearchUrl}&lptag=${partnerId}`;
    console.log(`✅ 파트너스 링크: ${partnerLink}`);
    return partnerLink;
  } else {
    console.log(`⚠️ 직접 링크 (파트너 ID 없음): ${baseSearchUrl}`);
    return baseSearchUrl;
  }
};

// 더미 데이터 생성 함수 (개발/테스트 및 폴백용)
export const getDummyRecommendations = async (formData: GiftFormData): Promise<GPTResponse> => {
  console.log('🎭 더미 데이터 생성 중...');
  await new Promise(resolve => setTimeout(resolve, 1500));

  const dummyRecommendations: GiftRecommendation[] = [
    {
      id: '1',
      title: '커플 목걸이 세트',
      description: '사랑스러운 하트 모양의 커플 목걸이로 특별한 기념일을 축하하세요',
      price: '45,000원',
      imageUrl: getStableImageUrl('액세서리'),
      coupangUrl: generateCoupangSearchLink('커플 목걸이 세트'),
      category: '액세서리',
      rating: 4.5,
      reviewCount: 1284
    },
    {
      id: '2',
      title: '프리미엄 향수 세트',
      description: '고급스러운 향으로 특별한 순간을 더욱 기억에 남게 만드는 향수',
      price: '89,000원',
      imageUrl: getStableImageUrl('향수'),
      coupangUrl: generateCoupangSearchLink('프리미엄 향수 세트'),
      category: '향수',
      rating: 4.3,
      reviewCount: 567
    },
    {
      id: '3',
      title: '무선 블루투스 이어폰',
      description: '고음질 사운드로 함께 음악을 즐길 수 있는 스타일리시한 이어폰',
      price: '129,000원',
      imageUrl: getStableImageUrl('전자제품'),
      coupangUrl: generateCoupangSearchLink('무선 블루투스 이어폰'),
      category: '전자제품',
      rating: 4.6,
      reviewCount: 2341
    },
    {
      id: '4',
      title: '로맨틱 꽃다발',
      description: '신선한 장미와 계절 꽃으로 구성된 아름다운 꽃다발',
      price: '35,000원',
      imageUrl: getStableImageUrl('꽃'),
      coupangUrl: generateCoupangSearchLink('로맨틱 꽃다발'),
      category: '꽃',
      rating: 4.4,
      reviewCount: 892
    }
  ];

  console.log('✅ 더미 데이터 생성 완료:', dummyRecommendations.length, '개 아이템');

  return {
    recommendations: dummyRecommendations,
    success: true
  };
}; 