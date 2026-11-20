import fs from "node:fs";
import { SITE } from "./data/site.mjs";

export const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
export const waHref = (text = "Hola Mundonin, quisiera consultar por un producto.") =>
  `https://wa.me/${SITE.waNumber}?text=${encodeURIComponent(text)}`;
export const TINTS = ["#f3e2c9","#dcebd8","#f6d9cc","#e6e0cf","#f9ebb8","#d9e6e3"];
export const READY = !!SITE.catalogUrl;
export const clp = n => "$" + Number(n).toLocaleString("es-CL");
export const fechaLarga = iso => new Date(iso + "T12:00:00-03:00").toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });

/* Versiones de los archivos (para que el navegador recargue cuando cambian). Las llena build.mjs. */
export const ASSET = {};
export const HAS_OG = fs.existsSync(new URL("./assets/og.png", import.meta.url));

const NAV = [
  { label: "Inicio", href: "/" },
  { label: "Catálogo", href: "/catalogo/" },
  { label: "En familia", children: [
    { label: "🎮 Jugar en familia", href: "/jugar-en-familia/" },
    { label: "🖨️ Imprimibles gratis", href: "/imprimibles/" } ] },
  { label: "Consejos y opiniones", children: [
    { label: "📰 Artículos y opiniones", href: "/articulos/" },
    { label: "💡 Consejos rápidos", href: "/consejos/" } ] },
  { label: "⭐ Club", href: "/club/" },
  { label: "Nosotros", children: [
    { label: "🧡 Nuestra historia", href: "/nosotros/" },
    { label: "❓ Preguntas frecuentes", href: "/preguntas-frecuentes/" },
    { label: "📍 Cómo llegar", href: "/como-llegar/" } ] }
];
const isCur = (path, href) => href === "/" ? path === "/" : path.startsWith(href);

function header(path) {
  const items = NAV.map(it => {
    if (!it.children) return `<li${isCur(path, it.href) ? ' class="cur"' : ""}><a href="${it.href}"${isCur(path, it.href) ? ' aria-current="page"' : ""}>${it.label}</a></li>`;
    const cur = it.children.some(c => isCur(path, c.href));
    return `<li class="dd${cur ? " cur" : ""}"><button class="dd-btn" aria-expanded="false" aria-haspopup="true">${it.label} ▾</button>
          <ul class="sub">${it.children.map(c => `<li><a href="${c.href}"${isCur(path, c.href) ? ' aria-current="page"' : ""}>${c.label}</a></li>`).join("")}</ul></li>`;
  }).join("\n        ");
  return `<header class="top">
  <div class="wrap">
    <a class="brand" href="/" aria-label="Mundonin, inicio"><span class="mark">Mundonin</span></a>
    <button class="burger btn alt sm" id="burger" aria-expanded="false" aria-controls="menu">☰ Menú</button>
    <nav aria-label="Principal">
      <ul class="menu" id="menu">
        ${items}
      </ul>
    </nav>
  </div>
</header>`;
}

function ticker() {
  const msgs = [
    "🧸 Pocas unidades de cada producto",
    "🆕 Novedades que no siempre se reponen",
    "💬 Consulta por WhatsApp",
    `📍 ${SITE.streetAddress}`,
    "🎁 Regalo envuelto en el local",
    `🕘 ${SITE.hoursShort}`
  ];
  const html = msgs.map(m => `<span>${esc(m)}</span>`).join("");
  return `<div class="ticker" aria-hidden="true"><div class="track">${html}${html}</div></div>`;
}

