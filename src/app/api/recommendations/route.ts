/**
 * POST /api/recommendations
 *
 * 1) OpenAI 로 선물 추천 3~4개를 JSON 으로 받고
 * 2) 각 추천의 searchKeyword 로 실제 쿠팡 상품을 붙인다 (병렬):
 *      빌드 타임 카탈로그(src/data/coupang/products.json) → 파트너스 API(키가 있을 때만) → 없음
 *    상품이 있으면 imageUrl / coupangUrl(추적 링크) / price(실제 판매가) 를 상품 값으로 덮어쓰고
 *    모델의 가격 문자열은 estimatedPrice 로 보존한다. 없으면 쿠팡 일반 검색 URL 로 폴백하고
 *    imageUrl 은 비워 클라이언트(gptService)가 대체 이미지를 고르게 한다.
 * 3) OPENAI 키가 없으면 더미 추천을 돌려주되, 같은 방식으로 상품을 붙여 로컬에서도 흐름을 볼 수 있게 한다.
 *
 * 응답: { recommendations: EnrichedRecommendation[] }  (기존 { recommendations: [...] } 형태와 호환)
 * 키/오류 상세는 절대 응답에 포함하지 않는다.
 */
import { NextResponse } from 'next/server';
import type { CoupangProduct } from '@/lib/coupang/types';
import {
  isCoupangConfigured,
  searchCoupangProducts,
  buildCoupangSearchFallbackUrl,
} from '@/lib/coupang/client';
import { getProductsForKeyword, getProductsForText } from '@/lib/coupang/catalog';

// 요청 본문을 읽고 외부 API 를 호출하므로 항상 동적. sign.ts 가 Node crypto 를 쓰므로 nodejs 런타임.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** 추천 하나당 붙일 상품 수 (첫 번째는 메인 카드, 나머지는 "다른 옵션") */
const PRODUCTS_PER_REC = 3;
/** 한 요청에서 파트너스 API 를 실제로 호출하는 최대 횟수 (숨은 레이트 리밋 보호) */
const MAX_LIVE_API_CALLS_PER_REQUEST = 4;
/** OpenAI 응답 대기 상한 — Netlify 함수 타임아웃(기본 10초, 최대 26초) 안에 끝나도록 */
const OPENAI_TIMEOUT_MS = 20_000;
const KEYWORD_MAX_LENGTH = 50;

type LinkSource = 'api' | 'catalog' | 'fallback';

/** 모델이 돌려준 원본 형태 (필드가 빠지거나 타입이 다를 수 있음) */
interface RawRecommendation {
  id?: string | number;
  title?: string;
  description?: string;
  price?: string | number;
  category?: string;
  searchKeyword?: string;
}

interface EnrichedRecommendation {
  id: string;
  title: string;
  description: string;
  price: string;
  estimatedPrice: string;
  category: string;
  searchKeyword: string;
  imageUrl: string;
  coupangUrl: string;
  products: CoupangProduct[];
  source: LinkSource;
}

// ---------------------------------------------------------------------------
// 유틸
// ---------------------------------------------------------------------------

/** 59000 -> "59,000원" (ProductCard.formatKrw 와 동일한 표기) */
function formatKrw(price: number): string {
  const n = Number.isFinite(price) ? Math.round(price) : 0;
  return `${new Intl.NumberFormat('ko-KR').format(n)}원`;
}

function asString(value: unknown, fallback = ''): string {
  if (value === undefined || value === null) return fallback;
  const s = String(value).replace(/\s+/g, ' ').trim();
  return s || fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeRecommendation(raw: RawRecommendation | null | undefined, index: number) {
  const title = asString(raw?.title, `추천 선물 ${index + 1}`);
  const keyword = asString(raw?.searchKeyword, title).slice(0, KEYWORD_MAX_LENGTH);
  return {
    id: asString(raw?.id, String(index + 1)),
    title,
    description: asString(raw?.description),
    estimatedPrice: asString(raw?.price),
    category: asString(raw?.category, '기타'),
    searchKeyword: keyword,
  };
}

/** 모델 응답에서 JSON 객체를 최대한 복구 (코드 펜스, 앞뒤 잡음 제거) */
function parseModelJson(content: string): { recommendations?: RawRecommendation[] } {
  const trimmed = (content || '').trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    // ```json ... ``` 또는 앞뒤 설명 문장이 붙은 경우
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error('모델 응답이 JSON 형식이 아님');
  }
}

