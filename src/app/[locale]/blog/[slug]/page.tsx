'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import CoupangDynamicBanner from '@/components/CoupangDynamicBanner';
import CoupangSearchWidget from '@/components/CoupangSearchWidget';

interface BlogPostFull {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
    content: string[];
}

const allPostsKo: BlogPostFull[] = [
    {
        id: 'valentine-day-guide',
        title: '밸런타인데이 완벽 가이드: 연인의 마음을 사로잡는 선물 아이디어',
        excerpt: '2026년 밸런타인데이를 특별하게 만들어줄 선물 아이디어와 이벤트 계획을 소개합니다.',
        date: '2026-02-13',
        category: '기념일',
        readTime: '5분',
        image: '💝',
        content: [
            '밸런타인데이는 사랑하는 사람에게 마음을 전하는 특별한 날입니다. 하지만 매년 반복되는 선물 고민, 이제 AI의 도움으로 해결해 보세요.',
            '## 🎁 2026년 인기 밸런타인데이 선물 TOP 5',
            '**1. 커플 아이템:** 커플링, 커플 시계, 커플 팔찌 등 함께 착용할 수 있는 아이템은 언제나 인기입니다. 특히 이니셜이나 기념일을 각인할 수 있는 제품이 인기가 많습니다.',
            '**2. 프리미엄 초콜릿:** 고디바, 린트, 로이즈 등 프리미엄 초콜릿 브랜드의 한정판 세트는 밸런타인데이의 클래식한 선물입니다.',
            '**3. 향수:** 조 말론, 딥디크, 바이레도 등 프리미엄 향수는 오래 기억에 남는 선물이 됩니다. 상대방의 취향을 미리 파악해 두세요.',
            '**4. 꽃다발 & 꽃 정기구독:** 장미꽃다발은 밸런타인데이의 상징이지만, 최근에는 꽃 정기구독 서비스도 인기입니다.',
            '**5. 체험 선물:** 쿠킹 클래스, 도자기 공방, 와인 테이스팅 등 함께 경험할 수 있는 선물이 특별한 추억을 만들어줍니다.',
            '## 💡 선물 고르기 팁',
            '선물을 고를 때 가장 중요한 것은 상대방의 취향과 관심사를 파악하는 것입니다. 평소 대화 속에서 힌트를 찾아보세요. 선물지니의 AI 추천 서비스를 이용하면 관계, 예산, 취향을 고려한 맞춤 추천을 받을 수 있습니다.',
            '## 📅 이벤트 계획 아이디어',
            '선물과 함께 특별한 이벤트를 계획하면 더욱 잊지 못할 밸런타인데이가 됩니다. 서프라이즈 편지, 사진 앨범 만들기, 특별한 장소에서의 디너 등을 고려해 보세요.'
        ]
    },
    {
        id: 'budget-gift-guide',
        title: '예산별 선물 가이드: 1만원부터 10만원까지 센스있는 선물 추천',
        excerpt: '제한된 예산으로도 센스있는 선물을 고를 수 있습니다. 가격대별로 엄선한 선물 아이디어와 선물 고르기 팁.',
        date: '2026-02-13',
        category: '선물 팁',
        readTime: '7분',
        image: '💰',
        content: [
            '선물의 가치는 가격이 아니라 마음에 달려 있습니다. 예산에 맞춰 센스있는 선물을 고르는 방법을 알아보겠습니다.',
            '## 💸 1만원 이하: 마음을 담은 소소한 선물',
            '**추천 아이템:** 핸드크림, 캔들, 양말 세트, 마스크팩 세트, 문구용품, 간식 선물 세트',
            '작은 예산이라도 정성스럽게 포장하면 훌륭한 선물이 됩니다. 상대방이 평소에 자주 쓰는 소모품을 고급 브랜드로 선물하는 것도 좋은 방법입니다.',
            '## 💳 1~3만원: 실용적이면서 센스있는 선물',
            '**추천 아이템:** 텀블러, 에코백, 향수 미니어처 세트, 책, 디퓨저, 블루투스 이어폰 케이스',
            '이 가격대에서는 실용성과 디자인성을 모두 갖춘 아이템을 찾을 수 있습니다.',
            '## 💎 3~5만원: 특별한 선물',
            '**추천 아이템:** 화장품 세트, 지갑, 무선 충전기, 캐릭터 피규어, 와인',
            '## 🎁 5~10만원: 프리미엄 선물',
            '**추천 아이템:** 프리미엄 향수, AirPods 케이스, 브랜드 액세서리, 고급 문구 세트',
            '예산이 넉넉하다면 상대방이 평소에 사고 싶었지만 망설였던 아이템을 선물하는 것이 가장 감동적입니다.'
        ]
    },
    {
        id: 'mbti-gift-guide',
        title: 'MBTI별 맞춤 선물 가이드: 성격 유형에 따른 완벽한 선물 찾기',
        excerpt: '16가지 MBTI 성격 유형별로 어울리는 선물을 추천합니다. 받는 분의 성격을 고려한 선물.',
        date: '2026-02-13',
        category: '선물 팁',
        readTime: '10분',
        image: '🧠',
        content: [
            'MBTI 성격 유형을 알면 상대방에게 딱 맞는 선물을 고를 수 있습니다. 각 유형별 특성과 추천 선물을 살펴보겠습니다.',
            '## 🔬 분석형 (NT): INTJ, INTP, ENTJ, ENTP',
            '분석형은 지적 호기심이 강하고 효율성을 중시합니다.',
            '**추천 선물:** 최신 전자기기, 전략 보드게임, 전문 서적, 온라인 강의 구독권, 스마트 가제트',
            '## 🛡️ 관리형 (SJ): ISTJ, ISFJ, ESTJ, ESFJ',
            '관리형은 실용적이고 전통을 중시합니다.',
            '**추천 선물:** 고급 다이어리, 프리미엄 지갑, 건강 관련 제품, 가정용품, 브랜드 의류',
            '## 🎨 외교형 (NF): INFJ, INFP, ENFJ, ENFP',
            '외교형은 감성적이고 의미를 중시합니다.',
            '**추천 선물:** 수제 공예품, 감성 캘리그라피, 향초, 시집, 체험형 선물(공방, 클래스)',
            '## 🏃 탐험형 (SP): ISTP, ISFP, ESTP, ESFP',
            '탐험형은 모험적이고 자유를 중시합니다.',
            '**추천 선물:** 액티비티 이용권, 스포츠 용품, 여행 관련 제품, 콘서트 티켓, 캠핑 용품',
            '## 💡 MBTI 활용 팁',
            '선물지니에서 상대방의 MBTI 유형과 취미를 입력하면, AI가 성격 특성에 맞는 맞춤 선물을 추천해 드립니다!'
        ]
    },
    {
        id: 'boyfriend-birthday-gifts',
        title: '20대 남자친구 생일 선물 추천 TOP 10 (2026 최신판)',
        excerpt: '실패 없는 20대 남자친구 생일 선물! 실용성과 센스를 겸비한 트렌디한 선물 아이템 10가지를 추천합니다.',
        date: '2026-04-10',
        category: '생일',
        readTime: '8분',
        image: '👔',
        content: [
            '20대 남자친구의 생일, 무엇을 사줘야 할지 고민이신가요? 뻔한 선물 대신 실용성과 센스를 모두 챙길 수 있는 최신 트렌드 선물 리스트를 준비했습니다.',
            '## 👔 20대 남자친구 생일 선물 고르는 기준',
            '20대 남성들은 주로 **실용성, 전자기기 관심도, 취미 생활**에 큰 가치를 둡니다. 평소에 자주 사용하는 물건을 프리미엄 브랜드로 업그레이드해주거나, 새로운 취미를 응원하는 아이템이 좋습니다.',
            '## 💻 실용성 1위! 전자기기 및 테크 아이템',
            '**1. 스마트워치 스트랩 & 액세서리 세트:** 애플워치나 갤럭시워치를 이미 가지고 있다면, 질리지 않게 착용할 수 있는 프리미엄 가죽 스트랩이나 메탈 스트랩이 훌륭한 선물이 됩니다.',
            '**2. 무선 노이즈캔슬링 이어폰:** 출퇴근길이나 운동할 때 필수인 무선 이어폰! 최신 모델로 바꿔주면 삶의 질이 수직 상승합니다.',
            '**3. 기계식 커스텀 키보드:** 코딩이나 게임, 문서 작업이 많은 남자친구라면 타이핑 치는 맛을 향상시켜주는 기계식 키보드가 최고의 선물입니다.',
            '## 👟 매일 함께하는 데일리 아이템',
            '**4. 프리미엄 카드 지갑:** 두꺼운 지갑보다는 삼성페이/애플페이와 함께 가볍게 들고 다닐 수 있는 질 좋은 명품 카드 지갑을 추천합니다.',
            '**5. 니치 향수 (우디 계열):** 남성들이 선호하는 깔끔하고 중성적인 향수(딥디크, 르라보, 조말론 등)는 센스 있는 여자친구가 되기 위한 좋은 아이템입니다.',
            '**6. 브랜드 맨투맨 & 후드티:** 봄, 가을에 편하게 입을 수 있는 깔끔한 디자인의 브랜드 상의는 절대 실패하지 않습니다.',
            '## 💡 선물 고르기 꿀팁',
            '선물지니 사이트에서 남자친구의 구체적인 취향과 예산을 선택하고 AI에게 맞춤형 선물을 물어보세요!'
        ]
    },
    {
        id: 'housewarming-gifts',
        title: '집들이 선물 리스트: 휴지 대신 센스있다고 칭찬받는 아이템',
        excerpt: '흔한 휴지나 세제는 이제 그만! 집주인의 취향을 저격하고 실용성까지 갖춘 센스 만점 집들이 선물 아이디어를 소개합니다.',
        date: '2026-04-10',
        category: '집들이',
        readTime: '6분',
        image: '🏠',
        content: [
            '과거에는 집들이 갈 때 두루마리 휴지나 세제를 사가는 것이 "국룰"이었지만, 요즘은 실용적이면서도 인테리어를 해치지 않는 센스 있는 선물을 더 환영합니다.',
            '## 🏠 인테리어를 빛내주는 감성 소품',
            '**1. 프리미엄 디퓨저 & 인센스 스틱:** 이사 직후 새집 냄새를 잡아주고 공간에 고급스러운 향기를 채워주는 디퓨저는 호불호 없는 선물입니다.',
            '**2. 디자인 무드등 (테이블 램프):** 집안의 분위기를 따뜻하게 만들어주는 작고 예쁜 조명은 인테리어 초보자에게도 유용합니다.',
            '**3. 감각적인 화병과 생화:** 오브제로도 활용 가능한 디자인 화병과 기분 좋은 생화 다발은 집주인을 미소 짓게 합니다.',
            '## ☕ 자취생 및 신혼부부 맞춤 소형 가전',
            '**4. 캡슐 커피 머신:** 홈카페를 즐기는 사람에게 필수! 예쁜 디자인의 커피 머신은 실용성 1위에 꼽힙니다.',
            '**5. 와인잔 세트 및 전동 오프너:** 홈파티를 즐기고 와인을 좋아하는 친구라면 무조건 환영받는 선물입니다.',
            '## 💡 센스 있는 집들이 팁',
            '선물 받을 분의 집 인테리어 톤(화이트, 우드, 모던 등)을 미리 파악해 두면 더욱 마음에 쏙 드는 선물을 고를 수 있습니다.'
        ]
    }
];

