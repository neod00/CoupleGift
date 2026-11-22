/**
 * 프로그래매틱 SEO 데이터 모듈
 * 성별 × 나이대 × 기념일 × 예산대 조합으로 수백 개의 고유 선물 추천 페이지를 자동 생성
 */
import { giftIdeas, type BudgetId, type GiftIdea, type OccasionId } from './giftIdeas';

// ============================================================
// 타입 정의
// ============================================================
export interface GiftPageData {
  slug: string;
  gender: string;
  ageGroup: string;
  occasion: string;
  budget: string;
  title: Record<string, string>;
  description: Record<string, string>;
  h1: Record<string, string>;
  suggestions: Record<string, string[]>;
  tips: Record<string, string[]>;
  /** 페이지에 보이는 FAQ (FAQPage 구조화 데이터와 동일 내용) */
  faq: Record<string, { q: string; a: string }[]>;
}

// ============================================================
// 차원 데이터 (Dimensions)
// ============================================================
export const genders = [
  { id: 'female', ko: '여성', en: 'Women', ja: '女性', koReceiver: '여자친구', enReceiver: 'Girlfriend', jaReceiver: '彼女' },
  { id: 'male', ko: '남성', en: 'Men', ja: '男性', koReceiver: '남자친구', enReceiver: 'Boyfriend', jaReceiver: '彼氏' },
];

export const ageGroups = [
  { id: '10s', ko: '10대', en: 'Teens', ja: '10代', range: '10-19' },
  { id: '20s', ko: '20대', en: '20s', ja: '20代', range: '20-29' },
  { id: '30s', ko: '30대', en: '30s', ja: '30代', range: '30-39' },
  { id: '40s', ko: '40대', en: '40s', ja: '40代', range: '40-49' },
  { id: '50s', ko: '50대', en: '50s', ja: '50代', range: '50-59' },
  { id: '60s', ko: '60대 이상', en: '60s+', ja: '60代以上', range: '60-70' },
];

export const occasions = [
  { id: 'birthday', ko: '생일', en: 'Birthday', ja: '誕生日' },
  { id: 'anniversary', ko: '기념일', en: 'Anniversary', ja: '記念日' },
  { id: '100days', ko: '100일', en: '100 Days', ja: '100日記念' },
  { id: 'christmas', ko: '크리스마스', en: 'Christmas', ja: 'クリスマス' },
  { id: 'valentines', ko: '밸런타인데이', en: "Valentine's Day", ja: 'バレンタインデー' },
  { id: 'whiteday', ko: '화이트데이', en: 'White Day', ja: 'ホワイトデー' },
  { id: 'graduation', ko: '졸업', en: 'Graduation', ja: '卒業' },
  { id: 'parents', ko: '어버이날', en: "Parents' Day", ja: '両親の日' },
];

export const budgets = [
  { id: 'under-3', ko: '3만원 이하', en: 'Under $30', ja: '3,000円以下', minKrw: 0, maxKrw: 30000 },
  { id: '3-5', ko: '3~5만원', en: '$30-$50', ja: '3,000〜5,000円', minKrw: 30000, maxKrw: 50000 },
  { id: '5-10', ko: '5~10만원', en: '$50-$100', ja: '5,000〜10,000円', minKrw: 50000, maxKrw: 100000 },
  { id: '10-20', ko: '10~20만원', en: '$100-$200', ja: '10,000〜20,000円', minKrw: 100000, maxKrw: 200000 },
  { id: 'over-20', ko: '20만원 이상', en: 'Over $200', ja: '20,000円以上', minKrw: 200000, maxKrw: 500000 },
];

