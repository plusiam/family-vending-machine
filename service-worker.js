/**
 * 우리 가족 자판기 - Service Worker
 * PWA 오프라인 지원
 */

const CACHE_NAME = 'family-vending-machine-v2.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/lite.html',
    '/css/main.css',
    '/css/themes.css',
    '/css/print.css',
    '/js/config.js',
    '/js/app.js',
    '/js/vending-machine.js',
    '/js/storage.js',
    '/js/capture.js',
    '/js/i18n.js',
    '/js/share.js',
    'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// 설치 이벤트
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache:', error);
            })
    );
    // 즉시 활성화
    self.skipWaiting();
});

// 활성화 이벤트
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
        })
    );
    // 즉시 컨트롤 획득
    self.clients.claim();
});

// Fetch 이벤트
self.addEventListener('fetch', event => {
    // POST 요청은 캐시하지 않음
    if (event.request.method !== 'GET') {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // 캐시에 있으면 반환
                if (response) {
                    return response;
                }
                
                // 네트워크에서 가져오기
                return fetch(event.request).then(response => {
                    // 유효한 응답이 아니면 반환
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // 응답 복제
                    const responseToCache = response.clone();
                    
                    // 캐시에 저장
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });
                    
                    return response;
                });
            })
            .catch(error => {
                console.error('Fetch failed:', error);
                // 오프라인 페이지 반환 (선택적)
                return caches.match('/offline.html');
            })
    );
});

// 백그라운드 동기화
self.addEventListener('sync', event => {
    if (event.tag === 'sync-vending-data') {
        event.waitUntil(syncVendingData());
    }
});

// 푸시 알림
self.addEventListener('push', event => {
    const options = {
        body: event.data ? event.data.text() : '새로운 업데이트가 있습니다!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: '확인하기',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: '닫기',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('우리 가족 자판기', options)
    );
});

// 알림 클릭
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'explore') {
        // 앱 열기
        clients.openWindow('/');
    }
});

// 데이터 동기화 함수
async function syncVendingData() {
    try {
        const cache = await caches.open(CACHE_NAME);
        const requests = await cache.keys();
        
        // LocalStorage 데이터를 서버와 동기화 (선택적)
        // 여기에 서버 API 호출 로직 추가 가능
        
        console.log('Data synced successfully');
    } catch (error) {
        console.error('Sync failed:', error);
    }
}

// 캐시 업데이트 체크
self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
    
    if (event.data.action === 'clearCache') {
        caches.delete(CACHE_NAME).then(() => {
            console.log('Cache cleared');
        });
    }
    
    if (event.data.action === 'updateCache') {
        caches.open(CACHE_NAME).then(cache => {
            cache.addAll(urlsToCache).then(() => {
                console.log('Cache updated');
            });
        });
    }
});