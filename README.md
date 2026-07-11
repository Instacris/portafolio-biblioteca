# Portafolio de Cristóbal Chacón — «Edición Biblioteca»

Portafolio personal (HTML + CSS + JavaScript, **sin frameworks ni build**).
Estética editorial y formal: papel, tinta y oro, con estructura de libro
(capítulos, láminas, apéndices y epílogo). Es la **segunda edición** del
portafolio; la primera (cyberpunk / pixel art) queda enlazada como
«La edición arcade».

## Temas
- **Pergamino** (claro) — por defecto si el sistema usa tema claro.
- **Medianoche** (oscuro) — botón sol/luna en la barra superior.
  La preferencia se guarda en `localStorage`.

## Estructura de la página (una sola página)
1. **Portada** — nombre, epigrama, retrato («Lám. I») y cifras.
2. **Capítulo I · Perfil** — presentación con letra capital y ficha de autor.
3. **Capítulo II · Conocimientos** — lenguajes (medidores), herramientas y Excel.
4. **Capítulo III · Experiencia** — línea de tiempo laboral.
5. **Capítulo IV · Proyectos** — catálogo de obras con numeración romana y enlaces en vivo.
6. **Apéndices** — KAMEX Tech (servicios) y la edición arcade (portafolio anterior).
7. **Epílogo · Contacto** — email, GitHub y LinkedIn.

## Cómo editar tu información
Casi todo el contenido vive en **`js/data.js`**:

- `LENGUAJES` — nombre y nivel (%) de cada lenguaje.
- `HERRAMIENTAS` — nombre, descripción y etiqueta.
- `EXCEL_SKILLS` — lista de habilidades de Excel.
- `EXPERIENCIA` — trabajos (cargo, empresa, fecha, descripción, tags).
- `PROYECTOS` — obras del catálogo (nombre, descripción, `link` real y tags).
  Para agregar un proyecto nuevo, copia un bloque `{ ... },` y edítalo:
  la numeración romana se genera sola.
- `CONTACTO` — email, GitHub y LinkedIn.

Los textos del perfil, los apéndices (KAMEX / edición arcade) y el epigrama
se editan directamente en `index.html`.

### Foto de perfil
`img/fotoperfil.jpg` — se muestra en el marco de arco de la portada.
Si no existe, aparece un monograma de respaldo.

## Estructura de archivos
```
index.html        Página completa (portada → epílogo)
favicon.svg       Monograma «C» dorado
css/styles.css    Tokens de tema, layout y componentes
js/data.js        ← edita aquí tu información
js/main.js        Render, tema claro/oscuro, reveals, navegación
img/fotoperfil.jpg
vercel.json       Headers de seguridad para el deploy
```

## Ver en local
Sitio estático: abre `index.html` en el navegador, o levanta un servidor
(`npx serve .`).
