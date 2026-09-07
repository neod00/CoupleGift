/**
 * 쿠팡 파트너스 연동 공용 타입
 */

export interface CoupangProduct {
  /** 쿠팡 상품 ID */
  productId: number | string;
  productName: string;
  /** 원화 가격 */
  productPrice: number;
  /** 상품 이미지 URL */
  productImage: string;
  /** 파트너스 추적 코드가 포함된 상품 URL (API가 반환한 값 그대로) */
  productUrl: string;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  categoryName?: string;
  /** 이 상품을 가져온 검색 키워드 */
  keyword: string;
  /** ISO 날짜 */
  fetchedAt?: string;
}

/**
 * 빌드 타임에 미리 받아둔 상품 카탈로그 (src/data/coupang/products.json)
 * keyword → 상품 목록
 */
export interface ProductCatalog {
  generatedAt: string;
  products: Record<string, CoupangProduct[]>;
}

export interface CoupangDeeplink {
  originalUrl: string;
  shortenUrl: string;
  landingUrl: string;
}
