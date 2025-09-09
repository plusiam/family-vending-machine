# 기여 가이드

우리 가족 자판기 프로젝트에 기여해주셔서 감사합니다! 🎉

## 🤝 기여 방법

### 1. 이슈 보고

버그를 발견하거나 개선 사항이 있다면 [이슈](https://github.com/plusiam/family-vending-machine/issues)를 생성해주세요.

#### 좋은 이슈의 예:
- **버그 보고**: 재현 방법, 예상 동작, 실제 동작을 포함
- **기능 제안**: 명확한 설명과 사용 예시
- **개선 사항**: 개선이 필요한 이유와 방법

### 2. Pull Request

1. **Fork** 저장소를 Fork합니다
2. **브랜치 생성** (`git checkout -b feature/AmazingFeature`)
3. **커밋** 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. **푸시** 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

### 3. 코드 스타일 가이드

#### JavaScript
```javascript
// 함수는 camelCase 사용
function addVendingButton() {
    // 4 스페이스 들여쓰기
    const button = document.createElement('div');
    
    // 의미 있는 변수명 사용
    const buttonText = 'Click me';
    
    // 주석은 한국어 또는 영어로 명확하게
    // 복잡한 로직은 설명 추가
}

// 클래스는 PascalCase 사용
class VendingMachine {
    constructor() {
        // ...
    }
}
```

#### CSS
```css
/* BEM 명명 규칙 사용 */
.vending-machine {
    /* 속성은 알파벳 순서로 */
    background: white;
    border-radius: 10px;
    padding: 20px;
}

.vending-machine__button {
    /* 컨텍스트를 명확히 */
}

.vending-machine__button--active {
    /* 상태 표현은 -- 사용 */
}
```

#### HTML
```html
<!-- 시맨틱 HTML 사용 -->
<section class="vending-machine">
    <!-- 접근성을 위한 ARIA 레이블 -->
    <button aria-label="버튼 추가">
        ➕ 추가
    </button>
</section>
```

### 4. 커밋 메시지 규칙

```
<type>: <subject>

<body>

<footer>
```

#### Type
- **feat**: 새로운 기능
- **fix**: 버그 수정
- **docs**: 문서 변경
- **style**: 코드 형식 변경 (세미콜론, 공백 등)
- **refactor**: 코드 리팩토링
- **test**: 테스트 추가/수정
- **chore**: 빌드 프로세스 또는 보조 도구 변경

#### 예시
```
feat: 다국어 지원 추가

한국어와 영어를 지원하는 i18n 모듈을 추가했습니다.
사용자가 언어를 선택할 수 있는 UI를 구현했습니다.


Resolves: #123
```

### 5. 테스트

새로운 기능을 추가할 때는 테스트를 포함해주세요:

```javascript
// 예시 테스트
function testVendingMachine() {
    const machine = new VendingMachine('mom');
    console.assert(machine.role === 'mom', 'Role should be mom');
    console.assert(machine.buttons.length === 0, 'Initial buttons should be empty');
    console.log('✅ All tests passed!');
}
```

### 6. 문서화

- 모든 함수와 클래스에 JSDoc 주석 추가
- README.md 업데이트 (필요시)
- 변경사항을 CHANGELOG.md에 기록

### 7. 라이선스

기여하신 코드는 MIT 라이선스를 따릅니다.

## 📝 체크리스트

Pull Request를 제출하기 전에 확인해주세요:

- [ ] 코드가 기존 스타일 가이드를 따르나요?
- [ ] 변경사항이 기존 기능을 깨트리지 않나요?
- [ ] 테스트를 추가/업데이트 했나요?
- [ ] 문서를 업데이트 했나요?
- [ ] 커밋 메시지가 규칙을 따르나요?

## 🌐 번역 기여

새로운 언어 지원을 추가하려면:

1. `js/i18n.js` 파일에 새 언어 추가
2. 모든 키에 대한 번역 제공
3. README.md에 지원 언어 업데이트

## 🐛 버그 보고

버그를 보고할 때 포함해주세요:

- 브라우저 및 버전
- 운영체제
- 재현 단계
- 예상 동작
- 실제 동작
- 스크린샷 (가능한 경우)

## 🚀 기능 제안

새로운 기능을 제안할 때:

1. 먼저 이슈를 생성하여 토론
2. 사용 사례와 예시 포함
3. 기존 기능과의 호환성 고려
4. 성능 영향 분석

## 🤔 질문이 있나요?

- [이슈](https://github.com/plusiam/family-vending-machine/issues)에 질문하기
- 이메일: yeohanki@naver.com

## 🎆 감사합니다!

여러분의 기여가 이 프로젝트를 더 나은 교육 도구로 만들어줍니다. 함께 해주셔서 감사합니다! 😊