import React, { useState } from 'react';
import GiftForm from './components/GiftForm';
import GiftRecommendations from './components/GiftRecommendations';
import LoadingSpinner from './components/LoadingSpinner';
import AdSense from './components/AdSense';
import GiftGuide from './components/GiftGuide';
import { GiftFormData, GiftRecommendation } from './types/gift';
import { getGiftRecommendations, getDummyRecommendations } from './services/gptService';

function App() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [currentFormData, setCurrentFormData] = useState<GiftFormData | null>(null);

  const handleFormSubmit = async (formData: GiftFormData) => {
    setLoading(true);
    setError(null);
    setCurrentFormData(formData);
    
    try {
      // 항상 실제 API 호출을 시도하고, 실패 시에만 더미 데이터 사용
      console.log('🚀 API 호출 시작...');
      
      const response = await getGiftRecommendations(formData);
      
      if (response.success) {
        setRecommendations(response.recommendations);
        console.log('✅ API 호출 성공:', response.recommendations.length, '개 추천');
      } else {
        console.warn('⚠️ API 호출 실패, 더미 데이터 사용:', response.error);
        // API 호출 실패 시 더미 데이터 사용
        const dummyResponse = await getDummyRecommendations(formData);
        setRecommendations(dummyResponse.recommendations);
        setError('API 호출에 실패했습니다. 샘플 데이터를 표시합니다.');
      }
    } catch (err) {
      console.error('💥 전체 호출 실패:', err);
      try {
        // 완전 실패 시 더미 데이터 사용
        const dummyResponse = await getDummyRecommendations(formData);
        setRecommendations(dummyResponse.recommendations);
        setError('서버 연결에 문제가 있습니다. 샘플 데이터를 표시합니다.');
      } catch (dummyErr) {
        setError('추천을 받아오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!currentFormData) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 재추천 시작...');
      
      const response = await getGiftRecommendations(currentFormData);
      
      if (response.success) {
        setRecommendations(response.recommendations);
        console.log('✅ 재추천 성공:', response.recommendations.length, '개 추천');
      } else {
        console.warn('⚠️ 재추천 실패, 더미 데이터 사용:', response.error);
        const dummyResponse = await getDummyRecommendations(currentFormData);
        setRecommendations(dummyResponse.recommendations);
        setError('API 호출에 실패했습니다. 샘플 데이터를 표시합니다.');
      }
    } catch (err) {
      console.error('💥 재추천 실패:', err);
      try {
        const dummyResponse = await getDummyRecommendations(currentFormData);
        setRecommendations(dummyResponse.recommendations);
        setError('서버 연결에 문제가 있습니다. 샘플 데이터를 표시합니다.');
      } catch (dummyErr) {
        setError('추천을 받아오는 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setRecommendations([]);
    setError(null);
    setCurrentFormData(null);
  };

  return (
    <div className="min-h-screen instagram-gradient relative">
      {/* 플로팅 배경 요소들 */}
      <div className="floating-bg">
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <header className="text-center mb-12 fade-in">
          <div className="mb-6">
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
              ✨ 선물지니
            </h1>
            <div className="text-2xl md:text-3xl font-semibold text-white mb-2">
              GiftGenie
            </div>
          </div>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">
            AI가 추천하는 특별한 선물을 찾아보세요
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg text-white/80 leading-relaxed">
              💑 커플 • 👨‍👩‍👧‍👦 부부 • 👶 청소년 • 🧑‍💼 20-30대 • 👨‍💼 40-50대 중년층 • 👨‍🦳 60-70대 장년층
              <br />
              <span className="text-base">모든 연령대와 관계를 위한 맞춤형 선물 추천 서비스</span>
            </p>
          </div>
        </header>

        <div className="max-w-4xl mx-auto">
          {!loading && recommendations.length === 0 && (
            <div className="fade-in">
              <GiftForm onSubmit={handleFormSubmit} isLoading={loading} />
            </div>
          )}
          
          {loading && (
            <div className="fade-in">
              <LoadingSpinner />
            </div>
          )}
          
          {error && (
            <div className="card bg-red-50/20 border-red-200/30 text-red-100 text-center mb-6 fade-in">
              <div className="text-2xl mb-4">😞</div>
              <p className="mb-4 text-lg">{error}</p>
              <button
                onClick={handleBackToForm}
                className="btn-primary"
              >
                🔄 다시 시도하기
              </button>
            </div>
          )}
          
          {recommendations.length > 0 && (
            <div className="fade-in">
              <GiftRecommendations 
                recommendations={recommendations} 
                onRegenerate={handleRegenerate}
                onBackToForm={handleBackToForm}
              />
            </div>
          )}
        </div>

        {/* 홈페이지 콘텐츠 영역 - 구글 애드센스 승인을 위한 추가 콘텐츠 */}
        {!loading && recommendations.length === 0 && (
          <div className="mt-16 max-w-4xl mx-auto fade-in">
            <GiftGuide />
            
            {/* AdSense 광고 영역 */}
            <div className="mb-8">
              <AdSense 
                adSlot="1234567890"
                adFormat="banner"
                className="mb-6"
              />
            </div>
          </div>
        )}
        
        {/* 푸터 상단 AdSense 광고 */}
        <div className="mt-16 max-w-4xl mx-auto fade-in">
          <AdSense 
            adSlot="1234567891"
            adFormat="banner"
            className="mb-8"
          />
        </div>
        
        {/* 추가 콘텐츠 영역 AdSense 광고 */}
        {recommendations.length > 0 && (
          <div className="mt-12 max-w-4xl mx-auto fade-in">
            <AdSense 
              adSlot="1234567892"
              adFormat="auto"
              className="mb-6"
            />
          </div>
        )}
        
        <footer className="text-center mt-20 text-white/70 fade-in">
          <div className="glass-card max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="text-3xl">✨</span>
              <h3 className="text-xl font-semibold gradient-text">선물지니 GiftGenie</h3>
              <span className="text-3xl">✨</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🎯</span>
                <span>AI 맞춤 추천</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">💝</span>
                <span>모든 연령대</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">🛍️</span>
                <span>쿠팡 연동</span>
              </div>
            </div>
          </div>
          <p className="mb-2">© 2024 선물지니 GiftGenie. AI 기반 맞춤형 선물 추천 서비스</p>
          <p className="text-sm opacity-70 mb-4">
            쿠팡 파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-white/60">
            <a href="#privacy" className="hover:text-white/80 transition-colors">개인정보처리방침</a>
            <span>|</span>
            <a href="#terms" className="hover:text-white/80 transition-colors">이용약관</a>
            <span>|</span>
            <a href="#contact" className="hover:text-white/80 transition-colors">문의하기</a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App; 