// Cierre remoto de la PWA Calculadora LO2.
// Al recibir esta actualización, elimina las cachés locales y se desregistra.
// No puede actuar en dispositivos que permanezcan sin conexión.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    const registrations = await self.registration.unregister();
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  // Sin caché offline: solicita los recursos a la publicación activa.
  event.respondWith(fetch(event.request));
});
