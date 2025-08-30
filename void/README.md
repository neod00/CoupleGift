# 💝 커플 기념일 선물 추천기 (CoupleGift)

연인과의 소중한 기념일, 어떤 선물을 줄지 고민될 때?  
GPT가 당신의 입력을 바탕으로 딱 맞는 선물을 추천해드립니다!  
지금 바로 나만의 커플 선물 추천을 받아보세요 🎁

---

## 🚀 배포 주소
👉 [https://couplegift.netlify.app](https://couplegift.netlify.app)

---

## 🛠️ 기술 스택

- **Frontend**: React + TypeScript + Tailwind CSS
- **AI 모델**: OpenAI GPT-4o Mini API
- **Deployment**: Netlify (Functions + Static Site)
- **수익화 모델**: 쿠팡 파트너스 제휴 링크

---

## 🎯 주요 기능

- **🎁 맞춤형 추천**: 성별, 연령, 성격(MBTI), 기념일 종류, 예산 범위를 입력하면 AI가 선물 추천
- **🔗 쿠팡 연동**: 추천 결과에 쿠팡 제휴 링크 자동 삽입
- **🔄 재추천**: 마음에 들지 않으면 다시 추천받기 기능
- **📱 반응형 UI**: 모바일/PC 모두 완벽 대응
- **⚡ 빠른 로딩**: 3초 이내 추천 결과 제공
- **🎨 아름다운 UI**: 현대적이고 직관적인 사용자 인터페이스
- **🛡️ 안정성**: API 실패 시 자동으로 더미 데이터 제공

---

## 🧠 사용법

1. **정보 입력**: 선물 받을 대상의 정보를 입력하세요
   - 성별, 나이, 성격/취향
   - 기념일 종류, 예산 범위
   - 선호 카테고리, 추가 정보

2. **AI 추천**: [선물 추천받기] 버튼을 클릭하세요

3. **결과 확인**: 3-4개의 맞춤형 선물 추천을 확인하세요

4. **구매하기**: 원하는 선물을 선택해 쿠팡에서 구매하세요

---

## 🔐 환경 변수 설정

### 로컬 개발 환경

`.env` 파일을 생성하고 아래 내용을 추가하세요:

```env
# 필수: OpenAI API 키
REACT_APP_OPENAI_API_KEY=sk-your_openai_api_key_here

# 선택: 쿠팡 파트너스 ID (수익화)
REACT_APP_COUPANG_PARTNER_ID=your_coupang_partner_id_here

# 선택: Google AdSense Publisher ID
REACT_APP_ADSENSE_PUBLISHER_ID=ca-pub-your_publisher_id_here
```

### Netlify 배포 환경

#### 1. Netlify 대시보드에서 환경변수 설정
- **Site settings** → **Environment variables** 이동
- 다음 변수들을 추가:

```
키: OPENAI_API_KEY
값: sk-your_openai_api_key_here

키: REACT_APP_COUPANG_PARTNER_ID
값: your_coupang_partner_id_here

키: REACT_APP_ADSENSE_PUBLISHER_ID
값: ca-pub-your_publisher_id_here
```

#### 2. 환경변수 우선순위
1. **서버 환경변수**: `OPENAI_API_KEY` (권장)
2. **클라이언트 환경변수**: `REACT_APP_OPENAI_API_KEY` (폴백)

#### 3. 배포 확인
- 배포 완료 후 브라우저 콘솔에서 환경변수 상태 확인
- 실제 추천 기능 테스트

---

## 🚀 배포 방법

### 1. GitHub에 코드 업로드

```bash
# Git 저장소 초기화
git init

# 파일 추가 및 커밋
git add .
git commit -m "Initial commit"

# GitHub 리포지토리에 푸시
git remote add origin https://github.com/yourusername/couplegift.git
git push -u origin main
```

### 2. Netlify 배포

1. **Netlify 대시보드** 접속
2. **"New site from Git"** 클릭
3. **GitHub 리포지토리** 선택
4. **배포 설정**:
   - Build command: `npm run build`
   - Publish directory: `build`
5. **환경변수 설정** (위 섹션 참고)
6. **배포 완료**

### 3. 배포 문제 해결

#### API 키 관련 오류
- Netlify 환경변수에서 `OPENAI_API_KEY` 설정 확인
- 키 값이 `sk-`로 시작하는지 확인
- 배포 로그에서 환경변수 로딩 상태 확인

#### 쿠팡 링크 문제
- `REACT_APP_COUPANG_PARTNER_ID` 설정 확인
- 파트너스 ID가 올바른지 확인
- 없으면 일반 쿠팡 검색 링크 사용

---

## 🔧 주요 파일 구조

```
CoupleGift/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── GiftForm.tsx    # 선물 정보 입력 폼
│   │   ├── GiftRecommendations.tsx  # 추천 결과 표시
│   │   ├── LoadingSpinner.tsx       # 로딩 애니메이션
│   │   └── AdSense.tsx     # 광고 컴포넌트
│   ├── services/           # API 호출 로직
│   │   └── gptService.ts   # OpenAI API 및 링크 생성
│   ├── types/              # TypeScript 타입 정의
│   │   └── gift.ts         # 선물 관련 타입
│   └── App.tsx             # 메인 애플리케이션
├── netlify/
│   └── functions/          # Netlify Functions
│       └── get-recommendations.js   # OpenAI API 호출
├── public/                 # 정적 파일
└── package.json           # 종속성 관리
```

---

## 🐛 문제 해결

### 1. API 호출 실패
- **증상**: "더미 데이터" 또는 "샘플 데이터" 표시
- **해결**: Netlify 환경변수에서 `OPENAI_API_KEY` 설정 확인

### 2. 이미지 로딩 실패
- **증상**: 선물 이미지가 표시되지 않음
- **해결**: 자동으로 기본 이미지 사용, 브라우저 캐시 클리어

### 3. 쿠팡 링크 오류
- **증상**: 쿠팡 링크가 작동하지 않음
- **해결**: 쿠팡 파트너스 ID 확인, 없으면 일반 링크 사용

### 4. 배포 실패
- **해결**: 
  - Node.js 버전 확인 (18 이상)
  - 빌드 로그 확인
  - 환경변수 설정 재확인

---

## 📈 성능 최적화

- **이미지 최적화**: Unsplash 이미지 압축 (`&q=80`)
- **API 호출 최적화**: 에러 핸들링 및 폴백 시스템
- **로딩 시간**: 3초 이내 응답 보장
- **모바일 최적화**: 반응형 디자인

---

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 제공됩니다.

---

## 💡 추가 기능 아이디어

- [ ] 사용자 평점 시스템
- [ ] 선물 히스토리 저장
- [ ] 소셜 미디어 공유
- [ ] 다국어 지원
- [ ] 카테고리별 필터링 강화
- [ ] 가격 추적 기능

---

## 📞 문의

프로젝트 관련 문의나 버그 리포트는 GitHub Issues를 이용해주세요. 