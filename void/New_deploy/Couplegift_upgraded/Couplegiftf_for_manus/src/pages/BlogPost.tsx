import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AdSense from '../components/AdSense.tsx';

interface BlogPostData {
  id: string;
  title: string;
  content: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  tags: string[];
}

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // 실제 구현에서는 API나 데이터베이스에서 가져올 데이터
  const blogPosts: { [key: string]: BlogPostData } = {
    'valentine-day-guide': {
      id: 'valentine-day-guide',
      title: '밸런타인데이 완벽 가이드: 연인의 마음을 사로잡는 선물 아이디어',
      content: `
# 밸런타인데이 완벽 가이드

2024년 밸런타인데이가 다가오고 있습니다. 사랑하는 연인에게 특별한 선물을 준비하고 계신가요? 이 가이드를 통해 연인의 마음을 사로잡을 수 있는 완벽한 선물 아이디어를 찾아보세요.

## 🍫 클래식한 초콜릿 선물

밸런타인데이의 대표적인 선물인 초콜릿은 여전히 많은 사랑을 받고 있습니다.

### 추천 초콜릿 브랜드
- **고디바(Godiva)**: 프리미엄 벨기에 초콜릿
- **페레로 로쉐**: 헤이즐넛이 들어간 고급 초콜릿
- **린트(Lindt)**: 스위스 전통 초콜릿
- **수제 초콜릿**: 개인 맞춤형 메시지 각인 가능

## 💍 액세서리 선물

### 커플링
- 심플한 실버링
- 이니셜 각인 반지
- 탄생석이 들어간 반지

### 목걸이
- 하트 펜던트
- 이니셜 목걸이
- 커플 목걸이 세트

## 🌹 로맨틱한 꽃 선물

### 장미 꽃다발
- 빨간 장미: 열정적인 사랑
- 분홍 장미: 감사와 존경
- 흰 장미: 순수한 사랑

### 특별한 꽃 선물
- 프리저브드 플라워: 오래 보관 가능
- 꽃박스: 고급스러운 포장
- 꽃과 선물 세트: 초콜릿이나 향수와 함께

## 💝 개인 맞춤형 선물

### 사진 선물
- 커플 포토북
- 액자에 담은 추억 사진
- 폴라로이드 앨범

### 각인 선물
- 이니셜 각인 지갑
- 커플 텀블러 세트
- 맞춤형 향수

## 🎭 경험 선물

### 데이트 코스
- 고급 레스토랑 예약
- 뮤지컬이나 콘서트 티켓
- 커플 스파 이용권

### 여행 선물
- 주말 여행 패키지
- 호텔 스테이 상품권
- 온천 여행

## 💡 선물 선택 팁

1. **연인의 취향 파악하기**
   - 평소 좋아하는 스타일
   - 관심사와 취미
   - 필요로 하는 것들

2. **예산 설정하기**
   - 무리하지 않는 선에서
   - 마음이 중요하다는 것을 기억
   - 가격보다는 정성

3. **포장과 메시지**
   - 예쁜 포장지와 리본
   - 진심이 담긴 편지
   - 서프라이즈 요소 추가

## 🎁 예산별 추천 선물

### 3만원 이하
- 초콜릿 세트
- 향초
- 커플 양말
- 작은 꽃다발

### 3-10만원
- 향수
- 액세서리
- 커플 시계
- 고급 초콜릿 세트

### 10만원 이상
- 명품 액세서리
- 여행 상품권
- 고급 레스토랑 코스
- 커플 스파 이용권

밸런타인데이는 사랑을 표현하는 특별한 날입니다. 가장 중요한 것은 연인을 생각하는 마음입니다. 어떤 선물을 선택하든 진심을 담아 전달한다면 분명 특별한 추억이 될 것입니다.
      `,
      date: '2024-01-15',
      category: '기념일',
      readTime: '5분',
      image: '💝',
      tags: ['밸런타인데이', '연인선물', '초콜릿', '커플링', '로맨틱']
    },
    'budget-gift-guide': {
      id: 'budget-gift-guide',
      title: '예산별 선물 가이드: 1만원부터 10만원까지 센스있는 선물 추천',
      content: `
# 예산별 선물 가이드

선물을 고를 때 가장 고민되는 것 중 하나가 바로 예산입니다. 제한된 예산으로도 센스있고 의미있는 선물을 고를 수 있는 방법을 알아보겠습니다.

## 💰 1만원 이하 선물

작은 예산으로도 마음을 전할 수 있는 선물들입니다.

### 실용적인 선물
- **예쁜 양말 세트**: 캐릭터나 재미있는 패턴
- **향초**: 집에서 즐길 수 있는 아로마
- **텀블러**: 개인 맞춤형 각인 가능
- **핸드크림 세트**: 다양한 향의 미니 사이즈

### 간식 선물
- **수제 쿠키**: 예쁜 포장과 함께
- **마카롱 세트**: 컬러풀한 디저트
- **차 선물세트**: 허브티나 과일차
- **초콜릿**: 고급스러운 포장의 소용량

## 💳 1-3만원 선물

조금 더 특별한 선물을 원할 때 추천하는 가격대입니다.

### 뷰티 아이템
- **립밤 세트**: 다양한 향과 색상
- **핸드크림 + 바디로션 세트**
- **마스크팩 세트**: 프리미엄 브랜드
- **네일 케어 세트**

### 생활용품
- **예쁜 머그컵**: 개성있는 디자인
- **블루투스 스피커**: 미니 사이즈
- **책갈피**: 금속 재질의 고급스러운 디자인
- **노트 세트**: 다이어리나 플래너

## 💎 3-5만원 선물

의미있는 선물을 주고 싶을 때 적당한 가격대입니다.

### 패션 아이템
- **스카프**: 실크나 캐시미어 소재
- **지갑**: 심플한 디자인의 가죽 지갑
- **시계**: 미니멀한 디자인
- **가방**: 작은 크로스백이나 파우치

### 전자기기
- **무선 이어폰**: 기본형 모델
- **보조배터리**: 예쁜 디자인
- **스마트워치 밴드**: 개성있는 색상
- **폰케이스**: 맞춤형 제작

## 💍 5-10만원 선물

조금 더 고급스러운 선물을 원할 때의 가격대입니다.

### 액세서리
- **은 액세서리**: 목걸이나 귀걸이
- **시계**: 브랜드 제품
- **선글라스**: 유명 브랜드
- **벨트**: 가죽 소재의 고급 제품

### 경험 선물
- **스파 이용권**: 마사지나 피부관리
- **레스토랑 상품권**: 분위기 좋은 곳
- **원데이 클래스**: 요리나 공예 체험
- **영화관 상품권**: 프리미엄 좌석

## 🎁 10만원 이상 선물

특별한 기념일이나 중요한 사람에게 주는 선물입니다.

### 명품 아이템
- **브랜드 지갑**: 코치, 마이클코어스 등
- **향수**: 디올, 샤넬 등 명품 브랜드
- **액세서리**: 티파니, 판도라 등
- **의류**: 브랜드 아우터나 니트

### 전자제품
- **태블릿**: 아이패드나 갤럭시탭
- **스마트워치**: 애플워치나 갤럭시워치
- **카메라**: 인스턴트 카메라나 액션캠
- **게임기**: 닌텐도 스위치 등

## 💡 예산별 선물 선택 팁

### 1. 관계에 맞는 예산 설정
- **가족**: 3-10만원
- **연인**: 5-20만원
- **친구**: 1-5만원
- **동료**: 1-3만원

### 2. 받는 분의 성향 고려
- **실용적인 분**: 생활용품이나 전자기기
- **감성적인 분**: 꽃이나 향초, 액세서리
- **활동적인 분**: 스포츠용품이나 경험 선물

### 3. 포장의 중요성
- 예산이 적어도 예쁜 포장으로 고급스럽게
- 리본이나 스티커로 포인트 주기
- 손편지 함께 첨부하기

예산이 적다고 해서 좋은 선물을 줄 수 없는 것은 아닙니다. 받는 분을 생각하는 마음과 센스가 더 중요합니다. 이 가이드를 참고하여 예산에 맞는 완벽한 선물을 찾아보세요!
      `,
      date: '2024-01-10',
      category: '선물 팁',
      readTime: '7분',
      image: '💰',
      tags: ['예산별선물', '선물팁', '저렴한선물', '센스있는선물']
    }
  };

  const post = id ? blogPosts[id] : null;

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="glass-card">
          <h1 className="text-3xl font-bold text-white mb-4">
            😅 포스트를 찾을 수 없습니다
          </h1>
          <p className="text-white/80 mb-6">
            요청하신 블로그 포스트가 존재하지 않습니다.
          </p>
          <Link to="/blog" className="btn-primary">
            블로그 목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* 뒤로가기 버튼 */}
      <div className="mb-6 fade-in">
        <Link 
          to="/blog" 
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          ← 블로그 목록으로 돌아가기
        </Link>
      </div>

      {/* 포스트 헤더 */}
      <article className="glass-card mb-8 fade-in">
        <div className="text-center mb-8">
          <span className="text-8xl mb-4 block">{post.image}</span>
          <div className="flex items-center justify-center gap-4 mb-4 text-sm text-white/60">
            <span className="bg-white/10 px-3 py-1 rounded-full">{post.category}</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime} 읽기</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
        </div>

        {/* 포스트 내용 */}
        <div className="prose prose-invert max-w-none">
          <div 
            className="text-white/90 leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: post.content
                .split('\n')
                .map(line => {
                  if (line.startsWith('# ')) {
                    return `<h1 class="text-3xl font-bold text-white mt-8 mb-4">${line.substring(2)}</h1>`;
                  } else if (line.startsWith('## ')) {
                    return `<h2 class="text-2xl font-semibold text-white mt-6 mb-3">${line.substring(3)}</h2>`;
                  } else if (line.startsWith('### ')) {
                    return `<h3 class="text-xl font-semibold text-white mt-4 mb-2">${line.substring(4)}</h3>`;
                  } else if (line.startsWith('- **')) {
                    const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                    if (match) {
                      return `<li class="mb-2"><strong class="text-white">${match[1]}</strong>: ${match[2]}</li>`;
                    }
                    return `<li class="mb-1">${line.substring(2)}</li>`;
                  } else if (line.startsWith('- ')) {
                    return `<li class="mb-1">${line.substring(2)}</li>`;
                  } else if (line.trim() === '') {
                    return '<br/>';
                  } else {
                    return `<p class="mb-4">${line}</p>`;
                  }
                })
                .join('')
            }}
          />
        </div>

        {/* 태그 */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <h4 className="text-lg font-semibold text-white mb-3">태그</h4>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-white/10 text-white/80 px-3 py-1 rounded-full text-sm hover:bg-white/20 hover:text-white transition-all cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* 관련 포스트 */}
      <div className="glass-card mb-8 fade-in">
        <h3 className="text-2xl font-semibold text-white mb-6 text-center">
          📚 관련 포스트
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(blogPosts)
            .filter(p => p.id !== post.id)
            .slice(0, 2)
            .map((relatedPost) => (
              <Link
                key={relatedPost.id}
                to={`/blog/${relatedPost.id}`}
                className="block bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{relatedPost.image}</span>
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-1 line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <div className="text-sm text-white/60">
                      {relatedPost.category} • {relatedPost.readTime}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>

      {/* AdSense 광고 */}
      <div className="mt-8">
        <AdSense 
          adFormat="banner"
          className="mb-6"
        />
      </div>
    </div>
  );
};

export default BlogPost;

