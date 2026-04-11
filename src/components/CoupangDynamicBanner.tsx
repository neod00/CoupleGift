'use client';

import React from 'react';
import { useLocale } from 'next-intl';

export default function CoupangDynamicBanner() {
  const locale = useLocale();

  // 쿠팡 파트너스 배너는 한국어 환경에서만 노출
  if (locale !== 'ko') return null;

  return (
    <div className="w-full flex justify-center my-8 overflow-hidden rounded-xl bg-white/5 p-2">
      <iframe 
        src="https://ads-partners.coupang.com/widgets.html?id=980033&template=carousel&trackingCode=AF4593782&subId=&width=680&height=140&tsource=" 
        width="680" 
        height="140" 
        frameBorder="0" 
        scrolling="no" 
        referrerPolicy="unsafe-url"
        className="max-w-full"
      ></iframe>
    </div>
  );
}
