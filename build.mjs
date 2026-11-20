/* Genera el sitio estático en la carpeta docs/.
   Uso:  node build.mjs
   Editar contenido: src/data/*.mjs (configuración, artículos, consejos) y src/pages.mjs (páginas).
   Publicar: sube la carpeta docs/ (GitHub Pages, Netlify, Cloudflare Pages, etc.). */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { SITE } from "./src/data/site.mjs";
import { ASSET } from "./src/layout.mjs";
import { buildPages } from "./src/pages.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, "src");
const OUT = path.join(ROOT, "docs");

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "assets"), { recursive: true });

/* archivos estáticos con versión en la URL (se recargan solo cuando cambian) */
for (const f of fs.readdirSync(path.join(SRC, "assets"))) {
  const buf = fs.readFileSync(path.join(SRC, "assets", f));
  ASSET[f] = crypto.createHash("md5").update(buf).digest("hex").slice(0, 8);
  fs.writeFileSync(path.join(OUT, "assets", f), buf);
}

const fileFor = p => p.endsWith("/") ? path.join(OUT, p, "index.html") : path.join(OUT, p);
const pages = buildPages();   // se arma después de llenar ASSET
const urls = [];
for (const pg of pages) {
  const dest = fileFor(pg.path);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, pg.html);
  if (!pg.noSitemap) urls.push(pg);
}

fs.writeFileSync(path.join(OUT, "favicon.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#b5532b"/><text x="50" y="68" font-size="58" text-anchor="middle">🧸</text></svg>\n`);
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
fs.writeFileSync(path.join(OUT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(u => `  <url><loc>${SITE.url}${u.path}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`).join("\n") + `\n</urlset>\n`);

/* ---------- validación ---------- */
const problems = [], titles = new Map(), descs = new Map();
const exists = p => { const q = p.split("#")[0].split("?")[0]; if (!q) return true;
  return fs.existsSync(path.join(OUT, q)) && fs.statSync(path.join(OUT, q)).isFile() || fs.existsSync(path.join(OUT, q, "index.html")); };
for (const pg of pages) {
  const t = pg.html.match(/<title>(.*?)<\/title>/)[1], d = pg.html.match(/name="description" content="(.*?)"/)[1];
  if (titles.has(t)) problems.push(`título repetido: ${pg.path} y ${titles.get(t)}`); titles.set(t, pg.path);
  if (descs.has(d)) problems.push(`descripción repetida: ${pg.path} y ${descs.get(d)}`); descs.set(d, pg.path);
  if (t.length > 75) problems.push(`título largo (${t.length}): ${pg.path}`);
  if (d.length > 175) problems.push(`descripción larga (${d.length}): ${pg.path}`);
  if ((pg.html.match(/<h1[ >]/g) || []).length !== 1) problems.push(`debe tener un solo <h1>: ${pg.path}`);
  for (const m of pg.html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const link = m[1].replace(/\?v=\w+$/, "");
    if (!exists(link)) problems.push(`enlace roto en ${pg.path}: ${m[1]}`);
  }
}
console.log(`${pages.length} páginas generadas en docs/`);
if (problems.length) { console.log("\nAvisos:\n- " + problems.join("\n- ")); process.exitCode = 1; }
else console.log("Sin avisos: enlaces internos, títulos, descripciones y <h1> en orden.");
