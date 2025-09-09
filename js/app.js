/**
 * 우리 가족 자판기 - 메인 애플리케이션
 * @module App
 */

class VendingMachineAppClass {
    constructor() {
        this.machines = {};
        this.currentTheme = 'light';
        this.currentRole = 'mom';
        this.emojiPicker = null;
        this.currentEmojiButton = null;
        this.isInitialized = false;
    }
    
    /**
     * 앱 초기화
     */
    async init() {
        if (this.isInitialized) return;
        
        console.log('Initializing Vending Machine App...');
        
        // 설정 로드
        this.config = CONFIG;
        
        // 저장소 초기화
        this.storage = storage;
        
        // 캡처 매니저 초기화
        this.captureManager = captureManager;
        
        // 자판기 인스턴스 생성
        this.initMachines();
        
        // 이벤트 리스너 설정
        this.setupEventListeners();
        
        // 저장된 데이터 로드
        this.loadData();
        
        // 테마 적용
        this.applyTheme(this.currentTheme);
        
        // 이모지 피커 초기화
        this.initEmojiPicker();
        
        this.isInitialized = true;
        console.log('App initialization complete');
    }
    
    /**
     * 자판기 인스턴스 초기화
     */
    initMachines() {
        this.config.roles.forEach(role => {
            this.machines[role.id] = new VendingMachine(role.id, this.config);
        });
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 탭 전환
        document.querySelectorAll('.tab-button').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                const role = this.config.roles[index].id;
                this.switchTab(role);
            });
        });
        
        // 테마 변경
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const theme = e.target.dataset.theme;
                this.changeTheme(theme);
            });
        });
        
        // 컨트롤 버튼
        this.config.roles.forEach(role => {
            const container = document.getElementById(`${role.id}-machine`);
            if (!container) return;
            
            // 버튼 추가
            const addBtn = container.querySelector('.add-button');
            if (addBtn) {
                addBtn.addEventListener('click', () => this.addButton(role.id));
            }
            
            // 예시 보기
            const exampleBtn = container.querySelector('.example-button');
            if (exampleBtn) {
                exampleBtn.addEventListener('click', () => this.showExample(role.id));
            }
            
            // 전체 삭제
            const clearBtn = container.querySelector('.clear-button');
            if (clearBtn) {
                clearBtn.addEventListener('click', () => this.clearButtons(role.id));
            }
        });
        
        // 액션 버튼
        document.querySelector('.save-button')?.addEventListener('click', () => this.saveData());
        document.querySelector('.capture-button')?.addEventListener('click', () => this.showCaptureModal());
        document.querySelector('.print-button')?.addEventListener('click', () => this.printMachines());
        document.querySelector('.reset-button')?.addEventListener('click', () => this.resetAll());
        document.querySelector('.export-button')?.addEventListener('click', () => this.exportData());
        document.querySelector('.import-button')?.addEventListener('click', () => this.importData());
        
        // 도움말 버튼
        document.querySelector('.help-button')?.addEventListener('click', () => this.showHelp());
        
        // 키보드 단축키
        this.setupKeyboardShortcuts();
        
        // 윈도우 이벤트
        window.addEventListener('beforeunload', (e) => this.handleBeforeUnload(e));
    }
    
    /**
     * 키보드 단축키 설정
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + S: 저장
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.saveData();
            }
            
            // Ctrl/Cmd + P: 인쇄
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault();
                this.printMachines();
            }
            
            // ESC: 모달 닫기
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }
    
    /**
     * 탭 전환
     * @param {string} role - 역할 ID
     */
    switchTab(role) {
        this.currentRole = role;
        
        // 탭 버튼 업데이트
        document.querySelectorAll('.tab-button').forEach((btn, index) => {
            const btnRole = this.config.roles[index].id;
            btn.classList.toggle('active', btnRole === role);
        });
        
        // 탭 콘텐츠 업데이트
        document.querySelectorAll('.tab-content').forEach(content => {
            const contentRole = content.id.replace('-tab', '');
            content.classList.toggle('active', contentRole === role);
        });
    }
    
    /**
     * 테마 변경
     * @param {string} theme - 테마 ID
     */
    changeTheme(theme) {
        this.currentTheme = theme;
        this.applyTheme(theme);
        
        // 버튼 상태 업데이트
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.theme === theme);
        });
    }
    
    /**
     * 테마 적용
     * @param {string} theme - 테마 ID
     */
    applyTheme(theme) {
        document.body.className = `${theme}-theme`;
    }
    
    /**
     * 버튼 추가 - 바로 빈 버튼 생성
     * @param {string} role - 역할 ID
     */
    addButton(role) {
        const machine = this.machines[role];
        if (!machine) return;
        
        // 빈 버튼을 바로 추가 (텍스트 없이)
        const button = machine.addButton({ text: '' });
        if (button) {
            // 버튼이 렌더링된 후 입력 필드에 포커스
            setTimeout(() => {
                const buttonElement = document.querySelector(`[data-button-id="${button.id}"] .button-input`);
                if (buttonElement) {
                    buttonElement.focus();
                }
            }, 100);
        }
    }
    
    /**
     * 예시 보기
     * @param {string} role - 역할 ID
     */
    showExample(role) {
        const machine = this.machines[role];
        if (machine) {
            machine.loadExample();
        }
    }
    
    /**
     * 버튼 전체 삭제
     * @param {string} role - 역할 ID
     */
    clearButtons(role) {
        const machine = this.machines[role];
        if (machine) {
            machine.clearAllButtons();
        }
    }
    
    /**
     * 이모지 피커 초기화
     */
    initEmojiPicker() {
        this.emojiPicker = document.getElementById('emojiPicker');
        if (!this.emojiPicker) {
            this.createEmojiPicker();
        }
        
        // 외부 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.emoji-picker') && !e.target.closest('.button-emoji')) {
                this.hideEmojiPicker();
            }
        });
    }
    
    /**
     * 이모지 피커 생성
     */
    createEmojiPicker() {
        const picker = document.createElement('div');
        picker.id = 'emojiPicker';
        picker.className = 'emoji-picker';
        
        this.config.emojis.forEach(emoji => {
            const option = document.createElement('span');
            option.className = 'emoji-option';
            option.textContent = emoji;
            option.addEventListener('click', () => {
                if (this.currentEmojiButton) {
                    this.selectEmojiValue(this.currentEmojiButton, emoji);
                }
            });
            picker.appendChild(option);
        });
        
        document.body.appendChild(picker);
        this.emojiPicker = picker;
    }
    
    /**
     * 이모지 피커 표시
     * @param {string} buttonId - 버튼 ID
     */
    showEmojiPicker(buttonId) {
        this.currentEmojiButton = buttonId;
        
        const buttonElement = document.querySelector(`[data-button-id="${buttonId}"] .button-emoji`);
        if (!buttonElement) return;
        
        const rect = buttonElement.getBoundingClientRect();
        this.emojiPicker.style.display = 'grid';
        this.emojiPicker.style.left = `${rect.left}px`;
        this.emojiPicker.style.top = `${rect.bottom + 10}px`;
        
        // 화면 밖으로 나가지 않도록 조정
        const pickerRect = this.emojiPicker.getBoundingClientRect();
        if (pickerRect.right > window.innerWidth) {
            this.emojiPicker.style.left = `${window.innerWidth - pickerRect.width - 10}px`;
        }
        if (pickerRect.bottom > window.innerHeight) {
            this.emojiPicker.style.top = `${rect.top - pickerRect.height - 10}px`;
        }
    }
    
    /**
     * 이모지 피커 숨기기
     */
    hideEmojiPicker() {
        if (this.emojiPicker) {
            this.emojiPicker.style.display = 'none';
            this.currentEmojiButton = null;
        }
    }
    
    /**
     * 이모지 선택 (HTML onclick용)
     * @param {string} buttonId - 버튼 ID
     */
    selectEmoji(buttonId) {
        this.showEmojiPicker(buttonId);
    }
    
    /**
     * 이모지 값 선택
     * @param {string} buttonId - 버튼 ID
     * @param {string} emoji - 이모지
     */
    selectEmojiValue(buttonId, emoji) {
        // 버튼이 속한 자판기 찾기
        for (const role in this.machines) {
            const machine = this.machines[role];
            const button = machine.buttons.find(b => b.id === buttonId);
            if (button) {
                machine.updateButton(buttonId, { emoji });
                break;
            }
        }
        
        this.hideEmojiPicker();
    }
    
    /**
     * 버튼 텍스트 업데이트
     * @param {string} buttonId - 버튼 ID
     * @param {string} text - 텍스트
     */
    updateButtonText(buttonId, text) {
        for (const role in this.machines) {
            const machine = this.machines[role];
            const button = machine.buttons.find(b => b.id === buttonId);
            if (button) {
                machine.updateButton(buttonId, { text });
                break;
            }
        }
    }
    
    /**
     * 버튼 삭제
     * @param {string} buttonId - 버튼 ID
     */
    deleteButton(buttonId) {
        for (const role in this.machines) {
            const machine = this.machines[role];
            const button = machine.buttons.find(b => b.id === buttonId);
            if (button) {
                machine.deleteButton(buttonId);
                break;
            }
        }
    }
    
    /**
     * 데이터 저장
     */
    saveData() {
        const data = this.collectData();
        
        if (this.storage.save(data)) {
            this.showSavedMessage();
            console.log('Data saved successfully');
        } else {
            alert('저장 실패! 브라우저 저장소를 확인해주세요.');
        }
    }
    
    /**
     * 저장소에 저장
     */
    saveToStorage() {
        const data = this.collectData();
        this.storage.save(data);
    }
    
    /**
     * 데이터 수집
     * @returns {Object} 전체 데이터
     */
    collectData() {
        const data = {
            theme: this.currentTheme,
            machines: {}
        };
        
        for (const role in this.machines) {
            data.machines[role] = this.machines[role].toJSON();
        }
        
        return data;
    }
    
    /**
     * 데이터 로드
     */
    loadData() {
        const data = this.storage.load();
        if (!data) return;
        
        // 테마 적용
        if (data.theme) {
            this.changeTheme(data.theme);
        }
        
        // 자판기 데이터 로드
        if (data.machines) {
            for (const role in data.machines) {
                if (this.machines[role]) {
                    this.machines[role].fromJSON(data.machines[role]);
                }
            }
        }
        
        console.log('Data loaded successfully');
    }
    
    /**
     * 저장 완료 메시지 표시
     */
    showSavedMessage() {
        const message = document.getElementById('savedMessage');
        if (message) {
            message.classList.add('show');
            setTimeout(() => {
                message.classList.remove('show');
            }, 3000);
        }
    }
    
    /**
     * 캡처 모달 표시
     */
    showCaptureModal() {
        this.captureManager.showCaptureModal();
    }
    
    /**
     * 인쇄
     */
    printMachines() {
        window.print();
    }
    
    /**
     * 전체 초기화
     */
    resetAll() {
        if (!confirm('모든 자판기를 초기화하시겠습니까?\n저장된 데이터가 모두 삭제됩니다.')) {
            return;
        }
        
        // 저장소 초기화
        this.storage.clear();
        
        // 자판기 초기화
        for (const role in this.machines) {
            this.machines[role].reset();
        }
        
        // 테마 초기화
        this.changeTheme('light');
        
        console.log('All data reset');
    }
    
    /**
     * 데이터 내보내기
     */
    exportData() {
        const data = this.collectData();
        this.storage.exportToFile(data);
    }
    
    /**
     * 데이터 가져오기
     */
    async importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            try {
                const data = await this.storage.importFromFile(file);
                
                // 데이터 적용
                if (data.theme) {
                    this.changeTheme(data.theme);
                }
                
                if (data.machines) {
                    for (const role in data.machines) {
                        if (this.machines[role]) {
                            this.machines[role].fromJSON(data.machines[role]);
                        }
                    }
                }
                
                this.showSavedMessage();
                console.log('Data imported successfully');
            } catch (error) {
                console.error('Import failed:', error);
                alert('파일 가져오기 실패: ' + error.message);
            }
        };
        
        input.click();
    }
    
    /**
     * 도움말 표시
     */
    showHelp() {
        const helpText = `
🎰 우리 가족 자판기 사용법

1. 가족 구성원 탭 선택
2. 이름 입력 (최대 20자)
3. ➕ 버튼으로 좋아하는 것 추가
4. 이모지 선택 후 텍스트 입력
5. 💡 예시로 샘플 확인 가능

💾 저장: 브라우저에 자동 저장
📸 캡처: 이미지로 저장
🖨️ 인쇄: PDF로 출력
📤 내보내기: JSON 파일로 저장
📥 가져오기: JSON 파일 불러오기

단축키:
Ctrl+S: 저장
Ctrl+P: 인쇄
ESC: 모달 닫기

가족과 함께 즐거운 시간 보내세요! 😊
        `;
        
        alert(helpText);
    }
    
    /**
     * 모든 모달 닫기
     */
    closeAllModals() {
        this.hideEmojiPicker();
        this.captureManager.closeCaptureModal();
    }
    
    /**
     * 페이지 나가기 전 처리
     * @param {Event} e - 이벤트 객체
     */
    handleBeforeUnload(e) {
        // 변경사항이 있는지 확인
        let hasChanges = false;
        for (const role in this.machines) {
            if (this.machines[role].isModified) {
                hasChanges = true;
                break;
            }
        }
        
        if (hasChanges) {
            // 자동 저장
            this.saveToStorage();
            
            // 브라우저 기본 확인 대화상자
            e.preventDefault();
            e.returnValue = '';
        }
    }
}

// 전역 인스턴스 생성
const VendingMachineApp = new VendingMachineAppClass();

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        VendingMachineApp.init();
    });
} else {
    VendingMachineApp.init();
}

// 전역 함수 등록 (HTML onclick 이벤트용)
window.VendingMachineApp = VendingMachineApp;
window.captureManager = captureManager;