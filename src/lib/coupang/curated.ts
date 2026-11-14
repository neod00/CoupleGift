/**
 * 직접 고른 쿠팡 파트너스 상품 목록 (src/data/coupang/curated.json)
 *
 * 파트너스 API 최종 승인 전에는 API 로 상품을 검색할 수 없으므로, 파트너스 사이트에서 사람(또는
 * couplegift-add-products 스킬)이 만든 간편링크(https://link.coupang.com/a/...)를 이 목록에 미리 넣어 둔다.
 * 추천 API 는 이 목록을 모델에 보여 주고, 모델이 고른 id 의 링크를 그대로 카드에 건다.
 *
 * 링크는 파트너스가 만든 값을 그대로 쓴다 (파라미터 추가/변경 금지). 클라이언트/서버 공용, 동기.
 */
import curatedJson from '@/data/coupang/curated.json';
import type { CoupangProduct } from './types';

export interface CuratedItem {
  /** 목록 안에서 고유한 id (예: g001) */
  id: string;
  /** 쿠팡 상품명 그대로 */
  name: string;
  /** 추천 카테고리 (액세서리, 뷰티, 리빙 …) */
  category: string;
  /** 파트너스 간편링크 */
  link: string;
  /** 판매가(원). 모르면 생략 — 생략하면 카드는 모델의 예상 가격을 쓴다 */
  price?: number;
  /** 상품 이미지 URL. 생략하면 카테고리 이모지 박스가 나온다 */
  image?: string;
  /** 모델이 상품을 고를 때 참고할 짧은 설명 (성별·상황·분위기 등) */
  note?: string;
}

interface CuratedFile {
  updatedAt?: string;
  items?: CuratedItem[];
}

/** 파트너스 간편링크 도메인 (이 밖의 주소는 추적되지 않으므로 목록에서 제외) */
const LINK_HOSTS = ['link.coupang.com', 'coupa.ng'];
/** 프롬프트에 실어 보낼 최대 상품 수 (토큰 보호) */
const PROMPT_MAX_ITEMS = 80;

export function isPartnersShortLink(link: string): boolean {
  try {
    const url = new URL(link);
    return url.protocol === 'https:' && LINK_HOSTS.includes(url.hostname) && url.pathname.length > 1;
  } catch {
    return false;
  }
}

function isValidItem(item: CuratedItem | null | undefined): item is CuratedItem {
  return (
    !!item &&
    typeof item.id === 'string' &&
    item.id.trim() !== '' &&
    typeof item.name === 'string' &&
    item.name.trim() !== '' &&
    typeof item.link === 'string' &&
    isPartnersShortLink(item.link)
  );
}

