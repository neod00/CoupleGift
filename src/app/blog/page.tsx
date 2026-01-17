import React from 'react';
import Link from 'next/link';
import AdSense from '../../components/AdSense';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '선물 아이디어 블로그 - 선물지니 AI 맞춤형 선물 추천',
    description: '선물지니 블로그에서 기념일 선물, 생일 선물, 커플 선물 아이디어와 선물 고르기 팁을 확인하세요. AI 맞춤형 선물 추천 서비스.',
    openGraph: {
        title: '선물 아이디어 블로그 - 선물지니 AI 맞춤형 선물 추천',
        description: '기념일별 유용한 선물 정보와 팁을 확인하세요.',
    }
};

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    readTime: string;
    image: string;
}

const blogPosts: BlogPost[] = [
    {
        id: 'valentine-day-guide',
        title: '밸런타인데이 완벽 가이드: 연인의 마음을 사로잡는 선물 아이디어',
        excerpt: '2024년 밸런타인데이를 특별하게 만들어줄 선물 아이디어와 이벤트 계획을 소개합니다. 초콜릿부터 맞춤형 선물까지, 연인이 감동할 수 있는 다양한 방법을 알아보세요.',
        date: '2024-01-15',
        category: '기념일',
        readTime: '5분',
        image: '💝'
    },
    {
        id: 'budget-gift-guide',
        title: '예산별 선물 가이드: 1만원부터 10만원까지 센스있는 선물 추천',
        excerpt: '제한된 예산으로도 센스있는 선물을 고를 수 있습니다. 가격대별로 엄선한 선물 아이디어와 선물 고르기 팁을 공유합니다.',
        date: '2024-01-10',
        category: '선물 팁',
        readTime: '7분',
        image: '💰'
    },
    {
        id: 'mbti-gift-guide',
        title: 'MBTI별 맞춤 선물 가이드: 성격 유형에 따른 완벽한 선물 찾기',
        excerpt: '16가지 MBTI 성격 유형별로 어울리는 선물을 추천합니다. 받는 분의 성격을 고려한 선물로 더욱 특별한 감동을 전해보세요.',
        date: '2024-01-05',
        category: '선물 팁',
        readTime: '10분',
        image: '🧠'
    },
    {
        id: 'parents-anniversary-gift',
        title: '부모님 결혼기념일 선물: 효도하는 자녀를 위한 선물 아이디어',
        excerpt: '부모님의 결혼기념일을 축하하는 의미있는 선물을 찾고 계신가요? 부모님이 진심으로 기뻐하실 선물 아이디어를 소개합니다.',
        date: '2023-12-28',
        category: '가족',
        readTime: '6분',
        image: '👨‍👩‍👧‍👦'
    },
    {
        id: 'christmas-gift-trends',
        title: '2024 크리스마스 선물 트렌드: 올해 가장 인기있는 선물은?',
        excerpt: '올해 크리스마스 시즌에 가장 인기있는 선물 트렌드를 분석했습니다. 트렌디한 선물로 특별한 크리스마스를 만들어보세요.',
        date: '2023-12-20',
        category: '기념일',
        readTime: '8분',
        image: '🎄'
    },
    {
        id: 'diy-gift-ideas',
        title: 'DIY 선물 아이디어: 직접 만드는 특별한 선물 10가지',
        excerpt: '마음을 담아 직접 만드는 DIY 선물은 어떤 비싼 선물보다 특별합니다. 쉽게 따라할 수 있는 DIY 선물 아이디어를 소개합니다.',
        date: '2023-12-15',
        category: 'DIY',
        readTime: '12분',
        image: '🎨'
    }
];

const categories = ['전체', '기념일', '선물 팁', '가족', 'DIY'];

export default function Blog() {
    return (
        <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 fade-in">
                <h1 className="text-4xl font-bold gradient-text mb-4">
                    📝 선물 아이디어 블로그
                </h1>
                <p className="text-xl text-white/90">
                    AI 맞춤형 선물 추천과 기념일 선물, 생일 선물 아이디어를 위한 유용한 정보와 팁
                </p>
            </div>

            <div className="glass-card mb-8 fade-in">
                <div className="flex flex-wrap justify-center gap-4 p-4">
                    {categories.map((category) => (
                        <button
                            key={category}
                            className="px-4 py-2 rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-all duration-300"
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {blogPosts.map((post, index) => (
                    <article key={post.id} className="glass-card hover:scale-105 transition-transform duration-300 fade-in">
                        <Link href={`/blog/${post.id}`} className="block">
                            <div className="text-center mb-4">
                                <span className="text-6xl">{post.image}</span>
                            </div>

                            <div className="flex items-center justify-between mb-3 text-sm text-white/60">
                                <span className="bg-white/10 px-2 py-1 rounded-full">{post.category}</span>
                                <div className="flex items-center gap-2">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>{post.readTime}</span>
                                </div>
                            </div>

                            <h2 className="text-xl font-semibold text-white mb-3 line-clamp-2 hover:text-white/80 transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-white/70 text-sm leading-relaxed line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="mt-4 pt-4 border-t border-white/10">
                                <span className="text-white/60 text-sm hover:text-white transition-colors">
                                    자세히 읽기 →
                                </span>
                            </div>
                        </Link>
                    </article>
                ))}
            </div>

            <div className="glass-card mb-8 fade-in">
                <h3 className="text-xl font-semibold text-white mb-4 text-center">
                    🏷️ 인기 태그
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                    {[
                        '밸런타인데이', '생일선물', '크리스마스', '커플선물', '부모님선물',
                        '친구선물', '예산별선물', 'MBTI', 'DIY선물', '기념일선물',
                        '남자친구선물', '여자친구선물', '결혼기념일', '어버이날'
                    ].map((tag) => (
                        <span
                            key={tag}
                            className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm hover:bg-white/20 hover:text-white transition-all cursor-pointer"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            </div>

            <div className="glass-card text-center mb-8 fade-in">
                <h3 className="text-2xl font-semibold text-white mb-4">
                    📬 새로운 선물 아이디어를 받아보세요
                </h3>
                <p className="text-white/80 mb-6">
                    매주 새로운 선물 아이디어와 팁을 이메일로 받아보세요
                </p>
                <div className="max-w-md mx-auto flex gap-3">
                    <input
                        type="email"
                        placeholder="이메일 주소를 입력하세요"
                        className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    />
                    <button className="btn-primary px-6">
                        구독하기
                    </button>
                </div>
            </div>

            <div className="mt-8">
                <AdSense
                    adFormat="banner"
                    className="mb-6"
                />
            </div>
        </div>
    );
}
