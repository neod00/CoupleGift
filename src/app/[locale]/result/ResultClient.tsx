'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import GiftRecommendations from '@/components/GiftRecommendations';
import LoadingSpinner from '@/components/LoadingSpinner';
import AdSense from '@/components/AdSense';
import { GiftFormData, GiftRecommendation } from '@/types/gift';
import { getGiftRecommendations, getDummyRecommendations } from '@/services/gptService';

export default function ResultPage() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const [recommendations, setRecommendations] = useState<GiftRecommendation[]>([]);
    const [formData, setFormData] = useState<GiftFormData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // sessionStorage에서 결과 데이터 복원
        const savedRecommendations = sessionStorage.getItem('giftRecommendations');
        const savedFormData = sessionStorage.getItem('giftFormData');

        if (savedRecommendations) {
            try {
                setRecommendations(JSON.parse(savedRecommendations));
                if (savedFormData) {
                    setFormData(JSON.parse(savedFormData));
                }
                setIsReady(true);
            } catch {
                router.push('/');
            }
        } else {
            // 데이터가 없으면 메인 페이지로 이동
            router.push('/');
        }
    }, [router]);

    const handleRegenerate = async () => {
        if (!formData) return;

        setLoading(true);

        try {
            const response = await getGiftRecommendations(formData);

            if (response.success && response.recommendations.length > 0) {
                setRecommendations(response.recommendations);
                sessionStorage.setItem('giftRecommendations', JSON.stringify(response.recommendations));
            } else {
                const dummyResponse = await getDummyRecommendations(formData);
                setRecommendations(dummyResponse.recommendations);
                sessionStorage.setItem('giftRecommendations', JSON.stringify(dummyResponse.recommendations));
            }
        } catch (err) {
            try {
                const dummyResponse = await getDummyRecommendations(formData);
                setRecommendations(dummyResponse.recommendations);
                sessionStorage.setItem('giftRecommendations', JSON.stringify(dummyResponse.recommendations));
            } catch {
                // 재시도 실패 시 기존 결과 유지
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBackToForm = () => {
        sessionStorage.removeItem('giftRecommendations');
        sessionStorage.removeItem('giftFormData');
        router.push('/');
    };

    if (!isReady) {
        return (
            <div className="max-w-4xl mx-auto fade-in">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* 상단 광고 - 결과 페이지 전용 */}
            <AdSense adFormat="banner" className="mb-6" />

            {loading ? (
                <div className="fade-in"><LoadingSpinner /></div>
            ) : (
                <div className="fade-in">
                    <GiftRecommendations
                        recommendations={recommendations}
                        onRegenerate={handleRegenerate}
                        onBackToForm={handleBackToForm}
                    />
                </div>
            )}

            {/* 하단 추가 광고 */}
            <div className="mt-8">
                <AdSense adFormat="auto" className="mb-6" />
            </div>

            {/* 관련 선물 가이드 내부 링크 (SEO + 페이지뷰 증대) */}
            <section className="mt-12 glass-card p-6">
                <h2 className="text-xl font-bold text-[var(--text-main)] mb-4 text-center">
                    {locale === 'ko' ? '📚 인기 선물 가이드' :
                     locale === 'ja' ? '📚 人気ギフトガイド' :
                     '📚 Popular Gift Guides'}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {[
                        { slug: 'female-20s-birthday-3-5', ko: '20대 여성 생일', en: '20s Women Birthday', ja: '20代女性誕生日' },
                        { slug: 'male-20s-anniversary-5-10', ko: '20대 남성 기념일', en: '20s Men Anniversary', ja: '20代男性記念日' },
                        { slug: 'female-30s-christmas-5-10', ko: '30대 여성 크리스마스', en: '30s Women Christmas', ja: '30代女性クリスマス' },
                        { slug: 'female-50s-parents-5-10', ko: '50대 어머니 어버이날', en: "50s Mom Parents' Day", ja: '50代母の日' },
                        { slug: 'male-30s-birthday-10-20', ko: '30대 남성 생일', en: '30s Men Birthday', ja: '30代男性誕生日' },
                        { slug: 'female-20s-100days-3-5', ko: '20대 여성 100일', en: '20s Women 100 Days', ja: '20代女性100日記念' },
                    ].map(guide => (
                        <a
                            key={guide.slug}
                            href={`/${locale === 'ko' ? '' : locale + '/'}gift/${guide.slug}`}
                            className="text-center p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all text-sm text-[var(--text-main-90)]"
                        >
                            {guide[locale as 'ko' | 'en' | 'ja'] || guide.ko}
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
