'use client';

/**
 * Amazon(amazon.com / amazon.co.jp)으로 나가는 링크 클릭을 집계한다.
 * - /api/amazon-click/ 로 sendBeacon (마켓·페이지 종류만, 개인정보 없음)
 * - GA4 가 로드돼 있으면 amazon_click 이벤트도 함께 보낸다
 * 페이지마다 onClick 을 달지 않고 문서 전체 클릭을 위임 처리하므로, 새 Amazon 링크가 생겨도 자동으로 잡힌다.
 */
import { useEffect } from 'react';

type Market = 'us' | 'jp';

function marketOf(href: string): Market | null {
  try {
    const host = new URL(href, window.location.href).hostname;
    if (/(^|\.)amazon\.co\.jp$/.test(host)) return 'jp';
    if (/(^|\.)amazon\.com$/.test(host)) return 'us';
  } catch {
    // 잘못된 URL 은 무시
  }
  return null;
}

/** /en/gift/... → gift, /ja/result → result, /en/ → home */
function sourceOf(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  const first = ['ko', 'en', 'ja'].includes(parts[0]) ? parts[1] : parts[0];
  if (!first) return 'home';
  if (first === 'gift' || first === 'result' || first === 'blog') return first;
  return 'other';
}

export default function AmazonClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const market = marketOf(anchor.href);
      if (!market) return;
      const source = sourceOf(window.location.pathname);
      const payload = JSON.stringify({ market, source });
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon('/api/amazon-click/', new Blob([payload], { type: 'application/json' }));
        } else {
          fetch('/api/amazon-click/', { method: 'POST', body: payload, keepalive: true, headers: { 'Content-Type': 'application/json' } });
        }
      } catch {
        // 집계 실패가 이동을 막지 않게
      }
      const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
      if (typeof gtag === 'function') {
        gtag('event', 'amazon_click', { market, source, link_url: anchor.href });
      }
    };
    // 캡처 단계에서 잡아야 새 탭/이동 전에 확실히 실행된다
    document.addEventListener('click', onClick, true);
    document.addEventListener('auxclick', onClick, true); // 가운데 버튼(새 탭) 클릭
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('auxclick', onClick, true);
    };
  }, []);

  return null;
}
