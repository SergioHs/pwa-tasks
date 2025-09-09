self.addEventListener('install', (event) => {
    console.log('SW: install');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('SW: activate');
})

self.addEventListener('online', () => {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage({ type: 'online' });
        })
    })
})

self.addEventListener('sync', (event) => {
    if(event.tag === 'sync-tasks') {
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                client.postMessage({ type: 'online' })
            })
        });
    }
})