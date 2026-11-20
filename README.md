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
