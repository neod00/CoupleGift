import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/lib/seo';
import ContactClient from './ContactClient';

const titles: Record<string, string> = {
    ko: '문의하기',
    en: 'Contact',
    ja: 'お問い合わせ',
};

const descriptions: Record<string, string> = {
    ko: '선물지니 서비스 이용 중 궁금한 점이나 제안하고 싶은 내용을 보내주세요.',
    en: 'Questions or suggestions about GiftGenie? Get in touch with us.',
    ja: 'ギフトジニーへのご質問・ご提案はこちらから。',
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { locale } = await params;
    return {
        title: titles[locale] || titles.ko,
        description: descriptions[locale] || descriptions.ko,
        alternates: pageAlternates(locale, '/contact'),
    };
}

export default async function ContactPage({ params }: any) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <ContactClient />;
}
