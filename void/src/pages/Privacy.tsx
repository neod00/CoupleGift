import React from 'react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen instagram-gradient relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              🔒 개인정보처리방침
            </h1>
            <p className="text-xl text-white/90">
              선물지니 GiftGenie의 개인정보 보호 정책
            </p>
          </header>

          <div className="glass-card p-8 mb-8 fade-in">
            <div className="space-y-6 text-white/90">
              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">1. 개인정보의 수집 및 이용 목적</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>선물지니는 다음과 같은 목적으로 개인정보를 수집하고 있습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>AI 기반 맞춤형 선물 추천 서비스 제공</li>
                    <li>서비스 이용 기록 및 통계 분석</li>
                    <li>고객 문의 및 불만 처리</li>
                    <li>서비스 개선 및 신규 서비스 개발</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">2. 수집하는 개인정보 항목</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>선물 추천 서비스 이용 시 다음 정보를 수집합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>성별, 나이, 성격 특성, 기념일 종류, 예산 범위</li>
                    <li>선호 카테고리 및 추가 정보</li>
                    <li>서비스 이용 기록 및 추천 결과</li>
                    <li>방문자 통계 정보</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">3. 개인정보의 보유 및 이용기간</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>수집된 개인정보는 다음과 같이 보관됩니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>서비스 이용 목적 달성 시까지</li>
                    <li>관련 법령에 따른 보존 의무가 있는 경우 해당 기간</li>
                    <li>사용자가 삭제를 요청한 경우 즉시 삭제</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">4. 개인정보의 제3자 제공</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>선물지니는 다음과 같은 경우를 제외하고 개인정보를 제3자에게 제공하지 않습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>사용자의 사전 동의가 있는 경우</li>
                    <li>법령에 의해 요구되는 경우</li>
                    <li>수사기관의 수사목적으로 법령에 정해진 절차에 따라 요구되는 경우</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">5. 개인정보 보호책임자</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
                  <div className="bg-white/10 p-4 rounded-lg">
                    <p><strong>개인정보 보호책임자</strong></p>
                    <p>이메일: iamspace@kakao.com</p>
                    <p>연락처: 010-1234-5678</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">6. 개인정보 처리방침 변경</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.</p>
                  <p className="text-sm text-white/70">시행일자: 2025년 1월 1일</p>
                </div>
              </section>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              🏠 홈으로 돌아가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
