/**
 * 쿠팡 파트너스 Open API 클라이언트 (서버 전용)
 *
 * 환경변수:
 *   COUPANG_ACCESS_KEY   - 파트너스 API Access Key
 *   COUPANG_SECRET_KEY   - 파트너스 API Secret Key
 *   COUPANG_SUB_ID       - (선택) 채널 구분용 subId
 *
 * 이 파일은 서버(API Route, 빌드 스크립트)에서만 import 해야 한다.
 * Secret Key가 클라이언트 번들에 포함되면 안 된다.
 */
import type { CoupangProduct, CoupangDeeplink } from './types';

export function isCoupangConfigured(): boolean {
  return !!(process.env.COUPANG_ACCESS_KEY && process.env.COUPANG_SECRET_KEY);
}

/** 파트너스 API 미설정 시 사용하는 일반 검색 URL (추적 안 됨) */
export function buildCoupangSearchFallbackUrl(keyword: string): string {
  return `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(keyword)}&channel=user`;
}

/**
 * 키워드로 상품 검색. 추적 링크가 포함된 상품 목록을 반환한다.
 * 미설정/오류 시 빈 배열을 반환한다 (호출 측에서 폴백 처리).
 */
export async function searchCoupangProducts(
  _keyword: string,
  _opts?: { limit?: number; subId?: string }
): Promise<CoupangProduct[]> {
  // TODO: 구현 예정
  return [];
}

/**
 * 쿠팡 URL 목록을 파트너스 추적 딥링크로 변환한다.
 */
export async function createCoupangDeeplinks(
  _urls: string[],
  _subId?: string
): Promise<CoupangDeeplink[]> {
  // TODO: 구현 예정
  return [];
}
