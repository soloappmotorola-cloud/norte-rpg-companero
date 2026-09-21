/*
 * Contenido de la app, resumido desde juego-norte/reglas/manual-de-juego.md.
 * Si se edita el manual, este archivo hay que actualizarlo a mano (no hay build automático todavía).
 * Mismo esquema que la app de Litoral (app-jugadores/js/data.js) — no reinventar la estructura acá.
 */

const ARQUETIPOS = [
  {
    nombre: "El Cazador de la Puna",
    raiz: "Coquena / Yastay",
    img: "img/cazador-de-la-puna.webp",
    resumen: "Cazador-guardián de la Puna regido por un código de caza ética; confronta al cazador furtivo en el momento, cara a cara.",
    prioridad: "Destreza, Ojo de Monte",
    oficios: "Rastreo, Pastoreo altoandino",
    don: "Justicia de la Puna — una vez por escena, si presencia una caza cruel o codiciosa, gana +2 a su próxima tirada de ataque o Destreza contra el responsable."
  },
  {
    nombre: "La Portadora de la Challa",
    raiz: "Pachamama",
    img: "img/portadora-de-la-challa.webp",
    resumen: "Oficiante itinerante de la ofrenda a la tierra; hace cumplir la reciprocidad frente a otros PNJ y frente al propio grupo.",
    prioridad: "Alma, Astucia",
    oficios: "Herboristería y curación, Ofrenda y ritual",
    don: "Manos de challa — cura 1d6 + Alma de Aguante a un aliado (Ofrenda y ritual o Herboristería, Dificultad 9), una vez entre descansos."
  },
  {
    nombre: "El Uturunco",
    raiz: "Runa Uturunco",
    img: "img/el-uturunco.webp",
    resumen: "Hereda el mismo mito de origen que el villano del bestiario, pero eligió no usar el don para dañar por venganza.",
    prioridad: "Fuerza, Destreza",
    oficios: "Sigilo, Forcejeo y pelea",
    don: "Zarpazo del puma — una vez por escena, al transformarse, su próximo ataque cuerpo a cuerpo gana +2 y, en éxito pleno, derriba al objetivo."
  },
  {
    nombre: "El/La Ukumari",
    raiz: "Ucumar",
    img: "img/ukumari.webp",
    resumen: "Persona de fuerza descomunal, confundida con el propio Ucumar por su aspecto.",
    prioridad: "Fuerza, Vigor",
    oficios: "Forcejeo y pelea, Monte",
    don: "Fuerza que impone — una vez por escena, usa Fuerza en vez de Alma para intimidar o imponerse físicamente sin pelear."
  },
  {
    nombre: "El Salamanquero",
    raiz: "Zupay y la Salamanca",
    img: "img/salamanquero.webp",
    resumen: "Músico, jugador de naipes o jinete con un don sospechosamente perfecto; debe algo a Zupay y no sabe cuánto le queda de plazo.",
    prioridad: "Astucia, Alma",
    oficios: "Relato y canto, Trato con lo oculto",
    don: "Don sospechoso — una vez por escena, repite una tirada social o artística que falló (se queda con el segundo resultado); Zupay \"toma nota\"."
  },
  {
    nombre: "El Embaucador del Río",
    raiz: "Tokjuaj",
    img: "img/embaucador-del-rio.webp",
    resumen: "Transformista, curioso, avaro a su manera; mete al grupo en problemas por su propia desobediencia tanto como los saca de ellos.",
    prioridad: "Destreza, Astucia",
    oficios: "Sigilo, Mañas y transformación menor",
    don: "Cara nueva — cambia de apariencia menor para pasar desapercibido o hacerse pasar por otra persona (Mañas y transformación menor, Dificultad 9)."
  },
  {
    nombre: "El Guardián del Monte Chaqueño",
    raiz: "Tahyi-Lhele / Koyik-wukw",
    img: "img/guardian-del-monte-chaqueno.webp",
    resumen: "Protector del monte chaqueño y de la miel silvestre, heredero de la lógica de \"dueños\" (wukw) wichí. Expansión, Arco Chaco/Formosa.",
    prioridad: "Vigor, Ojo de Monte",
    oficios: "Monte, Rastreo",
    don: "Furia del wukw — una vez por escena, si un aliado fue lastimado o alguien caza/tala de más frente a él, gana +2 a su próxima tirada de ataque o Fuerza."
  },
  {
    nombre: "El Visionario Qom",
    raiz: "Kasogonagá",
    img: "img/visionario-qom.webp",
    resumen: "Chamán en formación que accede a visiones inducidas de Kasogonagá; sus visiones avisan de un peligro concreto, no de cómo evitarlo hablando. Expansión, Arco Chaco/Formosa.",
    prioridad: "Alma, Ojo de Monte",
    oficios: "Trance y visión, Trato con espíritus",
    don: "Aviso del relámpago — una vez por sesión, pide al Narrador una visión de Kasogonagá sobre el peligro que se viene."
  }
];

