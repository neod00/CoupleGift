/**
 * 블로그 글의 en/ja 현지화본을 검증하고 포스트 JSON 에 병합한다 (Gemini 호출 없음).
 *
 *   npx tsx scripts/apply-localized-posts.ts <stagingDir> --check [slug ...]   # 검증만
 *   npx tsx scripts/apply-localized-posts.ts <stagingDir> [slug ...]           # 검증 통과분만 병합
 *
 * 입력: <stagingDir>/<slug>.json
 *   { "en": LocaleInput, "ja": LocaleInput }   (둘 중 하나만 있어도 됨 — 없는 로케일은 기존 내용 유지)
 *   LocaleInput = { title, excerpt, category, readTime, content: string[], table?: { caption, headers, rows }, faq: [{ q, a }] }
 *   - 본문 안 비교표 자리는 "[[TABLE]]" 문자열 1개로 두고 표 데이터는 table 필드에 넣는다 (HTML 은 이 스크립트가 만든다).
 *
 * 검증 규칙 (ko 원문 기준):
 *   - "## " 소제목 개수가 ko 와 같을 것 (ko 상품 카드 정렬과 같은 구조 유지)
 *   - ko 에 비교표가 있으면 표 1개, ko 에 FAQ 가 있으면 FAQ 3개 이상
 *   - 원화 가격(KRW/won/ウォン/만원), 브랜드 음역(Seonmul), 한글 잔존 금지
 *   - ko 가 가격을 다루면 en 은 "$", ja 는 "円" 가격대가 있을 것
 *
 * 병합 시 포스트에 updated: YYYY-MM-DD 를 기록한다 (BlogPosting dateModified 로 노출).
 * 종료 코드: 0 = 모두 통과, 1 = 하나라도 실패 (실패한 글은 병합하지 않음)
 */
import fs from "fs";
import path from "path";
import { findUnlocalized, normalizeLocale, type LocaleData } from "./lib/blog-content";

const POSTS_DIR = path.join(process.cwd(), "src", "data", "blog", "posts");
const LOCALES = ["en", "ja"] as const;
type Loc = (typeof LOCALES)[number];

const args = process.argv.slice(2);
const stagingDir = args.find(a => !a.startsWith("--"));
const CHECK_ONLY = args.includes("--check");
const onlySlugs = args.filter(a => !a.startsWith("--") && a !== stagingDir);

if (!stagingDir || !fs.existsSync(stagingDir)) {
    console.error("usage: npx tsx scripts/apply-localized-posts.ts <stagingDir> [--check] [slug ...]");
    process.exit(1);
}

const headingCount = (content: string[]) => content.filter(p => p.startsWith("## ")).length;
const tableCount = (content: string[]) => content.filter(p => /<table\b/i.test(p)).length;
const fallbackCategory: Record<Loc, string> = { en: "Gift Tips", ja: "ギフトのヒント" };

function validate(slug: string, loc: Loc, data: LocaleData, ko: { content: string[]; faqCount: number }): { errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const koHeadings = headingCount(ko.content);
    if (headingCount(data.content) !== koHeadings) {
        errors.push(`"## " 소제목 ${headingCount(data.content)}개 (ko 는 ${koHeadings}개)`);
    }
    const koTables = tableCount(ko.content);
    if (koTables > 0 && tableCount(data.content) !== 1) errors.push(`비교표 ${tableCount(data.content)}개 (1개여야 함 — content 에 "[[TABLE]]" + table 필드)`);
    if (ko.faqCount > 0 && data.faq.length < 3) errors.push(`FAQ ${data.faq.length}개 (3개 이상)`);
    for (const issue of findUnlocalized(data)) errors.push(issue);

    const text = [data.title, data.excerpt, ...data.content, ...data.faq.flatMap(f => [f.q, f.a])].join("\n");
    const koText = ko.content.join("\n");
    const koHasPrices = /\d\s*(만\s*)?원|만원/.test(koText);
    if (koHasPrices && loc === "en" && !/\$\s?\d/.test(text)) errors.push('ko 는 가격을 다루는데 en 에 "$" 가격대가 없음');
    if (koHasPrices && loc === "ja" && !/\d[\d,]*\s*円/.test(text)) errors.push('ko 는 가격을 다루는데 ja 에 "円" 가격대가 없음');

    if (!data.excerpt) errors.push("excerpt 비어 있음");
    if (loc === "en" && data.title.length > 75) warnings.push(`title ${data.title.length}자 (검색결과에서 잘릴 수 있음, 60~70자 권장)`);
    if (loc === "ja" && data.title.length > 45) warnings.push(`title ${data.title.length}자 (30~40자 권장)`);
    if (loc === "ja" && /[A-Za-z]{4,}\s+[A-Za-z]{4,}\s+[A-Za-z]{4,}/.test(data.content.join(" ").replace(/<[^>]+>/g, " "))) {
        warnings.push("ja 본문에 영어 문장이 남아 있을 수 있음");
    }
    return { errors, warnings };
}

