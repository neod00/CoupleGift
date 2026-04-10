'use client';

import React, { useEffect, useRef } from 'react';

// Window 객체에 adsbygoogle 속성 타입 정의
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'vertical' | 'horizontal' | 'fluid';
  adStyle?: React.CSSProperties;
  className?: string;
  displayAd?: boolean;
  adLayout?: string;
  adLayoutKey?: string;
}

const AdSense: React.FC<AdSenseProps> = ({
  adSlot,
  adFormat = 'auto',
  adStyle,
  className = '',
  displayAd = true,
  adLayout,
  adLayoutKey,
}) => {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID || 'ca-pub-5907754718994620';
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!displayAd || !publisherId) {
      return;
    }

    // 애드센스 스크립트 로드 대기 후 push
    const tryPushAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        try {
          if (!pushed.current && adRef.current) {
            (window.adsbygoogle as any[]).push({});
            pushed.current = true;
          }
        } catch (err) {
          // 이미 로드된 광고 슬롯에 대한 중복 push 에러는 무시
          if (process.env.NODE_ENV === 'development') {
            console.warn('AdSense load warning:', err);
          }
        }
      }
    };

    // 스크립트가 아직 로드되지 않았다면 잠시 후 재시도
    const timer = setTimeout(tryPushAd, 300);
    return () => clearTimeout(timer);
  }, [displayAd, publisherId]);

  if (!displayAd) {
    return null;
  }

  // 환경 변수에서 Publisher ID가 없으면 광고 자리만 표시
  if (!publisherId || publisherId.includes('your_publisher_id')) {
    return (
      <div className={`adsense-placeholder ${className}`} style={{
        display: 'block',
        textAlign: 'center',
        minHeight: '90px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '12px',
        padding: '20px',
        lineHeight: 1.5,
        ...adStyle
      }}>
        <div>📢 광고 영역</div>
        <div style={{ fontSize: '10px', marginTop: '8px', opacity: 0.7 }}>
          AdSense 설정을 완료하면 광고가 표시됩니다
        </div>
      </div>
    );
  }

  // adSlot이 없으면 Auto Ads 모드 (슬롯 없이 자동 광고만 표시)
  const insProps: Record<string, any> = {
    className: 'adsbygoogle',
    style: {
      display: 'block',
      textAlign: 'center' as const,
      minHeight: adFormat === 'rectangle' ? '250px' : '90px',
      ...adStyle
    },
    'data-ad-client': publisherId,
    'data-ad-format': adFormat,
    'data-full-width-responsive': 'true',
  };

  // 슬롯 ID가 제공된 경우에만 설정
  if (adSlot && !adSlot.includes('SLOT') && adSlot !== '1234567890') {
    insProps['data-ad-slot'] = adSlot;
  }

  // 인피드 광고 레이아웃 설정
  if (adLayout) {
    insProps['data-ad-layout'] = adLayout;
  }
  if (adLayoutKey) {
    insProps['data-ad-layout-key'] = adLayoutKey;
  }

  return (
    <div className={`adsense-container ${className}`} ref={adRef}>
      <ins {...insProps} />
    </div>
  );
};

export default AdSense;