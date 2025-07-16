import { GiftFormData, GiftRecommendation, GPTResponse } from '../types/gift';

const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const getGiftRecommendations = async (formData: GiftFormData): Promise<GPTResponse> => {
  console.log('🚀 getGiftRecommendations 시작:', {
    hasApiKey: !!API_KEY,
    apiKeyPrefix: API_KEY ? API_KEY.substring(0, 10) + '...' : '없음',
    environment: process.env.NODE_ENV
  });

  if (!API_KEY) {
    console.warn('⚠️ OpenAI API 키가 없습니다. 더미 데이터를 사용합니다.');
    return getDummyRecommendations(formData);
  }

  const prompt = `
당신은 커플 기념일 선물 추천 전문가입니다. 다음 정보를 바탕으로 3-4개의 선물을 추천해주세요.

상대방 정보:
- 성별: ${formData.gender === 'male' ? '남성' : '여성'}
- 나이: ${formData.age}세
- 성격/취향: ${formData.personality}
- 기념일: ${formData.occasionType}
- 예산: ${formData.minBudget.toLocaleString()}원 ~ ${formData.maxBudget.toLocaleString()}원
- 선호 카테고리: ${formData.category || '전체'}
- 추가 정보: ${formData.additionalInfo || '없음'}

다음 JSON 형식으로 정확히 답변해주세요:
{
  "recommendations": [
    {
      "id": "1",
      "title": "선물 이름",
      "description": "선물에 대한 간단한 설명 (50자 이내)",
      "price": "예상 가격 (예: 59,000원)",
      "category": "카테고리",
      "searchKeyword": "쿠팡 검색용 키워드 (구체적이고 간단하게)"
    }
  ]
}

주의사항:
- 예산 범위 내의 현실적인 가격으로 추천
- 성별, 나이, 성격을 고려한 맞춤형 추천
- 기념일 특성에 맞는 의미있는 선물 제안
- searchKeyword는 쿠팡에서 실제 검색 가능한 단순한 키워드로 작성 (예: "커플 목걸이", "무선 이어폰", "향수")
- JSON 형식을 정확히 지켜주세요
`;

  try {
    console.log('🤖 GPT API 호출 시작...');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: '당신은 커플 기념일 선물 추천 전문가입니다. 사용자의 요구사항을 분석하여 최적의 선물을 JSON 형식으로 추천해주세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      })
    });

    console.log('📡 GPT API 응답 상태:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ GPT API 오류:', {
        status: response.status,
        statusText: response.statusText,
        errorData: errorData
      });
      
      // API 오류 시 더미 데이터 사용
      console.log('🔄 API 오류로 인해 더미 데이터를 사용합니다.');
      return getDummyRecommendations(formData);
    }

    const data = await response.json();
    console.log('✅ GPT API 성공적 응답 받음');
    
    const gptResponse = data.choices[0].message.content;
    console.log('📝 GPT 응답 내용:', gptResponse);
    
    // JSON 파싱
    const parsedResponse = JSON.parse(gptResponse);
    console.log('🔄 파싱된 응답:', parsedResponse);
    
    // 각 추천 상품에 대해 쿠팡 검색 링크 생성
    const recommendationsWithLinks = parsedResponse.recommendations.map((rec: any, index: number) => {
      const searchKeyword = rec.searchKeyword || rec.title;
      const coupangUrl = generateCoupangSearchLink(searchKeyword);
      
      // 더 안정적인 이미지 소스 사용
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
    console.error('💥 GPT API 전체 오류:', error);
    
    // 오류 발생 시 더미 데이터 사용
    console.log('🔄 오류로 인해 더미 데이터를 사용합니다.');
    return getDummyRecommendations(formData);
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
  const partnerId = process.env.REACT_APP_COUPANG_PARTNER_ID || '';
  const encodedKeyword = encodeURIComponent(keyword);
  
  console.log(`🔗 링크 생성:`, {
    keyword: keyword,
    partnerId: partnerId ? `${partnerId.substring(0, 10)}...` : '없음',
    encodedKeyword: encodedKeyword
  });
  
  if (partnerId) {
    // 파트너 ID가 있으면 파트너스 링크 생성
    const partnerLink = `https://link.coupang.com/a/${partnerId}?url=https%3A%2F%2Fwww.coupang.com%2Fnp%2Fsearch%3Fq%3D${encodedKeyword}`;
    console.log(`✅ 파트너스 링크:`, partnerLink);
    return partnerLink;
  } else {
    // 파트너 ID가 없으면 일반 검색 링크 생성
    const searchLink = `https://www.coupang.com/np/search?q=${encodedKeyword}`;
    console.log(`✅ 일반 검색 링크:`, searchLink);
    return searchLink;
  }
};

// 더미 데이터 생성 함수 (개발/테스트용)
export const getDummyRecommendations = async (formData: GiftFormData): Promise<GPTResponse> => {
  console.log('🎭 더미 데이터 생성 중...');
  
  // 실제 개발 시에는 이 함수를 사용하여 API 호출 없이 테스트 가능
  await new Promise(resolve => setTimeout(resolve, 2000)); // 2초 대기

  const dummyRecommendations: GiftRecommendation[] = [
    {
      id: '1',
      title: '커플 목걸이 세트',
      description: '서로의 이름이 새겨진 특별한 커플 목걸이',
      price: '59,000원',
      imageUrl: getStableImageUrl('액세서리'),
      coupangUrl: generateCoupangSearchLink('커플 목걸이'),
      category: '액세서리',
      rating: 4.5,
      reviewCount: 128
    },
    {
      id: '2',
      title: '프리미엄 향수 선물세트',
      description: '은은한 향이 매력적인 프리미엄 향수',
      price: '89,000원',
      imageUrl: getStableImageUrl('향수'),
      coupangUrl: generateCoupangSearchLink('향수 선물세트'),
      category: '뷰티',
      rating: 4.2,
      reviewCount: 89
    },
    {
      id: '3',
      title: '무선 이어폰',
      description: '음질이 뛰어난 프리미엄 무선 이어폰',
      price: '79,000원',
      imageUrl: getStableImageUrl('IT기기'),
      coupangUrl: generateCoupangSearchLink('무선 이어폰'),
      category: 'IT기기',
      rating: 4.7,
      reviewCount: 256
    }
  ];

  console.log('✅ 더미 데이터 생성 완료:', dummyRecommendations.length + '개');

  return {
    recommendations: dummyRecommendations,
    success: true
  };
}; 