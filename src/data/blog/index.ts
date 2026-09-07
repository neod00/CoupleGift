import fs from 'fs';
import path from 'path';
import { generatePopularPages, type GiftPageData } from '@/data/giftPages';

export interface BlogPostData {
    id: string;
    date: string;
    image: string;
    [locale: string]: any; // ko, en, ja
}

/**
 * 빌드 타임에 모든 블로그 포스트 JSON을 로드합니다.
 * Next.js는 빌드 시 이 함수를 실행하므로 fs 접근이 안전합니다.
 */
export function getAllBlogPosts(): BlogPostData[] {
    const postsDir = path.join(process.cwd(), 'src', 'data', 'blog', 'posts');
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));
    return files.map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        return JSON.parse(content) as BlogPostData;
    });
}

/**
 * slug로 특정 블로그 포스트를 찾습니다.
 */
export function getBlogPostBySlug(slug: string): BlogPostData | null {
    const posts = getAllBlogPosts();
    return posts.find(p => p.id === slug) || null;
}

/**
 * 모든 블로그 포스트 slug 목록을 반환합니다.
 */
export function getAllBlogSlugs(): string[] {
    const postsDir = path.join(process.cwd(), 'src', 'data', 'blog', 'posts');
    if (!fs.existsSync(postsDir)) return [];
    return fs.readdirSync(postsDir)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
}

// ============================================================
// 내부 링크 헬퍼 (관련 글 / 관련 선물 가이드)
// ============================================================

/** 로케일 데이터(없으면 ko)를 반환 */
function getLocaleData(post: BlogPostData, locale: string): any {
    const data = post?.[locale];
    return typeof data === 'object' && data !== null ? data : post?.ko;
}

/** 유사도 계산에서 무시할 흔한 단어 */
const STOPWORDS = new Set<string>([
    // ko
    '선물', '추천', '가이드', '아이디어', '리스트', '위한', '위해', '완벽', '총정리', '베스트', 'top', 'best',
    '센스', '특별한', '마음', '준비', '고르는', '고민', '방법', '순위', '정리', '모음', '소개', '이번', '올해',
    // en
    'the', 'and', 'for', 'gift', 'gifts', 'ideas', 'idea', 'guide', 'of', 'to', 'a', 'an', 'in', 'on', 'with',
    'your', 'you', 'best', 'top', 'that', 'this', 'from', 'are', 'is', 'how', 'what',
    // ja
    'ギフト', 'プレゼント', 'おすすめ', 'ガイド', 'アイデア', 'リスト',
    // 연도
    '2024', '2025', '2026', '2027',
]);

const KO_PARTICLES = /(으로|에게|께서|에서|부터|까지|이다|은|는|이|가|을|를|의|에|께|도|로|와|과|만)$/;

function stripParticle(word: string): string {
    const stripped = word.replace(KO_PARTICLES, '');
    return stripped.length >= 2 ? stripped : word;
}

