/* Bitácoras de viaje — service worker
   Guarda la app y sus librerías para que funcione sin conexión.
   Sube VERSION cada vez que cambies index.html. */
const VERSION = 'bitacoras-v17';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icono-192.png',
  './icono-512.png',
  './icono-maskable-512.png',
  './icono-apple.png',
  './lib/leaflet.css',
  './lib/leaflet.js',
  './lib/jszip.min.js',
  // las tipografías van al recuerdo incrustadas: sin ellas en caché, sin conexión no se podrían meter
  './lib/fuentes/lato-400.woff2',
  './lib/fuentes/lato-400i.woff2',
  './lib/fuentes/lato-700.woff2',
  './lib/fuentes/lato-900.woff2',
  './lib/fuentes/pirata-one.woff2',
  './lib/fuentes/alfa-slab-one.woff2',
  './lib/fuentes/pacifico.woff2',
  './lib/fuentes/bebas-neue.woff2',
  './lib/fuentes/rye.woff2'
];
// Librerías y tipografías: se guardan la primera vez que se cargan con conexión
const EXTERNOS = ['unpkg.com', 'cdnjs.cloudflare.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'tile.openstreetmap.org'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

// La app pide la versión para enseñarla en la barra: aquí está el único número que se toca
self.addEventListener('message', e => {
  if (e.data !== 'version') return;
  const puerto = e.ports && e.ports[0];
  if (puerto) puerto.postMessage({ version: VERSION });
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const externo = EXTERNOS.some(h => url.hostname.endsWith(h));

  if (externo) {
    // Librerías, tipografías y teselas del mapa: primero la caché, y se refresca por detrás
    e.respondWith(caches.match(req).then(hit => {
      const red = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) caches.open(VERSION).then(c => c.put(req, res.clone()));
        return res;
      }).catch(() => hit);
      return hit || red;
    }));
    return;
  }

  if (url.origin !== location.origin) return;
  // La propia app: primero la red para tener siempre la última versión, con la caché de respaldo
  e.respondWith(fetch(req).then(res => {
    if (res && res.ok) caches.open(VERSION).then(c => c.put(req, res.clone()));
    return res;
  }).catch(() => caches.match(req).then(hit => hit || caches.match('./index.html'))));
});
