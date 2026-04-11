import { getAllBlogPosts } from '@/data/blog';
import BlogListClient from './BlogListClient';

export default async function BlogPage({ params }: any) {
    const { locale } = await params;
    const posts = getAllBlogPosts();

    return <BlogListClient locale={locale} posts={posts} />;
}
