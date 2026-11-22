/**
 * Amazon 어소시에이트(미국 amazon.com / 일본 amazon.co.jp) 가입 시점 판단
 *
 *   npx tsx scripts/check-amazon-readiness.ts                 # 라이브 집계 API 에서 읽기 (AMAZON_CLICK_STATS_TOKEN 필요)
 *   npx tsx scripts/check-amazon-readiness.ts --file x.json   # 저장된 집계 JSON 으로 판단
 *   npx tsx scripts/check-amazon-readiness.ts --self-test
 *   옵션: --json-out result.json  (워크플로가 결과를 읽을 때)
 *
 * 왜 이런 기준인가
 *   Amazon 은 신청 후 180일 안에 "적격 판매 3건"(본인 구매 제외)이 없으면 신청을 취소하고, 그 계정은 복구할 수 없다.
 *   그래서 "가입하면 180일 안에 3건을 넘길 확률"이 충분히 높을 때만 가입한다.
 *
 * 판단 로직 (마켓별, 해당 국가 방문자의 Amazon 클릭만 사용)
 *   1. 데이터: /api/amazon-click/ 집계 (us 마켓은 미국(US), jp 마켓은 일본(JP) 접속만. 운영자 국가 KR 은 제외)
 *   2. 최근 4주 평균 주간 클릭 → 180일 예상 클릭 = 주간 클릭 × 180/7
 *   3. 보수적 구매 전환율 2% 가정 → 예상 판매 λ. 포아송 분포로 P(판매 ≥ 3) = 1 − e^−λ(1 + λ + λ²/2)
 *   4. 꾸준함: 최근 8주 중 클릭이 있었던 주가 6주 이상 (측정 기간이 8주보다 짧으면 75% 이상)
 *   판정
 *     GO    : P(2%) ≥ 0.9 이고 꾸준함 충족           → 가입 권장
 *     WATCH : P(2%) ≥ 0.6 또는 P(5%) ≥ 0.9          → 조금 더 지켜보기
 *     WAIT  : 그 외                                   → 아직 이르다
 *     NODATA: 측정 기간 4주 미만                        → 판단 보류
 *   참고: P(2%) ≥ 0.9 가 되려면 λ ≥ 5.32 → 주당 약 10.3 클릭 (180일 약 266 클릭).
 */
import fs from 'fs';

export interface ClickRow { date: string; market: string; country: string; source: string; count: number }
export type Market = 'us' | 'jp';
export type Verdict = 'GO' | 'WATCH' | 'WAIT' | 'NODATA';

export const CONFIG = {
  targetCountries: { us: ['US'], jp: ['JP'] } as Record<Market, string[]>,
  excludedCountries: ['KR'], // 운영자 본인 테스트 클릭 제외
  minTrackingDays: 28,
  steadyWeeks: 8,
  rateWeeks: 4,
  conservativeConversion: 0.02,
  optimisticConversion: 0.05,
  goProbability: 0.9,
  watchProbability: 0.6,
  requiredSales: 3,
  windowDays: 180,
};

/** 포아송 P(X ≥ 3) */
export function probAtLeast3(lambda: number): number {
  if (lambda <= 0) return 0;
  return 1 - Math.exp(-lambda) * (1 + lambda + (lambda * lambda) / 2);
}

/** P(≥3) = target 이 되는 λ (이분법) */
export function lambdaFor(target: number): number {
  let lo = 0, hi = 50;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (probAtLeast3(mid) < target) lo = mid; else hi = mid;
  }
  return hi;
}

