import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AdSense from '../components/AdSense.tsx';

interface GiftItem {
  id: string;
  name: string;
  price: string;
  description: string;
  pros: string[];
  cons: string[];
  rating: number;
  image: string;
  coupangUrl: string;
}

interface CategoryData {
  id: string;
  title: string;
  description: string;
  icon: string;
  items: GiftItem[];
}

const GiftCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  // 실제 구현에서는 API나 데이터베이스에서 가져올 데이터
  const categories: { [key: string]: CategoryData } = {
    'couple-accessories': {
      id: 'couple-accessories',
      title: '커플 액세서리',
      description: '사랑하는 연인과 함께 착용할 수 있는 특별한 액세서리',
      icon: '💍',
      items: [
        {
          id: 'couple-ring-1',
          name: '심플 커플링 세트',
          price: '89,000원',
          description: '심플하면서도 세련된 디자인의 커플링입니다. 일상에서도 부담없이 착용할 수 있으며, 내구성이 뛰어난 스테인리스 스틸 소재로 제작되었습니다.',
          pros: ['심플한 디자인', '합리적인 가격', '내구성 우수', '사이즈 조절 가능'],
          cons: ['각인 서비스 별도', '배송 시간 다소 소요'],
          rating: 4.5,
          image: '💍',
          coupangUrl: 'https://www.coupang.com/vp/products/example1'
        },
        {
          id: 'couple-necklace-1',
          name: '하트 커플 목걸이',
          price: '65,000원',
          description: '하나의 하트가 두 개로 나뉘어지는 로맨틱한 디자인의 커플 목걸이입니다. 서로의 목걸이를 맞추면 완전한 하트가 됩니다.',
          pros: ['로맨틱한 디자인', '의미있는 선물', '고급스러운 포장', '무료 각인 서비스'],
          cons: ['체인 길이 고정', '실버 알레르기 주의'],
          rating: 4.3,
          image: '💎',
          coupangUrl: 'https://www.coupang.com/vp/products/example2'
        },
        {
          id: 'couple-watch-1',
          name: '미니멀 커플 시계',
          price: '158,000원',
          description: '깔끔하고 미니멀한 디자인의 커플 시계입니다. 남녀 구분없이 착용 가능한 유니섹스 디자인으로 어떤 스타일에도 잘 어울립니다.',
          pros: ['유니섹스 디자인', '정확한 시간', '방수 기능', '1년 품질보증'],
          cons: ['배터리 교체 필요', '스포츠 활동 시 부적합'],
          rating: 4.7,
          image: '⌚',
          coupangUrl: 'https://www.coupang.com/vp/products/example3'
        }
      ]
    },
    'beauty-cosmetics': {
      id: 'beauty-cosmetics',
      title: '뷰티 & 화장품',
      description: '아름다움을 더해주는 프리미엄 뷰티 제품',
      icon: '💄',
      items: [
        {
          id: 'perfume-1',
          name: '프리미엄 향수 세트',
          price: '125,000원',
          description: '은은하고 고급스러운 향이 특징인 프리미엄 향수입니다. 오래 지속되는 향과 세련된 패키지로 선물용으로 완벽합니다.',
          pros: ['오래 지속되는 향', '고급스러운 패키지', '유명 브랜드', '선물용 포장 제공'],
          cons: ['개인 취향에 따라 호불호', '가격대가 높음'],
          rating: 4.6,
          image: '🌸',
          coupangUrl: 'https://www.coupang.com/vp/products/example4'
        },
        {
          id: 'skincare-set-1',
          name: '스킨케어 기초 세트',
          price: '89,000원',
          description: '민감한 피부도 안심하고 사용할 수 있는 순한 성분의 스킨케어 세트입니다. 토너, 에센스, 크림이 포함되어 있습니다.',
          pros: ['순한 성분', '모든 피부타입 사용 가능', '보습력 우수', '합리적인 가격'],
          cons: ['즉각적인 효과 기대 어려움', '향이 약함'],
          rating: 4.4,
          image: '🧴',
          coupangUrl: 'https://www.coupang.com/vp/products/example5'
        }
      ]
    }
  };

  const categoryData = category ? categories[category] : null;

  if (!categoryData) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-card">
          <h1 className="text-3xl font-bold text-white mb-4">
            😅 카테고리를 찾을 수 없습니다
          </h1>
          <p className="text-white/80 mb-6">
            요청하신 선물 카테고리가 존재하지 않습니다.
          </p>
          <Link to="/" className="btn-primary">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="text-yellow-400">★</span>);
    }
    if (hasHalfStar) {
      stars.push(<span key="half" className="text-yellow-400">☆</span>);
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<span key={i} className="text-gray-400">☆</span>);
    }
    return stars;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6 fade-in">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          ← 홈으로 돌아가기
        </Link>
      </div>

      {/* 카테고리 헤더 */}
      <div className="glass-card text-center mb-8 fade-in">
        <span className="text-8xl mb-4 block">{categoryData.icon}</span>
        <h1 className="text-4xl font-bold gradient-text mb-4">
          {categoryData.title}
        </h1>
        <p className="text-xl text-white/90">
          {categoryData.description}
        </p>
      </div>

      {/* 선물 아이템 목록 */}
      <div className="space-y-8">
        {categoryData.items.map((item, index) => (
          <div key={item.id} className="glass-card fade-in" style={{animationDelay: `${index * 0.2}s`}}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 이미지 및 기본 정보 */}
              <div className="text-center">
                <span className="text-8xl mb-4 block">{item.image}</span>
                <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                <div className="text-3xl font-bold gradient-text mb-4">{item.price}</div>
                <div className="flex justify-center items-center gap-2 mb-4">
                  {renderStars(item.rating)}
                  <span className="text-white/80 ml-2">({item.rating})</span>
                </div>
                <a
                  href={item.coupangUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full"
                >
                  🛒 쿠팡에서 구매하기
                </a>
              </div>

              {/* 상세 정보 */}
              <div className="lg:col-span-2">
                <h4 className="text-xl font-semibold text-white mb-4">상품 설명</h4>
                <p className="text-white/90 leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 장점 */}
                  <div>
                    <h5 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                      <span>✅</span>
                      장점
                    </h5>
                    <ul className="space-y-2">
                      {item.pros.map((pro, idx) => (
                        <li key={idx} className="text-white/80 flex items-center gap-2">
                          <span className="text-green-400">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 단점 */}
                  <div>
                    <h5 className="text-lg font-semibold text-orange-300 mb-3 flex items-center gap-2">
                      <span>⚠️</span>
                      주의사항
                    </h5>
                    <ul className="space-y-2">
                      {item.cons.map((con, idx) => (
                        <li key={idx} className="text-white/80 flex items-center gap-2">
                          <span className="text-orange-400">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 관련 카테고리 */}
      <div className="glass-card mt-12 fade-in">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          🎁 다른 카테고리도 둘러보세요
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.values(categories)
            .filter(cat => cat.id !== categoryData.id)
            .map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="block bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-all"
              >
                <span className="text-4xl mb-2 block">{cat.icon}</span>
                <h4 className="text-white font-medium text-sm">{cat.title}</h4>
              </Link>
            ))}
        </div>
      </div>

      {/* 선물 고르기 팁 */}
      <div className="glass-card mt-8 fade-in">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          💡 {categoryData.title} 선물 고르기 팁
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white/90">
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-xl">🎯</span>
              선택 기준
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• 받는 분의 평소 스타일과 취향 고려</li>
              <li>• 품질과 가격의 균형 맞추기</li>
              <li>• 브랜드 신뢰도와 후기 확인</li>
              <li>• 교환/환불 정책 사전 확인</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <span className="text-xl">💝</span>
              선물 포인트
            </h4>
            <ul className="space-y-2 text-sm">
              <li>• 예쁜 포장과 메시지 카드 준비</li>
              <li>• 특별한 날에 맞는 타이밍</li>
              <li>• 개인적인 의미 부여하기</li>
              <li>• 함께 사용할 수 있는 아이템 고려</li>
            </ul>
          </div>
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

export default GiftCategory;

