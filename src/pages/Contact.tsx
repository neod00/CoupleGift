import React, { useState } from 'react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 이메일 클라이언트로 메일 보내기
      const subject = encodeURIComponent(`[선물지니 문의] ${formData.title}`);
      const body = encodeURIComponent(`문의 내용:\n\n${formData.content}\n\n---\n보낸 시간: ${new Date().toLocaleString()}`);
      
      const mailtoLink = `mailto:iamspace@kakao.com?subject=${subject}&body=${body}`;
      
      // 새 창에서 메일 클라이언트 열기
      window.open(mailtoLink, '_blank');
      
      setSubmitStatus('success');
      setFormData({ title: '', content: '' });
      
      // 3초 후 상태 초기화
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
      
    } catch (error) {
      console.error('문의 전송 오류:', error);
      setSubmitStatus('error');
      
      // 3초 후 상태 초기화
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen instagram-gradient relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <header className="text-center mb-12 fade-in">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              💬 문의하기
            </h1>
            <p className="text-xl text-white/90">
              궁금한 점이나 건의사항이 있으시면 언제든 연락주세요
            </p>
          </header>

          <div className="glass-card p-8 mb-8 fade-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-white/90 font-medium mb-2">
                  📝 제목
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="문의 제목을 입력해주세요"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-300 focus:bg-white/20 transition-all duration-300"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-white/90 font-medium mb-2">
                  ✍️ 문의 내용
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="문의하실 내용을 자세히 작성해주세요"
                  rows={8}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-yellow-300 focus:bg-white/20 transition-all duration-300 resize-none"
                  required
                />
              </div>

              <div className="bg-blue-50/20 border border-blue-200/30 rounded-lg p-4">
                <h3 className="text-blue-300 font-semibold mb-2">📧 문의 방법</h3>
                <p className="text-white/80 text-sm">
                  메일 클라이언트가 자동으로 열리며, 내용을 확인 후 전송 버튼을 클릭해주세요.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '📤 전송 중...' : '📤 문의 전송하기'}
                </button>
                
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="flex-1 btn-secondary"
                >
                  🏠 홈으로 돌아가기
                </button>
              </div>
            </form>

            {/* 상태 메시지 */}
            {submitStatus === 'success' && (
              <div className="mt-6 p-4 bg-green-50/20 border border-green-200/30 rounded-lg text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-green-300 font-medium">문의가 성공적으로 전송되었습니다!</p>
                <p className="text-white/70 text-sm mt-1">메일 클라이언트에서 전송 버튼을 클릭해주세요.</p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-6 p-4 bg-red-50/20 border border-red-200/30 rounded-lg text-center">
                <div className="text-2xl mb-2">❌</div>
                <p className="text-red-300 font-medium">문의 전송 중 오류가 발생했습니다.</p>
                <p className="text-white/70 text-sm mt-1">다시 시도해주세요.</p>
              </div>
            )}
          </div>

          {/* 추가 연락처 정보 */}
          <div className="glass-card p-6 text-center fade-in">
            <h3 className="text-xl font-semibold text-yellow-300 mb-4">📞 기타 연락 방법</h3>
            <div className="space-y-2 text-white/80">
              <p>⏰ 응답 시간: 평일 24시간 내 (주말/공휴일 제외)</p>
              <p>💡 문의하신 내용은 신속하게 처리해드리겠습니다</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
