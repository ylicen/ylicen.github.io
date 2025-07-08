const CACHE_NAME = 'offline-cache-v2'; // 更新缓存版本
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
                console.log('Opened cache and caching assets');
                return cache.addAll(ASSETS_TO_CACHE);
            })
            .catch(error => {
                console.error('Failed to cache assets during install:', error);
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
        }).then(() => self.clients.claim())
    );
});

// 拦截网络请求 - 缓存优先，网络回退
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // 如果缓存中有匹配的响应，则直接返回
                if (cachedResponse) {
                    return cachedResponse;
                }

                // 如果缓存中没有，则尝试从网络获取
                return fetch(event.request).then(
                    networkResponse => {
                        // 检查响应是否有效
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // 克隆响应，因为响应体只能被读取一次
                        const responseToCache = networkResponse.clone();

                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                            });

                        return networkResponse;
                    }
                ).catch(error => {
                    // 网络请求失败，并且缓存中也没有
                    // 对于页面导航请求，返回离线页面
                    if (event.request.mode === 'navigate') {
                        console.log('Fetch failed; returning offline page.');
                        return caches.match(OFFLINE_URL);
                    }
                    // 对于其他资源（如图片、API调用），可以返回一个空的响应或者特定的错误指示
                    // 这里我们不返回任何东西，让浏览器处理错误
                });
            })
    );
});