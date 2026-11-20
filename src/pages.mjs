import fs from "node:fs";
import { SITE } from "./data/site.mjs";
import { ARTICLES } from "./data/articles.mjs";
import { TIPS } from "./data/tips.mjs";
import { CLUB_FAQS } from "./data/club-faqs.mjs";
import { esc, waHref, TINTS, READY, clp, fechaLarga, page, viewhead, toyStoreLd } from "./layout.mjs";

const frag = name => fs.readFileSync(new URL(`./imprimibles/${name}.html`, import.meta.url), "utf8");
const details = items => items.map(([q, a]) => `<details><summary>${esc(q.replace(" (*)", ""))}</summary><p>${esc(a)}</p></details>`).join("");
const catalogBtn = (label, cls = "") => `<a class="btn${cls ? " " + cls : ""}" href="${esc(SITE.catalogUrl)}" target="_blank" rel="noopener">${label}</a>`;
const waBtn = (label, text, cls = "") => `<a class="btn wa${cls ? " " + cls : ""}" href="${waHref(text)}" target="_blank" rel="noopener">${label}</a>`;
const ART_TAGS = ["Opinión", "Guía", "Reseña", "Consejo"];

/* ---------- piezas reutilizables ---------- */
const artCard = (a, i) => `<article class="card artcard reveal" data-tag="${esc(a.tag)}" style="--d:${(i % 6) * 70}ms">
  <a class="thumb" href="/articulos/${a.slug}/" style="--tint:${TINTS[i % TINTS.length]}" tabindex="-1" aria-hidden="true"><span aria-hidden="true">${esc(a.emoji || "📰")}</span></a>
  <div class="body"><span class="arttag">${esc(a.tag)}</span><h3><a href="/articulos/${a.slug}/">${esc(a.title)}</a></h3><p>${esc(a.summary)}</p>
  <a class="btn sm" href="/articulos/${a.slug}/">Leer artículo</a></div></article>`;

const catalogPanel = h2 => `<div class="panel catstate reveal">
  <div>
    ${READY
      ? `<h2>🛍️ Mira nuestro catálogo</h2><p class="sub">Todos nuestros productos en un solo lugar. Cada uno llega en pocas unidades y muchos no se reponen.</p>`
      : `<h2>🛍️ Catálogo en línea: muy pronto</h2><p class="sub">Estamos ingresando todos los productos. Mientras tanto, escríbenos por WhatsApp o pasa por el local y te mostramos lo que tenemos.</p>`}
  </div>
  <div class="row">
    ${READY ? catalogBtn("🛍️ Ver catálogo") : `<a class="btn" href="/avisame/">🔔 Avisarme cuando abra</a>`}
    ${waBtn("Consultar por WhatsApp")}
  </div>
</div>`;

const FAQS = [
  ["¿Dónde están y cuándo atienden?", `Estamos en la ${SITE.streetAddress}, en ${SITE.city}. El local atiende ${SITE.hoursText}.`],
  ["¿Puedo comprar por la página?", READY
    ? "Puedes ver el catálogo en línea y consultarnos por WhatsApp para coordinar tu compra."
    : "El catálogo en línea se está terminando de armar. Mientras tanto, escríbenos por WhatsApp contándonos qué buscas, o visítanos en el local."],
  ["¿Los productos se vuelven a reponer?", "Casi nunca. Trabajamos con novedades que llegan en pocas unidades, y muchos modelos no vuelven. Si te gustó algo, no lo dejes para después."],
  ["¿Cómo me entero cuando abra el catálogo o lleguen novedades?", "Entra a “Avísame de novedades”, elige las categorías que te interesan y te escribimos apenas haya algo nuevo."],
  ["¿Hacen envíos? (*)", "Escríbenos por WhatsApp con tu comuna y te confirmamos si llegamos a tu zona y las opciones disponibles."],
  ["¿Qué medios de pago tienen? (*)", "Consúltanos por WhatsApp los medios de pago disponibles."],
  ["¿Cómo sé qué juguete es adecuado para la edad?", "Revisa la edad recomendada del envase y la sección de consejos. Si nos cuentas la edad por WhatsApp, te orientamos."],
  ["¿Qué hago si tengo un problema con un producto? (*)", "Escríbenos por WhatsApp contándonos qué pasó y lo vemos juntos."]
];

