self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'notify') {
        self.registration.showNotification(event.data.title, {
            body: event.data.body,
            icon: '/vite.svg',
        });
    }
});
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-tasks') {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ type: 'online' });
            });
        });
        self.registration.showNotification('App online!', {
            body: 'Sincronizando tarefas...',
            icon: '/vite.svg',
        });
    }
});

self.addEventListener('install', (event) => {
    console.log('SW: install');
    const CACHE_NAME = 'pwa-tasks-cache-v2';
    const urlsToCache = [
        '/',
        '/index.html',
        '/vite.svg',
        '/manifest.json',
    ];
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('SW: activate');
    const CACHE_NAME = 'pwa-tasks-cache-v2';
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
})
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request)
                    .then((fetchResponse) => {
                        if (event.request.url.match(/\.(js|css|svg|png|jpg|jpeg|webp|ico)$/)) {
                            caches.open('pwa-tasks-cache-v2').then((cache) => {
                                cache.put(event.request, fetchResponse.clone());
                            });
                        }
                        return fetchResponse;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                    });
            })
    );
});

self.addEventListener('message', (event) => {
    // Para debug, se quiser
    console.log('SW: message', event.data);
});

self.addEventListener('online', () => {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ type: 'online' });
        });
    });
});

// Como 'online' não é nativo no SW, usar workaround:
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-tasks') {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ type: 'online' });
            });
        });
    }
});