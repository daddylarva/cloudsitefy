# CloudSitefy

Subscription-based websites for small businesses.

## 🚀 프로젝트 개요

CloudSitefy는 소규모 비즈니스가 전문적인 웹사이트를 구축하고 지속적으로 관리할 수 있도록 도와주는 서비스입니다.

### 주요 기능
- 🎨 반응형 웹사이트 디자인
- ⚡ 빠른 로딩 속도 및 성능 최적화
- 🔒 보안 강화 (HTTPS, 보안 헤더, 스팸 방지)
- 📱 모바일 최적화
- 🔍 SEO 최적화
- 📧 자동 이메일 응답 시스템

## 🛠 기술 스택

### 프론트엔드
- **Vite** + **React** + **TypeScript**
- **TailwindCSS** - 모던 UI 디자인
- **반응형 디자인** - 모든 디바이스 지원

### 백엔드
- **Firebase Functions** - 서버리스 API
- **SendGrid** - 이메일 전송 서비스
- **Node.js 20** - 런타임 환경

### 호스팅
- **Firebase Hosting** - 정적 사이트 호스팅
- **App Hosting (Cloud Run)** - 동적 앱 호스팅
- **커스텀 도메인** - cloudsitefy.com

## 📁 프로젝트 구조

```
cloudsitefy.com/
├── src/
│   ├── components/          # React 컴포넌트
│   │   ├── Header.tsx      # 헤더 네비게이션
│   │   ├── Hero.tsx        # 메인 히어로 섹션
│   │   ├── Features.tsx    # 기능 소개
│   │   ├── Pricing.tsx     # 요금제 안내
│   │   ├── ContactForm.tsx # 문의 폼
│   │   └── Footer.tsx      # 푸터
│   ├── App.tsx             # 메인 앱 컴포넌트
│   └── index.css           # TailwindCSS 스타일
├── functions/               # Firebase Functions
│   ├── src/
│   │   └── index.ts        # 이메일 전송 API
│   ├── package.json         # Functions 의존성
│   └── tsconfig.json       # TypeScript 설정
├── firebase.json            # Firebase 설정
├── .firebaserc              # Firebase 프로젝트 설정
├── server.js                # App Hosting 서버
├── apphosting.yaml          # App Hosting 설정
└── package.json             # 프로젝트 의존성
```

## 🚀 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
# 프로젝트 루트
npm install

# Firebase Functions
cd functions
npm install
```

### 2. 환경 변수 설정
```bash
# functions/env.example을 functions/.env로 복사하고 실제 값 입력
cp functions/env.example functions/.env
```

필요한 환경 변수:
- `SENDGRID_API_KEY`: SendGrid API 키
- `ADMIN_EMAIL`: 관리자 이메일 주소

### 3. 개발 서버 실행
```bash
# 프론트엔드 개발 서버
npm run dev

# Firebase Functions 로컬 실행 (새 터미널)
cd functions
npm run serve

# App Hosting 로컬 실행
npm start
```

## 🔧 Firebase 설정

### 1. Firebase 프로젝트 생성
- [Firebase Console](https://console.firebase.google.com/)에서 새 프로젝트 생성
- 프로젝트 ID: `cloudsitefy`

### 2. Firebase Functions 배포
```bash
cd functions
npm run build
firebase deploy --only functions
```

### 3. Firebase Hosting 배포
```bash
npm run build
firebase deploy --only hosting
```

## 🌐 App Hosting 설정

### 1. App Hosting 활성화
- Firebase Console에서 **App Hosting** 메뉴 선택
- **새 앱 만들기** 또는 **기존 앱 설정**

### 2. 앱 루트 디렉터리 설정
- 현재 폴더 (`.`)로 설정
- `package.json`, `server.js`, `apphosting.yaml` 포함

### 3. GitHub 연결 및 출시
- GitHub 저장소 연결
- **출시 만들기** 클릭
- 빌드 로그에서 **google.nodejs.runtime**이 **pass**로 바뀌면 성공

## 📧 이메일 설정

### SendGrid 설정
1. [SendGrid](https://sendgrid.com/) 계정 생성
2. API 키 발급
3. 도메인 인증 (SPF, DKIM, DMARC)
4. 발신자 이메일 주소 설정: `noreply@cloudsitefy.com`

### 환경 변수 설정
```bash
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_API_KEY"
firebase functions:config:set email.admin="admin@cloudsitefy.com"
```

## 🔒 보안 기능

- **Honeypot**: 봇 방지
- **Rate Limiting**: 요청 제한
- **입력 검증**: XSS 및 인젝션 방지
- **보안 헤더**: HSTS, X-Frame-Options 등
- **CORS 설정**: 적절한 도메인 제한

## 🌐 도메인 설정

### 커스텀 도메인 연결
1. Firebase Console에서 App Hosting 설정
2. 커스텀 도메인 추가: `cloudsitefy.com`
3. DNS 레코드 설정
4. SSL 인증서 자동 발급

## 📱 반응형 디자인

- **모바일 우선** 접근법
- **TailwindCSS** 유틸리티 클래스 활용
- **접근성(a11y)** 고려
- **포커스 관리** 및 키보드 네비게이션

## 🚀 배포

### 프로덕션 빌드
```bash
npm run build
```

### Firebase 배포
```bash
firebase deploy
```

### App Hosting 배포
```bash
# GitHub에 push 후 Firebase Console에서 출시
git add .
git commit -m "Update app"
git push origin main
```

## 📋 요금제

- **Starter**: $99/월 - 기본 패키지
- **Professional**: $199/월 - 프리미엄 패키지 (인기)
- **Enterprise**: $399/월 - 맞춤형 솔루션

## 🤝 기여하기

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 📞 문의

- **이메일**: admin@cloudsitefy.com
- **웹사이트**: https://cloudsitefy.com

---

**CloudSitefy** - 소규모 비즈니스의 온라인 성공을 위한 최고의 선택
