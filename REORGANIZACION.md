# Proyecto reorganizado

## Qué se ha hecho

- `templates/index.html` se ha convertido en un archivo ligero que incluye parciales.
- Todo el CSS inline se ha movido a `static/css/index.bundle.css`.
- Todo el JavaScript inline se ha movido a `static/js/index.bundle.js`.
- Cada pantalla principal (`div.screen`) se ha separado en `templates/partials/screens/`.
- El resto de elementos globales del body se ha movido a `templates/partials/misc_body.html`.

## Estructura nueva

- `templates/index.html`
- `templates/partials/screens/*.html`
- `templates/partials/misc_body.html`
- `static/css/index.bundle.css`
- `static/js/index.bundle.js`

## Qué tocar a partir de ahora

- **Diseño general:** `static/css/index.bundle.css`
- **Lógica JS:** `static/js/index.bundle.js`
- **Pantallas concretas:** `templates/partials/screens/`
- **Estructura principal:** `templates/index.html`

## Ventaja

El archivo `index.html` deja de estar cerca del límite de tamaño y el proyecto queda mucho más fácil de mantener en VS Code, GitHub y Render.
