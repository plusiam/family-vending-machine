/**
 * 우리 가족 자판기 - QR 코드 공유 모듈
 * @module QRShare
 */

class QRShareManager {
    constructor(config = CONFIG) {
        this.config = config;
        this.qrApiUrl = 'https://api.qrserver.com/v1/create-qr-code/';
    }
    
    /**
     * QR 코드 생성
     * @param {string} data - QR 코드에 담을 데이터
     * @param {Object} options - QR 코드 옵션
     * @returns {string} QR 코드 이미지 URL
     */
    generateQRCode(data, options = {}) {
        const defaultOptions = {
            size: 200,
            margin: 10,
            color: '000000',
            bgcolor: 'ffffff',
            format: 'png'
        };
        
        const qrOptions = { ...defaultOptions, ...options };
        
        // URL 파라미터 생성
        const params = new URLSearchParams({
            data: data,
            size: `${qrOptions.size}x${qrOptions.size}`,
            margin: qrOptions.margin,
            color: qrOptions.color,
            bgcolor: qrOptions.bgcolor,
            format: qrOptions.format
        });
        
        return `${this.qrApiUrl}?${params.toString()}`;
    }
    
    /**
     * 공유 링크 생성
     * @param {Object} data - 공유할 데이터
     * @returns {string} 공유 링크
     */
    createShareLink(data) {
        // 데이터를 압축하고 인코딩
        const compressed = this.compressData(data);
        const encoded = btoa(encodeURIComponent(JSON.stringify(compressed)));
        
        // 현재 페이지 URL 가져오기
        const baseUrl = window.location.origin + window.location.pathname;
        
        // 공유 링크 생성
        return `${baseUrl}?share=${encoded}`;
    }
    
    /**
     * 공유 링크에서 데이터 추출
     * @returns {Object|null} 추출된 데이터
     */
    extractShareData() {
        const urlParams = new URLSearchParams(window.location.search);
        const shareData = urlParams.get('share');
        
        if (!shareData) {
            return null;
        }
        
        try {
            const decoded = JSON.parse(decodeURIComponent(atob(shareData)));
            return this.decompressData(decoded);
        } catch (error) {
            console.error('Failed to extract share data:', error);
            return null;
        }
    }
    
    /**
     * 데이터 압축
     * @param {Object} data - 원본 데이터
     * @returns {Object} 압축된 데이터
     */
    compressData(data) {
        // 간단한 압축: 필수 데이터만 추출
        const compressed = {
            v: '2.0', // 버전
            t: data.theme?.charAt(0) || 'l', // 테마 첫글자
            m: {} // 머신 데이터
        };
        
        if (data.machines) {
            for (const role in data.machines) {
                const machine = data.machines[role];
                if (machine.buttons && machine.buttons.length > 0) {
                    compressed.m[role.charAt(0)] = {
                        n: machine.name || '',
                        b: machine.buttons.map(b => ({
                            e: b.emoji,
                            t: b.text
                        }))
                    };
                }
            }
        }
        
        return compressed;
    }
    
    /**
     * 데이터 압축 해제
     * @param {Object} compressed - 압축된 데이터
     * @returns {Object} 원본 데이터
     */
    decompressData(compressed) {
        const roleMap = { m: 'mom', d: 'dad', g: 'daughter', s: 'son' };
        const themeMap = { l: 'light', d: 'dark', p: 'pastel', k: 'kids' };
        
        const data = {
            theme: themeMap[compressed.t] || 'light',
            machines: {}
        };
        
        for (const key in compressed.m) {
            const role = roleMap[key];
            if (role) {
                data.machines[role] = {
                    name: compressed.m[key].n,
                    buttons: compressed.m[key].b.map(b => ({
                        emoji: b.e,
                        text: b.t,
                        order: 0
                    }))
                };
            }
        }
        
        return data;
    }
    
    /**
     * QR 코드 모달 표시
     * @param {Object} data - 공유할 데이터
     */
    showQRModal(data) {
        const shareLink = this.createShareLink(data);
        const qrCodeUrl = this.generateQRCode(shareLink);
        
        let modal = document.getElementById('qrModal');
        if (!modal) {
            modal = this.createQRModal();
            document.body.appendChild(modal);
        }
        
        // QR 코드 이미지 업데이트
        const qrImage = modal.querySelector('#qrCodeImage');
        const shareUrlInput = modal.querySelector('#shareUrlInput');
        const shortLink = modal.querySelector('#shortLink');
        
        qrImage.src = qrCodeUrl;
        shareUrlInput.value = shareLink;
        shortLink.href = shareLink;
        shortLink.textContent = this.shortenUrl(shareLink);
        
        modal.style.display = 'flex';
        modal.classList.add('show');
    }
    
