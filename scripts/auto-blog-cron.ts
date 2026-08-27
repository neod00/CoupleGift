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

function getExistingPosts(): { slug: string; title: string }[] {
    const postsDir = path.join(process.cwd(), "src", "data", "blog", "posts");
    if (!fs.existsSync(postsDir)) return [];
    return fs.readdirSync(postsDir)
        .filter(f => f.endsWith(".json"))
        .map(f => {
            try {
                const data = JSON.parse(fs.readFileSync(path.join(postsDir, f), "utf8"));
                return { slug: f.replace(".json", ""), title: data?.ko?.title || "" };
            } catch {
                return { slug: f.replace(".json", ""), title: "" };
            }
        });
}

async function main() {
    console.log("Starting Auto-Blog Generation Cron Job...");

    // 1. Identify season/trending topic
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0];
    const month = now.getMonth() + 1;

    // 이미 발행한 글 목록 — 같은 주제를 반복 생성하지 않도록 프롬프트에 전달
    // (중복 주제가 쌓이면 검색엔진이 서로 순위를 갉아먹는 키워드 카니벌리제이션이 발생하고,
    //  구글/애드센스의 '가치 낮은 반복 콘텐츠' 평가 위험이 커진다)
    const existingPosts = getExistingPosts();
    const existingTitles = existingPosts.map(p => `- ${p.title}`).join("\n");

    // Create query grounded in reality
    const topicPrompt = `
    오늘 날짜는 ${dateStr}입니다.
    "선물 추천" 블로그에서 다룰 새 글 주제를 딱 1개 정해주세요.

    ## 이미 발행한 글 목록 (아래 주제와 겹치거나 비슷한 주제는 절대 금지)
${existingTitles}

    ## 주제 선정 규칙
    - 위 목록과 소재/키워드/대상이 겹치는 주제는 선택하지 마세요. (예: 이미 '추석 부모님 선물' 글이 많다면 그 변형도 금지)
    - 연중 꾸준히 검색되는 에버그린 주제(여자친구 생일선물, 남자친구 선물, 부모님 생신, 100일/1주년 기념일, 집들이, 결혼/출산 선물, 예산별 선물 등)를 우선하되,
      2~4주 안에 다가오는 기념일/시즌이 있으면 그것도 고려하세요.
    - 검색량이 높을 법한 구체적 키워드를 포함하세요. (대상 + 상황 + 특징, 예: 20대 여자친구 100일 기념 센스있는 선물)
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

    // 슬러그 충돌 시 기존 글을 덮어쓰지 않도록 방어
    if (existingPosts.some(p => p.slug === slug)) {
        console.log(`[Duplicate Slug]: ${slug} already exists. Skipping this run to avoid duplicate content.`);
        process.exit(0);
    }
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
