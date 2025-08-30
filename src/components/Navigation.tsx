import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '홈', icon: '🏠' },
    { path: '/about', label: '소개', icon: '💝' },
    { path: '/blog', label: '블로그', icon: '📝' },
    { path: '/contact', label: '문의', icon: '📧' },
    { path: '/privacy', label: '개인정보처리방침', icon: '🔒' },
  ];

  return (
    <nav className="glass-card mb-8">
      <div className="flex flex-wrap justify-center gap-4 p-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === item.path
                ? 'bg-white/20 text-white font-semibold'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
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

