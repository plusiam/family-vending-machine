# 🎰 우리 가족 자판기 만들기

《엄마 자판기》 그림책 연계 교육 활동을 위한 웹 애플리케이션입니다.

[![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)](https://github.com/plusiam/family-vending-machine)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Demo](https://img.shields.io/badge/demo-live-orange.svg)](https://plusiam.github.io/family-vending-machine/)

## 📚 프로젝트 소개

이 프로젝트는 《엄마 자판기》 그림책을 읽고 난 후, 가족 구성원들이 좋아하는 것들을 자판기 버튼으로 만들어보는 교육 활동입니다. 아이들과 함께 가족의 특징과 좋아하는 것들을 이야기하며 소중한 시간을 보낼 수 있습니다.

### ✨ 주요 기능

- 👨‍👩‍👧‍👦 **가족별 자판기**: 엄마, 아빠, 딸, 아들 각각의 자판기 생성
- 🎨 **이모지 선택**: 40개 이상의 다양한 이모지로 버튼 꾸미기
- 🎭 **테마 변경**: 라이트, 다크, 파스텔, 키즈 테마 지원
- 💾 **자동 저장**: 브라우저에 자동으로 데이터 저장
- 📸 **이미지 캡처**: 완성된 자판기를 이미지로 저장
- 🖨️ **PDF 인쇄**: 인쇄용 최적화된 레이아웃
- 📤 **내보내기/가져오기**: JSON 파일로 데이터 백업 및 복원
- 📱 **반응형 디자인**: 모바일, 태블릿, 데스크톱 지원

## 🚀 시작하기

### 온라인 사용

[여기를 클릭](https://plusiam.github.io/family-vending-machine/)하여 바로 사용할 수 있습니다.

### 로컬 설치

```bash
# 저장소 클론
git clone https://github.com/plusiam/family-vending-machine.git

# 디렉토리 이동
cd family-vending-machine

# 웹 서버 실행 (Python 3)
python -m http.server 8000

# 또는 Node.js 사용
npx http-server
```

브라우저에서 `http://localhost:8000` 접속

## 📁 프로젝트 구조

```
family-vending-machine/
├── index.html          # 메인 애플리케이션 (풀버전)
├── lite.html           # 경량 버전 (저사양 디바이스용)
├── css/
│   ├── main.css        # 메인 스타일
│   ├── themes.css      # 테마 스타일
│   └── print.css       # 인쇄용 스타일
├── js/
│   ├── config.js       # 설정 파일
│   ├── app.js          # 메인 애플리케이션 로직
│   ├── vending-machine.js  # 자판기 클래스
│   ├── storage.js      # 저장소 관리
│   └── capture.js      # 이미지 캡처 기능
└── README.md           # 프로젝트 문서
```

## 💻 사용 방법

### 기본 사용법

1. **가족 구성원 선택**: 상단 탭에서 엄마/아빠/딸/아들 선택
2. **이름 입력**: 각 자판기에 이름 입력 (최대 20자)
3. **버튼 추가**: ➕ 버튼을 눌러 좋아하는 것 추가
4. **이모지 선택**: 클릭하여 이모지 변경
5. **텍스트 입력**: 버튼에 설명 텍스트 입력
6. **저장**: 💾 버튼으로 저장 (자동 저장 지원)

### 고급 기능

#### 테마 변경
```javascript
// 4가지 테마 지원
- 🌞 라이트 테마 (기본)
- 🌙 다크 테마
- 🌸 파스텔 테마
- 🎈 키즈 테마
```

#### 데이터 관리
- **저장**: 브라우저 LocalStorage에 자동 저장
- **내보내기**: JSON 파일로 다운로드
- **가져오기**: JSON 파일 업로드로 복원
- **초기화**: 모든 데이터 삭제 및 초기 상태로 복원

#### 캡처 옵션
1. **현재 자판기**: 현재 보고 있는 자판기만 캡처
2. **전체 자판기**: 4개 자판기를 한 장에 캡처
3. **개별 저장**: 각 자판기를 개별 파일로 저장

### 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl+S` / `Cmd+S` | 저장 |
| `Ctrl+P` / `Cmd+P` | 인쇄 |
| `ESC` | 모달 닫기 |

## 🎯 교육 활용 방법

### 수업 활용 예시

1. **그림책 읽기**: 《엄마 자판기》 함께 읽기
2. **이야기 나누기**: 가족이 좋아하는 것들 대화
3. **자판기 만들기**: 웹앱으로 직접 제작
4. **발표하기**: 완성된 자판기 소개
5. **전시하기**: 인쇄하여 교실에 전시

### 가정 활용 예시

- 가족 구성원의 특징 알아보기
- 서로의 관심사 공유하기
- 특별한 날 선물 아이디어 얻기
- 가족 앨범에 추가하기

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage API
- **Capture**: html2canvas 라이브러리
- **Design**: 반응형 웹 디자인, CSS Grid, Flexbox
- **Compatibility**: 모든 모던 브라우저 지원

## 📱 브라우저 지원

| 브라우저 | 지원 버전 |
|---------|----------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Safari | iOS 14+ |
| Chrome Mobile | Android 90+ |

## 🤝 기여하기

프로젝트 개선에 기여하고 싶으시다면:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

MIT License - 자유롭게 사용하실 수 있습니다.

## 🙏 감사의 말

- 《엄마 자판기》 그림책 작가님께 감사드립니다
- 프로젝트를 사용해주시는 모든 선생님과 가족들께 감사드립니다
- 오픈소스 커뮤니티에 감사드립니다

## 📞 문의

- **제작자**: 룰루랄라 한기쌤
- **이메일**: yeohanki@naver.com
- **GitHub**: [@plusiam](https://github.com/plusiam)
- **프로젝트**: [family-vending-machine](https://github.com/plusiam/family-vending-machine)

---

**Made with ❤️ for Education**

가족과 함께 행복한 시간 보내세요! 😊