const IMP = [
  { slug: "laberinto", em: "🧩", name: "Laberinto", blurb: "Nuevo cada vez, con tres niveles.",
    title: "Laberinto para imprimir gratis", h1: "🧩 Laberinto para imprimir",
    desc: "Laberintos para imprimir gratis, distintos cada vez y con tres niveles de dificultad. Imprímelo en casa o guárdalo como PDF.",
    intro: "Un laberinto nuevo cada vez, con tres niveles. Elige la dificultad y toca “Imprimir”." },
  { slug: "sopa", em: "🔤", name: "Sopa de letras", blurb: "Animales escondidos para encontrar.",
    title: "Sopa de letras de animales para imprimir", h1: "🔤 Sopa de letras de animales",
    desc: "Sopa de letras de animales para imprimir gratis, con dos niveles y solución. Ideal para niños y niñas que ya leen.",
    intro: "Animales escondidos para encontrar, en horizontal, vertical y, si quieres, en diagonal." },
  { slug: "colorear", em: "🖍️", name: "Para colorear", blurb: "El osito y el auto.",
    title: "Dibujos para colorear e imprimir", h1: "🖍️ Dibujos para colorear",
    desc: "Láminas para colorear gratis: el osito y el auto. Imprímelas en casa y pasen la tarde dibujando juntos.",
    intro: "Elige una lámina, imprímela y a colorear. Tenemos el osito y el auto." },
  { slug: "diploma", em: "🏅", name: "Diploma", blurb: "Con el nombre de quien juega.",
    title: "Diploma para niños para imprimir y personalizar", h1: "🏅 Diploma para imprimir",
    desc: "Diploma para niños y niñas con el nombre que quieras. Personalízalo, imprímelo y celebren un logro en familia.",
    intro: "Escribe el nombre, elige el motivo y toca “Imprimir”. Un detalle simple para celebrar." },
  { slug: "calendario", em: "📅", name: "Calendario de retos", blurb: "Una actividad por semana para toda la familia.",
    title: "Calendario de retos familiares para imprimir", h1: "📅 Calendario de retos familiares",
    desc: "Calendario mensual con un reto de juego por semana para hacer en familia. Elige el mes, imprímelo y márquenlo juntos.",
    intro: "Un reto por semana para jugar en familia. Elige el mes y marquen cada día que jueguen juntos." }
];

