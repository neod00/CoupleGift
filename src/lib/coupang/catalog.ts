/**
 * 빌드 타임 상품 카탈로그 조회 (클라이언트/서버 공용, 동기)
 *
 * src/data/coupang/products.json 은 scripts/fetch-coupang-products.ts 가
 * 파트너스 API로 미리 받아둔 결과다. 런타임 API 호출 없이 상품 카드를 그릴 수 있다.
 */
import catalogJson from '@/data/coupang/products.json';
import type { CoupangProduct, ProductCatalog } from './types';

const catalog = catalogJson as ProductCatalog;

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getCatalogKeywords(): string[] {
  return Object.keys(catalog.products || {});
}

/** 정확히 일치하는 키워드의 상품을 반환 */
export function getProductsForKeyword(keyword: string, limit = 3): CoupangProduct[] {
  const list = catalog.products?.[keyword] || catalog.products?.[normalize(keyword)] || [];
  return list.slice(0, limit);
}

/**
 * 임의의 텍스트(예: 블로그 소제목 "## 1. 무선 이어폰 추천")에서
 * 카탈로그에 있는 키워드 중 가장 잘 맞는 것을 찾는다. 없으면 null.
 */
export function findBestKeywordMatch(text: string): string | null {
  const target = normalize(text);
  if (!target) return null;

  let best: string | null = null;
  let bestLen = 0;
  for (const keyword of getCatalogKeywords()) {
    const k = normalize(keyword);
    if (k && target.includes(k) && k.length > bestLen) {
      best = keyword;
      bestLen = k.length;
    }
  }
  return best;
}

/** 텍스트에 맞는 상품을 찾아 반환 (매칭 실패 시 빈 배열) */
export function getProductsForText(text: string, limit = 3): CoupangProduct[] {
  const keyword = findBestKeywordMatch(text);
  return keyword ? getProductsForKeyword(keyword, limit) : [];
}

export function getCatalogGeneratedAt(): string {
  return catalog.generatedAt || '';
}
