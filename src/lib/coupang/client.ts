/**
 * 쿠팡 파트너스 Open API 클라이언트 (서버 전용)
 *
 * 환경변수:
 *   COUPANG_ACCESS_KEY   - 파트너스 API Access Key
 *   COUPANG_SECRET_KEY   - 파트너스 API Secret Key
 *   COUPANG_SUB_ID       - (선택) 채널 구분용 subId — 파트너스 > 채널 아이디 관리에 등록된 값만 정산에 포함됨
 *
 * 이 파일은 서버(API Route, 서버 컴포넌트, scripts/)에서만 import 해야 한다.
 * Secret Key가 클라이언트 번들에 포함되면 안 된다. 'use client' 파일이나
 * 브라우저에서 실행되는 src/services/gptService.ts 에서는 절대 import 하지 말 것.
 *
 * 레이트 리밋 주의:
 *   공식 문서상 검색 API 는 분당 50회지만, 커뮤니티에서는 시간당 ~10회 수준의 숨은 제한과
 *   위반 3회 시 계정 정지 사례가 보고된다. 그래서
 *   - 요청 시점에 API 를 부르는 대신 scripts/fetch-coupang-products.ts 가 미리 받아둔
 *     src/data/coupang/products.json 카탈로그를 우선 사용하고,
 *   - 이 파일은 프로세스 내 메모리 캐시(TTL 6시간, 최대 500 키워드)로 재호출을 막으며,
 *   - 401/403/429 는 절대 자동 재시도하지 않는다.
 */
import type { CoupangProduct, CoupangDeeplink } from './types';
import { buildSignedCoupangRequest } from './sign';

// ---------------------------------------------------------------------------
// 설정
// ---------------------------------------------------------------------------

const REQUEST_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6시간
const CACHE_MAX_ENTRIES = 500;
/** Next.js Data Cache revalidate (초). 메모리 캐시와 동일하게 6시간 */
const NEXT_REVALIDATE_SECONDS = 21_600;
/** 공식 문서: limit 기본 10, 최대 10 */
const SEARCH_MAX_LIMIT = 10;

export function isCoupangConfigured(): boolean {
  return !!(process.env.COUPANG_ACCESS_KEY && process.env.COUPANG_SECRET_KEY);
}

/** 파트너스 API 미설정 시 사용하는 일반 검색 URL (추적 안 됨) */
export function buildCoupangSearchFallbackUrl(keyword: string): string {
  return `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(keyword)}&channel=user`;
}

// ---------------------------------------------------------------------------
// 에러 타입
// ---------------------------------------------------------------------------

export type CoupangErrorKind =
  | 'not_configured'
  | 'auth' // 401 / 403 — 키 오류, 시계 오차, Open API 미승인, 24시간 정지
  | 'rate_limit' // 429
  | 'timeout'
  | 'network'
  | 'http' // 기타 HTTP 오류 (400, 500, HTML 응답 등)
  | 'api'; // HTTP 200 이지만 rCode != '0'

/**
 * 호출 측(특히 배치 스크립트)이 "429면 중단", "401이면 키 확인" 같은 판단을 할 수 있도록
 * 상태 코드와 종류를 담아 던지는 에러. 메시지에는 키/서명이 포함되지 않는다.
 */
export class CoupangApiError extends Error {
  readonly kind: CoupangErrorKind;
  readonly status: number;
  readonly rCode?: string;

  constructor(kind: CoupangErrorKind, message: string, status = 0, rCode?: string) {
    super(message);
    this.name = 'CoupangApiError';
    this.kind = kind;
    this.status = status;
    this.rCode = rCode;
  }

  /** 자동 재시도하면 안 되는(계정 정지 위험) 종류인지 */
  get shouldStop(): boolean {
    return this.kind === 'auth' || this.kind === 'rate_limit' || this.kind === 'not_configured';
  }
}

// ---------------------------------------------------------------------------
// 응답 타입 (API 원본 형태)
// ---------------------------------------------------------------------------

