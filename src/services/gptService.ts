import { GiftFormData, GiftRecommendation, GPTResponse } from '../types/gift';

// API 호출을 Netlify Function으로 변경
const API_FUNCTION_URL = '/.netlify/functions/get-recommendations';

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
      const imageUrl = getStableImageUrl(rec.category);
      
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

// 더 안정적인 이미지 URL 생성 함수
const getStableImageUrl = (category: string): string => {
  const categoryImages: { [key: string]: string } = {
    '액세서리': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&auto=format&q=80',
    '뷰티': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&auto=format&q=80',
    '향수': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop&auto=format&q=80',
    'IT기기': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format&q=80',
    '패션': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&auto=format&q=80',
    '생활용품': 'https://images.unsplash.com/photo-1586880244386-8b3e34734ed8?w=400&h=300&fit=crop&auto=format&q=80',
    '꽃': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop&auto=format&q=80',
    '음식': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format&q=80',
    '전자제품': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format&q=80',
    '책': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&auto=format&q=80',
    '운동': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&auto=format&q=80',
    '여행': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop&auto=format&q=80',
    '기본': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format&q=80'
  };
  
  // 카테고리 정규화 및 매칭
  const normalizedCategory = category.toLowerCase().trim();
  const categoryMappings: { [key: string]: string } = {
    '액세서리': '액세서리',
    '악세서리': '액세서리',
    '쥬얼리': '액세서리',
    '보석': '액세서리',
    '목걸이': '액세서리',
    '귀걸이': '액세서리',
    '팔찌': '액세서리',
    '반지': '액세서리',
    
    '뷰티': '뷰티',
    '화장품': '뷰티',
    '미용': '뷰티',
    '스킨케어': '뷰티',
    '코스메틱': '뷰티',
    
    '향수': '향수',
    '퍼퓰': '향수',
    '프래그런스': '향수',
    
    '전자제품': 'IT기기',
    '전자': 'IT기기',
    'it': 'IT기기',
    '기기': 'IT기기',
    '디지털': 'IT기기',
    '컴퓨터': 'IT기기',
    '스마트폰': 'IT기기',
    '태블릿': 'IT기기',
    
    '패션': '패션',
    '의류': '패션',
    '옷': '패션',
    '신발': '패션',
    '가방': '패션',
    
    '생활용품': '생활용품',
    '생활': '생활용품',
    '홈': '생활용품',
    '인테리어': '생활용품',
    '주방': '생활용품',
    
    '꽃': '꽃',
    '플라워': '꽃',
    '부케': '꽃',
    
    '음식': '음식',
    '먹거리': '음식',
    '디저트': '음식',
    '케이크': '음식',
    '초콜릿': '음식',
    
    '책': '책',
    '도서': '책',
    '서적': '책',
    
    '운동': '운동',
    '스포츠': '운동',
    '피트니스': '운동',
    '헬스': '운동',
    
    '여행': '여행',
    '트래블': '여행',
    '휴가': '여행'
  };
  
  const mappedCategory = categoryMappings[normalizedCategory] || '기본';
  
  console.log(`🖼️ 이미지 매핑: "${category}" → "${mappedCategory}"`);
  
  return categoryImages[mappedCategory] || categoryImages['기본'];
};

// 쿠팡 파트너스 검색 링크 생성 함수
const generateCoupangSearchLink = (keyword: string): string => {
  const partnerId = process.env.REACT_APP_COUPANG_PARTNER_ID;
  const encodedKeyword = encodeURIComponent(keyword);
  
  console.log(`🔗 쿠팡 링크 생성: "${keyword}", 파트너ID: ${partnerId ? '설정됨' : '없음'}`);
  
  if (partnerId) {
    const partnerLink = `https://link.coupang.com/a/${partnerId}?url=https%3A%2F%2Fwww.coupang.com%2Fnp%2Fsearch%3Fq%3D${encodedKeyword}`;
    console.log(`✅ 파트너스 링크: ${partnerLink}`);
    return partnerLink;
  } else {
    const directLink = `https://www.coupang.com/np/search?q=${encodedKeyword}`;
    console.log(`⚠️ 직접 링크: ${directLink}`);
    return directLink;
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