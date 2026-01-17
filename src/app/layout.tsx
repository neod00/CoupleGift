import type { Metadata } from 'next'
import './globals.css'
import Navigation from '../components/Navigation'
import AdSense from '../components/AdSense'
import Footer from '../components/Footer'
import VisitorCounter from '../components/VisitorCounter'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL('https://couplegift.netlify.app'),
    title: '선물지니 - AI 맞춤형 커플 선물 추천 | 기념일 선물 아이디어',
    description: 'AI 선물 추천 서비스 선물지니 - 커플 선물, 기념일 선물, 맞춤형 선물 아이디어를 예산별로 추천해드립니다. 연인 선물부터 생일 선물까지 쿠팡에서 바로 구매 가능!',
    keywords: '커플 선물 추천, AI 선물 추천, 기념일 선물, 맞춤형 선물, 선물지니, 생일 선물, 연인 선물, 선물 아이디어, 예산별 선물, 쿠팡 선물, 선물 추천 서비스, 커플 기념일, 결혼기념일, 밸런타인데이, 화이트데이, 크리스마스선물',
    authors: [{ name: '선물지니 GiftGenie' }],
    alternates: {
        canonical: 'https://couplegift.netlify.app/',
    },
    openGraph: {
        type: 'website',
        url: 'https://couplegift.netlify.app/',
        title: '선물지니 - AI 맞춤형 커플 선물 추천 서비스',
        description: 'AI가 추천하는 맞춤형 선물 아이디어! 커플 선물, 기념일 선물, 생일 선물을 예산별로 추천받고 쿠팡에서 바로 구매하세요',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
                alt: '선물지니 GiftGenie',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: '선물지니 - AI 맞춤형 커플 선물 추천 서비스',
        description: 'AI가 추천하는 맞춤형 선물 아이디어! 커플 선물, 기념일 선물, 생일 선물을 예산별로 추천받고 쿠팡에서 바로 구매하세요',
        images: ['/og-image.jpg'],
    },
    verification: {
        google: 'P6X5BpKy6Tqy78Teu6aFK1jQB1ZyyxpP9tFKHa4OOgA',
    },
}

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#ef4444',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <head>
                <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5907754718994620" crossOrigin="anonymous"></script>
                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "선물지니 GiftGenie",
                            "alternateName": "AI 맞춤형 커플 선물 추천 서비스",
                            "description": "AI 맞춤형 커플 선물 추천 서비스 - 기념일 선물, 생일 선물, 연인 선물 아이디어를 예산별로 추천하고 쿠팡에서 바로 구매 가능",
                            "url": "https://couplegift.netlify.app/",
                            "applicationCategory": "LifestyleApplication",
                            "operatingSystem": "웹 브라우저",
                            "keywords": "커플 선물 추천, AI 선물 추천, 기념일 선물, 맞춤형 선물, 선물지니, 생일 선물, 연인 선물, 선물 아이디어, 예산별 선물, 쿠팡 선물",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "KRW"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "선물지니 GiftGenie",
                                "url": "https://couplegift.netlify.app/"
                            },
                            "featureList": [
                                "AI 맞춤형 선물 추천",
                                "커플 선물 추천",
                                "기념일 선물 아이디어",
                                "생일 선물 추천",
                                "예산별 선물 추천",
                                "쿠팡 연동 구매"
                            ]
                        })
                    }}
                />
            </head>
            <body className={inter.className}>
                <VisitorCounter />
                <div className="min-h-screen instagram-gradient relative">
                    {/* 플로팅 배경 요소들 */}
                    <div className="floating-bg">
                        <div className="floating-element"></div>
                        <div className="floating-element"></div>
                        <div className="floating-element"></div>
                        <div className="floating-element"></div>
                        <div className="floating-element"></div>
                    </div>

                    <div className="container mx-auto px-4 py-8 relative z-10">
                        <header className="text-center mb-12 fade-in">
                            <div className="mb-6">
                                <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
                                    ✨ 선물지니
                                </h1>
                                <div className="text-2xl md:text-3xl font-semibold text-white mb-2">
                                    GiftGenie
                                </div>
                            </div>
                            <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">
                                AI 맞춤형 커플 선물 추천 - 특별한 기념일을 위한 완벽한 선물 아이디어
                            </p>
                            <div className="max-w-3xl mx-auto">
                                <p className="text-lg text-white/80 leading-relaxed">
                                    💑 커플 선물 • 🎂 생일 선물 • 💒 기념일 선물 • 👶 청소년 • 🧑‍💼 20-30대 • 👨‍💼 40-50대 중년층 • 👨‍🦳 60-70대 장년층
                                    <br />
                                    <span className="text-base">모든 연령대와 관계를 위한 AI 맞춤형 선물 추천 서비스 - 예산별 추천으로 쿠팡에서 바로 구매 가능</span>
                                </p>
                            </div>
                        </header>

                        <Navigation />

                        <main>{children}</main>

                        <Footer />
                    </div>
                </div>
            </body>
        </html>
    )
}
