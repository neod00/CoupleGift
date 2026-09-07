/**
 * 쿠팡 파트너스 상품 카탈로그 수집 스크립트
 *
 *   npx tsx scripts/fetch-coupang-products.ts [--force] [--limit N] [--dry-run] [--delay MS]
 *
 * 키워드 출처 (중복 제거):
 *   (a) src/data/giftPages.ts 의 모든 한국어 선물 추천 항목 (generateAllPages().suggestions.ko)
 *   (b) src/data/blog/posts/*.json 의 최상위 "productKeywords": string[] (있을 때만)
 *   (c) src/data/blog/keywords.json 각 항목의 productKeywords (파일이 있을 때만)
 *
 * 동작:
 *   - src/data/coupang/products.json 에 없거나 14일보다 오래된 키워드만 API 로 조회 (--force 면 전부)
 *   - 한 번 실행에 최대 --limit N 개 키워드 (기본 10), 호출 사이 --delay MS (기본 3000ms)
 *   - 429(레이트 리밋) 를 받으면 즉시 중단하고 지금까지 결과를 저장 (exit 0)
 *   - 401/403 이면 중단하고 결과 저장 후 exit 1 (키/승인 상태 확인 필요)
 *   - COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY 가 없으면 아무것도 하지 않고 exit 0 (CI 가 실패하지 않도록)
 *   - .env.local 이 있으면 읽어서 비어 있는 환경변수만 채운다 (추가 의존성 없음)
 *
 * 레이트 리밋 주의: 공식 문서는 분당 50회지만 커뮤니티에서는 시간당 ~10회의 숨은 제한이 보고된다.
 * 제한을 3회 위반하면 계정이 정지될 수 있으므로 429 는 절대 재시도하지 않는다.
 */
import fs from 'fs';
import path from 'path';
import { generateAllPages } from '../src/data/giftPages';
import {
  CoupangApiError,
  isCoupangConfigured,
  searchCoupangProductsStrict,
} from '../src/lib/coupang/client';
import type { CoupangProduct, ProductCatalog } from '../src/lib/coupang/types';

// ---------------------------------------------------------------------------
// 설정
// ---------------------------------------------------------------------------

const ROOT = process.cwd();
const CATALOG_PATH = path.join(ROOT, 'src', 'data', 'coupang', 'products.json');
const POSTS_DIR = path.join(ROOT, 'src', 'data', 'blog', 'posts');
const KEYWORDS_JSON = path.join(ROOT, 'src', 'data', 'blog', 'keywords.json');
const ENV_LOCAL = path.join(ROOT, '.env.local');

const STALE_DAYS = 14;
const DEFAULT_LIMIT = 10;
const DEFAULT_DELAY_MS = 3000;
/** 키워드당 저장할 상품 수 (API 최대 10) */
const PRODUCTS_PER_KEYWORD = 5;
const KEYWORD_MAX_LENGTH = 50;

// ---------------------------------------------------------------------------
// CLI / env
// ---------------------------------------------------------------------------

interface Options {
  force: boolean;
  dryRun: boolean;
  limit: number;
  delayMs: number;
}

function parseArgs(argv: string[]): Options {
  const opts: Options = { force: false, dryRun: false, limit: DEFAULT_LIMIT, delayMs: DEFAULT_DELAY_MS };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--force') opts.force = true;
    else if (arg === '--dry-run') opts.dryRun = true;
    else if (arg === '--limit' || arg.startsWith('--limit=')) {
      const raw = arg.includes('=') ? arg.split('=')[1] : argv[++i];
      const n = Number.parseInt(raw ?? '', 10);
      if (Number.isFinite(n) && n >= 0) opts.limit = n;
    } else if (arg === '--delay' || arg.startsWith('--delay=')) {
      const raw = arg.includes('=') ? arg.split('=')[1] : argv[++i];
      const n = Number.parseInt(raw ?? '', 10);
      if (Number.isFinite(n) && n >= 0) opts.delayMs = n;
    } else if (arg === '--help' || arg === '-h') {
      console.log('usage: npx tsx scripts/fetch-coupang-products.ts [--force] [--limit N] [--dry-run] [--delay MS]');
      process.exit(0);
    } else {
      console.warn(`알 수 없는 옵션 무시: ${arg}`);
    }
  }
  return opts;
}

/** .env.local 을 간단히 파싱해서 아직 설정되지 않은 변수만 채운다 */
function loadEnvLocal(): void {
  if (!fs.existsSync(ENV_LOCAL)) return;
  const lines = fs.readFileSync(ENV_LOCAL, 'utf8').split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let value = line.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    } else {
      const hash = value.indexOf(' #');
      if (hash >= 0) value = value.slice(0, hash).trim();
    }
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

// ---------------------------------------------------------------------------
// 키워드 수집
// ---------------------------------------------------------------------------