// ============================================================
// 선물 추천 데이터 (성별 + 나이대별)
// ============================================================
const giftSuggestionsKo: Record<string, string[]> = {
  'female-10s': ['캐릭터 인형', '다이어리 세트', '에어팟 케이스', '립틴트', '문구 세트', '스티커 북', '미니 가방'],
  'female-20s': ['향수', '주얼리', '화장품 세트', '명품 지갑', 'AirPods', '디퓨저', '꽃다발', '패션 아이템'],
  'female-30s': ['프리미엄 화장품', '명품 가방', '스파 이용권', '고급 향수', '주얼리', '와인 세트', '여행 상품권'],
  'female-40s': ['건강 관리 기기', '프리미엄 화장품', '캐시미어 머플러', '고급 차 세트', '마사지 의자', '여행 상품권'],
  'female-50s': ['건강식품', '안마기', 'TV', '금목걸이', '여행 패키지', '고급 침구', '프리미엄 주방용품'],
  'female-60s': ['건강식품', '안마의자', '온열 기기', '가전제품', '여행 상품권', '금 장신구'],
  'male-10s': ['게임 기프트카드', '스포츠 용품', '블루투스 스피커', '스마트워치', '운동화', '헤드셋'],
  'male-20s': ['전자기기', '향수', '지갑', '시계', '운동화', '헤드폰', '백팩', '게임 콘솔'],
  'male-30s': ['프리미엄 시계', '전자기기', '골프 용품', '위스키', '명품 지갑', '노트북 가방', '캠핑 장비'],
  'male-40s': ['골프 웨어', '프리미엄 위스키', '안마기', '전자기기', '운동기구', '캠핑 장비', '고급 문구'],
  'male-50s': ['건강식품', '골프 용품', '안마의자', '전자기기', '여행 패키지', '프리미엄 차'],
  'male-60s': ['건강식품', '안마의자', '온열 기기', '혈압계', '여행 패키지', '등산 용품'],
};

const giftSuggestionsEn: Record<string, string[]> = {
  'female-10s': ['Character Plush', 'Diary Set', 'AirPods Case', 'Lip Tint', 'Stationery Set', 'Mini Bag'],
  'female-20s': ['Perfume', 'Jewelry', 'Cosmetics Set', 'Designer Wallet', 'AirPods', 'Diffuser', 'Flowers'],
  'female-30s': ['Premium Skincare', 'Designer Bag', 'Spa Voucher', 'Luxury Perfume', 'Jewelry', 'Wine Set'],
  'female-40s': ['Health Device', 'Premium Cosmetics', 'Cashmere Scarf', 'Tea Set', 'Massage Chair'],
  'female-50s': ['Health Supplements', 'Massager', 'Gold Necklace', 'Travel Package', 'Premium Cookware'],
  'female-60s': ['Health Supplements', 'Massage Chair', 'Heating Pad', 'Travel Voucher', 'Gold Jewelry'],
  'male-10s': ['Game Gift Card', 'Sports Gear', 'Bluetooth Speaker', 'Smartwatch', 'Sneakers', 'Headset'],
  'male-20s': ['Electronics', 'Cologne', 'Wallet', 'Watch', 'Sneakers', 'Headphones', 'Backpack'],
  'male-30s': ['Premium Watch', 'Electronics', 'Golf Gear', 'Whiskey', 'Laptop Bag', 'Camping Gear'],
  'male-40s': ['Golf Wear', 'Premium Whiskey', 'Massage Gun', 'Electronics', 'Camping Gear'],
  'male-50s': ['Health Supplements', 'Golf Gear', 'Massage Chair', 'Travel Package', 'Premium Tea'],
  'male-60s': ['Health Supplements', 'Massage Chair', 'Blood Pressure Monitor', 'Travel Package'],
};

const giftSuggestionsJa: Record<string, string[]> = {
  'female-10s': ['キャラクターぬいぐるみ', 'ダイアリーセット', 'AirPodsケース', 'リップティント', '文具セット'],
  'female-20s': ['香水', 'ジュエリー', '化粧品セット', 'ブランド財布', 'AirPods', 'ディフューザー', '花束'],
  'female-30s': ['プレミアム化粧品', 'ブランドバッグ', 'スパ利用券', '高級香水', 'ジュエリー', 'ワインセット'],
  'female-40s': ['健康管理機器', 'プレミアム化粧品', 'カシミアマフラー', '高級お茶セット', 'マッサージチェア'],
  'female-50s': ['健康食品', 'マッサージ器', 'ゴールドネックレス', '旅行パッケージ', '高級キッチン用品'],
  'female-60s': ['健康食品', 'マッサージチェア', '温熱機器', '旅行ギフト券', 'ゴールドジュエリー'],
  'male-10s': ['ゲームギフトカード', 'スポーツ用品', 'Bluetoothスピーカー', 'スマートウォッチ', 'スニーカー'],
  'male-20s': ['電子機器', '香水', '財布', '腕時計', 'スニーカー', 'ヘッドフォン', 'バックパック'],
  'male-30s': ['プレミアム腕時計', '電子機器', 'ゴルフ用品', 'ウイスキー', 'ノートPCバッグ', 'キャンプ用品'],
  'male-40s': ['ゴルフウェア', 'プレミアムウイスキー', 'マッサージガン', '電子機器', 'キャンプ用品'],
  'male-50s': ['健康食品', 'ゴルフ用品', 'マッサージチェア', '旅行パッケージ', 'プレミアムお茶'],
  'male-60s': ['健康食品', 'マッサージチェア', '血圧計', '旅行パッケージ', '登山用品'],
};

