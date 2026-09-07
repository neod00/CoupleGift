/**
 * 자동 블로그 발행 스크립트 (GitHub Actions 평일 00:00 UTC = 09:00 KST)
 *
 *   npx tsx scripts/auto-blog-cron.ts [--select-only] [--self-test]
 *
 * 주제 선정:
 *   1. src/data/blog/keywords.json 의 status:"pending" 항목 중에서 고른다.
 *      - 시즌 키워드(season = 피크 월)는 피크 1~2개월 전에만 발행 (4~6주 전 인덱싱 목적)
 *      - 그 다음 에버그린(priority 오름차순 → 파일 순서)
 *      - 피크 당월인 시즌 키워드는 늦었지만 에버그린 뒤에 후순위로 발행
 *      - 이미 같은 slug 의 글이 있거나, 기존 ko 제목이 키워드를 모두 담고 있으면 건너뜀
 *   2. 큐가 비었으면(발행 가능한 항목이 없으면) 예전처럼 Gemini + Google 검색으로 트렌드 주제를 고른다.
 *
 * 콘텐츠:
 *   - Gemini(gemini-2.5-flash) 가 ko 본문 + en/ja 번역 + 비교표 + FAQ + 섹션별 상품 키워드를 순수 JSON 으로 출력
 *   - 결과는 src/data/blog/posts/<slug>.json (기존 스키마 + 최상위 faq, productKeywords)
 *   - 발행 후 keywords.json 의 해당 항목을 status:"done" 으로 갱신
 *
 * 환경변수: GEMINI_API_KEY (필수), PEXELS_API_KEY (선택, 없으면 이모지 썸네일),
 *          AUTOBLOG_DATE=YYYY-MM-DD (선택, 날짜를 가장해서 시즌 로직을 테스트할 때)
 *
 * 종료 코드: 0 = 발행 완료 또는 발행할 것이 없음(중복 등), 1 = 설정/생성 실패
 */
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const argv = process.argv.slice(2);
const SELECT_ONLY = argv.includes("--select-only") || argv.includes("--dry-run");
const SELF_TEST = argv.includes("--self-test");

const API_KEY = process.env.GEMINI_API_KEY || "";
if (!API_KEY && !SELF_TEST) {
  console.error("ERROR: GEMINI_API_KEY not set");
  process.exit(1);
}

const PEXELS_API_KEY = process.env.PEXELS_API_KEY || "";
const MODEL = "gemini-2.5-flash";

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, "src", "data", "blog", "posts");
const KEYWORDS_PATH = path.join(ROOT, "src", "data", "blog", "keywords.json");

/** 한글 기준 목표 분량 (프롬프트) 과 재시도 하한 (이보다 짧으면 얇은 글로 보고 다시 생성) */
const TARGET_KO_CHARS = { min: 1500, max: 2500 };
const MIN_ACCEPTABLE_KO_CHARS = 1000;
const MAX_GENERATION_ATTEMPTS = 2;

const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// ---------------------------------------------------------------------------
// 타입
// ---------------------------------------------------------------------------

type KeywordStatus = "pending" | "done";

interface KeywordEntry {
  keyword: string;
  slug: string;
  receiver: string;
  occasion: string;
  category: string;
  /** "evergreen" 또는 피크 월 "1"~"12" */
  season: string;
  priority: number;
  intent: string;
  productKeywords: string[];
  status: KeywordStatus;
  publishedSlug?: string;
  publishedAt?: string;
}

interface KeywordFile {
  updatedAt: string;
  keywords: KeywordEntry[];
}

interface TopicPlan {
  source: "queue" | "trending";
  topic: string;
  slug: string;
  /** 큐에서 골랐을 때만 */
  entry?: KeywordEntry;
}

interface ComparisonTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

interface FaqItem {
  q: string;
  a: string;
}

interface LocaleData {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string[];
  faq: FaqItem[];
}

// ---------------------------------------------------------------------------
// Pexels 썸네일 (기존 헬퍼 유지)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 기존 글 / 키워드 큐 읽기
// ---------------------------------------------------------------------------

function getExistingPosts(): { slug: string; title: string }[] {
    if (!fs.existsSync(POSTS_DIR)) return [];
    return fs.readdirSync(POSTS_DIR)
        .filter(f => f.endsWith(".json"))
        .map(f => {
            try {
                const data = JSON.parse(fs.readFileSync(path.join(POSTS_DIR, f), "utf8"));
                return { slug: f.replace(".json", ""), title: data?.ko?.title || "" };
            } catch {
                return { slug: f.replace(".json", ""), title: "" };
            }
        });
}

function readKeywordFile(): KeywordFile | null {
    if (!fs.existsSync(KEYWORDS_PATH)) return null;
    try {
        const data = JSON.parse(fs.readFileSync(KEYWORDS_PATH, "utf8"));
        if (!data || !Array.isArray(data.keywords)) return null;
        return { updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "", keywords: data.keywords };
    } catch (err) {
        console.warn("keywords.json 파싱 실패 — 트렌드 주제로 폴백:", (err as Error).message);
        return null;
    }
}