const allPostsEn: BlogPostFull[] = [
    {
        id: 'valentine-day-guide',
        title: "Valentine's Day Complete Guide: Gift Ideas to Capture Your Partner's Heart",
        excerpt: "Discover gift ideas and event plans that will make Valentine's Day 2026 special.",
        date: '2026-02-13',
        category: 'Anniversary',
        readTime: '5 min',
        image: '💝',
        content: [
            "Valentine's Day is a special occasion to express your love. Let AI help you find the perfect gift this year.",
            "## 🎁 Top 5 Popular Valentine's Day Gifts for 2026",
            "**1. Couple Items:** Matching rings, watches, and bracelets that you can wear together are always popular. Products with personalized engravings are especially sought after.",
            "**2. Premium Chocolate:** Limited edition sets from premium brands like Godiva, Lindt, and Royce make classic Valentine's gifts.",
            "**3. Perfume:** Premium fragrances from Jo Malone, Diptyque, and Byredo make memorable gifts. Learn your partner's preferences beforehand.",
            "**4. Flowers & Flower Subscriptions:** Rose bouquets are a Valentine's classic, but flower subscription services are also gaining popularity.",
            "**5. Experience Gifts:** Cooking classes, pottery workshops, and wine tastings create special memories together.",
            "## 💡 Gift Selection Tips",
            "The most important thing when choosing a gift is understanding your partner's tastes and interests. Look for hints in your everyday conversations. GiftGenie's AI recommendation service considers your relationship, budget, and preferences for personalized suggestions.",
            "## 📅 Event Planning Ideas",
            "Planning a special event alongside your gift makes for an unforgettable Valentine's Day. Consider surprise letters, photo albums, or dinners at special locations."
        ]
    },
    {
        id: 'budget-gift-guide',
        title: 'Budget Gift Guide: Thoughtful Recommendations from $10 to $100',
        excerpt: "You can choose thoughtful gifts even with a limited budget. Gift ideas and tips by price range.",
        date: '2026-02-13',
        category: 'Gift Tips',
        readTime: '7 min',
        image: '💰',
        content: [
            "The value of a gift lies not in its price, but in the thought behind it. Let's explore how to choose thoughtful gifts within your budget.",
            "## 💸 Under $10: Small but Meaningful Gifts",
            "**Recommended Items:** Hand cream, candles, sock sets, face mask sets, stationery, snack gift sets",
            "Even with a small budget, thoughtful packaging can make a wonderful gift.",
            "## 💳 $10-$30: Practical and Thoughtful Gifts",
            "**Recommended Items:** Tumblers, eco bags, mini perfume sets, books, diffusers",
            "## 💎 $30-$50: Special Gifts",
            "**Recommended Items:** Cosmetics sets, wallets, wireless chargers, wine",
            "## 🎁 $50-$100: Premium Gifts",
            "**Recommended Items:** Premium perfume, AirPods cases, brand accessories, luxury stationery sets",
            "If your budget allows, gifting something your partner has been wanting but hesitating to buy is the most touching gesture."
        ]
    },
    {
        id: 'mbti-gift-guide',
        title: 'MBTI Gift Guide: Finding the Perfect Gift by Personality Type',
        excerpt: "We recommend gifts that suit each of the 16 MBTI personality types.",
        date: '2026-02-13',
        category: 'Gift Tips',
        readTime: '10 min',
        image: '🧠',
        content: [
            "Knowing someone's MBTI personality type can help you choose the perfect gift. Let's explore recommended gifts for each type.",
            "## 🔬 Analysts (NT): INTJ, INTP, ENTJ, ENTP",
            "Analysts are intellectually curious and value efficiency.",
            "**Recommended Gifts:** Latest tech gadgets, strategy board games, professional books, online course subscriptions",
            "## 🛡️ Sentinels (SJ): ISTJ, ISFJ, ESTJ, ESFJ",
            "Sentinels are practical and value tradition.",
            "**Recommended Gifts:** Premium planners, quality wallets, health products, home goods, brand clothing",
            "## 🎨 Diplomats (NF): INFJ, INFP, ENFJ, ENFP",
            "Diplomats are emotional and value meaning.",
            "**Recommended Gifts:** Handmade crafts, calligraphy, scented candles, poetry, experience gifts",
            "## 🏃 Explorers (SP): ISTP, ISFP, ESTP, ESFP",
            "Explorers are adventurous and value freedom.",
            "**Recommended Gifts:** Activity passes, sports equipment, travel accessories, concert tickets, camping gear",
            "## 💡 MBTI Tips",
            "Enter your partner's MBTI type and hobbies in GiftGenie, and our AI will recommend personalized gifts based on their personality!"
        ]
    },
    {
        id: 'boyfriend-birthday-gifts',
        title: 'Top 10 Birthday Gift Ideas for 20-something Boyfriends (2026 Edition)',
        excerpt: 'Foolproof birthday gifts for your boyfriend! We recommend 10 trendy and practical gift items.',
        date: '2026-04-10',
        category: 'Birthday',
        readTime: '8 min',
        image: '👔',
        content: [
            "Are you struggling to find a gift for your 20-something boyfriend's birthday? We've prepared a trendy list of gifts packed with both practicality and style, instead of the usual boring stuff.",
            "## 👔 Criteria for Choosing a Boyfriend's Birthday Gift",
            "Men in their 20s highly value **practicality, tech gadgets, and their hobbies**. Upgrading an item they use daily to a premium brand or supporting a new hobby is always a great choice.",
            "## 💻 Practicality #1! Tech Gadgets",
            "**1. Smartwatch Straps & Accessory Sets:** If he already owns an Apple Watch or Galaxy Watch, premium leather or metal straps make excellent gifts to give his watch a fresh look.",
            "**2. Wireless Noise-Canceling Earphones:** A must-have for commuting and working out! Upgrading his earphones to the latest model will drastically improve his quality of life.",
            "**3. Mechanical Custom Keyboards:** For boyfriends who code, game, or do a lot of typing, a mechanical keyboard that enhances the typing experience is the ultimate gift.",
            "## 👟 Daily Items He's Always With",
            "**4. Premium Card Wallet:** Rather than a bulky wallet, a high-quality designer card wallet that he can easily carry around alongside mobile payments is highly recommended.",
            "**5. Niche Perfumes (Woody notes):** Clean and gender-neutral fragrances (like Diptyque, Le Labo, and Jo Malone) preferred by men are great items to show your sophisticated taste.",
            "**6. Brand Sweatshirts & Hoodies:** Clean, branded tops that he can wear comfortably in spring and fall will never fail.",
            "## 💡 Gift Selection Tip",
            "Select his specific tastes and your budget on the GiftGenie website, and ask our AI for customized gift recommendations!"
        ]
    },
    {
        id: 'housewarming-gifts',
        title: 'Housewarming Gifts: Stop Giving Toilet Paper and Gift These Clever Items',
        excerpt: 'Say goodbye to common detergents! Discover clever housewarming gift ideas that are practical and suit the host\'s taste.',
        date: '2026-04-10',
        category: 'Housewarming',
        readTime: '6 min',
        image: '🏠',
        content: [
            "In the past, giving toilet paper or detergent as a housewarming gift was the norm. However, these days, clever gifts that are practical and well-aligned with the host's interior taste are much more welcomed.",
            "## 🏠 Aesthetic Items That Brighten Up the Interior",
            "**1. Premium Diffusers & Incense Sticks:** Removing the 'new house smell' right after moving in and filling the space with a luxurious scent, a diffuser is a universally loved gift.",
            "**2. Design Mood Lights (Table Lamps):** Small, pretty lighting that makes the house atmosphere warmer is useful even for people who are beginners at home interior design.",
            "**3. Aesthetic Vases & Fresh Flowers:** A beautifully designed vase that acts as a decorative object, accompanied by a delightful bouquet of fresh flowers, will make the host smile.",
            "## ☕ Small Appliances Tailored for Singles and Newlyweds",
            "**4. Capsule Coffee Machines:** Essential for those who enjoy a home cafe! A beautifully designed coffee machine is ranked #1 in practicality.",
            "**5. Wine Glass Sets & Electric Openers:** If your friend enjoys home parties and wine, this is a gift they will undoubtedly welcome.",
            "## 💡 Clever Housewarming Tip",
            "If you get a grasp of the color tone of the recipient's home interior (white, wood, modern, etc.) beforehand, you can pick a gift they will absolutely fall in love with."
        ]
    }
];

