import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'contents.coupangcdn.com',
            },
            {
                protocol: 'https',
                hostname: 'amazon.com',
            },
            {
                protocol: 'https',
                hostname: 'm.media-amazon.com',
            },
        ],
    },
    trailingSlash: true,
    async redirects() {
        // 자동 발행 파이프라인이 만들어낸 중복 주제 블로그 글들을 대표 글 하나로 통합하면서
        // 삭제된 slug. 이미 공유되었거나 색인된 링크가 죽지 않도록 대표 글로 301 리다이렉트한다.
        const CHUSEOK_REDIRECTS = {
            // → chuseok-parents-gift-ideas-2026 (부모님 용돈 대신 감동 선물, 통합 대표글)
            '2026-chuseok-parents-special-gifts': 'chuseok-parents-gift-ideas-2026',
            '2026-chuseok-parents-thoughtful-gifts': 'chuseok-parents-gift-ideas-2026',
            '2026-chuseok-parents-unique-gifts': 'chuseok-parents-gift-ideas-2026',
            '2026-chuseok-thoughtful-parent-gifts': 'chuseok-parents-gift-ideas-2026',
            'chuseok-2026-parents-thoughtful-gifts': 'chuseok-parents-gift-ideas-2026',
            'chuseok-gifts-for-parents-2026-unique': 'chuseok-parents-gift-ideas-2026',
            'chuseok-gifts-for-parents': 'chuseok-parents-gift-ideas-2026',
            'chuseok-parents-gifts-2026': 'chuseok-parents-gift-ideas-2026',
            'chuseok-parents-gifts-beyond-money': 'chuseok-parents-gift-ideas-2026',
            'chuseok-parents-gifts-thoughtful': 'chuseok-parents-gift-ideas-2026',
            'chuseok-parents-gifts-trends': 'chuseok-parents-gift-ideas-2026',
            'chuseok-parents-gifts': 'chuseok-parents-gift-ideas-2026',
            'chuseok-parents-practical-gifts-2026': 'chuseok-parents-gift-ideas-2026',
            'chuseok-parents-sensible-gifts': 'chuseok-parents-gift-ideas-2026',
            'chuseok-parents-thoughtful-gifts': 'chuseok-parents-gift-ideas-2026',
            'chuseok-unique-gifts-parents-2026': 'chuseok-parents-gift-ideas-2026',
            'smart-chuseok-gifts-for-parents-2026': 'chuseok-parents-gift-ideas-2026',
            // → chuseok-parents-health-gifts-2026 (부모님 건강/힐링 선물, 통합 대표글)
            'chuseok-2026-parents-healing-wellness-gifts': 'chuseok-parents-health-gifts-2026',
            // → chuseok-early-bird-gifts-2026 (일반 명절 선물, 통합 대표글)
            '2026-chuseok-best-gifts': 'chuseok-early-bird-gifts-2026',
            '2026-chuseok-gift-recommendations': 'chuseok-early-bird-gifts-2026',
            '2026-chuseok-gifts': 'chuseok-early-bird-gifts-2026',
        };

        const blogRedirects = Object.entries(CHUSEOK_REDIRECTS).flatMap(([oldSlug, newSlug]) => [
            {
                source: `/blog/${oldSlug}`,
                destination: `/blog/${newSlug}/`,
                permanent: true,
            },
            {
                source: `/:locale(en|ja)/blog/${oldSlug}`,
                destination: `/:locale/blog/${newSlug}/`,
                permanent: true,
            },
        ]);

        return [
            {
                source: '/category/:path*',
                destination: '/gift/',
                permanent: true, // 301 리다이렉트 (검색엔진에 영구 이동 알림)
            },
            ...blogRedirects,
        ]
    },
}

export default withNextIntl(nextConfig);
