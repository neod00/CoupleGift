/**
 * src/data/coupang/curated.json 검증 (의존성 없음)
 *
 *   node scripts/check-curated.mjs
 *
 * 규칙: id 고유, name/category/link 필수, link 는 파트너스 간편링크(https://link.coupang.com/... 또는
 * https://coupa.ng/...) 만, price 는 있으면 양의 정수, image 는 있으면 https. 링크에는 접속하지 않는다
 * (자동 접속은 파트너스 리포트에 가짜 클릭으로 잡힐 수 있음).
 */
import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'data', 'coupang', 'curated.json');
const LINK_HOSTS = ['link.coupang.com', 'coupa.ng'];

const errors = [];
let data;
try {
  data = JSON.parse(fs.readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`읽기 실패: ${e.message}`);
  process.exit(1);
}

const items = Array.isArray(data.items) ? data.items : null;
if (!items) {
  console.error('"items" 배열이 없습니다');
  process.exit(1);
}

const ids = new Set();
const links = new Set();
items.forEach((item, i) => {
  const where = `#${i + 1} (${item?.id ?? '?'})`;
  const text = (key) => typeof item?.[key] === 'string' && item[key].trim() !== '';
  for (const key of ['id', 'name', 'category', 'link']) {
    if (!text(key)) errors.push(`${where}: ${key} 가 비어 있음`);
  }
  if (text('id')) {
    if (ids.has(item.id)) errors.push(`${where}: id 중복`);
    ids.add(item.id);
  }
  if (text('link')) {
    try {
      const url = new URL(item.link);
      if (url.protocol !== 'https:' || !LINK_HOSTS.includes(url.hostname) || url.pathname.length <= 1) {
        errors.push(`${where}: link 는 파트너스 간편링크여야 함 (${item.link})`);
      }
    } catch {
      errors.push(`${where}: link 가 URL 이 아님`);
    }
    if (links.has(item.link)) errors.push(`${where}: 같은 링크가 두 번 있음`);
    links.add(item.link);
  }
  if (item?.price !== undefined && !(Number.isInteger(item.price) && item.price > 0)) {
    errors.push(`${where}: price 는 양의 정수여야 함`);
  }
  if (item?.image !== undefined && !(typeof item.image === 'string' && item.image.startsWith('https://'))) {
    errors.push(`${where}: image 는 https 주소여야 함`);
  }
});

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`curated.json OK — 상품 ${items.length}개`);
