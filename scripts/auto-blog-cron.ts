import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY not set");
  process.exit(1);
}

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";

const genAI = new GoogleGenAI({ apiKey: API_KEY });

async function fetchThumbnailFromPexels(query: string): Promise<string> {
    if (!PEXELS_API_KEY) {
        return "🎁"; // Fallback to emoji
    }
    try {
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&locale=ko-KR`,
            { headers: { Authorization: PEXELS_API_KEY } }
        );
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.large;
        }
    } catch (err) {
        console.error("Pexels fetch failed:", err);
    }
    return "🎁";
}

async function main() {
    console.log("Starting Auto-Blog Generation Cron Job...");

    // 1. Identify season/trending topic
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const month = now.getMonth() + 1;
    
    // Create query grounded in reality
    const topicPrompt = `
    오늘 날짜는 ${dateStr}입니다.
    현재 한국의 계절, 다가오는 주요 기념일(발렌타인, 화이트데이, 어버이날, 스승의날, 명절, 크리스마스 등), 또는 현재 인기 있는 라이프스타일 트렌드를 기반으로,
    "선물 추천" 블로그에서 다룰 수 있는 가장 트렌디하고 검색량이 높을 것 같은 '블로그 제목 혹은 핵심 키워드' 딱 1개만 알려주세요.
    예: 20대 여자친구 100일 기념 센스있는 선물, 다가오는 추석 부모님 용돈 이외의 선물 등
    아무 부연 설명 없이 딱 주제 1문장만 출력하세요.
    `;

    console.log("Asking Gemini for trending topic...");
    const topicRes = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: "user", parts: [{ text: topicPrompt }] }],
        config: {
            tools: [{ googleSearch: {} }],
        }
    });

    const topic = topicRes.text?.trim() || "20대 커플을 위한 트렌디한 가성비 선물";
    console.log(`[Target Topic]: ${topic}`);

    // Generate Slug from topic
    const slugPrompt = `"${topic}" 에 어울리는 영문 URL slug를 만들어주세요. (예: parents-day-gifts-2026, summer-vacation-gifts). 특수문자 없이 소문자와 하이픈(-)만 사용해서 딱 단어만 출력하세요.`;
    const slugRes = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: slugPrompt
    });
    const rawSlug = slugRes.text?.trim()?.toLowerCase() || '';
    const slug = rawSlug.replace(/[^a-z0-9-]/g, "") || `gift-guide-${Date.now()}`;
    console.log(`[Target Slug]: ${slug}`);

    // Pexels thumbnail concept
    const imgConceptRes = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `주제: "${topic}". 이 주제에 가장 어울리는 아름다운 스톡 사진을 찾기 위한 영어 검색어(최대 3단어)를 알려주세요. 예: luxury gift box, red rose, cozy livingroom`
    });
    const pexelsQuery = imgConceptRes.text?.trim() || "gift box";
    console.log(`[Pexels Query]: ${pexelsQuery}`);
    
    const bannerImage = await fetchThumbnailFromPexels(pexelsQuery);

    // 2. Draft Multi-language Blog Post
    const blogPrompt = `
    당신은 профессиональный SEO 블로그 에디터입니다.
    주제: "${topic}"
    발행일: ${dateStr}

    위 주제로 심도 깊은 선물 추천 블로그를 작성해주세요.

    다음 JSON 규격을 완벽하게 준수하여 언어별로 작성해서 응답하세요. (마크다운 백틱 없이 순수 JSON만 출력하세요. 반드시 파싱 가능해야 함)

    {
      "ko": {
        "title": "한국어 매력적인 제목",
        "excerpt": "한국어 요약 설명 (검색엔진 디스크립션용, 150자 이내)",
        "category": "카테고리명 (예: 생일, 기념일, 집들이, 선물 팁 중 1)",
        "readTime": "5분 등 예상 시간",
        "content": [
            "인트로 문단...",
            "## 1. 첫번째 추천 리스트 아이템 제목",
            "아이템에 대한 구체적 설명",
            "**실용성:** 왜 좋은지",
            "## 2. 두번째 추천 리스트...",
            "설명...",
            "## 💡 선물 고르기 팁",
            "마무리 팁 문단"
        ]
      },
      "en": {
        "title": "English translated attractive title",
        "excerpt": "English translated SEO excerpt",
        "category": "English Category (e.g. Birthday, Anniversary, etc)",
        "readTime": "5 min",
        "content": [
            "Translated paragraph 1...",
            "## 1. First Item Title",
            "..."
        ]
      },
      "ja": {
        // Japanese translated version
      }
    }
    
    ## 중요한 규칙
    - content 배열 안에는 문자열만 들어가야 합니다. (각 문단 또는 제목)
    - 제목은 '## ' 로 시작해야 합니다.
    - 볼드체는 '**' 로 감싸주세요.
    - 쿠팡이나 특정 링크를 직접 넣지 마세요 (시스템이 자동으로 쿠팡 다이나믹 배너를 붙입니다).
    `;

    console.log("Generating multi-language blog post...");
    const blogRes = await genAI.models.generateContent({
        model: "gemini-2.5-flash",
        contents: blogPrompt
    });

    let rawJsonText = blogRes.text || "{}";
    rawJsonText = rawJsonText.replace(/```json/g, "").replace(/```/g, "").trim();

    try {
        const blogData = JSON.parse(rawJsonText);
        
        // Assemble final JSON structure
        const finalJson = {
            id: slug,
            date: dateStr,
            image: bannerImage,
            ko: blogData.ko,
            en: blogData.en,
            ja: blogData.ja
        };

        const outPath = path.join(process.cwd(), "src", "data", "blog", "posts", `${slug}.json`);
        fs.writeFileSync(outPath, JSON.stringify(finalJson, null, 2), "utf8");
        
        console.log(`✅ Successfully created new blog post: ${outPath}`);

    } catch (e) {
        console.error("Failed to parse AI output as JSON:", e);
        console.error("Raw Output:", rawJsonText);
        process.exit(1);
    }
}

main().catch(err => {
    console.error("Fatal Error:", err);
    process.exit(1);
});
