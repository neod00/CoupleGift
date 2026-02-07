import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['ko', 'en', 'ja'],

    // Used when no locale matches
    defaultLocale: 'ko',

    // The prefix for locale in URL
    localePrefix: 'as-needed' // 'ko'는 URL에서 생략, 'en', 'ja'는 표시
});

export type Locale = (typeof routing.locales)[number];