interface CoupangEnvelope<T> {
  rCode?: string | number;
  rMessage?: string;
  data?: T;
  // 게이트웨이 수준 오류 (401 등) 는 아래 형태로 온다
  code?: string;
  message?: string;
}

interface CoupangSearchItem {
  keyword?: string;
  rank?: number;
  isRocket?: boolean;
  isFreeShipping?: boolean;
  productId: number | string;
  productImage?: string;
  productName?: string;
  productPrice?: number | string;
  productUrl?: string;
  categoryName?: string;
}

interface CoupangSearchData {
  landingUrl?: string;
  productData?: CoupangSearchItem[];
}

type CoupangDeeplinkData = Array<{
  originalUrl?: string;
  shortenUrl?: string;
  landingUrl?: string;
}>;

// ---------------------------------------------------------------------------
// 메모리 캐시 (keyword|limit|subId → 결과). LRU 근사: 조회 시 뒤로 이동, 초과 시 앞에서 제거
// ---------------------------------------------------------------------------

interface CacheEntry {
  ts: number;
  products: CoupangProduct[];
}

const searchCache = new Map<string, CacheEntry>();

function cacheKey(keyword: string, limit: number, subId?: string): string {
  return `${keyword}|${limit}|${subId || ''}`;
}

function cacheGet(key: string): CoupangProduct[] | null {
  const entry = searchCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    searchCache.delete(key);
    return null;
  }
  // LRU: 최근 사용 항목을 뒤로 이동
  searchCache.delete(key);
  searchCache.set(key, entry);
  return entry.products;
}

function cacheSet(key: string, products: CoupangProduct[]): void {
  if (searchCache.has(key)) searchCache.delete(key);
  searchCache.set(key, { ts: Date.now(), products });
  while (searchCache.size > CACHE_MAX_ENTRIES) {
    const oldest = searchCache.keys().next().value;
    if (oldest === undefined) break;
    searchCache.delete(oldest);
  }
}

/** 테스트/스크립트용: 메모리 캐시 비우기 */
export function clearCoupangSearchCache(): void {
  searchCache.clear();
}

// ---------------------------------------------------------------------------
// 내부 요청 헬퍼
// ---------------------------------------------------------------------------

function getCredentials(): { accessKey: string; secretKey: string } {
  const accessKey = process.env.COUPANG_ACCESS_KEY;
  const secretKey = process.env.COUPANG_SECRET_KEY;
  if (!accessKey || !secretKey) {
    throw new CoupangApiError('not_configured', 'COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY 가 설정되지 않음');
  }
  return { accessKey, secretKey };
}

/** Next.js 서버 런타임 안에서 실행 중인지 (tsx 스크립트에서는 undefined) */
function isNextRuntime(): boolean {
  return typeof process !== 'undefined' && !!process.env.NEXT_RUNTIME;
}

function sanitizeMessage(text: string | undefined | null): string {
  return (text || '').replace(/\s+/g, ' ').trim().slice(0, 200);
}

function logWarn(message: string): void {
  // 키/서명은 절대 로그에 남기지 않는다.
  console.warn(`[coupang] ${message}`);
}

