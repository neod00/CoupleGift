'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { GiftRecommendation } from '../types/gift';
import { ProductGrid } from '@/components/ProductCard';
import AdSense from './AdSense';
import CoupangDynamicBanner from './CoupangDynamicBanner';
import CoupangSearchWidget from './CoupangSearchWidget';

interface GiftRecommendationsProps {
  recommendations: GiftRecommendation[];
  onRegenerate: () => void;
  onBackToForm: () => void;
}

/** 쿠팡 파트너스 정책상 상품 링크 근처에 반드시 노출해야 하는 문구 (결과 섹션 전체에 한 번만) */
const COUPANG_DISCLOSURE_KO = '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';
const AFFILIATE_DISCLOSURE_EN = 'As a Coupang/Amazon associate, we earn from qualifying purchases.';

/** 실제 상품이 매칭된 추천인지 (링크가 파트너스 추적 상품 URL 인지) */
function hasRealProduct(gift: GiftRecommendation): boolean {
  return gift.source === 'api' || gift.source === 'catalog';
}

/** 이미지가 없을 때 대체 박스에 띄울 카테고리 이모지 */
function categoryEmoji(category: string): string {
  const c = (category || '').toLowerCase();
  if (/목걸이|반지|팔찌|액세서리|악세서리|쥬얼리|주얼리/.test(c)) return '💍';
  if (/뷰티|화장품|미용|스킨|립/.test(c)) return '💄';
  if (/향수|디퓨저|캔들/.test(c)) return '🌸';
  if (/전자|it|이어폰|테크|가전/.test(c)) return '🎧';
  if (/패션|의류|가방|지갑|신발/.test(c)) return '👜';
  if (/생활|인테리어|리빙|홈/.test(c)) return '🏠';
  if (/꽃|플라워/.test(c)) return '💐';
  if (/식품|디저트|초콜릿|와인|음식/.test(c)) return '🍫';
  if (/도서|책|문구/.test(c)) return '📚';
  if (/체험|여행|티켓/.test(c)) return '🎟️';
  return '🎁';
}

/** en/ja 에서는 라벨이 Amazon 이므로 링크도 Amazon 검색으로 보낸다 (라벨과 링크 일치) */
function buildAmazonSearchUrl(locale: string, keyword: string): string {
  if (locale === 'ja') {
    return `https://www.amazon.co.jp/s?k=${encodeURIComponent(`${keyword} ギフト`)}`;
  }
  return `https://www.amazon.com/s?k=${encodeURIComponent(`${keyword} gift`)}`;
}

/** 실제 상품 이미지 → 로드 실패/없음 시 카테고리 이모지 그라디언트 박스 */
function GiftImage({ gift }: { gift: GiftRecommendation }) {
  const [failed, setFailed] = useState(false);
  const src = (gift.imageUrl || '').trim();

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={`${gift.category} - ${gift.title}`}
        className="w-full h-56 flex items-center justify-center bg-gradient-to-br from-purple-400/40 via-pink-300/30 to-indigo-400/40"
      >
        <span className="text-6xl drop-shadow" aria-hidden="true">
          {categoryEmoji(gift.category)}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${gift.category} - ${gift.title}`}
      title={`${gift.title} - ${gift.price}`}
      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

const GiftRecommendations: React.FC<GiftRecommendationsProps> = ({
  recommendations,
  onRegenerate,
  onBackToForm
}) => {
  const t = useTranslations();
  const locale = useLocale();
  const isKo = locale === 'ko';

  // 언어별 쇼핑 버튼 라벨. ko 는 실제 상품 링크(보기)와 검색 폴백(검색)을 구분한다.
  const shopLabel = (gift: GiftRecommendation): string => {
    if (isKo) return hasRealProduct(gift) ? '쿠팡에서 보기' : '쿠팡에서 검색';
    if (locale === 'ja') return 'Amazonで検索';
    return 'Search on Amazon';
  };

  // ko: 서버가 준 링크(파트너스 추적 상품 URL 또는 쿠팡 검색 URL) 그대로.
  // en/ja: 라벨이 Amazon 이므로 Amazon 검색으로 (모델 키워드 기준).
  const shopHref = (gift: GiftRecommendation): string => {
    if (isKo) return gift.coupangUrl;
    return buildAmazonSearchUrl(locale, gift.searchKeyword || gift.title);
  };

  const priceNote = (gift: GiftRecommendation): string => {
    if (hasRealProduct(gift)) {
      return isKo ? '쿠팡 판매가 · 변동될 수 있음' : locale === 'ja' ? '参考価格（変動あり）' : 'Reference price (may change)';
    }
    return isKo ? 'AI 예상 가격' : locale === 'ja' ? 'AI予想価格' : 'AI estimated price';
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
        {recommendations.map((gift, index) => {
          const href = shopHref(gift);
          const moreOptions = isKo && gift.products && gift.products.length > 1 ? gift.products.slice(1, 3) : [];

          return (
            <div
              key={gift.id}
              className="card group hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative mb-6 overflow-hidden rounded-xl">
                <GiftImage gift={gift} />
                <div className="absolute top-4 right-4">
                  <span className="glass-card px-3 py-1 text-sm font-semibold text-white bg-white/20">
                    <span className="mr-1">🏷️</span>
                    {gift.category}
                  </span>
                </div>
                {isKo && gift.products?.[0]?.isRocket && (
                  <span className="absolute top-4 left-4 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white shadow">
                    🚀 로켓배송
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {gift.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{gift.description}</p>
                  {isKo && hasRealProduct(gift) && gift.products?.[0]?.productName && (
                    <p className="mt-2 text-xs text-gray-500 line-clamp-2" title={gift.products[0].productName}>
                      🛒 {gift.products[0].productName}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold gradient-text">
                      {gift.price}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{priceNote(gift)}</div>
                  </div>
                  {/* 평점/리뷰 수는 실제 데이터가 있을 때만 렌더링 (서버가 값을 주지 않으면 표시 안 함) */}
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

                {/* 파트너스 정책: API 가 준 추적 URL 을 그대로 사용, 파라미터 추가/변경 금지 */}
                <a
                  href={href}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  aria-label={`${gift.title} - ${shopLabel(gift)}`}
                  className="btn-primary w-full inline-flex items-center justify-center text-center text-base py-3 group-hover:shadow-2xl transition-all duration-300"
                >
                  <span className="text-lg mr-2">🛒</span>
                  {shopLabel(gift)}
                  <span className="text-lg ml-2">💎</span>
                </a>

                {/* 같은 키워드의 다른 실제 상품 (고지 문구는 결과 섹션 하단에 한 번만) */}
                {moreOptions.length > 0 && (
                  <ProductGrid products={moreOptions} title="다른 옵션" disclosure={false} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 결과 섹션 전체에 대한 파트너스 고지 (상품 링크 바로 아래, 한 번만) */}
      <div className="text-center mt-6 mb-2">
        <p className="text-xs text-[var(--text-main-70)] bg-[var(--surface-mixed)] inline-block px-4 py-2 rounded-full">
          💡 {isKo ? COUPANG_DISCLOSURE_KO : AFFILIATE_DISCLOSURE_EN}
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
