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
        this.draggedButton = null;
        
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
     * 이벤트 리스너 설정 - 이벤트 위임 패턴 적용
     */
    setupEventListeners() {
        // 이름 입력 이벤트
        const nameInput = this.container.querySelector('.name-input');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.setName(e.target.value);
            });
        }
        
        // 이벤트 위임 - 버튼 그리드에 한 번만 등록
        const buttonsGrid = this.container.querySelector('.buttons-grid');
        if (buttonsGrid) {
            // 클릭 이벤트 위임
            buttonsGrid.addEventListener('click', (e) => {
                // 이모지 클릭
                if (e.target.classList.contains('button-emoji')) {
                    const buttonId = e.target.closest('[data-button-id]').dataset.buttonId;
                    window.VendingMachineApp.selectEmoji(buttonId);
                }
                // 삭제 버튼 클릭
                else if (e.target.classList.contains('button-delete')) {
                    const buttonId = e.target.closest('[data-button-id]').dataset.buttonId;
                    window.VendingMachineApp.deleteButton(buttonId);
                }
            });
            
            // 체인지 이벤트 위임
            buttonsGrid.addEventListener('change', (e) => {
                if (e.target.classList.contains('button-input')) {
                    const buttonId = e.target.closest('[data-button-id]').dataset.buttonId;
                    window.VendingMachineApp.updateButtonText(buttonId, e.target.value);
                }
            });
            
            // 드래그 앤 드롭 이벤트
            this.setupDragAndDrop(buttonsGrid);
        }
    }
    
    /**
     * 드래그 앤 드롭 설정
     */
    setupDragAndDrop(container) {
        container.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('vending-button')) {
                this.draggedButton = e.target;
                e.target.style.opacity = '0.5';
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.innerHTML);
            }
        });
        
        container.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('vending-button')) {
                e.target.style.opacity = '';
            }
        });
        
        container.addEventListener('dragover', (e) => {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = this.getDragAfterElement(container, e.clientY);
            if (afterElement == null) {
                container.appendChild(this.draggedButton);
            } else {
                container.insertBefore(this.draggedButton, afterElement);
            }
            
            return false;
        });
        
        container.addEventListener('drop', (e) => {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            
            // 버튼 순서 업데이트
            this.updateButtonOrderFromDOM();
            this.isModified = true;
            this.autoSave();
            
            return false;
        });
    }
    
    /**
     * 드래그 위치 계산
     */
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.vending-button:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    /**
     * DOM에서 버튼 순서 업데이트
     */
    updateButtonOrderFromDOM() {
        const buttonElements = this.container.querySelectorAll('.vending-button');
        buttonElements.forEach((element, index) => {
            const buttonId = element.dataset.buttonId;
            const button = this.buttons.find(b => b.id === buttonId);
            if (button) {
                button.order = index + 1;
            }
            
            // 순서 번호 업데이트
            const numberSpan = element.querySelector('.button-number');
            if (numberSpan) {
                numberSpan.textContent = index + 1;
            }
        });
    }
    
    /**
     * HTML 이스케이프 (XSS 방지)
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * 입력값 검증 및 새니타이징
     */
    sanitizeInput(text) {
        // 기본 HTML 태그 제거
        const cleaned = text.replace(/<[^>]*>/g, '');
        // 길이 제한
        return cleaned.substring(0, this.config.button.maxTextLength);
    }
    
    /**
     * 이름 설정
     * @param {string} name - 자판기 소유자 이름
     */
    setName(name) {
        const sanitizedName = this.sanitizeInput(name);
        if (sanitizedName.length <= this.config.machine.maxNameLength) {
            this.name = sanitizedName;
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
            text: this.sanitizeInput(buttonData.text || ''),
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
     * 버튼 렌더링 - 접근성 개선
     * @param {Object} button - 버튼 객체
     */
    renderButton(button) {
        const buttonsGrid = this.container.querySelector('.buttons-grid');
        if (!buttonsGrid) return;
        
        const buttonElement = document.createElement('div');
        buttonElement.className = 'vending-button filled';
        buttonElement.dataset.buttonId = button.id;
        buttonElement.draggable = true; // 드래그 가능
        buttonElement.setAttribute('role', 'listitem');
        buttonElement.setAttribute('aria-label', `버튼 ${button.order}: ${button.emoji} ${button.text}`);
        
        // 버튼 번호
        const buttonNumber = document.createElement('span');
        buttonNumber.className = 'button-number';
        buttonNumber.textContent = button.order;
        buttonNumber.setAttribute('aria-hidden', 'true');
        
        // 이모지 버튼 - 접근성 개선
        const buttonEmoji = document.createElement('button');
        buttonEmoji.className = 'button-emoji';
        buttonEmoji.textContent = button.emoji;
        buttonEmoji.setAttribute('aria-label', `이모지 변경: 현재 ${button.emoji}`);
        buttonEmoji.setAttribute('tabindex', '0');
        
        // 텍스트 입력 - 접근성 개선
        const buttonInput = document.createElement('input');
        buttonInput.type = 'text';
        buttonInput.className = 'button-input';
        buttonInput.placeholder = '텍스트 입력';
        buttonInput.value = this.escapeHtml(button.text);
        buttonInput.maxLength = this.config.button.maxTextLength;
        buttonInput.setAttribute('aria-label', `버튼 ${button.order} 텍스트`);
        
        // 삭제 버튼 - 접근성 개선
        const deleteButton = document.createElement('button');
        deleteButton.className = 'button-delete';
        deleteButton.textContent = '×';
        deleteButton.setAttribute('aria-label', `버튼 ${button.order} 삭제`);
        deleteButton.setAttribute('tabindex', '0');
        
        // 버튼 요소들 추가
        buttonElement.appendChild(buttonNumber);
        buttonElement.appendChild(buttonEmoji);
        buttonElement.appendChild(buttonInput);
        buttonElement.appendChild(deleteButton);
        
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
        
        // 입력값 새니타이징
        if (updates.text !== undefined) {
            updates.text = this.sanitizeInput(updates.text);
        }
        
        Object.assign(button, updates);
        this.isModified = true;
        
        // DOM 업데이트
        const buttonElement = this.container.querySelector(`[data-button-id="${buttonId}"]`);
        if (buttonElement) {
            if (updates.emoji) {
                buttonElement.querySelector('.button-emoji').textContent = updates.emoji;
            }
            if (updates.text !== undefined) {
                buttonElement.querySelector('.button-input').value = this.escapeHtml(updates.text);
            }
            // ARIA 레이블 업데이트
            buttonElement.setAttribute('aria-label', `버튼 ${button.order}: ${button.emoji} ${button.text}`);
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
        
        // 남은 버튼들의 순서 업데이트
        this.updateButtonOrders();
        this.autoSave();
    }
    
    /**
     * 버튼 순서 업데이트
     */
    updateButtonOrders() {
        const buttonElements = this.container.querySelectorAll('.vending-button');
        buttonElements.forEach((element, index) => {
            const numberSpan = element.querySelector('.button-number');
            if (numberSpan) {
                numberSpan.textContent = index + 1;
            }
            // ARIA 레이블 업데이트
            const buttonId = element.dataset.buttonId;
            const button = this.buttons.find(b => b.id === buttonId);
            if (button) {
                element.setAttribute('aria-label', `버튼 ${index + 1}: ${button.emoji} ${button.text}`);
            }
        });
    }
    
    /**
     * 모든 버튼 삭제
     */
    clearAllButtons() {
        if (this.buttons.length === 0) {
            this.showMessage('삭제할 버튼이 없습니다.', 'info');
            return;
        }
        
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
        
        // 기존 버튼 삭제 여부 확인
        if (this.buttons.length > 0) {
            if (!confirm('예시를 불러오면 현재 버튼이 모두 삭제됩니다. 계속하시겠습니까?')) {
                return;
            }
        }
        
        // 버튼 초기화
        this.buttons = [];
        const buttonsGrid = this.container.querySelector('.buttons-grid');
        if (buttonsGrid) {
            buttonsGrid.innerHTML = '';
        }
        
        // 예시 버튼 추가
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
        buttonsGrid.setAttribute('role', 'list');
        buttonsGrid.setAttribute('aria-label', `${this.role} 자판기 버튼 목록`);
        
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
        
        this.name = this.sanitizeInput(data.name || '');
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
     * 자동 저장 - 디바운싱 적용
     */
    autoSave() {
        if (!this.config.storage.autoSave) return;
        
        // 디바운싱
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
     * @param {string} type - 메시지 타입 (success, warning, error, info)
     */
    showMessage(message, type = 'info') {
        // 토스트 메시지 생성
        const toast = document.createElement('div');
        toast.className = `toast-message toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : type === 'success' ? '#4caf50' : '#2196f3'};
            color: white;
            padding: 12px 24px;
            border-radius: 4px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // 3초 후 제거
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
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