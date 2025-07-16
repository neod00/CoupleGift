// netlify/functions/get-recommendations.js

exports.handler = async function (event, context) {
  // CORS 헤더 설정
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Max-Age': '86400'
  };

  // OPTIONS 요청 (프리플라이트) 처리
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: ''
    };
  }

  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const formData = JSON.parse(event.body);
    
    // 서버 환경변수 우선, 클라이언트 환경변수 폴백
    const API_KEY = process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;

    if (!API_KEY) {
      console.error('❌ API Key not found. Checked: OPENAI_API_KEY, REACT_APP_OPENAI_API_KEY');
      throw new Error('OpenAI API 키가 서버에 설정되지 않았습니다.');
    }

    console.log('✅ OpenAI API Key found:', API_KEY.substring(0, 10) + '...');
    
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

    console.log('🚀 OpenAI API 호출 시작...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ OpenAI API Error:', errorData);
      throw new Error(`OpenAI API 요청 실패: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    const gptResponse = data.choices[0].message.content;
    
    console.log('✅ OpenAI API 응답 받음:', gptResponse.substring(0, 100) + '...');

    // OpenAI 응답을 JSON으로 파싱하여 검증
    try {
      const parsedResponse = JSON.parse(gptResponse);
      
      // 응답이 올바른 형식인지 확인
      if (parsedResponse.recommendations && Array.isArray(parsedResponse.recommendations)) {
        console.log('✅ 응답 파싱 성공:', parsedResponse.recommendations.length, '개 추천');
        return {
          statusCode: 200,
          body: JSON.stringify(parsedResponse),
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...corsHeaders
          }
        };
      } else {
        throw new Error('OpenAI 응답 형식이 올바르지 않습니다.');
      }
    } catch (parseError) {
      console.error('❌ OpenAI 응답 파싱 오류:', parseError);
      console.error('원본 응답:', gptResponse);
      throw new Error('OpenAI 응답을 파싱할 수 없습니다.');
    }

  } catch (error) {
    console.error('❌ Netlify Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: error.message,
        details: 'Netlify 함수에서 오류가 발생했습니다.'
      }),
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        ...corsHeaders
      }
    };
  }
}; 