function addDays(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00Z`) + days * 86_400_000).toISOString().slice(0, 10);
}

export interface MarketResult {
  market: Market;
  verdict: Verdict;
  trackingDays: number;
  weekly: number[];        // 최근 → 과거 순, 해당 국가 클릭
  otherCountryClicks: number;
  /** 운영자 국가(KR) 클릭 — 판단에서는 빼지만 저장 확인용으로 보고 */
  excludedClicks: number;
  recentWeeklyAvg: number;
  expectedClicks180: number;
  probConservative: number;
  probOptimistic: number;
  activeWeeks: number;
  weeksConsidered: number;
  neededWeekly: number;
  reasons: string[];
}

/**
 * @param today   기준일 (YYYY-MM-DD, KST). 기준일 직전 7일이 "최근 1주".
 * @param trackingStart 측정 시작일. 없으면 데이터의 첫 날짜.
 */
export function evaluateMarket(rows: ClickRow[], market: Market, today: string, trackingStart?: string): MarketResult {
  const target = new Set(CONFIG.targetCountries[market]);
  const excluded = new Set(CONFIG.excludedCountries);
  const mine = rows.filter(r => r.market === market && !excluded.has(r.country));
  const excludedClicks = rows.filter(r => r.market === market && excluded.has(r.country)).reduce((s, r) => s + r.count, 0);
  const start = trackingStart || rows.map(r => r.date).sort()[0] || today;
  const trackingDays = Math.max(0, Math.round((Date.parse(`${today}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000));

  // 최근 8주 (week 0 = today-7 ~ today-1)
  const weekly: number[] = [];
  for (let w = 0; w < CONFIG.steadyWeeks; w++) {
    const from = addDays(today, -7 * (w + 1));
    const to = addDays(today, -7 * w); // exclusive
    weekly.push(mine.filter(r => target.has(r.country) && r.date >= from && r.date < to).reduce((s, r) => s + r.count, 0));
  }
  const otherCountryClicks = mine.filter(r => !target.has(r.country) && r.date >= addDays(today, -7 * CONFIG.steadyWeeks) && r.date < today)
    .reduce((s, r) => s + r.count, 0);

  const weeksAvailable = Math.min(CONFIG.steadyWeeks, Math.floor(trackingDays / 7));
  const rateWeeks = Math.max(1, Math.min(CONFIG.rateWeeks, weeksAvailable));
  const recentWeeklyAvg = weekly.slice(0, rateWeeks).reduce((s, n) => s + n, 0) / rateWeeks;
  const expectedClicks180 = recentWeeklyAvg * CONFIG.windowDays / 7;
  const probConservative = probAtLeast3(expectedClicks180 * CONFIG.conservativeConversion);
  const probOptimistic = probAtLeast3(expectedClicks180 * CONFIG.optimisticConversion);
  const weeksConsidered = Math.max(weeksAvailable, 1);
  const activeWeeks = weekly.slice(0, weeksConsidered).filter(n => n > 0).length;
  const steadyNeeded = weeksConsidered >= CONFIG.steadyWeeks ? 6 : Math.ceil(weeksConsidered * 0.75);
  const neededWeekly = lambdaFor(CONFIG.goProbability) / (CONFIG.conservativeConversion * CONFIG.windowDays / 7);

  const reasons: string[] = [];
  let verdict: Verdict;
  if (trackingDays < CONFIG.minTrackingDays) {
    verdict = 'NODATA';
    reasons.push(`측정 ${trackingDays}일 — 최소 ${CONFIG.minTrackingDays}일 필요`);
  } else if (probConservative >= CONFIG.goProbability && activeWeeks >= steadyNeeded) {
    verdict = 'GO';
    reasons.push(`보수적 가정(전환율 2%)에서도 180일 안에 3건 이상 팔릴 확률 ${(probConservative * 100).toFixed(0)}%`);
    reasons.push(`최근 ${weeksConsidered}주 중 ${activeWeeks}주에 클릭 — 꾸준함 충족`);
  } else {
    verdict = probConservative >= CONFIG.watchProbability || probOptimistic >= CONFIG.goProbability ? 'WATCH' : 'WAIT';
    if (probConservative < CONFIG.goProbability) {
      reasons.push(`주당 클릭 ${recentWeeklyAvg.toFixed(1)}회 — 가입 기준(주당 약 ${neededWeekly.toFixed(1)}회)에 못 미침`);
    }
    if (activeWeeks < steadyNeeded) {
      reasons.push(`클릭이 있었던 주 ${activeWeeks}/${weeksConsidered}주 — ${steadyNeeded}주 이상 필요`);
    }
  }
  return { market, verdict, trackingDays, weekly, otherCountryClicks, excludedClicks, recentWeeklyAvg, expectedClicks180, probConservative, probOptimistic, activeWeeks, weeksConsidered, neededWeekly, reasons };
}

const VERDICT_LABEL: Record<Verdict, string> = {
  GO: '✅ 가입 권장',
  WATCH: '🟡 조금 더 지켜보기',
  WAIT: '⏳ 아직 이르다',
  NODATA: '📊 데이터 수집 중',
};
const MARKET_LABEL: Record<Market, string> = { us: '미국 amazon.com', jp: '일본 amazon.co.jp' };

export function renderReport(results: MarketResult[], today: string): string {
  const lines = [`# Amazon 어소시에이트 가입 판단 (${today} 기준)`, ''];
  for (const r of results) {
    lines.push(`## ${MARKET_LABEL[r.market]} — ${VERDICT_LABEL[r.verdict]}`);
    lines.push('');
    lines.push(`- 측정 기간: ${r.trackingDays}일`);
    lines.push(`- 최근 주간 클릭(${r.market === 'us' ? '미국' : '일본'} 접속, 최근 주 → 과거): ${r.weekly.join(' / ')}`);
    lines.push(`- 최근 평균: 주당 ${r.recentWeeklyAvg.toFixed(1)}회 → 180일 예상 ${Math.round(r.expectedClicks180)}회`);
    lines.push(`- 180일 안에 3건 이상 판매될 확률: 전환율 2% 가정 ${(r.probConservative * 100).toFixed(0)}% / 5% 가정 ${(r.probOptimistic * 100).toFixed(0)}%`);
    lines.push(`- 가입 기준: 주당 약 ${r.neededWeekly.toFixed(1)}회 이상, 최근 8주 중 6주 이상 클릭`);
    if (r.otherCountryClicks > 0) lines.push(`- 참고: 다른 국가 접속 클릭 ${r.otherCountryClicks}회 (판단에서 제외)`);
    lines.push(`- 참고: 한국(운영자) 접속 클릭 ${r.excludedClicks}회 — 판단에서 제외, 저장 확인용`);
    for (const reason of r.reasons) lines.push(`- ${reason}`);
    lines.push('');
  }
  lines.push('> 기준: Amazon 은 신청 후 180일 안에 적격 판매 3건(본인 구매 제외)이 없으면 신청을 취소하고 계정을 복구할 수 없다.');
  return lines.join('\n');
}

