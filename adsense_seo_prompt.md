# AdSense 승인을 위한 고품질 웹 플랫폼 구축 프롬프트

당신은 구글 애드센스(Google AdSense) 승인 및 SEO(검색 엔진 최적화)에 특화된 풀스택 웹 개발자 전문가입니다. 
당신의 목표는 **[사용자가 만들고자 하는 주제 입력]** 주제를 가진 웹 플랫폼을 구축하는 것이며, 이 플랫폼은 구글 봇이 콘텐츠를 잘 이해하고, 사용자 경험(UX)이 뛰어나 애드센스 승인을 원활하게 받을 수 있도록 설계되어야 합니다.

다음은 기존에 애드센스 승인을 받은 성공적인 플랫폼('CoupleGift')의 구조를 벤치마킹한 요구사항입니다. 이 기준에 맞춰 전체 프로젝트 구조와 핵심 파일 코드를 작성해주세요.

## 1. 기술 스택 및 프로젝트 구조
- **Framework**: React (TypeScript) 또는 Next.js (SEO에 더 유리함 추천)
- **Styling**: Tailwind CSS (반응형 모바일 친화적 디자인 필수)
- **Structure**:
  - `src/components`: 재사용 가능한 UI 컴포넌트
  - `src/pages`: 각 라우트별 페이지
  - `public`: 정적 파일 (robots.txt, sitemap.xml, ads.txt 등)

## 2. 필수 SEO 및 메타 태그 최적화 (index.html / Head)
`public/index.html` 또는 Next.js의 `Layout` 파일에 다음 요소들을 반드시 포함시켜주세요:
- **기본 메타 태그**: `description`, `keywords`, `author`, `robots` (index, follow), `language`.
- **Open Graph (OG) & Twitter Cards**: 소셜 공유 시 미리보기가 완벽하게 나오도록 설정.
- **Canonical URL**: 중복 콘텐츠 방지를 위한 표준 주소 설정.
- **Viewport**: 모바일 친화성을 위한 설정 (`width=device-width, initial-scale=1`).
- **구글 사이트 확인**: `google-site-verification` 메타 태그 공간 마련.

## 3. 구조화된 데이터 (JSON-LD)
검색 엔진이 사이트의 성격을 명확히 이해하도록 `application/ld+json` 스크립트를 포함해주세요.
- **Type**: `WebApplication` 또는 주제에 맞는 스키마 (예: `Article`, `Product`).
- **필수 필드**: `name`, `description`, `url`, `applicationCategory`, `datePublished`, `author`.
- **Feature List**: 서비스가 제공하는 핵심 기능들을 나열하여 콘텐츠의 풍부함을 강조하세요.

## 4. 애드센스 준비 (AdSense Readiness)
- **스크립트 위치**: `<head>` 태그 내에 애드센스 자동 광고 스크립트를 넣을 위치를 주석으로 표시하거나 코드를 미리 작성해두세요. (`adsbygoogle` 초기화 코드 포함)
- **ads.txt**: 루트 디렉토리에 `ads.txt` 파일 생성 준비.
- **콘텐츠 가이드라인**:
  - "빈약한 콘텐츠(Thin Content)"로 거절되지 않도록, 각 페이지는 충분한 텍스트 볼륨과 유용한 정보를 담아야 함을 명시해주세요.
  - 내비게이션 바(GNB)와 푸터(Footer)를 명확히 하여 "사이트 탐색 문제"가 발생하지 않도록 UX를 설계해주세요.

## 5. 검색 엔진 크롤링 최적화
- **robots.txt**: 모든 주요 봇(Googlebot, Yeti, Bingbot 등)을 허용하고 `sitemap.xml` 위치를 명시하는 완성된 `robots.txt` 코드를 제공해주세요.
- **sitemap.xml**: 동적 생성 또는 정적 생성 방안을 제시해주세요.

---

**지시사항**:
위 5가지 요소를 모두 충족하는 프로젝트의 폴더 구조(Tree)와, 가장 핵심이 되는 `index.html`(또는 메인 레이아웃 파일), `robots.txt`, 그리고 구조화된 데이터가 포함된 메인 페이지 예시 코드를 작성해주세요.
