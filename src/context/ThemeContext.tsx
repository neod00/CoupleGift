'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeType = 'default' | 'newtro' | 'aura' | 'dark-acid' | 'soft-pop' | 'highteen';

interface ThemeContextType {
    currentTheme: ThemeType;
    setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEMES: ThemeType[] = ['newtro', 'aura', 'dark-acid', 'soft-pop', 'highteen'];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Check local storage or pick random
        const savedTheme = localStorage.getItem('gift-genie-theme') as ThemeType;
        if (savedTheme && THEMES.includes(savedTheme)) {
            setCurrentTheme(savedTheme);
        } else {
            const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
            setCurrentTheme(randomTheme);
        }
        setMounted(true);
    }, []);

    const setTheme = (theme: ThemeType) => {
        setCurrentTheme(theme);
        localStorage.setItem('gift-genie-theme', theme);
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
