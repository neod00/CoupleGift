'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import AdSense from '@/components/AdSense';
import { genders, ageGroups, occasions, budgets } from '@/data/giftPages';

export default function GiftIndex() {
  const locale = useLocale();
  const [selectedGender, setSelectedGender] = useState<string>('female');
  const [selectedAge, setSelectedAge] = useState<string>('20s');

  const labels = {
    ko: {
      title: '🎁 맞춤형 선물 가이드',
      subtitle: '성별, 나이, 기념일, 예산별로 완벽한 선물을 찾아보세요',
      genderLabel: '성별 선택',
      ageLabel: '나이대 선택',
      occasionLabel: '기념일별 가이드',
      ctaTitle: '원하는 조건을 찾지 못하셨나요?',
      ctaButton: '🎁 AI 맞춤 추천 받기',
    },
    en: {
      title: '🎁 Personalized Gift Guide',
      subtitle: 'Find the perfect gift by gender, age, occasion, and budget',
      genderLabel: 'Select Gender',
      ageLabel: 'Select Age Group',
      occasionLabel: 'Guides by Occasion',
      ctaTitle: "Couldn't find what you're looking for?",
      ctaButton: '🎁 Get AI Recommendations',
    },
    ja: {
      title: '🎁 カスタムギフトガイド',
      subtitle: '性別、年齢、記念日、予算別に完璧なギフトを見つけましょう',
      genderLabel: '性別を選択',
      ageLabel: '年代を選択',
      occasionLabel: '記念日別ガイド',
      ctaTitle: 'お探しの条件が見つかりませんでしたか？',
      ctaButton: '🎁 AIおすすめを受ける',
    },
  };

  const l = labels[locale as keyof typeof labels] || labels.ko;
  const lk = locale as 'ko' | 'en' | 'ja';

  return (
    <div className="max-w-6xl mx-auto fade-in">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold gradient-text mb-4">{l.title}</h1>
        <p className="text-xl text-[var(--text-main-70)]">{l.subtitle}</p>
      </div>

      {/* 성별 선택 */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4">{l.genderLabel}</h2>
        <div className="flex gap-4">
          {genders.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGender(g.id)}
              className={`flex-1 py-3 px-4 rounded-xl text-center font-semibold transition-all duration-300 ${
                selectedGender === g.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/20 text-[var(--text-main)] hover:bg-white/30'
              }`}
            >
              {g.id === 'female' ? '👩 ' : '👨 '}{g[lk] || g.ko}
            </button>
          ))}
        </div>
      </div>

      {/* 나이대 선택 */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-main)] mb-4">{l.ageLabel}</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {ageGroups.map(a => (
            <button
              key={a.id}
              onClick={() => setSelectedAge(a.id)}
              className={`py-3 px-2 rounded-xl text-center font-medium text-sm transition-all duration-300 ${
                selectedAge === a.id
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                  : 'bg-white/20 text-[var(--text-main)] hover:bg-white/30'
              }`}
            >
              {a[lk] || a.ko}
            </button>
          ))}
        </div>
      </div>

      {/* 광고 */}
      <AdSense adFormat="banner" className="mb-6" />

      {/* 기념일별 그리드 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 text-center">{l.occasionLabel}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {occasions.map(occasion => {
            const icons: Record<string, string> = {
              birthday: '🎂', anniversary: '💝', '100days': '💯', christmas: '🎄',
              valentines: '💕', whiteday: '🤍', graduation: '🎓', parents: '👨‍👩‍👧',
            };
            // 대표 예산 (3~5만원)으로 링크
            const slug = `${selectedGender}-${selectedAge}-${occasion.id}-3-5`;
            return (
              <Link
                key={occasion.id}
                href={`/gift/${slug}`}
                className="glass-card p-6 hover:scale-105 transition-all duration-300 block text-center"
              >
                <div className="text-4xl mb-3">{icons[occasion.id] || '🎁'}</div>
                <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2">
                  {occasion[lk] || occasion.ko}
                </h3>
                {/* 예산별 서브링크 */}
                <div className="flex flex-wrap justify-center gap-1 mt-3">
                  {budgets.slice(0, 3).map(b => (
                    <Link
                      key={b.id}
                      href={`/gift/${selectedGender}-${selectedAge}-${occasion.id}-${b.id}`}
                      className="text-xs bg-white/20 px-2 py-1 rounded-full hover:bg-white/40 transition-all text-[var(--text-main-70)]"
                    >
                      {b[lk] || b.ko}
                    </Link>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card p-8 text-center mb-8">
        <h2 className="text-2xl font-bold text-[var(--text-main)] mb-4">{l.ctaTitle}</h2>
        <Link href="/" className="btn-primary inline-block text-lg px-8 py-4 font-semibold">
          {l.ctaButton}
        </Link>
      </div>

      <AdSense adFormat="rectangle" className="mb-6" />
    </div>
  );
}