function footer() {
  const links = NAV.flatMap(n => n.children ? n.children : [n]).filter(n => n.href !== "/");
  return `<footer><div class="wrap">
  <div class="fgrid">
    <div>
      <b class="flogo">Mundonin</b>
      <address>Juguetería y librería<br>${esc(SITE.streetAddress)}<br>${esc(SITE.city)}, ${esc(SITE.region)}<br>
      <a href="tel:${SITE.phoneTel}">${esc(SITE.phoneDisplay)}</a><br>Abierto: ${esc(SITE.hoursText)}.</address>
    </div>
    <nav aria-label="Secciones"><ul>${links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul></nav>
  </div>
  <p><button class="btn alt sm" type="button" data-share="Mira Mundonin, la juguetería de la Feria Modelo de Ovalle 🧸">📲 Comparte Mundonin con tu familia</button></p>
  <p>© Mundonin · ${esc(SITE.streetAddress)}.</p>
</div></footer>`;
}

export const ldScript = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

export function toyStoreLd() {
  return {
    "@context": "https://schema.org", "@type": "ToyStore",
    name: SITE.name, url: SITE.url + "/",
    description: "Juguetería y librería en la Feria Modelo de Ovalle: peluches, juegos de mesa, autos, animales, muñecas, mochilas y útiles.",
    telephone: SITE.phoneTel,
    address: { "@type": "PostalAddress", streetAddress: SITE.streetAddress, addressLocality: SITE.city, addressRegion: SITE.region, addressCountry: "CL" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday", "Friday", "Saturday"], opens: "09:30", closes: "17:00" }],
    areaServed: { "@type": "Country", name: "Chile" }
  };
}

export const viewhead = (h1, sub, crumbs = []) => `<div class="viewhead"><div class="wrap">
  ${crumbs.length ? `<nav class="crumbs" aria-label="Ruta"><a href="/">Inicio</a>${crumbs.map(c => c.path ? ` › <a href="${c.path}">${esc(c.name)}</a>` : ` › <span aria-current="page">${esc(c.name)}</span>`).join("")}</nav>` : ""}
  <h1>${h1}</h1>${sub ? `\n  <p>${sub}</p>` : ""}
</div></div>`;

/* page({...}) devuelve el HTML completo */
export function page({ path, title, desc, body, ld = [], css = [], js = [], noindex = false, ogType = "website", crumbs = [] }) {
  const fullTitle = title.includes("Mundonin") ? title : `${title} | Mundonin`;
  const url = SITE.url + path;
  const breadcrumbLd = crumbs.length ? [{
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [{ name: "Inicio", path: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem", position: i + 1, name: c.name, item: SITE.url + (c.path || path) }))
  }] : [];
  const MN = { wa: SITE.waNumber, catalogUrl: SITE.catalogUrl, clubPrice: SITE.clubPrice, clubPayUrl: SITE.clubPayUrl, clubCancelUrl: SITE.clubCancelUrl };
  const v = f => ASSET[f] ? `?v=${ASSET[f]}` : "";
  return `<!doctype html>
<html lang="es-CL">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta property="og:site_name" content="${SITE.name}">
<meta property="og:locale" content="${SITE.locale}">
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
${HAS_OG ? `<meta property="og:image" content="${SITE.url}/assets/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="${SITE.url}/assets/og.png">` : ""}
<meta name="twitter:card" content="${HAS_OG ? "summary_large_image" : "summary"}">
<meta name="theme-color" content="#b5532b">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<script>document.documentElement.classList.add('js')</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/styles.css${v("styles.css")}">
${css.map(f => `<link rel="stylesheet" href="/assets/${f}${v(f)}">`).join("\n")}
${[...ld, ...breadcrumbLd].map(ldScript).join("\n")}
</head>
<body>
${header(path)}
${ticker()}
<main id="main">
${body}
</main>
${footer()}
<div class="toast" id="toast" role="status"></div>
<a class="btn wa fab" href="${waHref()}" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">💬 WhatsApp</a>
<script>window.MN=${JSON.stringify(MN)}</script>
<script src="/assets/app.js${v("app.js")}" defer></script>
${js.map(f => `<script src="/assets/${f}${v(f)}" defer></script>`).join("\n")}
</body>
</html>
`;
}
