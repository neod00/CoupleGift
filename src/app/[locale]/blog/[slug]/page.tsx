import { routing } from '@/i18n/routing';
import { getAllBlogPosts, getAllBlogSlugs, getBlogPostBySlug } from '@/data/blog';
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

export default async function BlogPostPage({ params }: any) {
    const { locale, slug } = await params;
    const post = getBlogPostBySlug(slug);

    return <BlogPostClient locale={locale} post={post} />;
}
