import React, { useState, useEffect } from 'react';
import AdSense from '../components/AdSense.tsx';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // 페이지별 메타 태그 업데이트
    document.title = '문의하기 - 선물지니 AI 맞춤형 선물 추천 서비스';
    
    // 메타 설명 업데이트
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', '선물지니 AI 맞춤형 커플 선물 추천 서비스 문의하기. 기념일 선물, 생일 선물 아이디어 관련 문의사항을 남겨주세요.');
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 구현에서는 이메일 발송 로직을 추가
    console.log('문의 내용:', formData);
    setIsSubmitted(true);
    
    // 3초 후 폼 리셋
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            📧 문의하기
          </h1>
          <p className="text-xl text-white/90">
            궁금한 점이나 개선 사항을 알려주세요
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 문의 양식 */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <span className="text-3xl">✍️</span>
              문의 양식
            </h2>
            
            {isSubmitted ? (
              <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-6 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-semibold text-green-300 mb-2">문의가 접수되었습니다!</h3>
                <p className="text-green-200">
                  소중한 의견 감사합니다. 빠른 시일 내에 답변드리겠습니다.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-white font-medium mb-2">
                    이름 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    placeholder="성함을 입력해주세요"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-medium mb-2">
                    이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    placeholder="답변받을 이메일 주소"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-white font-medium mb-2">
                    문의 유형 *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                  >
                    <option value="" className="bg-gray-800">문의 유형을 선택해주세요</option>
                    <option value="service" className="bg-gray-800">서비스 이용 문의</option>
                    <option value="bug" className="bg-gray-800">버그 신고</option>
                    <option value="suggestion" className="bg-gray-800">개선 제안</option>
                    <option value="partnership" className="bg-gray-800">제휴 문의</option>
                    <option value="other" className="bg-gray-800">기타</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-white font-medium mb-2">
                    문의 내용 *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all resize-none"
                    placeholder="궁금한 점이나 개선 사항을 자세히 적어주세요"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary text-lg py-4"
                >
                  📤 문의 보내기
                </button>
              </form>
            )}
          </div>

          {/* 연락처 정보 */}
          <div>
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
              <span className="text-3xl">📞</span>
              연락처 정보
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="text-2xl">📧</span>
                  이메일
                </h3>
                <p className="text-white/90 text-lg">
                  iamspace@kakao.com
                </p>
                <p className="text-white/70 text-sm mt-2">
                  평일 09:00 - 18:00 (주말 및 공휴일 제외)
                </p>
              </div>

              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="text-3xl">⏰</span>
                  응답 시간
                </h3>
                <ul className="text-white/90 space-y-2">
                  <li>• 일반 문의: 1-2 영업일 내 답변</li>
                  <li>• 버그 신고: 24시간 내 확인</li>
                  <li>• 제휴 문의: 3-5 영업일 내 답변</li>
                </ul>
              </div>

              <div className="bg-white/10 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                  <span className="text-3xl">💡</span>
                  자주 묻는 질문
                </h3>
                <div className="space-y-3 text-white/90">
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-white transition-colors">
                      선물 추천이 마음에 들지 않아요
                    </summary>
                    <p className="mt-2 text-sm text-white/70 pl-4">
                      '다시 추천받기' 버튼을 클릭하시면 새로운 추천을 받을 수 있습니다. 
                      더 정확한 추천을 위해 상세한 정보를 입력해주세요.
                    </p>
                  </details>
                  
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-white transition-colors">
                      쿠팡 링크가 작동하지 않아요
                    </summary>
                    <p className="mt-2 text-sm text-white/70 pl-4">
                      일시적인 네트워크 문제일 수 있습니다. 
                      페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
                    </p>
                  </details>
                  
                  <details className="cursor-pointer">
                    <summary className="font-medium hover:text-white transition-colors">
                      개인정보는 안전한가요?
                    </summary>
                    <p className="mt-2 text-sm text-white/70 pl-4">
                      입력하신 정보는 선물 추천에만 사용되며, 
                      별도로 저장되지 않습니다. 자세한 내용은 개인정보처리방침을 참고해주세요.
                    </p>
                  </details>
                </div>
              </div>
            </div>
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

export default Contact;

