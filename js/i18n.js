/**
 * 우리 가족 자판기 - 다국어 지원 모듈
 * @module i18n
 */

class I18nManager {
    constructor() {
        this.currentLang = 'ko';
        this.translations = {
            ko: {
                // 헤더
                'app.title': '우리 가족 자판기 만들기',
                'app.subtitle': '《엄마 자판기》 그림책을 읽고 우리 가족만의 특별한 자판기를 만들어보세요!',
                
                // 테마
                'theme.light': '밝은 테마',
                'theme.dark': '다크 테마',
                'theme.pastel': '파스텔 테마',
                'theme.kids': '키즈 테마',
                
                // 역할
                'role.mom': '엄마',
                'role.dad': '아빠',
                'role.daughter': '딸',
                'role.son': '아들',
                'machine.mom': '엄마 자판기',
                'machine.dad': '아빠 자판기',
                'machine.daughter': '딸 자판기',
                'machine.son': '아들 자판기',
                
                // 입력
                'input.name': '이름 입력 (최대 20자)',
                'input.button.text': '텍스트 입력',
                'input.button.prompt': '버튼 텍스트를 입력하세요:',
                
                // 버튼
                'button.add': '버튼 추가',
                'button.example': '예시 보기',
                'button.clear': '전체 삭제',
                'button.save': '저장하기',
                'button.capture': '이미지 캡처',
                'button.print': 'PDF 인쇄',
                'button.export': '내보내기',
                'button.import': '가져오기',
                'button.reset': '전체 초기화',
                'button.share': 'QR 공유',
                'button.help': '도움말',
                'button.close': '닫기',
                'button.delete': '삭제',
                'button.copy': '복사',
                
                // 메시지
                'message.saved': '자판기가 저장되었습니다!',
                'message.copied': '링크가 복사되었습니다!',
                'message.maxButtons': '최대 버튼 개수에 도달했습니다!',
                'message.confirmClear': '정말 모든 버튼을 삭제하시겠습니까?',
                'message.confirmReset': '모든 자판기를 초기화하시겠습니까?\n저장된 데이터가 모두 삭제됩니다.',
                'message.captureFailed': '캡처 실패:',
                'message.importFailed': '파일 가져오기 실패:',
                'message.noData': '저장된 데이터가 없습니다.',
                
                // 캡처 옵션
                'capture.title': '이미지 캡처 옵션',
                'capture.subtitle': '원하는 캡처 방식을 선택하세요',
                'capture.current': '현재 자판기',
                'capture.currentDesc': '현재 보고 있는 자판기만 캡처',
                'capture.all': '전체 자판기',
                'capture.allDesc': '4개 자판기 모두 한 번에 캡처',
                'capture.individual': '개별 저장',
                'capture.individualDesc': '각 자판기를 개별 파일로 저장',
                
                // QR 공유
                'share.title': 'QR 코드로 공유하기',
                'share.subtitle': '스마트폰으로 QR 코드를 스캔하여 자판기를 공유하세요!',
                'share.shortLink': '짧은 링크:',
                'share.kakao': '카카오톡',
                'share.whatsapp': 'WhatsApp',
                'share.email': '이메일',
                
                // 도움말
                'help.title': '우리 가족 자판기 사용법',
                'help.content': `
1. 각 가족 구성원의 이름을 입력하세요
2. ➕ 버튼을 눌러 좋아하는 것들을 추가하세요
3. 💡 예시 보기로 샘플을 확인할 수 있습니다
4. 💾 저장하기로 브라우저에 저장합니다
5. 📸 이미지 캡처로 이미지 파일로 저장할 수 있습니다
6. 🖨️ PDF 인쇄로 출력할 수 있습니다

단축키:
Ctrl+S: 저장
Ctrl+P: 인쇄
ESC: 모달 닫기

가족과 함께 즐거운 시간 보내세요! 😊
                `,
                
                // 예시 데이터
                'example.mom.cooking': '요리하기',
                'example.mom.family': '가족시간',
                'example.mom.reading': '독서',
                'example.mom.walking': '산책',
                'example.mom.coffee': '커피타임',
                'example.mom.yoga': '요가',
                
                'example.dad.fishing': '낚시',
                'example.dad.sports': '축구',
                'example.dad.making': '만들기',
                'example.dad.driving': '드라이브',
                'example.dad.hiking': '등산',
                'example.dad.news': '신문읽기',
                
                'example.daughter.drawing': '그림그리기',
                'example.daughter.singing': '노래부르기',
                'example.daughter.dancing': '춤추기',
                'example.daughter.books': '동화책',
                'example.daughter.acting': '연극놀이',
                'example.daughter.flowers': '꽃 가꾸기',
                
                'example.son.gaming': '게임',
                'example.son.space': '우주탐험',
                'example.son.running': '달리기',
                'example.son.guitar': '기타치기',
                'example.son.basketball': '농구',
                'example.son.darts': '다트'
            },
            
            en: {
                // Header
                'app.title': 'Family Vending Machine',
                'app.subtitle': 'Create your special family vending machine after reading "Mom\'s Vending Machine"!',
                
                // Themes
                'theme.light': 'Light Theme',
                'theme.dark': 'Dark Theme',
                'theme.pastel': 'Pastel Theme',
                'theme.kids': 'Kids Theme',
                
                // Roles
                'role.mom': 'Mom',
                'role.dad': 'Dad',
                'role.daughter': 'Daughter',
                'role.son': 'Son',
                'machine.mom': 'Mom\'s Vending Machine',
                'machine.dad': 'Dad\'s Vending Machine',
                'machine.daughter': 'Daughter\'s Vending Machine',
                'machine.son': 'Son\'s Vending Machine',
                
                // Input
                'input.name': 'Enter name (max 20 chars)',
                'input.button.text': 'Enter text',
                'input.button.prompt': 'Enter button text:',
                
                // Buttons
                'button.add': 'Add Button',
                'button.example': 'Show Example',
                'button.clear': 'Clear All',
                'button.save': 'Save',
                'button.capture': 'Capture Image',
                'button.print': 'Print PDF',
                'button.export': 'Export',
                'button.import': 'Import',
                'button.reset': 'Reset All',
                'button.share': 'QR Share',
                'button.help': 'Help',
                'button.close': 'Close',
                'button.delete': 'Delete',
                'button.copy': 'Copy',
                
                // Messages
                'message.saved': 'Vending machine saved!',
                'message.copied': 'Link copied!',
                'message.maxButtons': 'Maximum buttons reached!',
                'message.confirmClear': 'Delete all buttons?',
                'message.confirmReset': 'Reset all machines?\nAll saved data will be deleted.',
                'message.captureFailed': 'Capture failed:',
                'message.importFailed': 'Import failed:',
                'message.noData': 'No saved data.',
                
                // Capture Options
                'capture.title': 'Image Capture Options',
                'capture.subtitle': 'Choose capture method',
                'capture.current': 'Current Machine',
                'capture.currentDesc': 'Capture current machine only',
                'capture.all': 'All Machines',
                'capture.allDesc': 'Capture all 4 machines',
                'capture.individual': 'Individual Save',
                'capture.individualDesc': 'Save each machine separately',
                
                // QR Share
                'share.title': 'Share via QR Code',
                'share.subtitle': 'Scan QR code to share your vending machine!',
                'share.shortLink': 'Short link:',
                'share.kakao': 'KakaoTalk',
                'share.whatsapp': 'WhatsApp',
                'share.email': 'Email',
                
                // Help
                'help.title': 'How to Use',
                'help.content': `
1. Enter each family member's name
2. Click ➕ to add favorite things
3. Use 💡 to see examples
4. 💾 Save to browser
5. 📸 Capture as image
6. 🖨️ Print as PDF

Shortcuts:
Ctrl+S: Save
Ctrl+P: Print
ESC: Close modal

Have fun with your family! 😊
                `,
                
                // Example Data
                'example.mom.cooking': 'Cooking',
                'example.mom.family': 'Family Time',
                'example.mom.reading': 'Reading',
                'example.mom.walking': 'Walking',
                'example.mom.coffee': 'Coffee Time',
                'example.mom.yoga': 'Yoga',
                
                'example.dad.fishing': 'Fishing',
                'example.dad.sports': 'Soccer',
                'example.dad.making': 'DIY',
                'example.dad.driving': 'Driving',
                'example.dad.hiking': 'Hiking',
                'example.dad.news': 'Reading News',
                
                'example.daughter.drawing': 'Drawing',
                'example.daughter.singing': 'Singing',
                'example.daughter.dancing': 'Dancing',
                'example.daughter.books': 'Story Books',
                'example.daughter.acting': 'Acting',
                'example.daughter.flowers': 'Gardening',
                
                'example.son.gaming': 'Gaming',
                'example.son.space': 'Space Exploration',
                'example.son.running': 'Running',
                'example.son.guitar': 'Playing Guitar',
                'example.son.basketball': 'Basketball',
                'example.son.darts': 'Darts'
            }
        };
    }
    
