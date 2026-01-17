'use client';

import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
    const { currentTheme } = useTheme();

    const getThemeClass = () => {
        switch (currentTheme) {
            case 'newtro': return 'theme-newtro font-mono';
            case 'aura': return 'theme-aura font-sans';
            case 'dark-acid': return 'theme-dark-acid font-mono';
            case 'soft-pop': return 'theme-soft-pop font-sans';
            case 'highteen': return 'theme-highteen font-serif';
            default: return 'theme-default';
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-500 ${getThemeClass()}`}>
            {/* Background Layers */}
            <div className="fixed inset-0 -z-50 theme-bg"></div>

            {/* Floating Elements (Visible in themes that define them, controlled by CSS) */}
            <div className="fixed inset-0 -z-40 overflow-hidden pointer-events-none">
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
                <div className="floating-element"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