function normalizeKeyword(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const k = raw.replace(/\s+/g, ' ').trim();
  if (!k || k.length > KEYWORD_MAX_LENGTH) return null;
  return k;
}

function addAll(target: Set<string>, values: unknown): number {
  if (!Array.isArray(values)) return 0;
  let added = 0;
  for (const v of values) {
    const k = normalizeKeyword(v);
    if (k && !target.has(k)) {
      target.add(k);
      added++;
    }
  }
  return added;
}

function readJsonSafe(file: string): unknown {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    console.warn(`JSON 파싱 실패, 건너뜀: ${path.relative(ROOT, file)} (${(err as Error).message})`);
    return null;
  }
}

function collectKeywords(): string[] {
  const keywords = new Set<string>();

  // (a) 프로그래매틱 /gift 페이지의 한국어 추천 항목
  let fromPages = 0;
  for (const page of generateAllPages()) {
    fromPages += addAll(keywords, page.suggestions?.ko);
  }
  console.log(`키워드 출처 giftPages.ts: ${fromPages}개`);

  // (b) 블로그 글의 productKeywords
  let fromPosts = 0;
  if (fs.existsSync(POSTS_DIR)) {
    for (const file of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'))) {
      const post = readJsonSafe(path.join(POSTS_DIR, file)) as { productKeywords?: unknown } | null;
      fromPosts += addAll(keywords, post?.productKeywords);
    }
  }
  console.log(`키워드 출처 blog/posts/*.json productKeywords: ${fromPosts}개`);

  // (c) 키워드 엔진 파일 (배열 또는 { keywords: [...] } 형태 모두 허용)
  let fromKeywordFile = 0;
  if (fs.existsSync(KEYWORDS_JSON)) {
    const data = readJsonSafe(KEYWORDS_JSON) as unknown;
    const entries = Array.isArray(data)
      ? data
      : Array.isArray((data as { keywords?: unknown })?.keywords)
        ? ((data as { keywords: unknown[] }).keywords)
        : [];
    for (const entry of entries) {
      fromKeywordFile += addAll(keywords, (entry as { productKeywords?: unknown })?.productKeywords);
    }
  }
  console.log(`키워드 출처 blog/keywords.json productKeywords: ${fromKeywordFile}개`);

  return Array.from(keywords);
}

// ---------------------------------------------------------------------------
// 카탈로그 읽기/쓰기
// ---------------------------------------------------------------------------

function readCatalog(): ProductCatalog {
  const empty: ProductCatalog = { generatedAt: '', products: {} };
  if (!fs.existsSync(CATALOG_PATH)) return empty;
  const data = readJsonSafe(CATALOG_PATH) as Partial<ProductCatalog> | null;
  if (!data || typeof data !== 'object') return empty;
  return {
    generatedAt: typeof data.generatedAt === 'string' ? data.generatedAt : '',
    products: data.products && typeof data.products === 'object' ? data.products : {},
  };
}

function writeCatalog(catalog: ProductCatalog): void {
  // 키워드를 정렬해 저장하면 git diff 가 안정적이다
  const sorted: Record<string, CoupangProduct[]> = {};
  for (const key of Object.keys(catalog.products).sort((a, b) => a.localeCompare(b, 'ko'))) {
    sorted[key] = catalog.products[key];
  }
  const out: ProductCatalog = { generatedAt: catalog.generatedAt, products: sorted };
  fs.mkdirSync(path.dirname(CATALOG_PATH), { recursive: true });
  fs.writeFileSync(CATALOG_PATH, JSON.stringify(out, null, 2) + '\n', 'utf8');
}

