/**
 * 우리 가족 자판기 - 자판기 클래스
 * @module VendingMachine
 */

class VendingMachine {
    /**
     * 자판기 생성자
     * @param {string} role - 가족 구성원 역할 (mom, dad, daughter, son)
     * @param {Object} config - 설정 객체
     */
    constructor(role, config = CONFIG) {
        this.role = role;
        this.config = config;
        this.buttons = [];
        this.name = '';
        this.container = null;
        this.isModified = false;
        
        this.init();
    }
    
    /**
     * 자판기 초기화
     */
    init() {
        this.container = document.getElementById(`${this.role}-machine`);
        if (!this.container) {
            console.error(`Container not found for role: ${this.role}`);
            return;
        }
        
        this.setupEventListeners();
        this.render();
    }
    
    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 이름 입력 이벤트
        const nameInput = this.container.querySelector('.name-input');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.setName(e.target.value);
            });
        }
    }
    
    /**
     * 이름 설정
     * @param {string} name - 자판기 소유자 이름
     */
    setName(name) {
        if (name.length <= this.config.machine.maxNameLength) {
            this.name = name;
            this.isModified = true;
            this.updateCharCounter();
            this.autoSave();
        }
    }
    
    /**
     * 문자 카운터 업데이트
     */
    updateCharCounter() {
        const counter = this.container.querySelector('.char-counter');
        const input = this.container.querySelector('.name-input');
        
        if (counter && input) {
            const length = this.name.length;
            const maxLength = this.config.machine.maxNameLength;
            
            counter.textContent = `${length}/${maxLength}`;
            
            // 스타일 클래스 적용
            counter.classList.remove('warning', 'error');
            input.classList.remove('error');
            
            if (length >= maxLength) {
                counter.classList.add('error');
                input.classList.add('error');
            } else if (length >= maxLength - 5) {
                counter.classList.add('warning');
            }
        }
    }
    
    /**
     * 버튼 추가
     * @param {Object} buttonData - 버튼 데이터 {emoji, text}
     * @returns {Object} 추가된 버튼 객체
     */
    addButton(buttonData = {}) {
        if (this.buttons.length >= this.config.machine.maxButtons) {
            this.showMessage('최대 버튼 개수에 도달했습니다!', 'warning');
            return null;
        }
        
        const button = {
            id: this.generateButtonId(),
            emoji: buttonData.emoji || this.config.button.defaultEmoji,
            text: buttonData.text || '',
            order: this.buttons.length + 1
        };
        
        this.buttons.push(button);
        this.isModified = true;
        this.renderButton(button);
        this.autoSave();
        
        return button;
    }
    
    /**
     * 버튼 ID 생성
     * @returns {string} 고유 버튼 ID
     */
    generateButtonId() {
        return `${this.role}-btn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * 버튼 렌더링
     * @param {Object} button - 버튼 객체
     */
    renderButton(button) {
        const buttonsGrid = this.container.querySelector('.buttons-grid');
        if (!buttonsGrid) return;
        
        const buttonElement = document.createElement('div');
        buttonElement.className = 'vending-button filled';
        buttonElement.dataset.buttonId = button.id;
        
        buttonElement.innerHTML = `
            <span class="button-number">${button.order}</span>
            <span class="button-emoji" onclick="VendingMachineApp.selectEmoji('${button.id}')">${button.emoji}</span>
            <input type="text" 
                   class="button-input" 
                   placeholder="텍스트 입력" 
                   value="${button.text}"
                   maxlength="${this.config.button.maxTextLength}"
                   onchange="VendingMachineApp.updateButtonText('${button.id}', this.value)">
            <button class="button-delete" onclick="VendingMachineApp.deleteButton('${button.id}')">×</button>
        `;
        
        buttonsGrid.appendChild(buttonElement);
        
        // 애니메이션
        if (this.config.animations.enabled) {
            buttonElement.style.animation = `fadeIn ${this.config.animations.duration.normal}ms ease`;
        }
    }
    
    /**
     * 버튼 업데이트
     * @param {string} buttonId - 버튼 ID
     * @param {Object} updates - 업데이트할 속성
     */
    updateButton(buttonId, updates) {
        const button = this.buttons.find(b => b.id === buttonId);
        if (!button) return;
        
        Object.assign(button, updates);
        this.isModified = true;
        
        // DOM 업데이트
        const buttonElement = this.container.querySelector(`[data-button-id="${buttonId}"]`);
        if (buttonElement) {
            if (updates.emoji) {
                buttonElement.querySelector('.button-emoji').textContent = updates.emoji;
            }
            if (updates.text !== undefined) {
                buttonElement.querySelector('.button-input').value = updates.text;
            }
        }
        
        this.autoSave();
    }
    
    /**
     * 버튼 삭제
     * @param {string} buttonId - 버튼 ID
     */
    deleteButton(buttonId) {
        const index = this.buttons.findIndex(b => b.id === buttonId);
        if (index === -1) return;
        
        this.buttons.splice(index, 1);
        this.isModified = true;
        
        // 순서 재정렬
        this.buttons.forEach((button, idx) => {
            button.order = idx + 1;
        });
        
        // DOM에서 제거
        const buttonElement = this.container.querySelector(`[data-button-id="${buttonId}"]`);
        if (buttonElement) {
            if (this.config.animations.enabled) {
                buttonElement.style.animation = `fadeOut ${this.config.animations.duration.fast}ms ease`;
                setTimeout(() => buttonElement.remove(), this.config.animations.duration.fast);
            } else {
                buttonElement.remove();
            }
        }
        
        this.autoSave();
    }
    
    /**
     * 모든 버튼 삭제
     */
    clearAllButtons() {
        if (!confirm('정말 모든 버튼을 삭제하시겠습니까?')) {
            return;
        }
        
        this.buttons = [];
        this.isModified = true;
        
        const buttonsGrid = this.container.querySelector('.buttons-grid');
        if (buttonsGrid) {
            buttonsGrid.innerHTML = '';
        }
        
        this.autoSave();
    }
    
    /**
     * 예시 데이터 로드
     */
    loadExample() {
        const examples = this.config.examples[this.role];
        if (!examples) return;
        
        this.clearAllButtons();
        
        examples.forEach((example, index) => {
            setTimeout(() => {
                this.addButton(example);
            }, index * 100); // 순차적 애니메이션
        });
    }
    
    /**
     * 자판기 렌더링
     */
    render() {
        const buttonsGrid = this.container.querySelector('.buttons-grid');
        if (!buttonsGrid) return;
        
        buttonsGrid.innerHTML = '';
        this.buttons.forEach(button => this.renderButton(button));
    }
    
    /**
     * 데이터 내보내기
     * @returns {Object} 자판기 데이터
     */
    toJSON() {
        return {
            role: this.role,
            name: this.name,
            buttons: this.buttons.map(b => ({
                emoji: b.emoji,
                text: b.text,
                order: b.order
            }))
        };
    }
    
    /**
     * 데이터 가져오기
     * @param {Object} data - 자판기 데이터
     */
    fromJSON(data) {
        if (!data || data.role !== this.role) return;
        
        this.name = data.name || '';
        this.buttons = [];
        
        // 이름 입력 필드 업데이트
        const nameInput = this.container.querySelector('.name-input');
        if (nameInput) {
            nameInput.value = this.name;
        }
        this.updateCharCounter();
        
        // 버튼 로드
        if (data.buttons && Array.isArray(data.buttons)) {
            data.buttons.forEach(buttonData => {
                this.addButton(buttonData);
            });
        }
    }
    
    /**
     * 자동 저장
     */
    autoSave() {
        if (!this.config.storage.autoSave) return;
        
        clearTimeout(this.autoSaveTimer);
        this.autoSaveTimer = setTimeout(() => {
            if (window.VendingMachineApp) {
                window.VendingMachineApp.saveToStorage();
            }
        }, this.config.storage.autoSaveDelay);
    }
    
    /**
     * 메시지 표시
     * @param {string} message - 메시지 내용
     * @param {string} type - 메시지 타입 (success, warning, error)
     */
    showMessage(message, type = 'info') {
        // 메시지 표시 로직 (토스트 또는 모달)
        console.log(`[${type.toUpperCase()}] ${message}`);
    }
    
    /**
     * 자판기 리셋
     */
    reset() {
        this.name = '';
        this.buttons = [];
        this.isModified = false;
        
        const nameInput = this.container.querySelector('.name-input');
        if (nameInput) {
            nameInput.value = '';
        }
        
        this.updateCharCounter();
        this.render();
    }
    
    /**
     * 유효성 검사
     * @returns {boolean} 유효 여부
     */
    validate() {
        if (!this.name || this.name.trim() === '') {
            this.showMessage('이름을 입력해주세요!', 'warning');
            return false;
        }
        
        if (this.buttons.length === 0) {
            this.showMessage('최소 1개 이상의 버튼을 추가해주세요!', 'warning');
            return false;
        }
        
        return true;
    }
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VendingMachine;
}