    /**
     * QR 코드 모달 생성
     * @returns {HTMLElement} 모달 요소
     */
    createQRModal() {
        const modal = document.createElement('div');
        modal.id = 'qrModal';
        modal.className = 'qr-modal';
        modal.innerHTML = `
            <div class="qr-content">
                <h2>📱 QR 코드로 공유하기</h2>
                <div class="qr-image-container">
                    <img id="qrCodeImage" alt="QR Code" />
                </div>
                <p>스마트폰으로 QR 코드를 스캔하여 자판기를 공유하세요!</p>
                
                <div class="share-url-container">
                    <input type="text" id="shareUrlInput" readonly />
                    <button onclick="qrShareManager.copyShareLink()" class="copy-btn">
                        📋 복사
                    </button>
                </div>
                
                <div class="share-options">
                    <button onclick="qrShareManager.shareViaKakao()" class="share-btn kakao-btn">
                        💬 카카오톡
                    </button>
                    <button onclick="qrShareManager.shareViaWhatsApp()" class="share-btn whatsapp-btn">
                        📱 WhatsApp
                    </button>
                    <button onclick="qrShareManager.shareViaEmail()" class="share-btn email-btn">
                        ✉️ 이메일
                    </button>
                </div>
                
                <p class="short-link">
                    짧은 링크: <a id="shortLink" href="#" target="_blank"></a>
                </p>
                
                <button class="close-modal" onclick="qrShareManager.closeQRModal()">닫기</button>
            </div>
        `;
        
        // 스타일 추가
        const style = document.createElement('style');
        style.textContent = `
            .qr-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }
            
            .qr-modal.show {
                display: flex;
            }
            
            .qr-content {
                background: white;
                padding: 30px;
                border-radius: 20px;
                max-width: 400px;
                text-align: center;
            }
            
            .qr-image-container {
                margin: 20px 0;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 15px;
            }
            
            .qr-image-container img {
                max-width: 200px;
                height: auto;
            }
            
            .share-url-container {
                display: flex;
                gap: 10px;
                margin: 20px 0;
            }
            
            .share-url-container input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 12px;
            }
            
            .copy-btn {
                padding: 10px 15px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
            }
            
            .share-options {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin: 20px 0;
            }
            
            .share-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 10px;
                cursor: pointer;
                color: white;
                font-size: 14px;
            }
            
            .kakao-btn { background: #FEE500; color: #000; }
            .whatsapp-btn { background: #25D366; }
            .email-btn { background: #EA4335; }
            
            .short-link {
                font-size: 12px;
                margin: 15px 0;
            }
            
            .short-link a {
                color: #667eea;
                text-decoration: none;
            }
        `;
        document.head.appendChild(style);
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeQRModal();
            }
        });
        
        return modal;
    }
    
    /**
     * QR 모달 닫기
     */
    closeQRModal() {
        const modal = document.getElementById('qrModal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * URL 단축
     * @param {string} url - 원본 URL
     * @returns {string} 단축된 URL 표시
     */
    shortenUrl(url) {
        if (url.length > 50) {
            return url.substring(0, 30) + '...' + url.substring(url.length - 10);
        }
        return url;
    }
    
    /**
     * 공유 링크 복사
     */
    async copyShareLink() {
        const input = document.getElementById('shareUrlInput');
        if (!input) return;
        
        try {
            await navigator.clipboard.writeText(input.value);
            this.showToast('링크가 복사되었습니다!');
        } catch (err) {
            // 폴백: 구식 방법 사용
            input.select();
            document.execCommand('copy');
            this.showToast('링크가 복사되었습니다!');
        }
    }
    
    /**
     * 카카오톡 공유
     */
    shareViaKakao() {
        const shareUrl = document.getElementById('shareUrlInput').value;
        // 카카오톡 SDK가 필요하므로 웹 공유 API 사용
        this.shareViaNative({
            title: '우리 가족 자판기',
            text: '우리 가족의 특별한 자판기를 구경해보세요!',
            url: shareUrl
        });
    }
    
    /**
     * WhatsApp 공유
     */
    shareViaWhatsApp() {
        const shareUrl = document.getElementById('shareUrlInput').value;
        const text = '우리 가족의 특별한 자판기를 구경해보세요!';
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    /**
     * 이메일 공유
     */
    shareViaEmail() {
        const shareUrl = document.getElementById('shareUrlInput').value;
        const subject = '우리 가족 자판기 공유';
        const body = `우리 가족의 특별한 자판기를 구경해보세요!\n\n${shareUrl}`;
        const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoUrl;
    }
    
    /**
     * 네이티브 공유 API
     * @param {Object} shareData - 공유 데이터
     */
    async shareViaNative(shareData) {
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Share cancelled or failed:', err);
            }
        } else {
            // 폴백: URL 복사
            this.copyShareLink();
        }
    }
    
    /**
     * 토스트 메시지 표시
     * @param {string} message - 메시지 내용
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px 25px;
            background: #333;
            color: white;
            border-radius: 10px;
            z-index: 10000;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// 싱글톤 인스턴스 생성
const qrShareManager = new QRShareManager();

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { QRShareManager, qrShareManager };
}