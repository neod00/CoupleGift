import React from 'react';
import { Link } from 'react-router-dom';

const GiftGuide: React.FC = () => {
  const giftCategories = [
    {
      id: "couple-accessories",
      title: "연인 선물",
      icon: "💕",
      description: "사랑하는 연인을 위한 로맨틱한 선물",
      examples: ["커플링", "향수", "꽃다발", "초콜릿", "커플 시계"]
    },
    {
      id: "beauty-cosmetics",
      title: "가족 선물",
      icon: "👨‍👩‍👧‍👦",
      description: "소중한 가족을 위한 따뜻한 선물",
      examples: ["건강식품", "마사지기", "가전제품", "의류", "여행 상품권"]
    },
    {
      id: "friend-gifts",
      title: "친구 선물",
      icon: "👫",
      description: "친구와의 우정을 나누는 의미있는 선물",
      examples: ["문구용품", "인테리어 소품", "책", "게임", "카페 상품권"]
    },
    {
      id: "colleague-gifts",
      title: "직장 동료",
      icon: "🤝",
      description: "직장에서의 인간관계를 돈독히 하는 선물",
      examples: ["커피", "디저트", "사무용품", "플래너", "차 선물세트"]
    }
  ];

  const occasionGuide = [
    {
      occasion: "생일",
      icon: "🎂",
      tips: "받는 분의 취미와 관심사를 고려한 개인적인 선물이 좋습니다."
    },
    {
      occasion: "기념일",
      icon: "💝",
      tips: "함께한 추억을 떠올릴 수 있는 의미있는 선물을 선택해보세요."
    },
    {
      occasion: "명절",
      icon: "🏮",
      tips: "가족 모두가 함께 즐길 수 있는 실용적인 선물이 인기입니다."
    },
    {
      occasion: "졸업/입학",
      icon: "🎓",
      tips: "새로운 시작을 응원하는 의미의 실용적인 선물이 좋습니다."
    }
  ];

  const budgetGuide = [
    {
      range: "1만원 이하",
      icon: "💰",
      suggestions: ["문구용품", "간식", "소품", "캔들", "양말"]
    },
    {
      range: "1-5만원",
      icon: "💳",
      suggestions: ["화장품", "액세서리", "책", "향수", "텀블러"]
    },
    {
      range: "5-10만원",
      icon: "💎",
      suggestions: ["의류", "가방", "신발", "전자기기", "뷰티기기"]
    },
    {
      range: "10만원 이상",
      icon: "🎁",
      suggestions: ["명품 액세서리", "가전제품", "여행 상품권", "고급 화장품", "브랜드 의류"]
    }
  ];

  return (
    <div className="space-y-12">
      {/* 선물 가이드 헤더 */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-4">
          🎁 선물 가이드
        </h2>
        <p className="text-lg text-white/80">
          완벽한 선물 선택을 위한 가이드를 확인해보세요
        </p>
      </div>

      {/* 관계별 선물 가이드 */}
      <section>
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          관계별 선물 추천
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {giftCategories.map((category, index) => (
            <Link 
              key={index} 
              to={`/category/${category.id}`}
              className="glass-card hover:scale-105 transition-transform duration-300 block"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{category.icon}</span>
                <h4 className="text-xl font-semibold text-white">{category.title}</h4>
              </div>
              <p className="text-white/80 mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {category.examples.map((example, idx) => (
                  <span 
                    key={idx}
                    className="bg-white/10 text-white/90 px-3 py-1 rounded-full text-sm"
                  >
                    {example}
                  </span>
                ))}
              </div>
              <div className="text-white/60 text-sm">
                자세히 보기 →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 기념일별 선물 팁 */}
      <section>
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          기념일별 선물 팁
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {occasionGuide.map((guide, index) => (
            <div key={index} className="glass-card">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{guide.icon}</span>
                <h4 className="text-lg font-semibold text-white">{guide.occasion}</h4>
              </div>
              <p className="text-white/80">{guide.tips}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 예산별 선물 가이드 */}
      <section>
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          예산별 선물 가이드
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetGuide.map((budget, index) => (
            <div key={index} className="glass-card">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{budget.icon}</span>
                <h4 className="text-lg font-semibold text-white">{budget.range}</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {budget.suggestions.map((suggestion, idx) => (
                  <span 
                    key={idx}
                    className="bg-white/10 text-white/90 px-3 py-1 rounded-full text-sm"
                  >
                    {suggestion}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 선물 선택 팁 */}
      <section className="glass-card">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          💡 완벽한 선물 선택을 위한 팁
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/90">
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              받는 분 분석하기
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• 평소 관심사와 취미는 무엇인가요?</li>
              <li>• 어떤 스타일을 선호하시나요?</li>
              <li>• 실용적인 것을 좋아하시나요?</li>
              <li>• 최근에 필요로 하는 것이 있나요?</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-xl">💝</span>
              의미 있는 선물 만들기
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• 함께한 추억과 연결된 선물</li>
              <li>• 개인적인 메시지나 각인 추가</li>
              <li>• 받는 분만을 위한 맞춤형 선물</li>
              <li>• 포장과 카드에도 정성을 담기</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GiftGuide;

