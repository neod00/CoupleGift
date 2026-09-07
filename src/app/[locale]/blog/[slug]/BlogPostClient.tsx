'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import AdSense from '@/components/AdSense';
import CoupangDynamicBanner from '@/components/CoupangDynamicBanner';
import CoupangSearchWidget from '@/components/CoupangSearchWidget';
import { ProductsForKeyword } from '@/components/ProductCard';
import RelatedPosts, { type RelatedPostItem, type RelatedGiftPageItem } from '@/components/RelatedPosts';

interface BlogFaqItem {
    q: string;
    a: string;
}

interface BlogPostFull {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
    content: string[];
    /** 섹션(## 소제목) 순서대로 대응하는 쿠팡 검색 키워드 (선택) */
    productKeywords: string[];
    faq: BlogFaqItem[];
}

interface BlogPostClientProps {
    locale: string;
    post: any;
    relatedPosts?: RelatedPostItem[];
    relatedGiftPages?: RelatedGiftPageItem[];
}

/**
 * "## 1. 무선 이어폰 추천" / "## 💻 실용성 1위! 전자기기" → "무선 이어폰 추천" / "실용성 1위! 전자기기"
 * 앞쪽의 번호(1. / 1) / ① 등)와 이모지를 걷어낸다. "1만원 이하"처럼 숫자로 시작하는 본문 단어는 유지.
 */
function cleanHeading(raw: string): string {
    let text = raw.replace(/^##\s*/, '').trim();
    const leadingNumber = /^(?:\d+\s*[.)]|[①-⑳]|[-–—•·])\s*/;
    const leadingEmoji = /^(?:[\p{Extended_Pictographic}\p{Emoji_Modifier}\uFE0F\u200D]|\s)+/u;
    // 번호 → 이모지 → 번호 순으로 최대 두 바퀴 (예: "1. 💻 제목", "💻 1. 제목")
    for (let i = 0; i < 2; i += 1) {
        text = text.replace(leadingNumber, '').replace(leadingEmoji, '').trim();
    }
    return text;
}

