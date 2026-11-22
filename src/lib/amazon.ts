/**
 * Amazon 링크 공용 헬퍼 (en → amazon.com, ja → amazon.co.jp)
 *
 * 제휴 태그는 Amazon 어소시에이트 승인 후 Netlify 환경변수로만 켠다:
 *   NEXT_PUBLIC_AMAZON_TAG_US  (예: giftgenie-20)
 *   NEXT_PUBLIC_AMAZON_TAG_JP  (예: giftgenie-22)
 * 태그가 없으면 일반 검색 링크이며, 이때는 "제휴 수수료를 받는다"는 고지를 하지 않는다
 * (가입하지 않은 상태에서 Amazon Associate 라고 표시하면 사실과 다르고 Amazon 정책에도 어긋난다).
 *
 * 가입 시점 판단: scripts/check-amazon-readiness.ts (클릭 수 기반)
 */

export type AmazonMarket = 'us' | 'jp';

/** 로케일 → Amazon 마켓 (ko 는 쿠팡을 쓰므로 null) */
export function amazonMarketFor(locale: string): AmazonMarket | null {
  if (locale === 'ja') return 'jp';
  if (locale === 'en') return 'us';
  return null;
}

/** 빌드 시점에 인라인되는 태그 (NEXT_PUBLIC_ 이므로 클라이언트에서도 사용 가능) */
export function amazonTag(market: AmazonMarket): string {
  const raw = market === 'jp' ? process.env.NEXT_PUBLIC_AMAZON_TAG_JP : process.env.NEXT_PUBLIC_AMAZON_TAG_US;
  const tag = (raw || '').trim();
  // 태그 형식: 영문/숫자/하이픈 (예: name-20, name-22)
  return /^[a-z0-9][a-z0-9-]{1,40}$/i.test(tag) ? tag : '';
}

export function isAmazonAffiliate(locale: string): boolean {
  const market = amazonMarketFor(locale);
  return market ? amazonTag(market) !== '' : false;
}

/** Amazon 검색 링크. 태그가 설정돼 있으면 tag= 를 붙인다 */
export function amazonSearchUrl(locale: string, keyword: string): string {
  const market = amazonMarketFor(locale) ?? 'us';
  const base = market === 'jp'
    ? `https://www.amazon.co.jp/s?k=${encodeURIComponent(`${keyword} ギフト`)}`
    : `https://www.amazon.com/s?k=${encodeURIComponent(`${keyword} gift`)}`;
  const tag = amazonTag(market);
  return tag ? `${base}&tag=${encodeURIComponent(tag)}` : base;
}

/**
 * en/ja 페이지 하단 고지 문구.
 * - 태그 설정됨: Amazon 이 요구하는 어소시에이트 고지
 * - 태그 없음: 링크가 Amazon 검색으로 연결된다는 사실만 (수수료 언급 없음)
 */
export function amazonDisclosure(locale: string): string {
  if (locale === 'ja') {
    return isAmazonAffiliate(locale)
      ? 'Amazonのアソシエイトとして、ギフトジニーは適格販売により収入を得ています。'
      : '商品リンクはAmazonの検索結果ページにつながります。';
  }
  return isAmazonAffiliate(locale)
    ? 'As an Amazon Associate, GiftGenie earns from qualifying purchases.'
    : 'Product links open Amazon search results.';
}
