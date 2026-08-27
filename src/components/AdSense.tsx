'use client';

import React, { useEffect, useRef } from 'react';
import { ADSENSE_PUBLISHER_ID, AD_SLOTS } from '@/config/adsense';

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
  const publisherId = ADSENSE_PUBLISHER_ID;

  // 슬롯 결정: 명시적 prop > 포맷별 기본 슬롯 (config/adsense.ts)
  const isInArticle = adFormat === 'fluid' || adLayout === 'in-article';
  const defaultSlot = isInArticle ? AD_SLOTS.inArticle : AD_SLOTS.display;
  const explicitSlot = adSlot && !adSlot.includes('SLOT') && adSlot !== '1234567890' ? adSlot : '';
  const resolvedSlot = explicitSlot || defaultSlot;

  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  const shouldRender = displayAd && !!publisherId && !!resolvedSlot;

  useEffect(() => {
    if (!shouldRender || pushed.current) {
      return;
    }
    try {
      // 표준 AdSense 큐 패턴: 스크립트가 아직 로드되지 않았어도 큐에 쌓아두면
      // adsbygoogle.js 로드 시점에 자동으로 처리된다 (타이밍 레이스 없음)
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('AdSense push warning:', err);
      }
    }
  }, [shouldRender]);

  if (!displayAd) {
    return null;
  }

  // 슬롯 ID가 없으면: 프로덕션에서는 아무것도 렌더링하지 않음
  // (data-ad-slot 없는 <ins>는 광고가 채워지지 않아 빈 공간만 남는다)
  if (!resolvedSlot) {
    if (process.env.NODE_ENV === 'development') {
      return (
        <div className={`adsense-placeholder ${className}`} style={{
          display: 'block',
          textAlign: 'center',
          minHeight: '90px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          borderRadius: '12px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '12px',
          padding: '20px',
          lineHeight: 1.5,
          ...adStyle
        }}>
          <div>📢 광고 영역 (슬롯 미설정)</div>
          <div style={{ fontSize: '10px', marginTop: '8px', opacity: 0.7 }}>
            src/config/adsense.ts 에 AdSense 광고 단위 슬롯 ID를 설정하세요
          </div>
        </div>
      );
    }
    return null;
  }

  const insProps: Record<string, any> = {
    className: 'adsbygoogle',
    style: {
      display: 'block',
      textAlign: 'center' as const,
      minHeight: isInArticle ? undefined : adFormat === 'rectangle' ? '250px' : '90px',
      ...adStyle
    },
    'data-ad-client': publisherId,
    'data-ad-slot': resolvedSlot,
  };

  // In-article(fluid) 광고와 일반 디스플레이 광고의 포맷 속성 분리
  if (isInArticle) {
    insProps['data-ad-format'] = 'fluid';
    insProps['data-ad-layout'] = adLayout || 'in-article';
  } else {
    // 'banner'는 유효한 data-ad-format 값이 아니므로 반응형 'auto'로 매핑
    insProps['data-ad-format'] = adFormat === 'banner' ? 'auto' : adFormat;
    insProps['data-full-width-responsive'] = 'true';
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
