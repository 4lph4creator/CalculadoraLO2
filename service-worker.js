// Calculadora LO2: modo de suspensión remota.
// Al instalarse, toma control, elimina las cachés antiguas y recarga
// las ventanas abiertas para que reciban el index.html de suspensión.
// Los dispositivos sin conexión no pueden recibir esta actualización.
self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));

    await self.clients.claim();

    const windows = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    await Promise.all(windows.map(client => client.navigate(client.url)));
  })());
});

self.addEventListener("fetch", event => {
  // No servir copias locales: las solicitudes deben llegar a la publicación.
  event.respondWith(fetch(event.request));
});
