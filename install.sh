#!/bin/bash
# 팀 PR 도구 설치 스크립트

echo "🔧 팀 PR 도구 설치 중..."

# 실행 권한 부여
chmod +x .claude/tools/pr

# PATH에 추가 (선택사항)
if ! grep -q ".claude/tools" ~/.bashrc; then
    echo 'export PATH="$PATH:$(pwd)/.claude/tools"' >> ~/.bashrc
    echo "✅ PATH에 추가됨 (재시작 후 적용)"
fi

# zsh 사용자용
if [ -f ~/.zshrc ] && ! grep -q ".claude/tools" ~/.zshrc; then
    echo 'export PATH="$PATH:$(pwd)/.claude/tools"' >> ~/.zshrc
    echo "✅ zsh PATH에 추가됨 (재시작 후 적용)"
fi

echo "🎉 설치 완료!"
echo ""
echo "📋 사용법:"
echo "1. git add ."
echo "2. pr '작업 내용'"
echo ""
echo "GitHub CLI 로그인이 필요하면:"
echo "gh auth login"