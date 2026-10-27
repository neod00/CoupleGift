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
 * 모델에게 보여 줄 후보 목록. 가격이 알려진 상품은 예산 범위(상한은 20% 여유) 안의 것만 싣는다.
 * 빈 문자열이면 목록이 없거나 예산에 맞는 상품이 없다는 뜻 (호출 측은 프롬프트에 목록 절을 넣지 않는다).
 */
export function buildCuratedPromptList(minBudget: number, maxBudget: number): string {
  const hasBudget = maxBudget > 0;
  return items
    .filter((item) => {
      if (!hasBudget || typeof item.price !== 'number' || item.price <= 0) return true;
      return item.price >= minBudget && item.price <= maxBudget * 1.2;
    })
    .slice(0, PROMPT_MAX_ITEMS)
    .map((item) => {
      const price = item.price ? `${item.price.toLocaleString('ko-KR')}원` : '가격 미상';
      const note = item.note ? ` | ${item.note}` : '';
      return `- ${item.id} | ${item.name} | ${item.category} | ${price}${note}`;
    })
    .join('\n');
}
