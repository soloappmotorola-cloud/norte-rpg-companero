const contenido = document.getElementById("contenido");
const tabs = document.querySelectorAll(".tab-btn");

function cardArquetipo(a) {
  return `
    <article class="card" tabindex="0">
      <div class="card-cara card-frente ${a.img ? "" : "card-frente--vacia"}"
           style="${a.img ? `background-image:url('${a.img}')` : ""}">
        ${a.img ? "" : `<span class="card-arte-placeholder">${a.nombre[0]}</span>`}
        <div class="card-frente-info">
          <h2>${a.nombre}</h2>
          <p class="card-raiz">raíz folclórica: ${a.raiz}</p>
          <p class="card-toque">tocá para ver la ficha ↴</p>
        </div>
      </div>
      <div class="card-cara card-dorso">
        <h3>${a.nombre}</h3>
        <p>${a.resumen}</p>
        <dl>
          <dt>Prioridad</dt><dd>${a.prioridad}</dd>
          <dt>Oficios</dt><dd>${a.oficios}</dd>
          <dt>Don</dt><dd>${a.don}</dd>
        </dl>
      </div>
    </article>`;
}

function cardBestia(b) {
  return `
    <article class="card" tabindex="0">
      <div class="card-cara card-frente ${b.img ? "" : "card-frente--vacia"}"
           style="${b.img ? `background-image:url('${b.img}')` : ""}">
        ${b.img ? "" : `<span class="card-arte-placeholder">${b.nombre[0]}</span>`}
        <div class="card-frente-info">
          <h2>${b.nombre}</h2>
          <p class="card-toque">tocá para ver la ficha ↴</p>
        </div>
      </div>
      <div class="card-cara card-dorso">
        <h3>${b.nombre}</h3>
        <p class="card-stats">${b.stats}</p>
        <p><strong>Rasgo:</strong> ${b.rasgo}</p>
        <p><strong>Alternativa:</strong> ${b.alternativa}</p>
      </div>
    </article>`;
}

function cardPnj(p) {
  return `
    <article class="card" tabindex="0">
      <div class="card-cara card-frente ${p.img ? "" : "card-frente--vacia"}"
           style="${p.img ? `background-image:url('${p.img}')` : ""}">
        ${p.img ? "" : `<span class="card-arte-placeholder">${p.nombre[0]}</span>`}
        <div class="card-frente-info">
          <h2>${p.nombre}</h2>
          <p class="card-toque">tocá para ver la ficha ↴</p>
        </div>
      </div>
      <div class="card-cara card-dorso">
        <h3>${p.nombre}</h3>
        <p>${p.rol}</p>
        <p><strong>Reputación:</strong> ${p.reputacion}</p>
        <p><strong>Ofrenda/trato:</strong> ${p.ofrenda}</p>
      </div>
    </article>`;
}

function armarCarrusel(items, renderCard) {
  const cartas = items.map(renderCard).join("");
  const puntos = items
    .map((_, i) => `<button class="car-punto" data-indice="${i}" aria-label="Carta ${i + 1} de ${items.length}"></button>`)
    .join("");
  return `
    <div class="carrusel">
      <div class="carrusel-pista">${cartas}</div>
      <div class="carrusel-controles">
        <button class="car-flecha car-prev" aria-label="Anterior">‹</button>
        <div class="car-puntos">${puntos}</div>
        <button class="car-flecha car-next" aria-label="Siguiente">›</button>
      </div>
    </div>`;
}

function vistaPersonajes() {
  return armarCarrusel(ARQUETIPOS, cardArquetipo);
}

function vistaBestiario() {
  return armarCarrusel(BESTIARIO, cardBestia);
}

function vistaPnj() {
  return armarCarrusel(PNJ, cardPnj);
}

function vistaReglas() {
  const r = REGLAS_RAPIDAS;
  return `
    <section class="panel-reglas">
      <div class="formula-destacada">${r.formula}</div>

      <h3>Dificultades</h3>
      <table class="tabla-reglas">
        ${r.dificultades.map(([n, v]) => `<tr><td>${n}</td><td>${v}</td></tr>`).join("")}
      </table>

      <h3>Resultado de la tirada</h3>
      ${r.resultados.map(([n, cond, efecto]) => `
        <div class="resultado-item">
          <p class="resultado-nombre">${n} <span class="resultado-cond">— ${cond}</span></p>
          <p class="resultado-efecto">${efecto}</p>
        </div>`).join("")}

      <p class="nota-reglas">${r.nota}</p>
    </section>`;
}

const VISTAS = { personajes: vistaPersonajes, bestiario: vistaBestiario, pnj: vistaPnj, reglas: vistaReglas };

function iniciarCarrusel(raiz) {
  const pista = raiz.querySelector(".carrusel-pista");
  const cartas = [...pista.querySelectorAll(".card")];
  const puntos = [...raiz.querySelectorAll(".car-punto")];
  const btnPrev = raiz.querySelector(".car-prev");
  const btnNext = raiz.querySelector(".car-next");
  const total = cartas.length;
  let actual = 0;

  function ubicar() {
    cartas.forEach((carta, i) => {
      const distancia = i - actual;
      const abs = Math.abs(distancia);
      carta.classList.toggle("es-actual", distancia === 0);
      if (abs > 2) {
        carta.style.opacity = "0";
        carta.style.pointerEvents = "none";
      } else {
        carta.style.opacity = "1";
        carta.style.pointerEvents = "auto";
        carta.style.zIndex = String(total - abs);
        carta.style.transform =
          `translateX(${distancia * 64}%) rotateY(${distancia * -30}deg) scale(${distancia === 0 ? 1 : 0.8})`;
      }
    });
    puntos.forEach((p, i) => p.classList.toggle("es-actual", i === actual));
    btnPrev.disabled = actual === 0;
    btnNext.disabled = actual === total - 1;
  }

  function irA(i) {
    actual = Math.max(0, Math.min(total - 1, i));
    ubicar();
  }

  cartas.forEach((carta, i) => {
    carta.addEventListener("click", () => {
      if (i === actual) carta.classList.toggle("is-flipped");
      else { carta.classList.remove("is-flipped"); irA(i); }
    });
    carta.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (i === actual) carta.classList.toggle("is-flipped");
      else { carta.classList.remove("is-flipped"); irA(i); }
    });
  });
  puntos.forEach((p, i) => p.addEventListener("click", () => irA(i)));
  btnPrev.addEventListener("click", () => irA(actual - 1));
  btnNext.addEventListener("click", () => irA(actual + 1));

  let inicioX = null;
  pista.addEventListener("pointerdown", e => { inicioX = e.clientX; });
  pista.addEventListener("pointerup", e => {
    if (inicioX === null) return;
    const delta = e.clientX - inicioX;
    if (Math.abs(delta) > 40) irA(actual + (delta < 0 ? 1 : -1));
    inicioX = null;
  });

  ubicar();
}

function mostrarTab(nombre) {
  contenido.innerHTML = VISTAS[nombre]();
  contenido.classList.remove("entrando");
  void contenido.offsetWidth;
  contenido.classList.add("entrando");
  tabs.forEach(btn => btn.classList.toggle("is-active", btn.dataset.tab === nombre));
  contenido.querySelectorAll(".carrusel").forEach(iniciarCarrusel);
}

tabs.forEach(btn => btn.addEventListener("click", () => mostrarTab(btn.dataset.tab)));

const tabInicial = location.hash.replace("#", "");
mostrarTab(VISTAS[tabInicial] ? tabInicial : "personajes");

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js"));
}
