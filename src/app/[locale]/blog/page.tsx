import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { getAllBlogPosts } from '@/data/blog';
import { pageAlternates } from '@/lib/seo';
import BlogListClient from './BlogListClient';

const titles: Record<string, string> = {
    ko: '선물 추천 블로그 - 기념일·시즌별 선물 가이드',
    en: 'Gift Ideas Blog - Guides by Occasion & Season',
    ja: 'ギフトブログ - 記念日・シーズン別ガイド',
};

const descriptions: Record<string, string> = {
    ko: '생일, 기념일, 명절, 시즌별 선물 추천 가이드를 모았습니다. 예산별·상황별로 딱 맞는 선물 아이디어를 찾아보세요.',
    en: 'Gift guides for birthdays, anniversaries, holidays and every season - find the right gift idea for any budget.',
    ja: '誕生日・記念日・祝日・シーズン別のギフトガイドをまとめました。',
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: titles[locale] || titles.ko,
        description: descriptions[locale] || descriptions.ko,
        alternates: pageAlternates(locale, '/blog'),
    };
}

export default async function BlogPage({ params }: any) {
    const { locale } = await params;
    setRequestLocale(locale);
    // 목록에는 카드에 필요한 필드만 넘긴다. 본문(content)·FAQ 를 통째로 넘기면
    // 페이지 HTML 이 수 MB 로 커져(글 80여 개 × 3개 언어) 크롤링·로딩이 느려진다.
    const posts = getAllBlogPosts().map((post) => {
        const slim: Record<string, unknown> = { id: post.id, date: post.date, image: post.image };
        for (const loc of ['ko', 'en', 'ja']) {
            const data = post[loc];
            if (data && typeof data === 'object') {
                slim[loc] = {
                    title: data.title,
                    excerpt: data.excerpt,
                    category: data.category,
                    readTime: data.readTime,
                };
            }
        }
        return slim;
    });

    return <BlogListClient locale={locale} posts={posts} />;
}
