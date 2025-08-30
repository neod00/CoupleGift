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

### 로컬 개발 환경

`.env` 파일을 생성하고 아래 내용을 추가하세요:

```
# 필수: OpenAI API 키
REACT_APP_OPENAI_API_KEY=sk-your_openai_api_key_here

# 선택: 쿠팡 파트너스 ID (수익화)
REACT_APP_COUPANG_PARTNER_ID=your_coupang_partner_id_here

# 선택: Google AdSense Publisher ID
REACT_APP_ADSENSE_PUBLISHER_ID=ca-pub-your_publisher_id_here
```

### Netlify 배포 환경

Netlify 대시보드에서 환경변수 설정:

```
키: OPENAI_API_KEY
값: sk-your_openai_api_key_here

키: REACT_APP_COUPANG_PARTNER_ID
값: your_coupang_partner_id_here

키: REACT_APP_ADSENSE_PUBLISHER_ID
값: ca-pub-your_publisher_id_here
```

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