const allPostsJa: BlogPostFull[] = [
    {
        id: 'valentine-day-guide',
        title: 'バレンタインデー完全ガイド：恋人の心を掴むギフトアイデア',
        excerpt: '2026年のバレンタインデーを特別にするギフトアイデアとイベント計画をご紹介。',
        date: '2026-02-13',
        category: '記念日',
        readTime: '5分',
        image: '💝',
        content: [
            'バレンタインデーは愛する人に気持ちを伝える特別な日です。AIの力を借りて、今年は完璧なギフトを見つけましょう。',
            '## 🎁 2026年人気バレンタインデーギフトTOP5',
            '**1. カップルアイテム：** ペアリング、ペアウォッチ、ペアブレスレットなど、一緒に着用できるアイテムは常に人気です。',
            '**2. プレミアムチョコレート：** ゴディバ、リンツ、ロイズなどプレミアムブランドの限定セットはバレンタインの定番ギフトです。',
            '**3. 香水：** ジョーマローン、ディプティック、バイレードなどのプレミアム香水は長く記憶に残るギフトになります。',
            '**4. 花束＆フラワーサブスクリプション：** バラの花束はバレンタインの象徴ですが、最近はフラワーサブスクも人気です。',
            '**5. 体験ギフト：** 料理教室、陶芸工房、ワインテイスティングなど一緒に体験できるギフトが特別な思い出を作ります。',
            '## 💡 ギフト選びのヒント',
            'ギフトジニーのAI推薦サービスを利用すれば、関係性、予算、好みを考慮したカスタム推薦を受けられます。'
        ]
    },
    {
        id: 'budget-gift-guide',
        title: '予算別ギフトガイド：1,000円から10,000円までのセンスあるギフト推薦',
        excerpt: '限られた予算でもセンスのあるギフトを選べます。価格帯別に厳選したギフトアイデア。',
        date: '2026-02-13',
        category: 'ギフトのヒント',
        readTime: '7分',
        image: '💰',
        content: [
            'ギフトの価値は価格ではなく気持ちにあります。予算に合わせてセンスあるギフトを選ぶ方法をご紹介します。',
            '## 💸 1,000円以下：気持ちを込めたちょっとしたギフト',
            '**おすすめアイテム：** ハンドクリーム、キャンドル、靴下セット、フェイスマスクセット、文房具',
            '## 💳 1,000〜3,000円：実用的でセンスあるギフト',
            '**おすすめアイテム：** タンブラー、エコバッグ、ミニ香水セット、本、ディフューザー',
            '## 💎 3,000〜5,000円：特別なギフト',
            '**おすすめアイテム：** 化粧品セット、財布、ワイヤレス充電器、ワイン',
            '## 🎁 5,000〜10,000円：プレミアムギフト',
            '**おすすめアイテム：** プレミアム香水、AirPodsケース、ブランドアクセサリー'
        ]
    },
    {
        id: 'mbti-gift-guide',
        title: 'MBTI別カスタムギフトガイド：性格タイプに合った完璧なギフト探し',
        excerpt: '16種類のMBTI性格タイプ別にぴったりのギフトをおすすめ。',
        date: '2026-02-13',
        category: 'ギフトのヒント',
        readTime: '10分',
        image: '🧠',
        content: [
            'MBTIの性格タイプを知れば、ぴったりのギフトを選べます。各タイプの特性とおすすめギフトをご紹介します。',
            '## 🔬 分析型 (NT): INTJ, INTP, ENTJ, ENTP',
            '分析型は知的好奇心が強く、効率性を重視します。',
            '**おすすめギフト：** 最新電子機器、戦略ボードゲーム、専門書籍、オンライン講座',
            '## 🛡️ 管理型 (SJ): ISTJ, ISFJ, ESTJ, ESFJ',
            '**おすすめギフト：** 高級ダイアリー、プレミアム財布、健康関連製品',
            '## 🎨 外交型 (NF): INFJ, INFP, ENFJ, ENFP',
            '**おすすめギフト：** 手作りクラフト、キャンドル、詩集、体験型ギフト',
            '## 🏃 探検型 (SP): ISTP, ISFP, ESTP, ESFP',
            '**おすすめギフト：** アクティビティ利用券、スポーツ用品、旅行関連製品',
            '## 💡 MBTIヒント',
            'ギフトジニーでMBTIタイプと趣味を入力すれば、AIが性格に合ったカスタムギフトをおすすめします！'
        ]
    },
    {
        id: 'boyfriend-birthday-gifts',
        title: '20代彼氏の誕生日プレゼントおすすめTOP10（2026年最新版）',
        excerpt: '失敗しない20代彼氏への誕生日プレゼント！実用性とセンスを兼ね備えた最新トレンドアイテム10選をおすすめします。',
        date: '2026-04-10',
        category: '誕生日',
        readTime: '8分',
        image: '👔',
        content: [
            '20代の彼氏の誕生日、何をプレゼントすればいいか悩んでいませんか？ありきたりなプレゼントの代わりに、実用性とセンスの両方を兼ね備えた最新トレンドのギフトリストをご用意しました。',
            '## 👔 20代彼氏へのプレゼントの選び方',
            '20代の男性は主に**実用性、電子機器への関心、趣味**に大きな価値を置いています。普段からよく使っているアイテムをプレミアムブランドにアップグレードしてあげたり、新しい趣味を応援するアイテムが良いでしょう。',
            '## 💻 実用性No.1！電子機器・テックアイテム',
            '**1. スマートウォッチのストラップ＆アクセサリーセット：** すでにApple WatchやGalaxy Watchを持っているなら、飽きずに着けられるプレミアムなレザーやメタル素材のストラップが素晴らしいプレゼントになります。',
            '**2. ワイヤレスノイズキャンセリングイヤホン：** 通勤・通学や運動の際に必須のワイヤレスイヤホン！最新モデルに変えてあげれば、QOLが劇的に向上します。',
            '**3. カスタムメカニカルキーボード：** コーディングやゲーム、文書作成が多い彼氏なら、タイピングの心地よさを向上させてくれるメカニカルキーボードが最高のプレゼントになります。',
            '## 👟 毎日使えるデイリーアイテム',
            '**4. プレミアムカードケース：** 分厚い財布よりも、キャッシュレス決済と一緒に身軽に持ち歩ける高品質のブランドカードケースがおすすめです。',
            '**5. ニッチフレグランス（ウッディ系）：** 男性が好むクリーンでジェンダーレスな香水（Diptyque、Le Labo、Jo Maloneなど）は、センスのある彼女になるための良いアイテムです。',
            '## 💡 プレゼント選びのヒント',
            'ギフトジニーのサイトで彼氏の具体的な好みと予算を選択し、AIにカスタムギフトをおすすめしてもらいましょう！'
        ]
    },
    {
        id: 'housewarming-gifts',
        title: '引越し祝いギフト：ティッシュの代わりに「センスがいい」と褒められるアイテム',
        excerpt: 'ありきたりな洗剤はもうおしまい！家主の好みにピッタリで実用性も備えた、気の利いた引越し祝いのアイデアをご紹介します。',
        date: '2026-04-10',
        category: '引越し祝い',
        readTime: '6分',
        image: '🏠',
        content: [
            '昔は引越しの際にトイレットペーパーや洗剤を買っていくのが「お決まり」でしたが、最近は実用的でありながらインテリアを損なわないセンスあるプレゼントの方が歓迎されます。',
            '## 🏠 インテリアをより美しくする感性アイテム',
            '**1. プレミアムディフューザー＆インセンススティック：** 引越し直後の新居の匂いを消し、空間を高級感のある香りで満たすディフューザーは、好みが分かれない安全なプレゼントです。',
            '**2. デザインムードランプ（テーブルランプ）：** 家の雰囲気を温かくしてくれる小さくて可愛い照明は、インテリア初心者にも便利です。',
            '**3. センスのある花瓶と生花：** オブジェとしても活用可能なデザイン花瓶と心地よい生花の花束は、家主を笑顔にしてくれます。',
            '## ☕ 一人暮らしや新婚夫婦にぴったりの小型家電',
            '**4. カプセルコーヒーマシン：** ホームカフェを楽しむ人に必須！美しいデザインのコーヒーマシンは実用性1位に挙げられます。',
            '**5. ワイングラスセットと電動オープナー：** ホームパーティーを楽しみ、ワインが好きな友人なら間違いなく歓迎されるプレゼントです。',
            '## 💡 センスある引越し祝いのヒント',
            'プレゼントを受け取る方の家のインテリアの色味（ホワイト、ウッド、モダンなど）を事前に把握しておくと、より気に入ってもらえるプレゼントを選ぶことができます。'
        ]
    }
];

