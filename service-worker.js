// Calculadora LO2: modo de suspensión remota.
// Al instalarse, toma control, elimina las cachés antiguas y recarga
// las ventanas abiertas para que reciban el index.html de suspensión.
// Los dispositivos sin conexión no pueden recibir esta actualización.
self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    await caches.delete("lox-cache-v2");

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
