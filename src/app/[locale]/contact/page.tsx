'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';

export default function Contact() {
    const locale = useLocale();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const content = {
        ko: {
            title: "문의하기",
            subtitle: "서비스 이용 중 궁금한 점이나 제안하고 싶은 내용이 있으신가요?",
            email: "이메일 문의",
            emailDesc: "24시간 이내에 답변해 드립니다.",
            partnership: "제휴 제안",
            partnershipDesc: "기업 및 광고 제휴 문의 환영합니다.",
            tip: "💡 자주 묻는 질문이나 긴급한 오류 제보는 블로그 댓글이나 이메일을 통해 전달해주시면 더 빠르게 확인 가능합니다.",
            name: "성함",
            namePlaceholder: "홍길동",
            emailLabel: "이메일 주소",
            emailPlaceholder: "example@email.com",
            messageLabel: "내용",
            messagePlaceholder: "문의하실 내용을 입력해주세요...",
            submit: "문의 보내기",
            sending: "전송 중...",
            success: "✅ 문의가 정상적으로 전송되었습니다!"
        },
        en: {
            title: "Contact Us",
            subtitle: "Have questions or suggestions about our service?",
            email: "Email Inquiry",
            emailDesc: "We'll respond within 24 hours.",
            partnership: "Partnership",
            partnershipDesc: "Corporate and advertising partnership inquiries welcome.",
            tip: "💡 For FAQs or urgent bug reports, please leave a blog comment or send an email for faster response.",
            name: "Name",
            namePlaceholder: "John Doe",
            emailLabel: "Email Address",
            emailPlaceholder: "example@email.com",
            messageLabel: "Message",
            messagePlaceholder: "Please enter your inquiry...",
            submit: "Send Message",
            sending: "Sending...",
            success: "✅ Your message has been sent successfully!"
        },
        ja: {
            title: "お問い合わせ",
            subtitle: "サービスのご利用中に疑問点やご提案がございましたら、お気軽にどうぞ。",
            email: "メールでのお問い合わせ",
            emailDesc: "24時間以内にご返信いたします。",
            partnership: "提携のご提案",
            partnershipDesc: "企業および広告提携のお問い合わせを歓迎いたします。",
            tip: "💡 よくある質問や緊急のバグ報告は、ブログのコメントやメールでお伝えいただくと、より迅速に確認できます。",
            name: "お名前",
            namePlaceholder: "山田太郎",
            emailLabel: "メールアドレス",
            emailPlaceholder: "example@email.com",
            messageLabel: "内容",
            messagePlaceholder: "お問い合わせ内容をご入力ください...",
            submit: "送信する",
            sending: "送信中...",
            success: "✅ お問い合わせが正常に送信されました！"
        }
    };

    const c = content[locale as keyof typeof content] || content.ko;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

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
                        {c.title}
                    </h2>
                    <p className="text-xl text-[var(--text-main-90)]">
                        {c.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-2xl">
                                ✉️
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-main)]">{c.email}</h4>
                                <p className="text-[var(--text-main-70)]">openbrain_main@gmail.com</p>
                                <p className="text-sm text-[var(--text-main-70)] mt-1">{c.emailDesc}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-2xl">
                                💬
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-[var(--text-main)]">{c.partnership}</h4>
                                <p className="text-[var(--text-main-70)]">openbrain_main@gmail.com</p>
                                <p className="text-sm text-[var(--text-main-70)] mt-1">{c.partnershipDesc}</p>
                            </div>
                        </div>

                        <div className="p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                            <p className="text-sm text-[var(--text-main-70)] leading-relaxed">
                                {c.tip}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-[var(--text-main)] mb-1">{c.name}</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                                placeholder={c.namePlaceholder}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[var(--text-main)] mb-1">{c.emailLabel}</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                                placeholder={c.emailPlaceholder}
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-semibold text-[var(--text-main)] mb-1">{c.messageLabel}</label>
                            <textarea
                                id="message"
                                name="message"
                                required
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all resize-none"
                                placeholder={c.messagePlaceholder}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className={`w-full py-4 rounded-xl font-bold text-white transition-all ${status === 'loading' ? 'bg-gray-400' : 'btn-primary'
                                }`}
                        >
                            {status === 'loading' ? c.sending : c.submit}
                        </button>

                        {status === 'success' && (
                            <p className="text-center text-green-600 font-medium animate-bounce mt-4">
                                {c.success}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
