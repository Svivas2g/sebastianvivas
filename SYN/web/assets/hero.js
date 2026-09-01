/* ═══════════════════════════════════════════════════════════════════
   SYN · Hero de interferencia
   ───────────────────────────────────────────────────────────────────
   Una fotografía convertida en malla de caracteres. No es un filtro
   sobre la imagen: la foto se analiza una vez al cargar y se destila
   en tres campos de datos; después cada celda de la retícula consulta
   esos campos y elige un glifo según su intensidad.

   Los tres campos
   ───────────────
     forma   — dónde está el sujeto (zonas oscuras + bordes Sobel)
     textura — el relieve del tronco, que se dibuja más apagado
     halo    — la forma dilatada, que separa sujeto de fondo

   Sobre eso se suma una interferencia de dos ondas que se cruzan, un
   campo de partículas, y la deformación del ratón. Al hacer scroll el
   sujeto se aleja y la interferencia se intensifica hasta disolverlo.

   Los glifos no se dibujan con fillText en cada celda — eso serían
   decenas de miles de llamadas por frame. Se pre-renderizan una vez
   en un atlas y luego cada celda es un drawImage de un recorte.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Parámetros del sujeto: dónde está el umbral de sombra, dónde tiene
     la pinza y las patas, para animarlas por separado. */
  var SUJETO = {
    src: 'assets/hero-sujeto.jpg',
    d0: 0.58,    /* umbral de luminancia: por debajo, es sujeto */
    dd: 0.42,    /* suavidad de ese umbral */
    tex: 0.42,   /* cuánta textura del tronco se conserva */
    zoom: 1.30,
    offY: -0.05,
    pu: 0.60, pv: 0.52, dir: -1,   /* pivote de la pinza */
    lv: 0.62, lu: 0.28             /* zona de las patas */
  };

  /* De menos a más denso: la celda elige según su intensidad */
  var RAMPA = " .,'-:;<>/\\1o0#%@";

  var OPC = {
    celda: 8,            /* px del glifo */
    contraste: 1.8,
    brillo: 0.78,
    luzMax: 0.6,
    forma: 1.25,         /* cuánto pesa el sujeto sobre la interferencia */
    separacion: 0.7,     /* cuánto separa el halo al sujeto del fondo */
    tronco: 1.15,        /* cuánta textura de tronco se dibuja */
    luzTronco: 0.4,      /* el tronco va más apagado que el sujeto */
    zoom: 0.72,
    offsetY: -0.03,
    patas: 0.2,
    pinza: 1.65,
    particulas: 0.12,
    paleta: ['#17171B', '#B9B9C4'],
    calido: ['#3F1188', '#8A45E0']   /* estela morada bajo el cursor */
  };

  function lim01(x) { return x < 0 ? 0 : (x > 1 ? 1 : x); }

  function hexRGB(h) {
    var s = String(h || '').replace('#', '');
    var n = parseInt(s.length === 3 ? s.split('').map(function (x) { return x + x; }).join('') : s, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  /* ═════════════════════════════════════════════════════════════════ */
  function Hero(raiz) {
    this.raiz = raiz;
    this.lienzo = raiz.querySelector('[data-hero-canvas]');
    this.titulo = raiz.querySelector('[data-hero-titulo]');
    this.letras = [].slice.call(raiz.querySelectorAll('[data-ch]'));
    if (!this.lienzo) return;

    this.ctx = this.lienzo.getContext('2d');
    this.top = 0; this.viewH = 1; this.max = 1;
    this.claveAtlas = null;
    this.reducido = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

    /* Ratón: destino y valor perseguido */
    this.mx = 0; this.my = 0; this.amp = 0; this.ampT = 0;
    this.t0 = performance.now();

    this.medirLienzo();
    this.cargarSujeto();
    setTimeout(this.construirParticulas.bind(this), 120);

    this.escuchar();
    this.medirScroll();
    this.arrancar();
  }

  /* ── Medidas ────────────────────────────────────────────────────── */
  Hero.prototype.medirLienzo = function () {
    var r = this.lienzo.getBoundingClientRect();
    this.w = Math.max(1, Math.round(r.width));
    this.h = Math.max(1, Math.round(r.height));
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.lienzo.width = Math.round(this.w * this.dpr);
    this.lienzo.height = Math.round(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.brillo = null;
  };

  Hero.prototype.medirScroll = function () {
    var el = document.scrollingElement || document.documentElement;
    this.top = el.scrollTop || 0;
    this.viewH = el.clientHeight || window.innerHeight;
    this.max = Math.max(1, el.scrollHeight - el.clientHeight);
  };

  /* ── Atlas de glifos ────────────────────────────────────────────────
     Se pintan los caracteres de la rampa en 9 niveles de luz, una sola
     vez. Después cada celda es un recorte de esta hoja.              */
  Hero.prototype.construirAtlas = function (fs, cw, ch, A, B, ct, mx) {
    var NIV = 9, dpr = this.dpr || 1;
    var cv = document.createElement('canvas');
    cv.width = Math.ceil(RAMPA.length * cw * dpr);
    cv.height = Math.ceil(NIV * ch * dpr);
    var g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = fs + "px 'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";

    for (var l = 0; l < NIV; l++) {
      var k = l / (NIV - 1);
      var a = (0.05 + (mx - 0.05) * Math.pow(k, ct * 0.68)).toFixed(3);
      var kc = Math.pow(k, ct);
      var cr = Math.round(A[0] + (B[0] - A[0]) * kc);
      var cg = Math.round(A[1] + (B[1] - A[1]) * kc);
      var cb = Math.round(A[2] + (B[2] - A[2]) * kc);
      g.fillStyle = 'rgba(' + cr + ',' + cg + ',' + cb + ',' + a + ')';
      for (var i = 0; i < RAMPA.length; i++) g.fillText(RAMPA[i], i * cw + cw * 0.5, l * ch + ch * 0.52);
    }
    this.NIV = NIV;
    return cv;
  };

  /* ── Campo de partículas (ruido fractal con dominio deformado) ──── */
  Hero.prototype.construirParticulas = function () {
    var DW = 384, DH = 240;
    function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
    function ruido(x, y) {
      var ix = Math.floor(x), iy = Math.floor(y);
      var fx = x - ix, fy = y - iy;
      var ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
      var a = hash(ix, iy), b = hash(ix + 1, iy), c = hash(ix, iy + 1), d = hash(ix + 1, iy + 1);
      return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
    }
    var out = new Float32Array(DW * DH);
    for (var y = 0; y < DH; y++) {
      for (var x = 0; x < DW; x++) {
        var u = (x / DW) * 5, v = (y / DH) * 3.2;
        u += (ruido(u * 0.6, v * 0.6) - 0.5) * 2.4;
        v += (ruido(u * 0.6 + 5.2, v * 0.6 + 1.3) - 0.5) * 2.4;
        var amp = 1, f = 0, tot = 0, fr = 1;
        for (var o = 0; o < 4; o++) {
          var r = 1 - Math.abs(ruido(u * fr, v * fr) * 2 - 1);
          f += Math.pow(r, 3.4) * amp; tot += amp; amp *= 0.52; fr *= 2.07;
        }
        out[y * DW + x] = Math.pow(f / tot, 0.85);
      }
    }
    this.part = out; this.DW = DW; this.DH = DH;
  };

  /* ── Análisis de la foto ────────────────────────────────────────────
     Ocurre UNA vez. Saca luminancia, la desenfoca, aplica Sobel y
     destila los tres campos que luego consulta cada celda.          */
  Hero.prototype.cargarSujeto = function () {
    var self = this, c = SUJETO;
    var img = new Image();
    img.onload = function () { self.analizar(img, c); };
    img.src = c.src;
  };

  Hero.prototype.analizar = function (img, c) {
    var FW = 640;
    var FH = Math.max(1, Math.round(FW * img.height / img.width));
    var cv = document.createElement('canvas');
    cv.width = FW; cv.height = FH;
    var g = cv.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, FW, FH);
    var d = g.getImageData(0, 0, FW, FH).data;

    var lum = new Float32Array(FW * FH);
    for (var i = 0, p = 0; i < lum.length; i++, p += 4) {
      lum[i] = (d[p] * 0.299 + d[p + 1] * 0.587 + d[p + 2] * 0.114) / 255;
    }

    /* Desenfoque separable: primero filas, luego columnas */
    var tmp = new Float32Array(FW * FH), bl = new Float32Array(FW * FH);
    var RD = 5, DEN = RD * 2 + 1, x, y, k, s, xx, yy;
    for (y = 0; y < FH; y++) for (x = 0; x < FW; x++) {
      s = 0;
      for (k = -RD; k <= RD; k++) { xx = x + k; if (xx < 0) xx = 0; else if (xx >= FW) xx = FW - 1; s += lum[y * FW + xx]; }
      tmp[y * FW + x] = s / DEN;
    }
    for (x = 0; x < FW; x++) for (y = 0; y < FH; y++) {
      s = 0;
      for (k = -RD; k <= RD; k++) { yy = y + k; if (yy < 0) yy = 0; else if (yy >= FH) yy = FH - 1; s += tmp[yy * FW + x]; }
      bl[y * FW + x] = s / DEN;
    }

    /* Forma y textura */
    var forma = new Float32Array(FW * FH), tex = new Float32Array(FW * FH);
    for (y = 1; y < FH - 1; y++) {
      for (x = 1; x < FW - 1; x++) {
        var idx = y * FW + x;
        var gx = -lum[idx - FW - 1] - 2 * lum[idx - 1] - lum[idx + FW - 1] + lum[idx - FW + 1] + 2 * lum[idx + 1] + lum[idx + FW + 1];
        var gy = -lum[idx - FW - 1] - 2 * lum[idx - FW] - lum[idx - FW + 1] + lum[idx + FW - 1] + 2 * lum[idx + FW] + lum[idx + FW + 1];
        var borde = Math.min(1, Math.sqrt(gx * gx + gy * gy) * 1.2);
        var oscuro = Math.pow(lim01((c.d0 - lum[idx]) / c.dd), 1.25);
        var detalle = lim01((bl[idx] - lum[idx]) * 7) * lim01((c.d0 + 0.1 - lum[idx]) / 0.3);
        var v = Math.min(1, oscuro * 0.62 + detalle * 0.7 + borde * oscuro * 0.55);
        forma[idx] = v < 0.08 ? 0 : v;
        var claro = lim01((lum[idx] - c.d0 + 0.14) / 0.3);
        tex[idx] = Math.min(1, (borde * 1.15 + Math.max(0, bl[idx] - lum[idx]) * 3.2) * claro * c.tex * 2.4);
      }
    }

    /* Halo: la forma dilatada, para despegarla del fondo */
    var hx = new Float32Array(FW * FH), halo = new Float32Array(FW * FH), RH = 3, m, q;
    for (y = 0; y < FH; y++) for (x = 0; x < FW; x++) {
      m = 0;
      for (k = -RH; k <= RH; k++) { xx = x + k; if (xx < 0) xx = 0; else if (xx >= FW) xx = FW - 1; q = forma[y * FW + xx]; if (q > m) m = q; }
      hx[y * FW + x] = m;
    }
    for (x = 0; x < FW; x++) for (y = 0; y < FH; y++) {
      m = 0;
      for (k = -RH; k <= RH; k++) { yy = y + k; if (yy < 0) yy = 0; else if (yy >= FH) yy = FH - 1; q = hx[yy * FW + x]; if (q > m) m = q; }
      halo[y * FW + x] = m;
    }

    /* Dilatar la textura para que no quede punteada */
    var dil = new Float32Array(FW * FH);
    for (y = 1; y < FH - 1; y++) for (x = 1; x < FW - 1; x++) {
      var j = y * FW + x; m = 0;
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) { q = tex[j + dy * FW + dx]; if (q > m) m = q; }
      dil[j] = Math.max(tex[j], m * 0.8);
    }

    this.campo = forma; this.campoT = dil; this.campoH = halo;
    this.FW = FW; this.FH = FH;
  };

  /* ── Eventos ────────────────────────────────────────────────────── */
  Hero.prototype.escuchar = function () {
    var self = this;

    this._resize = function () { self.medirLienzo(); self.medirScroll(); };
    this._scroll = function () { self.medirScroll(); };
    window.addEventListener('resize', this._resize);
    window.addEventListener('scroll', this._scroll, { passive: true });

    if (!this.reducido) {
      window.addEventListener('mousemove', function (e) {
        var r = self.lienzo.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        self.mx = (x - r.width * 0.5) / r.height;
        self.my = (y - r.height * 0.5) / r.height;
        self.ampT = (x >= 0 && x <= r.width && y >= 0 && y <= r.height) ? 1 : 0;
      }, { passive: true });
      document.addEventListener('mouseleave', function () { self.ampT = 0; });
    }

    /* Al cargar la fuente mono cambian las métricas: hay que rehacer el atlas */
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { self.claveAtlas = null; });
    }

    /* Fuera de pantalla no se dibuja ni un frame */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { en.isIntersecting ? self.arrancar() : self.parar(); });
      }, { threshold: 0.01 }).observe(this.lienzo);
    }
  };

  /* La retícula puede llegar a 46.000 glifos por frame. A 60 fps eso son
     2,7 millones de drawImage por segundo y el ventilador se entera. El
     efecto es una interferencia lenta: a 30 fps se ve idéntico y cuesta
     la mitad. */
  var MS_FRAME = 33;

  Hero.prototype.arrancar = function () {
    if (this._raf) return;
    var self = this;
    this._ultimo = 0;
    var bucle = function (t) {
      self._raf = requestAnimationFrame(bucle);
      if (t - self._ultimo < MS_FRAME) return;
      self._ultimo = t;
      self.pintar(t);
    };
    this._raf = requestAnimationFrame(bucle);
  };

  Hero.prototype.parar = function () {
    cancelAnimationFrame(this._raf);
    this._raf = null;
  };

  /* ═════════════════════════════════════════════════════════════════
     Un frame
     ═════════════════════════════════════════════════════════════════ */
  Hero.prototype.pintar = function (now) {
    var ctx = this.ctx, lz = this.lienzo;
    if (!ctx || !lz) return;

    var r = lz.getBoundingClientRect();
    if (Math.abs(r.width - this.w) > 1 || Math.abs(r.height - this.h) > 1) this.medirLienzo();

    var w = this.w, h = this.h;
    var A = hexRGB(OPC.paleta[0]), B = hexRGB(OPC.paleta[1]);
    var vel = this.reducido ? 0 : 1;

    /* Tamaño de celda: se agranda si la retícula sale demasiado densa */
    var fs = Math.max(5, Math.min(26, OPC.celda));
    var cw = Math.max(3, Math.round(fs * 0.62));
    var ch = Math.max(4, Math.round(fs * 1.0));
    while ((w / cw) * (h / ch) > 46000) {
      fs += 1; cw = Math.max(3, Math.round(fs * 0.62)); ch = Math.max(4, Math.round(fs * 1.0));
    }

    var ct = OPC.contraste, mx = OPC.luzMax, bri = OPC.brillo, lgL = OPC.luzTronco;
    var clave = fs + '|' + OPC.paleta.join(',') + '|' + ct + '|' + mx + '|' + lgL;
    if (clave !== this.claveAtlas) {
      this.atlas = this.construirAtlas(fs, cw, ch, A, B, ct, mx);
      this.atlasCalido = this.construirAtlas(fs, cw, ch, hexRGB(OPC.calido[0]), hexRGB(OPC.calido[1]), ct, mx);
      var LB = [Math.round(A[0] + (B[0] - A[0]) * lgL), Math.round(A[1] + (B[1] - A[1]) * lgL), Math.round(A[2] + (B[2] - A[2]) * lgL)];
      this.atlasTenue = this.construirAtlas(fs, cw, ch, A, LB, ct, mx);
      this.claveAtlas = clave;
    }

    var s = Math.min(1, this.top / this.max);                      /* avance total de la página */
    var hero = Math.min(1, this.top / Math.max(1, this.viewH * 0.85)); /* avance dentro del hero */
    var t = (now || 0) * 0.001 * (vel || 0.0001);

    ctx.clearRect(0, 0, w, h);

    if (!this.brillo) {
      var g = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, Math.max(w, h) * 0.55);
      g.addColorStop(0, 'rgba(' + B.join(',') + ',0.07)');
      g.addColorStop(0.5, 'rgba(' + A.join(',') + ',0.035)');
      g.addColorStop(1, 'rgba(8,8,10,0)');
      this.brillo = g;
    }
    ctx.fillStyle = this.brillo;
    ctx.fillRect(0, 0, w, h);

    /* Dos ondas que se cruzan: de su interferencia sale el fondo vivo */
    var a1x = Math.cos(t * 0.23) * (0.5 + s * 0.5);
    var a1y = Math.sin(t * 0.19) * (0.3 + s * 0.35);
    var a2x = Math.cos(-t * 0.17 + 2.1) * (0.55 + s * 0.4);
    var a2y = Math.sin(t * 0.27 + 1.3) * (0.34 + s * 0.3);
    var K1 = 8.5 + s * 13, K2 = 10.5 + s * 9;
    var rot = s * 0.55, cs = Math.cos(rot), sn = Math.sin(rot);
    var tilt = 1 + s * 1.9, drift = s * 1.4;

    /* El sujeto se disuelve conforme bajas */
    var fade = lim01(1 - this.top / Math.max(1, this.viewH * 1.7));
    var peso = fade * OPC.forma;
    var hayFoto = !!this.campo;
    var visible = peso > 0.01;

    var IH = SUJETO.zoom * OPC.zoom * (1 + hero * 0.34);
    var IA = this.FW ? this.FW / this.FH : 1.52;
    var IX = hero * 0.09;
    var IY = SUJETO.offY + OPC.offsetY - hero * 0.19 + Math.sin(t * 0.5) * 0.006;
    var giro = -hero * 0.14, dfc = Math.cos(giro), dfs = Math.sin(giro);

    var wrp = 0.003 + s * 0.028;
    var part = OPC.particulas * fade;
    var deriva = t * 0.004 + hero * 0.06;
    var pinza = OPC.pinza * 0.05 * (0.5 + 0.5 * Math.sin(t * 0.62));
    var patas = OPC.patas * 0.016;
    var paso = t * 1.15;

    this.amp += (this.ampT * fade - this.amp) * 0.14;
    var amp = this.amp * 0.34, PR2 = 0.0055;

    var atlas = this.atlas, atlasCalido = this.atlasCalido, atlasTenue = this.atlasTenue;
    var NIV = this.NIV, dpr = this.dpr;
    var sep = OPC.separacion * 2.6, gi = RAMPA.length - 1;
    var cols = Math.ceil(w / cw) + 1, rows = Math.ceil(h / ch) + 1;
    var tw = cw * dpr, th = ch * dpr;
    var tick = (t * 4) | 0;

    for (var gy = 0; gy < rows; gy++) {
      var py = gy * ch;
      var ny = (py + ch * 0.5 - h * 0.5) / h;

      for (var gx = 0; gx < cols; gx++) {
        var px = gx * cw;
        var nx = (px + cw * 0.5 - w * 0.5) / h;

        /* Interferencia de las dos ondas */
        var ty = ny * tilt - drift;
        var rx = nx * cs - ty * sn;
        var ry = nx * sn + ty * cs;
        var d1 = Math.sqrt((rx - a1x) * (rx - a1x) + (ry - a1y) * (ry - a1y));
        var d2 = Math.sqrt((rx - a2x) * (rx - a2x) + (ry - a2y) * (ry - a2y));
        var amb = Math.sin(d1 * K1 - t * 1.6) * Math.sin(d2 * K2 + t * 1.1) * 0.5 + 0.5;
        amb *= 0.55 + 0.45 * Math.sin(rx * 1.7 + ry * 1.15 - t * 0.5);
        amb = Math.pow(amb, 3.4);
        var val = amb * 0.22 * (0.22 + 0.78 * lim01((ny + 0.1) * 1.7));

        if (part > 0 && this.part) {
          var du = nx * 0.62 + 0.5 + deriva, dv = ny * 0.9 + 0.5 + deriva * 0.35;
          du -= Math.floor(du); dv -= Math.floor(dv);
          var pv = this.part[((dv * this.DH) | 0) * this.DW + ((du * this.DW) | 0)];
          val += pv * part * (0.4 + 0.6 * lim01((ny + 0.14) * 1.5)) * 3.4;
        }

        /* Deformación bajo el cursor */
        var esTronco = 0, mI = 0, mdx = 0, mdy = 0, mdd = 1;
        if (amp > 0.01) {
          mdx = nx - this.mx; mdy = ny - this.my;
          var dd2 = mdx * mdx + mdy * mdy;
          if (dd2 < PR2 * 6) { mdd = Math.sqrt(dd2) + 1e-4; mI = Math.exp(-dd2 / PR2) * amp; }
        }
        var empuje = mI > 0.02 ? (mI * 0.0028 * Math.sin(mdd * 70 - t * 4)) / mdd : 0;

        if (visible && hayFoto) {
          var ax = nx + IX + Math.sin(ny * 6.5 + t * 0.7) * wrp + mdx * empuje;
          var ay = ny - IY + Math.cos(nx * 5.5 - t * 0.6) * wrp * 0.7 + mdy * empuje;
          var ix = ax * dfc - ay * dfs, iy = ax * dfs + ay * dfc;
          var uu = ix / (IH * IA) + 0.5, vv = iy / IH + 0.5;

          if (uu >= 0 && uu < 1 && vv >= 0 && vv < 1) {
            var su = uu, sv = vv;

            /* La pinza gira sobre su pivote */
            if (pinza > 0.0005) {
              var fwd = SUJETO.dir > 0 ? (uu - SUJETO.pu) : (SUJETO.pu - uu);
              var puerta = lim01((fwd - 0.02) / 0.09);
              var dv0 = vv - SUJETO.pv;
              var tope = dv0 < 0 ? lim01((dv0 + 0.46) / 0.05) : lim01((0.21 - dv0) / 0.045);
              var junta = lim01(Math.abs(dv0) / 0.03);
              var th2 = (dv0 < 0 ? -1 : 1) * puerta * tope * junta * pinza * SUJETO.dir;
              if (th2 !== 0) {
                var du2 = (uu - SUJETO.pu) * IA, dvv = vv - SUJETO.pv;
                var cth = Math.cos(th2), sth = Math.sin(th2);
                su = SUJETO.pu + (du2 * cth - dvv * sth) / IA;
                sv = SUJETO.pv + du2 * sth + dvv * cth;
                su = lim01(su) * 0.999; sv = lim01(sv) * 0.999;
              }
            }

            /* Las patas caminan */
            if (patas > 0.0005 && sv > SUJETO.lv) {
              var lm = lim01((sv - SUJETO.lv) / 0.09) * lim01((0.995 - sv) / 0.05) *
                       (SUJETO.dir > 0 ? lim01((SUJETO.lu - su) / 0.1) : lim01((su - SUJETO.lu) / 0.1));
              if (lm > 0) {
                var ph = paso + su * 8.5;
                su -= Math.sin(ph) * patas * lm;
                sv -= Math.abs(Math.cos(ph)) * patas * lm * 0.45;
                su = lim01(su) * 0.999; sv = lim01(sv) * 0.999;
              }
            }

            var iF = ((sv * this.FH) | 0) * this.FW + ((su * this.FW) | 0);
            var iT = ((vv * this.FH) | 0) * this.FW + ((uu * this.FW) | 0);
            var f = this.campo[iF];
            var hl = this.campoH[iF] * sep;
            var ftv = this.campoT[iT] * OPC.tronco * (hl > 1 ? 0 : 1 - hl);
            if (ftv > f) { f = ftv; esTronco = 1; }
            if (f > 0.02) val = val * (1 - peso * 0.82) + peso * f * (0.93 + 0.07 * amb);
          }
        }

        /* Viñeta */
        var vig = 1.34 - Math.sqrt(nx * nx * 0.48 + ny * ny * 1.05);
        val *= (vig > 1 ? 1 : (vig < 0 ? 0 : vig)) * bri;

        var hh = 0;
        if (mI > 0.02) {
          hh = (Math.sin(gx * 12.9898 + gy * 78.233 + tick * 0.41) * 43758.5453) % 1;
          if (hh < 0) hh += 1;
          val = val * (1 + mI * 0.1);
        }
        if (val < 0.055) continue;

        /* Un pelo de ruido por celda evita que la retícula se vea muerta */
        var jit = (((gx * 7 + gy * 13 + tick) % 5) - 2) * 0.012;
        var vf = Math.pow(val, 0.88) + jit + (mI > 0.02 ? (hh - 0.5) * mI * 0.03 : 0);
        if (vf <= 0.02) continue;
        if (vf > 1) vf = 1;

        var ci = Math.round(vf * gi);
        if (ci < 1) continue;
        var li = Math.round(vf * (NIV - 1));

        ctx.drawImage(
          mI > 0.04 && hh < mI * 0.4 ? atlasCalido : (esTronco ? atlasTenue : atlas),
          ci * tw, li * th, tw, th, px, py, cw, ch
        );
      }
    }

    /* El título sube y se apaga letra a letra */
    if (this.titulo) this.titulo.style.transform = 'translate3d(0,' + (-hero * 90).toFixed(1) + 'px,0)';

    /* Las letras de esquina, las cruces y el "desliza" son HTML, no glifos
       del canvas: no se disuelven solos. Se apagan con el mismo avance para
       que no queden flotando sobre la sección siguiente. */
    this.raiz.style.setProperty('--hud', lim01(1 - hero * 1.6).toFixed(3));

    var N = this.letras.length;
    if (N) {
      var entrada = Math.min(1, ((now || 0) - this.t0) / 1500);
      for (var i = 0; i < N; i++) {
        var q2 = i / N;
        var inA = lim01((entrada * 1.8 - q2 * 0.8) / 0.26);
        var outA = lim01(1 - (hero * 1.55 - q2 * 0.55) / 0.28);
        var a = inA * outA;
        var el = this.letras[i];
        el.style.opacity = a < 0.985 ? a.toFixed(3) : '1';
        el.style.transform = 'translate3d(0,' + ((1 - a) * 26).toFixed(1) + 'px,0)';
      }
    }
  };

  /* ── Arranque ───────────────────────────────────────────────────── */
  function iniciar() {
    var el = document.querySelector('[data-hero]');
    if (el && !el._hero) el._hero = new Hero(el);
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', iniciar)
    : iniciar();
})();