function writeKeywordFile(file: KeywordFile): void {
    fs.writeFileSync(KEYWORDS_PATH, JSON.stringify(file, null, 2) + "\n", "utf8");
}

// ---------------------------------------------------------------------------
// 주제 선정 (순수 함수)
// ---------------------------------------------------------------------------

/** 공백/기호를 제거한 소문자 비교용 문자열 */
function normalizeForCompare(text: string): string {
    return (text || "").toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
}

/**
 * 기존 ko 제목이 키워드의 모든 어절을 (띄어쓰기 무시하고) 포함하면 이미 다룬 주제로 본다.
 * 예) "남자친구 생일선물 추천 30대" vs "20대 남자친구 생일 선물 추천 TOP 10" → 30대가 없으므로 중복 아님
 */
function isCoveredByExistingTitle(keyword: string, existingTitles: string[]): boolean {
    const tokens = keyword.split(/\s+/).map(normalizeForCompare).filter(t => t.length >= 2);
    if (tokens.length === 0) return false;
    return existingTitles.some(title => {
        const normalized = normalizeForCompare(title);
        return normalized.length > 0 && tokens.every(token => normalized.includes(token));
    });
}

/** season 이 "1"~"12" 면 피크 월, 아니면 null(에버그린) */
function peakMonthOf(entry: KeywordEntry): number | null {
    if (!entry.season || entry.season === "evergreen") return null;
    const month = Number.parseInt(entry.season, 10);
    return Number.isInteger(month) && month >= 1 && month <= 12 ? month : null;
}

/** 현재 달에서 피크 달까지 남은 개월 수 (0 = 이번 달, 11 = 지난 달) */
function monthsAhead(peakMonth: number, currentMonth: number): number {
    return (peakMonth - currentMonth + 12) % 12;
}

interface RankedCandidate {
    entry: KeywordEntry;
    /** 0 = 피크 1~2개월 전 시즌, 1 = 에버그린, 2 = 피크 당월(늦었지만 발행) */
    tier: number;
    distance: number;
    priority: number;
    index: number;
}

function rankCandidate(entry: KeywordEntry, index: number, currentMonth: number): RankedCandidate | null {
    const priority = Number.isFinite(entry.priority) ? entry.priority : 9;
    const peak = peakMonthOf(entry);
    if (peak === null) return { entry, tier: 1, distance: 0, priority, index };
    const distance = monthsAhead(peak, currentMonth);
    if (distance === 1 || distance === 2) return { entry, tier: 0, distance, priority, index };
    if (distance === 0) return { entry, tier: 2, distance, priority, index };
    return null; // 시즌이 아직 멀거나 지났음 → 다음 창까지 대기
}

function compareCandidates(a: RankedCandidate, b: RankedCandidate): number {
    return a.tier - b.tier || a.distance - b.distance || a.priority - b.priority || a.index - b.index;
}

interface SelectionResult {
    chosen: KeywordEntry | null;
    /** 발행 가능했지만 중복으로 건너뛴 항목 (로그용) */
    skipped: { entry: KeywordEntry; reason: string }[];
    pendingCount: number;
}

function selectKeyword(
    file: KeywordFile,
    currentMonth: number,
    existing: { slug: string; title: string }[]
): SelectionResult {
    const existingSlugs = new Set(existing.map(p => p.slug));
    const existingTitles = existing.map(p => p.title).filter(Boolean);

    const pending = file.keywords
        .map((entry, index) => ({ entry, index }))
        .filter(({ entry }) => entry && entry.status !== "done" && typeof entry.slug === "string" && entry.slug);

    const ranked = pending
        .map(({ entry, index }) => rankCandidate(entry, index, currentMonth))
        .filter((c): c is RankedCandidate => c !== null)
        .sort(compareCandidates);

    const skipped: SelectionResult["skipped"] = [];
    for (const candidate of ranked) {
        const { entry } = candidate;
        if (existingSlugs.has(entry.slug)) {
            skipped.push({ entry, reason: `slug 파일이 이미 존재: ${entry.slug}.json` });
            continue;
        }
        if (isCoveredByExistingTitle(entry.keyword, existingTitles)) {
            skipped.push({ entry, reason: "기존 글 제목이 키워드를 이미 포함" });
            continue;
        }
        return { chosen: entry, skipped, pendingCount: pending.length };
    }
    return { chosen: null, skipped, pendingCount: pending.length };
}

// ---------------------------------------------------------------------------
// 콘텐츠 후처리 (순수 함수)
// ---------------------------------------------------------------------------

const TABLE_MARKER = "[[TABLE]]";
const NUMBERED_HEADING = /^##\s*\d+[.)]/;

