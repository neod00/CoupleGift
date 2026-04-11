'use client';

import React from 'react';
import { Link } from '@/i18n/navigation';
import AdSense from '@/components/AdSense';
import CoupangDynamicBanner from '@/components/CoupangDynamicBanner';
import CoupangSearchWidget from '@/components/CoupangSearchWidget';
import { GiftPageData, findRelatedPages, genders, ageGroups, occasions, budgets } from '@/data/giftPages';

interface GiftPageClientProps {
  page: GiftPageData;
  locale: string;
}

export default function GiftPageClient({ page, locale }: GiftPageClientProps) {
  const gender = genders.find(g => g.id === page.gender);
  const age = ageGroups.find(a => a.id === page.ageGroup);
  const occasion = occasions.find(o => o.id === page.occasion);
  const budget = budgets.find(b => b.id === page.budget);
  const relatedPages = findRelatedPages(page, 6);

  const suggestions = page.suggestions[locale] || page.suggestions.ko;
  const tips = page.tips[locale] || page.tips.ko;

  const labels = {
    ko: {
      breadHome: '홈',
      breadGift: '선물 추천',
      budgetLabel: '예산',
      suggestionsTitle: '추천 선물 아이디어',
      tipsTitle: '선물 선택 팁',
      ctaTitle: 'AI로 더 정확한 추천을 받아보세요!',
      ctaDesc: '위 추천이 마음에 들지 않나요? AI가 당신만을 위한 맞춤형 선물을 찾아드립니다.',
      ctaButton: '🎁 AI 맞춤 추천 받기',
      relatedTitle: '관련 선물 가이드',
      viewMore: '자세히 보기 →',
      coupangSearch: '쿠팡에서 검색',
    },
    en: {
      breadHome: 'Home',
      breadGift: 'Gift Guide',
      budgetLabel: 'Budget',
      suggestionsTitle: 'Recommended Gift Ideas',
      tipsTitle: 'Gift Selection Tips',
      ctaTitle: 'Get More Accurate Recommendations with AI!',
      ctaDesc: "Not satisfied with these suggestions? Let our AI find personalized gifts just for you.",
      ctaButton: '🎁 Get AI Recommendations',
      relatedTitle: 'Related Gift Guides',
      viewMore: 'View Details →',
      coupangSearch: 'Search on Amazon',
    },
    ja: {
      breadHome: 'ホーム',
      breadGift: 'ギフト推薦',
      budgetLabel: '予算',
      suggestionsTitle: 'おすすめギフトアイデア',
      tipsTitle: 'ギフト選びのヒント',
      ctaTitle: 'AIでより正確なおすすめを受けましょう！',
      ctaDesc: '上記のおすすめが気に入りませんか？AIがあなただけのカスタムギフトを見つけます。',
      ctaButton: '🎁 AIおすすめを受ける',
      relatedTitle: '関連ギフトガイド',
      viewMore: '詳しく見る →',
      coupangSearch: 'Amazonで検索',
    },
  };

  const l = labels[locale as keyof typeof labels] || labels.ko;

  // 쿠팡/Amazon 검색 URL 생성
  const getSearchUrl = (item: string) => {
    if (locale === 'ko') {
      return `https://www.coupang.com/np/search?component=&q=${encodeURIComponent(item + ' 선물')}&channel=user`;
    } else if (locale === 'ja') {
      return `https://www.amazon.co.jp/s?k=${encodeURIComponent(item + ' ギフト')}`;
    }
    return `https://www.amazon.com/s?k=${encodeURIComponent(item + ' gift')}`;
  };

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* 브레드크럼 */}
      <nav className="text-sm text-[var(--text-main-70)] mb-6 flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-[var(--text-main)] transition-colors">{l.breadHome}</Link>
        <span>›</span>
        <span>{l.breadGift}</span>
        <span>›</span>
        <span className="text-[var(--text-main)]">{page.h1[locale] || page.h1.ko}</span>
      </nav>

      {/* 메인 콘텐츠 */}
      <article className="glass-card p-6 md:p-10 mb-8">
        {/* 헤더 */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-[var(--text-main)]">
              {gender?.[locale as 'ko' | 'en' | 'ja'] || gender?.ko}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-[var(--text-main)]">
              {age?.[locale as 'ko' | 'en' | 'ja'] || age?.ko}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-[var(--text-main)]">
              {occasion?.[locale as 'ko' | 'en' | 'ja'] || occasion?.ko}
            </span>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium text-[var(--text-main)]">
              💰 {budget?.[locale as 'ko' | 'en' | 'ja'] || budget?.ko}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-4 leading-tight">
            {page.h1[locale] || page.h1.ko}
          </h1>
          <p className="text-lg text-[var(--text-main-70)] max-w-2xl mx-auto">
            {page.description[locale] || page.description.ko}
          </p>
        </div>

        {/* 상단 광고 */}
        <AdSense adFormat="banner" className="mb-8" />

        {/* 추천 선물 그리드 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 text-center">
            🎁 {l.suggestionsTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    const fallbackUrl = getSearchUrl(item);
                    const homeLink = process.env.NEXT_PUBLIC_COUPANG_HOME_LINK;
                    
                    if (locale === 'ko' && homeLink) {
                      await navigator.clipboard.writeText(item);
                      alert(`상품명 [${item}]이(가) 복사되었습니다! 🎉\n\n열리는 쿠팡 창에서 붙여넣기(Ctrl+V)를 하시면 바로 찾으실 수 있습니다.`);
                      window.open(homeLink, '_blank');
                    } else {
                      window.open(fallbackUrl, '_blank');
                    }
                  } catch (err) {
                    window.open(getSearchUrl(item), '_blank');
                  }
                }}
                className="glass-card p-5 hover:scale-105 transition-all duration-300 cursor-pointer group block w-full"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">
                    {['🎁', '💝', '✨', '🛍️', '💎', '🎀', '🌟'][idx % 7]}
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2 group-hover:text-purple-500 transition-colors">
                    {item}
                  </h3>
                  <div className="text-xs text-[var(--text-main-70)] mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {l.coupangSearch} →
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="text-center mt-6 mb-2">
            <p className="text-xs text-[var(--text-main-70)] bg-[var(--surface-mixed)] inline-block px-4 py-2 rounded-full">
              💡 {locale === 'ko' ? '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.' : 'As a Coupang/Amazon associate, we earn from qualifying purchases.'}
            </p>
          </div>
          
          <CoupangDynamicBanner />
        </section>

        {/* 중간 광고 */}
        <AdSense adFormat="auto" className="my-8" />

        {/* 선물 선택 팁 */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 text-center">
            💡 {l.tipsTitle}
          </h2>
          <div className="space-y-4">
            {tips.map((tip, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-white/10 rounded-xl">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {idx + 1}
                </div>
                <p className="text-[var(--text-main-90)] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="text-center bg-gradient-to-br from-pink-50/50 to-purple-50/50 p-8 rounded-2xl border border-pink-100/30">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">
            ✨ {l.ctaTitle}
          </h2>
          <p className="text-[var(--text-main-70)] mb-6 max-w-lg mx-auto">
            {l.ctaDesc}
          </p>
          <Link
            href="/"
            className="btn-primary inline-block text-lg px-8 py-4 font-semibold"
          >
            {l.ctaButton}
          </Link>
          
          <div className="mt-8">
            <CoupangSearchWidget />
          </div>
        </section>
      </article>

      {/* 관련 선물 가이드 */}
      {relatedPages.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 text-center">
            📚 {l.relatedTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedPages.map((related) => {
              const rGender = genders.find(g => g.id === related.gender);
              const rAge = ageGroups.find(a => a.id === related.ageGroup);
              const rOccasion = occasions.find(o => o.id === related.occasion);
              const rBudget = budgets.find(b => b.id === related.budget);

              return (
                <Link
                  key={related.slug}
                  href={`/gift/${related.slug}`}
                  className="glass-card p-4 hover:scale-105 transition-all duration-300 block"
                >
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {rGender?.[locale as 'ko' | 'en' | 'ja'] || rGender?.ko}
                    </span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                      {rAge?.[locale as 'ko' | 'en' | 'ja'] || rAge?.ko}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[var(--text-main)] mb-1 line-clamp-2">
                    {rOccasion?.[locale as 'ko' | 'en' | 'ja'] || rOccasion?.ko} • {rBudget?.[locale as 'ko' | 'en' | 'ja'] || rBudget?.ko}
                  </h3>
                  <span className="text-xs text-[var(--text-main-70)]">{l.viewMore}</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* 하단 광고 */}
      <AdSense adFormat="rectangle" className="mb-8" />
    </div>
  );
}
