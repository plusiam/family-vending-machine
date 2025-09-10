#!/bin/bash

# 우리 가족 자판기 프로젝트 정리 스크립트
# 불필요한 파일과 폴더를 삭제합니다

echo "🧹 프로젝트 정리를 시작합니다..."

# 백업 폴더 삭제
if [ -d "backpup" ]; then
    rm -rf backpup
    echo "✅ backpup 폴더 삭제됨"
fi

if [ -d "backup" ]; then
    rm -rf backup
    echo "✅ backup 폴더 삭제됨"
fi

# 개발 설정 파일 삭제
files_to_delete=(
    ".eslintrc.json"
    ".prettierrc"
    ".editorconfig"
    "CONTRIBUTING.md"
    "CHANGELOG.md"
    "reorganize-files.sh"
)

for file in "${files_to_delete[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "✅ $file 삭제됨"
    fi
done

# Git에 변경사항 추가
git add -A

# 커밋
git commit -m "cleanup: 불필요한 파일 및 폴더 정리

- backpup, backup 폴더 삭제
- 개발 설정 파일 삭제 (.eslintrc.json, .prettierrc, .editorconfig)
- 불필요한 문서 삭제 (CONTRIBUTING.md, CHANGELOG.md)
- 일회성 스크립트 삭제 (reorganize-files.sh)"

# 푸시
echo ""
echo "📌 변경사항을 GitHub에 푸시하려면 다음 명령어를 실행하세요:"
echo "   git push origin main"
echo ""
echo "✨ 정리가 완료되었습니다!"
echo ""
echo "📁 현재 프로젝트 구조:"
echo "   - simple.html (심플 버전)"
echo "   - index.html (풀 버전)"
echo "   - js/, css/ (풀 버전용)"
echo "   - README.md, LICENSE"
echo ""