This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 🚀 PR 자동화 도구 - 팀원 설정 가이드

### 0. Github CLI 설치
```bash
brew install gh      # macOS
winget install Github.cli  # Windows
```

### 1. 최신 코드 받기
```bash
git pull origin main
```

### 2. 설치 스크립트 실행 (한 번만)
```bash
chmod +x install.sh
./install.sh
```

### 3. PATH 적용 (설치 후 한 번만)
```bash
source ~/.zshrc  # zsh 사용자 (macOS 기본)
source ~/.bashrc # bash 사용자
```

### 4. GitHub CLI 로그인 (각자 개인 계정으로)
```bash
gh auth login
# → GitHub.com 선택
# → HTTPS 선택  
# → Y (인증)
# → Login with a web browser 선택
```

### 5. 사용 시작!
```bash
# 작업 후 변경사항 추가
git add .

# PR 생성 (자동 커밋 + 푸시 + Claude 분석 + PR)
prm "Feat: 첫 번째 테스트 PR"  # ⚠️ pr이 아닌 prm 사용!
```

### 📝 사용 흐름
1. **코드 작업** → 기능 구현
2. **`git add .`** → 변경사항 스테이징
3. **`prm "작업 내용"`** → 자동 커밋/푸시
4. **Claude Code 분석**
   - 클립보드에 자동 복사된 프롬프트를 claude.ai/code에 붙여넣기
   - 생성된 PR 내용 복사
5. **터미널에 붙여넣기** → PR 자동 생성!

### ⚠️ 주의사항
- 명령어는 `pr`이 아닌 `prm` (PR Make)
- 작업은 feature 브랜치에서 (main 브랜치 X)
- Claude Code 접속: https://claude.ai/code

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
