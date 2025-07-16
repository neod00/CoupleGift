const crypto = require('crypto');

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // POST 요청만 허용
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { keyword, limit = 10 } = JSON.parse(event.body);
    
    if (!keyword) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Keyword is required' })
      };
    }

    // 환경 변수에서 쿠팡 API 정보 가져오기
    const accessKey = process.env.COUPANG_ACCESS_KEY;
    const secretKey = process.env.COUPANG_SECRET_KEY;
    const partnerId = process.env.COUPANG_PARTNER_ID;

    if (!accessKey || !secretKey || !partnerId) {
      console.log('쿠팡 API 키가 설정되지 않았습니다. 더미 데이터를 반환합니다.');
      
      // 더미 데이터 반환
      const dummyProducts = [
        {
          productId: '1',
          productName: `${keyword} 관련 상품 1`,
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
          productName: `${keyword} 관련 상품 2`,
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
          productName: `${keyword} 관련 상품 3`,
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
        statusCode: 200,
        headers,
        body: JSON.stringify({
          products: dummyProducts.slice(0, limit),
          totalCount: dummyProducts.length
        })
      };
    }

    // 실제 쿠팡 API 호출
    const result = await searchCoupangProducts(keyword, limit, accessKey, secretKey, partnerId);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error('쿠팡 API 호출 오류:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '쿠팡 제품 검색 중 오류가 발생했습니다.',
        details: error.message
      })
    };
  }
};

// 쿠팡 파트너스 API 호출 함수
async function searchCoupangProducts(keyword, limit, accessKey, secretKey, partnerId) {
  const baseUrl = 'https://api-gateway.coupang.com';
  const path = '/v2/providers/affiliate_open_api/apis/openapi/products/search';
  
  const params = new URLSearchParams({
    keyword: keyword,
    limit: limit.toString(),
    categoryId: '', // 전체 카테고리
    sort: 'scoreDesc', // 인기순
    minPrice: '0',
    maxPrice: '1000000'
  });

  const fullPath = `${path}?${params.toString()}`;
  
  // HMAC 서명 생성
  const datetime = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const message = `${datetime.slice(0, 8)}T${datetime.slice(8)}GET${fullPath}${accessKey}`;
  const signature = crypto.createHmac('sha256', secretKey).update(message).digest('hex');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`
  };

  const response = await fetch(`${baseUrl}${fullPath}`, {
    method: 'GET',
    headers: headers
  });

  if (!response.ok) {
    throw new Error(`쿠팡 API 오류: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // 응답 데이터 정규화
  const products = data.data?.productData?.map(product => ({
    productId: product.productId,
    productName: product.productName,
    productPrice: product.productPrice,
    productImage: product.productImage,
    productUrl: product.productUrl,
    originalPrice: product.originalPrice,
    discountRate: product.discountRate,
    vendorItemId: product.vendorItemId,
    categoryName: product.categoryName,
    rating: product.rating || 0,
    ratingCount: product.ratingCount || 0
  })) || [];

  return {
    products,
    totalCount: data.data?.totalCount || 0
  };
} 