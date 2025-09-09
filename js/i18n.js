/**
 * 우리 가족 자판기 - 다국어 지원 모듈
 * @module i18n
 */

const translations = {
    ko: {
        // 앱 정보
        app: {
            title: '우리 가족 자판기 만들기',
            subtitle: '《엄마 자판기》 그림책을 읽고 우리 가족만의 특별한 자판기를 만들어보세요!',
            version: 'v2.0'
        },
        
        // 테마
        themes: {
            light: '밝은 테마',
            dark: '다크 테마',
            pastel: '파스텔 테마',
            kids: '키즈 테마'
        },
        
        // 역할
        roles: {
            mom: '엄마',
            dad: '아빠',
            daughter: '딸',
            son: '아들'
        },
        
        // 자판기
        machine: {
            title: '{role} 자판기',
            namePlaceholder: '이름 입력 (최대 20자)',
            charCounter: '{current}/{max}'
        },
        
        // 버튼 컨트롤
        controls: {
            addButton: '버튼 추가',
            showExample: '예시 보기',
            clearAll: '전체 삭제',
            delete: '삭제'
        },
        
        // 액션
        actions: {
            save: '저장하기',
            capture: '이미지 캡처',
            print: 'PDF 인쇄',
            export: '내보내기',
            import: '가져오기',
            reset: '전체 초기화',
            share: '공유하기'
        },
        
        // 프롬프트
        prompts: {
            enterText: '버튼 텍스트를 입력하세요:',
            confirmDelete: '정말 모든 버튼을 삭제하시겠습니까?',
            confirmReset: '모든 자판기를 초기화하시겠습니까?\n저장된 데이터가 모두 삭제됩니다.',
            selectEmoji: '이모지를 선택하세요'
        },
        
        // 메시지
        messages: {
            saved: '자판기가 저장되었습니다!',
            captured: '이미지가 캡처되었습니다!',
            exported: '데이터가 내보내졌습니다!',
            imported: '데이터를 가져왔습니다!',
            reset: '초기화되었습니다!',
            copied: '클립보드에 복사되었습니다!',
            error: '오류가 발생했습니다',
            maxButtons: '최대 버튼 개수에 도달했습니다!',
            nameTooLong: '이름이 너무 깁니다!'
        },
        
        // 캡처 옵션
        capture: {
            title: '이미지 캡처 옵션',
            subtitle: '원하는 캡처 방식을 선택하세요',
            current: '현재 자판기',
            currentDesc: '현재 보고 있는 자판기만 캡처',
            all: '전체 자판기',
            allDesc: '4개 자판기 모두 한 번에 캡처',
            individual: '개별 저장',
            individualDesc: '각 자판기를 개별 파일로 저장',
            close: '닫기'
        },
        
        // 공유
        share: {
            title: '자판기 공유하기',
            qrCode: 'QR 코드',
            qrDesc: 'QR 코드를 스캔하여 자판기 데이터를 공유하세요',
            link: '링크 복사',
            linkDesc: '링크를 복사하여 공유하세요',
            download: 'QR 코드 다운로드'
        },
        
        // 도움말
        help: {
            title: '우리 가족 자판기 사용법',
            steps: [
                '1. 각 가족 구성원의 이름을 입력하세요',
                '2. ➕ 버튼을 눌러 좋아하는 것들을 추가하세요',
                '3. 💡 예시 보기로 샘플을 확인할 수 있습니다',
                '4. 💾 저장하기로 브라우저에 저장합니다',
                '5. 📸 이미지 캡처로 이미지 파일로 저장할 수 있습니다',
                '6. 🖨️ PDF 인쇄로 출력할 수 있습니다'
            ],
            shortcuts: '단축키',
            shortcutList: [
                'Ctrl+S: 저장',
                'Ctrl+P: 인쇄',
                'ESC: 모달 닫기'
            ],
            footer: '가족과 함께 즐거운 시간 보내세요! 😊'
        }
    },
    
    en: {
        // App info
        app: {
            title: 'Family Vending Machine',
            subtitle: 'Create your own special family vending machine!',
            version: 'v2.0'
        },
        
        // Themes
        themes: {
            light: 'Light Theme',
            dark: 'Dark Theme',
            pastel: 'Pastel Theme',
            kids: 'Kids Theme'
        },
        
        // Roles
        roles: {
            mom: 'Mom',
            dad: 'Dad',
            daughter: 'Daughter',
            son: 'Son'
        },
        
        // Machine
        machine: {
            title: "{role}'s Vending Machine",
            namePlaceholder: 'Enter name (max 20 chars)',
            charCounter: '{current}/{max}'
        },
        
        // Controls
        controls: {
            addButton: 'Add Button',
            showExample: 'Show Example',
            clearAll: 'Clear All',
            delete: 'Delete'
        },
        
        // Actions
        actions: {
            save: 'Save',
            capture: 'Capture Image',
            print: 'Print PDF',
            export: 'Export',
            import: 'Import',
            reset: 'Reset All',
            share: 'Share'
        },
        
        // Prompts
        prompts: {
            enterText: 'Enter button text:',
            confirmDelete: 'Are you sure you want to delete all buttons?',
            confirmReset: 'Reset all vending machines?\nAll saved data will be deleted.',
            selectEmoji: 'Select an emoji'
        },
        
        // Messages
        messages: {
            saved: 'Vending machine saved!',
            captured: 'Image captured!',
            exported: 'Data exported!',
            imported: 'Data imported!',
            reset: 'Reset complete!',
            copied: 'Copied to clipboard!',
            error: 'An error occurred',
            maxButtons: 'Maximum number of buttons reached!',
            nameTooLong: 'Name is too long!'
        },
        
        // Capture options
        capture: {
            title: 'Image Capture Options',
            subtitle: 'Choose your capture method',
            current: 'Current Machine',
            currentDesc: 'Capture only the current machine',
            all: 'All Machines',
            allDesc: 'Capture all 4 machines at once',
            individual: 'Individual Save',
            individualDesc: 'Save each machine as separate file',
            close: 'Close'
        },
        
        // Share
        share: {
            title: 'Share Vending Machine',
            qrCode: 'QR Code',
            qrDesc: 'Scan QR code to share machine data',
            link: 'Copy Link',
            linkDesc: 'Copy link to share',
            download: 'Download QR Code'
        },
        
        // Help
        help: {
            title: 'How to Use Family Vending Machine',
            steps: [
                '1. Enter each family member\'s name',
                '2. Press ➕ to add favorite things',
                '3. Use 💡 to see examples',
                '4. Press 💾 to save to browser',
                '5. Use 📸 to capture as image',
                '6. Use 🖨️ to print as PDF'
            ],
            shortcuts: 'Keyboard Shortcuts',
            shortcutList: [
                'Ctrl+S: Save',
                'Ctrl+P: Print',
                'ESC: Close modal'
            ],
            footer: 'Have a great time with your family! 😊'
        }
    }
};

