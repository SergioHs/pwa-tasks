self.addEventListener('install', (event) => {
    console.log('SW: install');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('SW: activate');
})

