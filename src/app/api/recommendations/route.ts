import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const formData = await request.json();
        const API_KEY = process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;

        if (!API_KEY) {
            console.error('❌ API Key not found');
            return NextResponse.json({
                recommendations: [
                    {
                        id: "test-1",
                        title: "테스트 선물 1",
                        description: "API 키가 없을 때의 테스트 응답입니다",
                        price: "테스트 가격",
                        category: "테스트",
                        searchKeyword: "테스트"
                    }
                ]
            }, { status: 200 }); // Returning 200 for dummy test as in original
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

        const requestBody = {
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
        };

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`OpenAI API 요청 실패: ${response.status} - ${errorData}`);
        }

        const data = await response.json();
        const gptResponse = data.choices[0].message.content;
        const parsedResponse = JSON.parse(gptResponse);

        return NextResponse.json(parsedResponse);

    } catch (error: any) {
        console.error('❌ API Error:', error);
        return NextResponse.json({
            error: error.message,
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