// ============================================================
// 기념일별 팁
// ============================================================
const occasionTipsKo: Record<string, string[]> = {
  birthday: ['상대방이 평소에 갖고 싶어했던 아이템을 기억해두세요', '서프라이즈 요소를 추가하면 더 감동적입니다', '직접 만든 카드를 함께 준비하면 좋습니다'],
  anniversary: ['함께한 시간을 상징하는 의미있는 선물이 좋습니다', '커플 아이템으로 특별함을 더하세요', '추억 사진 앨범도 감동적인 선물입니다'],
  '100days': ['처음 만난 날의 추억을 떠올리게 하는 선물', '커플 아이템(커플링, 커플 시계)이 인기입니다', '함께하는 경험 선물도 추천합니다'],
  christmas: ['겨울 감성에 맞는 따뜻한 선물이 인기입니다', '크리스마스 한정판 제품을 확인해보세요', '직접 포장하면 정성이 더 느껴집니다'],
  valentines: ['초콜릿과 함께 깜짝 선물을 준비하세요', '수제 초콜릿이나 프리미엄 브랜드가 인기입니다', '편지와 함께 전달하면 더 로맨틱합니다'],
  whiteday: ['발렌타인 답례 선물로 캔디 외에 특별한 것을 준비하세요', '향수나 주얼리 등 오래 기억에 남는 선물이 좋습니다'],
  graduation: ['새로운 시작을 축하하는 의미있는 선물', '실용적인 전자기기나 지갑이 인기입니다', '축하 메시지를 직접 작성해보세요'],
  parents: ['건강을 생각한 선물이 가장 좋습니다', '함께하는 시간(가족여행, 외식)도 좋은 선물입니다', '감사 편지를 함께 준비하세요'],
};

const occasionTipsEn: Record<string, string[]> = {
  birthday: ['Remember items they\'ve been wanting', 'Add a surprise element for extra impact', 'Include a handwritten card'],
  anniversary: ['Choose meaningful gifts that symbolize your time together', 'Couple items add a special touch', 'Memory photo albums make touching gifts'],
  '100days': ['Gifts that recall the day you first met', 'Couple items like matching rings are popular', 'Experience gifts are also great choices'],
  christmas: ['Warm, cozy gifts suit the winter season', 'Check for Christmas limited editions', 'Hand-wrapping shows extra thoughtfulness'],
  valentines: ['Prepare a surprise alongside chocolates', 'Handmade or premium brand chocolates are popular', 'A love letter adds a romantic touch'],
  whiteday: ['Go beyond candy for White Day returns', 'Long-lasting gifts like perfume or jewelry are ideal'],
  graduation: ['Meaningful gifts celebrating new beginnings', 'Practical electronics or wallets are popular', 'Write a heartfelt congratulations message'],
  parents: ['Health-focused gifts are the best choice', 'Quality time (family trip, dining out) is also a great gift', 'Include a thank-you letter'],
};

