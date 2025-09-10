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
        this.selectedEmoji = null;
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
                addBtn.addEventListener('click', () => this.showEmojiSelector(role.id));
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
     * 이모지 선택기 표시 (역할별 이모지) - 개선된 버전
     * @param {string} role - 역할 ID
     */
    showEmojiSelector(role) {
        const machine = this.machines[role];
        if (!machine) return;
        
        // 역할별 이모지 배열 가져오기
        const emojis = this.config.roleEmojis[role] || this.config.emojis;
        
        // 개선된 이모지 선택 모달 생성
        this.createImprovedEmojiModal(role, emojis);
    }
    
    /**
     * 개선된 이모지 선택 모달 생성 - 2단계 플로우
     * @param {string} role - 역할 ID
     * @param {Array} emojis - 이모지 배열
     */
    createImprovedEmojiModal(role, emojis) {
        // 기존 모달 제거
        const existingModal = document.getElementById('emojiSelectorModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 모달 생성
        const modal = document.createElement('div');
        modal.id = 'emojiSelectorModal';
        modal.className = 'emoji-selector-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = document.createElement('div');
        content.className = 'emoji-selector-content';
        content.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;
        
        // 현재 단계
        let currentStep = 1;
        let selectedEmoji = '';
        
        // 단계 표시기
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
        `;
        
        const step1Dot = document.createElement('div');
        const step2Dot = document.createElement('div');
        
        const updateProgress = () => {
            const dotStyle = `
                width: 10px;
                height: 10px;
                border-radius: 50%;
                transition: all 0.3s;
            `;
            
            step1Dot.style.cssText = dotStyle + (currentStep >= 1 ? 
                'background: #667eea; transform: scale(1.2);' : 
                'background: #ddd;');
            step2Dot.style.cssText = dotStyle + (currentStep >= 2 ? 
                'background: #667eea; transform: scale(1.2);' : 
                'background: #ddd;');
        };
        
        progressBar.appendChild(step1Dot);
        progressBar.appendChild(step2Dot);
        
        // 타이틀
        const title = document.createElement('h2');
        const roleLabel = this.config.roles.find(r => r.id === role)?.label || role;
        title.style.cssText = 'text-align: center; margin-bottom: 10px; color: #333;';
        
        const subtitle = document.createElement('p');
        subtitle.style.cssText = 'text-align: center; margin-bottom: 30px; color: #666;';
        
        // 단계별 컨텐츠 컨테이너
        const stepContainer = document.createElement('div');
        
        // 스텝 1: 이모지 선택
        const createStep1 = () => {
            title.textContent = `${roleLabel} 자판기 버튼 만들기`;
            subtitle.textContent = '좋아하는 것을 나타내는 이모지를 선택하세요!';
            
            stepContainer.innerHTML = '';
            
            const grid = document.createElement('div');
            grid.style.cssText = `
                display: grid;
                grid-template-columns: repeat(6, 1fr);
                gap: 15px;
                margin-bottom: 20px;
            `;
            
            // 이모지 버튼 생성
            emojis.forEach(emoji => {
                const emojiBtn = document.createElement('button');
                emojiBtn.className = 'emoji-selector-button';
                emojiBtn.textContent = emoji;
                emojiBtn.style.cssText = `
                    font-size: 2em;
                    padding: 15px;
                    border: 2px solid #ddd;
                    border-radius: 15px;
                    background: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                `;
                
                emojiBtn.addEventListener('mouseenter', () => {
                    emojiBtn.style.transform = 'scale(1.2)';
                    emojiBtn.style.borderColor = '#667eea';
                    emojiBtn.style.background = '#f0f4ff';
                });
                
                emojiBtn.addEventListener('mouseleave', () => {
                    if (selectedEmoji !== emoji) {
                        emojiBtn.style.transform = 'scale(1)';
                        emojiBtn.style.borderColor = '#ddd';
                        emojiBtn.style.background = 'white';
                    }
                });
                
                emojiBtn.addEventListener('click', () => {
                    // 모든 버튼 스타일 초기화
                    grid.querySelectorAll('button').forEach(btn => {
                        btn.style.transform = 'scale(1)';
                        btn.style.borderColor = '#ddd';
                        btn.style.background = 'white';
                    });
                    
                    // 선택된 버튼 강조
                    selectedEmoji = emoji;
                    emojiBtn.style.transform = 'scale(1.2)';
                    emojiBtn.style.borderColor = '#667eea';
                    emojiBtn.style.background = '#f0f4ff';
                    
                    // 자동으로 다음 단계로
                    setTimeout(() => {
                        currentStep = 2;
                        updateProgress();
                        createStep2();
                    }, 300);
                });
                
                grid.appendChild(emojiBtn);
            });
            
            stepContainer.appendChild(grid);
        };
        
        // 스텝 2: 텍스트 입력
        const createStep2 = () => {
            title.textContent = `선택한 이모지: ${selectedEmoji}`;
            subtitle.textContent = '이 이모지의 이름을 지어주세요!';
            
            stepContainer.innerHTML = '';
            
            // 큰 이모지 표시
            const bigEmoji = document.createElement('div');
            bigEmoji.textContent = selectedEmoji;
            bigEmoji.style.cssText = `
                font-size: 4em;
                text-align: center;
                margin-bottom: 20px;
                animation: bounce 0.5s ease;
            `;
            
            // 추천 텍스트
            const suggestions = {
                '🍰': ['요리하기', '베이킹', '케이크', '디저트'],
                '🍕': ['피자', '맛집탐방', '외식', '배달음식'],
                '🎮': ['게임', '플레이', '놀이', '취미'],
                '📚': ['독서', '공부', '책읽기', '도서관'],
                '🎨': ['그림그리기', '미술', '창작', '예술'],
                '⚽': ['축구', '운동', '스포츠', '경기'],
                '🎵': ['음악듣기', '노래', '멜로디', '음악감상'],
                '🚗': ['드라이브', '자동차', '여행', '운전']
            };
            
            const suggestionChips = document.createElement('div');
            suggestionChips.style.cssText = `
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                justify-content: center;
                margin-bottom: 20px;
            `;
            
            const chips = suggestions[selectedEmoji] || ['좋아해요', '즐겨요', '최고예요', '재미있어요'];
            chips.forEach(text => {
                const chip = document.createElement('button');
                chip.textContent = text;
                chip.style.cssText = `
                    padding: 6px 12px;
                    background: #e3f2fd;
                    border: 1px solid #2196f3;
                    border-radius: 15px;
                    color: #1976d2;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.2s;
                `;
                
                chip.addEventListener('click', () => {
                    textInput.value = text;
                    textInput.focus();
                });
                
                chip.addEventListener('mouseenter', () => {
                    chip.style.background = '#2196f3';
                    chip.style.color = 'white';
                });
                
                chip.addEventListener('mouseleave', () => {
                    chip.style.background = '#e3f2fd';
                    chip.style.color = '#1976d2';
                });
                
                suggestionChips.appendChild(chip);
            });
            
            // 텍스트 입력
            const textInputWrapper = document.createElement('div');
            textInputWrapper.style.cssText = 'text-align: center; margin-bottom: 20px;';
            
            const textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.placeholder = '예: 요리하기';
            textInput.maxLength = 15;
            textInput.style.cssText = `
                width: 80%;
                padding: 15px;
                font-size: 18px;
                border: 2px solid #ddd;
                border-radius: 10px;
                text-align: center;
                transition: all 0.3s;
            `;
            
            textInput.addEventListener('focus', () => {
                textInput.style.borderColor = '#667eea';
                textInput.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
            });
            
            textInput.addEventListener('blur', () => {
                textInput.style.borderColor = '#ddd';
                textInput.style.boxShadow = 'none';
            });
            
            const charCounter = document.createElement('div');
            charCounter.style.cssText = 'margin-top: 5px; font-size: 12px; color: #666;';
            charCounter.textContent = '0/15';
            
            textInput.addEventListener('input', () => {
                charCounter.textContent = `${textInput.value.length}/15`;
            });
            
            // 완성 버튼
            const completeBtn = document.createElement('button');
            completeBtn.textContent = '✅ 완성하기';
            completeBtn.style.cssText = `
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 30px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 16px;
                margin-top: 20px;
                transition: all 0.3s;
            `;
            
            completeBtn.addEventListener('click', () => {
                const text = textInput.value.trim() || '';
                this.addButtonWithEmojiAndText(role, selectedEmoji, text);
                modal.remove();
            });
            
            completeBtn.addEventListener('mouseenter', () => {
                completeBtn.style.transform = 'translateY(-2px)';
                completeBtn.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
            });
            
            completeBtn.addEventListener('mouseleave', () => {
                completeBtn.style.transform = 'translateY(0)';
                completeBtn.style.boxShadow = 'none';
            });
            
            // Enter 키로 완성
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    completeBtn.click();
                }
            });
            
            // 요소 추가
            stepContainer.appendChild(bigEmoji);
            stepContainer.appendChild(suggestionChips);
            textInputWrapper.appendChild(textInput);
            textInputWrapper.appendChild(charCounter);
            stepContainer.appendChild(textInputWrapper);
            stepContainer.appendChild(completeBtn);
            
            // 입력 필드에 자동 포커스
            setTimeout(() => {
                textInput.focus();
            }, 100);
        };
        
        // 닫기 버튼
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #666;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            transition: all 0.2s;
        `;
        
        closeBtn.addEventListener('click', () => modal.remove());
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = '#f44336';
            closeBtn.style.color = 'white';
        });
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'none';
            closeBtn.style.color = '#666';
        });
        
        // 조립
        content.appendChild(closeBtn);
        content.appendChild(progressBar);
        content.appendChild(title);
        content.appendChild(subtitle);
        content.appendChild(stepContainer);
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 초기 단계 설정
        updateProgress();
        createStep1();
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        // 애니메이션 스타일 추가
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }
    
    /**
     * 이모지와 텍스트로 버튼 추가 (개선된 버전)
     * @param {string} role - 역할 ID
     * @param {string} emoji - 선택한 이모지
     * @param {string} text - 입력한 텍스트
     */
    addButtonWithEmojiAndText(role, emoji, text) {
        const machine = this.machines[role];
        if (!machine) return;
        
        // 버튼 생성
        const button = machine.addButton({ emoji: emoji, text: text });
        
        if (button) {
            // 성공 메시지
            this.showSuccessMessage('버튼이 추가되었습니다! 🎉');
        }
    }
    
    /**
     * 성공 메시지 표시
     * @param {string} message - 메시지 내용
     */
    showSuccessMessage(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #4caf50;
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            box-shadow: 0 5px 15px rgba(76, 175, 80, 0.3);
            z-index: 10001;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 2000);
        
        // 애니메이션 스타일 추가
        if (!document.getElementById('toastAnimations')) {
            const style = document.createElement('style');
            style.id = 'toastAnimations';
            style.textContent = `
                @keyframes slideInUp {
                    from { opacity: 0; transform: translate(-50%, 100%); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
                @keyframes slideOutDown {
                    from { opacity: 1; transform: translate(-50%, 0); }
                    to { opacity: 0; transform: translate(-50%, 100%); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * 기존 이모지 선택기 표시 (호환성 유지)
     * @param {string} role - 역할 ID
     */
    showEmojiSelectorLegacy(role) {
        const machine = this.machines[role];
        if (!machine) return;
        
        // 역할별 이모지 배열 가져오기
        const emojis = this.config.roleEmojis[role] || this.config.emojis;
        
        // 이모지 선택 모달 생성
        this.createEmojiSelectorModal(role, emojis);
    }
    
    /**
     * 이모지 선택 모달 생성 (기존 버전)
     * @param {string} role - 역할 ID
     * @param {Array} emojis - 이모지 배열
     */
    createEmojiSelectorModal(role, emojis) {
        // 기존 모달 제거
        const existingModal = document.getElementById('emojiSelectorModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 모달 생성
        const modal = document.createElement('div');
        modal.id = 'emojiSelectorModal';
        modal.className = 'emoji-selector-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = document.createElement('div');
        content.className = 'emoji-selector-content';
        content.style.cssText = `
            background: white;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            max-height: 80vh;
            overflow: auto;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        `;
        
        // 타이틀
        const title = document.createElement('h2');
        const roleLabel = this.config.roles.find(r => r.id === role)?.label || role;
        title.textContent = `${roleLabel} 자판기 버튼 만들기`;
        title.style.cssText = 'text-align: center; margin-bottom: 10px; color: #333;';
        
        const subtitle = document.createElement('p');
        subtitle.textContent = '좋아하는 것을 나타내는 이모지를 선택하세요!';
        subtitle.style.cssText = 'text-align: center; margin-bottom: 30px; color: #666;';
        
        // 이모지 그리드
        const grid = document.createElement('div');
        grid.className = 'emoji-selector-grid';
        grid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            gap: 15px;
            margin-bottom: 20px;
        `;
        
        // 이모지 버튼 생성
        emojis.forEach(emoji => {
            const emojiBtn = document.createElement('button');
            emojiBtn.className = 'emoji-selector-button';
            emojiBtn.textContent = emoji;
            emojiBtn.style.cssText = `
                font-size: 2em;
                padding: 15px;
                border: 2px solid #ddd;
                border-radius: 15px;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            
            emojiBtn.addEventListener('mouseenter', () => {
                emojiBtn.style.transform = 'scale(1.2)';
                emojiBtn.style.borderColor = '#667eea';
                emojiBtn.style.background = '#f0f4ff';
            });
            
            emojiBtn.addEventListener('mouseleave', () => {
                emojiBtn.style.transform = 'scale(1)';
                emojiBtn.style.borderColor = '#ddd';
                emojiBtn.style.background = 'white';
            });
            
            emojiBtn.addEventListener('click', () => {
                this.addButtonWithEmoji(role, emoji);
                modal.remove();
            });
            
            grid.appendChild(emojiBtn);
        });
        
        // 닫기 버튼
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '취소';
        closeBtn.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            display: block;
            margin: 20px auto 0;
        `;
        closeBtn.addEventListener('click', () => modal.remove());
        
        // 조립
        content.appendChild(title);
        content.appendChild(subtitle);
        content.appendChild(grid);
        content.appendChild(closeBtn);
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    /**
     * 선택한 이모지로 버튼 추가 (기존 버전 - 개선)
     * @param {string} role - 역할 ID
     * @param {string} emoji - 선택한 이모지
     */
    addButtonWithEmoji(role, emoji) {
        const machine = this.machines[role];
        if (!machine) return;
        
        // 선택한 이모지로 버튼 생성
        const button = machine.addButton({ emoji: emoji, text: '' });
        if (button) {
            // 입력 필드에 포커스 - 타이밍 개선
            requestAnimationFrame(() => {
                const buttonElement = document.querySelector(`[data-button-id="${button.id}"] .button-input`);
                if (buttonElement) {
                    buttonElement.focus();
                    buttonElement.select(); // 전체 선택
                    
                    // 시각적 피드백
                    const vendingButton = buttonElement.closest('.vending-button');
                    if (vendingButton) {
                        vendingButton.style.animation = 'pulse 0.5s ease';
                        setTimeout(() => {
                            vendingButton.style.animation = '';
                        }, 500);
                    }
                }
            });
            
            // 안내 메시지
            this.showHelpTooltip(button.id, '이제 텍스트를 입력해주세요!');
        }
    }
    
    /**
     * 도움말 툴팁 표시
     * @param {string} buttonId - 버튼 ID
     * @param {string} message - 메시지
     */
    showHelpTooltip(buttonId, message) {
        const buttonElement = document.querySelector(`[data-button-id="${buttonId}"]`);
        if (!buttonElement) return;
        
        const tooltip = document.createElement('div');
        tooltip.textContent = message;
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1001;
            margin-bottom: 5px;
            animation: fadeIn 0.3s ease;
        `;
        
        // 화살표 추가
        const arrow = document.createElement('div');
        arrow.style.cssText = `
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-top: 5px solid #333;
        `;
        
        tooltip.appendChild(arrow);
        buttonElement.style.position = 'relative';
        buttonElement.appendChild(tooltip);
        
        // 3초 후 제거
        setTimeout(() => {
            tooltip.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => tooltip.remove(), 300);
        }, 3000);
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
     * 이모지 피커 초기화 (버튼 수정용)
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
     * 이모지 피커 생성 (버튼 수정용)
     */
    createEmojiPicker() {
        const picker = document.createElement('div');
        picker.id = 'emojiPicker';
        picker.className = 'emoji-picker';
        
        // 현재 역할의 이모지 사용
        const updatePickerEmojis = () => {
            const emojis = this.config.roleEmojis[this.currentRole] || this.config.emojis;
            picker.innerHTML = '';
            
            emojis.forEach(emoji => {
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
        };
        
        updatePickerEmojis();
        document.body.appendChild(picker);
        this.emojiPicker = picker;
        this.updatePickerEmojis = updatePickerEmojis;
    }
    
    /**
     * 이모지 피커 표시
     * @param {string} buttonId - 버튼 ID
     */
    showEmojiPicker(buttonId) {
        this.currentEmojiButton = buttonId;
        
        // 현재 역할에 맞는 이모지로 업데이트
        if (this.updatePickerEmojis) {
            this.updatePickerEmojis();
        }
        
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
                
                // 텍스트 입력 필드로 포커스 이동
                requestAnimationFrame(() => {
                    const inputElement = document.querySelector(`[data-button-id="${buttonId}"] .button-input`);
                    if (inputElement) {
                        inputElement.focus();
                        inputElement.select();
                    }
                });
                
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
        
        // 이모지 선택 모달 닫기
        const emojiModal = document.getElementById('emojiSelectorModal');
        if (emojiModal) {
            emojiModal.remove();
        }
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