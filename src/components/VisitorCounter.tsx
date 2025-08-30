import React, { useState, useEffect } from 'react';

const VisitorCounter: React.FC = () => {
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [todayCount, setTodayCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // 로컬 스토리지에서 방문자 수 가져오기
    const storedCount = localStorage.getItem('visitorCount');
    let currentCount = storedCount ? parseInt(storedCount) : 0;
    
    // 오늘 날짜 확인
    const today = new Date().toDateString();
    const storedToday = localStorage.getItem('lastVisitDate');
    const storedTodayCount = localStorage.getItem('todayCount');
    
    let currentTodayCount = 0;
    if (storedToday === today && storedTodayCount) {
      currentTodayCount = parseInt(storedTodayCount);
    }
    
    // 새로운 방문자인지 확인 (세션 스토리지 사용)
    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      currentCount += 1;
      currentTodayCount += 1;
      
      localStorage.setItem('visitorCount', currentCount.toString());
      localStorage.setItem('lastVisitDate', today);
      localStorage.setItem('todayCount', currentTodayCount.toString());
      sessionStorage.setItem('hasVisited', 'true');
    }
    
    setVisitorCount(currentCount);
    setTodayCount(currentTodayCount);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <span>...</span>;
  }

  return (
    <span className="text-xs opacity-60 hover:opacity-100 transition-opacity cursor-help" title={`총 방문자: ${visitorCount.toLocaleString()}명 | 오늘: ${todayCount}명`}>
      👥 {visitorCount.toLocaleString()}
    </span>
  );
};

export default VisitorCounter;
