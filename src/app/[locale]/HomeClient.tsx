'use client';

import React, { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import GiftForm from '@/components/GiftForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import AdSense from '@/components/AdSense';
import GiftGuide from '@/components/GiftGuide';
import { GiftFormData, GiftRecommendation } from '@/types/gift';
import { getGiftRecommendations, getDummyRecommendations } from '@/services/gptService';

export default function Home() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormSubmit = async (formData: GiftFormData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await getGiftRecommendations(formData);
            let recommendations: GiftRecommendation[];

            if (response.success && response.recommendations.length > 0) {
                recommendations = response.recommendations;
            } else {
                const dummyResponse = await getDummyRecommendations(formData);
                recommendations = dummyResponse.recommendations;
            }

            // sessionStorage에 결과를 저장하고 결과 페이지로 이동
            // 페이지 이동 → 새 페이지뷰 → 광고 노출 기회 2배
            sessionStorage.setItem('giftRecommendations', JSON.stringify(recommendations));
            sessionStorage.setItem('giftFormData', JSON.stringify(formData));
            router.push('/result');
        } catch (err) {
            try {
                const dummyResponse = await getDummyRecommendations(formData);
                sessionStorage.setItem('giftRecommendations', JSON.stringify(dummyResponse.recommendations));
                sessionStorage.setItem('giftFormData', JSON.stringify(formData));
                router.push('/result');
            } catch (dummyErr) {
                setError(t('common.error'));
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {!loading && (
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
                        onClick={() => setError(null)}
                        className="btn-primary"
                    >
                        🔄 {t('common.retry')}
                    </button>
                </div>
            )}

            {!loading && (
                <div className="mt-16 fade-in">
                    <GiftGuide />
                    <div className="mb-8">
                        <AdSense
                            adFormat="banner"
                            className="mb-6"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
