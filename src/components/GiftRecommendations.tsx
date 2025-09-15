import React from 'react';
import { GiftRecommendation } from '../types/gift.ts';
import AdSense from './AdSense.tsx';

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
  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="mb-6">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            ✨ 추천 선물 ✨
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">🎁</span>
            <span className="text-xl text-white/90 font-semibold">AI가 선별한 특별한 선물들</span>
            <span className="text-2xl">🎁</span>
          </div>
        </div>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          당신의 소중한 사람을 위한 완벽한 선물을 찾았어요! 마음에 드는 선물을 선택해보세요 💝
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {recommendations.map((gift, index) => (
          <div 
            key={gift.id} 
            className="card group hover:scale-105 transition-all duration-300"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="relative mb-6 overflow-hidden rounded-xl">
              <img 
                src={gift.imageUrl} 
                alt={`${gift.category} 카테고리 ${gift.title} - AI 맞춤형 선물 추천`}
                title={`${gift.title} - ${gift.price} 예산별 선물 추천`}
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
                    <span className="text-xs text-gray-500">
                      ({gift.reviewCount}개)
                    </span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => window.open(gift.coupangUrl, '_blank')}
                className="btn-primary w-full text-base py-3 group-hover:shadow-2xl transition-all duration-300"
              >
                <span className="text-lg mr-2">🛒</span>
                쿠팡에서 구매하기
                <span className="text-lg ml-2">💎</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center space-y-6">
        <div className="glass-card max-w-lg mx-auto p-6">
          <div className="text-2xl mb-4">🤔</div>
          <p className="text-gray-700 mb-6 font-medium">
            마음에 드는 선물이 없으신가요?
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={onRegenerate}
              className="btn-secondary px-6 py-3 text-base font-semibold"
            >
              <span className="text-lg mr-2">🔄</span>
              다시 추천받기
            </button>
            
            <button
              onClick={onBackToForm}
              className="btn-primary px-6 py-3 text-base font-semibold"
            >
              <span className="text-lg mr-2">🔙</span>
              처음으로 돌아가기
            </button>
          </div>
        </div>
        
        <div className="text-sm text-white/60 flex items-center justify-center gap-2">
          <span className="text-base">💡</span>
          <span>더 정확한 추천을 위해 추가 정보를 입력해보세요!</span>
        </div>
      </div>

      {/* 추천결과 페이지 하단 AdSense 광고 */}
      <div className="mt-12">
        <AdSense 
          adSlot="RECOMMENDATIONS_BOTTOM_AD_SLOT"
          adFormat="rectangle"
          className="mb-6"
        />
      </div>
    </div>
  );
};

export default GiftRecommendations; 