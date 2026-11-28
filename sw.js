/* Service worker — cache hors ligne simple (cache-first, mise à jour en arrière-plan). */
const CACHE = "pular-ajami-v28";
const ASSETS = [
  "./",
  "index.html",
  "css/style.css",
  "js/data.js",
  "js/storage.js",
  "js/files.js",
  "js/sync.js",
  "js/qr.js",
  "js/i18n.js",
  "js/app.js",
  "manifest.webmanifest",
  "icon.svg",
  "docs/Regles_Ajami_Pulaar.html",
  "docs/guide-utilisation.html",
  "docs/livret-ajami.html",
  "docs/presentation-projet.html",
  "docs/affiche-alphabet.html",
  "docs/fiche-lecture-syllabes.html",
  "docs/fiche-vocabulaire-classe.html",
  "docs/guide-alphabet.pdf",
  "docs/guide-voyelles.pdf",
  "docs/cahier-phrases.pdf",
  "docs/alphabet-ajami.txt",
  "docs/vocabulaire-ajami.txt"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res.ok && e.request.url.startsWith(self.location.origin)) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => hit);
      return hit || fetched;
    })
  );
});