const occasionTipsJa: Record<string, string[]> = {
  birthday: ['相手が普段から欲しがっていたアイテムを覚えておきましょう', 'サプライズ要素を加えるとより感動的です', '手書きのカードを一緒に準備すると良いです'],
  anniversary: ['一緒に過ごした時間を象徴する意味のあるギフトがおすすめ', 'ペアアイテムで特別感を添えましょう', '思い出の写真アルバムも感動的なギフトです'],
  '100days': ['出会った日の思い出を蘇らせるギフト', 'ペアアイテム（ペアリング、ペアウォッチ）が人気です', '一緒に楽しめる体験ギフトもおすすめ'],
  christmas: ['冬の雰囲気に合った温かいギフトが人気', 'クリスマス限定品をチェックしてみましょう', '手作りラッピングで心が伝わります'],
  valentines: ['チョコレートと一緒にサプライズギフトを準備', '手作りやプレミアムブランドのチョコが人気', '手紙を添えるとよりロマンチックに'],
  whiteday: ['バレンタインのお返しにキャンディ以外の特別なものを', '長く思い出に残る香水やジュエリーがおすすめ'],
  graduation: ['新しいスタートを祝う意味のあるギフト', '実用的な電子機器や財布が人気', 'お祝いメッセージを直接書いてみましょう'],
  parents: ['健康を考えたギフトが最適', '一緒に過ごす時間（家族旅行、外食）も素敵なギフト', '感謝の手紙を一緒に準備しましょう'],
};

// ============================================================
// 영어 검색 표현 (미국 검색어는 "women in their 20s", "teen girls" 형태 — "20s Women" 직역은 어색함)
// ============================================================
function enAudience(genderId: string, ageId: string): string {
  const female = genderId === 'female';
  if (ageId === '10s') return female ? 'Teen Girls' : 'Teen Boys';
  if (ageId === '60s') return female ? 'Women Over 60' : 'Men Over 60';
  const decade = ageGroups.find(a => a.id === ageId)?.en || ageId;
  return `${female ? 'Women' : 'Men'} in Their ${decade}`;
}

const enOccasionTitle: Record<string, string> = {
  '100days': '100-Day Anniversary',
};

/** 설명문용 예산 구절: "under $30" / "between $30 and $50" / "over $200" */
function enBudgetPhrase(budgetId: string): string {
  const b = budgets.find(x => x.id === budgetId);
  if (!b) return '';
  if (b.id === 'under-3') return 'under $30';
  if (b.id === 'over-20') return 'over $200';
  const [lo, hi] = b.en.split('-');
  return `between ${lo} and ${hi}`;
}

// ============================================================
// 예산·기념일별 추천 선택 + 페이지별 FAQ
// (예산만 다른 페이지 5개가 같은 목록을 보여 주면 Google 이 중복 페이지로 본다 → 예산/기념일마다 실제로 다른 추천)
// ============================================================
const MAX_SUGGESTIONS = 7;
const MIN_SUGGESTIONS = 4;
const BUDGET_ORDER = ['under-3', '3-5', '5-10', '10-20', 'over-20'];

function pickIdeas(key: string, occasionId: string, budgetId: string): GiftIdea[] {
  const pool = giftIdeas[key] || [];
  const fits = (idea: GiftIdea, budget: string) =>
    idea.budgets.includes(budget as BudgetId) && (!idea.occasions || idea.occasions.includes(occasionId as OccasionId));
  // 기념일 전용 아이템을 앞에, 그다음 범용 아이템
  const rank = (idea: GiftIdea) => (idea.occasions ? 0 : 1);
  const picked = pool.filter(i => fits(i, budgetId)).sort((a, b) => rank(a) - rank(b));
  if (picked.length < MIN_SUGGESTIONS) {
    // 부족하면 인접 예산 구간에서 보충
    const at = BUDGET_ORDER.indexOf(budgetId);
    for (const near of [BUDGET_ORDER[at - 1], BUDGET_ORDER[at + 1]].filter(Boolean)) {
      for (const idea of pool.filter(i => fits(i, near))) {
        if (picked.length >= MIN_SUGGESTIONS) break;
        if (!picked.includes(idea)) picked.push(idea);
      }
    }
  }
  return picked.slice(0, MAX_SUGGESTIONS);
}

