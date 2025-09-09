/**
 * 서비스 워커 - PWA 지원
 * 오프라인 기능 및 캐싱 전략
 */

const CACHE_NAME = 'family-vending-machine-v2.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/main.css',
    '/css/themes.css',
    '/css/print.css',
    '/js/config.js',
    '/js/app.js',
    '/js/vending-machine.js',
    '/js/storage.js',
    '/js/capture.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 서비스 워커 설치
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .then(() => {
                // 즉시 활성화
                return self.skipWaiting();
            })
    );
});

// 서비스 워커 활성화
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // 모든 클라이언트 제어
            return self.clients.claim();
        })
    );
});

// 네트워크 요청 가로채기
self.addEventListener('fetch', event => {
    // POST 요청은 캐시하지 않음
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 캐시에서 찾으면 반환
                if (response) {
                    return response;
                }
                
                // 네트워크 요청
                return fetch(event.request).then(response => {
                    // 유효한 응답이 아니면 그대로 반환
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // 응답 복사하여 캐시에 저장
                    const responseToCache = response.clone();
                    
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                }).catch(() => {
                    // 오프라인 폴백 페이지
                    return new Response(
                        `<!DOCTYPE html>
                        <html lang="ko">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>오프라인 - 우리 가족 자판기</title>
                            <style>
                                body {
                                    font-family: 'Noto Sans KR', sans-serif;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    height: 100vh;
                                    margin: 0;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    color: white;
                                    text-align: center;
                                }
                                .offline-container {
                                    padding: 40px;
                                    background: rgba(255, 255, 255, 0.1);
                                    border-radius: 20px;
                                    backdrop-filter: blur(10px);
                                }
                                h1 { font-size: 2.5em; margin-bottom: 20px; }
                                p { font-size: 1.2em; margin-bottom: 30px; }
                                button {
                                    padding: 15px 30px;
                                    font-size: 1.1em;
                                    background: white;
                                    color: #667eea;
                                    border: none;
                                    border-radius: 25px;
                                    cursor: pointer;
                                }
                                button:hover { transform: scale(1.05); }
                            </style>
                        </head>
                        <body>
                            <div class="offline-container">
                                <h1>🔌 오프라인 상태입니다</h1>
                                <p>인터넷 연결을 확인해주세요.</p>
                                <p>저장된 데이터는 안전하게 보관됩니다.</p>
                                <button onclick="location.reload()">다시 시도</button>
                            </div>
                        </body>
                        </html>`,
                        {
                            headers: { 'Content-Type': 'text/html; charset=utf-8' }
                        }
                    );
                });
            })
    );
});

// 백그라운드 동기화
self.addEventListener('sync', event => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // 데이터 동기화 로직
            syncData()
        );
    }
});

// 푸시 알림
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : '새로운 기능이 추가되었습니다!',
        icon: '/icon-192.png',
        badge: '/badge-72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '확인하기',
                icon: '/check.png'
            },
            {
                action: 'close',
                title: '닫기',
                icon: '/close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('우리 가족 자판기', options)
    );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// 데이터 동기화 함수
async function syncData() {
    try {
        // 로컬 스토리지 데이터를 서버와 동기화하는 로직
        // (서버 API가 있을 경우 구현)
        console.log('Data synchronized');
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// 캐시 버전 관리
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});