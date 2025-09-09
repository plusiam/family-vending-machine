/**
 * 우리 가족 자판기 - 캡처 모듈
 * @module Capture
 */

class CaptureManager {
    constructor(config = CONFIG) {
        this.config = config;
        this.isCapturing = false;
    }
    
    /**
     * html2canvas 라이브러리 로드 확인
     * @returns {boolean} 로드 여부
     */
    isLibraryLoaded() {
        return typeof html2canvas !== 'undefined';
    }
    
    /**
     * 요소 캡처
     * @param {HTMLElement} element - 캡처할 요소
     * @param {Object} options - 캡처 옵션
     * @returns {Promise<Canvas>} 캔버스 객체
     */
    async captureElement(element, options = {}) {
        if (!this.isLibraryLoaded()) {
            throw new Error('html2canvas library is not loaded');
        }
        
        if (this.isCapturing) {
            throw new Error('Capture already in progress');
        }
        
        this.isCapturing = true;
        this.showLoadingIndicator();
        
        try {
            const defaultOptions = {
                scale: this.config.capture.scale,
                logging: false,
                useCORS: true,
                backgroundColor: '#ffffff',
                ...options
            };
            
            const canvas = await html2canvas(element, defaultOptions);
            return canvas;
        } finally {
            this.isCapturing = false;
            this.hideLoadingIndicator();
        }
    }
    
    /**
     * 현재 탭 캡처
     * @returns {Promise<void>}
     */
    async captureCurrentTab() {
        try {
            const activeTab = document.querySelector('.tab-content.active .vending-machine');
            if (!activeTab) {
                throw new Error('No active tab found');
            }
            
            const canvas = await this.captureElement(activeTab);
            this.downloadCanvas(canvas, this.generateFilename('current'));
            this.showSuccessMessage('현재 자판기가 캡처되었습니다!');
        } catch (error) {
            console.error('Failed to capture current tab:', error);
            this.showErrorMessage('캡처 실패: ' + error.message);
        }
    }
    
    /**
     * 모든 자판기 캡처 (한 장으로)
     * @returns {Promise<void>}
     */
    async captureAllMachines() {
        try {
            // 임시 컨테이너 생성
            const tempContainer = document.createElement('div');
            tempContainer.style.cssText = `
                position: fixed;
                left: -9999px;
                top: 0;
                width: 1200px;
                background: white;
                padding: 20px;
            `;
            document.body.appendChild(tempContainer);
            
            // 모든 자판기 복사
            const machines = document.querySelectorAll('.vending-machine');
            const title = document.createElement('h1');
            title.textContent = '우리 가족 자판기';
            title.style.cssText = 'text-align: center; margin-bottom: 30px; color: #333;';
            tempContainer.appendChild(title);
            
            const grid = document.createElement('div');
            grid.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;';
            
            machines.forEach(machine => {
                const clone = machine.cloneNode(true);
                // 불필요한 요소 제거
                clone.querySelectorAll('.button-controls, .button-delete').forEach(el => el.remove());
                grid.appendChild(clone);
            });
            
            tempContainer.appendChild(grid);
            
            // 캡처
            const canvas = await this.captureElement(tempContainer);
            this.downloadCanvas(canvas, this.generateFilename('all'));
            
            // 임시 컨테이너 제거
            document.body.removeChild(tempContainer);
            
            this.showSuccessMessage('모든 자판기가 캡처되었습니다!');
        } catch (error) {
            console.error('Failed to capture all machines:', error);
            this.showErrorMessage('캡처 실패: ' + error.message);
        }
    }
    
    /**
     * 개별 자판기 캡처 (각각 파일로)
     * @returns {Promise<void>}
     */
    async captureIndividually() {
        try {
            const machines = document.querySelectorAll('.vending-machine');
            const roles = ['mom', 'dad', 'daughter', 'son'];
            
            for (let i = 0; i < machines.length; i++) {
                const machine = machines[i];
                const role = roles[i];
                
                // 캡처 전 준비
                const clone = machine.cloneNode(true);
                clone.querySelectorAll('.button-controls, .button-delete').forEach(el => el.remove());
                
                const tempContainer = document.createElement('div');
                tempContainer.style.cssText = `
                    position: fixed;
                    left: -9999px;
                    top: 0;
                    width: 600px;
                    background: white;
                    padding: 20px;
                `;
                tempContainer.appendChild(clone);
                document.body.appendChild(tempContainer);
                
                // 캡처
                const canvas = await this.captureElement(tempContainer);
                this.downloadCanvas(canvas, this.generateFilename(role));
                
                // 정리
                document.body.removeChild(tempContainer);
                
                // 다음 캡처까지 약간의 딜레이
                await this.delay(500);
            }
            
            this.showSuccessMessage('모든 자판기가 개별 파일로 저장되었습니다!');
        } catch (error) {
            console.error('Failed to capture individually:', error);
            this.showErrorMessage('캡처 실패: ' + error.message);
        }
    }
    