function selfTest(): void {
  const assert = (cond: unknown, msg: string) => { if (!cond) throw new Error(`self-test failed: ${msg}`); };
  assert(Math.abs(probAtLeast3(5.32) - 0.9) < 0.01, 'P(>=3 | 5.32) ≈ 0.9');
  assert(Math.abs(lambdaFor(0.9) - 5.32) < 0.02, 'lambdaFor(0.9)');
  const today = '2027-01-31';
  const mk = (weeksBack: number, market: Market, country: string, count: number): ClickRow =>
    ({ date: addDays(today, -7 * weeksBack - 3), market, country, source: 'gift', count });
  // 8주 연속 주 12회 (미국) → GO
  const steady = Array.from({ length: 8 }, (_, w) => mk(w, 'us', 'US', 12));
  assert(evaluateMarket(steady, 'us', today, addDays(today, -70)).verdict === 'GO', 'steady 12/week → GO');
  // 한 주에 몰린 클릭 → 평균은 높아도 꾸준하지 않음
  const spike = [mk(0, 'us', 'US', 60)];
  assert(evaluateMarket(spike, 'us', today, addDays(today, -70)).verdict !== 'GO', 'single spike → not GO');
  // 주 5회 → WATCH (5% 가정이면 충분), 주 1회 → WAIT
  assert(evaluateMarket(Array.from({ length: 8 }, (_, w) => mk(w, 'jp', 'JP', 5)), 'jp', today, addDays(today, -70)).verdict === 'WATCH', '5/week → WATCH');
  assert(evaluateMarket(Array.from({ length: 8 }, (_, w) => mk(w, 'jp', 'JP', 1)), 'jp', today, addDays(today, -70)).verdict === 'WAIT', '1/week → WAIT');
  // 한국(운영자)·다른 국가 클릭은 판단에서 제외
  const krOnly = Array.from({ length: 8 }, (_, w) => mk(w, 'us', 'KR', 50));
  const krRes = evaluateMarket(krOnly, 'us', today, addDays(today, -70));
  assert(krRes.verdict === 'WAIT' && krRes.excludedClicks === 400, 'KR clicks excluded from verdict but counted');
  const other = Array.from({ length: 8 }, (_, w) => mk(w, 'us', 'CA', 50));
  const otherRes = evaluateMarket(other, 'us', today, addDays(today, -70));
  assert(otherRes.verdict === 'WAIT' && otherRes.otherCountryClicks === 400, 'other-country clicks reported but excluded');
  // 측정 3주 → NODATA
  assert(evaluateMarket(steady, 'us', today, addDays(today, -21)).verdict === 'NODATA', '< 28 days → NODATA');
  console.log('self-test: all assertions passed');
}

async function loadRows(args: string[]): Promise<{ rows: ClickRow[]; since?: string }> {
  const fileIdx = args.indexOf('--file');
  if (fileIdx >= 0) {
    const data = JSON.parse(fs.readFileSync(args[fileIdx + 1], 'utf8'));
    return { rows: data.rows || [], since: data.trackingStart };
  }
  const token = process.env.AMAZON_CLICK_STATS_TOKEN || '';
  if (!token) throw new Error('AMAZON_CLICK_STATS_TOKEN 이 없습니다 (Netlify 와 같은 값을 넣으세요)');
  const base = process.env.AMAZON_CLICK_STATS_URL || 'https://couplegift.netlify.app/api/amazon-click/';
  const res = await fetch(`${base}?days=180`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(`집계 API 응답 ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { rows: data.rows || [] };
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) return selfTest();

  const today = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
  const { rows, since } = await loadRows(args);
  // 측정 시작일: 환경변수로 고정 가능 (클릭이 한 건도 없던 기간도 측정 기간에 포함하기 위해)
  const trackingStart = process.env.AMAZON_TRACKING_START || since;
  const results = (['us', 'jp'] as Market[]).map(m => evaluateMarket(rows, m, today, trackingStart));
  const report = renderReport(results, today);
  console.log(report);

  if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + '\n');
  const outIdx = args.indexOf('--json-out');
  if (outIdx >= 0) {
    fs.writeFileSync(args[outIdx + 1], JSON.stringify({ today, report, results: results.map(r => ({ market: r.market, verdict: r.verdict })) }, null, 2));
  }
}

main().catch(err => {
  console.error('Error:', (err as Error).message);
  process.exit(1);
});
