import React from 'react';
import Link from 'next/link';
import AdSense from '../../../components/AdSense';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

const categoriesData: { [key: string]: CategoryData } = {
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

export async function generateStaticParams() {
    return Object.keys(categoriesData).map((category) => ({
        category,
    }));
}

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
    const category = categoriesData[params.category];
    if (!category) return {};

    return {
        title: `${category.title} 선물 추천 - 선물지니`,
        description: category.description,
        openGraph: {
            title: `${category.title} 선물 추천`,
            description: category.description,
        }
    };
}

const renderStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
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

export default function GiftCategory({ params }: { params: { category: string } }) {
    const categoryData = categoriesData[params.category];

    if (!categoryData) {
        notFound();
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="mb-6 fade-in">
                <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    ← 홈으로 돌아가기
                </Link>
            </div>

            <div className="glass-card text-center mb-10 fade-in p-10">
                <span className="text-8xl mb-6 block">{categoryData.icon}</span>
                <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                    {categoryData.title}
                </h1>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    {categoryData.description}
                </p>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {categoryData.items.map((item, index) => (
                    <div key={item.id} className="glass-card fade-in p-6 md:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            <div className="text-center">
                                <span className="text-8xl mb-6 block">{item.image}</span>
                                <h3 className="text-2xl font-bold text-white mb-2">{item.name}</h3>
                                <div className="text-3xl font-bold gradient-text mb-6">{item.price}</div>
                                <div className="flex justify-center items-center gap-2 mb-8 bg-white/5 py-2 rounded-full">
                                    {renderStars(item.rating)}
                                    <span className="text-white/80 font-semibold">{item.rating}</span>
                                </div>
                                <Link
                                    href={item.coupangUrl}
                                    target="_blank"
                                    className="btn-primary w-full py-4 text-lg"
                                >
                                    🛒 쿠팡에서 구매하기
                                </Link>
                            </div>

                            <div className="lg:col-span-2 space-y-8">
                                <div>
                                    <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="text-pink-400">📋</span> 상품 설명
                                    </h4>
                                    <p className="text-white/80 leading-relaxed text-lg">
                                        {item.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-green-500/10 p-5 rounded-2xl border border-green-500/20">
                                        <h5 className="text-lg font-bold text-green-300 mb-4 flex items-center gap-2">
                                            <span>✅</span> 장점
                                        </h5>
                                        <ul className="space-y-3">
                                            {item.pros.map((pro, idx) => (
                                                <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                                                    <span className="text-green-500 mt-1">•</span>
                                                    {pro}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="bg-orange-500/10 p-5 rounded-2xl border border-orange-500/20">
                                        <h5 className="text-lg font-bold text-orange-300 mb-4 flex items-center gap-2">
                                            <span>⚠️</span> 주의사항
                                        </h5>
                                        <ul className="space-y-3">
                                            {item.cons.map((con, idx) => (
                                                <li key={idx} className="text-white/80 text-sm flex items-start gap-2">
                                                    <span className="text-orange-500 mt-1">•</span>
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

            <div className="glass-card mt-12 fade-in p-8">
                <h3 className="text-2xl font-bold text-white mb-8 text-center">
                    🎁 다른 카테고리도 둘러보세요
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.values(categoriesData)
                        .filter(cat => cat.id !== categoryData.id)
                        .map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/category/${cat.id}`}
                                className="block bg-white/5 rounded-2xl p-6 text-center hover:bg-white/10 transition-all border border-white/10 hover:border-white/20"
                            >
                                <span className="text-4xl mb-3 block">{cat.icon}</span>
                                <h4 className="text-white font-bold text-sm">{cat.title}</h4>
                            </Link>
                        ))}
                </div>
            </div>

            <div className="mt-12">
                <AdSense adFormat="banner" className="mb-6" />
            </div>
        </div>
    );
}
