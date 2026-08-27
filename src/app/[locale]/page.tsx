import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { pageAlternates } from '@/lib/seo';
import HomeClient from './HomeClient';

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { locale } = await params;
    return {
        alternates: pageAlternates(locale, ''),
    };
}

export default async function HomePage({ params }: any) {
    const { locale } = await params;
    setRequestLocale(locale);
    return <HomeClient />;
}