const budgetNote: Record<string, Record<string, string>> = {
  'under-3': {
    ko: '부담 없는 가격대라 매일 쓰는 소모품이나 작은 소품이 잘 맞고, 손편지를 더하면 가격보다 정성이 먼저 전해집니다.',
    en: 'At this price point, everyday treats and small upgrades work best - add a handwritten card and the thought outweighs the price.',
    ja: '気軽な価格帯なので、毎日使える消耗品や小物が向いています。手書きのメッセージを添えると気持ちがしっかり伝わります。',
  },
  '3-5': {
    ko: '가성비와 센스를 모두 보여 줄 수 있는 구간이라, 평소 쓰던 물건의 한 단계 좋은 버전을 고르면 실패가 적습니다.',
    en: 'This range lets you upgrade something they already use every day - a safe way to look thoughtful without overspending.',
    ja: '普段使いのものをワンランク上のものに替えると、失敗が少なくセンスも伝わる価格帯です。',
  },
  '5-10': {
    ko: '선물다운 선물을 고를 수 있는 가장 무난한 구간입니다. 브랜드 소품이나 취향이 확실한 아이템을 고르기 좋습니다.',
    en: 'The sweet spot for a proper gift: well-made brand accessories or something that matches a clear personal taste.',
    ja: 'ブランド小物や好みがはっきりしたアイテムを選びやすい、最も選択肢の多い価格帯です。',
  },
  '10-20': {
    ko: '오래 쓰는 물건을 고를 수 있는 구간입니다. 사이즈·색상 교환이 가능한지와 보증 여부를 꼭 확인하세요.',
    en: 'Enough for something they will use for years - check size or color exchanges and warranty before you buy.',
    ja: '長く使えるものを選べる価格帯です。サイズ・色の交換や保証の有無を必ず確認しましょう。',
  },
  'over-20': {
    ko: '기억에 남는 프리미엄 선물을 고를 수 있는 구간입니다. 각인이나 포장 같은 마무리까지 챙기면 가치가 더 커집니다.',
    en: 'Premium territory - a keepsake-level gift. Engraving or presentation details make it feel even more special.',
    ja: '記憶に残るプレミアムギフトを選べる価格帯です。刻印やラッピングまで気を配ると特別感が増します。',
  },
};

const occasionTiming: Record<string, Record<string, string>> = {
  birthday: { ko: '생일 1~2주 전에는 주문해 두세요. 각인·주문 제작 상품은 더 오래 걸립니다.', en: 'Order 1-2 weeks before the birthday; engraved or custom items take longer.', ja: '誕生日の1〜2週間前には注文しておきましょう。刻印・オーダー品はさらに時間がかかります。' },
  anniversary: { ko: '기념일 2주 전쯤 준비를 시작하면 각인·포장까지 여유 있게 챙길 수 있습니다.', en: 'Start about two weeks ahead so engraving and wrapping are not a last-minute rush.', ja: '記念日の2週間前から準備すると、刻印やラッピングまで余裕を持って用意できます。' },
  '100days': { ko: '사귄 날을 1일로 세는지 0일로 세는지 먼저 확인하고, 1~2주 전에 준비하세요.', en: 'Count the days carefully (some couples count day one as the first date) and prepare 1-2 weeks ahead.', ja: '付き合った日を1日目と数えるかを確認し、1〜2週間前には準備しましょう。' },
  christmas: { ko: '12월 중순 이후에는 배송이 몰리니 12월 초까지 주문하는 것이 안전합니다.', en: 'Shipping backs up from mid-December, so order by early December to be safe.', ja: '12月中旬以降は配送が混み合うため、12月初旬までの注文が安心です。' },
  valentines: { ko: '2월 첫째 주 안에 주문하면 배송 지연 걱정이 없습니다.', en: 'Order by the first week of February to avoid shipping delays.', ja: '2月の第1週までに注文すれば配送遅延の心配がありません。' },
  whiteday: { ko: '3월 첫째 주 안에 준비하고, 받은 선물보다 조금 더 신경 쓴 답례가 좋습니다.', en: 'Prepare by early March, and aim for a return gift a little more thoughtful than what you received.', ja: '3月の第1週までに準備し、いただいたものより少し気持ちを込めたお返しを選びましょう。' },
  graduation: { ko: '졸업식 1~2주 전에 준비하고, 새 출발에 바로 쓸 수 있는 물건이면 더 좋습니다.', en: 'Have it ready 1-2 weeks before the ceremony; something useful for the next chapter lands best.', ja: '卒業式の1〜2週間前に準備し、新生活ですぐ使えるものを選ぶと喜ばれます。' },
  parents: { ko: '기념일 1~2주 전에 주문하고, 건강 제품은 복용 중인 약이나 체질을 먼저 확인하세요.', en: 'Order 1-2 weeks ahead, and for health products check any medications or sensitivities first.', ja: '1〜2週間前には注文し、健康関連の品は服用中の薬や体質を先に確認しましょう。' },
};

