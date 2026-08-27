import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { getAllBlogSlugs, getBlogPostBySlug } from '@/data/blog';
import { localeUrl, pageAlternates, SITE_URL } from '@/lib/seo';
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

export default async function BlogPostPage({ params }: any) {
    const { locale, slug } = await params;
    setRequestLocale(locale);
    const post = getBlogPostBySlug(slug);

    if (!post) {
        return <BlogPostClient locale={locale} post={null} />;
    }

    const localData = typeof post[locale] === 'object' && post[locale] !== null ? post[locale] : post.ko;
    const image = typeof post.image === 'string' && post.image.startsWith('http') ? post.image : undefined;

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
            <BlogPostClient locale={locale} post={post} />
        </>
    );
}
