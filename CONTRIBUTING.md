# 기여 가이드라인 🤝

우리 가족 자판기 프로젝트에 기여해주셔서 감사합니다!

## 📢 행동 강령

이 프로젝트는 교육용 프로젝트로, 모든 참여자는 다음을 준수해야 합니다:

- 타인을 존중하고 친절하게 대하기
- 건설적인 피드백 제공
- 아이들이 사용하기 안전한 콘텐츠 유지

## 🎯 기여 방법

### 1. 버그 신고

버그를 발견하셨나요? GitHub Issues에 등록해주세요:

1. 버그가 이미 등록되어 있는지 확인
2. 새 Issue 생성
3. 다음 정보 포함:
   - 버그 설명
   - 재현 방법
   - 예상 동작
   - 실제 동작
   - 브라우저 및 버전 정보

### 2. 기능 제안

새로운 기능 아이디어가 있으신가요?

1. Issues에 "기능 제안" 레이블로 등록
2. 다음 내용 포함:
   - 기능 설명
   - 필요한 이유
   - 구현 방법 제안 (선택사항)

### 3. 코드 기여

#### 준비 사항

```bash
# 저장소 Fork
# GitHub에서 Fork 버튼 클릭

# 로컬에 클론
git clone https://github.com/[your-username]/family-vending-machine.git
cd family-vending-machine

# 원본 저장소를 upstream으로 추가
git remote add upstream https://github.com/plusiam/family-vending-machine.git

# 새 브랜치 생성
git checkout -b feature/your-feature-name
```

#### 코드 스타일 가이드

**JavaScript**
```javascript
// 함수는 camelCase 사용
function addVendingButton() {
    // 들여쓰기: 4칸 스페이스
    const button = document.createElement('div');
    
    // 주석은 명확하게
    // TODO: 미완성 기능 표시
}

// 클래스는 PascalCase
class VendingMachine {
    constructor() {
        // ...
    }
}

// 상수는 UPPER_SNAKE_CASE
const MAX_BUTTONS = 12;
```

**CSS**
```css
/* BEM 명명 규칙 사용 */
.vending-machine {
    /* 속성 순서: 레이아웃 > 스타일 > 기타 */
    display: flex;
    background: white;
    transition: all 0.3s ease;
}

.vending-machine__button {
    /* 컴포넌트 */
}

.vending-machine__button--active {
    /* 상태 변형 */
}
```

**HTML**
```html
<!-- 시맨틱 HTML 사용 -->
<section class="vending-machine">
    <header class="machine-header">
        <h2>엄마 자판기</h2>
    </header>
    
    <!-- 접근성 속성 포함 -->
    <button aria-label="버튼 추가" role="button">
        ➕ 추가
    </button>
</section>
```

#### 커밋 메시지 규칙

```
<type>: <subject>

<body>

<footer>
```

**Type:**
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 변경
- `style`: 코드 스타일 변경
- `refactor`: 코드 리팩토링
- `test`: 테스트 추가/수정
- `chore`: 빌드, 패키지 등

**예시:**
```
feat: QR 코드 공유 기능 추가

- QR 코드 생성 API 연동
- 공유 링크 생성 및 복사
- 카카오톡, WhatsApp 공유 지원

Resolves: #123
```

### 4. Pull Request

1. 변경사항 푸시
```bash
git push origin feature/your-feature-name
```

2. GitHub에서 Pull Request 생성

3. PR 템플릿 작성:
```markdown
## 📝 변경 사항
- 무엇을 변경했는지 설명

## 🎯 관련 이슈
- Fixes #(issue number)

## 📋 체크리스트
- [ ] 코드 스타일 가이드 준수
- [ ] 테스트 통과
- [ ] 문서 업데이트
- [ ] 모바일 호환성 확인

## 📸 스크린샷
(필요한 경우)
```

## 🧪 테스트

### 로컬 테스트

```bash
# 웹 서버 실행
python -m http.server 8000

# 브라우저에서 테스트
# http://localhost:8000
```

### 테스트 항목

- [ ] 기본 기능 동작
- [ ] 다양한 브라우저 호환성
- [ ] 모바일 반응형 디자인
- [ ] 오프라인 모드
- [ ] 인쇄 기능

## 📄 라이선스

기여하신 코드는 MIT 라이선스를 따릅니다.

## 🙏 감사합니다!

모든 기여는 프로젝트를 더 나은 교육 도구로 만드는 데 도움이 됩니다. 함께 해주셔서 감사합니다! 💜