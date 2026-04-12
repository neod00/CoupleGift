'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
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

interface BlogPostClientProps {
    locale: string;
    post: any;
}

export default function BlogPostClient({ locale, post: rawPost }: BlogPostClientProps) {
    const backText = locale === 'ko' ? '← 블로그로 돌아가기' : locale === 'ja' ? '← ブログに戻る' : '← Back to Blog';
    const tryAiText = locale === 'ko' ? '🎁 AI 선물 추천 받기' : locale === 'ja' ? '🎁 AIギフト推薦を受ける' : '🎁 Get AI Gift Recommendations';

    if (!rawPost) {
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

    const localData = typeof rawPost[locale] === 'object' && rawPost[locale] !== null ? rawPost[locale] : rawPost.ko;
    
    const post: BlogPostFull = {
        id: rawPost.id,
        date: rawPost.date,
        image: rawPost.image,
        title: localData?.title || '',
        excerpt: localData?.excerpt || '',
        category: localData?.category || '',
        readTime: localData?.readTime || '',
        content: localData?.content || []
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 fade-in">
                <Link href="/blog" className="text-[var(--text-main-70)] hover:text-[var(--text-main)] transition-colors">
                    {backText}
                </Link>
            </div>

            <article className="glass-card fade-in">
                <div className="text-center mb-8">
                    {post.image.startsWith('http') ? (
                        <img src={post.image} alt={post.title} className="w-full max-h-[400px] object-cover rounded-2xl shadow-xl mx-auto" />
                    ) : (
                        <span className="text-8xl">{post.image}</span>
                    )}
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
                        // Support for standard HTML inside string parsing
                        if (paragraph.startsWith('<p') || paragraph.startsWith('<div')) {
                            return <div key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} className="mt-4" />;
                        }
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
                                            : <span key={i} dangerouslySetInnerHTML={{ __html: part }} />
                                    ))}
                                </p>
                            );
                        }
                        return <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />;
                    })}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center">
                    <p className="text-xs text-[var(--text-main-70)] bg-[var(--surface-mixed)] inline-block px-4 py-2 rounded-full mb-6">
                      💡 {locale === 'ko' ? '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.' : 'As an affiliate associate, we earn from qualifying purchases.'}
                    </p>
                    {locale === 'ko' && <CoupangDynamicBanner />}
                    
                    <div className="my-8">
                        <Link href="/" className="btn-primary inline-block text-lg px-8 py-3 w-full sm:w-auto">
                            {tryAiText}
                        </Link>
                    </div>
                    
                    {locale === 'ko' && (
                        <div className="mt-8">
                            <CoupangSearchWidget />
                        </div>
                    )}
                </div>
            </article>
        </div>
    );
}
