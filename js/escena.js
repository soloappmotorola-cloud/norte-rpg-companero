/* Polvo de arena sobre la escena de la Puna.
   Versión de celular de mesa: la escena en sí (luna, cerro, Runa Uturunco) es un SVG estático
   puesto como fondo en CSS — no cuesta nada una vez dibujado. Lo único que se anima es este
   puñado de partículas, y está pensado para gastar lo mínimo de batería:
     - pocas partículas (la app se usa con la pantalla prendida un buen rato),
     - 30 cuadros por segundo en vez de 60,
     - se dibujan agrupadas por color (pocos cambios de estado en el canvas),
     - el bucle SE FRENA solo a los 5 s sin que nadie toque la pantalla, y la arena queda
       suspendida en el último cuadro; vuelve a moverse apenas tocás o movés el dedo,
     - se frena también si la app queda en segundo plano,
     - con prefers-reduced-motion dibuja un solo cuadro quieto y nunca anima. */
(function () {
  "use strict";

  var canvas = document.getElementById("polvo");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  var quieto = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var ancho = 0, alto = 0, dpr = 1;
  var puntero = { x: 0, y: 0, activo: false };
  var particulas = [];
  var ESPERA_REPOSO = 5000; // ms sin interacción -> se frena el bucle
  var ultimoToque = 0;
  var corriendo = false;
  var raf = null;
  var ultimoCuadro = 0;
  // Umbral de 25 ms: en una pantalla de 60 Hz se dibuja uno de cada dos cuadros (30 fps).
  var PASO = 25;

  // Menos arena en celular que en pantalla grande.
  var CANTIDAD = window.innerWidth < 700 ? 55 : 110;

  // 5 "tonos" de arena fijos: así se dibuja todo con 5 fillStyle en vez de uno por partícula.
  var TONOS = [
    "hsla(35, 55%, 52%, 0.30)",
    "hsla(40, 55%, 62%, 0.22)",
    "hsla(45, 55%, 70%, 0.35)",
    "hsla(50, 55%, 58%, 0.16)",
    "hsla(42, 45%, 80%, 0.26)"
  ];

  var escena = canvas.parentNode;

  /* Alto real de lo que se ve. En el celular la barra de direcciones se esconde y se muestra
     sola: `100vh` mide siempre la pantalla CON la barra escondida, así que con la barra a la
     vista la parte de abajo de un elemento fijo — justo donde se apoya la escena — queda fuera
     de la pantalla. El CSS ya usa `dvh`, esto es el refuerzo para navegadores donde `dvh` no
     existe o llega tarde. No se toca si el usuario está haciendo zoom con dos dedos. */
  function medirVisible() {
    var vv = window.visualViewport;
    if (vv && vv.scale && vv.scale > 1.01) return;
    var h = (vv && vv.height) || window.innerHeight;
    document.documentElement.style.setProperty("--alto-visible", Math.round(h) + "px");
  }

  function medir() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Se mide contra .escena y no contra window: el alto de .escena va en `dvh`, que sigue a la
    // barra de direcciones del celular, mientras que window.innerHeight no siempre coincide.
    ancho = (escena && escena.clientWidth) || window.innerWidth;
    alto = (escena && escena.clientHeight) || window.innerHeight;
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    canvas.style.width = ancho + "px";
    canvas.style.height = alto + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (!puntero.activo) { puntero.x = ancho / 2; puntero.y = alto / 2; }
  }

  function nacer(p, arriba) {
    p.x = Math.random() * ancho;
    p.y = arriba ? -10 : Math.random() * alto;
    p.r = Math.random() * 1.3 + 0.5;
    p.tono = Math.floor(Math.random() * TONOS.length);
    p.vx0 = (Math.random() - 0.5) * 2.2;
    p.vy0 = Math.random() * 1.2 + 0.25;
  }

  function sembrar() {
    particulas.length = 0;
    for (var i = 0; i < CANTIDAD; i++) {
      var p = {};
      nacer(p, false);
      particulas.push(p);
    }
  }

  function mover(p, t) {
    // Viento ambiental: ondula solo, no depende de que alguien toque.
    var viento = Math.sin(t / 4000 + p.x * 0.01) * 0.6;
    var dx = puntero.x - p.x;
    var dy = puntero.y - p.y;
    var fuerza = 0;
    if (puntero.activo) {
      var d2 = dx * dx + dy * dy;
      var max = 260;
      if (d2 < max * max) {
        var f = (max - Math.sqrt(d2)) / max;
        fuerza = f * f;
      }
    }
    p.x += p.vx0 + viento + dx * 0.002 * fuerza;
    p.y += p.vy0 + dy * 0.0015 * fuerza;

    if (p.x < -20) p.x = ancho + 20;
    else if (p.x > ancho + 20) p.x = -20;
    if (p.y > alto + 20) nacer(p, true);
    else if (p.y < -30) p.y = alto + 20;
  }

  function dibujar() {
    ctx.clearRect(0, 0, ancho, alto);
    // Un trazo por tono: 5 cambios de estado por cuadro en total.
    for (var t = 0; t < TONOS.length; t++) {
      ctx.fillStyle = TONOS[t];
      ctx.beginPath();
      for (var i = 0; i < particulas.length; i++) {
        var p = particulas[i];
        if (p.tono !== t) continue;
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      }
      ctx.fill();
    }
  }

  function cuadro(t) {
    if (!corriendo) { raf = null; return; }
    raf = requestAnimationFrame(cuadro);
    if (t - ultimoCuadro < PASO) return;
    ultimoCuadro = t;

    for (var i = 0; i < particulas.length; i++) mover(particulas[i], t);
    dibujar();

    if (t - ultimoToque > ESPERA_REPOSO) frenar();
  }

  function arrancar() {
    if (corriendo || quieto) return;
    corriendo = true;
    canvas.classList.remove("en-reposo");
    ultimoCuadro = 0;
    raf = requestAnimationFrame(cuadro);
  }

  function frenar() {
    if (!corriendo) return;
    corriendo = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    // El último cuadro queda pintado: la arena se ve suspendida, apenas más tenue.
    canvas.classList.add("en-reposo");
  }

  function despertar(e) {
    if (quieto) return;
    if (e && e.clientX !== undefined) {
      puntero.x = e.clientX;
      puntero.y = e.clientY;
      puntero.activo = true;
    }
    ultimoToque = performance.now();
    if (!corriendo) arrancar();
  }

  medirVisible();
  medir();
  sembrar();

  if (quieto) {
    dibujar(); // un solo cuadro, quieto
    canvas.classList.add("en-reposo");
  } else {
    ultimoToque = performance.now();
    arrancar();

    window.addEventListener("pointermove", despertar, { passive: true });
    window.addEventListener("pointerdown", despertar, { passive: true });
    window.addEventListener("touchstart", despertar, { passive: true });
    window.addEventListener("pointerleave", function () { puntero.activo = false; }, { passive: true });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) frenar();
      else despertar(null);
    });
  }

  var temporizador = null;
  function reacomodar() {
    medirVisible(); // esto va sin demora: si no, el fondo queda corrido mientras se acomoda
    clearTimeout(temporizador);
    temporizador = setTimeout(function () {
      var previo = CANTIDAD;
      CANTIDAD = window.innerWidth < 700 ? 55 : 110;
      medir();
      if (CANTIDAD !== previo) sembrar();
      if (quieto || !corriendo) dibujar();
    }, 200);
  }

  window.addEventListener("resize", reacomodar, { passive: true });
  window.addEventListener("orientationchange", reacomodar, { passive: true });

  // En Chrome de Android, esconder o mostrar la barra de direcciones NO dispara `resize` de
  // window (el viewport de maquetado no cambia), pero sí el del viewport visual. Sin esto el
  // canvas del polvo queda con el alto viejo cuando la barra se esconde.
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", reacomodar, { passive: true });
    window.visualViewport.addEventListener("scroll", medirVisible, { passive: true });
  }
  window.addEventListener("load", reacomodar, { passive: true });
})();
