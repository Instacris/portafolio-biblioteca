# Portafolio de Cristóbal Chacón — «Edición Biblioteca»

Portafolio personal (HTML + CSS + JavaScript, **sin frameworks ni build**).
Estética editorial y formal: papel, tinta y oro, con estructura de libro
(capítulos, láminas, apéndices y epílogo). Es la **segunda edición** del
portafolio; la primera (cyberpunk / pixel art) queda enlazada como
«La edición arcade».

## Temas
- **Pergamino** (claro) — siempre por defecto.
- **Medianoche** (oscuro) — botón sol/luna en la barra superior.
  La preferencia se guarda en `localStorage`.

## Estructura de la página (una sola página)
1. **Portada** — nombre, frase que se escribe sola, botones y cinta de tecnologías.
2. **Capítulo I · Perfil** — presentación con letra capital y ficha de autor.
3. **Capítulo II · Conocimientos** — educación, herramientas y Excel.
4. **Capítulo III · Pasatiempos** — fondo oscuro con el ojo de fuego animado.
5. **Capítulo IV · Experiencia** — línea de tiempo laboral.
6. **Capítulo V · Proyectos** — catálogo de obras con numeración romana y enlaces en vivo.
7. **Apéndices** — KAMEX Tech y la edición arcade.
8. **Epílogo · Contacto** — email y dock de redes.

## Efectos (JavaScript puro, sin React ni librerías)
Los componentes vienen de React Bits / shadcn, pero este sitio **no usa build**,
así que están reimplementados a mano respetando su comportamiento y sus props:

| Efecto | Dónde | Archivo |
|---|---|---|
| **SplitText** (letra por letra) | El nombre de la portada | `js/effects.js` |
| **TextType** (máquina de escribir) | Solo la portada | `js/effects.js` |
| **ShinyText** (brillo que recorre) | Botones y llamada de las obras | `js/effects.js` + `css/effects.css` |
| **LogoLoop** (cinta infinita) | Bajo el texto de la portada | `js/effects.js` |
| **BubbleMenu** (menú de burbujas) | Navegación centrada, PC y teléfono | `js/effects.js` |
| **ElectricBorder** (marco eléctrico) | Foto de la portada | `js/effects.js` |
| **Ferrofluid** (WebGL) | Fondo de la portada | `js/backgrounds.js` |
| **EvilEye** (ojo de fuego, WebGL) | Fondo de Pasatiempos | `js/backgrounds.js` |
| **LightPillar** (pilar de luz, WebGL) | Fondo de Experiencia | `js/backgrounds.js` |
| **MagicBento** (foco, brillo, partículas) | Sobre las obras de Proyectos | `js/effects.js` |
| **Riel de fotos** | Viaja por la derecha al hacer scroll | `js/effects.js` |
| **Dock de redes** | Epílogo, se abre al pasar el cursor | `js/effects.js` |

## Las obras (Proyectos)
Cada obra es **solo una imagen**, en blanco y negro; al pasar el cursor se ve a
color y aparece el botón «Clickea para visualizar». Al hacer clic se abre una
ficha con el título, la descripción, las tecnologías y, **al final de todo el
texto**, el enlace al sitio en vivo.

Las capturas viven en `img/proyectos/` y se enlazan con el campo `img` de cada
proyecto en `js/data.js`.

Encima de esas tarjetas actúa **MagicBento**: un foco que sigue al cursor por
toda la sección, brillo de borde según la cercanía, partículas al pasar por
encima, inclinación 3D con magnetismo y una onda al hacer clic. En pantallas
táctiles se desactiva solo.

Los marcos (paneles, fichas y portadas) llevan un filete dorado que se
despliega y esquinas de lámina que aparecen al pasar el cursor: todo en CSS,
sin coste en el hilo principal.

## Tema
Arranca siempre en **modo claro**; el oscuro solo se usa si tú lo elegiste antes
(se guarda en `localStorage`). No sigue la preferencia del sistema.

Todos respetan «reducir movimiento» del sistema y los fondos animados se
**pausan** cuando su sección no está a la vista.

## Las 3 fotos que viajan con el scroll
Guarda tus fotos en `img/` con **exactamente** estos nombres:

| Archivo | Foto | Aparece grande en |
|---|---|---|
| `img/hermano.jpg` | Con tu hermano | Pasatiempos |
| `img/traje.jpg` | Con traje | Experiencia |
| `img/escritorio.jpg` | Programando | Proyectos |

Mientras falten, en su lugar se ve un recuadro que indica el nombre que
debe tener el archivo. El viaje de las fotos es de **escritorio (≥1200px)**;
en teléfono y tablet se muestran como collage en la portada.

## Cómo editar tu información
Casi todo el contenido vive en **`js/data.js`**:

- `EDUCACION` — estudios (título, institución, detalle, `state`: "en curso" o "listo").
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
`img/fotoperfil.jpg` — se muestra en la portada dentro del marco eléctrico.

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

## Rendimiento
Diagnóstico medido en el navegador y corregido:

| Causa | Antes | Ahora |
|---|---|---|
| MagicBento leía el rectángulo de las 11 obras en cada `mousemove` | 2 ms por evento (~120 ms por segundo de ratón) | rects cacheados + agrupado en un `requestAnimationFrame`: **0,7 ms** |
| LetterGlitch repintaba 3.441 caracteres por fotograma | ~3 ms por fotograma (~190 ms/s) | **eliminado** |
| TargetCursor mantenía un `requestAnimationFrame` siempre activo | — | **eliminado** |
| `backdrop-filter` en las tarjetas de las secciones oscuras | 10 elementos | 8 (fondo semiopaco en su lugar) |
| Cinta de logos animando fuera de pantalla | siempre | se pausa cuando no se ve |

Los shaders WebGL sí eran baratos (0,85 ms de los 16,7 ms disponibles por
fotograma): el cuello de botella estaba en el hilo principal, no en la GPU.
