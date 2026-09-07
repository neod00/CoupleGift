import type { CoupangProduct } from '@/lib/coupang/types';

export interface GiftFormData {
  gender: 'male' | 'female';
  age: number;
  personality: string;
  occasionType: string;
  minBudget: number;
  maxBudget: number;
  category?: string;
  additionalInfo?: string;
}

/**
 * 추천 카드의 링크/이미지/가격 출처
 * - 'api'      : 요청 시점에 쿠팡 파트너스 API 로 검색한 실제 상품 (추적 링크)
 * - 'catalog'  : 빌드 타임 카탈로그(src/data/coupang/products.json)의 실제 상품 (추적 링크)
 * - 'fallback' : 매칭 상품 없음 → 쿠팡 일반 검색 URL + 대체 이미지
 */
export type GiftLinkSource = 'api' | 'catalog' | 'fallback';

export interface GiftRecommendation {
  id: string;
  title: string;
  description: string;
  /** 화면에 표시할 가격. 실제 상품이 매칭되면 그 상품의 판매가, 아니면 모델의 예상 가격 */
  price: string;
  imageUrl: string;
  coupangUrl: string;
  category: string;
  /** 실제 데이터가 있을 때만 채운다 (임의의 값을 넣지 말 것 — 허위 사회적 증거는 정책 위반 위험) */
  rating?: number;
  reviewCount?: number;
  /** 모델이 제안한 쿠팡 검색 키워드 (검색 폴백 URL 생성에 사용) */
  searchKeyword?: string;
  /** 모델이 제안한 예상 가격 원문. 실제 상품 가격으로 price 가 대체된 경우 참고용으로 보존 */
  estimatedPrice?: string;
  /** 매칭된 쿠팡 파트너스 상품 목록 (productUrl 은 API 가 준 추적 URL 그대로) */
  products?: CoupangProduct[];
  source?: GiftLinkSource;
}

export interface GPTResponse {
  recommendations: GiftRecommendation[];
  success: boolean;
  error?: string;
}
