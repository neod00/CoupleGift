/**
 * 사람/에이전트가 직접 쓴 새 블로그 글(JSON)을 검증하고, --write 면 src/data/blog/posts 에 정규화해 저장한다.
 * (Gemini 자동 발행과 같은 형식·규칙을 지키게 하기 위한 도구)
 *
 *   npx tsx scripts/check-new-post.ts <file.json>           # 검증만
 *   npx tsx scripts/check-new-post.ts <file.json> --write   # 통과하면 posts/<id>.json 으로 저장 (기존 파일 덮어쓰기 금지)
 *
 * 입력 형식: { id, date, image, productKeywords?, ko?, en?, ja? }
 *   각 로케일 = { title, excerpt, category, readTime, content: string[] ("[[TABLE]]" 자리 표시), table?, faq }
 * 규칙: 로케일 간 "## " 소제목 수 동일, 표 1개(있다면 모든 로케일), FAQ 3개 이상,
 *       ko 한글 1,000자 이상, ko 번호 섹션 수 = productKeywords 수, en/ja 현지화 위반 없음.
 */
import fs from "fs";
import path from "path";
import { countHangul, findUnlocalized, normalizeLocale, type LocaleData } from "./lib/blog-content";

const file = process.argv[2];
const WRITE = process.argv.includes("--write");
if (!file || !fs.existsSync(file)) {
    console.error("usage: npx tsx scripts/check-new-post.ts <file.json> [--write]");
    process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(file, "utf8"));
const errors: string[] = [];
const fallback: Record<string, string> = { ko: "선물 팁", en: "Gift Tips", ja: "ギフトのヒント" };
const locales: Record<string, LocaleData> = {};

if (!/^[a-z0-9-]+$/.test(raw.id || "")) errors.push(`id 가 slug 형식이 아님: "${raw.id}"`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(raw.date || "")) errors.push(`date 형식 오류: "${raw.date}"`);

for (const loc of ["ko", "en", "ja"]) {
    if (raw[loc] === undefined) continue;
    const data = normalizeLocale(raw[loc], fallback[loc]);
    if (!data) { errors.push(`${loc}: title/content 없음`); continue; }
    locales[loc] = data;
    if (data.faq.length < 3) errors.push(`${loc}: FAQ ${data.faq.length}개 (3개 이상)`);
    if (!data.excerpt) errors.push(`${loc}: excerpt 없음`);
    if (loc !== "ko") for (const issue of findUnlocalized(data)) errors.push(`${loc}: ${issue}`);
}
if (Object.keys(locales).length === 0) errors.push("ko/en/ja 중 하나도 없음");

const headings = (d: LocaleData) => d.content.filter(p => p.startsWith("## ")).length;
const tables = (d: LocaleData) => d.content.filter(p => /<table\b/i.test(p)).length;
const entries = Object.entries(locales);
if (entries.length > 1) {
    const [firstLoc, first] = entries[0];
    for (const [loc, d] of entries.slice(1)) {
        if (headings(d) !== headings(first)) errors.push(`${loc}: 소제목 ${headings(d)}개 (${firstLoc} 는 ${headings(first)}개)`);
    }
}
for (const [loc, d] of entries) if (tables(d) > 1) errors.push(`${loc}: 표가 ${tables(d)}개`);
if (entries.some(([, d]) => tables(d) === 1) && entries.some(([, d]) => tables(d) === 0)) errors.push("일부 언어에만 비교표가 있음");

if (locales.ko) {
    const hangul = countHangul(locales.ko.content);
    if (hangul < 1000) errors.push(`ko 본문 한글 ${hangul}자 (1,000자 이상)`);
    const numbered = locales.ko.content.filter(p => /^##\s*\d+[.)]/.test(p)).length;
    const kw = Array.isArray(raw.productKeywords) ? raw.productKeywords.length : 0;
    if (kw !== numbered) errors.push(`productKeywords ${kw}개 ≠ ko 번호 섹션 ${numbered}개`);
}

const outPath = path.join(process.cwd(), "src", "data", "blog", "posts", `${raw.id}.json`);
if (WRITE && fs.existsSync(outPath)) errors.push(`이미 존재하는 글: ${outPath}`);

if (errors.length > 0) {
    console.log(`✗ ${raw.id}\n${errors.map(e => `    - ${e}`).join("\n")}`);
    process.exit(1);
}
console.log(`✓ ${raw.id}  ${entries.map(([loc, d]) => `${loc} "${d.title}"`).join(" / ")}`);

if (WRITE) {
    const post = {
        id: raw.id,
        date: raw.date,
        image: raw.image || "🎁",
        ...(locales.ko ? { productKeywords: raw.productKeywords, faq: locales.ko.faq, ko: locales.ko } : {}),
        ...(locales.en ? { en: locales.en } : {}),
        ...(locales.ja ? { ja: locales.ja } : {}),
    };
    fs.writeFileSync(outPath, JSON.stringify(post, null, 2), "utf8");
    console.log(`saved → ${outPath}`);
}
