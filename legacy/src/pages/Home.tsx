import React, { useState } from 'react';
import GiftForm from '../components/GiftForm.tsx';
import GiftRecommendations from '../components/GiftRecommendations.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import AdSense from '../components/AdSense.tsx';
import GiftGuide from '../components/GiftGuide.tsx';
import { GiftFormData, GiftRecommendation } from '../types/gift.ts';
import { getGiftRecommendations, getDummyRecommendations } from '../services/gptService.ts';

const Home: React.FC = () => {
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

      {/* 홈페이지 콘텐츠 영역 - 구글 애드센스 승인을 위한 추가 콘텐츠 */}
      {!loading && recommendations.length === 0 && (
        <div className="mt-16 fade-in">
          <GiftGuide />
          
          {/* AdSense 광고 영역 */}
          <div className="mb-8">
            <AdSense 
              adFormat="banner"
              className="mb-6"
            />
          </div>
        </div>
      )}
      
      {/* 추가 콘텐츠 영역 AdSense 광고 */}
      {recommendations.length > 0 && (
        <div className="mt-12 fade-in">
          <AdSense 
            adFormat="auto"
            className="mb-6"
          />
        </div>
      )}
    </div>
  );
};

export default Home;

