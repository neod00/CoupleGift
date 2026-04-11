'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import AdSense from '@/components/AdSense';
import CoupangDynamicBanner from '@/components/CoupangDynamicBanner';
import CoupangSearchWidget from '@/components/CoupangSearchWidget';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
}

interface BlogListClientProps {
    locale: string;
    posts: any[];
}

export default function BlogListClient({ locale, posts }: BlogListClientProps) {
    // Map JSON data into local format
    const blogPosts: BlogPost[] = posts.map(rawPost => {
        const localData = typeof rawPost[locale] === 'object' && rawPost[locale] !== null ? rawPost[locale] : rawPost.ko;
        return {
            id: rawPost.id,
            date: rawPost.date,
            image: rawPost.image,
            title: localData?.title || '',
            excerpt: localData?.excerpt || '',
            category: localData?.category || '',
            readTime: localData?.readTime || ''
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 최신순 정렬

    const content = {
        ko: {
            title: "📝 선물 아이디어 블로그",
            subtitle: "AI 맞춤형 선물 추천과 기념일 선물, 생일 선물 아이디어를 위한 유용한 정보와 팁",
            categories: ['전체', '기념일', '선물 팁', '가족', 'DIY', '생일', '집들이'],
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
            categories: ['All', 'Anniversary', 'Gift Tips', 'Family', 'DIY', 'Birthday', 'Housewarming'],
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
            categories: ['すべて', '記念日', 'ギフトのヒント', '家族', 'DIY', '誕生日', '引越し祝い'],
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
                                {post.image.startsWith('http') ? (
                                    <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-xl shadow-md" />
                                ) : (
                                    <span className="text-6xl">{post.image}</span>
                                )}
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

            {/* 뉴스레터 구독 */}
            <div className="glass-card mt-16 p-8 text-center bg-gradient-to-br from-pink-50/50 to-purple-50/50">
                <CoupangDynamicBanner />
                
                <h2 className="text-2xl font-bold text-[var(--text-main)] mb-2 mt-8">
                    {c.newsletterTitle}
                </h2>
                <p className="text-[var(--text-main-70)] mb-6">
                    {c.newsletterDesc}
                </p>
                <form className="max-w-md mx-auto flex gap-2" onSubmit={(e) => e.preventDefault()}>
                    <input 
                        type="email" 
                        placeholder={c.emailPlaceholder}
                        className="flex-1 bg-white/50 border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                    <button type="submit" className="btn-primary">
                        {c.subscribe}
                    </button>
                </form>
                
                <div className="mt-8">
                    <CoupangSearchWidget />
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