function escapeHtml(text: string): string {
    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** 쿠팡/쇼핑 링크와 스크립트를 제거 (본문은 dangerouslySetInnerHTML 로 렌더링됨) */
function sanitizeText(text: string): string {
    return String(text ?? "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<a\b[^>]*(coupang\.com|coupa\.ng)[^>]*>([\s\S]*?)<\/a>/gi, "$2")
        .replace(/https?:\/\/(?:[\w.-]*\.)?(?:coupang\.com|coupa\.ng)[^\s<)]*/gi, "")
        .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
        .trim();
}

function normalizeTable(raw: unknown): ComparisonTable | null {
    if (!raw || typeof raw !== "object") return null;
    const table = raw as { caption?: unknown; headers?: unknown; rows?: unknown };
    const headers = Array.isArray(table.headers)
        ? table.headers.filter((h): h is string => typeof h === "string").map(h => h.trim())
        : [];
    const rows = Array.isArray(table.rows)
        ? table.rows
            .filter((row): row is unknown[] => Array.isArray(row))
            .map(row => row.map(cell => (typeof cell === "string" ? cell.trim() : String(cell ?? ""))))
            .filter(row => row.some(cell => cell.length > 0))
        : [];
    if (headers.length < 2 || rows.length === 0) return null;
    return {
        caption: typeof table.caption === "string" && table.caption.trim() ? table.caption.trim() : undefined,
        headers,
        rows,
    };
}

/**
 * 비교표를 HTML 문자열로 만든다. BlogPostClient 는 '<div' 로 시작하는 문단을 HTML 로 렌더링한다.
 * Tailwind 는 JSON 안의 클래스를 스캔하지 않으므로 인라인 스타일을 함께 넣는다.
 */
function renderTableHtml(table: ComparisonTable): string {
    const cell = "padding:0.6rem 0.75rem;border:1px solid rgba(128,128,128,0.35);text-align:left;vertical-align:top";
    const head = `${cell};font-weight:600;background:rgba(128,128,128,0.12);white-space:nowrap`;
    const caption = table.caption
        ? `<caption style="caption-side:top;text-align:left;font-weight:600;margin-bottom:0.5rem">${escapeHtml(table.caption)}</caption>`
        : "";
    const thead = `<thead><tr>${table.headers.map(h => `<th scope="col" style="${head}">${escapeHtml(h)}</th>`).join("")}</tr></thead>`;
    const tbody = `<tbody>${table.rows
        .map(row => `<tr>${table.headers.map((_, i) => `<td style="${cell}">${escapeHtml(row[i] ?? "")}</td>`).join("")}</tr>`)
        .join("")}</tbody>`;
    return `<div class="overflow-x-auto" style="overflow-x:auto;margin:1.5rem 0"><table style="width:100%;min-width:480px;border-collapse:collapse;font-size:0.95rem">${caption}${thead}${tbody}</table></div>`;
}

/** 본문 배열 정리: 문자열만, 공백 제거, 링크 제거, [[TABLE]] 마커 자리에 표 삽입 (표는 하나만) */
function buildContent(rawContent: unknown, table: ComparisonTable | null): string[] {
    const content = (Array.isArray(rawContent) ? rawContent : [])
        .filter((p): p is string => typeof p === "string")
        .map(sanitizeText)
        .filter(p => p.length > 0);

    const alreadyHasTable = content.some(p => /<table\b/i.test(p));
    const tableHtml = table && !alreadyHasTable ? renderTableHtml(table) : null;

    const result: string[] = [];
    let inserted = false;
    for (const paragraph of content) {
        if (paragraph.includes(TABLE_MARKER)) {
            const rest = paragraph.replace(TABLE_MARKER, "").trim();
            if (tableHtml && !inserted) {
                result.push(tableHtml);
                inserted = true;
            }
            if (rest) result.push(rest);
            continue;
        }
        if (/<table\b/i.test(paragraph) && !/^<div/i.test(paragraph)) {
            // 모델이 표를 직접 넣었으면 가로 스크롤 래퍼만 씌운다
            result.push(`<div class="overflow-x-auto" style="overflow-x:auto;margin:1.5rem 0">${paragraph}</div>`);
            continue;
        }
        result.push(paragraph);
    }

    if (tableHtml && !inserted) {
        // 마커가 없으면 첫 소제목 앞(인트로 뒤)에 넣는다
        const firstHeading = result.findIndex(p => p.startsWith("## "));
        const at = firstHeading > 0 ? firstHeading : Math.min(1, result.length);
        result.splice(at, 0, tableHtml);
    }
    return result;
}

function buildFaq(raw: unknown, max = 5): FaqItem[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter((item): item is { q: unknown; a: unknown } => !!item && typeof item === "object")
        .map(item => ({ q: sanitizeText(String(item.q ?? "")), a: sanitizeText(String(item.a ?? "")) }))
        .filter(item => item.q.length > 0 && item.a.length > 0)
        .slice(0, max);
}

function cleanHeading(heading: string): string {
    return heading
        .replace(/^##\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .replace(/[\p{Extended_Pictographic}️]/gu, "")
        .trim();
}

/**
 * 상품 키워드를 본문의 "## " 소제목 순서와 1:1 로 맞춘다.
 * BlogPostClient 는 i 번째 소제목 아래에 productKeywords[i] 의 상품 카드를 붙이므로,
 * 번호 섹션("## N.")에는 큐/모델 키워드를, 그 사이에 끼어든 다른 소제목에는 소제목 텍스트를 넣어 인덱스를 유지한다.
 * 마지막 번호 섹션 뒤(팁 섹션 등)에는 키워드를 붙이지 않는다.
 */
function alignProductKeywords(content: string[], queueKeywords: string[], modelKeywords: unknown): string[] {
    const headings = content.filter(p => p.startsWith("## "));
    let lastNumbered = -1;
    headings.forEach((h, i) => { if (NUMBERED_HEADING.test(h)) lastNumbered = i; });
    if (lastNumbered < 0) return [];

    const fromModel = Array.isArray(modelKeywords)
        ? modelKeywords.filter((k): k is string => typeof k === "string").map(k => k.trim()).filter(Boolean)
        : [];
    const fromQueue = queueKeywords.map(k => (k || "").trim()).filter(Boolean);

    const aligned: string[] = [];
    let n = 0;
    for (const heading of headings.slice(0, lastNumbered + 1)) {
        if (NUMBERED_HEADING.test(heading)) {
            aligned.push(fromQueue[n] ?? fromModel[n] ?? cleanHeading(heading));
            n += 1;
        } else {
            aligned.push(cleanHeading(heading));
        }
    }
    return aligned;
}

function countHangul(content: string[]): number {
    return content.reduce((sum, p) => sum + (p.match(/[가-힣]/g) || []).length, 0);
}

function normalizeLocale(raw: unknown, fallbackCategory: string): LocaleData | null {
    if (!raw || typeof raw !== "object") return null;
    const data = raw as Record<string, unknown>;
    const title = typeof data.title === "string" ? sanitizeText(data.title) : "";
    const content = buildContent(data.content, normalizeTable(data.table));
    if (!title || content.length === 0) return null;
    return {
        title,
        excerpt: typeof data.excerpt === "string" ? sanitizeText(data.excerpt) : "",
        category: typeof data.category === "string" && data.category.trim() ? data.category.trim() : fallbackCategory,
        readTime: typeof data.readTime === "string" ? data.readTime.trim() : "",
        content,
        faq: buildFaq(data.faq),
    };
}

/** 모델 출력에서 JSON 을 꺼낸다 (백틱 펜스 제거 → 실패 시 첫 '{' ~ 마지막 '}' 구간 재시도) */
function parseModelJson(text: string): unknown {
    const cleaned = (text || "").replace(/```json/gi, "").replace(/```/g, "").trim();
    try {
        return JSON.parse(cleaned);
    } catch (firstError) {
        const start = cleaned.indexOf("{");
        const end = cleaned.lastIndexOf("}");
        if (start >= 0 && end > start) {
            return JSON.parse(cleaned.slice(start, end + 1));
        }
        throw firstError;
    }
}

// ---------------------------------------------------------------------------
// 프롬프트
// ---------------------------------------------------------------------------

interface PromptInput {
    topic: string;
    dateStr: string;
    entry?: KeywordEntry;
    existingTitles: string[];
}

function buildBlogPrompt({ topic, dateStr, entry, existingTitles }: PromptInput): string {
    const queueKeywords = (entry?.productKeywords || []).map(k => k.trim()).filter(Boolean);
    const sectionCount = Math.min(7, Math.max(5, queueKeywords.length || 6));
    const category = entry?.category || "선물 팁";

    const targetBlock = entry
        ? `- 타깃 검색 키워드: "${entry.keyword}" (이 키워드로 검색한 사람이 만족해야 합니다)
- 받는 사람: ${entry.receiver} / 상황: ${entry.occasion} / 카테고리: ${category}
- 검색 의도·이기는 포맷 메모: ${entry.intent}`
        : `- 주제: "${topic}"
- 카테고리: 생일, 기념일, 집들이, 직장, 결혼/출산, 명절, 시즌, 선물 팁 중 가장 맞는 것 1개`;

    const sectionKeywordBlock = queueKeywords.length > 0
        ? `- 섹션별 상품 키워드 (아래 순서 그대로 "## N." 섹션 ${sectionCount}개를 만드세요. 섹션 제목은 이 상품유형을 자연스럽게 담되 순서를 바꾸지 마세요):
${queueKeywords.slice(0, sectionCount).map((k, i) => `  ${i + 1}. ${k}`).join("\n")}`
        : `- 상품유형 ${sectionCount}개를 직접 정해 "## N." 섹션을 만들고, 각 섹션에 해당하는 쿠팡 검색어(한국어 2~4어절, 예: "남자 향수", "무선 이어폰")를 productKeywords 배열에 같은 순서로 넣으세요.`;

    const titlesBlock = existingTitles.length > 0
        ? existingTitles.map(t => `- ${t}`).join("\n")
        : "- (없음)";

    return `당신은 한국 선물 추천 사이트 "선물지니"의 SEO 콘텐츠 에디터입니다. 아래 정보로 검색 상위 노출을 노리는 선물 추천 글을 작성하세요.

## 타깃 정보
${targetBlock}
- 발행일: ${dateStr}
${sectionKeywordBlock}

## 이미 발행한 글 제목 (제목·구성이 겹치지 않게 다른 각도로 쓰세요)
${titlesBlock}

## 한국어(ko) 작성 규칙
1. title: 타깃 키워드(또는 주제)의 핵심 단어를 자연스럽게 포함한 20~45자 제목. 키워드를 억지로 반복하지 말고 사람이 쓴 제목처럼. (예: "30대 남자친구 생일선물 추천 TOP 7, 실패 없는 실용템만 모았다")
2. 분량: ko.content 전체를 합쳐 한글 기준 ${TARGET_KO_CHARS.min}~${TARGET_KO_CHARS.max}자.
3. content 배열 구성 (이 순서 그대로, 원소는 전부 문자열):
   - 인트로 문단 1~2개. 첫 문단에 이 글이 누구를 위한 것인지(주는 사람·받는 사람·상황)와 다루는 가격대를 분명히 씁니다.
   - "${TABLE_MARKER}" 라는 문자열 1개 (비교표 자리. 시스템이 table 필드로 표를 만들어 넣습니다)
   - "## N. 상품유형" 소제목 ${sectionCount}개 (N 은 1부터 순서대로, 예: "## 1. 실버 목걸이 — 매일 하는 데일리 주얼리"). 각 섹션은 설명 문단 1~2개 뒤에 아래 3줄을 각각 별도 문자열로 넣습니다:
       "**실용성:** 왜 실제로 쓰게 되는지"
       "**누구에게:** 어떤 취향·상황의 사람에게 맞는지"
       "**가격대:** 약 ○만원대 (범위로)"
   - "## 💡 선물 고르기 팁" 소제목 1개와 실패를 줄이는 팁 문단 2~3개 (구매 타이밍, 포장/카드, 피해야 할 선물 등)
   - 짧은 마무리 문단 1개 (구매 강요 없이)
   - 위 소제목 외에 다른 "## " 소제목을 추가하지 마세요.
4. table: { "caption": "…한눈에 비교", "headers": ["상품유형", "가격대", "이런 분께", "한 줄 특징"], "rows": [[...], ...] } — 행은 "## N." 섹션과 같은 순서·개수.
5. faq: 이 키워드로 검색하는 사람이 실제로 묻는 질문 3개, [{ "q": "...", "a": "..." }]. 답변은 2~4문장으로 구체적으로. (예: 적정 예산, 언제 사야 하는지, 피해야 할 것)
6. category: "${category}" 그대로. readTime: 분량 기준 "6분" 형식. excerpt: 검색 결과에 보일 80~150자 요약, 키워드 포함.
7. productKeywords: 섹션별 상품 키워드를 "## N." 순서 그대로 ${sectionCount}개 배열로 (최상위 필드).

## 금지·주의
- 쿠팡 등 쇼핑몰 링크·URL·특정 판매처 언급 금지. 시스템이 상품 카드를 자동으로 붙입니다.
- 가격을 정확한 숫자로 단정하지 마세요. "약", "~만원대", "~선"처럼 범위로만 씁니다. 브랜드명은 언급해도 되지만 가격 단정은 금지.
- 의학적 효능 단정, "최고", "무조건", "1위 보장" 같은 절대 표현 금지. 건강 제품은 "도움이 될 수 있다" 수준으로.
- 출처 없는 통계·설문 수치, 가짜 후기, 특정 인물·기업 비방 금지.
- 소제목은 "## "로 시작, 강조는 **텍스트**. 마크다운 목록("- ", "1. ")과 HTML 태그는 본문에 넣지 마세요 (표는 table 필드로).

## 영어(en)·일본어(ja)
- ko 와 같은 구조로 자연스럽게 번역합니다: title, excerpt, category, readTime, content, table, faq 모두. "${TABLE_MARKER}" 마커와 "## N." 번호, "**실용성:**" 3줄 형식을 유지하세요.
- 가격은 원화 기준을 유지해 표기합니다 (en: "around 50,000 KRW", ja: "約5万ウォン").
- category 는 en 은 영어(예: Birthday, Anniversary, Housewarming, Workplace, Wedding & Baby, Holidays, Seasonal, Gift Tips), ja 는 일본어로.

## 출력 형식
설명이나 마크다운 펜스 없이 아래 형태의 JSON 객체 하나만 출력하세요. 반드시 파싱 가능해야 합니다.
{
  "ko": { "title": "", "excerpt": "", "category": "", "readTime": "", "content": ["..."], "table": { "caption": "", "headers": [], "rows": [[]] }, "faq": [{ "q": "", "a": "" }] },
  "en": { ...같은 구조... },
  "ja": { ...같은 구조... },
  "productKeywords": ["..."]
}`;
}

// ---------------------------------------------------------------------------
// 주제 결정
// ---------------------------------------------------------------------------

async function resolveTrendingTopic(
    dateStr: string,
    existingPosts: { slug: string; title: string }[]
): Promise<TopicPlan | null> {
    const existingTitles = existingPosts.map(p => `- ${p.title}`).join("\n");

    // 이미 발행한 글 목록 — 같은 주제를 반복 생성하지 않도록 프롬프트에 전달
    // (중복 주제가 쌓이면 검색엔진이 서로 순위를 갉아먹는 키워드 카니벌리제이션이 발생하고,
    //  구글/애드센스의 '가치 낮은 반복 콘텐츠' 평가 위험이 커진다)
    const topicPrompt = `
    오늘 날짜는 ${dateStr}입니다.
    "선물 추천" 블로그에서 다룰 새 글 주제를 딱 1개 정해주세요.

    ## 이미 발행한 글 목록 (아래 주제와 겹치거나 비슷한 주제는 절대 금지)
${existingTitles}

    ## 주제 선정 규칙
    - 위 목록과 소재/키워드/대상이 겹치는 주제는 선택하지 마세요. (예: 이미 '추석 부모님 선물' 글이 많다면 그 변형도 금지)
    - 연중 꾸준히 검색되는 에버그린 주제(여자친구 생일선물, 남자친구 선물, 부모님 생신, 100일/1주년 기념일, 집들이, 결혼/출산 선물, 예산별 선물 등)를 우선하되,
      4~8주 안에 다가오는 기념일/시즌이 있으면 그것도 고려하세요.
    - 검색량이 높을 법한 구체적 키워드를 포함하세요. (대상 + 상황 + 특징, 예: 20대 여자친구 100일 기념 센스있는 선물)
    아무 부연 설명 없이 딱 주제 1문장만 출력하세요.
    `;

    console.log("Asking Gemini for trending topic...");
    const topicRes = await genAI!.models.generateContent({
        model: MODEL,
        contents: [{ role: "user", parts: [{ text: topicPrompt }] }],
        config: {
            tools: [{ googleSearch: {} }],
        }
    });

    const topic = topicRes.text?.trim() || "20대 커플을 위한 트렌디한 가성비 선물";
    console.log(`[Target Topic]: ${topic}`);

    if (isCoveredByExistingTitle(topic, existingPosts.map(p => p.title))) {
        console.log("[Duplicate Topic]: an existing post already covers this topic. Skipping this run.");
        return null;
    }

    // Generate Slug from topic
    const slugPrompt = `"${topic}" 에 어울리는 영문 URL slug를 만들어주세요. (예: parents-day-gifts-2026, summer-vacation-gifts). 특수문자 없이 소문자와 하이픈(-)만 사용해서 딱 단어만 출력하세요.`;
    const slugRes = await genAI!.models.generateContent({
        model: MODEL,
        contents: slugPrompt
    });
    const rawSlug = slugRes.text?.trim()?.toLowerCase() || "";
    const slug = rawSlug.replace(/[^a-z0-9-]/g, "").replace(/^-+|-+$/g, "") || `gift-guide-${Date.now()}`;

    // 슬러그 충돌 시 기존 글을 덮어쓰지 않도록 방어
    if (existingPosts.some(p => p.slug === slug)) {
        console.log(`[Duplicate Slug]: ${slug} already exists. Skipping this run to avoid duplicate content.`);
        return null;
    }
    return { source: "trending", topic, slug };
}

async function resolveTopic(
    keywordFile: KeywordFile | null,
    month: number,
    dateStr: string,
    existingPosts: { slug: string; title: string }[]
): Promise<TopicPlan | null> {
    if (keywordFile) {
        const { chosen, skipped, pendingCount } = selectKeyword(keywordFile, month, existingPosts);
        for (const { entry, reason } of skipped) {
            console.log(`[Skip] ${entry.slug} — ${reason}`);
        }
        if (chosen) {
            const peak = peakMonthOf(chosen);
            const why = peak === null
                ? `evergreen, priority ${chosen.priority}`
                : `seasonal, peak month ${peak} (${monthsAhead(peak, month)} month(s) ahead), priority ${chosen.priority}`;
            console.log(`[Queue] ${pendingCount} pending → picked "${chosen.keyword}" (${chosen.slug}; ${why})`);
            return { source: "queue", topic: chosen.keyword, slug: chosen.slug, entry: chosen };
        }
        console.log(`[Queue] ${pendingCount} pending but none publishable this month → falling back to trending topic`);
    } else {
        console.log("[Queue] keywords.json not found → falling back to trending topic");
    }
    if (SELECT_ONLY) return null;
    return resolveTrendingTopic(dateStr, existingPosts);
}

// ---------------------------------------------------------------------------
// 생성
// ---------------------------------------------------------------------------

interface GeneratedPost {
    ko: LocaleData;
    en: LocaleData | null;
    ja: LocaleData | null;
    productKeywords: string[];
}

async function generatePost(plan: TopicPlan, dateStr: string, existingTitles: string[]): Promise<GeneratedPost> {
    const basePrompt = buildBlogPrompt({ topic: plan.topic, dateStr, entry: plan.entry, existingTitles });
    const queueKeywords = plan.entry?.productKeywords || [];
    let lastRaw = "";
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= MAX_GENERATION_ATTEMPTS; attempt++) {
        const prompt = attempt === 1
            ? basePrompt
            : `${basePrompt}\n\n(이전 출력이 유효하지 않았습니다: ${String(lastError)}. 규칙을 다시 확인하고 순수 JSON 만 출력하세요.)`;

        console.log(`Generating multi-language blog post (attempt ${attempt}/${MAX_GENERATION_ATTEMPTS})...`);
        const blogRes = await genAI!.models.generateContent({
            model: MODEL,
            contents: prompt,
            config: { responseMimeType: "application/json" },
        });
        lastRaw = blogRes.text || "{}";

        try {
            const data = parseModelJson(lastRaw) as Record<string, unknown>;
            const fallbackCategory = plan.entry?.category || "선물 팁";
            const ko = normalizeLocale(data.ko, fallbackCategory);
            if (!ko) throw new Error("ko.title / ko.content 가 없습니다");

            const hangul = countHangul(ko.content);
            if (hangul < MIN_ACCEPTABLE_KO_CHARS) {
                throw new Error(`ko 본문이 너무 짧습니다 (한글 ${hangul}자 < ${MIN_ACCEPTABLE_KO_CHARS})`);
            }
            if (hangul < TARGET_KO_CHARS.min || hangul > TARGET_KO_CHARS.max) {
                console.warn(`[Warn] ko 본문 한글 ${hangul}자 — 목표 ${TARGET_KO_CHARS.min}~${TARGET_KO_CHARS.max}자 범위 밖`);
            } else {
                console.log(`[Length] ko 본문 한글 ${hangul}자`);
            }
            if (!ko.content.some(p => /<table\b/i.test(p))) console.warn("[Warn] 비교표가 생성되지 않았습니다");
            if (ko.faq.length < 3) console.warn(`[Warn] FAQ 가 ${ko.faq.length}개뿐입니다 (목표 3개)`);

            const productKeywords = alignProductKeywords(ko.content, queueKeywords, data.productKeywords);
            if (productKeywords.length === 0) console.warn("[Warn] 번호 섹션(## N.)이 없어 상품 키워드를 정렬하지 못했습니다");

            const en = normalizeLocale(data.en, "Gift Tips");
            const ja = normalizeLocale(data.ja, "ギフトのヒント");
            if (!en) console.warn("[Warn] en 번역이 없습니다 — 페이지는 ko 로 폴백됩니다");
            if (!ja) console.warn("[Warn] ja 번역이 없습니다 — 페이지는 ko 로 폴백됩니다");

            return { ko, en, ja, productKeywords };
        } catch (err) {
            lastError = err;
            console.error(`Attempt ${attempt} failed:`, (err as Error).message || err);
        }
    }

    console.error("Failed to parse AI output as JSON:", lastError);
    console.error("Raw Output:", lastRaw);
    process.exit(1);
}

// ---------------------------------------------------------------------------
// 자체 테스트 (API 호출 없음)
// ---------------------------------------------------------------------------

function selfTest(): void {
    const assert = (cond: unknown, msg: string) => { if (!cond) throw new Error(`self-test failed: ${msg}`); };

    // 중복 제목 가드
    assert(isCoveredByExistingTitle("집들이 선물 추천", ["집들이 선물 추천 리스트 10가지"]), "covered title");
    assert(!isCoveredByExistingTitle("남자친구 생일선물 추천 30대", ["20대 남자친구 생일 선물 추천 TOP 10"]), "30대 not covered");

    // 시즌 창
    assert(monthsAhead(12, 10) === 2 && monthsAhead(1, 12) === 1 && monthsAhead(9, 9) === 0 && monthsAhead(2, 3) === 11, "monthsAhead");
    const mk = (slug: string, season: string, priority: number): KeywordEntry => ({
        keyword: slug, slug, receiver: "", occasion: "", category: "", season, priority, intent: "", productKeywords: [], status: "pending",
    });
    const file: KeywordFile = { updatedAt: "", keywords: [mk("ever-p2", "evergreen", 2), mk("xmas", "12", 1), mk("ever-p1", "evergreen", 1), mk("valentine", "2", 1), mk("chuseok", "9", 1)] };
    assert(selectKeyword(file, 10, []).chosen?.slug === "xmas", "October picks Christmas (2 months ahead)");
    assert(selectKeyword(file, 6, []).chosen?.slug === "ever-p1", "June picks evergreen priority 1");
    assert(selectKeyword(file, 9, []).chosen?.slug === "ever-p1", "September: peak-month seasonal ranks below evergreen");
    const onlyLate: KeywordFile = { updatedAt: "", keywords: [mk("chuseok", "9", 1)] };
    assert(selectKeyword(onlyLate, 9, []).chosen?.slug === "chuseok", "peak month still publishes when nothing else");
    assert(selectKeyword(onlyLate, 5, []).chosen === null, "out-of-season → null (fallback)");
    assert(selectKeyword(file, 10, [{ slug: "xmas", title: "" }]).chosen?.slug === "ever-p1", "existing slug skipped");

    // 표 + 마커 + 키워드 정렬
    const table = normalizeTable({ caption: "비교", headers: ["상품유형", "가격대"], rows: [["실버 목걸이", "약 5만원대"], ["향수 <b>", "약 8만원대"]] });
    assert(table && table.rows.length === 2, "table normalized");
    const content = buildContent(
        ["인트로", TABLE_MARKER, "## 1. 실버 목걸이", "설명", "**실용성:** 매일", "## 2. 향수", "설명 https://link.coupang.com/a/xyz 끝", "## 💡 선물 고르기 팁", "팁"],
        table
    );
    assert(content[1].startsWith('<div class="overflow-x-auto"') && content[1].includes("&lt;b&gt;"), "table html inserted + escaped");
    assert(content.filter(p => /<table\b/.test(p)).length === 1, "exactly one table");
    assert(!content.some(p => p.includes("coupang")), "coupang url stripped");
    const aligned = alignProductKeywords(content, ["실버 목걸이", "여자 향수"], null);
    assert(aligned.length === 2 && aligned[1] === "여자 향수", "aligned to numbered sections only");
    const alignedModel = alignProductKeywords(content, [], ["a", "b"]);
    assert(alignedModel.join(",") === "a,b", "model keywords used when queue empty");
    const noMarker = buildContent(["인트로", "## 1. A", "설명"], table);
    assert(noMarker[1].startsWith("<div"), "table inserted before first heading when marker missing");
    assert(countHangul(["가나다 abc", "라"]) === 4, "countHangul");

    console.log("self-test: all assertions passed");
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

async function main() {
    if (SELF_TEST) {
        selfTest();
        return;
    }

    console.log("Starting Auto-Blog Generation Cron Job...");

    // 1. 날짜 (KST 기준 — 사이트 독자와 발행일을 맞춘다. AUTOBLOG_DATE 로 가장 가능)
    const now = process.env.AUTOBLOG_DATE
        ? new Date(`${process.env.AUTOBLOG_DATE}T09:00:00+09:00`)
        : new Date();
    if (Number.isNaN(now.getTime())) {
        console.error(`ERROR: invalid AUTOBLOG_DATE "${process.env.AUTOBLOG_DATE}" (expected YYYY-MM-DD)`);
        process.exit(1);
    }
    const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const dateStr = kst.toISOString().split("T")[0];
    const month = kst.getUTCMonth() + 1;
    console.log(`[Date] ${dateStr} (KST), month ${month}`);

    // 2. 기존 글 + 키워드 큐 → 주제 결정
    const existingPosts = getExistingPosts();
    const keywordFile = readKeywordFile();
    const plan = await resolveTopic(keywordFile, month, dateStr, existingPosts);

    if (!plan) {
        console.log("Nothing to publish this run.");
        return;
    }
    console.log(`[Target Topic]: ${plan.topic}`);
    console.log(`[Target Slug]: ${plan.slug} (source: ${plan.source})`);

    if (existingPosts.some(p => p.slug === plan.slug)) {
        console.log(`[Duplicate Slug]: ${plan.slug} already exists. Skipping this run to avoid duplicate content.`);
        return;
    }

    if (SELECT_ONLY) {
        if (plan.entry) {
            console.log(`[Select-only] productKeywords: ${plan.entry.productKeywords.join(", ")}`);
        }
        console.log("[Select-only] no API calls or writes were made.");
        return;
    }

    // 3. Pexels 썸네일 컨셉
    const imgConceptRes = await genAI!.models.generateContent({
        model: MODEL,
        contents: `주제: "${plan.topic}". 이 주제에 가장 어울리는 아름다운 스톡 사진을 찾기 위한 영어 검색어(최대 3단어)를 알려주세요. 예: luxury gift box, red rose, cozy livingroom`
    });
    const pexelsQuery = imgConceptRes.text?.trim().split("\n")[0] || "gift box";
    console.log(`[Pexels Query]: ${pexelsQuery}`);

    const bannerImage = await fetchThumbnailFromPexels(pexelsQuery);

    // 4. 본문 생성 (ko + en/ja + 표 + FAQ + 상품 키워드)
    const existingTitles = existingPosts.map(p => p.title).filter(Boolean);
    const generated = await generatePost(plan, dateStr, existingTitles);

    // 5. 포스트 JSON 저장 (기존 스키마 + 최상위 faq / productKeywords)
    const finalJson = {
        id: plan.slug,
        date: dateStr,
        image: bannerImage,
        productKeywords: generated.productKeywords,
        faq: generated.ko.faq,
        ko: generated.ko,
        ...(generated.en ? { en: generated.en } : {}),
        ...(generated.ja ? { ja: generated.ja } : {}),
    };

    if (!fs.existsSync(POSTS_DIR)) fs.mkdirSync(POSTS_DIR, { recursive: true });
    const outPath = path.join(POSTS_DIR, `${plan.slug}.json`);
    fs.writeFileSync(outPath, JSON.stringify(finalJson, null, 2), "utf8");
    console.log(`✅ Successfully created new blog post: ${outPath}`);

    // 6. 큐 갱신 — 큐에서 고른 경우에만 done 처리
    if (plan.source === "queue" && keywordFile && plan.entry) {
        const target = keywordFile.keywords.find(k => k.slug === plan.entry!.slug);
        if (target) {
            target.status = "done";
            target.publishedSlug = plan.slug;
            target.publishedAt = dateStr;
        }
        keywordFile.updatedAt = dateStr;
        writeKeywordFile(keywordFile);
        const remaining = keywordFile.keywords.filter(k => k.status !== "done").length;
        console.log(`[Queue] marked ${plan.slug} as done (${remaining} pending left)`);
    }
}

main().catch(err => {
    console.error("Fatal Error:", err);
    process.exit(1);
});
