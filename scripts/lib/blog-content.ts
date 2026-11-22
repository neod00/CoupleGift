/**
 * 블로그 포스트 JSON 콘텐츠 공용 헬퍼 (순수 함수, API 호출 없음)
 * - scripts/auto-blog-cron.ts : Gemini 출력 정리
 * - scripts/apply-localized-posts.ts : 사람/에이전트가 쓴 en·ja 현지화본 검증·병합
 */
export interface ComparisonTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface LocaleData {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  content: string[];
  faq: FaqItem[];
}

export const TABLE_MARKER = "[[TABLE]]";

export function escapeHtml(text: string): string {
    return String(text ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

/** 쿠팡/쇼핑 링크와 스크립트를 제거 (본문은 dangerouslySetInnerHTML 로 렌더링됨) */
export function sanitizeText(text: string): string {
    return String(text ?? "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<a\b[^>]*(coupang\.com|coupa\.ng)[^>]*>([\s\S]*?)<\/a>/gi, "$2")
        .replace(/https?:\/\/(?:[\w.-]*\.)?(?:coupang\.com|coupa\.ng)[^\s<)]*/gi, "")
        .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*')/gi, "")
        .trim();
}

export function normalizeTable(raw: unknown): ComparisonTable | null {
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
export function renderTableHtml(table: ComparisonTable): string {
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
export function buildContent(rawContent: unknown, table: ComparisonTable | null): string[] {
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

export function buildFaq(raw: unknown, max = 5): FaqItem[] {
    if (!Array.isArray(raw)) return [];
    return raw
        .filter((item): item is { q: unknown; a: unknown } => !!item && typeof item === "object")
        .map(item => ({ q: sanitizeText(String(item.q ?? "")), a: sanitizeText(String(item.a ?? "")) }))
        .filter(item => item.q.length > 0 && item.a.length > 0)
        .slice(0, max);
}

/**
 * en/ja 가 한국어 글을 직역한 흔적(원화 가격, 브랜드 음역)을 찾는다.
 * 2026-11 Search Console 에서 미국 노출 113회·클릭 0 — 영어 글에 "30,000 KRW" 가 100번씩 나온 것이 원인이었다.
 */
export function findUnlocalized(data: LocaleData | null): string[] {
    if (!data) return [];
    const text = [data.title, data.excerpt, ...data.content, ...data.faq.flatMap(f => [f.q, f.a])].join("\n");
    const issues: string[] = [];
    if (/KRW|\d\s*won\b|ウォン|만원/i.test(text)) issues.push("원화 가격 표기");
    if (/Seonmul|ソンムル/i.test(text)) issues.push("브랜드 음역(Seonmul)");
    if (/[가-힣]{2,}/.test(text)) issues.push("한글 잔존");
    return issues;
}

export function countHangul(content: string[]): number {
    return content.reduce((sum, p) => sum + (p.match(/[가-힣]/g) || []).length, 0);
}

export function normalizeLocale(raw: unknown, fallbackCategory: string): LocaleData | null {
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
