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
        return [
            {
                source: '/category/:path*',
                destination: '/gift/',
                permanent: true, // 301 리다이렉트 (검색엔진에 영구 이동 알림)
            },
        ]
    },
}

export default withNextIntl(nextConfig);
