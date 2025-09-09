/**
 * 우리 가족 자판기 - Service Worker (PWA)
 */

const CACHE_NAME = 'family-vending-machine-v2.0.0';
const urlsToCache = [
  '/family-vending-machine/',
  '/family-vending-machine/index.html',
  '/family-vending-machine/css/main.css',
  '/family-vending-machine/css/themes.css',
  '/family-vending-machine/css/print.css',
  '/family-vending-machine/js/config.js',
  '/family-vending-machine/js/app.js',
  '/family-vending-machine/js/vending-machine.js',
  '/family-vending-machine/js/storage.js',
  '/family-vending-machine/js/capture.js',
  '/family-vending-machine/manifest.json',
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
      .catch(err => {
        console.error('Cache install failed:', err);
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

// 페치 이벤트 - 캐시 우선, 네트워크 폴백
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 캐시에 있으면 반환
        if (response) {
          return response;
        }
        
        // 네트워크 요청
        return fetch(event.request).then(
          response => {
            // 유효한 응답이 아니면 반환
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 응답 복제하여 캐시에 저장
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          }
        );
      })
      .catch(err => {
        // 오프라인 폴백
        console.error('Fetch failed:', err);
        // 오프라인 페이지 반환 (필요 시)
        return caches.match('/family-vending-machine/offline.html');
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
    body: event.data ? event.data.text() : '새로운 알림이 있습니다.',
    icon: '/family-vending-machine/icons/icon-192x192.png',
    badge: '/family-vending-machine/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '열기',
        icon: '/family-vending-machine/icons/checkmark.png'
      },
      {
        action: 'close',
        title: '닫기',
        icon: '/family-vending-machine/icons/xmark.png'
      },
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
    event.waitUntil(
      clients.openWindow('/family-vending-machine/')
    );
  }
});

// 데이터 동기화 함수
async function syncData() {
  try {
    // IndexedDB에서 데이터 가져오기
    const data = await getDataFromIndexedDB();
    
    // 서버로 전송 (필요 시)
    // await sendDataToServer(data);
    
    console.log('Data synced successfully');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// IndexedDB 데이터 가져오기
function getDataFromIndexedDB() {
  return new Promise((resolve, reject) => {
    // IndexedDB 로직
    resolve({});
  });
}

// 캐시 업데이트 알림
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(() => {
      console.log('Cache cleared');
    });
  }
});