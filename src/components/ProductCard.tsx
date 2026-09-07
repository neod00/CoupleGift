/**
 * 쿠팡 파트너스 상품 카드 / 그리드
 *
 * - 서버/클라이언트 어디서든 사용 가능 (훅 없음)
 * - 링크는 API가 돌려준 productUrl 을 그대로 사용한다 (파라미터 추가/변경 금지)
 * - 카탈로그(src/data/coupang/products.json)는 한국어 전용이므로
 *   ProductsForKeyword 는 매칭 상품이 없으면 null 을 반환한다.
 */
import React from 'react';
import type { CoupangProduct } from '@/lib/coupang/types';
import { getProductsForKeyword, getProductsForText } from '@/lib/coupang/catalog';

/** 쿠팡 파트너스 정책상 상품 링크 근처에 반드시 노출해야 하는 문구 */
export const COUPANG_DISCLOSURE =
  '이 포스팅은 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를 제공받습니다.';

/** 12345 -> "12,345원" */
export function formatKrw(price: number): string {
  const n = Number.isFinite(price) ? price : 0;
  return `${new Intl.NumberFormat('ko-KR').format(n)}원`;
}

interface ProductCardProps {
  product: CoupangProduct;
  /** true 면 가로형(썸네일 + 텍스트) 소형 카드 */
  compact?: boolean;
}

export default function ProductCard({ product, compact = false }: ProductCardProps) {
  const name = product.productName || '';
  const price = formatKrw(product.productPrice);
  const ariaLabel = `${name} ${price} 쿠팡에서 보기`;

  if (compact) {
    return (
      <a
        href={product.productUrl}
        target="_blank"
        rel="nofollow sponsored noopener"
        aria-label={ariaLabel}
        className="glass-card p-3 flex items-center gap-3 hover:scale-[1.02] transition-transform duration-300 group"
      >
        <div className="relative flex-shrink-0 w-20 h-20 overflow-hidden rounded-lg bg-white/10">
          <img
            src={product.productImage}
            alt={name}
            loading="lazy"
            decoding="async"
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          {product.isRocket && (
            <span className="inline-block mb-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white">
              🚀 로켓배송
            </span>
          )}
          <h4 className="text-sm font-semibold text-[var(--text-main)] line-clamp-2 leading-snug">{name}</h4>
          <p className="text-sm font-bold text-[var(--text-main)] mt-1">{price}</p>
        </div>
      </a>
    );
  }

  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="nofollow sponsored noopener"
      aria-label={ariaLabel}
      className="glass-card p-3 block h-full hover:scale-[1.02] transition-transform duration-300 group"
    >
      {/* 고정 비율 박스: 이미지 로딩 전에도 높이를 확보해 CLS 방지 */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-white/10">
        <img
          src={product.productImage}
          alt={name}
          loading="lazy"
          decoding="async"
          width={300}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.isRocket && (
          <span className="absolute top-2 left-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-500 text-white shadow">
            🚀 로켓배송
          </span>
        )}
      </div>
      <h4 className="mt-3 text-sm font-semibold text-[var(--text-main)] line-clamp-2 leading-snug min-h-[2.5rem]">
        {name}
      </h4>
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-base font-bold text-[var(--text-main)]">{price}</p>
        <span className="text-xs text-[var(--text-main-70)] group-hover:text-[var(--text-main)] transition-colors whitespace-nowrap">
          쿠팡에서 보기 →
        </span>
      </div>
      {product.isFreeShipping && !product.isRocket && (
        <p className="mt-1 text-[11px] text-[var(--text-main-70)]">무료배송</p>
      )}
    </a>
  );
}

interface ProductGridProps {
  products: CoupangProduct[];
  title?: string;
  /** false 로 주면 그리드 아래 파트너스 고지 문구를 생략 (호출 측이 별도로 노출할 때) */
  disclosure?: boolean;
}

export function ProductGrid({ products, title, disclosure }: ProductGridProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="my-8">
      {title && (
        <h3 className="text-lg font-bold text-[var(--text-main)] mb-4 flex items-center gap-2">
          <span aria-hidden="true">🛒</span>
          <span>{title}</span>
        </h3>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product, idx) => (
          <ProductCard key={`${product.productId}-${idx}`} product={product} />
        ))}
      </div>
      {disclosure !== false && (
        <p className="mt-3 text-xs text-[var(--text-main-70)] text-center">
          💡 {COUPANG_DISCLOSURE}
        </p>
      )}
    </section>
  );
}

interface ProductsForKeywordProps {
  keyword: string;
  title?: string;
  limit?: number;
}

/**
 * 키워드(또는 임의 텍스트)에 맞는 카탈로그 상품을 찾아 그리드로 그린다.
 * 정확 일치 → 부분 매칭 순으로 시도하고, 없으면 null (옛 글에서도 안전).
 */
export function ProductsForKeyword({ keyword, title, limit = 3 }: ProductsForKeywordProps) {
  if (!keyword) return null;

  let products = getProductsForKeyword(keyword, limit);
  if (products.length === 0) {
    products = getProductsForText(keyword, limit);
  }
  if (products.length === 0) return null;

  return <ProductGrid products={products} title={title} />;
}
