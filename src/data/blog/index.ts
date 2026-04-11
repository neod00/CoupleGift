import fs from 'fs';
import path from 'path';

export interface BlogPostData {
    id: string;
    date: string;
    image: string;
    [locale: string]: any; // ko, en, ja
}

/**
 * 빌드 타임에 모든 블로그 포스트 JSON을 로드합니다.
 * Next.js는 빌드 시 이 함수를 실행하므로 fs 접근이 안전합니다.
 */
export function getAllBlogPosts(): BlogPostData[] {
    const postsDir = path.join(process.cwd(), 'src', 'data', 'blog', 'posts');
    if (!fs.existsSync(postsDir)) return [];

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.json'));
    return files.map(file => {
        const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
        return JSON.parse(content) as BlogPostData;
    });
}

/**
 * slug로 특정 블로그 포스트를 찾습니다.
 */
export function getBlogPostBySlug(slug: string): BlogPostData | null {
    const posts = getAllBlogPosts();
    return posts.find(p => p.id === slug) || null;
}

/**
 * 모든 블로그 포스트 slug 목록을 반환합니다.
 */
export function getAllBlogSlugs(): string[] {
    const postsDir = path.join(process.cwd(), 'src', 'data', 'blog', 'posts');
    if (!fs.existsSync(postsDir)) return [];
    return fs.readdirSync(postsDir)
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
}
