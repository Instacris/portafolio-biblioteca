/* ============================================================
   MAIN · Render de contenido, tema, reveals y navegación.
   ============================================================ */

(function () {
  "use strict";

  /* Con JS presente se habilitan los estados ocultos de .reveal (sin JS, todo visible) */
  document.documentElement.classList.add("js");

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function esc(str) {
    var d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  /* ---------- Tema (pergamino / medianoche) ---------- */
  var root = document.documentElement;
  var THEME_KEY = "portafolio-tema";

  function applyTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#11141c" : "#f5f0e6");
  }

  var saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  $("#theme-toggle").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });

  /* ---------- Menú móvil ---------- */
  var menuBtn = $("#menu-btn");
  var nav = $("#nav");

  menuBtn.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Números romanos para el catálogo ---------- */
  function roman(n) {
    var map = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
    var out = "";
    map.forEach(function (pair) {
      while (n >= pair[0]) { out += pair[1]; n -= pair[0]; }
    });
    return out;
  }

  /* ---------- Render: lenguajes ---------- */
  var langList = $("#lang-list");
  window.LENGUAJES.forEach(function (l) {
    var div = document.createElement("div");
    div.className = "lang";
    div.innerHTML =
      '<div class="lang-head">' +
        '<span class="lang-name">' + esc(l.name) + "</span>" +
        '<span class="lang-level">' + l.level + "%</span>" +
      "</div>" +
      '<div class="meter"><i style="--w:' + l.level + '%"></i></div>';
    langList.appendChild(div);
  });

  /* ---------- Render: herramientas ---------- */
  var toolsList = $("#tools-list");
  window.HERRAMIENTAS.forEach(function (t) {
    var li = document.createElement("li");
    li.innerHTML =
      '<div class="tool-head">' +
        '<span class="tool-name">' + esc(t.name) + "</span>" +
        '<span class="tool-tag">' + esc(t.tag) + "</span>" +
      "</div>" +
      '<p class="tool-desc">' + esc(t.desc) + "</p>";
    toolsList.appendChild(li);
  });

  /* ---------- Render: excel ---------- */
  var excelList = $("#excel-list");
  window.EXCEL_SKILLS.forEach(function (s) {
    var li = document.createElement("li");
    li.innerHTML = '<span class="check">✓</span><span>' + esc(s) + "</span>";
    excelList.appendChild(li);
  });

  /* ---------- Render: experiencia ---------- */
  var xpList = $("#xp-list");
  window.EXPERIENCIA.forEach(function (x) {
    var art = document.createElement("article");
    art.className = "xp reveal";
    art.innerHTML =
      '<p class="xp-date">' + esc(x.date) + "</p>" +
      '<h3 class="xp-role">' + esc(x.role) + "</h3>" +
      '<p class="xp-company">' + esc(x.company) + "</p>" +
      '<p class="xp-desc">' + esc(x.desc) + "</p>" +
      '<p class="xp-tags">' + x.tags.map(esc).join(" · ") + "</p>";
    xpList.appendChild(art);
  });

  /* ---------- Render: proyectos ---------- */
  var worksGrid = $("#works-grid");
  window.PROYECTOS.forEach(function (p, i) {
    var a = document.createElement("a");
    a.className = "work reveal";
    a.href = p.link;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML =
      '<div class="work-top">' +
        '<span class="work-numeral">Obra ' + roman(i + 1) + "</span>" +
        '<span class="work-arrow">↗</span>' +
      "</div>" +
      '<h3 class="work-title">' + esc(p.name) + "</h3>" +
      '<p class="work-desc">' + esc(p.desc) + "</p>" +
      '<p class="work-tags">' + p.tags.map(esc).join(" · ") + "</p>";
    worksGrid.appendChild(a);
  });

  /* ---------- Contacto ---------- */
  var C = window.CONTACTO;
  $("#c-mail").href = "mailto:" + C.email;
  $("#c-mail").textContent = C.email;
  $("#c-mail2").href = "mailto:" + C.email;
  $("#c-gh").href = C.github;
  $("#c-li").href = C.linkedin;
  $("#c-wa").href = "https://wa.me/" + C.whatsapp;

  /* ---------- Año ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Reveals al hacer scroll ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    $$(".reveal, .panel").forEach(function (el) { el.classList.add("in"); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    $$(".reveal, .panel").forEach(function (el) { obs.observe(el); });
  }

  /* Salvaguarda: si el observer no llega a ejecutarse (pestaña en segundo
     plano, navegadores antiguos), el contenido se muestra sin animación. */
  function ensureVisible() {
    if (document.querySelector(".reveal.in")) return;
    $$(".reveal, .panel").forEach(function (el) { el.classList.add("in"); });
  }

  setTimeout(function () {
    if (document.visibilityState === "hidden") {
      document.addEventListener("visibilitychange", function onVis() {
        document.removeEventListener("visibilitychange", onVis);
        setTimeout(ensureVisible, 1200);
      });
    } else {
      ensureVisible();
    }
  }, 1800);

  /* ---------- Barra de progreso de lectura ---------- */
  var progress = $("#progress");

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    progress.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Enlace activo en la navegación ---------- */
  var sections = $$("main section[id]");
  var navLinks = $$(".nav a");

  function linkFor(id) {
    return navLinks.filter(function (a) {
      return a.getAttribute("href") === "#" + id;
    })[0];
  }

  if ("IntersectionObserver" in window) {
    var navObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = linkFor(entry.target.id);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-40% 0px -55% 0px" });

    sections.forEach(function (s) { navObs.observe(s); });
  }
})();
