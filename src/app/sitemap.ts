import { MetadataRoute } from 'next';
import { generatePopularPages } from '@/data/giftPages';
import { getAllBlogPosts, getPostLocales } from '@/data/blog';
import { localeUrl } from '@/lib/seo';

// next.config.mjs 의 trailingSlash: true 와 일치하도록 모든 URL은 슬래시로 끝나야 한다.
// (리다이렉트되는 URL을 사이트맵에 넣으면 검색엔진이 색인을 지연/누락시킨다)
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString().split('T')[0];
  const locales = ['ko', 'en', 'ja'];

  const entries: MetadataRoute.Sitemap = [];

  // 정적 페이지
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/about', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/blog', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/gift', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  for (const page of staticPages) {
    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, page.path),
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // 블로그 상세 페이지 (실제 발행일을 lastModified로 사용)
  const posts = getAllBlogPosts();
  for (const post of posts) {
    // 글이 실제로 존재하는 언어 버전만 (시장 전용 글은 일부 언어만 있음)
    for (const locale of getPostLocales(post)) {
      entries.push({
        url: localeUrl(locale, `/blog/${post.id}`),
        lastModified: post.updated || post.date || now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  // 프로그래매틱 SEO 페이지 (인기 조합)
  const popularPages = generatePopularPages();
  for (const page of popularPages) {
    for (const locale of locales) {
      entries.push({
        url: localeUrl(locale, `/gift/${page.slug}`),
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  return entries;
}
