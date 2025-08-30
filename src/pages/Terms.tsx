import React from 'react';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen instagram-gradient relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          <header className="text-center mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              📋 이용약관
            </h1>
            <p className="text-xl text-white/90">
              선물지니 GiftGenie 서비스 이용 약관
            </p>
          </header>

          <div className="glass-card p-8 mb-8 fade-in">
            <div className="space-y-6 text-white/90">
              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제1조 (목적)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>이 약관은 선물지니 GiftGenie(이하 "회사")가 제공하는 AI 기반 맞춤형 선물 추천 서비스(이하 "서비스")의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제2조 (정의)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>이 약관에서 사용하는 용어의 정의는 다음과 같습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>"서비스"란 회사가 제공하는 AI 기반 맞춤형 선물 추천 서비스를 의미합니다.</li>
                    <li>"이용자"란 이 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 의미합니다.</li>
                    <li>"콘텐츠"란 서비스 내에서 이용자가 작성한 게시물, 댓글, 추천 요청 등의 정보를 의미합니다.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제3조 (서비스의 제공)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>회사는 다음과 같은 서비스를 제공합니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>AI 기반 맞춤형 선물 추천 서비스</li>
                    <li>선물 가이드 및 정보 제공</li>
                    <li>쿠팡 연동 상품 검색 및 링크 제공</li>
                    <li>기타 회사가 정하는 서비스</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제4조 (서비스 이용)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>서비스 이용은 다음과 같습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>이용자는 서비스 이용을 위해 필요한 정보를 정확하게 입력해야 합니다.</li>
                    <li>이용자는 서비스 이용 시 관련 법령 및 이 약관을 준수해야 합니다.</li>
                    <li>회사는 이용자의 서비스 이용을 제한하거나 중단할 수 있습니다.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제5조 (개인정보보호)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>회사는 이용자의 개인정보를 보호하기 위해 개인정보처리방침을 수립하고 이를 준수합니다. 개인정보의 수집, 이용, 제공 등에 관한 자세한 내용은 개인정보처리방침을 통해 확인할 수 있습니다.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제6조 (회사의 의무)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>회사는 다음과 같은 의무를 가집니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>안정적이고 지속적인 서비스 제공</li>
                    <li>이용자의 개인정보 보호</li>
                    <li>서비스 개선 및 신기술 도입</li>
                    <li>이용자 문의에 대한 신속한 응답</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제7조 (이용자의 의무)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>이용자는 다음과 같은 의무를 가집니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>서비스 이용 시 정확한 정보 입력</li>
                    <li>타인의 권리나 명예, 신용 등을 침해하는 행위 금지</li>
                    <li>서비스의 정상적인 운영을 방해하는 행위 금지</li>
                    <li>기타 관련 법령 및 이 약관을 위반하는 행위 금지</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제8조 (서비스 중단)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>회사는 다음과 같은 경우 서비스를 중단할 수 있습니다:</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>서비스 점검, 보수, 교체 등의 경우</li>
                    <li>천재지변, 전쟁, 폭동, 테러, 해킹, 컴퓨터 바이러스 등의 경우</li>
                    <li>기타 회사가 서비스 중단이 필요하다고 판단하는 경우</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제9조 (약관 변경)</h2>
 <div className="space-y-3 text-base leading-relaxed">
                  <p>회사는 약관의 규제에 관한 법률 등 관련법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다. 약관이 개정되는 경우 회사는 개정된 약관의 내용과 시행일을 정하여 시행일로부터 최소 7일 이전에 공지합니다.</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-yellow-300 mb-4">제10조 (준거법 및 관할법원)</h2>
                <div className="space-y-3 text-base leading-relaxed">
                  <p>이 약관의 해석 및 회사와 이용자 간의 분쟁에 대해서는 대한민국 법률을 적용하며, 분쟁이 발생한 경우 회사의 주소지 관할법원에 제소합니다.</p>
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

export default Terms;
