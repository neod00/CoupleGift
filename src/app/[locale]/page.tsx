'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import GiftForm from '@/components/GiftForm';
import GiftRecommendations from '@/components/GiftRecommendations';
import LoadingSpinner from '@/components/LoadingSpinner';
import AdSense from '@/components/AdSense';
import GiftGuide from '@/components/GiftGuide';
import { GiftFormData, GiftRecommendation } from '@/types/gift';
import { getGiftRecommendations, getDummyRecommendations } from '@/services/gptService';

export default function Home() {
    const t = useTranslations();
    const [loading, setLoading] = useState(false);
    const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [currentFormData, setCurrentFormData] = useState<GiftFormData | null>(null);

    const handleFormSubmit = async (formData: GiftFormData) => {
        setLoading(true);
        setError(null);
        setCurrentFormData(formData);

        try {
            const response = await getGiftRecommendations(formData);

            if (response.success) {
                setRecommendations(response.recommendations);
            } else {
                const dummyResponse = await getDummyRecommendations(formData);
                setRecommendations(dummyResponse.recommendations);
                setError(t('common.error'));
            }
        } catch (err) {
            try {
                const dummyResponse = await getDummyRecommendations(formData);
                setRecommendations(dummyResponse.recommendations);
                setError(t('common.error'));
            } catch (dummyErr) {
                setError(t('common.error'));
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
            const response = await getGiftRecommendations(currentFormData);

            if (response.success) {
                setRecommendations(response.recommendations);
            } else {
                const dummyResponse = await getDummyRecommendations(currentFormData);
                setRecommendations(dummyResponse.recommendations);
                setError(t('common.error'));
            }
        } catch (err) {
            try {
                const dummyResponse = await getDummyRecommendations(currentFormData);
                setRecommendations(dummyResponse.recommendations);
                setError(t('common.error'));
            } catch (dummyErr) {
                setError(t('common.error'));
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
                        🔄 {t('common.retry')}
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

            {!loading && recommendations.length === 0 && (
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
}
