/**
 * Amazon 링크 클릭 집계 (Amazon 어소시에이트 가입 시점 판단용)
 *
 * POST /api/amazon-click/   ← AmazonClickTracker 가 sendBeacon 으로 호출
 *   body: { market: 'us' | 'jp', source: 'gift' | 'result' | 'blog' | 'home' | 'other' }
 *   국가는 Netlify 가 붙이는 요청 헤더(x-country / x-nf-geo)에서 읽는다.
 *   개인정보(IP, UA, 쿠키)는 저장하지 않는다. 클릭 1건 = Netlify Blobs 키 1개:
 *     c/<YYYY-MM-DD>/<market>/<country>/<source>/<timestamp>-<random>
 *   (키 하나에 한 건씩 쓰므로 동시 클릭이 서로 덮어쓰지 않는다)
 *
 * GET /api/amazon-click/?days=180   (Authorization: Bearer <AMAZON_CLICK_STATS_TOKEN>)
 *   → { generatedAt, days, rows: [{ date, market, country, source, count }] }
 *   토큰 환경변수가 없으면 503, 틀리면 401. scripts/check-amazon-readiness.ts 가 읽는다.
 */
import { NextResponse } from 'next/server';
import { getStore } from '@netlify/blobs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const STORE_NAME = 'amazon-clicks';
const MARKETS = new Set(['us', 'jp']);
const SOURCES = new Set(['gift', 'result', 'blog', 'home', 'other']);
const BOT_UA = /bot|crawl|spider|slurp|headless|preview|facebookexternalhit|lighthouse/i;
const MAX_DAYS = 400;

function store() {
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

/** Netlify 지역 헤더에서 ISO 국가 코드. 없으면 XX */
function countryFrom(req: Request): string {
  const direct = req.headers.get('x-country');
  if (direct && /^[A-Za-z]{2}$/.test(direct)) return direct.toUpperCase();
  const geo = req.headers.get('x-nf-geo');
  if (geo) {
    try {
      const parsed = JSON.parse(Buffer.from(geo, 'base64').toString('utf8'));
      const code = parsed?.country?.code;
      if (typeof code === 'string' && /^[A-Za-z]{2}$/.test(code)) return code.toUpperCase();
    } catch {
      // 형식이 다르면 무시
    }
  }
  return 'XX';
}

/** 한국 시간 기준 날짜 (주간 집계를 사이트 운영자 기준으로 맞춘다) */
function kstDate(now = new Date()): string {
  return new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  if (BOT_UA.test(req.headers.get('user-agent') || '')) {
    return new NextResponse(null, { status: 204 });
  }
  let body: { market?: unknown; source?: unknown } = {};
  try {
    body = JSON.parse(await req.text());
  } catch {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  const market = typeof body.market === 'string' ? body.market : '';
  const source = typeof body.source === 'string' && SOURCES.has(body.source) ? body.source : 'other';
  if (!MARKETS.has(market)) {
    return NextResponse.json({ error: 'invalid market' }, { status: 400 });
  }

  const key = `c/${kstDate()}/${market}/${countryFrom(req)}/${source}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  try {
    await store().set(key, '1');
  } catch (err) {
    // 로컬 개발(Netlify 컨텍스트 없음) 등 — 사용자 경험에는 영향 없도록 조용히 실패
    console.warn('[amazon-click] store unavailable:', (err as Error).message);
    return new NextResponse(null, { status: 204 });
  }
  return new NextResponse(null, { status: 204 });
}

export async function GET(req: Request) {
  const token = process.env.AMAZON_CLICK_STATS_TOKEN || '';
  if (!token) {
    return NextResponse.json({ error: 'stats token not configured' }, { status: 503 });
  }
  if (req.headers.get('authorization') !== `Bearer ${token}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const url = new URL(req.url);
  const days = Math.min(Math.max(Number.parseInt(url.searchParams.get('days') || '180', 10) || 180, 1), MAX_DAYS);
  const since = kstDate(new Date(Date.now() - (days - 1) * 86_400_000));

  const counts = new Map<string, number>();
  let blobs: { key: string }[] = [];
  try {
    ({ blobs } = await store().list({ prefix: 'c/' }));
  } catch (err) {
    return NextResponse.json({ error: `click store unavailable: ${(err as Error).message}` }, { status: 503 });
  }
  for (const { key } of blobs) {
    const [, date, market, country, source] = key.split('/');
    if (!date || date < since) continue;
    const k = `${date}|${market}|${country}|${source}`;
    counts.set(k, (counts.get(k) || 0) + 1);
  }

  const rows = [...counts.entries()]
    .map(([k, count]) => {
      const [date, market, country, source] = k.split('|');
      return { date, market, country, source, count };
    })
    .sort((a, b) => a.date.localeCompare(b.date) || a.market.localeCompare(b.market));

  return NextResponse.json(
    { generatedAt: new Date().toISOString(), since, days, rows },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
