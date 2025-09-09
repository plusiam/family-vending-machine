/**
 * 우리 가족 자판기 - Service Worker
 * PWA 오프라인 지원
 */

const CACHE_NAME = 'family-vending-v2.0.0';
const urlsToCache = [
  '/family-vending-machine/',
  '/family-vending-machine/index.html',
  '/family-vending-machine/lite.html',
  '/family-vending-machine/css/main.css',
  '/family-vending-machine/css/themes.css',
  '/family-vending-machine/css/print.css',
  '/family-vending-machine/js/config.js',
  '/family-vending-machine/js/app.js',
  '/family-vending-machine/js/vending-machine.js',
  '/family-vending-machine/js/storage.js',
  '/family-vending-machine/js/capture.js',
  '/family-vending-machine/js/qr-share.js',
  '/family-vending-machine/js/i18n.js',
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
      .then(() => self.skipWaiting())
  );
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
    }).then(() => self.clients.claim())
  );
});

// 페치 이벤트
self.addEventListener('fetch', event => {
  // QR 코드 API는 캐시하지 않음
  if (event.request.url.includes('api.qrserver.com')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에서 찾은 경우 반환
        if (response) {
          return response;
        }
        
        // 네트워크에서 가져오기
        return fetch(event.request).then(response => {
          // 유효한 응답인지 확인
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 응답 복제
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // 오프라인 폴백 페이지
        if (event.request.destination === 'document') {
          return caches.match('/family-vending-machine/index.html');
        }
      })
  );
});

// 백그라운드 동기화
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

// 푸시 알림
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다.',
    icon: '/family-vending-machine/icons/icon-192x192.png',
    badge: '/family-vending-machine/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '열기',
        icon: '/family-vending-machine/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/family-vending-machine/icons/icon-72x72.png'
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
    event.waitUntil(
      clients.openWindow('/family-vending-machine/')
    );
  }
});

// 데이터 동기화 함수
async function syncData() {
  try {
    // LocalStorage 데이터를 서버로 동기화 (필요 시 구현)
    console.log('Syncing data...');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// 메시지 이벤트 핸들러
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});