const occasionAvoid: Record<string, Record<string, string>> = {
  birthday: { ko: '취향을 모르는 옷·향이 강한 제품, 이미 가진 물건과 겹치는 선물은 피하는 것이 좋습니다.', en: 'Skip clothes or strong scents when you are unsure of their taste, and anything they already own.', ja: '好みがわからない服や香りの強いもの、すでに持っているものと重なるギフトは避けましょう。' },
  anniversary: { ko: '집안일을 떠올리게 하는 생활가전이나 너무 실용적인 소모품은 기념일 분위기와 맞지 않습니다.', en: 'Household appliances and purely practical supplies rarely feel romantic on an anniversary.', ja: '家事を連想させる家電や実用一辺倒の消耗品は、記念日の雰囲気に合いにくいです。' },
  '100days': { ko: '너무 비싼 선물은 상대에게 부담이 될 수 있으니 의미 있는 커플 아이템이나 편지가 더 좋습니다.', en: 'Overly expensive gifts can feel like pressure this early - a meaningful couple item or a letter goes further.', ja: '高すぎるギフトは負担になることも。意味のあるペアアイテムや手紙のほうが喜ばれます。' },
  christmas: { ko: '시즌이 지나면 쓰기 어려운 한정 디자인 제품은 실용성이 떨어질 수 있습니다.', en: 'Holiday-only designs can be hard to use after the season, so lean toward year-round items.', ja: 'シーズンが過ぎると使いにくい限定デザインは避け、通年使えるものを選びましょう。' },
  valentines: { ko: '초콜릿만 주기보다는 작은 소품을 곁들이면 더 기억에 남습니다.', en: 'Chocolate alone is easy to forget - pair it with a small keepsake.', ja: 'チョコだけでなく小さな小物を添えると、より記憶に残ります。' },
  whiteday: { ko: '받은 선물과 가격 차이가 너무 크면 서로 부담스러울 수 있습니다.', en: 'A return gift far pricier than what you received can feel awkward for both of you.', ja: 'いただいたものと価格差が大きすぎると、お互いに気を遣わせてしまいます。' },
  graduation: { ko: '진로나 취향을 모르는 상태에서 고르는 전공·취미 용품은 피하는 것이 안전합니다.', en: 'Avoid hobby- or career-specific gear unless you know their plans.', ja: '進路や趣味がわからない場合は、専門的な道具は避けるのが無難です。' },
  parents: { ko: '효능을 단정하는 건강식품이나 사용법이 복잡한 기기는 피하고, 쉽게 쓸 수 있는 제품을 고르세요.', en: 'Skip supplements with big health claims or gadgets that are complicated to use.', ja: '効果をうたいすぎる健康食品や操作が複雑な機器は避け、使いやすいものを選びましょう。' },
};

/** 영어 문장 안 기념일 표기: 일반명사는 소문자, 고유명사(Christmas, Valentine's Day 등)는 그대로 */
function enOccasionInline(occasionEn: string): string {
  return /^(Birthday|Anniversary|Graduation|100-Day Anniversary)$/.test(occasionEn) ? occasionEn.toLowerCase() : occasionEn;
}

