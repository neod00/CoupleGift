import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/lib/seo';
import GiftIndexClient from './GiftIndexClient';

const titles: Record<string, string> = {
    ko: '맞춤형 선물 가이드 - 성별·나이·기념일·예산별 선물 추천',
    en: 'Gift Guide - Recommendations by Gender, Age, Occasion & Budget',
    ja: 'ギフトガイド - 性別・年齢・記念日・予算別のおすすめ',
};

const descriptions: Record<string, string> = {
    ko: '여자친구·남자친구·부모님 선물부터 생일·기념일·명절 선물까지, 성별·나이·예산별로 정리한 선물 추천 가이드.',
    en: 'Curated gift guides by gender, age group, occasion and budget - birthdays, anniversaries and holidays.',
    ja: '性別・年齢・予算別に整理したギフト推薦ガイド。誕生日・記念日・祝日のプレゼント選びに。',
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: titles[locale] || titles.ko,
        description: descriptions[locale] || descriptions.ko,
        alternates: pageAlternates(locale, '/gift'),
    };
}

export default async function GiftIndexPage({ params }: any) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <GiftIndexClient />;
}
