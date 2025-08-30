import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation.tsx';
import AdSense from './components/AdSense.tsx';
import VisitorCounter from './components/VisitorCounter.tsx';
import Home from './pages/Home.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import Privacy from './pages/Privacy.tsx';
import Blog from './pages/Blog.tsx';
import BlogPost from './pages/BlogPost.tsx';
import GiftCategory from './pages/GiftCategory.tsx';

function App() {
  const [visitorCount, setVisitorCount] = useState<number>(0);

  useEffect(() => {
    // 방문수 로컬 스토리지에서 가져오기
    const storedCount = localStorage.getItem('visitorCount');
    if (storedCount) {
      setVisitorCount(parseInt(storedCount));
    }
    
    // 방문수 증가 및 저장
    const newCount = (parseInt(storedCount || '0') + 1);
    setVisitorCount(newCount);
    localStorage.setItem('visitorCount', newCount.toString());
  }, []);

  return (
    <Router>
      <div className="min-h-screen instagram-gradient relative">
        {/* 플로팅 배경 요소들 */}
        <div className="floating-bg">
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
          <div className="floating-element"></div>
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* 관리자용 방문수 카운터 */}
          <VisitorCounter visitorCount={visitorCount} />
          
          <header className="text-center mb-12 fade-in">
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-4">
                ✨ 선물지니
              </h1>
              <div className="text-2xl md:text-3xl font-semibold text-white mb-2">
                GiftGenie
              </div>
            </div>
            <p className="text-xl md:text-2xl text-white/90 font-medium mb-4">
              AI가 추천하는 특별한 선물을 찾아보세요
            </p>
            <div className="max-w-3xl mx-auto">
              <p className="text-lg text-white/80 leading-relaxed">
                💑 커플 • 👨‍👩‍👧‍👦 부부 • 👶 청소년 • 🧑‍💼 20-30대 • 👨‍💼 40-50대 중년층 • 👨‍🦳 60-70대 장년층
                <br />
                <span className="text-base">모든 연령대와 관계를 위한 맞춤형 선물 추천 서비스</span>
              </p>
            </div>
          </header>

          {/* 네비게이션 */}
          <Navigation />

          {/* 메인 콘텐츠 */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/category/:category" element={<GiftCategory />} />
          </Routes>

          {/* 푸터 상단 AdSense 광고 */}
          <div className="mt-16 max-w-4xl mx-auto fade-in">
            <AdSense 
              adFormat="banner"
              className="mb-8"
            />
          </div>
          
          <footer className="text-center mt-20 text-white/70 fade-in">
            <div className="glass-card max-w-2xl mx-auto mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="text-3xl">✨</span>
                <h3 className="text-xl font-semibold gradient-text">선물지니 GiftGenie</h3>
                <span className="text-3xl">✨</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🎯</span>
                  <span>AI 맞춤 추천</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">💝</span>
                  <span>모든 연령대</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">🛍️</span>
                  <span>쿠팡 연동</span>
                </div>
              </div>
            </div>
            <p className="mb-2">© 2024 선물지니 GiftGenie. AI 기반 맞춤형 선물 추천 서비스</p>
            <p className="text-sm opacity-70 mb-4">
              쿠팡 파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있습니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-white/60">
              <a href="/privacy" className="hover:text-white/80 transition-colors">개인정보처리방침</a>
              <span>|</span>
              <a href="/about" className="hover:text-white/80 transition-colors">서비스 소개</a>
              <span>|</span>
              <a href="/contact" className="hover:text-white/80 transition-colors">문의하기</a>
              <span>|</span>
              <span className="text-white/40">
                👥 <span className="font-mono text-xs">{visitorCount}</span>
              </span>
            </div>
          </footer>
        </div>
      </div>
    </Router>
  );
}

export default App;

