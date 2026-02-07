import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import '../globals.css';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VisitorCounter from '@/components/VisitorCounter';
import { ThemeProvider } from '@/context/ThemeContext';
import ThemeWrapper from '@/components/ThemeWrapper';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: any): Promise<Metadata> {
    const { locale } = await params;
    const messages = await getMessages({ locale });
    const metadata = (messages as any).metadata;

    const titles: Record<string, string> = {
        ko: '선물지니 - AI 맞춤형 커플 선물 추천 | 기념일 선물 아이디어',
        en: 'GiftGenie - AI-Powered Gift Recommendations | Perfect Gift Ideas',
        ja: 'ギフトジニー - AIおすすめカップルプレゼント | 記念日ギフトアイデア'
    };

    const descriptions: Record<string, string> = {
        ko: 'AI 선물 추천 서비스 선물지니 - 커플 선물, 기념일 선물, 맞춤형 선물 아이디어를 예산별로 추천해드립니다.',
        en: 'AI Gift Recommendation Service GiftGenie - Get personalized couple gift, anniversary gift, and birthday gift ideas by budget.',
        ja: 'AIギフト推薦サービス ギフトジニー - カップルプレゼント、記念日ギフト、オーダーメイドギフトアイデアを予算別にご紹介。'
    };

    const alternateUrls: Record<string, string> = {
        ko: 'https://couplegift.netlify.app/',
        en: 'https://couplegift.netlify.app/en/',
        ja: 'https://couplegift.netlify.app/ja/'
    };

    return {
        metadataBase: new URL('https://couplegift.netlify.app'),
        title: metadata?.title || titles[locale] || titles.ko,
        description: metadata?.description || descriptions[locale] || descriptions.ko,
        keywords: metadata?.keywords,
        authors: [{ name: locale === 'ko' ? '선물지니 GiftGenie' : 'GiftGenie' }],
        alternates: {
            canonical: alternateUrls[locale] || alternateUrls.ko,
            languages: {
                'ko': 'https://couplegift.netlify.app/',
                'en': 'https://couplegift.netlify.app/en/',
                'ja': 'https://couplegift.netlify.app/ja/',
                'x-default': 'https://couplegift.netlify.app/'
            }
        },
        openGraph: {
            type: 'website',
            url: alternateUrls[locale] || alternateUrls.ko,
            title: metadata?.ogTitle || titles[locale] || titles.ko,
            description: metadata?.ogDescription || descriptions[locale] || descriptions.ko,
            locale: locale === 'ko' ? 'ko_KR' : locale === 'ja' ? 'ja_JP' : 'en_US',
            images: [
                {
                    url: '/og-image.jpg',
                    width: 1200,
                    height: 630,
                    alt: locale === 'ko' ? '선물지니 GiftGenie' : 'GiftGenie',
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: metadata?.ogTitle || titles[locale] || titles.ko,
            description: metadata?.ogDescription || descriptions[locale] || descriptions.ko,
            images: ['/og-image.jpg'],
        },
        verification: {
            google: 'P6X5BpKy6Tqy78Teu6aFK1jQB1ZyyxpP9tFKHa4OOgA',
        },
    };
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ef4444',
};

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Validate locale
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Get messages for the locale
    const messages = await getMessages();
    const header = (messages as any).header;

    return (
        <html lang={locale}>
            <head>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5907754718994620" crossOrigin="anonymous"></script>
                {/* hreflang tags for SEO */}
                <link rel="alternate" hrefLang="ko" href="https://couplegift.netlify.app/" />
                <link rel="alternate" hrefLang="en" href="https://couplegift.netlify.app/en/" />
                <link rel="alternate" hrefLang="ja" href="https://couplegift.netlify.app/ja/" />
                <link rel="alternate" hrefLang="x-default" href="https://couplegift.netlify.app/" />
                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": locale === 'ko' ? "선물지니 GiftGenie" : locale === 'ja' ? "ギフトジニー GiftGenie" : "GiftGenie",
                            "alternateName": locale === 'ko' ? "AI 맞춤형 커플 선물 추천 서비스" : locale === 'ja' ? "AIおすすめカップルプレゼントサービス" : "AI-Powered Personalized Gift Recommendation Service",
                            "description": locale === 'ko'
                                ? "AI 맞춤형 커플 선물 추천 서비스 - 기념일 선물, 생일 선물, 연인 선물 아이디어를 예산별로 추천"
                                : locale === 'ja'
                                    ? "AIおすすめカップルギフトサービス - 記念日ギフト、誕生日プレゼント、恋人へのギフトアイデアを予算別に推薦"
                                    : "AI-Powered Personalized Gift Recommendation Service - Anniversary gifts, birthday gifts, and romantic gift ideas by budget",
                            "url": `https://couplegift.netlify.app/${locale === 'ko' ? '' : locale + '/'}`,
                            "applicationCategory": "LifestyleApplication",
                            "operatingSystem": locale === 'ko' ? "웹 브라우저" : "Web Browser",
                            "inLanguage": locale,
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": locale === 'ko' ? "KRW" : locale === 'ja' ? "JPY" : "USD"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": locale === 'ko' ? "선물지니 GiftGenie" : "GiftGenie",
                                "url": "https://couplegift.netlify.app/"
                            }
                        })
                    }}
                />
            </head>
            <body className={inter.className}>
                <NextIntlClientProvider messages={messages}>
                    <ThemeProvider>
                        <ThemeWrapper>
                            <VisitorCounter />
                            <div className="container mx-auto px-4 py-8 relative z-10">
                                <header className="text-center mb-12 fade-in">
                                    <div className="mb-6">
                                        <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
                                            ✨ {header?.title || 'GiftGenie'}
                                        </h1>
                                        <div className="text-2xl md:text-3xl font-semibold text-[var(--text-main)] mb-2" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                                            {header?.subtitle || 'GiftGenie'}
                                        </div>
                                    </div>
                                    <p className="text-xl md:text-2xl text-[var(--text-main-90)] font-medium mb-4" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
                                        {header?.tagline || 'AI-Powered Gift Recommendations'}
                                    </p>
                                    <div className="max-w-3xl mx-auto">
                                        <p className="text-lg text-[var(--text-main-70)] leading-relaxed">
                                            {header?.categories || '💑 Couple Gifts • 🎂 Birthday Gifts • 💒 Anniversary Gifts'}
                                            <br />
                                            <span className="text-base">{header?.description || 'AI-powered personalized gift recommendations'}</span>
                                        </p>
                                    </div>
                                </header>

                                <Navigation />

                                <main>{children}</main>

                                <Footer />
                            </div>
                            <LanguageSwitcher />
                            <ThemeSwitcher />
                        </ThemeWrapper>
                    </ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
