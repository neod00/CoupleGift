// ============================================================
// Google AdSense 광고 슬롯 설정
// ============================================================
// 광고가 실제로 나오려면 AdSense 대시보드에서 "광고 단위"를 만들고
// 발급받은 슬롯 ID(숫자 10자리)를 여기에 넣어야 합니다.
//
// 설정 방법 (2가지 중 택 1):
//  A. Netlify 환경변수 설정 (권장):
//     Site configuration → Environment variables 에서
//     NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY / _IN_ARTICLE / _IN_FEED 추가 후 재배포
//  B. 아래 문자열('')에 슬롯 ID를 직접 붙여넣기 (예: '1234567890')
//
// 광고 단위 만드는 곳: https://adsense.google.com → 광고 → 광고 단위 기준
//  - "디스플레이 광고"  → display 슬롯
//  - "콘텐츠 내 자동 삽입 광고(In-article)" → inArticle 슬롯
//  - "인피드 광고(In-feed)" → inFeed 슬롯
// 자세한 안내: 저장소 루트의 MONETIZATION.md 참고
// ============================================================

export const ADSENSE_PUBLISHER_ID = (() => {
  const raw = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-5907754718994620';
  return raw.startsWith('pub-') ? `ca-${raw}` : raw;
})();

export const AD_SLOTS = {
  /** 일반 디스플레이 광고 (배너/사각형/반응형) */
  display: process.env.NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY || '',
  /** 블로그 본문 중간에 들어가는 In-article 광고 */
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE || '',
  /** 글 목록 사이에 들어가는 In-feed 광고 */
  inFeed: process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED || '',
};
