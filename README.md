# 💝 커플 기념일 선물 추천기 (CoupleGift)

연인과의 소중한 기념일, 어떤 선물을 줄지 고민될 때?  
GPT가 당신의 입력을 바탕으로 딱 맞는 선물을 추천해드립니다!  
지금 바로 나만의 커플 선물 추천을 받아보세요 🎁

## 🚀 배포 주소

👉 https://couplegift.netlify.app

## 🛠️ 기술 스택

* **Frontend**: React + TypeScript + Tailwind CSS
* **AI 모델**: OpenAI GPT-4o Mini API
* **Deployment**: Netlify (Functions + Static Site)
* **수익화 모델**: 쿠팡 파트너스 제휴 링크

## 🎯 주요 기능

* **🎁 맞춤형 추천**: 성별, 연령, 성격(MBTI), 기념일 종류, 예산 범위를 입력하면 AI가 선물 추천
* **🔗 쿠팡 연동**: 추천 결과에 쿠팡 제휴 링크 자동 삽입
* **🔄 재추천**: 마음에 들지 않으면 다시 추천받기 기능
* **📱 반응형 UI**: 모바일/PC 모두 완벽 대응
* **⚡ 빠른 로딩**: 3초 이내 추천 결과 제공
* **🎨 아름다운 UI**: 현대적이고 직관적인 사용자 인터페이스
* **🛡️ 안정성**: API 실패 시 자동으로 더미 데이터 제공

## 🧠 사용법

1. **정보 입력**: 선물 받을 대상의 정보를 입력하세요  
   * 성별, 나이, 성격/취향  
   * 기념일 종류, 예산 범위  
   * 선호 카테고리, 추가 정보
2. **AI 추천**: [선물 추천받기] 버튼을 클릭하세요
3. **결과 확인**: 3-4개의 맞춤형 선물 추천을 확인하세요
4. **구매하기**: 원하는 선물을 선택해 쿠팡에서 구매하세요

## 🔐 환경 변수 설정

> ⚠️ 본 프로젝트는 Next.js 앱이며 Create React App이 아닙니다. `REACT_APP_` 접두사가 붙은 환경변수는 Next.js에서 인식되지 않고 조용히 무시되므로 아래의 실제 변수명을 사용하세요.

### 로컬 개발 환경

`.env.local` 파일을 생성하고 아래 내용을 추가하세요:

```
# 필수: OpenAI API 키 (서버 전용, API Route에서만 사용)
OPENAI_API_KEY=sk-your_openai_api_key_here

# 선택: 쿠팡 파트너스 Open API (서버 전용 — 절대 NEXT_PUBLIC_ 붙이지 말 것, 아래 "쿠팡 파트너스 API 키 발급" 참고)
COUPANG_ACCESS_KEY=your_coupang_access_key_here
COUPANG_SECRET_KEY=your_coupang_secret_key_here
COUPANG_SUB_ID=your_registered_channel_id

# 선택: Google AdSense Publisher ID
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-your_publisher_id_here

# 선택: Google AdSense 광고 슬롯 ID (디스플레이/본문 내/피드 내)
NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY=your_display_slot_id_here
NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE=your_in_article_slot_id_here
NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED=your_in_feed_slot_id_here

# 선택: 네이버 서치어드바이저 사이트 소유 확인
NEXT_PUBLIC_NAVER_SITE_VERIFICATION=your_naver_verification_code_here

# 선택: Google Analytics 4 측정 ID
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Netlify 배포 환경

Netlify 대시보드에서 환경변수 설정:

```
키: OPENAI_API_KEY
값: sk-your_openai_api_key_here

키: COUPANG_ACCESS_KEY
값: your_coupang_access_key_here

키: COUPANG_SECRET_KEY
값: your_coupang_secret_key_here

키: COUPANG_SUB_ID
값: your_registered_channel_id

키: NEXT_PUBLIC_ADSENSE_PUBLISHER_ID
값: ca-pub-your_publisher_id_here

키: NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY
값: your_display_slot_id_here

키: NEXT_PUBLIC_ADSENSE_SLOT_IN_ARTICLE
값: your_in_article_slot_id_here

키: NEXT_PUBLIC_ADSENSE_SLOT_IN_FEED
값: your_in_feed_slot_id_here

키: NEXT_PUBLIC_NAVER_SITE_VERIFICATION
값: your_naver_verification_code_here

키: NEXT_PUBLIC_GA_ID
값: G-XXXXXXXXXX
```

> 💰 광고 슬롯 발급, 수익화 전략, 쿠팡 파트너스 연동 방식에 대한 자세한 가이드는 [MONETIZATION.md](./MONETIZATION.md)를 참고하세요.

### 쿠팡 파트너스 API 키 발급

상품 카드(실제 이미지·가격·추적 링크)는 쿠팡 파트너스 Open API 로 미리 받아둔 `src/data/coupang/products.json` 카탈로그에서 그려집니다.

1. **활성 파트너스 계정이 필요합니다.** API 키는 [partners.coupang.com](https://partners.coupang.com) 에서 **최종 승인**(누적 실적 약 15만 원 + 채널 URL 등록 + 활동 캡처)을 받은 뒤에만 발급됩니다. 그 전에는 키 없이도 사이트는 정상 동작하며(일반 검색 링크로 폴백) 카탈로그 수집만 건너뜁니다.
2. partners.coupang.com → **링크 생성 → API 키 발급**(도움말 › Open API) 에서 **Access Key / Secret Key** 를 발급받습니다.
3. **채널 아이디 관리**에서 채널 ID 를 하나 만들고(예: `giftgenie-web`, 영문/숫자/`-`/`_`) 그 값을 `COUPANG_SUB_ID` 로 씁니다. 등록되지 않은 subId 로 만든 링크는 정산에서 제외됩니다.
4. 환경변수 등록 — 서버 전용이므로 `NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다.
   - 로컬: `.env.local` 에 `COUPANG_ACCESS_KEY`, `COUPANG_SECRET_KEY`, `COUPANG_SUB_ID`
   - GitHub → Settings → Secrets and variables → Actions 에 같은 이름으로 등록 (주간 카탈로그 수집 워크플로가 사용)
   - Netlify 환경변수에도 등록하면 카탈로그에 없는 키워드에 한해 `/api/coupang/products` 가 라이브 검색을 수행합니다 (선택)
5. 검증
   ```bash
   npx tsx scripts/check-coupang-signature.ts        # HMAC 서명이 기준값과 일치하는지 (네트워크 없음)
   npx tsx scripts/fetch-coupang-products.ts --dry-run # 어떤 키워드를 조회할지 미리 보기
   npx tsx scripts/fetch-coupang-products.ts --limit 10 # 실제 수집 (products.json 갱신)
   ```

> ⚠️ 검색 API 는 문서상 분당 50회지만 실제로는 **시간당 10회 안팎의 숨은 제한**이 보고되며, 3회 위반 시 계정이 정지될 수 있습니다. 수집 스크립트는 429 를 받으면 즉시 멈추고 재시도하지 않습니다. 빌드나 페이지 요청 중에는 API 를 호출하지 마세요.

## 🚀 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm start

# 빌드
npm run build
```

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 제공됩니다. 