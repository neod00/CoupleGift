import React from 'react';
import AdSense from '../components/AdSense.tsx';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            ✨ 선물지니 소개
          </h1>
          <p className="text-xl text-white/90">
            AI 기반 맞춤형 선물 추천 서비스
          </p>
        </div>

        <div className="space-y-8 text-white/90">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-3xl">🎯</span>
              서비스 소개
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              선물지니(GiftGenie)는 인공지능 기술을 활용하여 특별한 날을 위한 완벽한 선물을 추천해드리는 서비스입니다. 
              복잡하고 어려운 선물 고르기를 간단하고 재미있게 만들어드립니다.
            </p>
            <p className="text-lg leading-relaxed">
              몇 가지 간단한 질문에 답하시면, AI가 받는 분의 성향과 관계, 예산, 기념일의 특성을 종합적으로 분석하여 
              가장 적합한 선물을 추천해드립니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-3xl">💝</span>
              주요 특징
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🤖</span>
                  AI 맞춤 추천
                </h3>
                <p className="text-white/80">
                  최신 인공지능 기술을 활용하여 개인의 취향과 상황에 맞는 선물을 정확하게 추천합니다.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  모든 연령대 지원
                </h3>
                <p className="text-white/80">
                  10대부터 70대까지, 모든 연령대와 다양한 관계(연인, 가족, 친구)를 고려한 추천을 제공합니다.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  예산별 추천
                </h3>
                <p className="text-white/80">
                  1만원대부터 고가의 선물까지, 설정하신 예산 범위 내에서 최적의 선물을 찾아드립니다.
                </p>
              </div>
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <span className="text-2xl">🛍️</span>
                  쿠팡 연동
                </h3>
                <p className="text-white/80">
                  추천받은 선물을 쿠팡에서 바로 구매할 수 있도록 직접 링크를 제공합니다.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-3xl">🎉</span>
              지원하는 기념일
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                '생일', '기념일', '밸런타인데이', '화이트데이',
                '어버이날', '어린이날', '크리스마스', '신정',
                '졸업', '입학', '취업', '승진',
                '결혼', '출산', '집들이', '개업'
              ].map((occasion) => (
                <div key={occasion} className="bg-white/10 rounded-lg p-3 text-center">
                  <span className="font-medium">{occasion}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-3xl">🌟</span>
              서비스 철학
            </h2>
            <p className="text-lg leading-relaxed mb-4">
              선물은 단순한 물건이 아닌, 마음을 전하는 특별한 매개체라고 생각합니다. 
              선물지니는 여러분의 소중한 마음이 완벽하게 전달될 수 있도록 도와드리고자 합니다.
            </p>
            <p className="text-lg leading-relaxed">
              기술의 발전이 인간의 감정과 관계를 더욱 풍요롭게 만들 수 있다는 믿음으로, 
              지속적으로 서비스를 개선하고 발전시켜 나가겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white flex items-center gap-2">
              <span className="text-3xl">📞</span>
              문의 및 지원
            </h2>
            <p className="text-lg leading-relaxed">
              서비스 이용 중 궁금한 점이나 개선 사항이 있으시면 언제든지 문의해주세요. 
              여러분의 소중한 의견을 바탕으로 더 나은 서비스를 만들어가겠습니다.
            </p>
          </section>
        </div>
      </div>

      {/* AdSense 광고 */}
      <div className="mt-8">
        <AdSense 
          adFormat="banner"
          className="mb-6"
        />
      </div>
    </div>
  );
};

export default About;