// ---------------------------------------------------------------------------
// 쿠팡 상품 매칭
// ---------------------------------------------------------------------------

function findCatalogProducts(keyword: string): CoupangProduct[] {
  const exact = getProductsForKeyword(keyword, PRODUCTS_PER_REC);
  if (exact.length > 0) return exact;
  return getProductsForText(keyword, PRODUCTS_PER_REC);
}

/**
 * 요청 단위 상품 조회기. 같은 키워드는 한 번만 조회하고, 라이브 API 호출 횟수를 제한한다.
 */
function createProductResolver() {
  const inflight = new Map<string, Promise<{ products: CoupangProduct[]; source: LinkSource }>>();
  let liveCalls = 0;
  const liveEnabled = isCoupangConfigured();

  return (keyword: string) => {
    const key = keyword.trim();
    if (!key) return Promise.resolve({ products: [] as CoupangProduct[], source: 'fallback' as LinkSource });

    const existing = inflight.get(key);
    if (existing) return existing;

    const task = (async () => {
      const fromCatalog = findCatalogProducts(key);
      if (fromCatalog.length > 0) return { products: fromCatalog, source: 'catalog' as LinkSource };

      if (liveEnabled && liveCalls < MAX_LIVE_API_CALLS_PER_REQUEST) {
        liveCalls += 1;
        // client.ts 가 오류를 삼키고 [] 를 돌려준다 (401/429 자동 재시도 없음)
        const fromApi = await searchCoupangProducts(key, { limit: PRODUCTS_PER_REC });
        if (fromApi.length > 0) return { products: fromApi, source: 'api' as LinkSource };
      }

      return { products: [] as CoupangProduct[], source: 'fallback' as LinkSource };
    })();

    inflight.set(key, task);
    return task;
  };
}

function toFallback(base: ReturnType<typeof normalizeRecommendation>): EnrichedRecommendation {
  return {
    ...base,
    price: base.estimatedPrice,
    imageUrl: '', // 비워두면 클라이언트가 카테고리 기반 대체 이미지를 고른다
    coupangUrl: buildCoupangSearchFallbackUrl(base.searchKeyword),
    products: [],
    source: 'fallback',
  };
}

async function enrichRecommendations(rawList: RawRecommendation[]): Promise<EnrichedRecommendation[]> {
  const bases = rawList.map((raw, index) => normalizeRecommendation(raw, index));
  const resolve = createProductResolver();

  const settled = await Promise.allSettled(
    bases.map(async (base): Promise<EnrichedRecommendation> => {
      const { products, source } = await resolve(base.searchKeyword);
      const top = products[0];
      if (!top) return toFallback(base);

      return {
        ...base,
        price: formatKrw(top.productPrice),
        imageUrl: top.productImage || '',
        // 파트너스 정책: API/카탈로그가 준 추적 URL 을 그대로 사용 (파라미터 추가/변경 금지)
        coupangUrl: top.productUrl,
        products,
        source,
      };
    })
  );

  // 개별 매칭 실패는 전체 응답을 깨지 않고 폴백으로 대체
  return settled.map((result, index) =>
    result.status === 'fulfilled' ? result.value : toFallback(bases[index])
  );
}

// ---------------------------------------------------------------------------
// 더미 (OPENAI 키가 없을 때) — 실제 검색 가능한 키워드를 써서 로컬에서도 상품 매칭 흐름이 보이게 한다
// ---------------------------------------------------------------------------

const DUMMY_RECOMMENDATIONS: RawRecommendation[] = [
  {
    id: 'test-1',
    title: '커플 목걸이 세트',
    description: 'API 키가 없을 때의 테스트 응답입니다 — 함께 착용하는 커플 목걸이',
    price: '45,000원',
    category: '액세서리',
    searchKeyword: '커플 목걸이',
  },
  {
    id: 'test-2',
    title: '무선 블루투스 이어폰',
    description: 'API 키가 없을 때의 테스트 응답입니다 — 출퇴근길에 쓰기 좋은 이어폰',
    price: '89,000원',
    category: '전자제품',
    searchKeyword: '무선 이어폰',
  },
  {
    id: 'test-3',
    title: '프리미엄 향수',
    description: 'API 키가 없을 때의 테스트 응답입니다 — 기념일에 어울리는 향수',
    price: '69,000원',
    category: '향수',
    searchKeyword: '향수',
  },
];

