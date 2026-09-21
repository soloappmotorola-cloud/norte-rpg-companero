const CACHE = "norte-rpg-v1";
const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/data.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ARCHIVOS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first para el shell de la app; para todo lo demás (fuentes, imágenes) intenta red
// primero y cae al cache si no hay conexión, así juega bien sin internet en mesa.
self.addEventListener("fetch", (evento) => {
  const esArchivoDeLaApp = ARCHIVOS.some((a) => evento.request.url.endsWith(a.replace("./", "")));
  if (esArchivoDeLaApp) {
    evento.respondWith(caches.match(evento.request).then((r) => r || fetch(evento.request)));
    return;
  }
  evento.respondWith(
    fetch(evento.request, { cache: "reload" })
      .then((respuesta) => {
        const copia = respuesta.clone();
        caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
        return respuesta;
      })
      .catch(() => caches.match(evento.request))
  );
});
