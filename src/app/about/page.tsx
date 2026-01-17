import React from 'react';

export default function About() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="glass-card p-8 md:p-12 space-y-12">
                {/* 헤더 섹션 */}
                <section className="text-center space-y-4">
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text">
                        선물지니 (GiftGenie)
                    </h2>
                    <p className="text-xl text-gray-700 font-medium">
                        AI가 찾아주는 당신만을 위한 완벽한 선물 큐레이션
                    </p>
                </section>

                {/* 서비스 소개 섹션 */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">💝</span>
                        <h3 className="text-2xl font-bold text-gray-800">서비스 소개</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg">
                        선물지니는 소중한 사람에게 어떤 선물을 해야 할지 고민하는 분들을 위해 탄생했습니다.
                        최신 AI 기술(GPT-4o Mini)을 활용하여 상대방의 연령, 성별, 성격, 그리고 기념일의 의미까지
                        종합적으로 분석하여 가장 만족스러운 선물 후보를 추천해 드립니다.
                    </p>
                </section>

                {/* 주요 특징 섹션 */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-white/50 rounded-2xl border border-white/20 shadow-sm">
                        <div className="text-3xl mb-3">🧠</div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">정교한 AI 분석</h4>
                        <p className="text-gray-600">수만 가지 선물 데이터를 학습한 AI가 상황에 딱 맞는 아이템을 골라줍니다.</p>
                    </div>
                    <div className="p-6 bg-white/50 rounded-2xl border border-white/20 shadow-sm">
                        <div className="text-3xl mb-3">💰</div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">예산 밀착 추천</h4>
                        <p className="text-gray-600">설정한 예산 범위 내에서 가성비와 프리미엄을 모두 고려한 선택지를 제공합니다.</p>
                    </div>
                    <div className="p-6 bg-white/50 rounded-2xl border border-white/20 shadow-sm">
                        <div className="text-3xl mb-3">⚡</div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">빠르고 간편함</h4>
                        <p className="text-gray-600">복잡한 회원가입 없이 몇 가지 정보 입력만으로 3초 만에 결과를 확인할 수 있습니다.</p>
                    </div>
                    <div className="p-6 bg-white/50 rounded-2xl border border-white/20 shadow-sm">
                        <div className="text-3xl mb-3">🛍️</div>
                        <h4 className="text-xl font-bold text-gray-800 mb-2">구매까지 한 번에</h4>
                        <p className="text-gray-600">추천받은 상품을 쿠팡 파트너스 링크를 통해 즉시 확인하고 구매할 수 있습니다.</p>
                    </div>
                </section>

                {/* 운영 철학 섹션 */}
                <section className="bg-gradient-to-br from-pink-50 to-purple-50 p-8 rounded-3xl border border-pink-100">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">✨</span>
                        <h3 className="text-2xl font-bold text-gray-800">우리의 목표</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                        단순한 상품 나열이 아닌, 주는 이의 정성과 받는 이의 기쁨이 연결되는 지점을 찾는 것이
                        선물지니의 목표입니다. 특별한 기념일을 더욱 특별하게 만드는 최고의 조력자가 되겠습니다.
                    </p>
                </section>
            </div>
        </div>
    );
}
