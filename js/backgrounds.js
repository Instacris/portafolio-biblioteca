/* ============================================================
   FONDOS ANIMADOS
   · EvilEye     — ojo de fuego (WebGL puro, portado desde ogl)
     Fondo de la sección Pasatiempos.
   · LetterGlitch — lluvia de letras (canvas 2D)
     Fondo de la sección Servicios / KAMEX.
   Ambos se pausan cuando su sección no está a la vista.
   ============================================================ */

(function () {
  "use strict";

  var reduceMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function hexToRgb01(hex) {
    var h = hex.replace("#", "");
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [
      parseInt(h.slice(0, 2), 16) / 255,
      parseInt(h.slice(2, 4), 16) / 255,
      parseInt(h.slice(4, 6), 16) / 255
    ];
  }

  /* Ejecuta la animación solo mientras el elemento se ve en pantalla */
  function alEstarVisible(el, onVisible, onHidden) {
    if (!("IntersectionObserver" in window)) { onVisible(); return; }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) onVisible(); else onHidden();
      });
    }, { threshold: 0.01 });
    obs.observe(el);
  }

  /* ==========================================================
     Textura de ruido (idéntica al componente original)
     ========================================================== */
  function generarRuido(size) {
    var data = new Uint8Array(size * size * 4);

    function hash(x, y, s) {
      var n = x * 374761393 + y * 668265263 + s * 1274126177;
      n = Math.imul(n ^ (n >>> 13), 1274126177);
      return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
    }

    function noise(px, py, freq, seed) {
      var fx = (px / size) * freq;
      var fy = (py / size) * freq;
      var ix = Math.floor(fx);
      var iy = Math.floor(fy);
      var tx = fx - ix;
      var ty = fy - iy;
      var w = freq | 0;
      var v00 = hash(((ix % w) + w) % w, ((iy % w) + w) % w, seed);
      var v10 = hash((((ix + 1) % w) + w) % w, ((iy % w) + w) % w, seed);
      var v01 = hash(((ix % w) + w) % w, (((iy + 1) % w) + w) % w, seed);
      var v11 = hash((((ix + 1) % w) + w) % w, (((iy + 1) % w) + w) % w, seed);
      return v00 * (1 - tx) * (1 - ty) + v10 * tx * (1 - ty) + v01 * (1 - tx) * ty + v11 * tx * ty;
    }

    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var v = 0, amp = 0.4, total = 0;
        for (var o = 0; o < 8; o++) {
          v += amp * noise(x, y, 32 * (1 << o), o * 31);
          total += amp;
          amp *= 0.65;
        }
        v /= total;
        v = (v - 0.5) * 2.2 + 0.5;
        v = Math.max(0, Math.min(1, v));
        var val = Math.round(v * 255);
        var i = (y * size + x) * 4;
        data[i] = val; data[i + 1] = val; data[i + 2] = val; data[i + 3] = 255;
      }
    }

    return data;
  }

  var VERT = [
    "attribute vec2 uv;",
    "attribute vec2 position;",
    "varying vec2 vUv;",
    "void main() {",
    "  vUv = uv;",
    "  gl_Position = vec4(position, 0.0, 1.0);",
    "}"
  ].join("\n");

  var FRAG = [
    "precision highp float;",
    "uniform float uTime;",
    "uniform vec3 uResolution;",
    "uniform sampler2D uNoiseTexture;",
    "uniform float uPupilSize;",
    "uniform float uIrisWidth;",
    "uniform float uGlowIntensity;",
    "uniform float uIntensity;",
    "uniform float uScale;",
    "uniform float uNoiseScale;",
    "uniform vec2 uMouse;",
    "uniform float uPupilFollow;",
    "uniform float uFlameSpeed;",
    "uniform vec3 uEyeColor;",
    "uniform vec3 uBgColor;",
    "void main() {",
    "  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution.xy) / uResolution.y;",
    "  uv /= uScale;",
    "  float ft = uTime * uFlameSpeed;",
    "  float polarRadius = length(uv) * 2.0;",
    "  float polarAngle = (2.0 * atan(uv.x, uv.y)) / 6.28 * 0.3;",
    "  vec2 polarUv = vec2(polarRadius, polarAngle);",
    "  vec4 noiseA = texture2D(uNoiseTexture, polarUv * vec2(0.2, 7.0) * uNoiseScale + vec2(-ft * 0.1, 0.0));",
    "  vec4 noiseB = texture2D(uNoiseTexture, polarUv * vec2(0.3, 4.0) * uNoiseScale + vec2(-ft * 0.2, 0.0));",
    "  vec4 noiseC = texture2D(uNoiseTexture, polarUv * vec2(0.1, 5.0) * uNoiseScale + vec2(-ft * 0.1, 0.0));",
    "  float distanceMask = 1.0 - length(uv);",
    "  float innerRing = clamp(-1.0 * ((distanceMask - 0.7) / uIrisWidth), 0.0, 1.0);",
    "  innerRing = (innerRing * distanceMask - 0.2) / 0.28;",
    "  innerRing += noiseA.r - 0.5;",
    "  innerRing *= 1.3;",
    "  innerRing = clamp(innerRing, 0.0, 1.0);",
    "  float outerRing = clamp(-1.0 * ((distanceMask - 0.5) / 0.2), 0.0, 1.0);",
    "  outerRing = (outerRing * distanceMask - 0.1) / 0.38;",
    "  outerRing += noiseC.r - 0.5;",
    "  outerRing *= 1.3;",
    "  outerRing = clamp(outerRing, 0.0, 1.0);",
    "  innerRing += outerRing;",
    "  float innerEye = distanceMask - 0.1 * 2.0;",
    "  innerEye *= noiseB.r * 2.0;",
    "  vec2 pupilOffset = uMouse * uPupilFollow * 0.12;",
    "  vec2 pupilUv = uv - pupilOffset;",
    "  float pupil = 1.0 - length(pupilUv * vec2(9.0, 2.3));",
    "  pupil *= uPupilSize;",
    "  pupil = clamp(pupil, 0.0, 1.0);",
    "  pupil /= 0.35;",
    "  float outerEyeGlow = 1.0 - length(uv * vec2(0.5, 1.5));",
    "  outerEyeGlow = clamp(outerEyeGlow + 0.5, 0.0, 1.0);",
    "  outerEyeGlow += noiseC.r - 0.5;",
    "  float outerBgGlow = outerEyeGlow;",
    "  outerEyeGlow = pow(outerEyeGlow, 2.0);",
    "  outerEyeGlow += distanceMask;",
    "  outerEyeGlow *= uGlowIntensity;",
    "  outerEyeGlow = clamp(outerEyeGlow, 0.0, 1.0);",
    "  outerEyeGlow *= pow(1.0 - distanceMask, 2.0) * 2.5;",
    "  outerBgGlow += distanceMask;",
    "  outerBgGlow = pow(outerBgGlow, 0.5);",
    "  outerBgGlow *= 0.15;",
    "  vec3 color = uEyeColor * uIntensity * clamp(max(innerRing + innerEye, outerEyeGlow + outerBgGlow) - pupil, 0.0, 3.0);",
    "  color += uBgColor;",
    "  gl_FragColor = vec4(color, 1.0);",
    "}"
  ].join("\n");

  function compilar(gl, tipo, fuente) {
    var s = gl.createShader(tipo);
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  /* ==========================================================
     EvilEye
     ========================================================== */
  function evilEye(container, opts) {
    if (!container) return false;

    var o = opts || {};
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false }) ||
             canvas.getContext("experimental-webgl", { alpha: false, antialias: false, depth: false });

    /* Sin WebGL: se queda el fondo plano de la sección */
    if (!gl) return false;

    var vs = compilar(gl, gl.VERTEX_SHADER, VERT);
    var fs = compilar(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return false;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);

    container.appendChild(canvas);

    /* Triángulo que cubre toda la pantalla */
    var posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 2, 0, 0, 2]), gl.STATIC_DRAW);
    var aUv = gl.getAttribLocation(prog, "uv");
    if (aUv >= 0) {
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
    }

    /* Textura de ruido (256 es potencia de dos: permite REPEAT) */
    var tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 256, 0, gl.RGBA, gl.UNSIGNED_BYTE, generarRuido(256));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.activeTexture(gl.TEXTURE0);

    function u(nombre) { return gl.getUniformLocation(prog, nombre); }

    gl.uniform1i(u("uNoiseTexture"), 0);
    gl.uniform1f(u("uPupilSize"), o.pupilSize != null ? o.pupilSize : 0.6);
    gl.uniform1f(u("uIrisWidth"), o.irisWidth != null ? o.irisWidth : 0.25);
    gl.uniform1f(u("uGlowIntensity"), o.glowIntensity != null ? o.glowIntensity : 0.35);
    gl.uniform1f(u("uIntensity"), o.intensity != null ? o.intensity : 1.5);
    gl.uniform1f(u("uScale"), o.scale != null ? o.scale : 0.8);
    gl.uniform1f(u("uNoiseScale"), o.noiseScale != null ? o.noiseScale : 1.0);
    gl.uniform1f(u("uPupilFollow"), o.pupilFollow != null ? o.pupilFollow : 1.0);
    gl.uniform1f(u("uFlameSpeed"), o.flameSpeed != null ? o.flameSpeed : 1.0);
    gl.uniform3fv(u("uEyeColor"), hexToRgb01(o.eyeColor || "#FF6F37"));
    gl.uniform3fv(u("uBgColor"), hexToRgb01(o.backgroundColor || "#000000"));

    var uTime = u("uTime");
    var uRes = u("uResolution");
    var uMouse = u("uMouse");

    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    function resize() {
      var w = Math.max(1, Math.round(container.offsetWidth * dpr));
      var h = Math.max(1, Math.round(container.offsetHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform3f(uRes, w, h, w / h);
    }

    window.addEventListener("resize", resize);
    resize();

    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    container.parentElement.addEventListener("mousemove", function (e) {
      var r = container.getBoundingClientRect();
      mouse.tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.ty = -(((e.clientY - r.top) / r.height) * 2 - 1);
    });

    container.parentElement.addEventListener("mouseleave", function () {
      mouse.tx = 0; mouse.ty = 0;
    });

    function dibujar(t) {
      resize();
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uTime, t * 0.001);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    /* Fotograma único si el usuario pidió menos movimiento */
    if (reduceMotion) { dibujar(0); return true; }

    var raf = null;

    function loop(t) {
      dibujar(t);
      raf = requestAnimationFrame(loop);
    }

    alEstarVisible(container,
      function () { if (raf === null) raf = requestAnimationFrame(loop); },
      function () { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }
    );

    return true;
  }

  /* ==========================================================
     LetterGlitch
     ========================================================== */
  function letterGlitch(container, opts) {
    if (!container) return;

    var o = opts || {};
    var colores = o.glitchColors || ["#2b4539", "#61dca3", "#61b3dc"];
    var glitchSpeed = o.glitchSpeed != null ? o.glitchSpeed : 50;
    var smooth = o.smooth !== false;
    var chars = Array.from(o.characters ||
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789");

    var canvas = document.createElement("canvas");
    container.appendChild(canvas);
    var ctx = canvas.getContext("2d");

    var fontSize = 16, charWidth = 10, charHeight = 20;
    var letras = [];
    var grid = { columns: 0, rows: 0 };
    var ultimoGlitch = Date.now();

    function randChar() { return chars[Math.floor(Math.random() * chars.length)]; }
    function randColor() { return colores[Math.floor(Math.random() * colores.length)]; }

    function hexToRgb(hex) {
      hex = hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function (m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return res ? {
        r: parseInt(res[1], 16),
        g: parseInt(res[2], 16),
        b: parseInt(res[3], 16)
      } : null;
    }

    function mezclar(a, b, f) {
      return "rgb(" +
        Math.round(a.r + (b.r - a.r) * f) + ", " +
        Math.round(a.g + (b.g - a.g) * f) + ", " +
        Math.round(a.b + (b.b - a.b) * f) + ")";
    }

    function inicializar(columns, rows) {
      grid = { columns: columns, rows: rows };
      letras = new Array(columns * rows);
      for (var i = 0; i < letras.length; i++) {
        letras[i] = {
          char: randChar(),
          color: randColor(),
          targetColor: randColor(),
          colorProgress: 1
        };
      }
    }

    function redimensionar() {
      var rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      var dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      inicializar(Math.ceil(rect.width / charWidth), Math.ceil(rect.height / charHeight));
      dibujar();
    }

    function dibujar() {
      if (!letras.length) return;
      var rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = fontSize + "px monospace";
      ctx.textBaseline = "top";

      for (var i = 0; i < letras.length; i++) {
        ctx.fillStyle = letras[i].color;
        ctx.fillText(
          letras[i].char,
          (i % grid.columns) * charWidth,
          Math.floor(i / grid.columns) * charHeight
        );
      }
    }

    function actualizar() {
      var cuantas = Math.max(1, Math.floor(letras.length * 0.05));
      for (var i = 0; i < cuantas; i++) {
        var idx = Math.floor(Math.random() * letras.length);
        var l = letras[idx];
        if (!l) continue;
        l.char = randChar();
        l.targetColor = randColor();
        if (!smooth) { l.color = l.targetColor; l.colorProgress = 1; }
        else l.colorProgress = 0;
      }
    }

    function transiciones() {
      var redibujar = false;
      for (var i = 0; i < letras.length; i++) {
        var l = letras[i];
        if (l.colorProgress >= 1) continue;
        l.colorProgress = Math.min(1, l.colorProgress + 0.05);
        var a = hexToRgb(l.color) || { r: 0, g: 0, b: 0 };
        var b = hexToRgb(l.targetColor);
        if (b) { l.color = mezclar(a, b, l.colorProgress); redibujar = true; }
      }
      if (redibujar) dibujar();
    }

    window.addEventListener("resize", function () {
      clearTimeout(redimensionar._t);
      redimensionar._t = setTimeout(redimensionar, 120);
    });

    redimensionar();

    if (reduceMotion) return;

    var raf = null;

    function loop() {
      var now = Date.now();
      if (now - ultimoGlitch >= glitchSpeed) {
        actualizar();
        dibujar();
        ultimoGlitch = now;
      }
      if (smooth) transiciones();
      raf = requestAnimationFrame(loop);
    }

    alEstarVisible(container,
      function () { redimensionar(); if (raf === null) raf = requestAnimationFrame(loop); },
      function () { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }
    );
  }

  /* ==========================================================
     Arranque
     ========================================================== */
  function init() {
    /* Ojo de fuego — Pasatiempos (guiño a la fantasía) */
    evilEye(document.getElementById("eye-bg"), {
      eyeColor: "#d08a2c",
      backgroundColor: "#0e1016",
      intensity: 1.45,
      pupilSize: 0.6,
      irisWidth: 0.25,
      glowIntensity: 0.3,
      scale: 0.62,
      noiseScale: 1.0,
      pupilFollow: 1.0,
      flameSpeed: 0.85
    });

    /* Lluvia de letras — Servicios / KAMEX */
    letterGlitch(document.getElementById("glitch-bg"), {
      glitchColors: ["#4a3c1c", "#b08c3e", "#7d3434"],
      glitchSpeed: 62,
      smooth: true,
      characters: "ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]();=+-*&$#@!0123456789"
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