const BESTIARIO = [
  {
    nombre: "Ucumar",
    img: "img/ucumar.webp",
    stats: "Aguante 22 · Defensa 12 · Ataque +4 (1d6+3) · Frente máx. 2",
    rasgo: "Sin aplaque documentado: no hay ofrenda que lo evite.",
    alternativa: "Huye al llegar a la mitad de su Aguante (11) y no vuelve a esa escena — perseguirlo es lo que lo vuelve agresivo."
  },
  {
    nombre: "Runa Uturunco",
    img: "img/runa-uturunco.webp",
    stats: "Aguante 22 · Defensa 10 · Ataque +3 (2d6+1) · Frente máx. 2",
    rasgo: "Cuero ritual: mientras lo porte, un ataque que solo logra éxito con costo no le baja Aguante real.",
    alternativa: "Arrancarle o destruirle el cuero (Destreza, Dificultad 11, cuerpo a cuerpo) anula el bono de fiera y normalmente se rinde."
  },
  {
    nombre: "Wósak",
    img: "img/wosak.webp",
    stats: "Aguante 26 · Defensa 11 · Ataque +3 (2d6+2) · Frente máx. 2",
    rasgo: "Doble forma escalable: se presenta como hombre primero.",
    alternativa: "Respetar el tabú documentado o retirarse sin agredir (Alma o Astucia, Dificultad 9) evita el combate entero."
  },
  {
    nombre: "Kedókpolyo",
    img: "img/kedokpolyo.webp",
    stats: "Aguante 26 · Defensa 11 · Ataque +3 (2d6+1) · Frente máx. 2",
    rasgo: "Doble forma con ronda de advertencia: hombre corpulento primero, luego jaguar enorme.",
    alternativa: "Como jaguar, un éxito con costo no le baja Aguante real, solo un éxito pleno — sin señal de aplaque previa."
  },
  {
    nombre: "Nanáykpolyo",
    img: "img/nanaykpolyo.webp",
    stats: "Aguante 34 · Defensa 12 · Ataque +3, dos mordiscos (1d6+3 c/u) · Frente máx. 3",
    rasgo: "Enjambre: cada ronda, todos fuera del frente tiran Vigor (Dificultad 9) o sufren 1d6.",
    alternativa: "Nunca es seguro quedarse atrás — no hay forma documentada de aplacarlo."
  },
  {
    nombre: "NesóGe",
    img: "img/nesoge.webp",
    stats: "Aguante 28 · Defensa 12 · Ataque +4 (2d6+2) · Frente máx. 2",
    rasgo: "Sin debilidad documentada, a propósito — el combate más \"limpio\" del bestiario.",
    alternativa: "Se gana por daño bruto o se evita retirándose a tiempo. Cierre del Arco 2."
  }
];

const PNJ = [
  {
    nombre: "Pachamama",
    img: "img/pachamama.webp",
    rol: "La tierra misma como fuerza de reciprocidad — recibe la challa, castiga la falta de devolución.",
    reputacion: "Sube dejando la challa enterrada o derramada (Alma + Ofrenda y ritual, Dificultad 9). Tomar de la tierra sin devolver nada la baja uno o dos puntos.",
    ofrenda: "La challa (hoja de coca, alcohol, cigarrillos) enterrada o derramada. No hay combate posible contra ella."
  },
  {
    nombre: "Coquena / Yastay",
    img: "img/coquena-yastay.webp",
    rol: "Socios/hermanos guardianes de la fauna de altura — Coquena de vicuñas y guanacos, Yastay de las tropillas.",
    reputacion: "Suben o bajan por comportamiento, no por ofrenda puntual: cazar solo lo necesario y sin armas \"sucias\" sube; cazar por codicia baja de inmediato y sin aviso.",
    ofrenda: "Pedir formalmente permiso de paso o de caza (Pastoreo altoandino, Dificultad 9). Solo se enfrentan a quien caza por codicia."
  },
  {
    nombre: "El Chiqui",
    img: "img/el-chiqui.webp",
    rol: "Figura de Carnaval (Vatí), documentada en el Cancionero de Carrizo de La Rioja — propiciación de fertilidad y suerte.",
    reputacion: "Se propicia en los tres días de Carnaval con el ritual documentado (baile alrededor de un algarrobo con cabezas secas y huahuas colgadas). Sostener el ritual sube +2 de una vez; si el pueblo no puede hacer el Carnaval, la Reputación baja sola y trae mala suerte toda la temporada.",
    ofrenda: "Participar y sostener el ritual de Carnaval (Ofrenda y ritual o Relato y canto, Dificultad 9). Es un evento de calendario, no una tirada de escena suelta."
  }
];

const REGLAS_RAPIDAS = {
  formula: "2d6 + Atributo + Oficio (si aplica) vs. Dificultad",
  dificultades: [
    ["Trivial", 5], ["Fácil", 7], ["Media", 9], ["Difícil", 11], ["Heroica", 13], ["Legendaria", 14]
  ],
  resultados: [
    ["Éxito pleno", "Total ≥ Dificultad + 3, o doble 6 natural", "Lo lográs sin costo. En ataque: daño completo + un efecto extra menor."],
    ["Éxito con costo", "Total ≥ Dificultad, por menos de 3", "Lo conseguís, pero el Narrador agrega una complicación: recurso gastado, el ser \"toma nota\" de vos, quedás expuesto."],
    ["Fracaso", "Total < Dificultad", "No lo conseguís. El Narrador hace avanzar el peligro de la escena."]
  ],
  nota: "Heroica y Legendaria son casi imposibles con modificador total 0 — son el techo del juego, para el especialista de la escena."
};