function tokenize(text: string): Set<string> {
    const tokens = new Set<string>();
    (text || '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, ' ')
        .split(/\s+/)
        .map(stripParticle)
        .forEach((w) => {
            if (w.length >= 2 && !STOPWORDS.has(w) && !/^\d+$/.test(w)) tokens.add(w);
        });
    return tokens;
}

function postTokens(post: BlogPostData, locale: string): Set<string> {
    // 현재 로케일 + ko 텍스트를 합쳐서 매칭 재현율을 높인다 (ja 는 띄어쓰기가 없어 ko 가 보조 역할)
    const local = getLocaleData(post, locale);
    const ko = post?.ko;
    const text = [local?.title, local?.excerpt, ko?.title, ko?.excerpt].filter(Boolean).join(' ');
    return tokenize(text);
}

function toTime(date: string): number {
    const t = new Date(date || '').getTime();
    return Number.isNaN(t) ? 0 : t;
}

function sortByDateDesc(a: BlogPostData, b: BlogPostData): number {
    return toTime(b.date) - toTime(a.date);
}

/**
 * 특정 글과 관련된 글 목록.
 * 점수 = 같은 카테고리(+3) + 제목/요약 공유 단어 수(최대 6) + 최신성(0~1).
 * 자기 자신은 제외하고, 매칭이 부족하면 최신 글로 채운다.
 */
export function getRelatedPosts(postId: string, locale: string = 'ko', limit: number = 4): BlogPostData[] {
    const all = getAllBlogPosts();
    const self = all.find((p) => p.id === postId);
    const others = all.filter((p) => p.id !== postId);

    if (!self) {
        return others.sort(sortByDateDesc).slice(0, limit);
    }

    const selfLocal = getLocaleData(self, locale);
    const selfCategory: string = selfLocal?.category || '';
    const selfTokens = postTokens(self, locale);
    const selfTime = toTime(self.date);

    const scored = others.map((post) => {
        let score = 0;

        const category: string = getLocaleData(post, locale)?.category || '';
        if (selfCategory && category === selfCategory) score += 3;

        let shared = 0;
        for (const token of postTokens(post, locale)) {
            if (selfTokens.has(token)) shared += 1;
        }
        score += Math.min(shared, 6);

        const days = Math.abs(selfTime - toTime(post.date)) / 86_400_000;
        score += Math.max(0, 1 - days / 365);

        return { post, score, matched: shared > 0 || (selfCategory && category === selfCategory) };
    });

    scored.sort((a, b) => b.score - a.score || sortByDateDesc(a.post, b.post));

    const result: BlogPostData[] = scored.filter((s) => s.matched).slice(0, limit).map((s) => s.post);

    if (result.length < limit) {
        const picked = new Set(result.map((p) => p.id));
        for (const post of [...others].sort(sortByDateDesc)) {
            if (result.length >= limit) break;
            if (!picked.has(post.id)) {
                result.push(post);
                picked.add(post.id);
            }
        }
    }

    return result;
}

// ------------------------------------------------------------
// 블로그 글 ↔ /gift 프로그래매틱 페이지 매핑
// ------------------------------------------------------------
const GENDER_WORDS: Record<string, string[]> = {
    female: ['여자친구', '여성', '여자', '아내', '와이프', '엄마', '어머니', '여친', '그녀'],
    male: ['남자친구', '남성', '남자', '남편', '아빠', '아버지', '남친'],
};

const OCCASION_WORDS: Record<string, string[]> = {
    birthday: ['생일'],
    anniversary: ['기념일', '커플', '결혼기념일'],
    '100days': ['100일', '백일'],
    christmas: ['크리스마스', '연말', '성탄'],
    valentines: ['발렌타인', '밸런타인'],
    whiteday: ['화이트데이'],
    graduation: ['졸업', '입학'],
    parents: ['부모님', '어버이날', '부모', '효도', '어버이'],
};

const AGE_WORDS: Record<string, string[]> = {
    '10s': ['10대', '중학생', '고등학생', '청소년'],
    '20s': ['20대', 'mz'],
    '30s': ['30대'],
    '40s': ['40대'],
    '50s': ['50대'],
    '60s': ['60대', '70대', '노인', '어르신'],
};

const CATEGORY_TO_OCCASION: Record<string, string> = {
    '생일': 'birthday',
    '기념일': 'anniversary',
    '가족': 'parents',
};

function matchIds(text: string, table: Record<string, string[]>): Set<string> {
    const lower = (text || '').toLowerCase();
    const ids = new Set<string>();
    for (const [id, words] of Object.entries(table)) {
        if (words.some((w) => lower.includes(w.toLowerCase()))) ids.add(id);
    }
    return ids;
}

/** 같은 성별/나이/기념일 조합에서 대표 예산 페이지 하나만 남긴다 */
function dedupeByCombination(pages: GiftPageData[]): GiftPageData[] {
    const byPrefix = new Map<string, GiftPageData>();
    for (const page of pages) {
        const prefix = `${page.gender}-${page.ageGroup}-${page.occasion}`;
        const existing = byPrefix.get(prefix);
        // 5~10만원 구간을 대표 페이지로 선호 (검색량/전환 균형)
        if (!existing || (page.budget === '5-10' && existing.budget !== '5-10')) {
            byPrefix.set(prefix, page);
        }
    }
    return Array.from(byPrefix.values());
}

function giftPageTitle(page: GiftPageData, locale: string): string {
    const title = page.title[locale] || page.title.ko || '';
    // "... | 선물지니" 브랜드 접미사는 링크 텍스트에서 제거
    return title.replace(/\s*\|.*$/, '').trim();
}

/**
 * 블로그 글의 ko 제목/카테고리에서 성별·기념일·나이대 단어를 찾아
 * generatePopularPages() 의 /gift 페이지에 매핑한다.
 * 아무것도 매칭되지 않으면 가장 인기 있는 조합을 반환한다 (내부 링크 유지).
 */
export function getRelatedGiftPages(
    post: BlogPostData,
    locale: string = 'ko',
    limit: number = 3
): { slug: string; title: string }[] {
    const ko = post?.ko || {};
    const koText = `${ko.title || ''} ${ko.excerpt || ''}`;
    const koTitle = ko.title || '';

    const genders = matchIds(koText, GENDER_WORDS);
    const occasions = matchIds(koTitle, OCCASION_WORDS);
    const ages = matchIds(koText, AGE_WORDS);

    if (occasions.size === 0) {
        const fromCategory = CATEGORY_TO_OCCASION[ko.category || ''];
        if (fromCategory) occasions.add(fromCategory);
        // 요약에서도 한 번 더 시도
        for (const id of matchIds(ko.excerpt || '', OCCASION_WORDS)) occasions.add(id);
    }
    // 부모님 글은 성별 무관 → 부모 세대 나이대 우선
    if (occasions.has('parents') && ages.size === 0) {
        ages.add('50s');
        ages.add('60s');
    }

    const popular = dedupeByCombination(generatePopularPages());

    const scored = popular.map((page) => {
        let score = 0;
        if (occasions.has(page.occasion)) score += 4;
        if (genders.has(page.gender)) score += 2;
        if (ages.has(page.ageGroup)) score += 1;
        return { page, score };
    });

    // 동점이면 검색량이 많은 20대·30대 조합을 우선
    const agePriority: Record<string, number> = { '20s': 0, '30s': 1, '40s': 2, '10s': 3, '50s': 4, '60s': 5 };
    const byPriority = (a: GiftPageData, b: GiftPageData) =>
        (agePriority[a.ageGroup] ?? 9) - (agePriority[b.ageGroup] ?? 9);

    scored.sort((a, b) => b.score - a.score || byPriority(a.page, b.page));

    let picked = scored.filter((s) => s.score > 0).map((s) => s.page);
    if (picked.length === 0) {
        picked = [...popular].sort(byPriority); // 폴백: 인기 조합 상위
    }

    return picked.slice(0, limit).map((page) => ({
        slug: page.slug,
        title: giftPageTitle(page, locale),
    }));
}

/**
 * /gift 페이지(성별/기념일/나이대)에 어울리는 블로그 글.
 * ko 제목에서 기념일(+2)·성별(+1)·나이대(+1) 단어를 매칭하고, 부족하면 최신 글로 채운다.
 */
export function getPostsForGiftPage(
    page: { gender: string; occasion: string; ageGroup?: string },
    limit: number = 4
): BlogPostData[] {
    const all = getAllBlogPosts();

    const scored = all.map((post) => {
        const ko = post?.ko || {};
        const text = `${ko.title || ''} ${ko.excerpt || ''}`;
        let score = 0;
        if (matchIds(ko.title || '', OCCASION_WORDS).has(page.occasion)) score += 2;
        else if (matchIds(text, OCCASION_WORDS).has(page.occasion)) score += 1;
        if (matchIds(text, GENDER_WORDS).has(page.gender)) score += 1;
        if (page.ageGroup && matchIds(text, AGE_WORDS).has(page.ageGroup)) score += 1;
        return { post, score };
    });

    scored.sort((a, b) => b.score - a.score || sortByDateDesc(a.post, b.post));

    const result = scored.filter((s) => s.score > 0).slice(0, limit).map((s) => s.post);

    if (result.length < limit) {
        const picked = new Set(result.map((p) => p.id));
        for (const post of [...all].sort(sortByDateDesc)) {
            if (result.length >= limit) break;
            if (!picked.has(post.id)) {
                result.push(post);
                picked.add(post.id);
            }
        }
    }

    return result;
}
