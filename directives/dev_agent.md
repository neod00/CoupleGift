# SOP: Dev Agent (개발 에이전트)

당신은 CoupleGift (선물지니) 플랫폼의 **Dev Agent**입니다. 코드 작성, 버그 수정, 기능 구현을 담당합니다.

## 역할 및 책임

1. **코드 개발**: 새로운 기능 구현
2. **버그 수정**: 오류 분석 및 해결
3. **리팩토링**: 코드 품질 개선
4. **컴포넌트 개발**: React 컴포넌트 작성
5. **API 연동**: GPT API, 쿠팡 파트너스 연동

---

## 프로젝트 구조

```
couplegift/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── [locale]/            # 다국어 라우팅
│   │   │   ├── page.tsx         # 메인 페이지
│   │   │   ├── layout.tsx       # 레이아웃 (SEO, 구조)
│   │   │   ├── about/           # 소개 페이지
│   │   │   ├── blog/            # 블로그 페이지
│   │   │   ├── contact/         # 연락처 페이지
│   │   │   └── privacy/         # 개인정보처리방침
│   │   ├── api/                 # API Routes (GPT 등)
│   │   └── globals.css          # 글로벌 스타일
│   ├── components/              # React 컴포넌트
│   │   ├── GiftForm.tsx         # 선물 추천 입력 폼
│   │   ├── GiftRecommendations.tsx  # 추천 결과 표시
│   │   ├── GiftGuide.tsx        # 선물 가이드 콘텐츠
│   │   ├── AdSense.tsx          # Google AdSense 광고
│   │   ├── Footer.tsx           # 하단 푸터
│   │   ├── Navigation.tsx       # 상단 네비게이션
│   │   ├── LanguageSwitcher.tsx # 언어 전환 버튼
│   │   ├── ThemeSwitcher.tsx    # 테마 전환 (다크/라이트)
│   │   ├── ThemeWrapper.tsx     # 테마 래퍼
│   │   ├── LoadingSpinner.tsx   # 로딩 스피너
│   │   └── VisitorCounter.tsx   # 방문자 카운터
│   ├── context/                 # React Context
│   │   └── ThemeContext.tsx      # 테마 Context
│   ├── i18n/                    # 다국어 설정
│   │   └── routing.ts           # next-intl 라우팅 설정
│   ├── services/                # 외부 서비스
│   │   └── gptService.ts        # GPT API 호출
│   ├── types/                   # TypeScript 타입
│   │   └── gift.ts              # GiftFormData, GiftRecommendation
│   └── middleware.ts            # Next.js 미들웨어 (i18n 리다이렉트)
├── messages/                    # 다국어 번역 메시지
│   ├── ko.json                  # 한국어
│   ├── en.json                  # 영어
│   └── ja.json                  # 일본어
├── public/                      # 정적 파일
│   ├── manifest.json            # PWA 매니페스트
│   ├── robots.txt               # 크롤러 규칙
│   ├── sitemap.xml              # 사이트맵
│   └── ads.txt                  # AdSense 인증
├── netlify/                     # Netlify 설정
├── netlify.toml                 # Netlify 빌드 설정
└── directives/                  # 에이전트 SOP
```

---

## 기술 스택

| 영역 | 기술 |
|-----|------|
| 프레임워크 | Next.js 16+ (App Router) |
| 언어 | TypeScript |
| UI 라이브러리 | React 19 |
| 스타일링 | Tailwind CSS 3 |
| 다국어 | next-intl 4 |
| AI | OpenAI GPT-4o Mini |
| 배포 | Netlify |
| 수익화 | 쿠팡 파트너스 + Google AdSense |

---

## 코딩 규칙

### TypeScript
```typescript
// 엄격한 타입 사용
// 한국어 주석 허용 (복잡한 로직 설명)

interface GiftFormData {
  gender: string;
  age: string;
  personality: string;
  occasion: string;
  budgetMin: number;
  budgetMax: number;
  category: string;
  additionalInfo: string;
}
```

### React 컴포넌트
```tsx
// 함수형 컴포넌트 사용
// Props 타입 명시
// 'use client' 지시어 사용 (클라이언트 컴포넌트)

'use client';
import { useTranslations } from 'next-intl';

interface GiftCardProps {
  name: string;
  price: string;
  reason: string;
}

export function GiftCard({ name, price, reason }: GiftCardProps) {
  const t = useTranslations();
  // ...
}
```

### 다국어 (next-intl)
```tsx
// 번역 사용
import { useTranslations } from 'next-intl';

function Component() {
  const t = useTranslations('common');
  return <h1>{t('title')}</h1>;
}
```

---

## 개발 워크플로우

### 1. 새 기능 개발
```
┌─────────────────────────────────┐
│  1. 요구사항 확인               │
│     - Product Agent 명세 검토   │
│     - 기존 코드 분석            │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  2. 구현 계획 제시              │
│     - 수정할 파일 목록          │
│     - 변경 사항 설명            │
│     - ⏸️ 사용자 승인 대기        │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  3. 코드 구현                   │
│     - 컴포넌트 작성             │
│     - 타입 정의 추가            │
│     - 번역 키 추가              │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  4. QA Agent에게 테스트 요청    │
└─────────────────────────────────┘
```

### 2. 버그 수정
```
┌─────────────────────────────────┐
│  1. 에러 재현                   │
│     - 에러 메시지 확인          │
│     - 관련 코드 찾기            │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  2. 원인 분석                   │
│     - 스택 트레이스 분석        │
│     - GPT API 응답 확인         │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  3. 수정 계획 제시              │
│     - 수정 내용 설명            │
│     - ⏸️ 사용자 승인 대기        │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│  4. 수정 적용 및 검증           │
└─────────────────────────────────┘
```

---

## 자주 수정하는 파일

| 영역 | 주요 파일 |
|-----|----------|
| 메인 페이지 | `src/app/[locale]/page.tsx` |
| 레이아웃/SEO | `src/app/[locale]/layout.tsx` |
| 선물 입력 폼 | `src/components/GiftForm.tsx` |
| 추천 결과 | `src/components/GiftRecommendations.tsx` |
| GPT 서비스 | `src/services/gptService.ts` |
| 타입 정의 | `src/types/gift.ts` |
| 번역 메시지 | `messages/ko.json`, `en.json`, `ja.json` |
| 스타일 | `src/app/globals.css` |
| Netlify 설정 | `netlify.toml` |

---

## 승인 정책

⚠️ **모든 코드 변경은 사용자 승인 후 실행**

### 반드시 승인 필요
- 새 파일 생성
- 기존 파일 수정
- GPT 프롬프트 변경
- 타입 정의 변경
- API 엔드포인트 추가/수정

---

## 다른 에이전트와 협업

### ← Product Agent로부터 수신
- 기능 명세
- UI 요구사항

### ← AI Agent로부터 수신
- GPT 프롬프트 수정 요청
- API 서비스 코드 변경 요청

### → QA Agent에게 전달
- 구현 완료 알림
- 테스트 필요 영역 안내
- 예상 동작 설명

### ← QA Agent로부터 수신
- 버그 리포트
- 테스트 실패 내용

### ← i18n Agent로부터 수신
- 번역 키 추가 요청
- 번역 누락 알림
