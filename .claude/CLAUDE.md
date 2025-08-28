# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 🏗️ Project Overview

### Tech Stack
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19.1.1
- **Styling**: TailwindCSS v4 with PostCSS
- **Build Tool**: Next.js with Turbopack

### Project Structure
```
src/
├── app/           # App Router pages and layouts
│   ├── layout.tsx # Root layout with font configuration
│   ├── page.tsx   # Home page
│   ├── error.tsx  # Error boundary
│   └── globals.css # Global styles with Tailwind
├── components/    # Reusable components (to be created)
└── lib/          # Utility functions and shared logic
```

## 🚀 Development Commands

### Essential Commands
```bash
npm run dev       # Start development server with Turbopack (http://localhost:3000)
npm run build     # Build for production with Turbopack
npm run start     # Start production server
npm run lint      # Run ESLint checks
npm run lint:fix  # Fix linting issues automatically
```

### Git Workflow
```bash
git add .
git commit -m "feat: your message"
pr "간단한 설명"  # 빠른 PR 생성 (아래 설정 참조)
```

## 🏛️ Architecture Notes

### App Router Conventions
- Pages use `page.tsx` files in the app directory
- Layouts use `layout.tsx` for shared UI
- Loading states: `loading.tsx`
- Error handling: `error.tsx`
- Route groups: Use `(group-name)` folders

### Component Organization
- Place reusable components in `/src/components/`
- Use server components by default
- Add `'use client'` directive only when needed (interactivity, hooks, browser APIs)

### Styling Approach
- TailwindCSS v4 with PostCSS for styling
- Custom CSS variables defined in `globals.css`
- Theme colors: Use CSS variables (--background, --foreground)
- Font: Geist Sans and Geist Mono (optimized with next/font)

### TypeScript Configuration
- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Use absolute imports: `import { Component } from '@/components/Component'`

## ⚙️ Important Configuration

### ESLint Setup
- Uses flat config format (ESLint 9)
- Extends Next.js core web vitals rules
- TypeScript-aware linting
- Auto-fixable with `npm run lint:fix`

### TailwindCSS v4 Notes
- PostCSS-based configuration
- Custom properties for theming
- Dark mode support via `prefers-color-scheme`
- No traditional `tailwind.config.js` file (v4 approach)

---

# 🔄 Claude Code PR 자동화 가이드 (대화형 모드)

## 🚀 빠른 시작

### 설치 (처음 한 번만)
```bash
# 프로젝트 루트에서 실행
./install.sh
source ~/.zshrc  # 또는 source ~/.bashrc
```

### 사용법
```bash
# 1. 작업 후 변경사항 추가
git add .

# 2. PR 생성 (자동 커밋 + 푸시 + PR)
pr "Feat: 블로그 생성"

# 3. Claude Code에서 분석 후 결과 붙여넣기
```

## 📋 상세 워크플로우

### 1️⃣ 작업 브랜치 생성
```bash
git checkout -b feature/blog-create
```

### 2️⃣ 코드 작업 및 변경사항 추가
```bash
# 코드 작업...
git add .
```

### 3️⃣ PR 생성 명령어 실행
```bash
pr "Feat: 블로그 생성 기능 구현"
```

### 4️⃣ Claude Code 분석
실행하면 자동으로:
- ✅ 변경사항을 커밋 (제공한 메시지 사용)
- ✅ 현재 브랜치를 origin에 푸시
- ✅ Claude Code용 분석 프롬프트를 클립보드에 복사
- ⏸️ Claude Code 분석을 기다림

### 5️⃣ Claude Code에서 분석
1. [claude.ai/code](https://claude.ai/code) 접속
2. Cmd+V로 프롬프트 붙여넣기 (자동 복사됨)
3. Claude가 생성한 PR 제목과 본문 복사

### 6️⃣ PR 생성 완료
1. 터미널로 돌아와서 Enter
2. PR 제목 입력 (Claude 생성 내용)
3. PR 본문 붙여넣기 후 Ctrl+D
4. 자동으로 GitHub PR 생성!

## 🔧 필수 설정

### GitHub CLI 설치 및 인증
```bash
# 설치
brew install gh

# GitHub 로그인
gh auth login
```

### Claude Code 접속
- https://claude.ai/code
- 팀원 모두 접속 가능해야 함

## ✨ 주요 기능

### 자동 처리
- 🤖 변경사항 분석 및 diff 생성
- 📝 자동 커밋 (제공한 메시지 사용)
- 🚀 자동 푸시 (현재 브랜치)
- 📋 클립보드에 프롬프트 자동 복사
- 🔗 PR 생성 후 URL 제공

### Claude Code 분석 내용
- 작업 개요 및 목적
- 주요 변경사항 목록
- 기술적 세부사항
- 체크리스트
- 리뷰 포인트

## 📂 프로젝트 구조
```
.claude/
├── scripts/
│   └── pr          # PR 자동화 스크립트
├── CLAUDE.md       # 이 파일
└── settings.local.json
install.sh          # 설치 스크립트
```

## 💡 팁

### 브랜치 네이밍
```bash
# 기능 추가
git checkout -b feature/blog-create

# 버그 수정
git checkout -b fix/login-error

# 리팩토링
git checkout -b refactor/api-structure
```

### PR 제목 컨벤션
```
[Feat] 새로운 기능 추가
[Fix] 버그 수정
[Refactor] 코드 리팩토링
[Docs] 문서 수정
[Test] 테스트 추가
```

## 🤝 팀원 공유

### 팀원 설치 방법
1. 이 저장소 클론
2. `./install.sh` 실행
3. `gh auth login`으로 GitHub 인증
4. Claude Code 접속 가능 확인

### 사용 예시
```bash
# 실제 사용 예시
git add .
pr "Feat: 사용자 프로필 페이지 추가"

# Claude Code에서 분석 후
# 생성된 PR 제목과 본문을 복사해서 사용
```

## ❓ 문제 해결

### PATH를 찾을 수 없을 때
```bash
source ~/.zshrc  # zsh 사용자
source ~/.bashrc # bash 사용자
```

### GitHub CLI 인증 문제
```bash
gh auth status  # 상태 확인
gh auth login   # 재로그인
```

### 클립보드 복사가 안 될 때
- macOS가 아닌 경우 수동으로 프롬프트 복사
- 화면에 출력된 프롬프트 사용

## 📝 업데이트 내역
- 2024.01: 대화형 Claude Code 모드 구현
- 자동 커밋, 푸시, PR 생성 기능 추가
- 클립보드 자동 복사 기능 추가