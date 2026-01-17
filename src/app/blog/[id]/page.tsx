import React from 'react';
import Link from 'next/link';
import AdSense from '../../../components/AdSense';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

const blogPosts: { [key: string]: BlogPostData } = {
    'valentine-day-guide': {
        id: 'valentine-day-guide',
        title: '밸런타인데이 완벽 가이드: 연인의 마음을 사로잡는 선물 아이디어',
        content: `
# 밸런타인데이 완벽 가이드

2024년 밸런타인데이가 다가오고 있습니다. 사랑하는 연인에게 특별한 선물을 준비하고 계신가요? 이 가이드에를 통해 연인의 마음을 사로잡을 수 있는 완벽한 선물 아이디어를 찾아보세요.

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

## 🎁 연인을 위한 맞춤 선물 추천받기

밸런타인데이 가이드를 참고했으니, 이제 실제로 연인에게 맞는 완벽한 선물을 추천받아보세요!

<div class="text-center my-8">
  <a href="https://couplegift.netlify.app/" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
    💕 연인 맞춤 선물 추천받기
  </a>
  <p class="text-white/70 text-sm mt-2">AI가 연인의 취향과 상황을 분석해서 완벽한 밸런타인데이 선물을 추천해드려요!</p>
</div>
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

## 🎁 예산에 맞는 맞춤 선물 추천받기

예산별 가이드를 참고했으니, 이제 실제로 예산에 맞는 완벽한 선물을 추천받아보세요!

<div class="text-center my-8">
  <a href="https://couplegift.netlify.app/" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
    💰 예산 맞춤 선물 추천받기
  </a>
  <p class="text-white/70 text-sm mt-2">AI가 예산과 취향을 모두 고려해서 완벽한 선물을 추천해드려요!</p>
</div>
      `,
        date: '2024-01-10',
        category: '선물 팁',
        readTime: '7분',
        image: '💰',
        tags: ['예산별선물', '선물팁', '저렴한선물', '센스있는선물']
    },
    'mbti-gift-guide': {
        id: 'mbti-gift-guide',
        title: 'MBTI별 맞춤 선물 가이드: 성격 유형에 따른 완벽한 선물 찾기',
        content: `
# MBTI별 맞춤 선물 가이드

MBTI 성격 유형을 알고 있다면, 받는 분의 성향에 맞는 완벽한 선물을 고를 수 있습니다. 16가지 성격 유형별로 어울리는 선물을 추천해드립니다.

## 🧠 분석형 성향 (NT)

### INTJ - 건축가
**특징**: 전략적 사고, 독립적, 지적 호기심
**추천 선물**:
- **도서**: 철학, 과학, 전략 관련 서적
- **보드게임**: 체스, 고급 보드게임
- **전자기기**: 고성능 노트북, 태블릿
- **취미용품**: 모형 제작 키트, 퍼즐

### INTP - 논리술사
**특징**: 논리적 분석, 창의적 문제해결
**추천 선물**:
- **과학 키트**: 화학실험, 로봇 조립
- **프로그래밍 도구**: 코딩 학습 키트
- **추상적 예술품**: 현대미술, 수학적 디자인
- **복잡한 퍼즐**: 루빅스큐브, 메타퍼즐

### ENTJ - 통솔자
**특징**: 리더십, 효율성, 목표 지향적
**추천 선물**:
- **비즈니스 도서**: 경영, 리더십 서적
- **고급 액세서리**: 명품 시계, 가죽 지갑
- **조직 도구**: 고급 플래너, 디지털 노트
- **경험 선물**: 고급 레스토랑, 컨퍼런스 참가

### ENTP - 변론가
**특징**: 창의적, 적응력, 토론 즐김
**추천 선물**:
- **창의적 도구**: 디자인 소프트웨어, 카메라
- **사회적 활동**: 네트워킹 이벤트, 워크샵
- **독특한 아이템**: 아트북, 컬렉션 아이템
- **게임**: 전략 게임, 퀴즈 게임

## 💝 외교형 성향 (NF)

### INFJ - 옹호자
**특징**: 이상주의, 공감능력, 창의성
**추천 선물**:
- **영감을 주는 도서**: 시집, 철학서, 자기계발서
- **예술품**: 수채화, 캘리그래피 도구
- **정원 도구**: 실내 정원 키트, 화분
- **감성적 아이템**: 향초, 아로마 오일

### INFP - 중재자
**특징**: 창의적, 이상주의, 개인적 가치
**추천 선물**:
- **창작 도구**: 일기장, 아트북, 음악 도구
- **자연 관련**: 식물, 자연 사진집
- **감성적 선물**: 개인 맞춤형 시, 수제품
- **영화/음악**: 아트하우스 영화, 인디 음악

### ENFJ - 선도자
**특징**: 카리스마, 공감능력, 영감을 주는 리더
**추천 선물**:
- **리더십 도서**: 동기부여, 교육 관련 서적
- **고급 액세서리**: 우아한 보석, 스카프
- **경험 선물**: 요리 클래스, 여행
- **개인 맞춤형**: 이니셜 각인, 사진 앨범

### ENFP - 활동가
**특징**: 열정적, 창의적, 사람들과의 교류
**추천 선물**:
- **모험적 경험**: 액티비티, 여행 상품권
- **창작 도구**: 카메라, 악기, 아트 키트
- **사회적 활동**: 파티 플래닝, 이벤트 참가
- **독특한 아이템**: 빈티지, 수제품

## 🛡️ 수호자 성향 (SJ)

### ISTJ - 현실주의자
**특징**: 신뢰성, 실용성, 전통 중시
**추천 선물**:
- **실용적 도구**: 고급 도구 세트, 정리함
- **전통적 아이템**: 고급 차 세트, 전통 공예품
- **조직 도구**: 파일링 시스템, 디지털 플래너
- **품질 좋은 생활용품**: 고급 주방용품

### ISFJ - 수호자
**특징**: 헌신적, 따뜻함, 실용성
**추천 선물**:
- **가족 관련**: 가족 사진 앨범, 요리책
- **편안함**: 고급 이불, 아로마 테라피
- **실용적 아이템**: 주방용품, 정리 도구
- **감사 표현**: 고급 초콜릿, 꽃

### ESTJ - 경영자
**특징**: 효율성, 조직력, 전통 중시
**추천 선물**:
- **비즈니스 도구**: 고급 명함함, 포트폴리오
- **품질 좋은 액세서리**: 명품 시계, 가죽 제품
- **조직 도구**: 디지털 플래너, 파일링 시스템
- **전통적 선물**: 고급 와인, 차 세트

### ESFJ - 집정관
**특징**: 사교성, 책임감, 전통 중시
**추천 선물**:
- **가족/친구 관련**: 커플링, 가족 여행
- **사회적 활동**: 파티 용품, 게임
- **고급 액세서리**: 보석, 향수
- **전통적 선물**: 꽃, 초콜릿, 와인

## 🎯 탐험가 성향 (SP)

### ISTP - 만능재주꾼
**특징**: 실용적, 독립적, 문제해결 능력
**추천 선물**:
- **도구**: 고급 도구 세트, DIY 키트
- **스포츠**: 스포츠 용품, 액티비티
- **기술적 아이템**: 전자기기, 자동차 관련
- **실용적 아이템**: 캠핑 용품, 정리 도구

### ISFP - 모험가
**특징**: 예술적, 감성적, 자연 사랑
**추천 선물**:
- **예술 도구**: 아트 키트, 악기
- **자연 관련**: 식물, 자연 사진집
- **감성적 아이템**: 향초, 아로마 오일
- **창작 도구**: 일기장, 카메라

### ESTP - 사업가
**특징**: 활동적, 실용적, 모험을 즐김
**추천 선물**:
- **액티비티**: 스포츠, 레저 활동
- **실용적 도구**: 고급 도구, 전자기기
- **모험적 경험**: 여행, 익스트림 스포츠
- **사회적 활동**: 파티, 네트워킹

### ESFP - 연예인
**특징**: 사교적, 열정적, 즐거움 추구
**추천 선물**:
- **엔터테인먼트**: 게임, 파티 용품
- **패션**: 트렌디한 의류, 액세서리
- **사회적 활동**: 이벤트 참가, 여행
- **즐거운 경험**: 놀이공원, 콘서트

## 💡 MBTI별 선물 선택 팁

### 1. 성향 파악하기
- **사고형(T)**: 논리적, 실용적인 선물
- **감정형(F)**: 감성적, 의미있는 선물
- **감각형(S)**: 구체적, 실용적인 선물
- **직관형(N)**: 추상적, 창의적인 선물

### 2. 에너지 방향 고려
- **내향형(I)**: 개인적, 조용한 선물
- **외향형(E)**: 사회적, 활동적인 선물

### 3. 선물 전달 방법
- **판단형(J)**: 계획적, 정리된 방식
- **인식형(P)**: 유연적, 창의적인 방식

MBTI는 참고사항일 뿐, 가장 중요하다는 것은 받는 분을 생각하는 마음입니다. 이 가이드에를 참고하여 더욱 개인화된 선물을 선택해보세요!

## 🎁 지금 바로 선물 추천받기

MBTI 성향을 파악했으니, 이제 실제로 맞춤형 선물을 추천받아보세요!

<div class="text-center my-8">
  <a href="https://couplegift.netlify.app/" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
    🎯 MBTI 맞춤 선물 추천받기
  </a>
  <p class="text-white/70 text-sm mt-2">AI가 당신의 MBTI와 취향을 분석해서 완벽한 선물을 추천해드려요!</p>
</div>
      `,
        date: '2025-01-05',
        category: '선물 팁',
        readTime: '10분',
        image: '🧠',
        tags: ['MBTI', '성격유형', '맞춤선물', '성향별선물']
    },
    'parents-anniversary-gift': {
        id: 'parents-anniversary-gift',
        title: '부모님 결혼기념일 선물: 효도하는 자녀를 위한 선물 아이디어',
        content: `
# 👨‍👩‍👧‍👦 부모님 결혼기념일 선물 가이드

부모님의 결혼기념일은 가족 모두에게 특별한 날입니다. 효도하는 자녀로서 부모님의 사랑과 헌신에 감사하며 기쁨을 드릴 수 있는 선물을 골라보세요.

## 💊 부모님 건강 지킴이 선물

부모님께 가장 중요한 것은 역시 건강입니다.

### 추천 건강 관련 선물
- **고급 홍삼 세트**: 면역력 증진과 피로 회복에 탁월
- **종합 비타민/영양제**: 연령대에 맞는 맞춤 영양 설계
- **마사지기**: 어깨, 목, 다리 등 피로를 풀어주는 안마기
- **침구 세트**: 편안한 숙면을 돕는 기능성 베개와 이불

## 🧤 패션 및 액세서리

부모님께 젊음과 멋을 선물해 보세요.

### 스타일링 아이템
- **실크 스카프/넥타이**: 고급스러운 외출을 위한 필수 아이템
- **품격 있는 지갑/가방**: 가볍고 실용적인 가죽 제품
- **커플 시계**: 두 분이 함께 착용하여 의미를 더하는 선물
- **아웃도어 의류**: 산행이나 산책 시 유용한 기능성 의류

## 🍽️ 특별한 경험 선물

물건보다 더 오랜 기억에 남는 추억을 선물해 보세요.

### 행복한 추억 만들기
- **호텔 뷔페/식사권**: 분위기 좋은 곳에서의 오붓한 식사
- **크루즈/여행 패키지**: 일상에서 벗어난 힐링의 시간
- **리마인드 웨딩 촬영**: 다시 보는 부모님의 가장 아름다운 모습
- **공연/뮤지컬 티켓**: 문화생활을 즐길 수 있는 특별한 데이트

## 💰 실용적인 선물

부모님이 가장 선호하시는 실용적인 선택입니다.

### 센스 있는 선택
- **정성스러운 현금/용돈 박스**: 예쁜 꽃과 함께 전달하는 진심
- **가전제품 교체**: 오래된 냉장고, 세탁기, 로봇청소기 등
- **백화점 상품권**: 필요한 물건을 직접 고르실 수 있도록 배려

## 💡 부모님 선물 선택 팁

1. **평소 필요로 하시던 것 기억하기**: 대화 중에 무심코 말씀하셨던 필요 사항을 챙겨보세요.
2. **함께 보내는 시간의 가치**: 선물도 좋지만 직접 쓴 손편지와 함께 가족이 모이는 자리를 마련해 보세요.
3. **취향 존중**: 내 눈에 예쁜 것보다 부모님의 평소 스타일과 선호도를 우선시하세요.

부모님께 드릴 수 있는 가장 큰 선물은 자녀의 사랑과 관심입니다. 이번 결혼기념일에는 따뜻한 마음을 담아 부모님께 감동을 전해 보세요.

<div class="text-center my-8">
  <a href="https://couplegift.netlify.app/" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
    🎁 부모님 맞춤 선물 추천받기
  </a>
  <p class="text-white/70 text-sm mt-2">AI가 부모님의 연령대와 취향을 분석해서 최적의 효도 선물을 추천해드려요!</p>
</div>
        `,
        date: '2023-12-28',
        category: '가족',
        readTime: '6분',
        image: '👨‍👩‍👧‍👦',
        tags: ['부모님선물', '결혼기념일', '효도선물', '가족행사']
    },
    'christmas-gift-trends': {
        id: 'christmas-gift-trends',
        title: '2024 크리스마스 선물 트렌드: 올해 가장 인기있는 선물은?',
        content: `
# 🎄 2024 크리스마스 선물 트렌드 리포트

벌써 크리스마스 시즌이 다가오고 있습니다. 올해는 어떤 선물들이 사랑받을지, 2024년 최신 트렌드를 정리해 드립니다.

## 🏠 홈 라운지 & 인테리어

집에서 보내는 시간을 더욱 특별하게 만들어주는 아이템들이 강세입니다.

### 인기 아이템
- **스마트 무드 조명**: 앱으로 조절하는 다양한 컬러의 감성 조명
- **미니 빔 프로젝터**: 집안을 나만의 전용 영화관으로
- **인테리어 오브제**: 유니크한 디자인의 화병이나 탁상시계
- **프리미엄 디퓨저/캔들**: 크리스마스 분위기를 더해주는 숲속 향기

## 💻 테크 & 가제트

실용적이고 편리한 생활을 돕는 테크 선물은 언제나 인기 순위 상위권입니다.

### 트렌디한 가젯
- **오픈형 무선 이어폰**: 귀가 편안한 최신형 웨어러블 기기
- **고속 무선 충전 거치대**: 데스크 테리어를 완성하는 멀티 충전기
- **휴대용 게임기**: 닌텐도 스위치 등 소소한 즐거움을 주는 게임기
- **스마트 태그**: 소중한 물품의 위치를 알려주는 실용 템

## 🎀 뷰티 & 셀프케어

자기 관리를 중시하는 유저들을 위한 뷰티 선물 아이디어입니다.

### 뷰티 트렌드
- **LED 마스크/피부 관리기**: 집에서도 전문적인 피부 관리를
- **비건 화장품 세트**: 환경과 피부를 모두 생각하는 착한 선물
- **고급 헤어 케어 기기**: 찰랑이는 머릿결을 위한 고성능 드라이기/스타일러
- **바디 케어 기트**: 겨울철 건조함을 해결해줄 고보습 세트

## 🎁 기프트 카드 & 구독 서비스

취향을 정확히 모를 때 실패 없는 선택입니다.

### 추천 서비스
- **OTT 평생 구독권**: 영화와 드라마를 무제한으로 즐기는 자유
- **전자책/오디오북 구독**: 지적 호기심을 채워주는 지식 배달
- **백화점 모바일 상품권**: 원하는 물건을 언제 어디서나 쇼핑
- **원데이 클래스 이용권**: 나만의 취미를 발견하는 경험

## 💡 크리스마스 선물 준비 팁

1. **미리 준비하기**: 시즌 직전에는 품절될 가능성이 높으니 최소 2주 전에는 결정을 끝내세요.
2. **정성스러운 카드 추가**: 따뜻한 메시지가 담긴 카드는 감동을 두 배로 만듭니다.
3. **깜짝 이벤트 기획**: 아주 작은 서프라이즈라도 기억에 오래 남는 법입니다.

사랑하는 사람들과 함께 따뜻하고 행복한 크리스마스 보내시길 바랍니다!

<div class="text-center my-8">
  <a href="https://couplegift.netlify.app/" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
    🎅 크리스마스 맞춤 선물 추천받기
  </a>
  <p class="text-white/70 text-sm mt-2">AI가 올해 가장 핫한 아이템들 중에서 선물을 완벽하게 골라드려요!</p>
</div>
        `,
        date: '2023-12-20',
        category: '기념일',
        readTime: '8분',
        image: '🎄',
        tags: ['크리스마스', '트렌드', '연말선물', '홈파티']
    },
    'diy-gift-ideas': {
        id: 'diy-gift-ideas',
        title: 'DIY 선물 아이디어: 직접 만드는 특별한 선물 10가지',
        content: `
# 🎨 DIY 선물 아이디어: 정성이 듬뿍 담긴 특별한 제안

세상에 단 하나뿐인 DIY 선물은 어떤 비싼 선물보다도 큰 감동을 줍니다. 초보자도 쉽게 따라 할 수 있는 DIY 선물 아이디어 10가지를 소개합니다.

## 🧵 정통 수공예 선물

직접 한 땀 한 땀 만든 결과물의 가치는 비교할 수 없습니다.

- **커스텀 향수**: 받는 분의 이미지를 떠올리며 조향한 향기
- **가죽 카드 지갑**: 직접 바느질해서 만드는 고급스러운 선물
- **비즈 액세서리**: 세상에 하나뿐인 유니크한 팔찌와 목걸이
- **자수 파우치**: 정성스러운 도안을 수놓은 실용적인 선물

## 🧶 패브릭 & 뜨개질

포근한 마음까지 함께 전달되는 선물입니다.

- **뜨개질 머플러**: 올겨울 따뜻함을 책임질 정성의 끝판왕
- **티코스터(컵받침)**: 소소하지만 식탁의 분위기를 바꿔주는 소품
- **수제 양초/캔들**: 직접 고른 향료와 장식으로 만드는 감성 템

## 🖼️ 사진 & 기록물

함께한 시간의 가치를 기록으로 남겨보세요.

- **커플 포토북**: 추억의 사진들을 모아 스토리로 엮은 선물
- **입체 팝업 카드**: 서프라이즈를 더해주는 정성 가득한 카드
- **모바일 플레이리스트**: 우리만의 추억이 담긴 곡들을 모은 선물

## 💡 DIY 선물 성공을 위한 팁

1. **시간을 넉넉히 잡기**: 처음 도전하는 일은 생각보다 오래 걸릴 수 있으니 미리 시작하세요.
2. **도구와 재료 아끼지 않기**: 기초 재료가 좋으면 초보자의 솜씨도 훌륭해 보입니다.
3. **포장까지 DIY로**: 선물 상자나 리본도 직접 선택해 보세요.

직접 만든 선물로 여러분의 따뜻한 마음을 소중한 분께 전달해 보세요.

<div class="text-center my-8">
  <a href="https://couplegift.netlify.app/" target="_blank" rel="noopener noreferrer" class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
    🎨 DIY 재료 & 관련 선물 추천받기
  </a>
  <p class="text-white/70 text-sm mt-2">정성이 가득 담긴 선물을 만들기 위한 재료나 관련 아이템을 AI가 추천해드려요!</p>
</div>
        `,
        date: '2023-12-15',
        category: 'DIY',
        readTime: '12분',
        image: '🎨',
        tags: ['DIY', '수공예', '정성', '세상에하나뿐인']
    }
};

