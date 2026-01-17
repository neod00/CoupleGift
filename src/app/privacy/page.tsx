import React from 'react';

export default function Privacy() {
    const lastUpdated = "2024년 5월 20일";

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 italic-not-really">
            <div className="glass-card p-8 md:p-12 space-y-8 text-[var(--text-main-70)]">
                <header className="text-center border-b border-gray-100 pb-8 mb-8">
                    <h2 className="text-4xl font-bold gradient-text mb-4 text-not-italic">개인정보처리방침</h2>
                    <p className="text-sm text-[var(--text-main-70)]">최종 수정일: {lastUpdated}</p>
                </header>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--text-main)]">1. 개인정보의 수집 및 이용 목적</h3>
                    <p className="leading-relaxed">
                        '선물지니'(이하 '회사')는 사용자가 입력한 정보를 바탕으로 최적의 선물 아이디어를 제공하기 위해 최소한의 정보만을 사용합니다.
                        회사는 별도의 회원가입 절차 없이 서비스를 제공하며, 입력된 정보는 다음과 같은 목적으로만 활용됩니다.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>AI 기반 맞춤형 선물 추천 결과 생성</li>
                        <li>서비스 개선을 위한 익명화된 통계 분석</li>
                        <li>문의 사항에 대한 응대 및 지원</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--text-main)]">2. 수집하는 개인정보 항목</h3>
                    <p className="leading-relaxed">
                        본 서비스는 맞춤형 추천을 위해 다음과 같은 정보를 사용자의 직접 입력을 통해 일시적으로 처리합니다.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>추천 대상의 정보: 성별, 연령대, 성격/취향 키워드</li>
                        <li>상황 정보: 기념일 종류, 예산 범위, 선호 카테고리</li>
                        <li>(문의 시) 이름, 이메일 주소</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--text-main)]">3. 개인정보의 보유 및 이용 기간</h3>
                    <p className="leading-relaxed">
                        사용자가 입력한 추천 관련 정보는 브라우저 세션 동안만 유지되거나 추천 결과 생성 즉시 파기되는 것을 원칙으로 합니다.
                        단, 관련 법령에 의해 보존할 필요가 있는 경우 해당 법령이 정한 기간 동안 보관합니다.
                    </p>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--text-main)]">4. 제3자 제공 및 위탁</h3>
                    <p className="leading-relaxed">
                        회사는 사용자의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 다음의 경우 주의가 필요합니다.
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>OpenAI API:</strong> 추천 결과 생성을 위해 사용자가 입력한 익명화된 선물 조건 정보(성별, 예산 등)가 OpenAI의 서버로 전송될 수 있습니다. 이 과정에서 직접적인 개인 식별 정보는 포함되지 않습니다.</li>
                        <li><strong>쿠팡 파트너스:</strong> 상품 구매 링크 클릭 시 서비스 제공을 위해 쿠팡의 결제 및 서비스 정책이 적용됩니다.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h3 className="text-xl font-bold text-[var(--text-main)]">5. 정보주체의 권리</h3>
                    <p className="leading-relaxed">
                        사용자는 언제든지 본인의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다.
                        문의하기 페이지 또는 이메일(contact@giftgenie.com)을 통해 요청 주시면 지체 없이 처리하겠습니다.
                    </p>
                </section>

                <footer className="pt-8 border-top border-gray-100 mt-12 text-sm text-[var(--text-main-70)] text-center">
                    본 방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경 내용의 추가, 삭제 및 정정이 있는 경우에는
                    공지사항을 통해 고지할 것입니다.
                </footer>
            </div>
        </div>
    );
}