    /**
     * 현재 언어 설정
     * @param {string} lang - 언어 코드
     */
    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            this.updateDOM();
            this.saveLanguagePreference();
        }
    }
    
    /**
     * 현재 언어 가져오기
     * @returns {string} 언어 코드
     */
    getLanguage() {
        return this.currentLang;
    }
    
    /**
     * 번역 텍스트 가져오기
     * @param {string} key - 번역 키
     * @param {Object} params - 파라미터
     * @returns {string} 번역된 텍스트
     */
    t(key, params = {}) {
        const translation = this.translations[this.currentLang][key] || 
                          this.translations['ko'][key] || 
                          key;
        
        // 파라미터 치환
        let result = translation;
        for (const param in params) {
            result = result.replace(`{${param}}`, params[param]);
        }
        
        return result;
    }
    
    /**
     * DOM 업데이트
     */
    updateDOM() {
        // data-i18n 속성을 가진 모든 요소 업데이트
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            
            if (element.tagName === 'INPUT') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        });
        
        // data-i18n-title 속성 업데이트
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
        
        // HTML lang 속성 업데이트
        document.documentElement.lang = this.currentLang;
    }
    
    /**
     * 언어 설정 저장
     */
    saveLanguagePreference() {
        localStorage.setItem('familyVendingLang', this.currentLang);
    }
    
    /**
     * 언어 설정 로드
     */
    loadLanguagePreference() {
        const saved = localStorage.getItem('familyVendingLang');
        if (saved && this.translations[saved]) {
            this.currentLang = saved;
        } else {
            // 브라우저 언어 감지
            const browserLang = navigator.language.substring(0, 2);
            if (this.translations[browserLang]) {
                this.currentLang = browserLang;
            }
        }
    }
    
    /**
     * 언어 전환 UI 생성
     * @returns {HTMLElement} 언어 선택기
     */
    createLanguageSelector() {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        selector.innerHTML = `
            <button class="lang-btn ${this.currentLang === 'ko' ? 'active' : ''}" 
                    onclick="i18n.setLanguage('ko')">
                🇰🇷 한국어
            </button>
            <button class="lang-btn ${this.currentLang === 'en' ? 'active' : ''}" 
                    onclick="i18n.setLanguage('en')">
                🇺🇸 English
            </button>
        `;
        
        return selector;
    }
    
    /**
     * 초기화
     */
    init() {
        this.loadLanguagePreference();
        this.updateDOM();
    }
}

// 싱글톤 인스턴스 생성
const i18n = new I18nManager();

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18nManager, i18n };
}