export async function generateStaticParams() {
    return Object.keys(blogPosts).map((id) => ({
        id,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const post = blogPosts[id];
    if (!post) return {};

    return {
        title: `${post.title} - 선물지니 블로그`,
        description: post.content.substring(0, 150).replace(/[#\*]/g, ''),
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 150).replace(/[#\*]/g, ''),
            type: 'article',
            publishedTime: post.date,
        }
    };
}

export default async function BlogPost({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = blogPosts[id];

    if (!post) {
        notFound();
    }

    const renderContent = (content: string) => {
        return content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
                return <h1 key={index} className="text-3xl font-bold text-[var(--text-main)] mt-8 mb-4">{line.substring(2)}</h1>;
            } else if (line.startsWith('## ')) {
                return <h2 key={index} className="text-2xl font-semibold text-[var(--text-main)] mt-6 mb-3">{line.substring(3)}</h2>;
            } else if (line.startsWith('### ')) {
                return <h3 key={index} className="text-xl font-semibold text-[var(--text-main)] mt-4 mb-2">{line.substring(4)}</h3>;
            } else if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                if (match) {
                    return <li key={index} className="mb-2 list-none"><strong className="text-[var(--text-main)]">{match[1]}</strong>: {match[2]}</li>;
                }
                return <li key={index} className="mb-1 list-none ml-4">{line.substring(2)}</li>;
            } else if (line.startsWith('- ')) {
                return <li key={index} className="mb-1 list-none ml-4">• {line.substring(2)}</li>;
            } else if (line.trim() === '') {
                return <div key={index} className="h-4" />;
            } else if (line.includes('<div') || line.includes('<a')) {
                // Simple HTML elements in content
                return <div key={index} dangerouslySetInnerHTML={{ __html: line }} />;
            } else {
                return <p key={index} className="mb-4 text-[var(--text-main-90)] leading-relaxed">{line}</p>;
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="mb-6 fade-in">
                <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--text-main-70)] hover:text-[var(--text-main)] transition-colors">
                    ← 블로그 목록으로 돌아가기
                </Link>
            </div>

            <article className="glass-card mb-8 fade-in p-6 md:p-10">
                <header className="text-center mb-10 border-b border-white/10 pb-10">
                    <span className="text-8xl mb-6 block">{post.image}</span>
                    <div className="flex items-center justify-center gap-4 mb-4 text-sm text-[var(--text-main-70)]">
                        <span className="bg-white/20 px-3 py-1 rounded-full text-[var(--text-main)]">{post.category}</span>
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.readTime} 읽기</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-main)] mb-4 leading-tight">
                        {post.title}
                    </h1>
                </header>

                <div className="prose prose-invert max-w-none">
                    {renderContent(post.content)}
                </div>

                <div className="mt-12 pt-8 border-t border-white/10">
                    <h4 className="text-lg font-semibold text-[var(--text-main)] mb-4">태그</h4>
                    <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="bg-white/20 text-[var(--text-main-90)] px-4 py-1.5 rounded-full text-sm hover:bg-white/30 hover:text-[var(--text-main)] transition-all cursor-pointer font-medium"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </article>

            <div className="mt-8">
                <AdSense adFormat="banner" className="mb-6" />
            </div>
        </div>
    );
}
