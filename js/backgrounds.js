/* ============================================================
   FONDOS ANIMADOS (WebGL puro, sin three.js ni ogl)
   · Ferrofluid   — portada
   · EvilEye      — Pasatiempos (ojo de fuego)
   · LightPillar  — Experiencia laboral (pilar de luz)
   Todos se pausan cuando su sección no está a la vista.
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
     Utilidades comunes para los fondos con shader
     ========================================================== */
  function temaOscuro() {
    return document.documentElement.getAttribute("data-theme") === "dark";
  }

  function alCambiarTema(cb) {
    if (!window.MutationObserver) return;
    new MutationObserver(function () { cb(temaOscuro()); })
      .observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* Crea un lienzo WebGL a pantalla completa con un shader dado.
     Devuelve { gl, uniform, canvas } o null si no hay WebGL. */
  function crearShader(container, vert, frag, opciones) {
    if (!container) return null;

    var o = opciones || {};
    var canvas = document.createElement("canvas");
    var gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, premultipliedAlpha: false }) ||
             canvas.getContext("experimental-webgl", { alpha: true, antialias: false, depth: false });
    if (!gl) return null;

    var vs = compilar(gl, gl.VERTEX_SHADER, vert);
    var fs = compilar(gl, gl.FRAGMENT_SHADER, frag);
    if (!vs || !fs) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
    gl.useProgram(prog);

    container.appendChild(canvas);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    var posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var aUv = gl.getAttribLocation(prog, "uv");
    if (aUv >= 0) {
      var uvBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 2, 0, 0, 2]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(aUv);
      gl.vertexAttribPointer(aUv, 2, gl.FLOAT, false, 0, 0);
    }

    var cache = {};
    function loc(n) {
      if (!(n in cache)) cache[n] = gl.getUniformLocation(prog, n);
      return cache[n];
    }

    var api = {
      gl: gl,
      canvas: canvas,
      f: function (n, v) { gl.uniform1f(loc(n), v); return api; },
      i: function (n, v) { gl.uniform1i(loc(n), v); return api; },
      v2: function (n, a, b) { gl.uniform2f(loc(n), a, b); return api; },
      v3: function (n, a) { gl.uniform3fv(loc(n), a); return api; },
      v3f: function (n, a, b, c) { gl.uniform3f(loc(n), a, b, c); return api; },
      ancho: 0,
      alto: 0
    };

    var dpr = Math.min(window.devicePixelRatio || 1, o.dpr || 1.5);

    function resize() {
      var w = Math.max(1, Math.round(container.offsetWidth * dpr));
      var h = Math.max(1, Math.round(container.offsetHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      api.ancho = w;
      api.alto = h;
      gl.viewport(0, 0, w, h);
      if (o.onResize) o.onResize(api, w, h);
    }

    window.addEventListener("resize", resize);
    resize();

    function dibujar(t) {
      resize();
      if (o.onFrame) o.onFrame(api, t);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    if (reduceMotion) { dibujar(0); return api; }

    var raf = null;
    function loop(t) { dibujar(t); raf = requestAnimationFrame(loop); }

    alEstarVisible(container,
      function () { if (raf === null) raf = requestAnimationFrame(loop); },
      function () { if (raf !== null) { cancelAnimationFrame(raf); raf = null; } }
    );

    return api;
  }

  /* ==========================================================
     Ferrofluid — fondo de la portada
     El fondo queda transparente para conservar el color del papel;
     solo se dibujan los filamentos brillantes.
     ========================================================== */
  var FLUID_VERT = [
    "attribute vec2 position;",
    "attribute vec2 uv;",
    "varying vec2 vUv;",
    "void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }"
  ].join("\n");

  var FLUID_FRAG = [
    "precision highp float;",
    "uniform vec3 iResolution;",
    "uniform vec2 iMouse;",
    "uniform float iTime;",
    "uniform vec3 uColor0; uniform vec3 uColor1; uniform vec3 uColor2;",
    "uniform vec2 uFlow;",
    "uniform float uSpeed; uniform float uScale; uniform float uTurbulence;",
    "uniform float uFluidity; uniform float uRimWidth; uniform float uSharpness;",
    "uniform float uShimmer; uniform float uGlow; uniform float uOpacity;",
    "uniform float uMouseEnabled; uniform float uMouseStrength; uniform float uMouseRadius;",
    "varying vec2 vUv;",
    "#define PI 3.14159265",
    "vec3 palette(float h) {",
    "  if (h < 0.3333) return uColor0;",
    "  if (h < 0.6666) return uColor1;",
    "  return uColor2;",
    "}",
    "float hash(vec3 p3) {",
    "  p3 = fract(p3 * 0.1031);",
    "  p3 += dot(p3, p3.zyx + 33.33);",
    "  return fract((p3.x + p3.y) * p3.z);",
    "}",
    "float smin(float a, float b, float k) {",
    "  float r = exp2(-a / k) + exp2(-b / k);",
    "  return -k * log2(r);",
    "}",
    "float sinlerp(float a, float b, float w) {",
    "  return mix(a, b, (sin(w * PI - PI / 2.0) + 1.0) / 2.0);",
    "}",
    "float vn(vec2 p, float s, float seed) {",
    "  vec2 cellp = floor(p / s);",
    "  vec2 relp = mod(p, s);",
    "  float g1 = hash(vec3(cellp, seed));",
    "  float g2 = hash(vec3(cellp.x + 1.0, cellp.y, seed));",
    "  float g3 = hash(vec3(cellp.x + 1.0, cellp.y + 1.0, seed));",
    "  float g4 = hash(vec3(cellp.x, cellp.y + 1.0, seed));",
    "  float bx = sinlerp(g1, g2, relp.x / s);",
    "  float tx = sinlerp(g4, g3, relp.x / s);",
    "  return sinlerp(bx, tx, relp.y / s);",
    "}",
    "float dbn(vec2 p, float s, float seed) {",
    "  float o = s / 2.0;",
    "  float n0 = vn(p, s, seed);",
    "  float n1 = vn(p + vec2(o, o), s, seed + 0.1);",
    "  float n2 = vn(p + vec2(-o, o), s, seed + 0.2);",
    "  float n3 = vn(p + vec2(o, -o), s, seed + 0.3);",
    "  float n4 = vn(p + vec2(-o, -o), s, seed + 0.4);",
    "  return (2.0 * n0 + 1.5 * n1 + 1.25 * n2 + 1.125 * n3 + n4) / 7.0;",
    "}",
    "void main() {",
    "  vec2 fragCoord = vUv * iResolution.xy;",
    "  float ref = 700.0 / max(uScale, 0.05);",
    "  vec2 p = fragCoord / iResolution.y * ref;",
    "  float spd = 200.0 * uSpeed;",
    "  float t = iTime;",
    "  vec2 dir = uFlow;",
    "  vec2 perp = vec2(-dir.y, dir.x);",
    "  float distort1 = vn(p + perp * (t * spd), 60.0, 10.0) * 50.0 * uTurbulence;",
    "  float distort2 = vn(p - perp * (t * spd), 120.0, 15.0) * 100.0 * uTurbulence;",
    "  float peaks = dbn(p + distort1 + dir * (t * spd * 0.5), 40.0, 1.0);",
    "  float peaks2 = dbn(p + distort2 - dir * (t * spd * 0.5), 40.0, 0.0);",
    "  float mapeaks = smin(peaks, peaks2, max(uFluidity, 0.001));",
    "  float mGlow = 0.0;",
    "  if (uMouseEnabled > 0.5) {",
    "    vec2 mp = iMouse / iResolution.y * ref;",
    "    float md = length(p - mp) / ref;",
    "    float rr = max(uMouseRadius, 0.02);",
    "    mGlow = exp(-md * md / (rr * rr)) * uMouseStrength;",
    "  }",
    "  float band = (uRimWidth - abs((mapeaks - 0.4) * 2.0)) * 5.0;",
    "  float ltn = clamp(band - vn(p + dir * (t * spd * 0.5), 60.0, 12.0) * uShimmer, 0.0, 1.0);",
    "  ltn = pow(ltn, uSharpness) * uGlow;",
    "  ltn *= clamp(1.0 - mGlow, 0.0, 1.0);",
    "  float h = clamp(0.5 + (peaks - peaks2) * 0.8, 0.0, 1.0);",
    "  vec3 col = palette(h);",
    "  vec3 outc = col * ltn;",
    "  float a = clamp(max(outc.r, max(outc.g, outc.b)), 0.0, 1.0);",
    "  gl_FragColor = vec4(outc, a * uOpacity);",
    "}"
  ].join("\n");

  function ferrofluid(container) {
    if (!container) return;

    /* En modo oscuro los filamentos van en blanco (como el original);
       sobre papel claro el blanco sería invisible, así que se usa el
       dorado de la página. */
    function paleta() {
      return temaOscuro()
        ? [[1, 1, 1], [1, 1, 1], [0.92, 0.95, 1]]
        : [hexToRgb01("#8a6c2c"), hexToRgb01("#b08c3e"), hexToRgb01("#7d3434")];
    }

    var mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    var api = crearShader(container, FLUID_VERT, FLUID_FRAG, {
      dpr: 1.25,
      onResize: function (a, w, h) { a.v3f("iResolution", w, h, 1); },
      onFrame: function (a, t) {
        mouse.x += (mouse.tx - mouse.x) * 0.06;
        mouse.y += (mouse.ty - mouse.y) * 0.06;
        a.f("iTime", t * 0.001);
        a.v2("iMouse", mouse.x, mouse.y);
      }
    });

    if (!api) return;

    function aplicarColores() {
      var c = paleta();
      api.v3("uColor0", c[0]).v3("uColor1", c[1]).v3("uColor2", c[2]);
      api.f("uOpacity", temaOscuro() ? 0.9 : 0.62);
    }

    api.v2("uFlow", 0, -1)
       .f("uSpeed", 0.32)
       .f("uScale", 1.5)
       .f("uTurbulence", 1)
       .f("uFluidity", 0.1)
       .f("uRimWidth", 0.2)
       .f("uSharpness", 2.6)
       .f("uShimmer", 1.4)
       .f("uGlow", 2)
       .f("uMouseEnabled", 1)
       .f("uMouseStrength", 1)
       .f("uMouseRadius", 0.32);

    aplicarColores();
    alCambiarTema(aplicarColores);

    container.parentElement.addEventListener("mousemove", function (e) {
      var r = container.getBoundingClientRect();
      var dpr = api.ancho / Math.max(1, r.width);
      mouse.tx = (e.clientX - r.left) * dpr;
      mouse.ty = (r.height - (e.clientY - r.top)) * dpr;
    });
  }

  /* ==========================================================
     LightPillar — fondo de Experiencia laboral
     Portado desde Three.js a WebGL directo. Dos cambios respecto
     al original:
       · tanh() no existe en GLSL ES 1.00 → se implementa a mano.
       · el alfa sale del brillo, así el fondo del pilar queda
         transparente y se conserva el color del papel (sin
         depender de mix-blend-mode, que sobre papel claro
         desaparecía).
     ========================================================== */
  var PILLAR_VERT = [
    "attribute vec2 position;",
    "attribute vec2 uv;",
    "varying vec2 vUv;",
    "void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }"
  ].join("\n");

  var PILLAR_FRAG = [
    "precision highp float;",
    "uniform float uTime;",
    "uniform vec2 uResolution;",
    "uniform vec2 uMouse;",
    "uniform vec3 uTopColor;",
    "uniform vec3 uBottomColor;",
    "uniform float uIntensity;",
    "uniform float uInteractive;",
    "uniform float uGlowAmount;",
    "uniform float uPillarWidth;",
    "uniform float uPillarHeight;",
    "uniform float uNoiseIntensity;",
    "uniform float uOpacity;",
    "uniform float uRotCos;",
    "uniform float uRotSin;",
    "uniform float uPillarRotCos;",
    "uniform float uPillarRotSin;",
    "uniform float uWaveSin;",
    "uniform float uWaveCos;",
    "varying vec2 vUv;",
    "const float STEP_MULT = 1.2;",
    "const int MAX_ITER = 44;",
    "const int WAVE_ITER = 2;",
    /* tanh no existe en GLSL ES 1.00: se acota para evitar desbordes */
    "vec3 tanh3(vec3 x) {",
    "  x = clamp(x, -8.0, 8.0);",
    "  vec3 e = exp(2.0 * x);",
    "  return (e - 1.0) / (e + 1.0);",
    "}",
    "void main() {",
    "  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);",
    "  uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);",
    "  vec3 ro = vec3(0.0, 0.0, -10.0);",
    "  vec3 rd = normalize(vec3(uv, 1.0));",
    "  float rotC = uRotCos;",
    "  float rotS = uRotSin;",
    "  if (uInteractive > 0.5 && (uMouse.x != 0.0 || uMouse.y != 0.0)) {",
    "    float a = uMouse.x * 6.283185;",
    "    rotC = cos(a);",
    "    rotS = sin(a);",
    "  }",
    "  vec3 col = vec3(0.0);",
    "  float t = 0.1;",
    "  for (int i = 0; i < MAX_ITER; i++) {",
    "    vec3 p = ro + rd * t;",
    "    p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);",
    "    vec3 q = p;",
    "    q.y = p.y * uPillarHeight + uTime;",
    "    float freq = 1.0;",
    "    float amp = 1.0;",
    "    for (int j = 0; j < WAVE_ITER; j++) {",
    "      q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);",
    "      q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;",
    "      freq *= 2.0;",
    "      amp *= 0.5;",
    "    }",
    "    float d = length(cos(q.xz)) - 0.2;",
    "    float bound = length(p.xz) - uPillarWidth;",
    "    float k = 4.0;",
    "    float h = max(k - abs(d - bound), 0.0);",
    "    d = max(d, bound) + h * h * 0.0625 / k;",
    "    d = abs(d) * 0.15 + 0.01;",
    "    float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);",
    "    col += mix(uBottomColor, uTopColor, grad) / d;",
    "    t += d * STEP_MULT;",
    "    if (t > 50.0) break;",
    "  }",
    "  float widthNorm = uPillarWidth / 3.0;",
    "  col = tanh3(col * uGlowAmount / widthNorm);",
    "  col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;",
    "  col = max(col, vec3(0.0));",
    "  col *= uIntensity;",
    "  float a = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);",
    "  gl_FragColor = vec4(col, a * uOpacity);",
    "}"
  ].join("\n");

  function lightPillar(container, opts) {
    if (!container) return;

    var o = opts || {};
    var tiempo = 0;
    var rotSpeed = o.rotationSpeed != null ? o.rotationSpeed : 0.3;
    var ultimo = null;

    var api = crearShader(container, PILLAR_VERT, PILLAR_FRAG, {
      dpr: 1.1,
      onResize: function (a, w, h) { a.v2("uResolution", w, h); },
      onFrame: function (a, t) {
        if (ultimo === null) ultimo = t;
        var dt = Math.min(64, t - ultimo) / 1000;
        ultimo = t;
        tiempo += dt * rotSpeed;
        a.f("uTime", tiempo);
        a.f("uRotCos", Math.cos(tiempo * 0.3));
        a.f("uRotSin", Math.sin(tiempo * 0.3));
      }
    });

    if (!api) return;

    var rot = ((o.pillarRotation || 0) * Math.PI) / 180;

    api.f("uIntensity", o.intensity != null ? o.intensity : 1)
       .f("uInteractive", 0)
       .v2("uMouse", 0, 0)
       .f("uGlowAmount", o.glowAmount != null ? o.glowAmount : 0.005)
       .f("uPillarWidth", o.pillarWidth != null ? o.pillarWidth : 3)
       .f("uPillarHeight", o.pillarHeight != null ? o.pillarHeight : 0.4)
       .f("uNoiseIntensity", o.noiseIntensity != null ? o.noiseIntensity : 0.5)
       .f("uPillarRotCos", Math.cos(rot))
       .f("uPillarRotSin", Math.sin(rot))
       .f("uWaveSin", Math.sin(0.4))
       .f("uWaveCos", Math.cos(0.4));
    api.v2("uResolution", api.ancho, api.alto);

    function aplicar() {
      var oscuro = temaOscuro();
      api.v3("uTopColor", hexToRgb01(oscuro ? "#e8cb88" : "#b08c3e"))
         .v3("uBottomColor", hexToRgb01(oscuro ? "#c98383" : "#7d3434"))
         .f("uOpacity", oscuro ? 0.72 : 0.46);
    }

    aplicar();
    alCambiarTema(aplicar);
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
    /* Servicios ya no lleva fondo animado: la lluvia de letras
       repintaba 3.441 caracteres por fotograma (~3 ms cada uno,
       ~190 ms por segundo de hilo principal) y era una de las
       causas del lag. */

    /* Ferrofluido — Portada (fondo transparente: conserva el papel) */
    ferrofluid(document.getElementById("fluid-bg"));

    /* Pilar de luz — Experiencia laboral */
    lightPillar(document.getElementById("pillar-bg"), {
      intensity: 1,
      rotationSpeed: 0.3,
      glowAmount: 0.005,
      pillarWidth: 3,
      pillarHeight: 0.4,
      noiseIntensity: 0.35,
      pillarRotation: 0
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
