'use client';

import React from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import AdSense from '@/components/AdSense';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
}

const blogPostsKo: BlogPost[] = [
    {
        id: 'valentine-day-guide',
        title: '밸런타인데이 완벽 가이드: 연인의 마음을 사로잡는 선물 아이디어',
        excerpt: '2026년 밸런타인데이를 특별하게 만들어줄 선물 아이디어와 이벤트 계획을 소개합니다. 초콜릿부터 맞춤형 선물까지.',
        date: '2026-02-13',
        category: '기념일',
        readTime: '5분',
        image: '💝'
    },
    {
        id: 'budget-gift-guide',
        title: '예산별 선물 가이드: 1만원부터 10만원까지 센스있는 선물 추천',
        excerpt: '제한된 예산으로도 센스있는 선물을 고를 수 있습니다. 가격대별로 엄선한 선물 아이디어와 선물 고르기 팁.',
        date: '2026-02-13',
        category: '선물 팁',
        readTime: '7분',
        image: '💰'
    },
    {
        id: 'mbti-gift-guide',
        title: 'MBTI별 맞춤 선물 가이드: 성격 유형에 따른 완벽한 선물 찾기',
        excerpt: '16가지 MBTI 성격 유형별로 어울리는 선물을 추천합니다. 받는 분의 성격을 고려한 선물.',
        date: '2026-02-13',
        category: '선물 팁',
        readTime: '10분',
        image: '🧠'
    }
];

const blogPostsEn: BlogPost[] = [
    {
        id: 'valentine-day-guide',
        title: "Valentine's Day Complete Guide: Gift Ideas to Capture Your Partner's Heart",
        excerpt: "Discover gift ideas and event plans that will make Valentine's Day 2026 special. From chocolates to personalized gifts.",
        date: '2026-02-13',
        category: 'Anniversary',
        readTime: '5 min',
        image: '💝'
    },
    {
        id: 'budget-gift-guide',
        title: 'Budget Gift Guide: Thoughtful Recommendations from $10 to $100',
        excerpt: "You can choose thoughtful gifts even with a limited budget. We share gift ideas and tips by price range.",
        date: '2026-02-13',
        category: 'Gift Tips',
        readTime: '7 min',
        image: '💰'
    },
    {
        id: 'mbti-gift-guide',
        title: 'MBTI Gift Guide: Finding the Perfect Gift by Personality Type',
        excerpt: "We recommend gifts that suit each of the 16 MBTI personality types. Consider the recipient's personality.",
        date: '2026-02-13',
        category: 'Gift Tips',
        readTime: '10 min',
        image: '🧠'
    }
];

const blogPostsJa: BlogPost[] = [
    {
        id: 'valentine-day-guide',
        title: 'バレンタインデー完全ガイド：恋人の心を掴むギフトアイデア',
        excerpt: '2026年のバレンタインデーを特別にするギフトアイデアとイベント計画をご紹介。チョコレートからカスタムギフトまで。',
        date: '2026-02-13',
        category: '記念日',
        readTime: '5分',
        image: '💝'
    },
    {
        id: 'budget-gift-guide',
        title: '予算別ギフトガイド：1,000円から10,000円までのセンスあるギフト推薦',
        excerpt: '限られた予算でもセンスのあるギフトを選べます。価格帯別に厳選したギフトアイデアとヒント。',
        date: '2026-02-13',
        category: 'ギフトのヒント',
        readTime: '7分',
        image: '💰'
    },
    {
        id: 'mbti-gift-guide',
        title: 'MBTI別カスタムギフトガイド：性格タイプに合った完璧なギフト探し',
        excerpt: '16種類のMBTI性格タイプ別にぴったりのギフトをおすすめ。受け取る方の性格を考慮したギフト。',
        date: '2026-02-13',
        category: 'ギフトのヒント',
        readTime: '10分',
        image: '🧠'
    }
];

