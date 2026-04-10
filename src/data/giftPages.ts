/**
 * 프로그래매틱 SEO 데이터 모듈
 * 성별 × 나이대 × 기념일 × 예산대 조합으로 수백 개의 고유 선물 추천 페이지를 자동 생성
 */

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

          pages.push({
            slug,
            gender: gender.id,
            ageGroup: age.id,
            occasion: occasion.id,
            budget: budget.id,
            title: {
              ko: `${age.ko} ${gender.ko} ${occasion.ko} 선물 추천 ${budget.ko} | 선물지니`,
              en: `${occasion.en} Gift Ideas for ${age.en} ${gender.en} ${budget.en} | GiftGenie`,
              ja: `${age.ja}${gender.ja}の${occasion.ja}ギフト推薦 ${budget.ja} | ギフトジニー`,
            },
            description: {
              ko: `${age.ko} ${gender.ko}에게 딱 맞는 ${occasion.ko} 선물을 ${budget.ko} 예산으로 추천합니다. AI가 엄선한 맞춤형 선물 아이디어와 쿠팡 구매 링크.`,
              en: `Find the perfect ${occasion.en} gift for ${age.en} ${gender.en.toLowerCase()} within ${budget.en} budget. AI-curated personalized gift ideas.`,
              ja: `${age.ja}${gender.ja}にぴったりの${occasion.ja}ギフトを${budget.ja}の予算でおすすめ。AIが厳選したオーダーメイドギフトアイデア。`,
            },
            h1: {
              ko: `${age.ko} ${gender.ko} ${occasion.ko} 선물 추천 TOP 7`,
              en: `Top 7 ${occasion.en} Gifts for ${age.en} ${gender.en}`,
              ja: `${age.ja}${gender.ja}の${occasion.ja}ギフトTOP7`,
            },
            suggestions: {
              ko: giftSuggestionsKo[key] || giftSuggestionsKo['female-20s'],
              en: giftSuggestionsEn[key] || giftSuggestionsEn['female-20s'],
              ja: giftSuggestionsJa[key] || giftSuggestionsJa['female-20s'],
            },
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

// 관련 페이지 찾기 (같은 성별+나이대의 다른 기념일)
export function findRelatedPages(page: GiftPageData, limit: number = 6): GiftPageData[] {
  const allPages = generateAllPages();
  return allPages
    .filter(p => p.slug !== page.slug && (
      (p.gender === page.gender && p.ageGroup === page.ageGroup) ||
      (p.occasion === page.occasion && p.budget === page.budget)
    ))
    .slice(0, limit);
}
