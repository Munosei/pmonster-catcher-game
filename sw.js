// Service Worker for PWA
const CACHE_NAME = 'pokemon-catcher-v1';
const urlsToCache = [
    '/pokemon-catcher-game/',
    '/pokemon-catcher-game/index.html',
    '/pokemon-catcher-game/trainer.html',
    '/pokemon-catcher-game/style.css',
    '/pokemon-catcher-game/script.js',
    '/pokemon-catcher-game/plza.mp3',
    '/pokemon-catcher-game/venusaur.gif',
    '/pokemon-catcher-game/dragonite.gif',
    '/pokemon-catcher-game/lugia.gif',
    '/pokemon-catcher-game/espeon.gif',
    '/pokemon-catcher-game/sylveon.gif',
    '/pokemon-catcher-game/umbreon.gif',
    '/pokemon-catcher-game/latias.gif',
    '/pokemon-catcher-game/gengar.gif',
    '/pokemon-catcher-game/mdragonite.gif'
];

// Install event - cache files
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache first, then network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
