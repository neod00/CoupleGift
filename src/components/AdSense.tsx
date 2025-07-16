import React, { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'rectangle' | 'banner';
  adStyle?: React.CSSProperties;
  className?: string;
}

const AdSense: React.FC<AdSenseProps> = ({ 
  adSlot, 
  adFormat = 'auto', 
  adStyle,
  className = ''
}) => {
  const publisherId = process.env.REACT_APP_ADSENSE_PUBLISHER_ID;
  
  useEffect(() => {
    if (!publisherId) {
      console.log('AdSense Publisher ID not found in environment variables');
      return;
    }
    
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [publisherId]);

  // Publisher ID가 없으면 AdSense를 렌더링하지 않음
  if (!publisherId) {
    return (
      <div className={`adsense-placeholder ${className}`} style={{
        display: 'block',
        textAlign: 'center',
        minHeight: '50px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '12px',
        padding: '20px',
        ...adStyle
      }}>
        광고 영역 (AdSense 설정 대기 중)
      </div>
    );
  }

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          textAlign: 'center',
          minHeight: '50px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
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