// ---------------------------------------------------------------------------
// 핸들러
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const formData = (await request.json().catch(() => ({}))) as Partial<{
      gender: string;
      age: number | string;
      personality: string;
      occasionType: string;
      minBudget: number | string;
      maxBudget: number | string;
      category: string;
      additionalInfo: string;
    }>;

    const API_KEY = process.env.OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY;

    if (!API_KEY) {
      console.warn('[api/recommendations] OPENAI_API_KEY 미설정 — 더미 추천 반환');
      const recommendations = await enrichRecommendations(DUMMY_RECOMMENDATIONS);
      return NextResponse.json({ recommendations }, { status: 200 }); // 기존 동작과 동일하게 200
    }

    const gender = formData.gender === 'male' ? '남성' : '여성';
    const age = asNumber(formData.age, 0);
    const minBudget = asNumber(formData.minBudget, 0);
    const maxBudget = asNumber(formData.maxBudget, 0);

    const prompt = `
당신은 커플 기념일 선물 추천 전문가입니다. 다음 정보를 바탕으로 3-4개의 선물을 추천해주세요.

상대방 정보:
- 성별: ${gender}
- 나이: ${age}세
- 성격/취향: ${asString(formData.personality, '정보 없음')}
- 기념일: ${asString(formData.occasionType, '정보 없음')}
- 예산: ${minBudget.toLocaleString('ko-KR')}원 ~ ${maxBudget.toLocaleString('ko-KR')}원
- 선호 카테고리: ${asString(formData.category, '전체')}
- 추가 정보: ${asString(formData.additionalInfo, '없음')}

다음 JSON 형식으로 정확히 답변해주세요:
{
  "recommendations": [
    {
      "id": "1",
      "title": "선물 이름",
      "description": "선물에 대한 간단한 설명 (50자 이내)",
      "price": "예상 가격 (예: 59,000원)",
      "category": "카테고리",
      "searchKeyword": "쿠팡 검색용 키워드 (구체적이고 간단하게)"
    }
  ]
}

주의사항:
- 예산 범위 내의 현실적인 가격으로 추천
- 성별, 나이, 성격을 고려한 맞춤형 추천
- 기념일 특성에 맞는 의미있는 선물 제안
- searchKeyword는 쿠팡에서 실제 검색 가능한 단순한 키워드로 작성 (예: "커플 목걸이", "무선 이어폰", "향수")
- JSON 형식을 정확히 지켜주세요
`;

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 커플 기념일 선물 추천 전문가입니다. 사용자의 요구사항을 분석하여 최적의 선물을 JSON 형식으로 추천해주세요.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.7,
      // JSON 모드 — 코드 펜스/설명 문장 없이 순수 JSON 객체만 돌려준다
      response_format: { type: 'json_object' },
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), OPENAI_TIMEOUT_MS);
    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      // 오류 본문은 로그에만 남긴다 (응답으로 내보내지 않음)
      const errorText = await response.text().catch(() => '');
      console.error(`[api/recommendations] OpenAI ${response.status}: ${errorText.slice(0, 300)}`);
      throw new Error(`OpenAI API 요청 실패: ${response.status}`);
    }

    const data = await response.json();
    const content: string = data?.choices?.[0]?.message?.content ?? '';
    const parsed = parseModelJson(content);
    const rawList = Array.isArray(parsed?.recommendations) ? parsed.recommendations : [];
    if (rawList.length === 0) {
      throw new Error('모델 응답에 recommendations 가 없음');
    }

    const recommendations = await enrichRecommendations(rawList);
    return NextResponse.json({ recommendations });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[api/recommendations] 처리 실패:', message);
    // 내부 오류 상세(모델 응답, 상태 코드 등)는 노출하지 않는다
    return NextResponse.json(
      {
        error: '추천을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
