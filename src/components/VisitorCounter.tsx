'use client';

import React, { useState, useEffect } from 'react';

const VisitorCounter: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    const storedCount = localStorage.getItem('visitorCount');

    // 이 코드 조각은 원본 App.tsx의 로직입니다.
    if (lastVisitDate !== today) {
      // 새로운 날이면 방문자수 리셋 (실제 운영 시에는 DB 연동 권장)
      localStorage.setItem('visitorCount', '1');
      localStorage.setItem('lastVisitDate', today);
      setVisitorCount(1);
    } else {
      const count = parseInt(storedCount || '1');
      setVisitorCount(count);
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        setIsVisible(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-black/80 text-white text-xs p-2 rounded-lg z-50 font-mono">
      <div className="text-center">
        <div className="text-lg font-bold text-green-400">{visitorCount}</div>
        <div className="text-xs text-gray-300">방문자</div>
        <div className="text-xs text-gray-400 mt-1">
          Ctrl+Shift+V
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
