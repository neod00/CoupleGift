'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { GiftRecommendation } from '../types/gift';
import AdSense from './AdSense';
import CoupangDynamicBanner from './CoupangDynamicBanner';
import CoupangSearchWidget from './CoupangSearchWidget';

interface GiftRecommendationsProps {
  recommendations: GiftRecommendation[];
  onRegenerate: () => void;
  onBackToForm: () => void;
}

const GiftRecommendations: React.FC<GiftRecommendationsProps> = ({
  recommendations,
  onRegenerate,
  onBackToForm
}) => {
  const t = useTranslations();
  const locale = useLocale();

  // 언어별 쇼핑몰 텍스트
  const shopText: Record<string, string> = {
    ko: '쿠팡에서 구매하기',
    en: 'Buy on Amazon',
    ja: 'Amazonで購入する'
  };

  const reviewSuffix: Record<string, string> = {
    ko: '개',
    en: '',
    ja: '件'
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t('results.title')}
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎁</span>
            <span className="text-xl text-[var(--text-main-90)] font-semibold">
              {locale === 'ko' ? 'AI가 선별한 특별한 선물들' :
               locale === 'ja' ? 'AIが厳選した特別なギフト' :
               'Special gifts selected by AI'}
            </span>
            <span className="text-2xl">🎁</span>
          </div>
        </div>
        <p className="text-lg text-[var(--text-main-70)] max-w-2xl mx-auto">
          {locale === 'ko' ? '당신의 소중한 사람을 위한 완벽한 선물을 찾았어요! 마음에 드는 선물을 선택해보세요 💝' :
           locale === 'ja' ? '大切な方にぴったりのギフトを見つけました！お気に入りのギフトを選んでください 💝' :
           'We found the perfect gifts for your special someone! Choose your favorite gift 💝'}
        </p>
      </div>

      {/* 상단 광고 */}
      <AdSense adFormat="banner" className="mb-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recommendations.map((gift, index) => (
          <div
            key={gift.id}
            className="card group hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative mb-6 overflow-hidden rounded-xl">
              <img
                src={gift.imageUrl}
                alt={`${gift.category} - ${gift.title}`}
                title={`${gift.title} - ${gift.price}`}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-4 right-4">
                <span className="glass-card px-3 py-1 text-sm font-semibold text-white bg-white/20">
                  <span className="mr-1">🏷️</span>
                  {gift.category}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                  {gift.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{gift.description}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold gradient-text">
                  {gift.price}
                </div>
                {gift.rating && (
                  <div className="flex items-center gap-1 glass-card px-2 py-1">
                    <span className="text-yellow-400 text-lg">⭐</span>
                    <span className="text-sm font-semibold text-gray-700">
                      {gift.rating}
                    </span>
                    {gift.reviewCount && (
                      <span className="text-xs text-gray-500">
                        ({gift.reviewCount}{reviewSuffix[locale] || ''})
                      </span>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => window.open(gift.coupangUrl, '_blank')}
                className="btn-primary w-full text-base py-3 group-hover:shadow-2xl transition-all duration-300"
              >
                <span className="text-lg mr-2">🛒</span>
                {shopText[locale] || shopText.ko}
                <span className="text-lg ml-2">💎</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-6 mb-2">
        <p className="text-xs text-[var(--text-main-70)] bg-[var(--surface-mixed)] inline-block px-4 py-2 rounded-full">
          💡 {locale === 'ko' ? '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.' : 'As a Coupang/Amazon associate, we earn from qualifying purchases.'}
        </p>
      </div>

      <CoupangDynamicBanner />

      {/* 추천 결과 사이 인피드 광고 */}
      <AdSense adFormat="fluid" adLayout="in-article" className="my-6" />

      <div className="text-center space-y-6">
        <div className="glass-card max-w-lg mx-auto p-6">
          <div className="text-2xl mb-4">🤔</div>
          <p className="text-[var(--text-main)] mb-6 font-medium">
            {locale === 'ko' ? '마음에 드는 선물이 없으신가요?' :
             locale === 'ja' ? 'お気に入りのギフトが見つかりませんでしたか？' :
             "Didn't find a gift you like?"}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onRegenerate}
              className="btn-secondary px-6 py-3 text-base font-semibold"
            >
              <span className="text-lg mr-2">🔄</span>
              {locale === 'ko' ? '다시 추천받기' :
               locale === 'ja' ? 'もう一度おすすめを受ける' :
               'Get New Recommendations'}
            </button>

            <button
              onClick={onBackToForm}
              className="btn-primary px-6 py-3 text-base font-semibold"
            >
              <span className="text-lg mr-2">🔙</span>
              {locale === 'ko' ? '처음으로 돌아가기' :
               locale === 'ja' ? '最初に戻る' :
               'Back to Start'}
            </button>
          </div>
          <div className="mt-8">
            <CoupangSearchWidget />
          </div>
        </div>

        <div className="text-sm text-[var(--text-main-70)] flex items-center justify-center gap-2">
          <span className="text-base">💡</span>
          <span>
            {locale === 'ko' ? '더 정확한 추천을 위해 추가 정보를 입력해보세요!' :
             locale === 'ja' ? 'より正確なおすすめのために追加情報を入力してみてください！' :
             'Enter additional information for more accurate recommendations!'}
          </span>
        </div>
      </div>

      {/* 추천결과 페이지 하단 AdSense 광고 */}
      <div className="mt-12">
        <AdSense
          adFormat="rectangle"
          className="mb-6"
        />
      </div>
    </div>
  );
};

export default GiftRecommendations;