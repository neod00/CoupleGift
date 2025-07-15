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
- **Deployment**: Netlify
- **수익화 모델**: 쿠팡 파트너스 제휴 링크

---

## 🎯 주요 기능

- **🎁 맞춤형 추천**: 성별, 연령, 성격(MBTI), 기념일 종류, 예산 범위를 입력하면 AI가 선물 추천
- **🔗 쿠팡 연동**: 추천 결과에 쿠팡 제휴 링크 자동 삽입
- **🔄 재추천**: 마음에 들지 않으면 다시 추천받기 기능
- **📱 반응형 UI**: 모바일/PC 모두 완벽 대응
- **⚡ 빠른 로딩**: 3초 이내 추천 결과 제공
- **🎨 아름다운 UI**: 현대적이고 직관적인 사용자 인터페이스

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

`.env` 파일을 생성하고 아래 항목을 추가하세요:

```env
# OpenAI API 키 (GPT-4o Mini 사용)
REACT_APP_OPENAI_API_KEY=your_openai_api_key_here

# 쿠팡 파트너스 코드
REACT_APP_COUPANG_PARTNER_CODE=your_coupang_partner_code_here

# 기타 설정
REACT_APP_API_BASE_URL=https://api.openai.com/v1
```

---

## 🚀 로컬 개발 환경 설정

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/couplegift.git
cd couplegift
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
```bash
cp env.example .env
# .env 파일을 열어서 실제 API 키로 수정
```

### 4. 개발 서버 실행
```bash
npm start
```

### 5. 빌드
```bash
npm run build
```

---

## 📁 프로젝트 구조

```
CoupleGift/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── GiftForm.tsx           # 선물 정보 입력 폼
│   │   ├── GiftRecommendations.tsx # 추천 결과 표시
│   │   └── LoadingSpinner.tsx     # 로딩 화면
│   ├── services/
│   │   └── gptService.ts          # GPT API 연동
│   ├── types/
│   │   └── gift.ts                # 타입 정의
│   ├── utils/
│   ├── App.tsx
│   ├── index.tsx
│   └── index.css
├── tailwind.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🎨 주요 컴포넌트

### GiftForm
- 사용자 입력 폼 (성별, 나이, 성격, 기념일, 예산 등)
- 반응형 디자인으로 모바일에서도 사용 편리
- 유효성 검사 포함

### GiftRecommendations
- AI 추천 결과 표시
- 각 선물마다 쿠팡 링크 자동 생성
- 카드 형태의 아름다운 UI

### LoadingSpinner
- 추천 생성 중 표시되는 로딩 화면
- 사용자 경험 향상을 위한 애니메이션

---

## 🔧 주요 기술 구현

### GPT API 연동
- GPT-4o Mini 모델 사용
- 사용자 입력을 바탕으로 한 맞춤형 프롬프트 생성
- JSON 형태로 구조화된 응답 처리

### 쿠팡 파트너스 연동
- 추천 상품명을 키워드로 쿠팡 검색 링크 생성
- 제휴 코드를 통한 수익 추적 가능

### 반응형 UI
- Tailwind CSS를 활용한 모바일 퍼스트 디자인
- 다양한 화면 크기에 대응

---

## 🚀 배포 방법

### Netlify 배포
1. Netlify에 로그인
2. GitHub 저장소 연결
3. 빌드 명령어 설정: `npm run build`
4. 배포 폴더 설정: `build`
5. 환경 변수 설정 (Site Settings > Environment Variables)

### 환경 변수 설정
- `REACT_APP_OPENAI_API_KEY`: OpenAI API 키
- `REACT_APP_COUPANG_PARTNER_CODE`: 쿠팡 파트너스 코드

---

## 🎯 향후 개선 계획

- **로그인 기능**: 사용자별 추천 이력 저장
- **찜하기 기능**: 마음에 드는 선물 저장
- **리뷰 시스템**: 사용자 리뷰 및 평점 기능
- **다양한 제휴**: 11번가, G마켓 등 다른 쇼핑몰 연동
- **SEO 최적화**: 검색 엔진 최적화
- **애드센스 연동**: 추가 수익 창출

---

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

---

## 📞 문의

- 개발자: [Your Name]
- 이메일: [your-email@example.com]
- 프로젝트 링크: [https://github.com/yourusername/couplegift](https://github.com/yourusername/couplegift)

---

## 🙏 감사의 말

이 프로젝트는 다음 기술들을 사용하여 개발되었습니다:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [OpenAI GPT API](https://openai.com/api/)
- [Netlify](https://www.netlify.com/)

**⭐ 이 프로젝트가 도움이 되었다면 별점을 눌러주세요!** 