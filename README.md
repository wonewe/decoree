# koraid – MVP Web App

koraid는 글로벌 (18~25세) 여행자들이 한국에서 머무르는 동안 도움을 받을 수 있도록 설계된 단일 페이지 웹 애플리케이션(SPA)입니다.  
이 MVP는 PRD에서 정의된 핵심 기능을 포함합니다: **주간 트렌드 디코더**, **K-컬처 이벤트 캘린더**, **맞춤형 프레이즈북**, **로컬 지원 허브(공공서비스/앱/커뮤니티)**.

## 프로젝트 시작하기

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버 실행
npm run dev

# 3. 프로덕션 빌드 생성
npm run build
```

> 📌 TailwindCSS, Vite, React 는 이미 설정되어 있습니다. 프로젝트는 TypeScript와 React Router를 사용합니다.

## 주요 구조

- `src/App.tsx` – React Router 기반 SPA 라우팅 설정
- `src/components/*` – UI 컴포넌트 (Trend Decoder, 캘린더, 프레이즈북, 팝업 레이더 등)
- `src/pages/*` – PRD 섹션 기반 페이지
- `src/shared/i18n.tsx` – 다국어 컨텍스트(FR/KR) 및 언어 스위처
- `src/services/*` – MVP 환경을 위한 Firestore 접근 시뮬레이션 서비스
- `src/data/*` – 트렌드/이벤트/프레이즈북 목 데이터

## MVP 기능

- Weekly Trend Decoder: FR/KO/JA 에디토리얼 트렌드 카드 제공, 강도·작성자 기반 탐색 지원
- K-Culture Event Calendar: 이벤트 유형(콘서트/페스티벌/팝업 등) 필터링
- Personalized Korean Phrasebook: 다중 카테고리 선택, 진행도 시뮬레이션, 전체 텍스트 검색 지원
- Pop-up Radar: 콤팩트 카드/검색/상세 페이지로 팝업·콜라보를 지역 기반 탐색
- Local Support Hub: 공공 서비스 가이드, 한국 앱 튜토리얼, 학생/익스팻 커뮤니티 소개
- 다국어 스튜디오: 콘텐츠를 작성하면 FR/KO/JA/EN으로 자동 번역/배포
- 상세 블로그 페이지: 트렌드/이벤트마다 사진/리치 텍스트 기반 상세 콘텐츠 제공
- FR/KR 다국어 지원: 네비게이션·CTA·텍스트 즉시 전환
- 반응형 레이아웃: Tailwind 기반 모바일-first UI, sticky 내비게이션 및 적응형 카드
- koraid Studio (Admin): /admin에서 코드 수정 없이 트렌드/이벤트/프레이즈 추가
- 데이터는 localStorage에 저장 후 mock 데이터와 병합
- Firebase 로그인 보호: /admin은 Firebase Authentication(email/Google 로그인)으로 보호
- 모든 사용자가 계정 생성 가능하지만, VITE_KORAID_ADMIN_EMAILS에 포함된 이메일만 Studio 접근 허용

## 향후 통합 예정 기능

- 광고 수익화: Trend Decoder, Pop-up Radar, Local Hub에 네이티브 광고 슬롯 추가
- Firebase Firestore 연결: contentService.ts를 Firestore 실시간 콘텐츠와 연동
- Maps & API 연동: Kakao/Google 지도 기반 위치 추천 및 동적 제안
- 사용자 인증/개인화: 언어/즐겨찾기/프레이즈북 진행도 등을 사용자 프로필과 연동
- 테스트 추가: Vitest 단위 테스트 + Playwright E2E 테스트
- CMS 연동: Studio 로컬 저장 방식 → Firestore/Contentful/Strapi 등 협업 가능한 CMS로 확장
- 고급 역할(Role) 관리: Firebase Custom Claims 또는 CMS 기반 권한 분리

## 인증 설정 방법

1. `.env.example`을 `.env`로 복사한 뒤, Firebase 설정 값으로 `VITE_FIREBASE_*`(특히 `VITE_FIREBASE_STORAGE_BUCKET`)을 채웁니다.
2. Firebase Console에서 다음을 활성화합니다:
   - Authentication → Email/Password
   - Authentication → Google (선택)
   - Storage 활성화 후 기본 버킷(`프로젝트명.appspot.com`)이 .env와 일치하는지 확인
인증된 Studio 계정만 업로드 가능하도록 규칙 설정
   - Studio 관리자 계정을 직접 생성하거나 `/signup`을 통해 생성 허용
3. `VITE_KORAID_ADMIN_EMAILS`에 관리자 이메일 목록(콤마로 구분)을 추가 → 이 계정들은 “Studio koraid” 링크를 볼 수 있음
4. “Local Support” 페이지 사전 준비 단계에서 팀 계정만 보이게 하려면 `VITE_KORAID_TEAM_EMAILS`에 이메일 리스트를 입력(콤마 구분) 비어 있으면 Admin만 접근 가능
5. `npm run dev`를 다시 실행하여 설정을 반영한 뒤 `/login` 또는 `/signup`에서 테스트

## 다국어 스튜디오 (Studio multi-langues)

- Studio의 각 폼에서는 여러 게시 언어를 선택할 수 있으며, 콘텐츠는 FR/KO/JA/EN으로 자동 번역되고 `lang-id` 기준으로 동기화됩니다.
- 자동 번역은 기본적으로 활성화되어 있습니다. 이를 비활성화하고 수동 번역을 적용하려면 `.env` 파일에 `VITE_STUDIO_AUTO_TRANSLATE=false`를 설정하십시오.

## Studio 미디어 관리

- “K-Culture 이벤트”, “주간 트렌드”, “팝업 레이더” 폼은 이미지 직접 업로드를 지원합니다. 업로드된 파일은 Firebase Storage로 전송되며 생성된 URL은 모든 언어에서 재사용됩니다.
- Storage 규칙은 다음을 포함해야 합니다:  
  - 공개 읽기 허용: `allow read: if true;`  
  - 인증된 Studio 사용자만 쓰기 허용: `allow write: if request.auth != null;`
- 특정 네트워크 환경에서 Cloudinary가 차단될 경우, URL 입력 칸을 비워두고 로컬 파일을 업로드하면 Studio가 자동으로 보안 URL을 생성합니다.

## 정적 콘텐츠 모드

Firebase 없이 개발하거나 오프라인 환경에서 작업하려면 `.env` 파일에 다음 변수를 설정하십시오: `VITE_USE_STATIC_CONTENT=true`

이 모드에서는 Firestore 요청을 건너뛰고 즉시 mock 데이터를 사용합니다. Firebase가 구성되지 않은 동안에는 추가/수정/삭제 기능이 비활성화됩니다.

## 팝업 레이더 자동 번역

- 팝업 레이더 항목은 한국어로 작성한 뒤 자동으로 프랑스어·영어·일본어로 노출할 수 있습니다.
- 클라이언트 측 자동 번역을 사용하려면 다음 변수를 활성화하십시오: `VITE_POPUP_AUTO_TRANSLATE=true`
- Google Translate 비인증 API가 fallback으로 사용되며, 번역 요청이 실패할 경우 한국어 원문이 표시됩니다.
- 이 기능은 “Pop-ups” 컬렉션에만 적용되며, 트렌드·이벤트·프레이즈북은 기존 언어별 데이터 방식을 유지합니다.

## UX/UI 참고 사항

- 전통 단청에서 영감을 받은 팔레트(파란색/초록색/빨간색)를 사용합니다.
- 라운드 버튼 형태로 K-POP 및 이벤트 배지 느낌을 반영했습니다.
- 에디토리얼 참여를 높이기 위해 Trend Decoder를 홈 화면 상단에 강조 배치했습니다.

## 품질 관리

- **성능**: Vite + Tailwind 기반으로 경량 번들을 제공합니다.  
- **접근성**: 제목, 문단, 버튼 등 기본 시맨틱 구조를 준수합니다.  
- **국제화**: en/ja/zh 등 더 많은 언어 추가가 용이한 구조로 설계되어 있습니다.

좋은 탐험 되시길 바랍니다! 🎌✈️🇫🇷🇰🇷