class I18n {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.translations = translations;
    }
    
    /**
     * 언어 감지
     * @returns {string} 언어 코드
     */
    detectLanguage() {
        // localStorage에서 저장된 언어 확인
        const savedLang = localStorage.getItem('vendingMachineLanguage');
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }
        
        // 브라우저 언어 확인
        const browserLang = navigator.language.toLowerCase();
        if (browserLang.startsWith('ko')) {
            return 'ko';
        } else if (browserLang.startsWith('en')) {
            return 'en';
        }
        
        // 기본값: 한국어
        return 'ko';
    }
    
    /**
     * 현재 언어 가져오기
     * @returns {string} 언어 코드
     */
    getCurrentLanguage() {
        return this.currentLang;
    }
    
    /**
     * 언어 변경
     * @param {string} lang - 언어 코드
     */
    setLanguage(lang) {
        if (!translations[lang]) {
            console.error(`Language '${lang}' not supported`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('vendingMachineLanguage', lang);
        this.updateUI();
    }
    
    /**
     * 번역 텍스트 가져오기
     * @param {string} key - 번역 키 (점 표기법)
     * @param {Object} params - 치환 매개변수
     * @returns {string} 번역된 텍스트
     */
    t(key, params = {}) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && typeof value === 'object') {
                value = value[k];
            } else {
                console.warn(`Translation key '${key}' not found for language '${this.currentLang}'`);
                return key;
            }
        }
        
        // 매개변수 치환
        if (typeof value === 'string') {
            Object.keys(params).forEach(param => {
                value = value.replace(`{${param}}`, params[param]);
            });
        }
        
        return value;
    }
    
    /**
     * UI 업데이트
     */
    updateUI() {
        // data-i18n 속성을 가진 모든 요소 업데이트
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            const text = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = text;
            } else {
                element.textContent = text;
            }
        });
        
        // data-i18n-title 속성 업데이트 (툴팁)
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.dataset.i18nTitle;
            element.title = this.t(key);
        });
        
        // 언어 선택 버튼 업데이트
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const lang = btn.dataset.lang;
            btn.classList.toggle('active', lang === this.currentLang);
        });
    }
    
    /**
     * 언어 토글
     */
    toggleLanguage() {
        const newLang = this.currentLang === 'ko' ? 'en' : 'ko';
        this.setLanguage(newLang);
    }
    
    /**
     * 지원 언어 목록
     * @returns {Array} 언어 코드 배열
     */
    getSupportedLanguages() {
        return Object.keys(this.translations);
    }
}

// 싱글톤 인스턴스 생성
const i18n = new I18n();

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { I18n, i18n };
}