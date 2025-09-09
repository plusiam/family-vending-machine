/**
 * 우리 가족 자판기 - QR 코드 공유 모듈
 * @module Share
 */

class ShareManager {
    constructor() {
        this.qrCodeLibLoaded = false;
        this.shareModal = null;
        this.baseURL = window.location.origin + window.location.pathname;
    }
    
    /**
     * QR 코드 라이브러리 로드
     * @returns {Promise<void>}
     */
    async loadQRCodeLibrary() {
        if (this.qrCodeLibLoaded) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
            script.onload = () => {
                this.qrCodeLibLoaded = true;
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * 공유 모달 표시
     * @param {Object} data - 공유할 데이터
     */
    async showShareModal(data) {
        // QR 코드 라이브러리 로드
        await this.loadQRCodeLibrary();
        
        // 모달 생성 또는 표시
        if (!this.shareModal) {
            this.createShareModal();
        }
        
        // 데이터 준비
        const shareData = this.prepareShareData(data);
        const shareURL = this.generateShareURL(shareData);
        
        // QR 코드 생성
        this.generateQRCode(shareURL);
        
        // URL 표시
        const urlInput = document.getElementById('shareURL');
        if (urlInput) {
            urlInput.value = shareURL;
        }
        
        // 모달 표시
        this.shareModal.style.display = 'flex';
        this.shareModal.classList.add('show');
    }
    
    /**
     * 공유 모달 생성
     */
    createShareModal() {
        const modal = document.createElement('div');
        modal.id = 'shareModal';
        modal.className = 'share-modal';
        modal.innerHTML = `
            <div class="share-content">
                <h2>🔗 자판기 공유하기</h2>
                <p>QR 코드를 스캔하거나 링크를 복사하여 공유하세요</p>
                
                <div class="share-tabs">
                    <button class="share-tab active" onclick="shareManager.switchShareTab('qr')">
                        📱 QR 코드
                    </button>
                    <button class="share-tab" onclick="shareManager.switchShareTab('link')">
                        🔗 링크 복사
                    </button>
                </div>
                
                <!-- QR 코드 탭 -->
                <div id="qr-tab" class="share-tab-content active">
                    <div id="qrcode" class="qr-container"></div>
                    <button class="download-qr-btn" onclick="shareManager.downloadQRCode()">
                        📥 QR 코드 다운로드
                    </button>
                </div>
                
                <!-- 링크 탭 -->
                <div id="link-tab" class="share-tab-content">
                    <div class="url-container">
                        <input type="text" id="shareURL" readonly class="share-url-input">
                        <button class="copy-btn" onclick="shareManager.copyLink()">
                            📋 복사
                        </button>
                    </div>
                    <div class="share-options">
                        <button class="share-btn" onclick="shareManager.shareViaWhatsApp()">
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMjVkMzY2IiBkPSJNMTcuNDcyIDE0LjM4MmMtLjI5Ny0uMTQ5LTEuNzU4LS44NjctMS45NzctLjk3LS4yMTktLjA5OS0uMzc2LS4xNDktLjUzMy4xNDktLjE1Ni4yOTctLjYxNS43NS0uNzUuOTA2LS4xMzMuMTU2LS4yNzYuMTU3LS40MzIuMDA4cy0xLjU1LS41NzItMi45NDItMi4wM2MtMS4wODYtMS4xMzctMS43MDUtMi41MzgtMS45MDItMi45NjgtLjE5Ny0uNDMyLS4wMjEtLjY2Ni4xNTYtLjg4My4xNTYtLjE5Ni41MDUtLjUxMS42NzYtLjc2Ny4xNy0uMjUzLjIyNy0uNDMxLjM0LS42NDguMTE0LS4yMTkuMDU3LS40MDEtLjAyOC0uNTYyLS4wODYtLjE2MS0uNTMzLTEuMjgzLS43My0xLjc1Ni0uMTktLjQ2My0uMzg1LS40NjQtLjUzMy0uNDY0LS4xMzYtLjAwNi0uMjkzLS4wMDgtLjQ1LS4wMDhzLS41MTUuMDcyLS43ODUuMzY3Yy0uMjcyLjI5NS0xLjAzNiAxLjAxLTEuMDM2IDIuNDY4IDAgMS40NTggMS4wNiAyLjg2OCAxLjIwOCAzLjA2Ny4xNDkuMTk5IDIuMDk1IDMuMiA1LjA3NiA0LjQ4Ny43MDkuMzA2IDEuMjYzLjQ4OSAxLjY5NC42MjYuNzEyLjIyNiAxLjM2LjE5NCAxLjg3Mi4xMTguNTcxLS4wODUgMS43NTgtLjcxOSAyLjAwNi0xLjQxMy4yNDgtLjY5NS4yNDgtMS4yOS4xNzMtMS40MTR6bTUuNDkgNy4zMDhjMCAxLjI0My0uNDguMjQ3LTEuMzMzIDMuMWwtMy4wMDcgMy4wMDdjLS44NTQuODU0LTEuODU2IDEuMzMzLTMuMSAxLjMzM0g0LjQ3OGMtMS4yNDMgMC0yLjI0Ny0uNDgtMy4xLTEuMzMzTDEuMzcxIDE3LjQ5QzEuNTE3IDE2LjY0NyAyIDE1LjY0NCAyIDE0LjRWNC40NzhDMiAzLjIzNSAyLjQ4IDIuMjMzIDMuMzMzIDEuMzc5TDYuMzQgLjM3MkM3LjE5My0uNDgyIDguMTk2IDAgOS40NCAwaDUuMDgyYzEuMjQzIDAgMi4yNDcuNDggMy4xIDEuMzMzbDMuMDA3IDMuMDA3Yy44NTQuODU0IDEuMzMzIDEuODU2IDEuMzMzIDMuMXoiLz48L3N2Zz4=" alt="WhatsApp">
                            WhatsApp
                        </button>
                        <button class="share-btn" onclick="shareManager.shareViaKakao()">
                            <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjZmZlODEyIiBkPSJNMTIgM2M1LjUxNCAwIDEwIDMuNTkyIDEwIDguMDM3IDAgNC40NDYtNC40ODYgOC4wMzctMTAgOC4wMzdhMTMuMDI0IDEzLjAyNCAwIDAgMS0yLjc5LS4zMDVsLTMuMjc1IDIuMTRhLjUuNSAwIDAgMS0uODEzLS40MTVsLjQ2LTMuMjQ4QzMuMzg0IDE1LjY0MiAyIDEzLjQ3NCAyIDExLjAzN0MyIDYuNTkxIDYuNDg2IDMgMTIgM3oiLz48L3N2Zz4=" alt="KakaoTalk">
                            카카오톡
                        </button>
                        <button class="share-btn" onclick="shareManager.shareViaNative()">
                            📤 기타
                        </button>
                    </div>
                </div>
                
                <button class="close-modal" onclick="shareManager.closeShareModal()">닫기</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.shareModal = modal;
        
        // 모달 외부 클릭 시 닫기
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeShareModal();
            }
        });
    }
    
    /**
     * 공유 데이터 준비
     * @param {Object} data - 원본 데이터
     * @returns {Object} 압축된 데이터
     */
    prepareShareData(data) {
        // 데이터 압축 및 최적화
        const compressed = {
            v: '2.0', // 버전
            t: data.theme || 'light',
            m: {}
        };
        
        // 각 자판기 데이터 압축
        if (data.machines) {
            for (const role in data.machines) {
                const machine = data.machines[role];
                if (machine.buttons && machine.buttons.length > 0) {
                    compressed.m[role] = {
                        n: machine.name || '',
                        b: machine.buttons.map(btn => ({
                            e: btn.emoji,
                            t: btn.text
                        }))
                    };
                }
            }
        }
        
        return compressed;
    }
    
    /**
     * 공유 URL 생성
     * @param {Object} data - 공유 데이터
     * @returns {string} 공유 URL
     */
    generateShareURL(data) {
        // Base64 인코딩
        const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
        
        // URL 생성
        return `${this.baseURL}?d=${encoded}`;
    }
    
    /**
     * QR 코드 생성
     * @param {string} url - URL
     */
    generateQRCode(url) {
        const container = document.getElementById('qrcode');
        if (!container) return;
        
        // 기존 QR 코드 제거
        container.innerHTML = '';
        
        // 새 QR 코드 생성
        new QRCode(container, {
            text: url,
            width: 256,
            height: 256,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
        });
    }
    
    /**
     * 공유 탭 전환
     * @param {string} tab - 탭 ID
     */
    switchShareTab(tab) {
        // 탭 버튼 업데이트
        document.querySelectorAll('.share-tab').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 탭 콘텐츠 업데이트
        document.querySelectorAll('.share-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // 선택된 탭 활성화
        const tabButton = Array.from(document.querySelectorAll('.share-tab'))
            .find(btn => btn.textContent.includes(tab === 'qr' ? 'QR' : '링크'));
        if (tabButton) {
            tabButton.classList.add('active');
        }
        
        const tabContent = document.getElementById(`${tab}-tab`);
        if (tabContent) {
            tabContent.classList.add('active');
        }
    }
    
    /**
     * QR 코드 다운로드
     */
    downloadQRCode() {
        const canvas = document.querySelector('#qrcode canvas');
        if (!canvas) return;
        
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `family-vending-machine-qr-${Date.now()}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }
    
    /**
     * 링크 복사
     */
    async copyLink() {
        const urlInput = document.getElementById('shareURL');
        if (!urlInput) return;
        
        try {
            await navigator.clipboard.writeText(urlInput.value);
            this.showToast('링크가 복사되었습니다!');
        } catch (err) {
            // 폴백: 구식 방법 사용
            urlInput.select();
            document.execCommand('copy');
            this.showToast('링크가 복사되었습니다!');
        }
    }
    
    /**
     * WhatsApp으로 공유
     */
    shareViaWhatsApp() {
        const url = document.getElementById('shareURL').value;
        const text = '우리 가족 자판기를 확인해보세요!';
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        window.open(whatsappUrl, '_blank');
    }
    
    /**
     * 카카오톡으로 공유
     */
    shareViaKakao() {
        const url = document.getElementById('shareURL').value;
        
        // 카카오 SDK가 로드되어 있지 않으면 로드
        if (!window.Kakao) {
            const script = document.createElement('script');
            script.src = 'https://developers.kakao.com/sdk/js/kakao.js';
            script.onload = () => {
                // 카카오 앱 키 설정 (실제 앱 키로 교체 필요)
                Kakao.init('YOUR_KAKAO_APP_KEY');
                this.sendKakaoMessage(url);
            };
            document.head.appendChild(script);
        } else {
            this.sendKakaoMessage(url);
        }
    }
    
    /**
     * 카카오 메시지 전송
     * @param {string} url - 공유 URL
     */
    sendKakaoMessage(url) {
        Kakao.Link.sendDefault({
            objectType: 'feed',
            content: {
                title: '우리 가족 자판기',
                description: '우리 가족이 좋아하는 것들을 자판기에 담았어요!',
                imageUrl: `${this.baseURL}images/preview.png`,
                link: {
                    mobileWebUrl: url,
                    webUrl: url
                }
            },
            buttons: [
                {
                    title: '자판기 보기',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url
                    }
                }
            ]
        });
    }
    
    /**
     * 네이티브 공유 API 사용
     */
    async shareViaNative() {
        const url = document.getElementById('shareURL').value;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: '우리 가족 자판기',
                    text: '우리 가족이 좋아하는 것들을 자판기에 담았어요!',
                    url: url
                });
            } catch (err) {
                console.log('Share cancelled or failed');
            }
        } else {
            // Web Share API를 지원하지 않는 경우
            this.copyLink();
        }
    }
    
    /**
     * 공유 모달 닫기
     */
    closeShareModal() {
        if (this.shareModal) {
            this.shareModal.classList.remove('show');
            setTimeout(() => {
                this.shareModal.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * URL에서 공유 데이터 로드
     * @returns {Object|null} 공유 데이터
     */
    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        const encodedData = params.get('d');
        
        if (!encodedData) return null;
        
        try {
            // Base64 디코딩
            const decoded = decodeURIComponent(atob(encodedData));
            const data = JSON.parse(decoded);
            
            // 데이터 복원
            const restored = {
                theme: data.t,
                machines: {}
            };
            
            for (const role in data.m) {
                const machine = data.m[role];
                restored.machines[role] = {
                    name: machine.n,
                    buttons: machine.b.map(btn => ({
                        emoji: btn.e,
                        text: btn.t,
                        order: 0
                    }))
                };
            }
            
            return restored;
        } catch (error) {
            console.error('Failed to load shared data:', error);
            return null;
        }
    }
    
    /**
     * 토스트 메시지 표시
     * @param {string} message - 메시지
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
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInUp 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }
}

// 싱글톤 인스턴스 생성
const shareManager = new ShareManager();

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShareManager, shareManager };
}