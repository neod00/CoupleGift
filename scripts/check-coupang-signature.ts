/**
 * 쿠팡 파트너스 HMAC 서명 자가 점검 (네트워크 호출 없음)
 *
 *   npx tsx scripts/check-coupang-signature.ts
 *
 * 고정된 날짜/키/쿼리로 Authorization 헤더를 만들어 알려진 정답과 비교한다.
 * 파트너스 문서의 예시 값이나 다른 구현체와 비교할 때 사용한다.
 */
import {
  COUPANG_API_BASE_PATH,
  buildCoupangAuthorization,
  buildCoupangQuery,
  formatSignedDate,
} from '../src/lib/coupang/sign';

// n8n-nodes-coupang-partners 계약 테스트와 동일한 벡터
const ACCESS_KEY = 'ACC';
const SECRET_KEY = 'SEC';
const FIXED_NOW = new Date('2026-01-05T15:30:22.123Z');
const EXPECTED_SIGNED_DATE = '260105T153022Z';
const EXPECTED_SIGNATURE = '8ab30f95314427bf26b3595007bb2130f3304e7694dbb94a8f4cc1bcfa2dc26f';

const path = `${COUPANG_API_BASE_PATH}/products/search`;
const query = buildCoupangQuery({ keyword: '게이밍 노트북', limit: 10, srpLinkOnly: false, subId: '' });
const header = buildCoupangAuthorization({
  method: 'GET',
  path,
  query,
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
  now: FIXED_NOW,
});

const expectedHeader = `CEA algorithm=HmacSHA256, access-key=${ACCESS_KEY}, signed-date=${EXPECTED_SIGNED_DATE}, signature=${EXPECTED_SIGNATURE}`;

console.log('signed-date :', formatSignedDate(FIXED_NOW));
console.log('path        :', path);
console.log('query       :', query);
console.log('Authorization:', header);

const ok = header === expectedHeader;
console.log(ok ? 'OK — 알려진 정답과 일치합니다.' : `FAIL — 기대값:\n${expectedHeader}`);

const postHeader = buildCoupangAuthorization({
  method: 'POST',
  path: `${COUPANG_API_BASE_PATH}/deeplink`,
  accessKey: ACCESS_KEY,
  secretKey: SECRET_KEY,
  now: FIXED_NOW,
});
console.log('POST /deeplink Authorization:', postHeader);

process.exit(ok ? 0 : 1);
