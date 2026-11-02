// Calculadora LO2: modo de suspensión remota.
// Versión 2026-11-02: solicita los recursos publicados sin reutilizar
// respuestas HTTP almacenadas en caché.
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
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request, { cache: "no-store" }));
});
