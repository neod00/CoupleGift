'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

const languages = [
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
];

const LanguageSwitcher: React.FC = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    const handleLanguageChange = (langCode: string) => {
        // Remove current locale from pathname
        let newPathname = pathname;

        // Handle locale prefix in pathname
        const localePattern = /^\/(ko|en|ja)(\/|$)/;
        if (localePattern.test(pathname)) {
            newPathname = pathname.replace(localePattern, '/');
        }

        // For Korean (default), don't add prefix
        // For other languages, add the locale prefix
        if (langCode === 'ko') {
            router.push(newPathname || '/');
        } else {
            router.push(`/${langCode}${newPathname}`);
        }

        setIsOpen(false);
    };

    return (
        <div className="fixed bottom-24 right-6 z-50">
            <div className="relative">
                {/* Language Options Dropdown */}
                {isOpen && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden min-w-[140px]">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => handleLanguageChange(lang.code)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${locale === lang.code
                                    ? 'bg-gradient-to-r from-pink-500/10 to-rose-500/10 text-pink-600 dark:text-pink-400 font-semibold'
                                    : 'text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <span className="text-sm">{lang.label}</span>
                                {locale === lang.code && (
                                    <span className="ml-auto text-pink-500">✓</span>
                                )}
                            </button>
                        ))}
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="group flex items-center gap-2 px-4 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-full shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
                    aria-label="Change Language"
                >
                    <span className="text-xl">{currentLanguage.flag}</span>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {currentLanguage.label}
                    </span>
                    <svg
                        className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default LanguageSwitcher;
