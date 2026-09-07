import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getAllBlogSlugs, getBlogPostBySlug, getRelatedPosts, getRelatedGiftPages } from '@/data/blog';
import { localeUrl, pageAlternates, SITE_URL } from '@/lib/seo';
import type { RelatedPostItem } from '@/components/RelatedPosts';
import BlogPostClient from './BlogPostClient';

export function generateStaticParams() {
    const slugs = getAllBlogSlugs();
    const params: { locale: string; slug: string }[] = [];

    for (const locale of routing.locales) {
        for (const slug of slugs) {
            params.push({ locale, slug });
        }
    }

    return params;
}

// 블로그 글마다 고유한 제목/설명/canonical을 부여 (검색 노출의 핵심)
export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return { title: 'Post Not Found', robots: { index: false } };
    }

    const localData = typeof post[locale] === 'object' && post[locale] !== null ? post[locale] : post.ko;
    const title: string = localData?.title || slug;
    const description: string = localData?.excerpt || '';
    const image: string | undefined = typeof post.image === 'string' && post.image.startsWith('http') ? post.image : undefined;

    return {
        title,
        description,
        alternates: pageAlternates(locale, `/blog/${slug}`),
        openGraph: {
            type: 'article',
            url: localeUrl(locale, `/blog/${slug}`),
            title,
            description,
            publishedTime: post.date,
            ...(image ? { images: [{ url: image }] } : {}),
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };
}

/** 포스트 JSON 의 선택적 "faq": [{ q, a }] 배열 (로케일별 또는 최상위) */
function extractFaq(post: any, localData: any): { q: string; a: string }[] {
    const raw = Array.isArray(localData?.faq) ? localData.faq : Array.isArray(post?.faq) ? post.faq : [];
    return raw.filter((item: any) => item && typeof item.q === 'string' && typeof item.a === 'string');
}

export default async function BlogPostPage({ params }: any) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return <BlogPostClient locale={locale} post={null} />;
    }

    const localData = typeof post[locale] === 'object' && post[locale] !== null ? post[locale] : post.ko;
    const image = typeof post.image === 'string' && post.image.startsWith('http') ? post.image : undefined;

    // 내부 링크: 관련 글 + 관련 /gift 가이드 (서버에서 계산해 직렬화 가능한 형태로 전달)
    const relatedPosts: RelatedPostItem[] = getRelatedPosts(slug, locale, 4).map((related) => {
        const data = typeof related[locale] === 'object' && related[locale] !== null ? related[locale] : related.ko;
        return {
            id: related.id,
            title: data?.title || related.id,
            excerpt: data?.excerpt || '',
            image: related.image || '',
            date: related.date || '',
        };
    });
    const relatedGiftPages = getRelatedGiftPages(post, locale, 3);

    // BlogPosting + BreadcrumbList 구조화 데이터 (구글 검색 리치 결과용)
    const blogPostingData = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: localData?.title || slug,
        description: localData?.excerpt || '',
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: locale,
        mainEntityOfPage: localeUrl(locale, `/blog/${slug}`),
        ...(image ? { image } : {}),
        author: {
            '@type': 'Organization',
            name: locale === 'ko' ? '선물지니 GiftGenie' : 'GiftGenie',
            url: `${SITE_URL}/`,
        },
        publisher: {
            '@type': 'Organization',
            name: locale === 'ko' ? '선물지니 GiftGenie' : 'GiftGenie',
            url: `${SITE_URL}/`,
        },
    };

    const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: locale === 'ko' ? '홈' : locale === 'ja' ? 'ホーム' : 'Home',
                item: localeUrl(locale, ''),
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: locale === 'ko' ? '블로그' : locale === 'ja' ? 'ブログ' : 'Blog',
                item: localeUrl(locale, '/blog'),
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: localData?.title || slug,
            },
        ],
    };

    // 선택적 FAQ → FAQPage 구조화 데이터
    const faq = extractFaq(post, localData);
    const faqData = faq.length > 0 ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.a,
            },
        })),
    } : null;

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingData) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
            />
            {faqData && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
                />
            )}
            <BlogPostClient
                locale={locale}
                post={post}
                relatedPosts={relatedPosts}
                relatedGiftPages={relatedGiftPages}
            />
        </>
    );
}