export default function BlogPost() {
    const locale = useLocale();
    const params = useParams();
    const slug = params.slug as string;

    const allPosts = locale === 'ko' ? allPostsKo : locale === 'ja' ? allPostsJa : allPostsEn;
    const post = allPosts.find(p => p.id === slug);

    const backText = locale === 'ko' ? '← 블로그로 돌아가기' : locale === 'ja' ? '← ブログに戻る' : '← Back to Blog';
    const tryAiText = locale === 'ko' ? '🎁 AI 선물 추천 받기' : locale === 'ja' ? '🎁 AIギフト推薦を受ける' : '🎁 Get AI Gift Recommendations';

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto text-center py-20">
                <div className="text-6xl mb-6">📝</div>
                <h1 className="text-3xl font-bold text-[var(--text-main)] mb-4">
                    {locale === 'ko' ? '포스트를 찾을 수 없습니다' : locale === 'ja' ? '記事が見つかりません' : 'Post Not Found'}
                </h1>
                <Link href="/blog" className="btn-primary inline-block mt-4">
                    {backText}
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 fade-in">
                <Link href="/blog" className="text-[var(--text-main-70)] hover:text-[var(--text-main)] transition-colors">
                    {backText}
                </Link>
            </div>

            <article className="glass-card fade-in">
                <div className="text-center mb-8">
                    <span className="text-8xl">{post.image}</span>
                </div>

                <div className="flex items-center justify-center gap-4 mb-6 text-sm text-[var(--text-main-70)]">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-[var(--text-main)] font-medium">
                        {post.category}
                    </span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-main)] mb-8 text-center leading-tight">
                    {post.title}
                </h1>

                <div className="space-y-6 text-[var(--text-main-90)] leading-relaxed">
                    {post.content.map((paragraph, idx) => {
                        if (paragraph.startsWith('## ')) {
                            return (
                                <h2 key={idx} className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
                                    {paragraph.replace('## ', '')}
                                </h2>
                            );
                        }
                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                                <p key={idx} className="font-semibold text-[var(--text-main)]">
                                    {paragraph.replace(/\*\*/g, '')}
                                </p>
                            );
                        }
                        if (paragraph.startsWith('**')) {
                            const parts = paragraph.split('**');
                            return (
                                <p key={idx}>
                                    {parts.map((part, i) => (
                                        i % 2 === 1
                                            ? <strong key={i} className="text-[var(--text-main)]">{part}</strong>
                                            : <span key={i}>{part}</span>
                                    ))}
                                </p>
                            );
                        }
                        return <p key={idx}>{paragraph}</p>;
                    })}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-xs text-[var(--text-main-70)] bg-[var(--surface-mixed)] inline-block px-4 py-2 rounded-full mb-6">
                      💡 {locale === 'ko' ? '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.' : 'As a Coupang/Amazon associate, we earn from qualifying purchases.'}
                    </p>
                    <CoupangDynamicBanner />
                    
                    <div className="my-8">
                        <Link href="/" className="btn-primary inline-block text-lg px-8 py-3 w-full sm:w-auto">
                            {tryAiText}
                        </Link>
                    </div>
                    
                    <div className="mt-8">
                        <CoupangSearchWidget />
                    </div>
                </div>
            </article>
        </div>
    );
}
