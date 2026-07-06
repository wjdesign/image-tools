/* Service Worker — 快取所有靜態資源，讓工具完全離線可用 */
const CACHE = "webp-tools-v34";

const ASSETS = [
  "./",
  "index.html",
  "privacy.html",
  "terms.html",
  "manifest.json",
  "assets/styles.css",
  "assets/i18n.js",
  "assets/app.js",
  "assets/img/logo.png",
  "assets/img/icon_auto.png",
  "assets/img/icon_transform.png",
  "assets/img/icon_submit.png",
  "assets/img/icon_delete.png",
  "assets/img/icon_zip.png",
  "assets/img/icon_rar.png",
  "assets/img/icon_load.png",
  "assets/img/icon_in.png",
  "assets/img/icon_out.png",
  "assets/img/locales/zh-tw.png",
  "assets/img/locales/zh-cn.png",
  "assets/img/locales/en.png",
  "assets/img/locales/jp.png",
  "assets/img/icon_webp.png",
  "assets/img/icon_jpg.png",
  "assets/img/icon_png.png",
  "assets/img/favicon-16.png",
  "assets/img/favicon-32.png",
  "assets/img/favicon-96.png",
  "assets/img/pwa-192.png",
  "assets/img/pwa-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// cache-first：離線也能開；背景再更新快取（stale-while-revalidate）
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => cached); // 離線時回退快取
      return cached || fetched;
    })
  );
});
