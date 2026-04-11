import fs from 'fs';
import path from 'path';
import BlogPostClient from './BlogPostClient';

export async function generateStaticParams() {
    const postsPath = path.join(process.cwd(), 'src', 'data', 'blog', 'posts');
    if (!fs.existsSync(postsPath)) return [];
    
    const files = fs.readdirSync(postsPath).filter(f => f.endsWith('.json'));
    const locales = ['ko', 'en', 'ja'];
    
    const params: { locale: string, slug: string }[] = [];
    
    for (const file of files) {
        const slug = file.replace('.json', '');
        for (const locale of locales) {
            params.push({ locale, slug });
        }
    }
    
    return params;
}

export const dynamicParams = true; // 빌드 타임에 없어도 시도


export default function BlogPostPage({ params: { locale, slug } }: { params: { locale: string; slug: string } }) {
    const postPath = path.join(process.cwd(), 'src', 'data', 'blog', 'posts', `${slug}.json`);
    let post = null;

    if (fs.existsSync(postPath)) {
        post = JSON.parse(fs.readFileSync(postPath, 'utf8'));
    }

    return <BlogPostClient locale={locale} post={post} />;
}
