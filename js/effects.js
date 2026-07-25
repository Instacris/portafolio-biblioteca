/* ============================================================
   EFECTOS · Versión en JavaScript puro (sin React ni librerías)
   de los componentes: TextType, ShinyText, LogoLoop, BubbleMenu,
   TargetCursor, riel de fotos con scroll y dock de redes.
   ============================================================ */

(function () {
  "use strict";

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var isTouch = (function () {
    if (typeof window === "undefined") return false;
    var hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    var small = window.innerWidth <= 768;
    var ua = (navigator.userAgent || "").toLowerCase();
    var mobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    return (hasTouch && small) || mobileUA;
  })();

  /* ==========================================================
     Biblioteca de íconos SVG (monocromos, heredan currentColor)
     ========================================================== */
  var ICONOS = {
    js: '<svg viewBox="0 0 24 24" fill="none"><rect x="2.4" y="2.4" width="19.2" height="19.2" rx="4" stroke="currentColor" stroke-width="1.4"/><text x="12" y="16" text-anchor="middle" font-size="8.4" font-weight="700" fill="currentColor" font-family="Inter, sans-serif">JS</text></svg>',
    html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M4 2.8h16l-1.5 16.4L12 21.4 5.5 19.2 4 2.8Z"/><path d="M8.1 7.4h7.8M8.5 11.2h7l-.5 5-3 .9-3-.9-.15-1.6" stroke-width="1.2" stroke-linecap="round"/></svg>',
    css: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 2.8h16l-1.5 16.4L12 21.4 5.5 19.2 4 2.8Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><text x="12" y="14.6" text-anchor="middle" font-size="6.2" font-weight="700" fill="currentColor" font-family="Inter, sans-serif">CSS</text></svg>',
    python: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6c-2.9 0-3.5 1.3-3.5 2.6v1.8h3.6v.9H6.7c-1.5 0-2.9 1-3.3 2.8-.4 2-.4 3.3 0 5.4.4 1.7 1.4 2.8 2.9 2.8h1.4v-2.5c0-1.7 1.5-3.2 3.2-3.2h3.5c1.4 0 2.6-1.2 2.6-2.6V5.2c0-1.4-1.2-2.5-2.6-2.6H12Zm-1.9 1.6a.88.88 0 1 1 0 1.75.88.88 0 0 1 0-1.75Z"/><path d="M12 21.4c2.9 0 3.5-1.3 3.5-2.6v-1.8h-3.6v-.9h5.4c1.5 0 2.9-1 3.3-2.8.4-2 .4-3.3 0-5.4-.4-1.7-1.4-2.8-2.9-2.8h-1.4v2.5c0 1.7-1.5 3.2-3.2 3.2H9.6c-1.4 0-2.6 1.2-2.6 2.6v3.4c0 1.4 1.2 2.5 2.6 2.6H12Zm1.9-1.6a.88.88 0 1 1 0-1.75.88.88 0 0 1 0 1.75Z"/></svg>',
    java: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M5.2 10.6h10.6v4.6a3.4 3.4 0 0 1-3.4 3.4H8.6a3.4 3.4 0 0 1-3.4-3.4v-4.6Z" stroke-linejoin="round"/><path d="M15.8 11.6h1.5a2.1 2.1 0 0 1 0 4.2h-1.5"/><path d="M9.3 3.2c-1.1 1.2.5 1.9 0 3.1M12.7 4.5c-.85.9.35 1.4 0 2.3"/><path d="M4.4 21h12.4"/></svg>',
    sql: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><ellipse cx="12" cy="5.4" rx="6.8" ry="2.7"/><path d="M5.2 5.4v13c0 1.5 3 2.7 6.8 2.7s6.8-1.2 6.8-2.7v-13"/><path d="M5.2 11.9c0 1.5 3 2.7 6.8 2.7s6.8-1.2 6.8-2.7"/></svg>',
    react: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><circle cx="12" cy="12" r="1.9" fill="currentColor" stroke="none"/><ellipse cx="12" cy="12" rx="10.2" ry="3.9"/><ellipse cx="12" cy="12" rx="10.2" ry="3.9" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10.2" ry="3.9" transform="rotate(120 12 12)"/></svg>',
    node: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M12 2.3 20.8 7v10L12 21.7 3.2 17V7L12 2.3Z"/><path d="M9.5 14.5c0 1.1 1 1.7 2.5 1.7s2.5-.6 2.5-1.6c0-1.2-.9-1.5-2.5-1.7-1.6-.2-2.4-.5-2.4-1.5s.9-1.6 2.3-1.6c1.4 0 2.3.6 2.3 1.6" stroke-width="1.15" stroke-linecap="round"/></svg>',
    git: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="7" cy="5.2" r="2.1"/><circle cx="7" cy="18.8" r="2.1"/><circle cx="17" cy="10" r="2.1"/><path d="M7 7.3v9.4"/><path d="M17 12.1c0 3.2-2.5 4.4-5.4 4.9"/></svg>',
    vercel: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.4 22 20.2H2L12 3.4Z"/></svg>',
    excel: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="2.2"/><path d="M3 9.4h18M9.2 9.4V20"/><path d="m12.9 12.7 4.3 4.3M17.2 12.7l-4.3 4.3" stroke-width="1.2" stroke-linecap="round"/></svg>',

    libro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"><path d="M3.4 4.4h5.2c1.9 0 3.4 1.5 3.4 3.4v12c0-1.6-1.3-2.9-2.9-2.9H3.4V4.4Z"/><path d="M20.6 4.4h-5.2c-1.9 0-3.4 1.5-3.4 3.4v12c0-1.6 1.3-2.9 2.9-2.9h5.7V4.4Z"/></svg>',
    mando: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7.4 7.5h9.2a4.4 4.4 0 0 1 4.3 3.5l.9 4.4a2.5 2.5 0 0 1-4.4 2.1l-1.6-2H8.2l-1.6 2a2.5 2.5 0 0 1-4.4-2.1l.9-4.4a4.4 4.4 0 0 1 4.3-3.5Z"/><path d="M7.2 11.4v2.6M5.9 12.7h2.6"/><circle cx="16" cy="12" r=".9" fill="currentColor" stroke="none"/><circle cx="18.2" cy="14.1" r=".9" fill="currentColor" stroke="none"/></svg>',
    familia: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="8.4" cy="6.6" r="2.8"/><circle cx="17" cy="8.8" r="2.1"/><path d="M2.8 20.2v-1.9a5.6 5.6 0 0 1 5.6-5.6 5.6 5.6 0 0 1 5.6 5.6v1.9"/><path d="M16.2 14.1a4.2 4.2 0 0 1 5 4.1v2"/></svg>',

    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.67c2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.25 8.24a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24Zm-3.9 4.35c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3 0 1.35.98 2.66 1.12 2.84.14.18 1.93 2.95 4.68 4.02 2.29.9 2.76.72 3.26.68.5-.05 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.53-.32-.28-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.6.07-.28-.14-1.15-.42-2.2-1.35-.81-.72-1.36-1.62-1.52-1.9-.16-.27-.02-.42.12-.56.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.51-.86-2.06-.22-.53-.45-.46-.61-.47l-.53-.01Z"/></svg>',
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.95.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.24 2.76.12 3.05.73.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.66.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.2.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45Z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg>'
  };

  window.ICONOS = ICONOS;

  /* ==========================================================
     1 · TextType — máquina de escribir (solo la portada)
     ========================================================== */
  function textType(el, opts) {
    if (!el) return;

    var o = opts || {};
    var textos = Array.isArray(o.text) ? o.text : [o.text];
    var typingSpeed = o.typingSpeed || 75;
    var deletingSpeed = o.deletingSpeed || 30;
    var pauseDuration = o.pauseDuration != null ? o.pauseDuration : 1800;
    var initialDelay = o.initialDelay || 0;
    var variableSpeed = o.variableSpeed;

    var content = document.createElement("span");
    content.className = "text-type__content";
    el.appendChild(content);

    if (o.showCursor !== false) {
      var cursor = document.createElement("span");
      cursor.className = "text-type__cursor";
      cursor.setAttribute("aria-hidden", "true");
      cursor.textContent = o.cursorCharacter || "|";
      el.appendChild(cursor);
    }

    /* Sin animación: deja la primera frase escrita */
    if (reduceMotion) {
      content.textContent = textos[0];
      return;
    }

    var iTexto = 0;
    var iChar = 0;
    var borrando = false;

    function speed() {
      if (!variableSpeed) return typingSpeed;
      return Math.random() * (variableSpeed.max - variableSpeed.min) + variableSpeed.min;
    }

    function paso() {
      var actual = textos[iTexto];

      if (!borrando) {
        if (iChar < actual.length) {
          iChar += 1;
          content.textContent = actual.slice(0, iChar);
          setTimeout(paso, speed());
        } else {
          borrando = true;
          setTimeout(paso, pauseDuration);
        }
      } else {
        if (iChar > 0) {
          iChar -= 1;
          content.textContent = actual.slice(0, iChar);
          setTimeout(paso, deletingSpeed);
        } else {
          borrando = false;
          iTexto = (iTexto + 1) % textos.length;
          setTimeout(paso, 320);
        }
      }
    }

    setTimeout(paso, initialDelay);
  }

  /* ==========================================================
     2 · ShinyText — envuelve el texto para el brillo
     ========================================================== */
  function shiny(texto) {
    var span = document.createElement("span");
    span.className = "shiny-text";
    span.textContent = texto;
    return span;
  }

  function aplicarShiny(el) {
    if (!el || el.querySelector(".shiny-text")) return;
    var texto = el.textContent.trim();
    el.textContent = "";
    el.appendChild(shiny(texto));
  }

  window.aplicarShiny = aplicarShiny;

  /* ==========================================================
     3 · LogoLoop — cinta infinita de tecnologías
     ========================================================== */
  function logoLoop(root, logos, opts) {
    if (!root || !logos || !logos.length) return;

    var o = opts || {};
    var speed = o.speed != null ? o.speed : 46;   /* píxeles por segundo */
    var hoverSpeed = o.hoverSpeed != null ? o.hoverSpeed : 0;

    var track = document.createElement("div");
    track.className = "logoloop__track";
    root.appendChild(track);

    function crearLista(oculta) {
      var ul = document.createElement("ul");
      ul.className = "logoloop__list";
      ul.setAttribute("role", "list");
      if (oculta) ul.setAttribute("aria-hidden", "true");

      logos.forEach(function (l) {
        var li = document.createElement("li");
        li.className = "logoloop__item";
        li.innerHTML = (ICONOS[l.icon] || "") +
          '<span class="logoloop__name"></span>';
        li.querySelector(".logoloop__name").textContent = l.name;
        ul.appendChild(li);
      });

      return ul;
    }

    var primera = crearLista(false);
    track.appendChild(primera);

    var seqWidth = 0;
    var copias = 1;

    function medir() {
      seqWidth = Math.ceil(primera.getBoundingClientRect().width);
      if (!seqWidth) return;

      var necesarias = Math.ceil(root.clientWidth / seqWidth) + 2;
      while (copias < necesarias) {
        track.appendChild(crearLista(true));
        copias += 1;
      }
    }

    medir();
    window.addEventListener("resize", medir);

    if (reduceMotion) return;

    var offset = 0;
    var velocidad = 0;
    var ultimo = null;
    var hover = false;

    track.addEventListener("mouseenter", function () { hover = true; });
    track.addEventListener("mouseleave", function () { hover = false; });

    function animar(t) {
      if (ultimo === null) ultimo = t;
      var dt = Math.max(0, t - ultimo) / 1000;
      ultimo = t;

      var objetivo = hover ? hoverSpeed : speed;
      /* suavizado exponencial, igual que el componente original */
      velocidad += (objetivo - velocidad) * (1 - Math.exp(-dt / 0.25));

      if (seqWidth > 0) {
        offset = (offset + velocidad * dt) % seqWidth;
        if (offset < 0) offset += seqWidth;
        track.style.transform = "translate3d(" + (-offset) + "px, 0, 0)";
      }

      requestAnimationFrame(animar);
    }

    requestAnimationFrame(animar);
  }

  /* ==========================================================
     4 · BubbleMenu — navegación en burbujas (PC y teléfono)
     ========================================================== */
  function bubbleMenu() {
    var boton = $("#menu-btn");
    var capa = $("#bubble-items");
    if (!boton || !capa) return;

    var abierto = false;

    function abrir() {
      abierto = true;
      capa.classList.add("is-visible");
      capa.setAttribute("aria-hidden", "false");
      boton.classList.add("open");
      boton.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      /* Un instante después para que la transición arranque desde escala 0.
         setTimeout (y no rAF) para que funcione aunque la pestaña
         esté en segundo plano al abrirse. */
      setTimeout(function () { capa.classList.add("is-open"); }, 20);
    }

    function cerrar() {
      abierto = false;
      capa.classList.remove("is-open");
      capa.setAttribute("aria-hidden", "true");
      boton.classList.remove("open");
      boton.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (!abierto) capa.classList.remove("is-visible");
      }, 320);
    }

    boton.addEventListener("click", function () {
      if (abierto) cerrar(); else abrir();
    });

    capa.addEventListener("click", function (e) {
      if (e.target.closest(".pill-link") || e.target === capa) cerrar();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && abierto) cerrar();
    });
  }

  /* ==========================================================
     5 · TargetCursor — mira que se ancla (solo en Proyectos)
     ========================================================== */
  function targetCursor(opts) {
    if (isTouch || reduceMotion) return;

    var o = opts || {};
    var zona = $(o.zona || "#proyectos");
    if (!zona) return;

    var selector = o.targetSelector || ".cursor-target";
    var borderWidth = 2.5;
    var cornerSize = 12;

    var wrap = document.createElement("div");
    wrap.className = "target-cursor";
    wrap.style.setProperty("--spin-duration", (o.spinDuration || 2) + "s");
    wrap.innerHTML =
      '<div class="target-cursor__spin">' +
        '<div class="target-cursor__dot"></div>' +
        '<div class="target-cursor__corner corner-tl"></div>' +
        '<div class="target-cursor__corner corner-tr"></div>' +
        '<div class="target-cursor__corner corner-br"></div>' +
        '<div class="target-cursor__corner corner-bl"></div>' +
      '</div>';
    document.body.appendChild(wrap);

    var corners = $$(".target-cursor__corner", wrap);
    var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    var pos = { x: mouse.x, y: mouse.y };
    var activo = false;
    var target = null;
    var rect = null;

    function activar(on) {
      if (on === activo) return;
      activo = on;
      wrap.classList.toggle("is-active", on);
      document.body.classList.toggle("cursor-hidden", on);
      if (!on) soltar();
    }

    function agarrar(el) {
      if (target === el) return;
      target = el;
      rect = el.getBoundingClientRect();
      wrap.classList.add("is-targeting");
      el.addEventListener("mouseleave", soltar, { once: true });
    }

    function soltar() {
      if (!target) return;
      target = null;
      rect = null;
      wrap.classList.remove("is-targeting");
      corners.forEach(function (c) { c.style.transform = ""; });
    }

    document.addEventListener("mousemove", function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      var dentro = !!(e.target.closest && e.target.closest("#proyectos"));
      activar(dentro);

      if (!dentro) return;

      var t = e.target.closest(selector);
      if (t) agarrar(t); else soltar();
    }, { passive: true });

    document.addEventListener("mousedown", function () { wrap.classList.add("is-down"); });
    document.addEventListener("mouseup", function () { wrap.classList.remove("is-down"); });

    /* Si se hace scroll con la mira puesta, revalida el objetivo */
    window.addEventListener("scroll", function () {
      if (target) rect = target.getBoundingClientRect();
    }, { passive: true });

    function frame() {
      pos.x += (mouse.x - pos.x) * 0.22;
      pos.y += (mouse.y - pos.y) * 0.22;
      wrap.style.transform = "translate(" + pos.x + "px, " + pos.y + "px)";

      if (target && rect) {
        var p = [
          { x: rect.left - borderWidth, y: rect.top - borderWidth },
          { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
          { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
          { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
        ];
        corners.forEach(function (c, i) {
          c.style.transform = "translate(" + (p[i].x - pos.x) + "px, " + (p[i].y - pos.y) + "px)";
        });
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /* ==========================================================
     6 · Riel de fotos — viajan por la página con el scroll
     ========================================================== */
  function photoRail() {
    var riel = $("#photo-rail");
    if (!riel || !window.FOTOS) return;

    var caption = document.createElement("p");
    caption.className = "rail-caption";

    /* En local avisamos qué archivo falta; en el sitio publicado
       la foto simplemente no se muestra (nunca se ve "roto"). */
    var esLocal = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    var faltantes = 0;

    window.FOTOS.forEach(function (f) {
      var fig = document.createElement("figure");
      fig.className = "rail-photo";
      fig.setAttribute("data-key", f.key);

      var img = document.createElement("img");
      img.src = f.file;
      img.alt = f.alt;
      img.loading = "lazy";

      img.onerror = function () {
        faltantes += 1;

        if (esLocal) {
          var aviso = document.createElement("div");
          aviso.className = "rail-photo__todo";
          aviso.innerHTML = "Falta la foto<br><b></b>";
          aviso.querySelector("b").textContent = f.file;
          fig.replaceChild(aviso, img);
          return;
        }

        fig.classList.add("is-missing");
        /* Si no hay ninguna foto todavía, se recupera el ancho completo */
        if (faltantes === window.FOTOS.length) {
          document.body.classList.add("sin-fotos");
        }
      };

      fig.appendChild(img);
      riel.appendChild(fig);
    });

    riel.appendChild(caption);

    var mapa = window.RIEL_SECCIONES || {};
    var secciones = $$("main section[id]");
    var estadoActual = "";

    function textoCaption(estado) {
      var f = window.FOTOS.filter(function (x) {
        return (estado === "pasatiempos" && x.key === "hermano") ||
               (estado === "experiencia" && x.key === "traje") ||
               (estado === "proyectos" && x.key === "escritorio");
      })[0];
      return f ? f.caption : "";
    }

    function actualizar() {
      var centro = window.innerHeight / 2;
      var mejor = null;
      var mejorDist = Infinity;

      secciones.forEach(function (s) {
        var r = s.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var d = Math.abs((r.top + r.bottom) / 2 - centro);
        if (d < mejorDist) { mejorDist = d; mejor = s; }
      });

      var estado = mejor ? (mapa[mejor.id] || "mazo") : "portada";
      if (estado === estadoActual) return;

      estadoActual = estado;
      riel.setAttribute("data-state", estado);
      /* El body comparte el estado: así el CSS sabe cuándo mostrar
         la credencial colgante y cuándo el riel de fotos. */
      document.body.setAttribute("data-seccion", estado);
      caption.textContent = textoCaption(estado);
      caption.style.opacity = textoCaption(estado) ? "1" : "0";
    }

    var pendiente = false;
    window.addEventListener("scroll", function () {
      if (pendiente) return;
      pendiente = true;

      var hecho = false;
      function correr() {
        if (hecho) return;
        hecho = true;
        actualizar();
        pendiente = false;
      }

      requestAnimationFrame(correr);
      /* Respaldo por si rAF no corre (pestaña en segundo plano):
         así el riel nunca se queda bloqueado. */
      setTimeout(correr, 130);
    }, { passive: true });

    window.addEventListener("resize", actualizar);
    actualizar();
  }

  /* ==========================================================
     7 · Dock de redes sociales
     ========================================================== */
  function dock() {
    var root = $("#dock");
    if (!root || !window.CONTACTO) return;

    var C = window.CONTACTO;
    var redes = [
      { icon: "whatsapp", label: "WhatsApp", href: "https://wa.me/" + C.whatsapp, externo: true },
      { icon: "github",   label: "GitHub",   href: C.github,   externo: true },
      { icon: "linkedin", label: "LinkedIn", href: C.linkedin, externo: true },
      { icon: "email",    label: "Email",    href: "mailto:" + C.email, externo: false }
    ];

    redes.forEach(function (r) {
      var a = document.createElement("a");
      a.className = "dock-item";
      a.href = r.href;
      a.setAttribute("aria-label", r.label);
      if (r.externo) { a.target = "_blank"; a.rel = "noopener"; }
      a.innerHTML = ICONOS[r.icon] + '<span class="dock-label"></span>';
      a.querySelector(".dock-label").textContent = r.label;
      root.appendChild(a);
    });
  }

  /* ==========================================================
     8 · Pasatiempos
     ========================================================== */
  function pasatiempos() {
    var root = $("#hobby-grid");
    if (!root || !window.PASATIEMPOS) return;

    window.PASATIEMPOS.forEach(function (h) {
      var art = document.createElement("article");
      art.className = "hobby reveal";
      art.innerHTML =
        '<div class="hobby-icon">' + (ICONOS[h.icon] || "") + "</div>" +
        "<h3></h3><p></p>";
      art.querySelector("h3").textContent = h.title;
      art.querySelector("p").textContent = h.desc;
      root.appendChild(art);
    });
  }

  /* ==========================================================
     9 · Monograma K — reemplaza a los antiguos separadores
     ========================================================== */
  var K_SVG =
    '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true">' +
      '<path d="M20 2.6 37.4 20 20 37.4 2.6 20 20 2.6Z" stroke="currentColor" stroke-width=".9" opacity=".42"/>' +
      '<path d="M15 12v16M15 20.2 23 12M15 20.2 23.6 28" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>' +
    "</svg>";

  function monogramas() {
    /* Separadores entre capítulos */
    $$(".fleuron").forEach(function (f) {
      f.innerHTML = '<span class="k-mark">' + K_SVG + "</span>";
    });
    /* Burbuja del logo y cualquier otro punto marcado */
    $$("[data-k]").forEach(function (el) { el.innerHTML = K_SVG; });
  }

  /* ==========================================================
     10 · SplitText — el nombre entra letra por letra
     ========================================================== */
  function splitText(el, opts) {
    if (!el) return;

    var o = opts || {};
    var delay = o.delay != null ? o.delay : 45;
    var texto = el.textContent.trim();

    el.textContent = "";
    el.classList.add("split-parent");
    /* El texto completo queda accesible para lectores de pantalla */
    el.setAttribute("aria-label", texto);

    var n = 0;
    texto.split(" ").forEach(function (palabra, wi, todas) {
      var w = document.createElement("span");
      w.className = "split-word";
      w.setAttribute("aria-hidden", "true");

      palabra.split("").forEach(function (ch) {
        var c = document.createElement("span");
        c.className = "split-char";
        c.textContent = ch;
        c.style.transitionDelay = (n * delay) + "ms";
        n += 1;
        w.appendChild(c);
      });

      el.appendChild(w);
      if (wi < todas.length - 1) {
        el.appendChild(document.createTextNode(" "));
        n += 1;
      }
    });

    if (reduceMotion) { el.classList.add("is-in"); return; }
    setTimeout(function () { el.classList.add("is-in"); }, o.initialDelay || 180);
  }

  /* ==========================================================
     11 · Lanyard — credencial que cuelga y se balancea
     Cuerda con física verlet; reacciona al scroll y se arrastra.
     ========================================================== */
  function lanyard() {
    var root = $("#lanyard");
    if (!root) return;

    var N = 8;                 /* puntos de la cuerda */
    var CARD_W = 148;
    var CARD_H = 206;

    /* El SVG tiene que usar EXACTAMENTE los píxeles del contenedor:
       si el viewBox no coincide, la banda se estira y la cuerda deja
       de caer sobre la tarjeta. */
    var ANCHO = root.clientWidth || 240;
    var ALTO = root.clientHeight || 470;
    var SEG = 17;              /* largo de cada tramo (se recalcula) */

    root.innerHTML =
      '<svg class="lanyard-band" viewBox="0 0 ' + ANCHO + " " + ALTO + '" preserveAspectRatio="none" aria-hidden="true">' +
        '<path class="lanyard-band-path" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      "</svg>" +
      '<div class="lanyard-card" id="lanyard-card">' +
        '<span class="lanyard-hole"></span>' +
        '<div class="lanyard-photo">' +
          '<img src="img/fotoperfil.jpg" alt="Cristóbal Chacón" draggable="false" />' +
        "</div>" +
        '<p class="lanyard-name">Cristóbal Chacón</p>' +
        '<p class="lanyard-role">Desarrollador web</p>' +
        '<span class="lanyard-k" data-k></span>' +
      "</div>";

    var path = $(".lanyard-band-path", root);
    var card = $("#lanyard-card", root);
    $$("[data-k]", root).forEach(function (el) { el.innerHTML = K_SVG; });

    var anchorX = ANCHO / 2;
    var anchorY = 6;

    /* Recalcula el sistema de coordenadas cuando cambia el tamaño.
       La cuerda se reparte el alto libre que queda sobre la tarjeta. */
    var medido = false;

    function medir() {
      var w = root.clientWidth || ANCHO;
      var h = root.clientHeight || ALTO;
      if (medido && w === ANCHO && h === ALTO) return;
      medido = true;

      ANCHO = w;
      ALTO = h;
      anchorX = ANCHO / 2;
      SEG = Math.max(12, (ALTO - CARD_H - anchorY - 18) / (N - 1));
      $(".lanyard-band", root).setAttribute("viewBox", "0 0 " + ANCHO + " " + ALTO);
    }

    medir();

    var pts = [];
    for (var i = 0; i < N; i++) {
      pts.push({ x: anchorX, y: anchorY + i * SEG, ox: anchorX, oy: anchorY + i * SEG });
    }

    window.addEventListener("resize", function () {
      var antes = anchorX;
      medir();
      /* Traslada la cuerda al nuevo centro para que no dé un salto */
      var dx = anchorX - antes;
      for (var i = 0; i < N; i++) { pts[i].x += dx; pts[i].ox += dx; }
    });

    var arrastrando = false;
    var dragX = 0, dragY = 0;
    var impulso = 0;

    function fisica() {
      var gravedad = 0.85;
      var roce = 0.985;

      for (var i = 1; i < N; i++) {
        var p = pts[i];
        var vx = (p.x - p.ox) * roce;
        var vy = (p.y - p.oy) * roce;
        p.ox = p.x;
        p.oy = p.y;
        p.x += vx;
        p.y += vy + gravedad;
      }

      /* Resolución de restricciones: mantiene los tramos a su largo */
      for (var k = 0; k < 14; k++) {
        pts[0].x = anchorX;
        pts[0].y = anchorY;

        for (var j = 0; j < N - 1; j++) {
          var a = pts[j], b = pts[j + 1];
          var dx = b.x - a.x, dy = b.y - a.y;
          var d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          var ajuste = ((d - SEG) / d) * 0.5;
          var ox = dx * ajuste, oy = dy * ajuste;
          if (j > 0) { a.x += ox; a.y += oy; }
          b.x -= ox; b.y -= oy;
        }

        if (arrastrando) {
          pts[N - 1].x = dragX;
          pts[N - 1].y = dragY;
        }

        /* La tarjeta cuelga del último punto: se limita el balanceo
           para que no se salga por los lados del contenedor. */
        var margen = CARD_W / 2 + 6;
        for (var m = 1; m < N; m++) {
          var lim = (m === N - 1) ? margen : 20;
          if (pts[m].x < lim) pts[m].x = lim;
          if (pts[m].x > ANCHO - lim) pts[m].x = ANCHO - lim;
        }
      }
    }

    function pintar() {
      var d = "M" + pts[0].x.toFixed(1) + " " + pts[0].y.toFixed(1);
      for (var i = 1; i < N; i++) {
        d += " L" + pts[i].x.toFixed(1) + " " + pts[i].y.toFixed(1);
      }
      path.setAttribute("d", d);

      var fin = pts[N - 1];
      var prev = pts[N - 2];
      var ang = Math.atan2(fin.x - prev.x, fin.y - prev.y) * (180 / Math.PI);

      card.style.transform =
        "translate(" + (fin.x - CARD_W / 2).toFixed(1) + "px," + fin.y.toFixed(1) + "px)" +
        " rotate(" + (-ang).toFixed(2) + "deg)";
    }

    /* --- Arrastre con el ratón / el dedo --- */
    function puntoLocal(e) {
      var r = root.getBoundingClientRect();
      var escalaX = ANCHO / r.width;
      var escalaY = ALTO / r.height;
      return {
        x: (e.clientX - r.left) * escalaX,
        y: (e.clientY - r.top) * escalaY
      };
    }

    card.addEventListener("pointerdown", function (e) {
      arrastrando = true;
      var p = puntoLocal(e);
      dragX = p.x; dragY = p.y;
      card.setPointerCapture(e.pointerId);
      root.classList.add("is-dragging");
    });

    card.addEventListener("pointermove", function (e) {
      if (!arrastrando) return;
      var p = puntoLocal(e);
      dragX = p.x; dragY = p.y;
    });

    function soltar(e) {
      if (!arrastrando) return;
      arrastrando = false;
      root.classList.remove("is-dragging");
      try { card.releasePointerCapture(e.pointerId); } catch (err) {}
    }

    card.addEventListener("pointerup", soltar);
    card.addEventListener("pointercancel", soltar);

    /* --- La credencial se mece al desplazar la página --- */
    var ultimoScroll = window.scrollY;
    window.addEventListener("scroll", function () {
      var delta = window.scrollY - ultimoScroll;
      ultimoScroll = window.scrollY;
      impulso += delta;
    }, { passive: true });

    if (reduceMotion) {
      for (var s = 0; s < 240; s++) fisica();
      pintar();
      return;
    }

    var raf = null;

    function bucle() {
      if (Math.abs(impulso) > 0.01) {
        /* La inercia empuja la cuerda en sentido contrario al scroll */
        var golpe = Math.max(-14, Math.min(14, impulso * 0.35));
        for (var i = 1; i < N; i++) {
          pts[i].oy += golpe * (i / N);
          pts[i].ox += golpe * 0.16 * (i / N);
        }
        impulso = 0;
      }

      fisica();
      pintar();
      raf = requestAnimationFrame(bucle);
    }

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            if (raf === null) raf = requestAnimationFrame(bucle);
          } else if (raf !== null) {
            cancelAnimationFrame(raf); raf = null;
          }
        });
      }, { threshold: 0.01 }).observe(root);
    } else {
      raf = requestAnimationFrame(bucle);
    }

    /* Primer dibujo aunque el bucle aún no arranque */
    for (var s2 = 0; s2 < 60; s2++) fisica();
    pintar();
  }

  /* ==========================================================
     12 · Ficha emergente de cada obra
     ========================================================== */
  function obraModal() {
    var modal = $("#obra-modal");
    if (!modal || !window.PROYECTOS) return;

    var img = $("#obra-img", modal);
    var num = $("#obra-num", modal);
    var titulo = $("#obra-titulo", modal);
    var desc = $("#obra-desc", modal);
    var tags = $("#obra-tags", modal);
    var link = $("#obra-link", modal);
    var cerrarBtn = $(".modal-close", modal);
    var ultimoFoco = null;

    function abrir(i) {
      var p = window.PROYECTOS[i];
      if (!p) return;

      ultimoFoco = document.activeElement;

      var tarjeta = $('[data-obra="' + i + '"]');
      var numeral = tarjeta ? $(".work-numeral", tarjeta) : null;

      num.textContent = numeral ? numeral.textContent : "";
      titulo.textContent = p.name;
      desc.textContent = p.desc;
      tags.textContent = p.tags.join(" · ");
      link.href = p.link;

      if (p.img) {
        img.src = p.img;
        img.alt = "Vista previa de " + p.name;
        img.parentElement.style.display = "";
      } else {
        img.removeAttribute("src");
        img.parentElement.style.display = "none";
      }

      modal.classList.add("is-visible");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(function () {
        modal.classList.add("is-open");
        cerrarBtn.focus();
      }, 20);
    }

    function cerrar() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      setTimeout(function () { modal.classList.remove("is-visible"); }, 300);
      if (ultimoFoco && ultimoFoco.focus) ultimoFoco.focus();
    }

    document.addEventListener("click", function (e) {
      var tarjeta = e.target.closest ? e.target.closest("[data-obra]") : null;
      if (tarjeta) { abrir(Number(tarjeta.getAttribute("data-obra"))); return; }
      if (e.target.closest && e.target.closest("[data-cerrar]")) cerrar();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) cerrar();
    });
  }

  /* ==========================================================
     13 · MagicBento — foco que sigue al cursor, brillo de borde,
     partículas, inclinación, magnetismo y onda al hacer clic.
     Se aplica a las obras del catálogo (no crea tarjetas nuevas).
     ========================================================== */
  function magicBento(opts) {
    var o = opts || {};
    var seccion = $(o.seccion || "#proyectos");
    if (!seccion) return;

    var tarjetas = $$(".work", seccion);
    if (!tarjetas.length) return;

    var glow = o.glowColor || "176, 140, 62";
    var radio = o.spotlightRadius != null ? o.spotlightRadius : 320;
    var nParticulas = o.particleCount != null ? o.particleCount : 10;

    /* En táctil y con "reducir movimiento" solo queda el diseño base */
    var apagado = isTouch || reduceMotion;

    seccion.style.setProperty("--bento-glow", glow);
    tarjetas.forEach(function (t) {
      t.classList.add("bento-card");
      t.style.setProperty("--glow-radius", radio + "px");
    });

    if (apagado) return;

    /* --- Foco global --- */
    var foco = document.createElement("div");
    foco.className = "bento-spotlight";
    foco.style.background =
      "radial-gradient(circle, rgba(" + glow + ", .16) 0%, rgba(" + glow + ", .08) 18%," +
      " rgba(" + glow + ", .04) 32%, rgba(" + glow + ", .015) 55%, transparent 70%)";
    document.body.appendChild(foco);

    var proximidad = radio * 0.5;
    var desvanecido = radio * 0.75;

    document.addEventListener("mousemove", function (e) {
      var r = seccion.getBoundingClientRect();
      var dentro = e.clientX >= r.left && e.clientX <= r.right &&
                   e.clientY >= r.top && e.clientY <= r.bottom;

      if (!dentro) {
        foco.style.opacity = "0";
        tarjetas.forEach(function (t) { t.style.setProperty("--glow-intensity", "0"); });
        return;
      }

      var minDist = Infinity;

      tarjetas.forEach(function (t) {
        var cr = t.getBoundingClientRect();
        var cx = cr.left + cr.width / 2;
        var cy = cr.top + cr.height / 2;
        var d = Math.max(0, Math.hypot(e.clientX - cx, e.clientY - cy) - Math.max(cr.width, cr.height) / 2);
        minDist = Math.min(minDist, d);

        var intensidad = 0;
        if (d <= proximidad) intensidad = 1;
        else if (d <= desvanecido) intensidad = (desvanecido - d) / (desvanecido - proximidad);

        t.style.setProperty("--glow-x", (((e.clientX - cr.left) / cr.width) * 100) + "%");
        t.style.setProperty("--glow-y", (((e.clientY - cr.top) / cr.height) * 100) + "%");
        t.style.setProperty("--glow-intensity", String(intensidad));
      });

      foco.style.left = e.clientX + "px";
      foco.style.top = e.clientY + "px";
      foco.style.opacity = String(
        minDist <= proximidad ? 0.8
          : minDist <= desvanecido ? ((desvanecido - minDist) / (desvanecido - proximidad)) * 0.8
          : 0
      );
    }, { passive: true });

    /* --- Partículas, inclinación, magnetismo y onda por tarjeta --- */
    tarjetas.forEach(function (t) {
      var particulas = [];
      var temporizadores = [];
      var dentro = false;

      function limpiarParticulas() {
        temporizadores.forEach(clearTimeout);
        temporizadores = [];
        particulas.forEach(function (p) {
          p.classList.remove("is-in");
          setTimeout(function () { if (p.parentNode) p.parentNode.removeChild(p); }, 320);
        });
        particulas = [];
      }

      t.addEventListener("mouseenter", function () {
        dentro = true;
        var r = t.getBoundingClientRect();

        for (var i = 0; i < nParticulas; i++) {
          (function (i) {
            var id = setTimeout(function () {
              if (!dentro) return;
              var p = document.createElement("span");
              p.className = "bento-particle";
              p.style.left = (Math.random() * r.width) + "px";
              p.style.top = (Math.random() * r.height) + "px";
              p.style.setProperty("--dx", ((Math.random() - 0.5) * 74) + "px");
              p.style.setProperty("--dy", ((Math.random() - 0.5) * 74) + "px");
              p.style.setProperty("--dur", (2.4 + Math.random() * 2) + "s");
              t.appendChild(p);
              particulas.push(p);
              requestAnimationFrame(function () { p.classList.add("is-in"); });
              setTimeout(function () { p.classList.add("is-in"); }, 30);
            }, i * 90);
            temporizadores.push(id);
          })(i);
        }
      });

      t.addEventListener("mouseleave", function () {
        dentro = false;
        limpiarParticulas();
        t.style.transform = "";
      });

      t.addEventListener("mousemove", function (e) {
        var r = t.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        var cx = r.width / 2;
        var cy = r.height / 2;

        var rotX = ((y - cy) / cy) * -7;
        var rotY = ((x - cx) / cx) * 7;
        var magX = (x - cx) * 0.035;
        var magY = (y - cy) * 0.035;

        t.style.transform =
          "perspective(900px) rotateX(" + rotX.toFixed(2) + "deg) rotateY(" + rotY.toFixed(2) + "deg)" +
          " translate3d(" + magX.toFixed(1) + "px," + (magY - 4).toFixed(1) + "px,0)";
      });

      t.addEventListener("click", function (e) {
        var r = t.getBoundingClientRect();
        var x = e.clientX - r.left;
        var y = e.clientY - r.top;
        var max = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - r.width, y),
          Math.hypot(x, y - r.height),
          Math.hypot(x - r.width, y - r.height)
        );

        var onda = document.createElement("span");
        onda.className = "bento-ripple";
        onda.style.width = onda.style.height = (max * 2) + "px";
        onda.style.left = (x - max) + "px";
        onda.style.top = (y - max) + "px";
        onda.style.background =
          "radial-gradient(circle, rgba(" + glow + ", .4) 0%, rgba(" + glow + ", .2) 30%, transparent 70%)";
        t.appendChild(onda);
        setTimeout(function () { if (onda.parentNode) onda.parentNode.removeChild(onda); }, 820);
      });
    });
  }

  /* ==========================================================
     Arranque
     ========================================================== */
  function init() {
    monogramas();

    splitText($("#hero-name"), { delay: 42, initialDelay: 200 });
    textType($("#typed"), {
      text: window.FRASES,
      typingSpeed: 78,
      deletingSpeed: 34,
      pauseDuration: 1900,
      initialDelay: 600,
      variableSpeed: { min: 55, max: 105 },
      cursorCharacter: "|"
    });

    logoLoop($("#logo-loop"), window.STACK, { speed: 46, hoverSpeed: 0 });

    pasatiempos();
    photoRail();
    lanyard();
    obraModal();
    dock();
    bubbleMenu();
    targetCursor({ zona: "#proyectos", targetSelector: ".cursor-target", spinDuration: 2 });
    magicBento({ seccion: "#proyectos", glowColor: "176, 140, 62", spotlightRadius: 320, particleCount: 10 });

    /* Brillo en los botones de la portada y de los apéndices */
    $$("[data-shiny]").forEach(aplicarShiny);

    /* Las transiciones se activan cuando la página ya está montada,
       para evitar destellos en el primer pintado. */
    setTimeout(function () {
      document.body.classList.add("efectos-listos");
    }, 120);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
