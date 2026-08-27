import { getAllBlogPosts } from '@/data/blog';
import { SITE_URL } from '@/lib/seo';

// 네이버 서치어드바이저 RSS 제출 및 콘텐츠 구독용 피드 (빌드 시 정적 생성)
export const dynamic = 'force-static';

function escapeXml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

export async function GET() {
    const posts = getAllBlogPosts()
        .filter(p => p.ko?.title)
        .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

    const items = posts
        .map(post => {
            const url = `${SITE_URL}/blog/${post.id}/`;
            const pubDate = post.date ? new Date(`${post.date}T09:00:00+09:00`).toUTCString() : new Date().toUTCString();
            return `    <item>
      <title>${escapeXml(post.ko.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.ko.excerpt || '')}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
        })
        .join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>선물지니 GiftGenie - 선물 추천 블로그</title>
    <link>${SITE_URL}/</link>
    <description>AI 맞춤형 선물 추천 서비스 선물지니의 기념일·시즌별 선물 가이드</description>
    <language>ko</language>
${items}
  </channel>
</rss>`;

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
        },
    });
}
