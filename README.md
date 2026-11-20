# Mundonin

Sitio estático de la juguetería (mundonin.cl). Se genera con Node, sin dependencias.

## Cómo se usa
```
node build.mjs
```
Genera todas las páginas en `docs/` y revisa enlaces internos, títulos, descripciones y `<h1>`.
Para publicar, sube la carpeta `docs/` (GitHub Pages con "main /docs", Netlify o Cloudflare Pages con directorio de salida `docs`).

## Dónde se edita
- `src/data/site.mjs`: dirección, horarios, WhatsApp, **enlace del catálogo (`catalogUrl`)**, Brevo y Club.
- `src/data/articles.mjs`, `tips.mjs`, `club-faqs.mjs`: textos de artículos, consejos y preguntas del Club.
- `src/pages.mjs`: cada página (texto, título y descripción para Google).
- `src/assets/`: estilos y scripts. `og.png` es la imagen que se ve al compartir.

Cuando el catálogo esté listo: pega su enlace en `catalogUrl`, ejecuta `node build.mjs` y sube `docs/`.

## Cloudflare Pages
- Proyecto conectado a este repositorio, rama `main`, directorio de salida `docs`. Comando de build: vacío (o `node build.mjs`).
- `build.mjs` genera `docs/_headers` (seguridad y caché) y `docs/_redirects` (direcciones cortas y `/wa`, enlace directo a WhatsApp para redes sociales).
- La redirección de `www.mundonin.cl` a `mundonin.cl` se crea en el panel (Rules > Redirect Rules), porque `_redirects` no distingue dominios.
- Analítica: actívala con un clic en el proyecto de Pages, o pega el token en `cfAnalyticsToken` (`src/data/site.mjs`).
