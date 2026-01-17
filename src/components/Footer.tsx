import React from 'react';
import AdSense from './AdSense';

const Footer: React.FC = () => {
    return (
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

            <div className="max-w-4xl mx-auto mb-8">
                <AdSense
                    adFormat="banner"
                    className="mb-8"
                />
            </div>

            <p className="mb-2">© 2024 선물지니 GiftGenie. AI 맞춤형 커플 선물 추천 서비스 - 기념일 선물 아이디어 전문</p>
            <p className="text-sm opacity-70 mb-4">
                쿠팡 파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있습니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-white/60">
                <a href="/privacy" className="hover:text-white/80 transition-colors" title="개인정보처리방침">개인정보처리방침</a>
                <span>|</span>
                <a href="/about" className="hover:text-white/80 transition-colors" title="AI 맞춤형 선물 추천 서비스 소개">서비스 소개</a>
                <span>|</span>
                <a href="/contact" className="hover:text-white/80 transition-colors" title="선물 추천 서비스 문의">문의하기</a>
                <span>|</span>
                <a href="/blog" className="hover:text-white/80 transition-colors" title="기념일 선물 아이디어 블로그">선물 아이디어</a>
            </div>
        </footer>
    );
};

export default Footer;