async function coupangRequest<T>(
  method: 'GET' | 'POST',
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  body?: unknown
): Promise<CoupangEnvelope<T>> {
  const { accessKey, secretKey } = getCredentials();
  const { url, headers } = buildSignedCoupangRequest({
    method,
    endpoint,
    params,
    accessKey,
    secretKey,
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  // Next.js 안에서만 Data Cache 옵션을 붙인다. plain Node fetch 는 알 수 없는 옵션을 무시하지만
  // 타입/동작을 분명히 하기 위해 런타임을 확인한다.
  // 참고: Authorization 헤더(signed-date)가 매 요청 다르므로 Next Data Cache 적중률은 낮다.
  //       실질적인 보호는 위의 메모리 캐시와 빌드 타임 카탈로그가 담당한다.
  const init: RequestInit & { next?: { revalidate?: number } } = {
    method,
    headers,
    signal: controller.signal,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...(isNextRuntime() ? { next: { revalidate: NEXT_REVALIDATE_SECONDS } } : {}),
  };

  let res: Response;
  let text: string;
  try {
    res = await fetch(url, init);
    text = await res.text();
  } catch (err: unknown) {
    const aborted = (err as { name?: string })?.name === 'AbortError';
    throw new CoupangApiError(
      aborted ? 'timeout' : 'network',
      aborted ? `요청 시간 초과 (${REQUEST_TIMEOUT_MS}ms)` : `네트워크 오류: ${sanitizeMessage((err as Error)?.message)}`
    );
  } finally {
    clearTimeout(timer);
  }

  let json: CoupangEnvelope<T> | null = null;
  const trimmed = text.trim();
  if (trimmed && !trimmed.startsWith('<')) {
    try {
      json = JSON.parse(trimmed) as CoupangEnvelope<T>;
    } catch {
      json = null;
    }
  }

  if (!res.ok) {
    const apiMessage = sanitizeMessage(json?.rMessage || json?.message) || (json ? '' : sanitizeMessage(trimmed));
    if (res.status === 429) {
      throw new CoupangApiError('rate_limit', `HTTP 429 레이트 리밋 — 호출을 중단하세요 ${apiMessage}`.trim(), 429);
    }
    if (res.status === 401 || res.status === 403) {
      throw new CoupangApiError(
        'auth',
        `HTTP ${res.status} 인증/권한 실패 — Access/Secret Key, 서버 시계, Open API 승인 상태를 확인하세요. ${apiMessage}`.trim(),
        res.status
      );
    }
    throw new CoupangApiError('http', `HTTP ${res.status} ${apiMessage}`.trim(), res.status);
  }

  if (!json) {
    throw new CoupangApiError('http', `HTTP ${res.status} JSON 이 아닌 응답: ${sanitizeMessage(trimmed) || '(빈 응답)'}`, res.status);
  }

  if (json.rCode !== undefined && json.rCode !== null && String(json.rCode) !== '0') {
    throw new CoupangApiError(
      'api',
      `rCode ${json.rCode}: ${sanitizeMessage(json.rMessage) || '알 수 없는 API 오류'}`,
      res.status,
      String(json.rCode)
    );
  }

  return json;
}

function forceHttps(url: string | undefined): string {
  if (!url) return '';
  return url.replace(/^http:\/\//i, 'https://');
}

function toProduct(item: CoupangSearchItem, keyword: string, fetchedAt: string): CoupangProduct | null {
  if (!item || item.productId === undefined || item.productId === null || !item.productUrl) return null;
  const price = typeof item.productPrice === 'number' ? item.productPrice : Number(item.productPrice);
  const product: CoupangProduct = {
    productId: item.productId,
    productName: String(item.productName || '').trim(),
    productPrice: Number.isFinite(price) ? price : 0,
    productImage: forceHttps(item.productImage),
    // 파트너스 정책: API 가 반환한 추적 URL 을 그대로 사용 (파라미터 추가/변경 금지)
    productUrl: item.productUrl,
    keyword,
    fetchedAt,
  };
  if (typeof item.isRocket === 'boolean') product.isRocket = item.isRocket;
  if (typeof item.isFreeShipping === 'boolean') product.isFreeShipping = item.isFreeShipping;
  if (item.categoryName) product.categoryName = item.categoryName;
  return product;
}

// ---------------------------------------------------------------------------
// 공개 API
// ---------------------------------------------------------------------------

export interface SearchCoupangOptions {
  /** 1~10 (API 최대 10). 기본 5 */
  limit?: number;
  /** 채널 ID. 기본 process.env.COUPANG_SUB_ID */
  subId?: string;
  /** '{w}x{h}' 예: '300x300'. 생략 시 쿠팡 기본값 */
  imageSize?: string;
  /** true 면 메모리 캐시를 건너뛴다 (배치 스크립트용) */
  skipCache?: boolean;
}

function resolveSearchOptions(opts?: SearchCoupangOptions) {
  const rawLimit = Number(opts?.limit ?? 5);
  const limit = Math.min(SEARCH_MAX_LIMIT, Math.max(1, Number.isFinite(rawLimit) ? Math.floor(rawLimit) : 5));
  const subId = (opts?.subId ?? process.env.COUPANG_SUB_ID ?? '').trim() || undefined;
  return { limit, subId, imageSize: opts?.imageSize, skipCache: !!opts?.skipCache };
}

/**
 * 키워드 검색 — 오류를 CoupangApiError 로 던지는 엄격한 버전.
 * 배치 스크립트처럼 429/401 을 구분해서 처리해야 하는 곳에서 사용한다.
 */
export async function searchCoupangProductsStrict(
  keyword: string,
  opts?: SearchCoupangOptions
): Promise<CoupangProduct[]> {
  const q = (keyword || '').trim();
  if (!q) return [];
  const { limit, subId, imageSize, skipCache } = resolveSearchOptions(opts);
  const key = cacheKey(q, limit, subId);

  if (!skipCache) {
    const cached = cacheGet(key);
    if (cached) return cached.slice(0, limit);
  }

  const json = await coupangRequest<CoupangSearchData>('GET', '/products/search', {
    keyword: q,
    limit,
    subId,
    imageSize,
  });

  const fetchedAt = new Date().toISOString();
  const items = json.data?.productData ?? [];
  const products = items
    .map((item) => toProduct(item, q, fetchedAt))
    .filter((p): p is CoupangProduct => p !== null)
    .slice(0, limit);

  cacheSet(key, products);
  return products;
}

/**
 * 키워드로 상품 검색. 추적 링크가 포함된 상품 목록을 반환한다.
 * 미설정/오류 시 빈 배열을 반환한다 (호출 측에서 폴백 처리).
 */
export async function searchCoupangProducts(
  keyword: string,
  opts?: { limit?: number; subId?: string }
): Promise<CoupangProduct[]> {
  if (!isCoupangConfigured()) return [];
  try {
    return await searchCoupangProductsStrict(keyword, opts);
  } catch (err: unknown) {
    const e = err as Partial<CoupangApiError>;
    logWarn(`search "${(keyword || '').trim().slice(0, 40)}" 실패 (${e?.kind || 'unknown'}): ${sanitizeMessage(e?.message)}`);
    return [];
  }
}

/**
 * 쿠팡 URL 목록을 파트너스 추적 딥링크로 변환한다 — 오류 시 CoupangApiError 를 던지는 엄격한 버전.
 * URL 은 https://www.coupang.com/vp/products/{productId} 처럼 추가 파라미터 없는 정식 URL 을 넘길 것
 * (파라미터가 붙어 있거나 판매 종료된 상품은 rCode 400 "url convert failed").
 */
export async function createCoupangDeeplinksStrict(
  urls: string[],
  subId?: string
): Promise<CoupangDeeplink[]> {
  const coupangUrls = (urls || []).map((u) => (u || '').trim()).filter(Boolean);
  if (coupangUrls.length === 0) return [];
  const resolvedSubId = (subId ?? process.env.COUPANG_SUB_ID ?? '').trim();

  const json = await coupangRequest<CoupangDeeplinkData>('POST', '/deeplink', undefined, {
    coupangUrls,
    ...(resolvedSubId ? { subId: resolvedSubId } : {}),
  });

  const data = Array.isArray(json.data) ? json.data : [];
  return data
    .filter((d) => d && d.landingUrl)
    .map((d) => ({
      originalUrl: d.originalUrl || '',
      shortenUrl: d.shortenUrl || '',
      landingUrl: d.landingUrl || '',
    }));
}

/**
 * 쿠팡 URL 목록을 파트너스 추적 딥링크로 변환한다.
 * 미설정/오류 시 빈 배열을 반환한다.
 */
export async function createCoupangDeeplinks(
  urls: string[],
  subId?: string
): Promise<CoupangDeeplink[]> {
  if (!isCoupangConfigured()) return [];
  try {
    return await createCoupangDeeplinksStrict(urls, subId);
  } catch (err: unknown) {
    const e = err as Partial<CoupangApiError>;
    logWarn(`deeplink ${urls?.length || 0}건 실패 (${e?.kind || 'unknown'}): ${sanitizeMessage(e?.message)}`);
    return [];
  }
}