/* ---------- construcción ---------- */
export function buildPages() {
  const out = [];
  const add = (p, extra = {}) => out.push({ path: p.path, html: page(p), ...extra });

  /* Inicio */
  add({
    path: "/",
    title: "Mundonin · Juguetería en Ovalle | Feria Modelo, local 45",
    desc: "Mundonin, juguetería y librería en la Feria Modelo de Ovalle (pasillo naranja, local 45). Peluches, juegos de mesa, autos, animales y útiles. Consulta por WhatsApp.",
    ld: [toyStoreLd(), { "@context": "https://schema.org", "@type": "WebSite", name: SITE.name, url: SITE.url + "/", inLanguage: "es-CL" }],
    body: `<section class="hero">
  <div class="floaters" aria-hidden="true">
    <span style="left:4%;top:12%">🧸</span><span style="left:46%;top:6%;animation-delay:-2s">🚗</span>
    <span style="left:90%;top:14%;animation-delay:-4s">🦄</span><span style="left:8%;top:78%;animation-delay:-3s">🎲</span>
    <span style="left:52%;top:84%;animation-delay:-5s">🐘</span><span style="left:92%;top:72%;animation-delay:-1s">🎒</span>
  </div>
  <div class="wrap">
    <div>
      <h1>Juguetes y útiles para <span>todas las edades</span>, en la Feria Modelo de Ovalle</h1>
      <p>Peluches, juegos de mesa, autos, animales, mochilas y artículos de librería. Llegan en pocas unidades y muchos no se reponen. ${READY
        ? "Mira el catálogo y consúltanos por WhatsApp, desde donde estés."
        : "Estamos terminando de subir el catálogo en línea: mientras tanto, escríbenos por WhatsApp o visítanos."}</p>
      <div class="cta">
        ${READY ? catalogBtn("🛍️ Ver catálogo") : ""}
        ${waBtn("Escríbenos por WhatsApp")}
        ${READY ? "" : `<a class="btn alt" href="/avisame/">🔔 Avisarme cuando abra</a>`}
        <a class="btn alt" href="/como-llegar/">📍 Cómo llegar</a>
      </div>
    </div>
    <div class="place">
      <div class="stat">🛍️ ${READY ? "Catálogo en línea disponible" : "Catálogo en línea: muy pronto"}</div><br>
      <b>📍 ${esc(SITE.streetAddress.split(",").slice(0, 1).join(""))}</b>
      <p>Pasillo naranja, local 45.</p>
      <p><b>Abierto:</b> ${esc(SITE.hoursText)}.</p>
    </div>
  </div>
</section>

<section id="accesos">
  <div class="wrap">
    <div class="tiles">
      <a class="tile reveal" href="/catalogo/"><span class="em" aria-hidden="true">🛍️</span><h3>Catálogo</h3><p>${READY ? "Todos nuestros productos." : "Muy pronto en línea."}</p></a>
      <a class="tile reveal" style="--d:70ms" href="/jugar-en-familia/"><span class="em" aria-hidden="true">🎮</span><h3>En familia</h3><p>Juegos para hacer juntos e imprimibles gratis.</p></a>
      <a class="tile reveal" style="--d:140ms" href="/articulos/"><span class="em" aria-hidden="true">📰</span><h3>Consejos y opiniones</h3><p>Artículos para elegir mejor cada juguete.</p></a>
      <a class="tile reveal" style="--d:210ms" href="/club/"><span class="em" aria-hidden="true">⭐</span><h3>Club Mundonin</h3><p>Una cajita digital cada mes, con cupón para la juguetería.</p></a>
      <a class="tile reveal" style="--d:280ms" href="/nosotros/"><span class="em" aria-hidden="true">🧡</span><h3>Nosotros</h3><p>Nuestra historia, preguntas y cómo llegar.</p></a>
    </div>
  </div>
</section>

<section id="catalogoEstado"><div class="wrap">${catalogPanel()}</div></section>

<section id="suscribete">
  <div class="wrap">
    <div class="panel reveal" style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
      <div><h3>🔔 Que no se te pase lo que llega</h3><p class="sub" style="margin:2px 0 0">Te avisamos primero cuando abra el catálogo y cuando llegue algo nuevo. Los productos son de pocas unidades y no siempre se reponen.</p></div>
      <a class="btn" href="/avisame/">Quiero recibir novedades</a>
    </div>
  </div>
</section>

<section id="ultimosArt">
  <div class="wrap">
    <div class="sec-head reveal"><div><h2>📰 Lo último en consejos y opiniones</h2><p>Lecturas cortas para elegir mejor.</p></div><a class="btn alt sm" href="/articulos/">Ver todos</a></div>
    <div class="grid">${ARTICLES.slice(0, 3).map(artCard).join("")}</div>
  </div>
</section>`
  });

  /* Catálogo */
  add({
    path: "/catalogo/", crumbs: [{ name: "Catálogo" }],
    title: "Catálogo de juguetes y librería | Mundonin Ovalle",
    desc: READY
      ? "Catálogo de Mundonin: peluches, juegos de mesa, autos, animales, muñecas, mochilas y útiles. Pocas unidades de cada uno; consulta por WhatsApp."
      : "El catálogo en línea de Mundonin se está terminando de armar. Mientras tanto, consulta por WhatsApp o visítanos en la Feria Modelo de Ovalle.",
    body: `${viewhead("🛍️ Catálogo", READY ? "Todos nuestros productos. Cada uno llega en pocas unidades y muchos no se reponen." : "Estamos ingresando todos nuestros productos. Muy pronto podrás verlos aquí.", [{ name: "Catálogo" }])}
<section id="catalogo"><div class="wrap">${catalogPanel()}</div></section>
<section>
  <div class="wrap">
    <div class="sec-head reveal"><div><h2>Lo que encontrarás</h2><p>Juguetes y útiles para todas las edades, en estas categorías.</p></div></div>
    <div class="chips">${SITE.cats.map(c => `<span class="chip" style="cursor:default">${esc(c)}</span>`).join("")}</div>
  </div>
</section>
${READY ? "" : `<section id="mientras">
  <div class="wrap">
    <div class="sec-head reveal"><div><h2>Mientras tanto</h2><p>Así puedes conseguir lo que buscas hoy.</p></div></div>
    <div class="steps">
      <div class="step reveal"><span class="em" aria-hidden="true">💬</span><h3>Escríbenos</h3><p>Cuéntanos qué buscas, la edad y tu presupuesto, y te decimos qué tenemos.</p></div>
      <div class="step reveal" style="--d:70ms"><span class="em" aria-hidden="true">📍</span><h3>Visítanos</h3><p>${esc(SITE.streetAddress)}. <a href="/como-llegar/">Cómo llegar</a>.</p></div>
      <div class="step reveal" style="--d:140ms"><span class="em" aria-hidden="true">🔔</span><h3>Pide que te avisemos</h3><p>Te escribimos apenas el catálogo esté abierto. <a href="/avisame/">Avísame</a>.</p></div>
    </div>
  </div>
</section>`}`
  });

  /* Avísame */
  add({
    path: "/avisame/", crumbs: [{ name: "Avísame de novedades" }],
    title: "Avísame de novedades | Mundonin",
    desc: "Pide que te avisemos cuando abra el catálogo de Mundonin y cuando lleguen novedades. Elige las categorías que te interesan.",
    body: `${viewhead("🔔 Avísame de novedades", "Muchos productos no se reponen, así que lo mejor es enterarse primero.", [{ name: "Avísame de novedades" }])}
<section id="avisame">
  <div class="wrap">
    <div class="panel reveal">
      <h2 style="font-size:1.4rem">Cuéntanos qué te interesa</h2>
      <p class="sub">Te avisamos cuando abra el catálogo y cuando llegue algo nuevo.</p>
      <form id="notifyForm">
        <p style="margin:0 0 6px;font-weight:700;font-size:.85rem;color:var(--muted)">Me interesa</p>
        <div class="chkgrid" id="nCats" style="margin-bottom:12px">${SITE.cats.map(c => `<label class="chk"><input type="checkbox" value="${esc(c)}"> ${esc(c)}</label>`).join("")}</div>
        <div class="row">
          <div style="flex:1;min-width:150px"><label for="nName">Tu nombre (opcional)</label><input type="text" id="nName" maxlength="40" autocomplete="given-name"></div>
          <div style="flex:2;min-width:200px"><label for="nWhat">¿Buscas algo en particular? (opcional)</label><input type="text" id="nWhat" maxlength="80" placeholder="Ej: dinosaurio grande, mochila, ludo"></div>
          <div style="flex:1;min-width:120px"><label for="nAge">Edad (opcional)</label><input type="text" id="nAge" maxlength="20" placeholder="Ej: 4 años"></div>
        </div>
        <div class="row" style="margin-top:12px">
          <button class="btn wa" type="submit">Quiero novedades por WhatsApp</button>
          ${SITE.waChannelUrl ? `<a class="btn alt" href="${esc(SITE.waChannelUrl)}" target="_blank" rel="noopener">Unirme al canal de WhatsApp</a>` : ""}
        </div>
      </form>
      ${SITE.brevoFormUrl ? `<div style="margin-top:16px"><iframe src="${esc(SITE.brevoFormUrl)}" title="Suscripción por correo" loading="lazy" style="width:100%;height:440px;border:0"></iframe></div>` : ""}
    </div>
  </div>
</section>`
  });

  /* Jugar en familia */
  add({
    path: "/jugar-en-familia/", crumbs: [{ name: "Jugar en familia" }],
    title: "Jugar en familia: memorice, ideas y retos | Mundonin",
    desc: "Juegos para hacer en familia: memorice de animales, ideas de qué jugar según la edad y un reto familiar cada semana. Gratis, desde el celular.",
    body: `${viewhead("🎮 Jugar en familia", "Juegos para hacer juntos, desde el celular o con los juguetes que tengan en casa.", [{ name: "Jugar en familia" }])}
<section id="familia">
  <div class="wrap">
    <div class="famgrid">
      <div class="panel reveal">
        <h2 style="font-size:1.3rem">🧠 Memorice de animales</h2>
        <p class="sub">Encuentra las parejas. Pásale el celular a otro y compitan por menos intentos.</p>
        <div class="row">
          <div><label for="memLevel">Nivel</label><select id="memLevel"><option value="6">Fácil (6 parejas)</option><option value="8">Normal (8 parejas)</option></select></div>
          <button class="btn alt sm" id="memRestart" type="button">Nueva partida</button>
          <b id="memMoves" aria-live="polite">Intentos: 0</b>
        </div>
        <div class="memgrid" id="memgrid"></div>
        <p id="memMsg" aria-live="polite"></p>
      </div>
      <div class="panel reveal" style="--d:120ms">
        <h2 style="font-size:1.3rem">🎲 ¿A qué jugamos hoy?</h2>
        <p class="sub">Dinos cuántos son y qué edad tiene el menor. Te damos una idea.</p>
        <div class="row">
          <div><label for="iAge">Edad</label><select id="iAge"><option value="1">1 a 2 años</option><option value="3" selected>3 a 4 años</option><option value="5">5 a 6 años</option><option value="7">7 a 8 años</option><option value="9">9 a 10 años</option><option value="11">11 o más</option></select></div>
          <div><label for="iPlayers">Personas</label><select id="iPlayers"><option value="2">2</option><option value="3" selected>3 o 4</option><option value="5">5 o más</option></select></div>
          <button class="btn" id="ideaBtn" type="button"><span id="dice">🎲</span> Sorpréndeme</button>
        </div>
        <div id="ideaOut" aria-live="polite"></div>
      </div>
    </div>
    <div class="challenge reveal">
      <h2 style="font-size:1.2rem">⭐ Reto familiar de la semana</h2>
      <p id="challengeText"></p>
      <button class="btn sm" id="challengeShare" type="button">Compartir el reto</button>
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    <div class="panel reveal">
      <h2 style="font-size:1.3rem">🖨️ ¿Prefieren jugar en papel?</h2>
      <p class="sub">Laberintos, sopas de letras, láminas para colorear, diplomas y un calendario de retos, gratis.</p>
      <a class="btn" href="/imprimibles/">Ver imprimibles gratis</a>
    </div>
  </div>
</section>`
  });

  /* Imprimibles: portada y una página por hoja */
  add({
    path: "/imprimibles/", crumbs: [{ name: "Imprimibles gratis" }],
    title: "Imprimibles gratis para niños: laberintos, sopas de letras y más | Mundonin",
    desc: "Hojas para imprimir gratis: laberintos, sopas de letras de animales, dibujos para colorear, diplomas y un calendario de retos familiares.",
    body: `${viewhead("🖨️ Imprimibles gratis", "Hojas para imprimir en casa: pasen la tarde jugando juntos.", [{ name: "Imprimibles gratis" }])}
<section>
  <div class="wrap">
    <p class="reveal" style="max-width:60ch">Elige una hoja, personalízala si quieres y toca “Imprimir”. En el cuadro de impresión puedes elegir “Guardar como PDF” para compartirla por WhatsApp.</p>
    <div class="stages" style="margin-top:14px">
      ${IMP.map((m, i) => `<a class="stage reveal" style="--d:${i * 70}ms" href="/imprimibles/${m.slug}/"><span class="em" aria-hidden="true">${m.em}</span><h3>${m.name}</h3><p>${m.blurb}</p></a>`).join("\n      ")}
    </div>
  </div>
</section>
<section>
  <div class="wrap">
    <div class="panel reveal">
      <h2 style="font-size:1.3rem">⭐ ¿Quieres material nuevo cada mes?</h2>
      <p class="sub">El Club Mundonin trae una cajita digital mensual con cosas para imprimir, un juego para coleccionar y una actividad en familia.</p>
      <a class="btn alt" href="/club/">Conocer el Club</a>
    </div>
  </div>
</section>`
  });
  for (const m of IMP) {
    const others = IMP.filter(x => x.slug !== m.slug);
    add({
      path: `/imprimibles/${m.slug}/`, css: ["imprimibles.css"], js: ["imprimibles.js"],
      crumbs: [{ name: "Imprimibles gratis", path: "/imprimibles/" }, { name: m.name }],
      title: m.title, desc: m.desc,
      body: `${viewhead(m.h1, m.intro + " Si quieres, elige “Guardar como PDF” en el cuadro de impresión.", [{ name: "Imprimibles gratis", path: "/imprimibles/" }, { name: m.name }])}
<section>
  <div class="wrap">
${frag(m.slug)}
    <div class="noprint related">
      <h2 style="font-size:1.3rem;margin:10px 0">Más imprimibles gratis</h2>
      <div class="stages">${others.map(o => `<a class="stage" href="/imprimibles/${o.slug}/"><span class="em" aria-hidden="true">${o.em}</span><h3>${o.name}</h3><p>${o.blurb}</p></a>`).join("")}</div>
    </div>
  </div>
</section>`
    });
  }

  /* Consejos */
  add({
    path: "/consejos/", crumbs: [{ name: "Consejos rápidos" }],
    title: "Consejos para elegir juguetes, regalar y jugar en familia | Mundonin",
    desc: "Ideas simples para elegir bien un juguete, cuidar la seguridad de los más chicos, jugar en familia y regalar sin equivocarte.",
    body: `${viewhead("💡 Consejos rápidos", "Ideas simples para elegir, regalar y cuidar los juguetes.", [{ name: "Consejos rápidos" }])}
<section id="consejos">
  <div class="wrap">
    <div class="tips">${TIPS.map((g, i) => `<div class="tipgroup reveal" style="--d:${i * 80}ms"><h2 style="font-size:1.25rem;margin-bottom:6px">${g.t}</h2>${details(g.items)}</div>`).join("")}</div>
    <p class="note" style="margin-top:12px">Son consejos generales. Ante cualquier duda sobre el desarrollo o la salud de tu hijo o hija, consulta a su pediatra.</p>
    <p style="margin-top:14px"><a class="btn alt" href="/articulos/">Leer los artículos completos</a></p>
  </div>
</section>`
  });

  /* Artículos: lista y una página por artículo */
  const tags = ["Todos", ...ART_TAGS.filter(t => ARTICLES.some(a => a.tag === t))];
  add({
    path: "/articulos/", crumbs: [{ name: "Artículos y opiniones" }],
    title: "Artículos y opiniones sobre juguetes y regalos | Mundonin",
    desc: "Guías y opiniones de Mundonin: qué regalar según la edad, cómo elegir peluches, juegos de mesa, mochilas y autos, y cómo jugar en familia.",
    body: `${viewhead("📰 Artículos y opiniones", "Artículos de Mundonin sobre juguetes, regalos y juegos en familia.", [{ name: "Artículos y opiniones" }])}
<section id="articulos">
  <div class="wrap">
    <div class="chips" id="artChips" role="group" aria-label="Tipo de artículo">${tags.map(t => `<button class="chip" type="button" aria-pressed="${t === "Todos"}" data-t="${esc(t)}">${esc(t)}</button>`).join("")}</div>
    <div class="grid" id="artGrid">${ARTICLES.map(artCard).join("")}</div>
    <div class="panel reveal" style="margin-top:18px">
      <h2 style="font-size:1.3rem">✍️ ¿Compraste algo en Mundonin?</h2>
      <p class="sub">Cuéntanos tu opinión sobre el juguete. Si nos das permiso, la publicamos aquí para ayudar a otras familias.</p>
      ${waBtn("Enviar mi opinión por WhatsApp", "Hola Mundonin, quiero dejar mi opinión sobre un juguete que compré:\n• Producto: \n• Mi opinión: ")}
    </div>
  </div>
</section>`
  });
  ARTICLES.forEach((a, idx) => {
    const url = `${SITE.url}/articulos/${a.slug}/`;
    const paras = a.body.split(/\n\s*\n/).map(p => `<p>${esc(p).replace(/\n/g, "<br>")}</p>`).join("");
    const rel = ARTICLES.filter(x => x.id !== a.id).sort((x, y) => (y.cat === a.cat) - (x.cat === a.cat) || y.created - x.created).slice(0, 3);
    add({
      path: `/articulos/${a.slug}/`, ogType: "article",
      crumbs: [{ name: "Artículos y opiniones", path: "/articulos/" }, { name: a.title }],
      title: a.title, desc: a.summary,
      ld: [{ "@context": "https://schema.org", "@type": "Article", headline: a.title, description: a.summary, datePublished: a.date, dateModified: a.date,
        inLanguage: "es-CL", mainEntityOfPage: url, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url + "/" } }],
      body: `<div class="viewhead"><div class="wrap"><nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a> › <a href="/articulos/">Artículos y opiniones</a> › <span aria-current="page">${esc(a.title)}</span></nav></div></div>
<section>
  <div class="wrap">
    <article class="artbody">
      <span class="arttag">${esc(a.tag)}</span>
      <h1 style="font-size:clamp(1.6rem,4vw,2.2rem);margin:8px 0">${esc(a.title)}</h1>
      <p class="note">Equipo Mundonin · <time datetime="${a.date}">${fechaLarga(a.date)}</time></p>
      ${paras}
      <div class="row" style="margin:18px 0">
        <button class="btn" type="button" data-share="${esc(a.title)} · Mundonin">Compartir artículo</button>
        ${waBtn("Preguntar por WhatsApp", `Hola Mundonin, leí el artículo “${a.title}” y quisiera consultar por un producto.`)}
        ${READY ? catalogBtn("Ver el catálogo", "alt") : ""}
      </div>
    </article>
    <div class="artrel">
      <div class="sec-head"><div><h2>Te puede interesar</h2></div><a class="btn alt sm" href="/articulos/">Ver todos</a></div>
      <div class="grid">${rel.map(artCard).join("")}</div>
    </div>
  </div>
</section>`
    }, { lastmod: a.date });
  });

  /* Club */
  add({
    path: "/club/", crumbs: [{ name: "Club Mundonin" }],
    title: "Club Mundonin: una cajita digital de juegos cada mes",
    desc: "Club Mundonin: cada mes material para imprimir, un juego para coleccionar, una actividad en familia y un cupón de descuento en la juguetería.",
    body: `${viewhead("⭐ Club Mundonin", "Una cajita digital cada mes con cosas para imprimir, un juego para coleccionar y una actividad para hacer en familia. Más un cupón de descuento en la juguetería.", [{ name: "Club Mundonin" }])}
<section id="clubBeneficios">
  <div class="wrap">
    <div class="sec-head reveal"><div><h2>Qué trae cada cajita</h2><p>Todo pensado para jugar en familia, mes a mes.</p></div></div>
    <div class="tiles">
      <div class="tile reveal"><span class="em" aria-hidden="true">🖨️</span><h3>Para imprimir</h3><p>Laberintos, sopas de letras, láminas para colorear y juegos para recortar.</p></div>
      <div class="tile reveal" style="--d:70ms"><span class="em" aria-hidden="true">🧩</span><h3>Un juego para coleccionar</h3><p>Un juego de mesa, o una parte de uno, que se va completando mes a mes.</p></div>
      <div class="tile reveal" style="--d:140ms"><span class="em" aria-hidden="true">🏕️</span><h3>Juego manual de fin de semana</h3><p>Una actividad para hacer con las manos, en familia, con instrucciones paso a paso.</p></div>
      <div class="tile reveal" style="--d:210ms"><span class="em" aria-hidden="true">🎟️</span><h3>Cupón de descuento</h3><p>Cada mes, un cupón para canjear en la juguetería de la Feria Modelo.</p></div>
      <div class="tile reveal" style="--d:280ms"><span class="em" aria-hidden="true">📧</span><h3>Novedades por correo</h3><p>Te contamos qué trae la cajita antes de cada entrega.</p></div>
      <div class="tile reveal" style="--d:350ms"><span class="em" aria-hidden="true">💳</span><h3>Pago simple y sin ataduras</h3><p>Cobro mensual con tarjeta. Te das de baja online cuando quieras.</p></div>
    </div>
  </div>
</section>
<section id="clubPack">
  <div class="wrap">
    <div class="panel reveal">
      <h2 style="font-size:1.3rem">🎁 Prueba primero: material de muestra gratis</h2>
      <p class="sub">Mira cómo son las hojas antes de decidir. Ya hay laberintos, sopas de letras, láminas para colorear, diplomas y un calendario de retos.</p>
      <div class="row">
        <a class="btn" href="/imprimibles/">Ver imprimibles gratis</a>
        ${waBtn("Preguntar por el Club por WhatsApp", "Hola Mundonin, quiero saber más del Club Mundonin.")}
      </div>
    </div>
  </div>
</section>
<section id="unirme">
  <div class="wrap">
    <div class="famgrid">
      <div class="panel reveal" style="border:3px solid var(--brand)">
        <h2 style="font-size:1.3rem">Club Mundonin</h2>
        <p style="margin:6px 0"><span class="price" style="font-size:2.2rem">${clp(SITE.clubPrice)}</span> <span class="note">al mes</span></p>
        <ul style="padding-left:20px;margin:8px 0 0">
          <li>Material para imprimir cada mes</li>
          <li>Un juego de mesa, o parte de uno, para coleccionar</li>
          <li>Un juego manual para hacer en un fin de semana en familia</li>
          <li>Cupón mensual de descuento en la juguetería</li>
          <li>Correos con las novedades de cada cajita</li>
          <li>Pago mensual con tarjeta y baja online cuando quieras</li>
        </ul>
      </div>
      <div class="panel reveal" style="--d:100ms">
        <h2 style="font-size:1.3rem">Quiero unirme</h2>
        <p class="sub">Completa tus datos y sigue al paso final. No guardamos tus datos en esta web.</p>
        <form id="clubForm" class="form-grid" style="grid-template-columns:1fr">
          <div><label for="cName">Tu nombre</label><input type="text" id="cName" maxlength="40" required></div>
          <div><label for="cMail">Tu correo</label><input type="text" id="cMail" inputmode="email" maxlength="80" required placeholder="nombre@correo.cl"></div>
          <div><label for="cAge">Edad del niño o niña</label><select id="cAge"><option>3 a 5 años</option><option>6 a 8 años</option><option>9 años o más</option></select></div>
          <div class="row"><button class="btn" type="submit">Quiero unirme al Club</button></div>
        </form>
        <p class="note" style="margin-top:10px">¿Ya eres socio? <a href="#" id="clubCancel">Darme de baja</a></p>
      </div>
    </div>
  </div>
</section>
<section id="clubFaq">
  <div class="wrap">
    <div class="sec-head reveal"><div><h2>Preguntas del Club</h2></div></div>
    <div class="panel reveal">${details(CLUB_FAQS)}</div>
  </div>
</section>`
  });

  /* Nosotros */
  add({
    path: "/nosotros/", crumbs: [{ name: "Nuestra historia" }],
    title: "Nuestra historia: Mundonin nació del cariño",
    desc: "La historia de Mundonin, el local de juguetes y librería de la Feria Modelo de Ovalle que sigue abierto gracias al cariño de la familia.",
    body: `${viewhead("🧡 Nuestra historia", "Quiénes somos y por qué seguimos aquí.", [{ name: "Nuestra historia" }])}
<section id="historia">
  <div class="wrap">
    <div class="story" style="grid-template-columns:1fr">
      <div>
        <h2>Mundonin nació del cariño</h2>
        <blockquote>
          <p>Lleva el nombre de quien soñó este local de feria en Ovalle y lo atendió con ganas todos los días. Hoy lo sigue su esposa, con el mismo cariño.</p>
          <p>Este invierno las lluvias golpearon fuerte al local, y lo levantamos de nuevo con esfuerzo y apoyo de la familia. Seguimos aquí, con las puertas abiertas, y con juguetes, peluches, juegos y útiles para toda la familia.</p>
          <p>Gracias por elegirnos. Cada compra ayuda a que este sueño siga vivo.</p>
        </blockquote>
      </div>
    </div>
    <p style="margin-top:16px"><a class="btn" href="/como-llegar/">📍 Cómo llegar</a> <a class="btn alt" href="/preguntas-frecuentes/">Preguntas frecuentes</a></p>
  </div>
</section>`
  });

  /* Preguntas frecuentes */
  add({
    path: "/preguntas-frecuentes/", crumbs: [{ name: "Preguntas frecuentes" }],
    title: "Preguntas frecuentes | Mundonin",
    desc: "Respuestas a lo que más nos consultan: horarios, cómo comprar, reposición de productos, envíos, medios de pago y qué juguete elegir según la edad.",
    body: `${viewhead("❓ Preguntas frecuentes", "Lo que más nos consultan.", [{ name: "Preguntas frecuentes" }])}
<section id="preguntas"><div class="wrap"><div class="panel reveal">${details(FAQS)}</div>
<p style="margin-top:16px">¿No encontraste lo que buscabas? ${waBtn("Escríbenos por WhatsApp")}</p></div></section>`
  });

  /* Cómo llegar */
  add({
    path: "/como-llegar/", crumbs: [{ name: "Cómo llegar" }],
    title: "Juguetería en la Feria Modelo de Ovalle: cómo llegar y horarios | Mundonin",
    desc: `Mundonin está en la ${SITE.streetAddress}, ${SITE.city}. Abierto lun, mié, vie y sáb de 9:30 a 17:00. WhatsApp ${SITE.phoneDisplay}.`,
    ld: [toyStoreLd()],
    body: `${viewhead("📍 Cómo llegar", "Juguetería y librería en la Feria Modelo de Ovalle.", [{ name: "Cómo llegar" }])}
<section id="local">
  <div class="wrap">
    <div class="place">
      <b>${esc(SITE.streetAddress)}</b>
      <p>${esc(SITE.city)}, ${esc(SITE.region)}.</p>
      <p><b>Abierto:</b> ${esc(SITE.hoursText)}.</p>
      <p><b>Teléfono / WhatsApp:</b> <a href="tel:${SITE.phoneTel}">${esc(SITE.phoneDisplay)}</a></p>
      <p style="display:flex;flex-wrap:wrap;gap:10px;margin-top:12px">
        <a class="btn sm" target="_blank" rel="noopener" href="${esc(SITE.mapsUrl)}">Abrir en Google Maps</a>
        ${waBtn("WhatsApp", undefined, "sm")}
      </p>
    </div>
    <p style="max-width:60ch;margin-top:16px">Busca el <b>pasillo naranja</b> dentro de la Feria Modelo y el <b>local 45</b>. Atendemos cuatro días a la semana; si vienes de lejos, escríbenos antes por WhatsApp y te confirmamos que tengamos lo que buscas.</p>
  </div>
</section>`
  });

  /* 404 */
  add({
    path: "/404.html", noindex: true,
    title: "Página no encontrada | Mundonin",
    desc: "La página que buscas no existe. Vuelve al inicio de Mundonin.",
    body: `${viewhead("Ups, esta página no existe", "Puede que el enlace haya cambiado.")}
<section><div class="wrap"><p><a class="btn" href="/">Volver al inicio</a> <a class="btn alt" href="/catalogo/">Ver el catálogo</a></p></div></section>`
  }, { noSitemap: true, file: "404.html" });

  return out;
}
