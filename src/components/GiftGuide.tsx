'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';

const GiftGuide: React.FC = () => {
  const t = useTranslations();
  const locale = useLocale();

  const giftCategories = [
    {
      id: "couple-accessories",
      titleKey: "relationships.lover.title",
      icon: "💕",
      descriptionKey: "relationships.lover.description",
      examplesKey: "relationships.lover.items"
    },
    {
      id: "beauty-cosmetics",
      titleKey: "relationships.family.title",
      icon: "👨‍👩‍👧‍👦",
      descriptionKey: "relationships.family.description",
      examplesKey: "relationships.family.items"
    },
    {
      id: "friend-gifts",
      titleKey: "relationships.friend.title",
      icon: "👫",
      descriptionKey: "relationships.friend.description",
      examplesKey: "relationships.friend.items"
    },
    {
      id: "colleague-gifts",
      titleKey: "relationships.colleague.title",
      icon: "🤝",
      descriptionKey: "relationships.colleague.description",
      examplesKey: "relationships.colleague.items"
    }
  ];

  const occasionGuide = [
    {
      titleKey: "occasions.birthday.title",
      icon: "🎂",
      tipKey: "occasions.birthday.tip"
    },
    {
      titleKey: "occasions.anniversary.title",
      icon: "💝",
      tipKey: "occasions.anniversary.tip"
    },
    {
      titleKey: "occasions.holiday.title",
      icon: "🏮",
      tipKey: "occasions.holiday.tip"
    },
    {
      titleKey: "occasions.graduation.title",
      icon: "🎓",
      tipKey: "occasions.graduation.tip"
    }
  ];

  const budgetGuide = [
    {
      rangeKey: "budgets.under10k",
      icon: "💰",
      suggestions: locale === 'ko'
        ? ["문구용품", "간식", "소품", "캔들", "양말"]
        : locale === 'ja'
          ? ["文房具", "お菓子", "小物", "キャンドル", "靴下"]
          : ["Stationery", "Snacks", "Small items", "Candles", "Socks"]
    },
    {
      rangeKey: "budgets.10kTo50k",
      icon: "💳",
      suggestions: locale === 'ko'
        ? ["화장품", "액세서리", "책", "향수", "텀블러"]
        : locale === 'ja'
          ? ["化粧品", "アクセサリー", "本", "香水", "タンブラー"]
          : ["Cosmetics", "Accessories", "Books", "Perfume", "Tumbler"]
    },
    {
      rangeKey: "budgets.50kTo100k",
      icon: "💎",
      suggestions: locale === 'ko'
        ? ["의류", "가방", "신발", "전자기기", "뷰티기기"]
        : locale === 'ja'
          ? ["衣類", "バッグ", "靴", "電子機器", "美容機器"]
          : ["Clothing", "Bags", "Shoes", "Electronics", "Beauty devices"]
    },
    {
      rangeKey: "budgets.over100k",
      icon: "🎁",
      suggestions: locale === 'ko'
        ? ["명품 액세서리", "가전제품", "여행 상품권", "고급 화장품", "브랜드 의류"]
        : locale === 'ja'
          ? ["高級アクセサリー", "家電製品", "旅行ギフト券", "高級化粧品", "ブランド服"]
          : ["Luxury accessories", "Home appliances", "Travel vouchers", "Premium cosmetics", "Brand clothing"]
    }
  ];

  return (
    <div className="space-y-12">
      {/* 선물 가이드 헤더 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-4">
          {t('guide.title')}
        </h2>
        <p className="text-lg text-[var(--text-main-70)]">
          {t('guide.subtitle')}
        </p>
      </div>

      {/* 관계별 선물 가이드 */}
      <section>
        <h3 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">
          {t('guide.relationshipTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {giftCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="glass-card hover:scale-105 transition-transform duration-300 block cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h4 className="text-xl font-semibold text-[var(--text-main)]">{t(category.titleKey)}</h4>
              </div>
              <p className="text-[var(--text-main-90)] mb-4">{t(category.descriptionKey)}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {t(category.examplesKey).split(', ').map((example: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-white/20 text-[var(--text-main)] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {example}
                  </span>
                ))}
              </div>
              <div className="text-[var(--text-main-70)] text-sm">
                {t('common.viewMore')}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 기념일별 선물 팁 */}
      <section>
        <h3 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">
          {t('guide.occasionTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {occasionGuide.map((guide, index) => (
            <div key={index} className="glass-card">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{guide.icon}</span>
                <h4 className="text-lg font-semibold text-[var(--text-main)]">{t(guide.titleKey)}</h4>
              </div>
              <p className="text-[var(--text-main-90)]">{t(guide.tipKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 예산별 선물 가이드 */}
      <section>
        <h3 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">
          {t('guide.budgetTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetGuide.map((budget, index) => (
            <div key={index} className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{budget.icon}</span>
                <h4 className="text-lg font-semibold text-[var(--text-main)]">{t(budget.rangeKey)}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {budget.suggestions.map((suggestion, idx) => (
                  <span
                    key={idx}
                    className="bg-white/20 text-[var(--text-main)] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 선물 선택 팁 */}
      <section className="glass-card">
        <h3 className="text-2xl font-semibold text-[var(--text-main)] mb-6 text-center">
          {t('guide.tipsTitle')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[var(--text-main-90)]">
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              {t('tips.analyze.title')}
            </h4>
            <ul className="space-y-2 text-sm">
              {(t.raw('tips.analyze.items') as string[]).map((item: string, idx: number) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-xl">💝</span>
              {t('tips.meaningful.title')}
            </h4>
            <ul className="space-y-2 text-sm">
              {(t.raw('tips.meaningful.items') as string[]).map((item: string, idx: number) => (
                <li key={idx}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GiftGuide;
