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

# 🔄 Claude Code PR 자동화 가이드

## 🚀 Quick PR Command
간단한 PR 생성:
```bash
pr "작업 내용"
```

예시:
```bash
pr "로그인 기능 개선"
```

## 📋 PR 템플릿 자동 생성
상세한 PR 생성:
```bash
team-pr "작업 내용" [이슈번호(선택)]
```

예시:
```bash
team-pr "사용자 인증 로직 리팩토링" "#123"
```

## 🔧 명령어 설정 방법

### 1. 간단한 PR 명령어 (pr)
```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
pr() {
  if [ -z "$1" ]; then
    echo "❌ PR 제목을 입력해주세요"
    echo "사용법: pr \"작업 내용\""
    return 1
  fi
  
  # 현재 브랜치 확인
  current_branch=$(git branch --show-current)
  
  if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    echo "❌ main/master 브랜치에서는 직접 PR을 생성할 수 없습니다"
    return 1
  fi
  
  echo "📝 변경사항 확인 중..."
  git status
  
  echo "\n🔄 origin/$current_branch 에 push 중..."
  git push -u origin $current_branch
  
  echo "\n🎉 PR 생성 중..."
  gh pr create \
    --title "$1" \
    --body "## 작업 내용
$1

---
🤖 Generated with [Claude Code](https://claude.ai/code)" \
    --base main
}
```

### 2. 팀 PR 템플릿 명령어 (team-pr)
```bash
# ~/.zshrc 또는 ~/.bashrc에 추가
team-pr() {
  if [ -z "$1" ]; then
    echo "❌ 작업 내용을 입력해주세요"
    echo "사용법: team-pr \"작업 내용\" [\"#이슈번호\"]"
    return 1
  fi
  
  # 현재 브랜치 확인
  current_branch=$(git branch --show-current)
  
  if [ "$current_branch" = "main" ] || [ "$current_branch" = "master" ]; then
    echo "❌ main/master 브랜치에서는 직접 PR을 생성할 수 없습니다"
    return 1
  fi
  
  # git diff 분석을 위한 변경사항 확인
  echo "📊 변경사항 분석 중..."
  changes=$(git diff --cached --stat)
  if [ -z "$changes" ]; then
    changes=$(git diff HEAD~1 --stat)
  fi
  
  # 이슈 번호 처리
  issue_ref=""
  if [ ! -z "$2" ]; then
    issue_ref="- 관련 이슈: $2"
  fi
  
  # PR 타입 결정 (간단한 휴리스틱)
  pr_type="feat"
  if echo "$1" | grep -qi "fix\|버그\|수정\|오류"; then
    pr_type="fix"
  elif echo "$1" | grep -qi "refactor\|리팩토링\|개선"; then
    pr_type="refactor"
  elif echo "$1" | grep -qi "docs\|문서\|주석"; then
    pr_type="docs"
  elif echo "$1" | grep -qi "test\|테스트"; then
    pr_type="test"
  fi
  
  # PR 제목 (최대 72자)
  title="[$pr_type] $1"
  
  # PR 본문 생성
  body="## 개요
- $1 작업을 완료했습니다
- 코드 품질 향상 및 유지보수성을 개선했습니다
- 팀 규칙에 따라 구현했습니다

## 설명

### What (무엇을 수정했나요?)
- $1 관련 로직을 구현/수정했습니다
- 필요한 컴포넌트와 함수를 추가했습니다

### Why (왜 수정했나요?)
- 기존 코드의 문제점을 해결하기 위해
- 새로운 요구사항을 충족하기 위해
- 성능 및 사용성 개선을 위해

### How (어떻게 수정했나요?)
- 모듈화된 구조로 구현
- 재사용 가능한 컴포넌트 설계
- 테스트 가능한 코드 작성

## 참고
$issue_ref
- 로컬에서 테스트 완료
- 코드 리뷰 요청드립니다

---
🤖 Generated with [Claude Code](https://claude.ai/code)"
  
  echo "📝 변경사항 확인 중..."
  git status
  
  echo "\n🔄 origin/$current_branch 에 push 중..."
  git push -u origin $current_branch
  
  echo "\n🎉 PR 생성 중..."
  gh pr create --title "$title" --body "$body" --base main
}
```

## 📌 초기 설정 (처음 한 번만)

1. GitHub CLI 설치 확인:
```bash
gh --version
```

설치 안 되어 있다면:
```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh
```

2. GitHub 인증:
```bash
gh auth login
```

3. 셸 설정 파일에 함수 추가:
```bash
# zsh 사용자
echo "위의 pr() 및 team-pr() 함수를 복사" >> ~/.zshrc
source ~/.zshrc

# bash 사용자
echo "위의 pr() 및 team-pr() 함수를 복사" >> ~/.bashrc
source ~/.bashrc
```

## 🎯 사용 워크플로우

1. **작업 브랜치 생성 및 이동**
```bash
git checkout -b feature/login-improvement
```

2. **작업 수행 및 변경사항 추가**
```bash
git add .
git commit -m "feat: 로그인 기능 개선"
```

3. **간단한 PR 생성**
```bash
pr "로그인 기능 개선"
```

또는

4. **상세한 PR 생성**
```bash
team-pr "로그인 기능 개선" "#45"
```

## 💡 팁

- `git add`만 하고 commit은 자동으로 처리하려면 함수에 commit 로직 추가 가능
- PR 생성 후 자동으로 브라우저에서 열기: `gh pr view --web` 추가
- 팀 컨벤션에 맞춰 템플릿 수정 가능

## 🤝 팀원과 공유

이 파일(`CLAUDE.md`)을 프로젝트 루트에 저장하고 팀원들과 공유하세요.
각자 셸 설정에 위 함수들을 추가하면 동일한 PR 자동화를 사용할 수 있습니다.