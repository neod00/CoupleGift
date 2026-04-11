'use client';

import React from 'react';
import { useLocale } from 'next-intl';

export default function CoupangSearchWidget() {
  const locale = useLocale();

  if (locale !== 'ko') return null;

  return (
    <div className="w-full max-w-2xl mx-auto my-6 p-4 bg-[var(--surface-mixed)] rounded-xl border border-white/10 shadow-sm transition-transform hover:scale-[1.02] duration-300">
      <p className="text-sm font-semibold text-center mb-3 text-[var(--text-main-90)] flex items-center justify-center gap-2">
        <span className="text-xl">🔍</span> 원하는 선물이 없으신가요? 쿠팡에서 직접 검색해보세요!
      </p>
      <div className="w-full overflow-hidden rounded-lg">
        <iframe 
          src="https://coupa.ng/cmlebx" 
          width="100%" 
          height="75" 
          frameBorder="0" 
          scrolling="no" 
          referrerPolicy="unsafe-url"
        ></iframe>
      </div>
    </div>
  );
}
