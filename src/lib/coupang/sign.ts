/**
 * 쿠팡 파트너스 Open API HMAC 서명 헬퍼 (서버 전용)
 *
 * 이 파일은 Node `crypto` 를 사용하므로 서버 코드(API Route, 서버 컴포넌트, scripts/)에서만
 * import 해야 한다. 'use client' 파일이나 브라우저에서 실행되는 서비스에서 import 금지.
 *
 * 서명 규칙 (공식 문서 + n8n-nodes-coupang-partners / coupang-partners-sdk 로 교차 검증):
 *   signed-date = yyMMdd'T'HHmmss'Z' (UTC)              예) 260105T153022Z
 *   message     = signedDate + METHOD + path + query    (query 앞의 '?' 없음, POST body 제외)
 *   signature   = hex(HMAC-SHA256(secretKey, message))  소문자 64자
 *   Authorization: CEA algorithm=HmacSHA256, access-key=..., signed-date=..., signature=...
 *
 * 주의: 서명한 query string 과 실제 전송하는 query string 은 바이트 단위로 동일해야 한다.
 * URLSearchParams(공백 → '+') 등 다른 인코더를 섞지 말고 buildQuery() 결과를 그대로 재사용한다.
 */
import { createHmac } from 'crypto';

export const COUPANG_API_HOST = 'https://api-gateway.coupang.com';
export const COUPANG_API_BASE_PATH = '/v2/providers/affiliate_open_api/apis/openapi/v1';

export type CoupangHttpMethod = 'GET' | 'POST';

export type CoupangQueryParams = Record<string, string | number | boolean | undefined | null>;

/** yyMMdd'T'HHmmss'Z' (UTC) — 예: 260907T061530Z */
export function formatSignedDate(now: Date = new Date()): string {
  return now
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}/, '')
    .slice(2);
}

/**
 * RFC3986 방식 percent-encoding 으로 query string 생성 (공백 → %20).
 * undefined / null / '' 값은 파라미터 자체를 생략한다 (subId 미지정 시 등).
 */
export function buildCoupangQuery(params: CoupangQueryParams = {}): string {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
    .join('&');
}

export interface CoupangSignInput {
  method: CoupangHttpMethod;
  /** 호스트를 제외한 경로. 예: /v2/providers/affiliate_open_api/apis/openapi/v1/products/search */
  path: string;
  /** 앞의 '?' 를 제외한 query string (없으면 '') */
  query?: string;
  accessKey: string;
  secretKey: string;
  now?: Date;
}

/** Authorization 헤더 값 생성. 요청마다 새로 만들어야 한다 (signed-date 가 매번 다름). */
export function buildCoupangAuthorization({
  method,
  path,
  query = '',
  accessKey,
  secretKey,
  now = new Date(),
}: CoupangSignInput): string {
  const signedDate = formatSignedDate(now);
  const message = signedDate + method.toUpperCase() + path + query;
  const signature = createHmac('sha256', secretKey).update(message, 'utf8').digest('hex');
  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${signedDate}, signature=${signature}`;
}

/** 서명된 요청 한 건을 구성하는 데 필요한 값 (URL + 헤더) */
export interface SignedCoupangRequest {
  url: string;
  headers: Record<string, string>;
}

export function buildSignedCoupangRequest(input: {
  method: CoupangHttpMethod;
  /** BASE_PATH 이후의 엔드포인트. 예: /products/search, /deeplink */
  endpoint: string;
  params?: CoupangQueryParams;
  accessKey: string;
  secretKey: string;
  now?: Date;
}): SignedCoupangRequest {
  const path = COUPANG_API_BASE_PATH + input.endpoint;
  const query = input.method === 'GET' ? buildCoupangQuery(input.params) : '';
  const url = COUPANG_API_HOST + path + (query ? `?${query}` : '');
  return {
    url,
    headers: {
      Authorization: buildCoupangAuthorization({
        method: input.method,
        path,
        query,
        accessKey: input.accessKey,
        secretKey: input.secretKey,
        now: input.now,
      }),
      'Content-Type': 'application/json',
    },
  };
}
