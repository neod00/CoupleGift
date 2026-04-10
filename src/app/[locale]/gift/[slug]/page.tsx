import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { findPageBySlug, generatePopularPages, genders, ageGroups, occasions, budgets } from '@/data/giftPages';
import GiftPageClient from './GiftPageClient';

// 정적 파라미터 생성 (빌드 시 인기 페이지만 미리 생성)
export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  const popularPages = generatePopularPages();

  for (const locale of routing.locales) {
    for (const page of popularPages) {
      params.push({ locale, slug: page.slug });
    }
  }

  return params;
}

// 동적 메타데이터 생성
export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = findPageBySlug(slug);

  if (!page) {
    return { title: 'Gift Not Found' };
  }

  const title = page.title[locale] || page.title.ko;
  const description = page.description[locale] || page.description.ko;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://couplegift.netlify.app/${locale === 'ko' ? '' : locale + '/'}gift/${slug}`,
    },
    alternates: {
      canonical: `https://couplegift.netlify.app/${locale === 'ko' ? '' : locale + '/'}gift/${slug}`,
      languages: {
        ko: `https://couplegift.netlify.app/gift/${slug}`,
        en: `https://couplegift.netlify.app/en/gift/${slug}`,
        ja: `https://couplegift.netlify.app/ja/gift/${slug}`,
      },
    },
  };
}

export default async function GiftPage({ params }: any) {
  const { locale, slug } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);

  const page = findPageBySlug(slug);

  if (!page) {
    notFound();
  }

  // 구조화 데이터 (FAQ + BreadcrumbList)
  const gender = genders.find(g => g.id === page.gender);
  const age = ageGroups.find(a => a.id === page.ageGroup);
  const occasion = occasions.find(o => o.id === page.occasion);
  const budget = budgets.find(b => b.id === page.budget);

  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': (page.tips[locale] || page.tips.ko).map((tip, i) => ({
      '@type': 'Question',
      'name': locale === 'ko'
        ? `${age?.ko} ${gender?.ko} ${occasion?.ko} 선물 팁 ${i + 1}`
        : locale === 'ja'
          ? `${age?.ja}${gender?.ja}の${occasion?.ja}ギフトヒント ${i + 1}`
          : `${occasion?.en} Gift Tip ${i + 1} for ${age?.en} ${gender?.en}`,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': tip,
      },
    })),
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': locale === 'ko' ? '홈' : locale === 'ja' ? 'ホーム' : 'Home',
        'item': `https://couplegift.netlify.app/${locale === 'ko' ? '' : locale + '/'}`,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': locale === 'ko' ? '선물 추천' : locale === 'ja' ? 'ギフト推薦' : 'Gift Guide',
        'item': `https://couplegift.netlify.app/${locale === 'ko' ? '' : locale + '/'}gift/`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': page.h1[locale] || page.h1.ko,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <GiftPageClient page={page} locale={locale} />
    </>
  );
}