const files = fs.readdirSync(stagingDir).filter(f => f.endsWith(".json"))
    .filter(f => onlySlugs.length === 0 || onlySlugs.includes(f.replace(/\.json$/, "")))
    .sort();

const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().split("T")[0];
let failed = 0;
let applied = 0;

for (const file of files) {
    const slug = file.replace(/\.json$/, "");
    const postPath = path.join(POSTS_DIR, `${slug}.json`);
    if (!fs.existsSync(postPath)) {
        console.log(`✗ ${slug}: 원본 포스트가 없음 (${postPath})`);
        failed++;
        continue;
    }

    let staged: Record<string, unknown>;
    try {
        staged = JSON.parse(fs.readFileSync(path.join(stagingDir, file), "utf8"));
    } catch (err) {
        console.log(`✗ ${slug}: 스테이징 JSON 파싱 실패 — ${(err as Error).message}`);
        failed++;
        continue;
    }

    const post = JSON.parse(fs.readFileSync(postPath, "utf8"));
    const ko = {
        content: Array.isArray(post?.ko?.content) ? post.ko.content as string[] : [],
        faqCount: (Array.isArray(post?.ko?.faq) ? post.ko.faq.length : 0) || (Array.isArray(post?.faq) ? post.faq.length : 0),
    };

    const results: { loc: Loc; data: LocaleData }[] = [];
    const problems: string[] = [];
    const notes: string[] = [];
    for (const loc of LOCALES) {
        if (staged[loc] === undefined) continue;
        const data = normalizeLocale(staged[loc], fallbackCategory[loc]);
        if (!data) {
            problems.push(`${loc}: title 또는 content 가 없음`);
            continue;
        }
        const { errors, warnings } = validate(slug, loc, data, ko);
        problems.push(...errors.map(e => `${loc}: ${e}`));
        notes.push(...warnings.map(w => `${loc}: ${w}`));
        results.push({ loc, data });
    }
    if (results.length === 0 && problems.length === 0) problems.push("en/ja 가 하나도 없음");

    if (problems.length > 0) {
        failed++;
        console.log(`✗ ${slug}\n${problems.map(p => `    - ${p}`).join("\n")}`);
        continue;
    }
    const summary = results.map(r => `${r.loc} "${r.data.title}"`).join(" / ");
    console.log(`✓ ${slug}  ${summary}${notes.length ? `\n${notes.map(n => `    ! ${n}`).join("\n")}` : ""}`);

    if (!CHECK_ONLY) {
        for (const { loc, data } of results) post[loc] = data;
        post.updated = today;
        fs.writeFileSync(postPath, JSON.stringify(post, null, 2), "utf8");
        applied++;
    }
}

console.log(`\n${files.length}개 중 실패 ${failed}개${CHECK_ONLY ? " (검증만)" : `, 병합 ${applied}개`}`);
process.exit(failed > 0 ? 1 : 0);
