// Calculadora LO2: baja definitiva del servicio.
self.addEventListener("install", event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    const windows = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });
    await Promise.all(windows.map(client => {
      if (client.url.startsWith(self.registration.scope)) {
        return client.navigate(client.url);
      }
      return Promise.resolve();
    }));
  })());
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(fetch(event.request, { cache: "no-store" }));
});
