export const SITE_URL = 'https://couplegift.netlify.app';

/**
 * 로케일별 절대 URL 생성 (trailingSlash: true 설정에 맞춰 항상 슬래시로 끝남)
 * localeUrl('ko', '/blog')  -> https://couplegift.netlify.app/blog/
 * localeUrl('en', '/blog')  -> https://couplegift.netlify.app/en/blog/
 */
export function localeUrl(locale: string, path: string = ''): string {
    const prefix = locale === 'ko' ? '' : `/${locale}`;
    const normalized = path && !path.startsWith('/') ? `/${path}` : path;
    const url = `${SITE_URL}${prefix}${normalized}`;
    return url.endsWith('/') ? url : `${url}/`;
}

/**
 * 페이지별 canonical + hreflang 메타데이터 생성
 */
export function pageAlternates(locale: string, path: string = '') {
    return {
        canonical: localeUrl(locale, path),
        languages: {
            ko: localeUrl('ko', path),
            en: localeUrl('en', path),
            ja: localeUrl('ja', path),
            'x-default': localeUrl('ko', path),
        },
    };
}
