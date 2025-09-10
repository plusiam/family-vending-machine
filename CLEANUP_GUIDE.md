# 프로젝트 정리 가이드

## 🗑️ 정리 대상 파일/폴더

### 1. 백업 폴더들 (삭제 가능)
- `backpup/` - 오타로 만들어진 폴더
- `backup/` - 이전 버전 백업 (GitHub에 히스토리가 있으므로 불필요)

### 2. 불필요한 설정 파일들 (선택적 삭제)
- `.eslintrc.json` - 심플 버전에는 불필요
- `.prettierrc` - 심플 버전에는 불필요
- `.editorconfig` - 심플 버전에는 불필요
- `CONTRIBUTING.md` - 단순 학습용에는 불필요
- `CHANGELOG.md` - 단순 학습용에는 불필요

### 3. 복잡한 기능 파일들 (선택적 보관)
- `js/` 폴더 - 풀 버전용 (index.html에서만 사용)
- `css/` 폴더 - 풀 버전용 (index.html에서만 사용)
- `service-worker.js` - PWA 기능 (풀 버전용)
- `manifest.json` - PWA 설정 (풀 버전용)
- `package.json` - npm 패키지 설정 (개발용)

### 4. 스크립트 파일
- `reorganize-files.sh` - 일회성 정리 스크립트 (삭제 가능)

## ✅ 유지해야 할 핵심 파일들

### 필수 파일
1. **simple.html** - 🌟 메인 학습용 버전
2. **README.md** - 프로젝트 설명
3. **LICENSE** - 라이선스 정보

### 선택적 유지 (풀 버전 필요시)
1. **index.html** - 풀 버전 (고급 기능)
2. **js/** 폴더 - 풀 버전 JavaScript
3. **css/** 폴더 - 풀 버전 스타일
4. **lite.html** - 경량 버전 (대안)

## 📝 정리 방법

### 옵션 1: 최소 구성 (학습용)
```
family-vending-machine/
├── simple.html      # 메인 파일
├── README.md        # 설명서
└── LICENSE          # 라이선스
```

### 옵션 2: 기본 구성 (심플 + 풀버전)
```
family-vending-machine/
├── simple.html      # 심플 버전
├── index.html       # 풀 버전
├── js/              # 풀 버전용 스크립트
├── css/             # 풀 버전용 스타일
├── README.md        # 설명서
└── LICENSE          # 라이선스
```

## 🔧 정리 명령어

```bash
# 백업 폴더 삭제
rm -rf backpup backup

# 개발 설정 파일 삭제 (선택적)
rm .eslintrc.json .prettierrc .editorconfig
rm CONTRIBUTING.md CHANGELOG.md
rm reorganize-files.sh

# PWA 관련 파일 삭제 (심플 버전만 사용시)
rm service-worker.js manifest.json
rm package.json

# 풀 버전 관련 파일 삭제 (심플 버전만 사용시)
rm -rf js css
rm index.html lite.html
```

## 💡 추천사항

**학습용으로만 사용하신다면:**
- simple.html, README.md, LICENSE만 유지
- 나머지 모든 파일 삭제

**풀 버전도 가끔 필요하시다면:**
- 옵션 2의 기본 구성 유지
- 백업 폴더와 개발 설정 파일만 삭제

---

정리 후 프로젝트가 훨씬 깔끔하고 관리하기 쉬워집니다! 😊