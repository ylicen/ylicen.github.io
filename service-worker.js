const CACHE_NAME = 'offline-cache-v1';
const OFFLINE_URL = 'offline.html';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    OFFLINE_URL
];

// 安装 Service Worker 并缓存核心资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// 激活 Service Worker 并清理旧缓存
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
    self.clients.claim();
});

// 拦截网络请求
self.addEventListener('fetch', event => {
    // 只处理导航请求 (navigation requests)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            (async () => {
                try {
                    // 首先尝试从网络获取
                    const networkResponse = await fetch(event.request);
                    return networkResponse;
                } catch (error) {
                    // 网络失败，返回离线页面
                    console.log('Fetch failed; returning offline page.');
                    const cache = await caches.open(CACHE_NAME);
                    const cachedResponse = await cache.match(OFFLINE_URL);
                    return cachedResponse;
                }
            })()
        );
    }
});