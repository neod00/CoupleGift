import React, { useState, useEffect } from 'react';

interface VisitorCounterProps {
  visitorCount: number;
}

const VisitorCounter: React.FC<VisitorCounterProps> = ({ visitorCount }) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    // 관리자 확인을 위한 키보드 단축키 (Ctrl + Shift + V)
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
