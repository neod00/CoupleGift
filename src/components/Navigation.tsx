'use client';

import React from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';

const Navigation: React.FC = () => {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();

  const navItems = [
    { path: '/', labelKey: 'home', icon: '🏠' },
    { path: '/about', labelKey: 'about', icon: '💝' },
    { path: '/blog', labelKey: 'blog', icon: '📝' },
    { path: '/contact', labelKey: 'contact', icon: '📧' },
    { path: '/privacy', labelKey: 'privacy', icon: '🔒' },
  ];

  return (
    <nav className="glass-card mb-8">
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${pathname === item.path
              ? 'bg-white/20 text-[var(--text-main)] font-semibold shadow-sm'
              : 'text-[var(--text-main-70)] hover:bg-white/10 hover:text-[var(--text-main)]'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
