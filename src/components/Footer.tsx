'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import AdSense from './AdSense';

const Footer: React.FC = () => {
    const t = useTranslations('footer');
    const locale = useLocale();

    // Different affiliate text based on locale
    const getAffiliateLinks = () => {
        if (locale === 'ko') {
            return '🛍️ 쿠팡 연동';
        } else if (locale === 'ja') {
            return '🛍️ Amazon連携';
        } else {
            return '🛍️ Amazon';
        }
    };

    return (
        <footer className="text-center mt-20 text-[var(--text-main-70)] fade-in">
            <div className="glass-card max-w-2xl mx-auto mb-8">
                <div className="flex items-center justify-center gap-4 mb-4">
                    <span className="text-3xl">✨</span>
                    <h3 className="text-xl font-semibold gradient-text">{t('brand')}</h3>
                    <span className="text-3xl">✨</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">🎯</span>
                        <span>{locale === 'ko' ? 'AI 맞춤 추천' : locale === 'ja' ? 'AIおすすめ' : 'AI Recommendations'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">💝</span>
                        <span>{locale === 'ko' ? '모든 연령대' : locale === 'ja' ? '全年齢対応' : 'All Ages'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">🛍️</span>
                        <span>{getAffiliateLinks()}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto mb-8">
                <AdSense
                    adFormat="banner"
                    className="mb-8"
                />
            </div>

            <p className="mb-2">{t('copyright')}</p>
            <p className="text-sm opacity-70 mb-4">
                {t('affiliate')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[var(--text-main-70)]">
                <Link href="/privacy" className="hover:text-[var(--text-main-90)] transition-colors">
                    {t('privacy')}
                </Link>
                <span>|</span>
                <Link href="/about" className="hover:text-[var(--text-main-90)] transition-colors">
                    {t('about')}
                </Link>
                <span>|</span>
                <Link href="/contact" className="hover:text-[var(--text-main-90)] transition-colors">
                    {t('contact')}
                </Link>
                <span>|</span>
                <Link href="/blog" className="hover:text-[var(--text-main-90)] transition-colors">
                    {t('blog')}
                </Link>
            </div>
        </footer>
    );
};

export default Footer;
