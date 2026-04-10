import { MetadataRoute } from 'next';
import { generatePopularPages } from '@/data/giftPages';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://couplegift.netlify.app';
  const now = new Date().toISOString().split('T')[0];
  const locales = ['ko', 'en', 'ja'];

  const entries: MetadataRoute.Sitemap = [];

  // 정적 페이지
  const staticPages = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/about', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.8 },
    { path: '/gift', changeFrequency: 'daily' as const, priority: 0.9 },
    { path: '/contact', changeFrequency: 'monthly' as const, priority: 0.6 },
    { path: '/privacy', changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  // 블로그 포스트
  const blogSlugs = ['valentine-day-guide', 'budget-gift-guide', 'mbti-gift-guide'];

  for (const page of staticPages) {
    for (const locale of locales) {
      const prefix = locale === 'ko' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}${page.path}`,
        lastModified: now,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    }
  }

  // 블로그 상세 페이지
  for (const slug of blogSlugs) {
    for (const locale of locales) {
      const prefix = locale === 'ko' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/blog/${slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  // 프로그래매틱 SEO 페이지 (인기 조합)
  const popularPages = generatePopularPages();
  for (const page of popularPages) {
    for (const locale of locales) {
      const prefix = locale === 'ko' ? '' : `/${locale}`;
      entries.push({
        url: `${baseUrl}${prefix}/gift/${page.slug}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      });
    }
  }

  return entries;
}
