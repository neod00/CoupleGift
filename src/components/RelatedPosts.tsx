/**
 * 내부 링크 블록: "함께 보면 좋은 글" + "관련 선물 가이드"
 *
 * - 서버/클라이언트 어디서든 사용 가능 (훅 없음)
 * - 내부 링크이므로 nofollow 를 붙이지 않는다 (SEO 링크 주스 전달)
 */
import React from 'react';
import { Link } from '@/i18n/navigation';

export interface RelatedPostItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
}

export interface RelatedGiftPageItem {
  slug: string;
  title: string;
}

interface RelatedPostsProps {
  locale: string;
  posts: RelatedPostItem[];
  giftPages?: RelatedGiftPageItem[];
}

const HEADINGS: Record<string, { posts: string; gifts: string; readMore: string }> = {
  ko: { posts: '함께 보면 좋은 글', gifts: '관련 선물 가이드', readMore: '자세히 읽기 →' },
  en: { posts: 'You may also like', gifts: 'Related gift guides', readMore: 'Read more →' },
  ja: { posts: 'あわせて読みたい', gifts: '関連ギフトガイド', readMore: '詳しく読む →' },
};

export default function RelatedPosts({ locale, posts, giftPages = [] }: RelatedPostsProps) {
  const safePosts = Array.isArray(posts) ? posts : [];
  const safeGiftPages = Array.isArray(giftPages) ? giftPages : [];

  if (safePosts.length === 0 && safeGiftPages.length === 0) return null;

  const t = HEADINGS[locale] || HEADINGS.ko;

  return (
    <aside className="mt-12 space-y-10" aria-label={t.posts}>
      {safePosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-[var(--text-main)] mb-6 text-center">
            📚 {t.posts}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {safePosts.map((post) => {
              const isImageUrl = typeof post.image === 'string' && post.image.startsWith('http');
              return (
                <Link
                  key={post.id}
                  href={`/blog/${post.id}`}
                  className="glass-card p-4 flex gap-4 items-start hover:scale-[1.02] transition-transform duration-300 group"
                >
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                    {isImageUrl ? (
                      <img
                        src={post.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl" aria-hidden="true">{post.image || '🎁'}</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-[var(--text-main)] line-clamp-2 leading-snug group-hover:underline">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="mt-1 text-xs text-[var(--text-main-70)] line-clamp-2">{post.excerpt}</p>
                    )}
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[var(--text-main-70)]">
                      <span>{post.date}</span>
                      <span>{t.readMore}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {safeGiftPages.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-[var(--text-main)] mb-4 text-center">
            🎁 {t.gifts}
          </h2>
          <ul className="flex flex-wrap justify-center gap-2">
            {safeGiftPages.map((page) => (
              <li key={page.slug}>
                <Link
                  href={`/gift/${page.slug}`}
                  className="inline-block text-sm bg-white/20 hover:bg-white/30 text-[var(--text-main)] px-4 py-2 rounded-full transition-colors"
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </aside>
  );
}
