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
    '액세서리': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop&auto=format',
    '뷰티': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop&auto=format',
    '향수': 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=300&fit=crop&auto=format',
    'IT기기': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop&auto=format',
    '패션': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&auto=format',
    '생활용품': 'https://images.unsplash.com/photo-1586880244386-8b3e34734ed8?w=400&h=300&fit=crop&auto=format',
    '꽃': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop&auto=format',
    '음식': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop&auto=format',
    '기본': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop&auto=format'
  };
  
  return categoryImages[category] || categoryImages['기본'];
};

// 쿠팡 파트너스 검색 링크 생성 함수
const generateCoupangSearchLink = (keyword: string): string => {
  // 이제 이 함수는 서버가 아닌 클라이언트에서만 실행되므로, 
  // COUPANG_PARTNER_ID도 REACT_APP_ 접두사를 사용해야 합니다.
  const partnerId = process.env.REACT_APP_COUPANG_PARTNER_ID || '';
  const encodedKeyword = encodeURIComponent(keyword);
  
  if (partnerId) {
    return `https://link.coupang.com/a/${partnerId}?url=https%3A%2F%2Fwww.coupang.com%2Fnp%2Fsearch%3Fq%3D${encodedKeyword}`;
  } else {
    return `https://www.coupang.com/np/search?q=${encodedKeyword}`;
  }
};

// 더미 데이터 생성 함수 (개발/테스트 및 폴백용)
export const getDummyRecommendations = async (formData: GiftFormData): Promise<GPTResponse> => {
  console.log('🎭 더미 데이터 생성 중...');
  await new Promise(resolve => setTimeout(resolve, 1500)); 

  const dummyRecommendations: GiftRecommendation[] = [
    {
      id: '1',
      title: '커플 목걸이 세트 (더미)',
      description: '이 데이터는 API 호출 실패 시 표시되는 예시입니다.',
      price: '59,000원',
      imageUrl: getStableImageUrl('액세서리'),
      coupangUrl: generateCoupangSearchLink('커플 목걸이'),
      category: '액세서리',
      rating: 4.5,
      reviewCount: 128
    },
    {
      id: '2',
      title: '프리미엄 향수 (더미)',
      description: '서버에 API 키를 올바르게 설정했는지 확인해주세요.',
      price: '89,000원',
      imageUrl: getStableImageUrl('향수'),
      coupangUrl: generateCoupangSearchLink('향수 선물세트'),
      category: '뷰티',
      rating: 4.2,
      reviewCount: 89
    },
  ];

  console.log('✅ 더미 데이터 생성 완료');

  return {
    recommendations: dummyRecommendations,
    success: true
  };
}; 
