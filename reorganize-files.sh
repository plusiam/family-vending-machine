#!/bin/bash

# 파일 구조 정리 스크립트
# 이 스크립트는 GitHub Pages 저장소의 파일 구조를 정리합니다.

echo "🔧 우리 가족 자판기 - 파일 구조 정리"
echo "====================================="

# 1. backup 폴더 생성
echo "📁 backup 폴더 생성 중..."
mkdir -p backup

# 2. 백업 파일 이동
echo "📦 백업 파일 이동 중..."
if [ -f "index-fixed.html" ]; then
    mv index-fixed.html backup/
    echo "  ✅ index-fixed.html → backup/ 이동 완료"
fi

if [ -f "index-fixed2.html" ]; then
    cp index-fixed2.html backup/
    echo "  ✅ index-fixed2.html → backup/ 복사 완료"
fi

# 3. index.html 복구
echo "🔄 index.html 복구 중..."
if [ -f "index-fixed2.html" ]; then
    cp index-fixed2.html index.html
    echo "  ✅ index.html 복구 완료 (index-fixed2.html 버전 사용)"
    rm index-fixed2.html
    echo "  ✅ 원본 index-fixed2.html 삭제 완료"
fi

# 4. README 생성
echo "📝 backup/README.md 생성 중..."
cat > backup/README.md << 'EOF'
# 백업 파일 폴더

이 폴더는 개발 과정에서 생성된 백업 파일들을 보관합니다.

## 파일 목록

- `index-fixed.html` - 버튼 크기 수정 시도 버전 (25,776 bytes)
- `index-fixed2.html` - 원본과 유사한 백업 버전 (32,951 bytes)

## 주의사항

- 이 파일들은 개발 참고용입니다
- 실제 배포에는 루트 디렉토리의 `index.html`을 사용하세요
- 필요시 이 파일들을 참고하여 기능을 복구할 수 있습니다

## 버전 히스토리

- 2025-09-09: 버튼 크기 문제 수정 중 생성
- 2025-09-10: backup 폴더로 이동 및 정리
EOF

echo "  ✅ backup/README.md 생성 완료"

# 5. 완료 메시지
echo ""
echo "✨ 파일 구조 정리 완료!"
echo ""
echo "📂 현재 구조:"
echo "  ├── index.html (메인 - 복구됨)"
echo "  ├── lite.html (경량 버전)"
echo "  └── backup/"
echo "      ├── README.md"
echo "      ├── index-fixed.html"
echo "      └── index-fixed2.html"
echo ""
echo "🚀 이제 git add, commit, push를 실행하세요!"
