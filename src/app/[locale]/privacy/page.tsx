import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/lib/seo';
import PrivacyClient from './PrivacyClient';

const titles: Record<string, string> = {
    ko: '개인정보처리방침',
    en: 'Privacy Policy',
    ja: 'プライバシーポリシー',
};

const descriptions: Record<string, string> = {
    ko: '선물지니의 개인정보 수집·이용, 쿠키 및 광고 관련 정책을 안내합니다.',
    en: 'How GiftGenie handles personal information, cookies and advertising.',
    ja: 'ギフトジニーの個人情報・クッキー・広告に関するポリシーのご案内。',
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: titles[locale] || titles.ko,
        description: descriptions[locale] || descriptions.ko,
        alternates: pageAlternates(locale, '/privacy'),
    };
}

export default async function PrivacyPage({ params }: any) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <PrivacyClient />;
}
