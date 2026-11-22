'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

export default function About() {
    const locale = useLocale();

    const content = {
        ko: {
            title: "선물지니 (GiftGenie)",
            subtitle: "AI가 찾아주는 당신만을 위한 완벽한 선물 큐레이션",
            introTitle: "서비스 소개",
            intro: "선물지니는 소중한 사람에게 어떤 선물을 해야 할지 고민하는 분들을 위해 탄생했습니다. 최신 AI 기술(GPT-4o Mini)을 활용하여 상대방의 연령, 성별, 성격, 그리고 기념일의 의미까지 종합적으로 분석하여 가장 만족스러운 선물 후보를 추천해 드립니다.",
            features: [
                { icon: "🧠", title: "정교한 AI 분석", desc: "수만 가지 선물 데이터를 학습한 AI가 상황에 딱 맞는 아이템을 골라줍니다." },
                { icon: "💰", title: "예산 밀착 추천", desc: "설정한 예산 범위 내에서 가성비와 프리미엄을 모두 고려한 선택지를 제공합니다." },
                { icon: "⚡", title: "빠르고 간편함", desc: "복잡한 회원가입 없이 몇 가지 정보 입력만으로 3초 만에 결과를 확인할 수 있습니다." },
                { icon: "🛍️", title: "구매까지 한 번에", desc: "추천받은 상품을 쿠팡 파트너스 링크를 통해 즉시 확인하고 구매할 수 있습니다." }
            ],
            goalTitle: "우리의 목표",
            goal: "단순한 상품 나열이 아닌, 주는 이의 정성과 받는 이의 기쁨이 연결되는 지점을 찾는 것이 선물지니의 목표입니다. 특별한 기념일을 더욱 특별하게 만드는 최고의 조력자가 되겠습니다."
        },
        en: {
            title: "GiftGenie",
            subtitle: "AI-Powered Perfect Gift Curation Just For You",
            introTitle: "About Our Service",
            intro: "GiftGenie was created for those who struggle with finding the perfect gift for their loved ones. Using the latest AI technology (GPT-4o Mini), we comprehensively analyze the recipient's age, gender, personality, and the meaning of the occasion to recommend the most satisfying gift options.",
            features: [
                { icon: "🧠", title: "Sophisticated AI Analysis", desc: "Our AI, trained on tens of thousands of gift data, selects items perfectly suited to your situation." },
                { icon: "💰", title: "Budget-Conscious Picks", desc: "We provide options that consider both value and premium within your set budget range." },
                { icon: "⚡", title: "Fast and Simple", desc: "Get results in 3 seconds with just a few inputs - no complex sign-up required." },
                { icon: "🛍️", title: "One-Click Purchase", desc: "Jump straight to recommended products on Amazon." }
            ],
            goalTitle: "Our Mission",
            goal: "GiftGenie's goal is not just to list products, but to find the connection point between the giver's thoughtfulness and the receiver's joy. We aim to be the best assistant in making special occasions even more special."
        },
        ja: {
            title: "ギフトジニー (GiftGenie)",
            subtitle: "AIがあなただけの完璧なギフトをキュレーション",
            introTitle: "サービス紹介",
            intro: "ギフトジニーは、大切な人への贈り物に悩む方のために生まれました。最新のAI技術（GPT-4o Mini）を活用し、相手の年齢、性別、性格、そして記念日の意味まで総合的に分析して、最も満足度の高いギフト候補をおすすめします。",
            features: [
                { icon: "🧠", title: "精巧なAI分析", desc: "数万種類のギフトデータを学習したAIが、状況にぴったりのアイテムを選びます。" },
                { icon: "💰", title: "予算に密着した推薦", desc: "設定した予算範囲内で、コスパとプレミアムの両方を考慮した選択肢を提供します。" },
                { icon: "⚡", title: "速くて簡単", desc: "複雑な会員登録なしで、いくつかの情報を入力するだけで3秒で結果を確認できます。" },
                { icon: "🛍️", title: "購入まで一度に", desc: "おすすめ商品をAmazonでそのまま確認できます。" }
            ],
            goalTitle: "私たちの目標",
            goal: "単なる商品の羅列ではなく、贈る人の心遣いと受け取る人の喜びが繋がるポイントを見つけることがギフトジニーの目標です。特別な記念日をより特別にする最高のサポーターになります。"
        }
    };

    const c = content[locale as keyof typeof content] || content.ko;

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="glass-card p-8 md:p-12 space-y-12">
                {/* 헤더 섹션 */}
                <section className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text">
                        {c.title}
                    </h1>
                    <p className="text-xl text-[var(--text-main-90)] font-medium">
                        {c.subtitle}
                    </p>
                </section>

                {/* 서비스 소개 섹션 */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">💝</span>
                        <h3 className="text-2xl font-bold text-[var(--text-main)]">{c.introTitle}</h3>
                    </div>
                    <p className="text-[var(--text-main-70)] leading-relaxed text-lg">
                        {c.intro}
                    </p>
                </section>

                {/* 주요 특징 섹션 */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {c.features.map((feature, index) => (
                        <div key={index} className="p-6 bg-white/50 rounded-2xl border border-white/20 shadow-sm">
                            <div className="text-3xl mb-3">{feature.icon}</div>
                            <h4 className="text-xl font-bold text-[var(--text-main)] mb-2">{feature.title}</h4>
                            <p className="text-[var(--text-main-70)]">{feature.desc}</p>
                        </div>
                    ))}
                </section>

                {/* 운영 철학 섹션 */}
                <section className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-3xl border border-pink-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">✨</span>
                        <h3 className="text-2xl font-bold text-[var(--text-main)]">{c.goalTitle}</h3>
                    </div>
                    <p className="text-[var(--text-main-70)] leading-relaxed">
                        {c.goal}
                    </p>
                </section>
            </div>
        </div>
    );
}