    /**
     * 캔버스를 이미지로 다운로드
     * @param {Canvas} canvas - 캔버스 객체
     * @param {string} filename - 파일명
     */
    downloadCanvas(canvas, filename) {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, `image/${this.config.capture.format}`, this.config.capture.quality);
    }
    
    /**
     * 파일명 생성
     * @param {string} type - 캡처 타입
     * @returns {string} 파일명
     */
    generateFilename(type) {
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
        return `${this.config.export.filePrefix}_${type}_${date}_${time}.${this.config.capture.format}`;
    }
    
    /**
     * 클립보드에 복사
     * @param {Canvas} canvas - 캔버스 객체
     * @returns {Promise<void>}
     */
    async copyToClipboard(canvas) {
        try {
            canvas.toBlob(async (blob) => {
                const item = new ClipboardItem({ 'image/png': blob });
                await navigator.clipboard.write([item]);
                this.showSuccessMessage('이미지가 클립보드에 복사되었습니다!');
            });
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            this.showErrorMessage('클립보드 복사 실패');
        }
    }
    
    /**
     * 캡처 모달 표시
     */
    showCaptureModal() {
        let modal = document.getElementById('captureModal');
        
        if (!modal) {
            modal = this.createCaptureModal();
            document.body.appendChild(modal);
        }
        
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
    
    /**
     * 캡처 모달 생성
     * @returns {HTMLElement} 모달 요소
     */
    createCaptureModal() {
        const modal = document.createElement('div');
        modal.id = 'captureModal';
        modal.className = 'capture-modal';
        modal.innerHTML = `
            <div class="capture-content">
                <h2>📸 이미지 캡처 옵션</h2>
                <p>원하는 캡처 방식을 선택하세요</p>
                
                <div class="capture-options">
                    <div class="capture-option" onclick="captureManager.captureCurrentTab()">
                        <span style="font-size: 3em;">📷</span>
                        <h3>현재 자판기</h3>
                        <p>현재 보고 있는 자판기만 캡처</p>
                    </div>
                    
                    <div class="capture-option" onclick="captureManager.captureAllMachines()">
                        <span style="font-size: 3em;">🖼️</span>
                        <h3>전체 자판기</h3>
                        <p>4개 자판기 모두 한 번에 캡처</p>
                    </div>
                    
                    <div class="capture-option" onclick="captureManager.captureIndividually()">
                        <span style="font-size: 3em;">📁</span>
                        <h3>개별 저장</h3>
                        <p>각 자판기를 개별 파일로 저장</p>
                    </div>
                </div>
                
                <button class="close-modal" onclick="captureManager.closeCaptureModal()">닫기</button>
            </div>
        `;
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeCaptureModal();
            }
        });
        
        return modal;
    }
    
    /**
     * 캡처 모달 닫기
     */
    closeCaptureModal() {
        const modal = document.getElementById('captureModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * 로딩 인디케이터 표시
     */
    showLoadingIndicator() {
        let spinner = document.getElementById('loadingSpinner');
        
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'loadingSpinner';
            spinner.className = 'loading-spinner';
            spinner.innerHTML = '<div class="spinner"></div>';
            document.body.appendChild(spinner);
        }
        
        spinner.classList.add('show');
    }
    
    /**
     * 로딩 인디케이터 숨기기
     */
    hideLoadingIndicator() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.classList.remove('show');
        }
    }
    
    /**
     * 성공 메시지 표시
     * @param {string} message - 메시지 내용
     */
    showSuccessMessage(message) {
        this.showToast(message, 'success');
    }
    
    /**
     * 에러 메시지 표시
     * @param {string} message - 메시지 내용
     */
    showErrorMessage(message) {
        this.showToast(message, 'error');
    }
    
    /**
     * 토스트 메시지 표시
     * @param {string} message - 메시지 내용
     * @param {string} type - 메시지 타입
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }
    
    /**
     * 딜레이 유틸리티
     * @param {number} ms - 밀리초
     * @returns {Promise<void>}
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * 캡처 미리보기
     * @param {Canvas} canvas - 캔버스 객체
     */
    showPreview(canvas) {
        const preview = document.createElement('div');
        preview.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            z-index: 10001;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
        `;
        
        const img = document.createElement('img');
        img.src = canvas.toDataURL();
        img.style.cssText = 'max-width: 100%; height: auto;';
        
        const buttons = document.createElement('div');
        buttons.style.cssText = 'margin-top: 20px; text-align: center;';
        buttons.innerHTML = `
            <button onclick="captureManager.downloadCanvas(canvas, 'preview.png')" 
                    style="padding: 10px 20px; margin: 0 10px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">
                다운로드
            </button>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="padding: 10px 20px; margin: 0 10px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">
                닫기
            </button>
        `;
        
        preview.appendChild(img);
        preview.appendChild(buttons);
        document.body.appendChild(preview);
    }
}

// 싱글톤 인스턴스 생성
const captureManager = new CaptureManager();

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CaptureManager, captureManager };
}