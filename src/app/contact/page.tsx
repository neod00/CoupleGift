'use client';

import React, { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // 이메일 전송 로직 (실제 구현 시 API 연동 필요)
        setTimeout(() => {
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="glass-card p-8 md:p-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
                        문의하기
                    </h2>
                    <p className="text-xl text-[var(--text-main-90)]">
                        서비스 이용 중 궁금한 점이나 제안하고 싶은 내용이 있으신가요?
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
                                ✉️
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-main)]">이메일 문의</h4>
                                <p className="text-[var(--text-main-70)]">openbrain_main@gmail.com</p>
                                <p className="text-sm text-[var(--text-main-70)] mt-1">24시간 이내에 답변해 드립니다.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                                💬
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-main)]">제휴 제안</h4>
                                <p className="text-[var(--text-main-70)]">openbrain_main@gmail.com</p>
                                <p className="text-sm text-[var(--text-main-70)] mt-1">기업 및 광고 제휴 문의 환영합니다.</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                            <p className="text-sm text-[var(--text-main-70)] leading-relaxed">
                                💡 자주 묻는 질문이나 긴급한 오류 제보는 블로그 댓글이나 이메일을 통해
                                전달해주시면 더 빠르게 확인 가능합니다.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-[var(--text-main)] mb-1">성함</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                                placeholder="홍길동"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-main)] mb-1">이메일 주소</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                                placeholder="example@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-semibold text-[var(--text-main)] mb-1">내용</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all resize-none"
                                placeholder="문의하실 내용을 입력해주세요..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${status === 'loading' ? 'bg-gray-400' : 'btn-primary'
                                }`}
                        >
                            {status === 'loading' ? '전송 중...' : '문의 보내기'}
                        </button>

                        {status === 'success' && (
                            <p className="text-center text-green-600 font-medium animate-bounce mt-4">
                                ✅ 문의가 정상적으로 전송되었습니다!
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
