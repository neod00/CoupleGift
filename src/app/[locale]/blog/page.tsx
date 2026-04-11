import fs from 'fs';
import path from 'path';
import BlogListClient from './BlogListClient';

export default function BlogPage({ params: { locale } }: { params: { locale: string } }) {
    const postsPath = path.join(process.cwd(), 'src', 'data', 'blog', 'posts');
    let posts: any[] = [];
    
    if (fs.existsSync(postsPath)) {
        const files = fs.readdirSync(postsPath).filter(f => f.endsWith('.json'));
        posts = files.map(file => {
            const content = fs.readFileSync(path.join(postsPath, file), 'utf8');
            return JSON.parse(content);
        });
    }

    return <BlogListClient locale={locale} posts={posts} />;
}
