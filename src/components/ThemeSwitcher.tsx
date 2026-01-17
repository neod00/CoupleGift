'use client';

import React, { useState } from 'react';
import { useTheme, ThemeType } from '../context/ThemeContext';

export default function ThemeSwitcher() {
    const { currentTheme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes: { id: ThemeType; name: string; icon: string; color: string }[] = [
        { id: 'newtro', name: 'MZ Newtro', icon: '👾', color: 'bg-[#FF00FF]' },
        { id: 'aura', name: 'Dreamy Aura', icon: '✨', color: 'bg-indigo-100' },
        { id: 'dark-acid', name: 'Dark Acid', icon: '🧪', color: 'bg-black border-lime-400 border' },
        { id: 'soft-pop', name: 'Soft Pop', icon: '🧸', color: 'bg-[#FFF8E1]' },
        { id: 'highteen', name: 'Highteen', icon: '📸', color: 'bg-pink-100' },
    ];

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-4 mb-4 flex flex-col gap-2 animate-in slide-in-from-bottom-5 fade-in duration-300 w-48">
                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Theme</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    {themes.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => setTheme(theme.id)}
                            className={`flex items-center gap-3 p-2 rounded-xl transition-all ${currentTheme === theme.id ? 'bg-gray-100 ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}
                        >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-sm ${theme.color}`}>
                                {theme.icon}
                            </div>
                            <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                        </button>
                    ))}
                </div>
            ) : null}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 bg-white/80 backdrop-blur-md border border-white/50 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center text-2xl hover:scale-110 transition-transform hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] active:scale-95 group"
                title="Change Theme"
            >
                <span className="group-hover:rotate-180 transition-transform duration-500">🎨</span>
            </button>
        </div>
    );
}