/** 키워드 항목의 최신 fetchedAt (없으면 0) */
function keywordFetchedAt(products: CoupangProduct[] | undefined): number {
  if (!products || products.length === 0) return 0;
  let latest = 0;
  for (const p of products) {
    const t = p.fetchedAt ? Date.parse(p.fetchedAt) : NaN;
    if (Number.isFinite(t) && t > latest) latest = t;
  }
  return latest;
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function main(): Promise<number> {
  loadEnvLocal();
  const opts = parseArgs(process.argv.slice(2));
  console.log(
    `쿠팡 카탈로그 수집 시작 — force=${opts.force} dryRun=${opts.dryRun} limit=${opts.limit} delay=${opts.delayMs}ms`
  );

  if (!isCoupangConfigured()) {
    console.log(
      'COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY 가 설정되지 않아 API 호출을 건너뜁니다. ' +
        '(파트너스 최종 승인 후 partners.coupang.com → 링크 생성 → API 키 발급 → GitHub Secrets 등록) — 종료 코드 0'
    );
    return 0;
  }
  if (!process.env.COUPANG_SUB_ID) {
    console.warn('경고: COUPANG_SUB_ID 가 비어 있습니다. 파트너스에 등록된 채널 ID 를 넣어야 정산에 포함됩니다.');
  }

  const allKeywords = collectKeywords();
  console.log(`전체 고유 키워드: ${allKeywords.length}개`);

  const catalog = readCatalog();
  const now = Date.now();
  const staleBefore = now - STALE_DAYS * 24 * 60 * 60 * 1000;

  // 우선순위: 없는 키워드 → 오래된 키워드(오래된 순) → 이전에 결과가 0건이던 키워드
  const missing: string[] = [];
  const stale: Array<{ keyword: string; at: number }> = [];
  const emptyBefore: string[] = [];
  for (const keyword of allKeywords) {
    const existing = catalog.products[keyword];
    if (opts.force || existing === undefined) {
      missing.push(keyword);
    } else if (existing.length === 0) {
      emptyBefore.push(keyword);
    } else {
      const at = keywordFetchedAt(existing);
      if (at < staleBefore) stale.push({ keyword, at });
    }
  }
  stale.sort((a, b) => a.at - b.at);
  const queue = [...missing, ...stale.map((s) => s.keyword), ...emptyBefore];
  const fresh = allKeywords.length - queue.length;
  console.log(
    `조회 대상: 신규 ${missing.length} + ${STALE_DAYS}일 초과 ${stale.length} + 이전 0건 ${emptyBefore.length} = ${queue.length}개 (최신 ${fresh}개는 건너뜀)`
  );

  const targets = queue.slice(0, opts.limit);
  if (targets.length === 0) {
    console.log('조회할 키워드가 없습니다. 카탈로그가 최신 상태입니다.');
    return 0;
  }
  console.log(`이번 실행에서 ${targets.length}개 조회 (남은 대기 ${queue.length - targets.length}개)`);

  if (opts.dryRun) {
    for (const k of targets) console.log(`  [dry-run] ${k}`);
    return 0;
  }

  let fetched = 0;
  let totalProducts = 0;
  let stoppedBy: CoupangApiError | null = null;
  const softFailures: string[] = [];

  for (let i = 0; i < targets.length; i++) {
    const keyword = targets[i];
    try {
      const products = await searchCoupangProductsStrict(keyword, {
        limit: PRODUCTS_PER_KEYWORD,
        skipCache: true,
      });
      catalog.products[keyword] = products;
      fetched++;
      totalProducts += products.length;
      console.log(`  [${i + 1}/${targets.length}] ${keyword} → ${products.length}개`);
    } catch (err) {
      const e = err instanceof CoupangApiError ? err : null;
      if (e && e.shouldStop) {
        stoppedBy = e;
        console.error(`  [${i + 1}/${targets.length}] ${keyword} → 중단 (${e.kind}): ${e.message}`);
        break;
      }
      // 400/500/타임아웃 등 일시 오류: 이 키워드는 건너뛰고 계속 (다음 실행에서 재시도)
      softFailures.push(keyword);
      console.warn(`  [${i + 1}/${targets.length}] ${keyword} → 실패, 건너뜀: ${(err as Error).message}`);
    }
    if (i < targets.length - 1 && opts.delayMs > 0) await sleep(opts.delayMs);
  }

  if (fetched > 0) {
    catalog.generatedAt = new Date().toISOString();
    writeCatalog(catalog);
    console.log(
      `저장 완료: ${path.relative(ROOT, CATALOG_PATH)} — 키워드 ${fetched}개 갱신, 상품 ${totalProducts}개, 카탈로그 총 ${Object.keys(catalog.products).length}개 키워드`
    );
  } else {
    console.log('갱신된 키워드가 없어 카탈로그를 쓰지 않았습니다.');
  }
  if (softFailures.length > 0) {
    console.warn(`일시 실패 ${softFailures.length}개 (다음 실행에서 재시도): ${softFailures.slice(0, 10).join(', ')}${softFailures.length > 10 ? ' …' : ''}`);
  }

  if (stoppedBy) {
    if (stoppedBy.kind === 'rate_limit') {
      console.warn(
        `레이트 리밋(429)으로 조기 중단했습니다. 진행 상황은 저장했으며 자동 재시도하지 않습니다. ` +
          `다음 실행까지 기다리거나 --limit 를 줄이고 --delay 를 늘리세요. (남은 대기 ${queue.length - fetched}개)`
      );
      return 0;
    }
    console.error(
      `인증/권한 오류(${stoppedBy.status})로 중단했습니다. COUPANG_ACCESS_KEY / COUPANG_SECRET_KEY, 서버 시계, ` +
        `파트너스 Open API 승인 상태(24시간 정지 여부)를 확인하세요.`
    );
    return 1;
  }
  return 0;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('예상치 못한 오류:', err instanceof Error ? err.message : err);
    process.exit(1);
  });
