import fs from 'fs';
import path from 'path';
import BlogPostClient from './BlogPostClient';

export default function BlogPostPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
    const postPath = path.join(process.cwd(), 'src', 'data', 'blog', 'posts', `${slug}.json`);
    let post = null;

    if (fs.existsSync(postPath)) {
        post = JSON.parse(fs.readFileSync(postPath, 'utf8'));
    }

    return <BlogPostClient locale={locale} post={post} />;
}