export default function BlogPostClient({ locale, post: rawPost, relatedPosts = [], relatedGiftPages = [] }: BlogPostClientProps) {
    const backText = locale === 'ko' ? '← 블로그로 돌아가기' : locale === 'ja' ? '← ブログに戻る' : '← Back to Blog';
    const tryAiText = locale === 'ko' ? '🎁 AI 선물 추천 받기' : locale === 'ja' ? '🎁 AIギフト推薦を受ける' : '🎁 Get AI Gift Recommendations';
    const faqTitle = locale === 'ko' ? '자주 묻는 질문' : locale === 'ja' ? 'よくある質問' : 'Frequently Asked Questions';
    const productsTitle = '이 섹션의 추천 상품';

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

    const rawFaq = Array.isArray(localData?.faq) ? localData.faq : Array.isArray(rawPost.faq) ? rawPost.faq : [];
    const rawKeywords = Array.isArray(localData?.productKeywords)
        ? localData.productKeywords
        : Array.isArray(rawPost.productKeywords) ? rawPost.productKeywords : [];

    const post: BlogPostFull = {
        id: rawPost.id,
        date: rawPost.date,
        image: rawPost.image,
        title: localData?.title || '',
        excerpt: localData?.excerpt || '',
        category: localData?.category || '',
        readTime: localData?.readTime || '',
        content: localData?.content || [],
        productKeywords: rawKeywords.filter((k: unknown) => typeof k === 'string'),
        faq: rawFaq.filter((item: any) => item && typeof item.q === 'string' && typeof item.a === 'string'),
    };

    // 상품 카드는 한국어(쿠팡 카탈로그) 전용
    const showProducts = locale === 'ko';

    // "## " 소제목 섹션이 끝나는 지점(다음 소제목 앞 / 본문 끝)에 상품 그리드를 넣기 위한 상태
    let sectionIndex = -1;
    let currentHeading = '';

    const renderSectionProducts = (index: number, heading: string) => {
        if (!showProducts || index < 0 || !heading) return null;
        const keyword = post.productKeywords[index] ?? heading;
        return (
            <ProductsForKeyword
                key={`products-${index}`}
                keyword={keyword}
                title={productsTitle}
                limit={3}
            />
        );
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
                        // 본문 중간 In-article 광고: 도입부 뒤(3번째 문단 앞)와 본문 중간 지점에 삽입
                        const midPoint = Math.floor(post.content.length / 2);
                        const showAd = post.content.length >= 6 && (idx === 2 || idx === midPoint + 2);

                        // 새 소제목을 만나면 직전 섹션의 상품 그리드를 먼저 닫아준다
                        let previousSectionProducts: React.ReactNode = null;
                        const isHeading = paragraph.startsWith('## ');
                        if (isHeading) {
                            previousSectionProducts = renderSectionProducts(sectionIndex, currentHeading);
                            sectionIndex += 1;
                            currentHeading = cleanHeading(paragraph);
                        }

                        let node: React.ReactNode;
                        // Support for standard HTML inside string parsing
                        if (paragraph.startsWith('<p') || paragraph.startsWith('<div')) {
                            node = <div dangerouslySetInnerHTML={{ __html: paragraph }} className="mt-4" />;
                        } else if (isHeading) {
                            node = (
                                <h2 className="text-2xl font-bold text-[var(--text-main)] mt-10 mb-4">
                                    {paragraph.replace('## ', '')}
                                </h2>
                            );
                        } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            node = (
                                <p className="font-semibold text-[var(--text-main)]">
                                    {paragraph.replace(/\*\*/g, '')}
                                </p>
                            );
                        } else if (paragraph.startsWith('**')) {
                            const parts = paragraph.split('**');
                            node = (
                                <p>
                                    {parts.map((part, i) => (
                                        i % 2 === 1
                                            ? <strong key={i} className="text-[var(--text-main)]">{part}</strong>
                                            : <span key={i} dangerouslySetInnerHTML={{ __html: part }} />
                                    ))}
                                </p>
                            );
                        } else {
                            node = <p dangerouslySetInnerHTML={{ __html: paragraph }} />;
                        }

                        return (
                            <React.Fragment key={idx}>
                                {previousSectionProducts}
                                {showAd && <AdSense adFormat="fluid" adLayout="in-article" className="my-8" />}
                                {node}
                            </React.Fragment>
                        );
                    })}
                    {/* 마지막 섹션의 상품 그리드 */}
                    {renderSectionProducts(sectionIndex, currentHeading)}
                </div>

                {/* 선택적 FAQ (포스트 JSON 의 faq: [{ q, a }]) */}
                {post.faq.length > 0 && (
                    <section className="mt-12" aria-labelledby="blog-faq-heading">
                        <h2 id="blog-faq-heading" className="text-2xl font-bold text-[var(--text-main)] mb-4">
                            ❓ {faqTitle}
                        </h2>
                        <div className="space-y-3">
                            {post.faq.map((item, i) => (
                                <details key={i} className="group bg-white/10 rounded-xl px-5 py-4">
                                    <summary className="cursor-pointer font-semibold text-[var(--text-main)] list-none flex items-start justify-between gap-3">
                                        <span>{item.q}</span>
                                        <span className="text-[var(--text-main-70)] transition-transform group-open:rotate-180" aria-hidden="true">▾</span>
                                    </summary>
                                    <div
                                        className="mt-3 text-[var(--text-main-90)] leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: item.a }}
                                    />
                                </details>
                            ))}
                        </div>
                    </section>
                )}

                {/* 본문 하단 디스플레이 광고 */}
                <AdSense adFormat="auto" className="mt-10" />

                {/* 내부 링크: 관련 글 + 관련 선물 가이드 */}
                <RelatedPosts locale={locale} posts={relatedPosts} giftPages={relatedGiftPages} />

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
