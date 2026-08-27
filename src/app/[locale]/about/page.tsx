import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/lib/seo';
import AboutClient from './AboutClient';

const titles: Record<string, string> = {
    ko: '서비스 소개',
    en: 'About Us',
    ja: 'サービス紹介',
};

const descriptions: Record<string, string> = {
    ko: 'AI 기반 맞춤형 선물 추천 서비스 선물지니를 소개합니다. 연령, 성별, 기념일, 예산을 분석해 딱 맞는 선물을 찾아드려요.',
    en: 'Learn about GiftGenie, the AI-powered personalized gift recommendation service that analyzes age, gender, occasion and budget.',
    ja: 'AIベースのパーソナライズギフト推薦サービス、ギフトジニーのご紹介です。',
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: titles[locale] || titles.ko,
        description: descriptions[locale] || descriptions.ko,
        alternates: pageAlternates(locale, '/about'),
    };
}

export default async function AboutPage({ params }: any) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <AboutClient />;
}
