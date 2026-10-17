// Service Worker: App-Shell offline verfügbar machen (Anthropic-API-Aufrufe
// werden nie gecacht). Bei Änderungen an Dateien CACHE hochzählen.
const CACHE = "spiel-v5";
const DATEIEN = [
  "./", "index.html", "style.css?v=5", "vokabeln.js?v=5", "game.js?v=5", "app.js?v=5",
  "manifest.json", "icons/icon.svg", "icons/icon-192.png", "../shared/shell.css",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(DATEIEN)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  e.respondWith(
    fetch(e.request).then((r) => {
      const kopie = r.clone();
      caches.open(CACHE).then((c) => c.put(e.request, kopie));
      return r;
    }).catch(() => caches.match(e.request))
  );
});
