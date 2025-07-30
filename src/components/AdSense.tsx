import React, { useEffect, useRef } from 'react';

// Window 객체에 adsbygoogle 속성 타입 정의
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSenseProps {
  adSlot?: string;
  adFormat?: 'auto' | 'rectangle' | 'banner' | 'vertical' | 'horizontal';
  adStyle?: React.CSSProperties;
  className?: string;
  displayAd?: boolean;
}

const AdSense: React.FC<AdSenseProps> = ({ 
  adSlot = '1234567890', // 기본 슬롯 ID (실제 사용 시 애드센스에서 발급받은 슬롯 ID로 변경)
  adFormat = 'auto', 
  adStyle,
  className = '',
  displayAd = true
}) => {
  const publisherId = process.env.REACT_APP_ADSENSE_PUBLISHER_ID || 'ca-pub-5907754718994620';
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (!displayAd || !publisherId) {
      console.log('AdSense: 광고 표시 조건이 맞지 않습니다.');
      return;
    }

    // 애드센스 스크립트가 로드되었는지 확인
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        // 중복 push 방지
        if (!pushed.current && adRef.current) {
          (window.adsbygoogle as any[]).push({});
          pushed.current = true;
          console.log('✅ AdSense 광고가 로드되었습니다.');
        }
      } catch (err) {
        console.error('❌ AdSense 로드 중 오류:', err);
      }
    } else {
      console.warn('⚠️ AdSense 스크립트가 아직 로드되지 않았습니다.');
    }
  }, [displayAd, publisherId]);

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

  if (!displayAd) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          minHeight: '90px',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          ...adStyle
        }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdSense; 