'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useParams } from 'next/navigation';

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
                    <Link href="/" className="btn-primary inline-block text-lg px-8 py-3">
                        {tryAiText}
                    </Link>
                </div>
            </article>
        </div>
    );
}
