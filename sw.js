const CACHE = "norte-rpg-v2";

// Lo mínimo para que la app abra sin conexión.
const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css",
  "./js/app.js",
  "./js/data.js",
  "./js/escena.js",
  "./img/escena-puna.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

// Las ilustraciones: se guardan igual en la instalación, pero si alguna falla no tiramos
// abajo la instalación entera (la app abre igual y la imagen se cachea al primer uso).
const ILUSTRACIONES = [
  "cazador-de-la-puna", "coquena-yastay", "el-chiqui", "el-uturunco",
  "embaucador-del-rio", "guardian-del-monte-chaqueno", "kedokpolyo", "nanaykpolyo",
  "nesoge", "pachamama", "portadora-de-la-challa", "runa-uturunco",
  "salamanquero", "ucumar", "ukumari", "visionario-qom", "wosak"
].map((n) => `./img/${n}.webp`);

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      await cache.addAll(ARCHIVOS);
      await Promise.allSettled(ILUSTRACIONES.map((u) => cache.add(u)));
      await self.skipWaiting();
    })
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((claves) =>
      Promise.all(claves.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache primero para todo (la app se usa en la mesa, seguramente sin internet) y en paralelo
// se refresca la copia si hay red. Lo que no esté guardado se pide a la red y se guarda.
self.addEventListener("fetch", (evento) => {
  const pedido = evento.request;
  if (pedido.method !== "GET") return;

  evento.respondWith(
    caches.match(pedido).then((guardado) => {
      const desdeRed = fetch(pedido)
        .then((respuesta) => {
          if (respuesta && (respuesta.ok || respuesta.type === "opaque")) {
            const copia = respuesta.clone();
            caches.open(CACHE).then((cache) => cache.put(pedido, copia));
          }
          return respuesta;
        })
        .catch(() => guardado);
      return guardado || desdeRed;
    })
  );
});