function buildFaq(
  labels: { audience: Record<string, string>; occasion: Record<string, string>; budget: Record<string, string> },
  occasionId: string,
  budgetId: string,
  ideas: Record<string, string[]>
): Record<string, { q: string; a: string }[]> {
  const list = (loc: string) => ideas[loc].slice(0, 3).join(loc === 'ko' ? ', ' : loc === 'ja' ? '、' : ', ');
  const faq: Record<string, { q: string; a: string }[]> = {};
  for (const loc of ['ko', 'en', 'ja']) {
    const a = labels.audience[loc], o = labels.occasion[loc], b = labels.budget[loc];
    const q1 = loc === 'ko' ? `${b} 예산으로 ${a} ${o} 선물은 뭐가 좋을까요?`
      : loc === 'ja' ? `${b}の予算で${a}への${o}ギフトは何がいい？`
      : `What is a good ${enOccasionInline(o)} gift for ${a.toLowerCase()} at ${b}?`;
    const a1 = loc === 'ko' ? `${list(loc)} 같은 선물이 이 예산에서 무난합니다. ${budgetNote[budgetId]?.[loc] || ''}`
      : loc === 'ja' ? `${list(loc)}などがこの予算で選びやすいギフトです。${budgetNote[budgetId]?.[loc] || ''}`
      : `${list(loc)} are reliable picks in this range. ${budgetNote[budgetId]?.[loc] || ''}`;
    const q2 = loc === 'ko' ? `${o} 선물은 언제 준비하면 좋을까요?` : loc === 'ja' ? `${o}のギフトはいつ準備すればいい？` : `When should I buy ${/^[aeiou]/i.test(enOccasionInline(o)) ? 'an' : 'a'} ${enOccasionInline(o)} gift?`;
    const q3 = loc === 'ko' ? `${o} 선물로 피해야 할 것이 있나요?` : loc === 'ja' ? `${o}のギフトで避けたほうがいいものは？` : `What should I avoid giving for ${/^[a-z0-9]/.test(enOccasionInline(o)) ? (/^[aeiou]/.test(enOccasionInline(o)) ? "an " : "a ") + enOccasionInline(o) : o}?`;
    faq[loc] = [
      { q: q1, a: a1.trim() },
      { q: q2, a: occasionTiming[occasionId]?.[loc] || occasionTiming.birthday[loc] },
      { q: q3, a: occasionAvoid[occasionId]?.[loc] || occasionAvoid.birthday[loc] },
    ];
  }
  return faq;
}

// ============================================================
// 선택된 조합의 페이지 생성 (주요 조합만 선별)
// ============================================================
export function generateAllPages(): GiftPageData[] {
  const pages: GiftPageData[] = [];

  for (const gender of genders) {
    for (const age of ageGroups) {
      for (const occasion of occasions) {
        for (const budget of budgets) {
          const slug = `${gender.id}-${age.id}-${occasion.id}-${budget.id}`;
          const key = `${gender.id}-${age.id}`;
          const audience = enAudience(gender.id, age.id);
          const occasionEn = enOccasionTitle[occasion.id] || occasion.en;

          // 예산·기념일별 추천 (데이터가 없으면 기존 성별·나이대 목록으로 폴백)
          const ideas = pickIdeas(key, occasion.id, budget.id);
          const suggestions = ideas.length > 0
            ? { ko: ideas.map(i => i.ko), en: ideas.map(i => i.en), ja: ideas.map(i => i.ja) }
            : {
              ko: giftSuggestionsKo[key] || giftSuggestionsKo['female-20s'],
              en: giftSuggestionsEn[key] || giftSuggestionsEn['female-20s'],
              ja: giftSuggestionsJa[key] || giftSuggestionsJa['female-20s'],
            };
          const n = Math.min(suggestions.ko.length, suggestions.en.length, suggestions.ja.length);
          const examples = (loc: 'ko' | 'en' | 'ja') => suggestions[loc].slice(0, 3).join(loc === 'ja' ? '、' : ', ');

          // 브랜드 접미사("| 선물지니")는 layout 의 title.template 이 붙이므로 여기서는 넣지 않는다 (중복 방지)
          pages.push({
            slug,
            gender: gender.id,
            ageGroup: age.id,
            occasion: occasion.id,
            budget: budget.id,
            title: {
              ko: `${age.ko} ${gender.ko} ${occasion.ko} 선물 추천 ${budget.ko}`,
              en: `${occasionEn} Gift Ideas for ${audience} (${budget.en})`,
              ja: `${age.ja}${gender.ja}の${occasion.ja}ギフト推薦 ${budget.ja}`,
            },
            description: {
              ko: `${budget.ko} 예산으로 고르는 ${age.ko} ${gender.ko} ${occasion.ko} 선물 ${n}가지: ${examples('ko')} 등. 고르는 팁과 준비 시기까지 정리했습니다.`,
              en: `${n} ${enOccasionInline(occasionEn)} gift ideas for ${audience.toLowerCase()} ${enBudgetPhrase(budget.id)} - ${examples('en')} and more, plus when to buy and what to avoid.`,
              ja: `${budget.ja}で選ぶ${age.ja}${gender.ja}への${occasion.ja}ギフト${n}選。${examples('ja')}など、選び方と準備のタイミングも紹介。`,
            },
            h1: {
              ko: `${age.ko} ${gender.ko} ${occasion.ko} 선물 추천 ${budget.ko} TOP ${n}`,
              en: `${n} ${occasionEn} Gifts for ${audience} (${budget.en})`,
              ja: `${age.ja}${gender.ja}の${occasion.ja}ギフト ${budget.ja} TOP${n}`,
            },
            suggestions,
            faq: buildFaq(
              {
                audience: { ko: `${age.ko} ${gender.ko}`, en: audience, ja: `${age.ja}${gender.ja}` },
                occasion: { ko: occasion.ko, en: occasionEn, ja: occasion.ja },
                budget: { ko: budget.ko, en: budget.en, ja: budget.ja },
              },
              occasion.id,
              budget.id,
              suggestions
            ),
            tips: {
              ko: occasionTipsKo[occasion.id] || occasionTipsKo.birthday,
              en: occasionTipsEn[occasion.id] || occasionTipsEn.birthday,
              ja: occasionTipsJa[occasion.id] || occasionTipsJa.birthday,
            },
          });
        }
      }
    }
  }

  return pages;
}

