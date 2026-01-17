import React from 'react';
import AdSense from '../components/AdSense.tsx';

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            🔒 개인정보처리방침
          </h1>
          <p className="text-xl text-white/90">
            선물지니 개인정보 보호 정책
          </p>
          <p className="text-sm text-white/70 mt-2">
            최종 수정일: 2024년 7월 28일
          </p>
        </div>

        <div className="space-y-8 text-white/90">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              1. 개인정보의 처리 목적
            </h2>
            <p className="mb-4">
              선물지니(이하 "회사")는 다음의 목적을 위하여 개인정보를 처리합니다. 
              처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 
              이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>선물 추천 서비스 제공</li>
              <li>맞춤형 콘텐츠 및 광고 제공</li>
              <li>서비스 개선 및 품질 향상</li>
              <li>고객 문의 및 지원 서비스 제공</li>
              <li>서비스 이용 통계 분석</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              2. 개인정보의 처리 및 보유기간
            </h2>
            <div className="bg-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">처리 항목 및 보유기간</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">선물 추천 서비스 이용 정보</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• 수집항목: 받는 분의 연령대, 성별, 관계, 기념일 종류, 예산, 취향</li>
                    <li>• 보유기간: 서비스 이용 완료 후 즉시 삭제 (별도 저장하지 않음)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">문의 및 고객지원</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• 수집항목: 이름, 이메일 주소, 문의 내용</li>
                    <li>• 보유기간: 문의 처리 완료 후 1년</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">웹사이트 이용 정보</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• 수집항목: IP 주소, 쿠키, 방문 기록, 브라우저 정보</li>
                    <li>• 보유기간: 1년</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              3. 개인정보의 제3자 제공
            </h2>
            <p className="mb-4">
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 
              다만, 아래의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              <li>통계작성, 학술연구 또는 시장조사를 위하여 필요한 경우로서 특정 개인을 알아볼 수 없는 형태로 가공하여 제공하는 경우</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              4. 개인정보처리의 위탁
            </h2>
            <p className="mb-4">
              회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다.
            </p>
            <div className="bg-white/10 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-white mb-2">AI 서비스 제공</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• 위탁받는 자: OpenAI</li>
                    <li>• 위탁하는 업무의 내용: 선물 추천 AI 서비스 제공</li>
                    <li>• 위탁기간: 서비스 제공 기간</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">웹사이트 호스팅</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• 위탁받는 자: Netlify</li>
                    <li>• 위탁하는 업무의 내용: 웹사이트 호스팅 및 배포</li>
                    <li>• 위탁기간: 서비스 제공 기간</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-white mb-2">광고 서비스</h4>
                  <ul className="text-sm text-white/80 space-y-1">
                    <li>• 위탁받는 자: Google AdSense</li>
                    <li>• 위탁하는 업무의 내용: 맞춤형 광고 제공</li>
                    <li>• 위탁기간: 서비스 제공 기간</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              5. 정보주체의 권리·의무 및 행사방법
            </h2>
            <p className="mb-4">
              이용자는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>개인정보 처리정지 요구권</li>
              <li>개인정보 열람요구권</li>
              <li>개인정보 정정·삭제요구권</li>
              <li>개인정보 처리정지 요구권</li>
            </ul>
            <p className="mt-4 text-sm text-white/70">
              위의 권리 행사는 개인정보보호법 시행령 제41조제1항에 따라 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며, 
              회사는 이에 대해 지체없이 조치하겠습니다.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              6. 개인정보의 안전성 확보조치
            </h2>
            <p className="mb-4">
              회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/80">
              <li>개인정보 취급 직원의 최소화 및 교육</li>
              <li>개인정보에 대한 접근 제한</li>
              <li>개인정보를 안전하게 저장·전송할 수 있는 암호화 기술 사용</li>
              <li>해킹이나 컴퓨터 바이러스 등에 의한 개인정보 유출 및 훼손을 막기 위한 보안시스템 구축</li>
              <li>개인정보처리시스템 접속기록의 보관 및 위변조 방지</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              7. 쿠키(Cookie)의 사용
            </h2>
            <p className="mb-4">
              회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
            </p>
            <div className="bg-white/10 rounded-lg p-6">
              <h4 className="font-medium text-white mb-3">쿠키 사용 목적</h4>
              <ul className="text-sm text-white/80 space-y-1">
                <li>• 서비스 이용 편의성 향상</li>
                <li>• 맞춤형 광고 제공</li>
                <li>• 웹사이트 방문 및 이용형태 파악</li>
                <li>• 서비스 개선을 위한 통계 분석</li>
              </ul>
              <p className="text-sm text-white/70 mt-4">
                이용자는 쿠키 설치에 대한 선택권을 가지고 있습니다. 
                웹브라우저에서 옵션을 설정함으로써 모든 쿠키를 허용하거나, 쿠키가 저장될 때마다 확인을 거치거나, 
                아니면 모든 쿠키의 저장을 거부할 수도 있습니다.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              8. 개인정보 보호책임자
            </h2>
            <div className="bg-white/10 rounded-lg p-6">
              <p className="mb-4">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 
                아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="space-y-2 text-white/90">
                <p><strong>개인정보 보호책임자</strong></p>
                <p>• 이메일: privacy@giftgenie.co.kr</p>
                <p>• 전화번호: 문의 양식을 통해 연락 바랍니다</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">
              9. 개인정보처리방침의 변경
            </h2>
            <p className="mb-4">
              이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는 경우에는 
              변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
            </p>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-sm text-white/80">
                • 공고일자: 2024년 7월 28일<br/>
                • 시행일자: 2024년 7월 28일
              </p>
            </div>
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

export default Privacy;

