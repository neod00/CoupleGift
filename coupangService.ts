interface CoupangProduct {
  productId: string;
  productName: string;
  productPrice: number;
  productImage: string;
  productUrl: string;
  originalPrice: number;
  discountRate: number;
  vendorItemId: string;
  categoryName: string;
  rating: number;
  ratingCount: number;
}

interface CoupangSearchResponse {
  products: CoupangProduct[];
  totalCount: number;
}

// 쿠팡 파트너스 API 클라이언트 클래스
class CoupangPartnerService {
  private readonly partnerId: string;
  private readonly functionsUrl: string;

  constructor() {
    this.partnerId = process.env.REACT_APP_COUPANG_PARTNER_ID || '';
    // 개발 환경과 프로덕션 환경에 따라 다른 URL 사용
    this.functionsUrl = process.env.NODE_ENV === 'production' 
      ? '/.netlify/functions' 
      : 'http://localhost:8888/.netlify/functions';
  }

  // 제품 검색 API 호출 (Netlify Functions 통해)
  async searchProducts(keyword: string, limit: number = 10): Promise<CoupangSearchResponse> {
    try {
      const response = await fetch(`${this.functionsUrl}/coupang-search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword,
          limit
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
      
    } catch (error) {
      console.error('쿠팡 제품 검색 오류:', error);
      
      // 오류 발생 시 더미 데이터 반환
      return this.getDummyProducts(keyword, limit);
    }
  }

  // 더미 제품 데이터 생성 (백업용)
  private getDummyProducts(keyword: string, limit: number): CoupangSearchResponse {
    const products: CoupangProduct[] = [
      {
        productId: '1',
        productName: `${keyword} 관련 제품 1`,
        productPrice: 59000,
        productImage: `https://via.placeholder.com/300x200?text=${encodeURIComponent(keyword)}1`,
        productUrl: `https://www.coupang.com/vp/products/1?vendorItemId=1&src=1036296&spec=10304982`,
        originalPrice: 79000,
        discountRate: 25,
        vendorItemId: '1',
        categoryName: '생활용품',
        rating: 4.5,
        ratingCount: 128
      },
      {
        productId: '2',
        productName: `${keyword} 관련 제품 2`,
        productPrice: 89000,
        productImage: `https://via.placeholder.com/300x200?text=${encodeURIComponent(keyword)}2`,
        productUrl: `https://www.coupang.com/vp/products/2?vendorItemId=2&src=1036296&spec=10304982`,
        originalPrice: 109000,
        discountRate: 18,
        vendorItemId: '2',
        categoryName: '패션',
        rating: 4.2,
        ratingCount: 89
      },
      {
        productId: '3',
        productName: `${keyword} 관련 제품 3`,
        productPrice: 79000,
        productImage: `https://via.placeholder.com/300x200?text=${encodeURIComponent(keyword)}3`,
        productUrl: `https://www.coupang.com/vp/products/3?vendorItemId=3&src=1036296&spec=10304982`,
        originalPrice: 99000,
        discountRate: 20,
        vendorItemId: '3',
        categoryName: 'IT기기',
        rating: 4.7,
        ratingCount: 256
      }
    ];

    return {
      products: products.slice(0, limit),
      totalCount: products.length
    };
  }

  // 파트너스 링크 생성
  generatePartnerLink(productUrl: string): string {
    if (!this.partnerId) {
      console.warn('쿠팡 파트너 ID가 설정되지 않았습니다. 기본 링크를 반환합니다.');
      return productUrl;
    }

    const partnerCode = this.partnerId;
    const encodedUrl = encodeURIComponent(productUrl);
    
    return `https://link.coupang.com/a/${partnerCode}?url=${encodedUrl}`;
  }

  // 검색 링크 생성 (백업용)
  generateSearchLink(keyword: string): string {
    if (!this.partnerId) {
      return `https://www.coupang.com/np/search?q=${encodeURIComponent(keyword)}`;
    }

    const partnerCode = this.partnerId;
    const encodedKeyword = encodeURIComponent(keyword);
    
    return `https://link.coupang.com/a/${partnerCode}?url=https%3A%2F%2Fwww.coupang.com%2Fnp%2Fsearch%3Fq%3D${encodedKeyword}`;
  }
}

export const coupangService = new CoupangPartnerService();
export type { CoupangProduct, CoupangSearchResponse }; 