// 주요 페이지만 생성 (빌드 시간 절약을 위해 인기 조합만 선별)
export function generatePopularPages(): GiftPageData[] {
  const allPages = generateAllPages();
  const popularCombinations = [
    // 여성 20대 - 가장 검색량 높은 조합
    'female-20s-birthday', 'female-20s-anniversary', 'female-20s-100days', 'female-20s-christmas', 'female-20s-valentines',
    // 남성 20대
    'male-20s-birthday', 'male-20s-anniversary', 'male-20s-100days', 'male-20s-christmas',
    // 여성 30대
    'female-30s-birthday', 'female-30s-anniversary', 'female-30s-christmas',
    // 남성 30대
    'male-30s-birthday', 'male-30s-anniversary', 'male-30s-christmas',
    // 부모님 (50-60대)
    'female-50s-parents', 'male-50s-parents', 'female-60s-parents', 'male-60s-parents',
    'female-50s-birthday', 'male-50s-birthday',
    // 10대
    'female-10s-birthday', 'male-10s-birthday', 'female-10s-christmas', 'male-10s-christmas',
    // 졸업
    'female-20s-graduation', 'male-20s-graduation',
  ];

  return allPages.filter(page => {
    const prefix = `${page.gender}-${page.ageGroup}-${page.occasion}`;
    return popularCombinations.includes(prefix);
  });
}

// slug로 페이지 찾기
export function findPageBySlug(slug: string): GiftPageData | undefined {
  const allPages = generateAllPages();
  return allPages.find(p => p.slug === slug);
}

/** 사이트맵·정적 생성 대상(인기 조합)인지. 나머지 조합은 접속은 되지만 noindex */
export function isPopularPage(slug: string): boolean {
  return generatePopularPages().some(p => p.slug === slug);
}

// 관련 페이지 찾기 (같은 성별+나이대의 다른 기념일)
// 인기 조합 안에서만 링크한다 — noindex 페이지로 크롤링 예산이 새지 않게
export function findRelatedPages(page: GiftPageData, limit: number = 6): GiftPageData[] {
  const allPages = generatePopularPages();
  return allPages
    .filter(p => p.slug !== page.slug && (
      (p.gender === page.gender && p.ageGroup === page.ageGroup) ||
      (p.occasion === page.occasion && p.budget === page.budget)
    ))
    .slice(0, limit);
}