export default function Blog() {
    const locale = useLocale();

    const blogPosts = locale === 'ko' ? blogPostsKo : locale === 'ja' ? blogPostsJa : blogPostsEn;

    const content = {
        ko: {
            title: "📝 선물 아이디어 블로그",
            subtitle: "AI 맞춤형 선물 추천과 기념일 선물, 생일 선물 아이디어를 위한 유용한 정보와 팁",
            categories: ['전체', '기념일', '선물 팁', '가족', 'DIY'],
            readMore: "자세히 읽기 →",
            popularTags: "🏷️ 인기 태그",
            tags: ['밸런타인데이', '생일선물', '크리스마스', '커플선물', '부모님선물', '친구선물', '예산별선물', 'MBTI', 'DIY선물', '기념일선물'],
            newsletterTitle: "📬 새로운 선물 아이디어를 받아보세요",
            newsletterDesc: "매주 새로운 선물 아이디어와 팁을 이메일로 받아보세요",
            emailPlaceholder: "이메일 주소를 입력하세요",
            subscribe: "구독하기"
        },
        en: {
            title: "📝 Gift Ideas Blog",
            subtitle: "Useful information and tips for AI-powered gift recommendations, anniversary gifts, and birthday gift ideas",
            categories: ['All', 'Anniversary', 'Gift Tips', 'Family', 'DIY'],
            readMore: "Read More →",
            popularTags: "🏷️ Popular Tags",
            tags: ['Valentine', 'Birthday', 'Christmas', 'Couple', 'Parents', 'Friends', 'Budget', 'MBTI', 'DIY', 'Anniversary'],
            newsletterTitle: "📬 Get New Gift Ideas",
            newsletterDesc: "Receive new gift ideas and tips via email every week",
            emailPlaceholder: "Enter your email address",
            subscribe: "Subscribe"
        },
        ja: {
            title: "📝 ギフトアイデアブログ",
            subtitle: "AIおすすめギフト推薦、記念日ギフト、誕生日ギフトアイデアのための有用な情報とヒント",
            categories: ['すべて', '記念日', 'ギフトのヒント', '家族', 'DIY'],
            readMore: "詳しく読む →",
            popularTags: "🏷️ 人気タグ",
            tags: ['バレンタイン', '誕生日', 'クリスマス', 'カップル', '両親', '友人', '予算別', 'MBTI', 'DIY', '記念日'],
            newsletterTitle: "📬 新しいギフトアイデアを受け取る",
            newsletterDesc: "毎週新しいギフトアイデアとヒントをメールでお届け",
            emailPlaceholder: "メールアドレスを入力",
            subscribe: "購読する"
        }
    };

    const c = content[locale as keyof typeof content] || content.ko;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-in">
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    {c.title}
                </h1>
                <p className="text-xl text-[var(--text-main-90)]">
                    {c.subtitle}
                </p>
            </div>

            <div className="glass-card mb-8 fade-in">
                <div className="flex flex-wrap justify-center gap-4 p-4">
                    {c.categories.map((category) => (
                        <button
                            key={category}
                            className="px-4 py-2 rounded-lg bg-white/20 text-[var(--text-main)] hover:bg-white/30 transition-all duration-300"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogPosts.map((post) => (
                    <article key={post.id} className="glass-card hover:scale-105 transition-transform duration-300 fade-in">
                        <Link href={`/blog/${post.id}`} className="block">
                            <div className="text-center mb-4">
                                <span className="text-6xl">{post.image}</span>
                            </div>

                            <div className="flex items-center justify-between mb-3 text-sm text-[var(--text-main-70)]">
                                <span className="bg-white/20 px-2 py-1 rounded-full text-[var(--text-main)]">{post.category}</span>
                                <div className="flex items-center gap-2">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold text-[var(--text-main)] mb-3 line-clamp-2 hover:text-[var(--text-main-70)] transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-[var(--text-main-70)] text-sm leading-relaxed line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <span className="text-[var(--text-main-70)] text-sm hover:text-[var(--text-main)] transition-colors">
                                    {c.readMore}
                                </span>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>

            <div className="glass-card mb-8 fade-in">
                <h3 className="text-xl font-semibold text-[var(--text-main)] mb-4 text-center">
                    {c.popularTags}
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {c.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-white/20 text-[var(--text-main-90)] px-3 py-1 rounded-full text-sm hover:bg-white/30 hover:text-[var(--text-main)] transition-all cursor-pointer font-medium"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="glass-card text-center mb-8 fade-in">
                <h3 className="text-2xl font-semibold text-[var(--text-main)] mb-4">
                    {c.newsletterTitle}
                </h3>
                <p className="text-[var(--text-main-90)] mb-6">
                    {c.newsletterDesc}
                </p>
                <div className="max-w-md mx-auto flex gap-3">
                    <input
                        type="email"
                        placeholder={c.emailPlaceholder}
                        className="flex-1 px-4 py-3 bg-white/20 border border-white/20 rounded-lg text-[var(--text-main)] placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/30 transition-all font-medium"
                    />
                    <button className="btn-primary px-6">
                        {c.subscribe}
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <AdSense
                    adFormat="banner"
                    className="mb-6"
                />
            </div>
        </div>
    );
}
