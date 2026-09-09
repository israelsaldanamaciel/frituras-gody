const CACHE_NAME = "frituras-gody-v1";
const ARCHIVOS = [
    "./",
    "./index.html",
    "./estilo.css",
    "./app.js",
    "./manifest.webmanifest",
    "./Frituras-Gody.apk",
    "./logo de frituras gody.png",
    "./Presentacicon.jpeg",
    "./cachute macho.jpeg",
    "./Mix Habas .jpeg",
    "./Dorikis queso.jpeg",
    "./cueros,patas,chetos.jpeg",
    "./paquete diviertas este mes patrio.jpeg",
    "./salsas.jpeg",
    "./tostadas el vaquero.jpeg"
];

self.addEventListener("install", (evento) => {
    evento.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ARCHIVOS))
    );
});

self.addEventListener("activate", (evento) => {
    evento.waitUntil(
        caches.keys().then((nombres) => Promise.all(
            nombres
                .filter((nombre) => nombre !== CACHE_NAME)
                .map((nombre) => caches.delete(nombre))
        ))
    );
});

self.addEventListener("fetch", (evento) => {
    evento.respondWith(
        caches.match(evento.request).then((respuesta) => {
            return respuesta || fetch(evento.request);
        })
    );
});