const items: CuratedItem[] = (() => {
  const seen = new Set<string>();
  const list = (curatedJson as CuratedFile).items ?? [];
  return list.filter((item) => {
    if (!isValidItem(item) || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
})();

export function getCuratedItems(): CuratedItem[] {
  return items;
}

export function getCuratedById(id: string | undefined | null): CuratedItem | undefined {
  const key = (id ?? '').trim();
  return key ? items.find((item) => item.id === key) : undefined;
}

export function curatedToProduct(item: CuratedItem): CoupangProduct {
  return {
    productId: item.id,
    productName: item.name,
    productPrice: typeof item.price === 'number' && item.price > 0 ? item.price : 0,
    productImage: item.image || '',
    productUrl: item.link,
    keyword: item.category,
  };
}

/**
 * 파트너스 검색 위젯 링크 (트래킹 코드가 붙은 쿠팡 검색창).
 * 등록 상품이 하나도 없을 때만 쓰는 최후의 링크 — 일반 쿠팡 검색 URL(추적 안 됨) 대신 쓴다.
 */
export const PARTNERS_SEARCH_WIDGET_URL = 'https://coupa.ng/cmlebx';

/** 예산 상한 여유 비율 (상한의 20% 초과까지는 예산 안으로 본다) */
const BUDGET_SLACK = 1.2;
/** 예산 안 상품이 이보다 적으면 가장 가까운 가격의 상품으로 후보를 채운다 */
const MIN_CANDIDATES = 8;

/** 예산 구간까지의 거리(원). 구간 안이거나 가격 미상, 예산 미지정이면 0 */
function budgetDistance(item: CuratedItem, minBudget: number, maxBudget: number): number {
  const price = item.price;
  if (typeof price !== 'number' || price <= 0) return 0;
  const lo = minBudget > 0 ? minBudget : 0;
  const hi = maxBudget > 0 ? maxBudget * BUDGET_SLACK : Infinity;
  if (price < lo) return lo - price;
  if (price > hi) return price - hi;
  return 0;
}

/** 텍스트(추천 제목·키워드 등)의 단어가 상품 이름/카테고리/설명에 몇 개 들어 있는지 */
function relevance(item: CuratedItem, text: string): number {
  const haystack = `${item.name} ${item.category} ${item.note ?? ''}`.toLowerCase();
  const tokens = new Set(
    text
      .toLowerCase()
      .split(/[^\p{L}\p{N}]+/u)
      .filter((t) => t.length >= 2)
  );
  let score = 0;
  tokens.forEach((t) => {
    if (haystack.includes(t)) score += 1;
  });
  return score;
}

/**
 * 모델에게 보여 줄 후보 상품. 예산 안(상한 20% 여유) 상품을 먼저 싣고, 그것이 MIN_CANDIDATES 보다 적으면
 * 예산에 가장 가까운 가격의 상품으로 채운다 — 예산이 등록 상품 가격대를 벗어나도 후보가 0개가 되지 않는다.
 */
export function selectCuratedCandidates(minBudget: number, maxBudget: number): CuratedItem[] {
  const inBudget = items.filter((item) => budgetDistance(item, minBudget, maxBudget) === 0);
  if (inBudget.length >= MIN_CANDIDATES) return inBudget.slice(0, PROMPT_MAX_ITEMS);
  const nearest = items
    .filter((item) => !inBudget.includes(item))
    .sort((a, b) => budgetDistance(a, minBudget, maxBudget) - budgetDistance(b, minBudget, maxBudget))
    .slice(0, MIN_CANDIDATES - inBudget.length);
  return [...inBudget, ...nearest].slice(0, PROMPT_MAX_ITEMS);
}

/** 프롬프트용 후보 목록 문자열. 빈 문자열이면 등록 상품이 하나도 없다는 뜻 */
export function buildCuratedPromptList(minBudget: number, maxBudget: number): string {
  return selectCuratedCandidates(minBudget, maxBudget)
    .map((item) => {
      const price = item.price ? `${item.price.toLocaleString('ko-KR')}원` : '가격 미상';
      const note = item.note ? ` | ${item.note}` : '';
      return `- ${item.id} | ${item.name} | ${item.category} | ${price}${note}`;
    })
    .join('\n');
}

/**
 * 모델이 등록 상품을 고르지 않았을 때 대신 걸 등록 상품을 고른다.
 * 우선순위: 예산 안(또는 예산에 가까운 가격대) → 추천 내용과 관련 있는 것 → 예산에 더 가까운 가격. exclude 에 든 id 는 되도록 피한다
 * (모두 쓰였으면 겹치더라도 고른다). 등록 상품이 없을 때만 undefined.
 */
export function pickClosestCurated(opts: {
  minBudget?: number;
  maxBudget?: number;
  text?: string;
  exclude?: Set<string>;
}): CuratedItem | undefined {
  if (items.length === 0) return undefined;
  const min = opts.minBudget ?? 0;
  const max = opts.maxBudget ?? 0;
  const text = opts.text ?? '';
  const pool = items.filter((item) => !opts.exclude?.has(item.id));
  // 예산 밖 상품은 가격 차이를 예산 규모의 20% 단위 구간으로 묶어, 비슷하게 가까운 것끼리만 관련도로 순위를 바꾼다
  // (20~30만 원 예산에 관련 있다는 이유로 2만 원짜리가 13만 원짜리를 앞지르지 않도록)
  const bucketSize = Math.max(min, max, 10_000) * 0.2;
  const ranked = (pool.length > 0 ? pool : items)
    .map((item, index) => {
      const distance = budgetDistance(item, min, max);
      return {
        item,
        index,
        distance,
        bucket: distance > 0 ? 1 + Math.floor(distance / bucketSize) : 0,
        score: relevance(item, text),
      };
    })
    .sort((a, b) => a.bucket - b.bucket || b.score - a.score || a.distance - b.distance || a.index - b.index);
  return ranked[0]?.item;
}
