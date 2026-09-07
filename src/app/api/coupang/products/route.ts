/**
 * GET /api/coupang/products?keyword=무선 이어폰&limit=3
 *
 * 1) 빌드 타임 카탈로그(src/data/coupang/products.json)에서 먼저 찾고
 * 2) 없으면 파트너스 API 키가 설정된 경우에만 라이브 검색 (메모리 캐시 6시간)
 * 3) 그래도 없으면 빈 배열
 *
 * 응답: { keyword, source: 'catalog' | 'api' | 'none', products: CoupangProduct[] }
 * 키/오류 내용은 절대 응답에 포함하지 않는다.
 */
import { NextResponse } from 'next/server';
import { getProductsForKeyword, getProductsForText } from '@/lib/coupang/catalog';
import { isCoupangConfigured, searchCoupangProducts } from '@/lib/coupang/client';
import type { CoupangProduct } from '@/lib/coupang/types';

// searchParams 를 읽으므로 항상 동적 렌더링. 빌드 시에는 절대 실행되지 않는다.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const KEYWORD_MAX_LENGTH = 50;
const LIMIT_DEFAULT = 3;
const LIMIT_MAX = 10;

const CACHE_HEADERS = {
  'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
  'CDN-Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400',
};

type Source = 'catalog' | 'api' | 'none';

function json(body: { keyword: string; source: Source; products: CoupangProduct[] }, status = 200) {
  return NextResponse.json(body, { status, headers: CACHE_HEADERS });
}

function parseLimit(raw: string | null): number {
  const n = Number.parseInt(raw ?? '', 10);
  if (!Number.isFinite(n)) return LIMIT_DEFAULT;
  return Math.min(LIMIT_MAX, Math.max(1, n));
}

export async function GET(request: Request) {
  let keyword = '';
  try {
    const { searchParams } = new URL(request.url);
    keyword = (searchParams.get('keyword') ?? '').replace(/\s+/g, ' ').trim();
    const limit = parseLimit(searchParams.get('limit'));

    if (!keyword || keyword.length > KEYWORD_MAX_LENGTH) {
      return NextResponse.json(
        { keyword, source: 'none' as Source, products: [], error: 'keyword 는 1~50자여야 합니다' },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 1) 카탈로그 — 정확 일치 → 텍스트 매칭
    let products = getProductsForKeyword(keyword, limit);
    if (products.length === 0) products = getProductsForText(keyword, limit);
    if (products.length > 0) return json({ keyword, source: 'catalog', products });

    // 2) 라이브 API (키가 있을 때만). 오류는 client 가 삼키고 [] 를 돌려준다.
    if (isCoupangConfigured()) {
      products = await searchCoupangProducts(keyword, { limit });
      if (products.length > 0) return json({ keyword, source: 'api', products });
    }

    return json({ keyword, source: 'none', products: [] });
  } catch (err) {
    // 오류 상세는 로그에만 남기고 응답에는 노출하지 않는다
    console.warn('[api/coupang/products] 처리 실패:', err instanceof Error ? err.message : String(err));
    return json({ keyword, source: 'none', products: [] });
  }
}
