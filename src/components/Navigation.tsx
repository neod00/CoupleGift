'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navigation: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { path: '/', label: 'AI 선물 추천', icon: '🏠', title: 'AI 맞춤형 커플 선물 추천 서비스' },
    { path: '/about', label: '선물지니 소개', icon: '💝', title: 'AI 맞춤형 선물 추천 서비스 소개' },
    { path: '/blog', label: '선물 아이디어 블로그', icon: '📝', title: '기념일 선물 아이디어 블로그' },
    { path: '/contact', label: '문의하기', icon: '📧', title: '선물 추천 서비스 문의' },
    { path: '/privacy', label: '개인정보처리방침', icon: '🔒', title: '개인정보처리방침' },
  ];

  return (
    <nav className="glass-card mb-8">
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            title={item.title}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${pathname === item.path
              ? 'bg-white/20 text-[var(--text-main)] font-semibold shadow-sm'
              : 'text-[var(--text-main-70)] hover:bg-white/10 hover:text-[var(--text-main)]'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
