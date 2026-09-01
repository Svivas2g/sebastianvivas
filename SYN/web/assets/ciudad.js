/* ═══════════════════════════════════════════════════════════════════
   SYN · Ciudad corporativa pixelada
   ───────────────────────────────────────────────────────────────────
   Escena generativa en canvas 2D. Cero assets, cero dependencias.

   Cómo funciona
   ─────────────
   El buffer real es ~1/25 del área visible (pixelSize = 4–5) y se estira
   por CSS con image-rendering:pixelated. De ahí el look pixel-art y el
   costo ridículo: ~2-4% de un core.

   Tres capas superpuestas:
     · fondo  — cielo, skyline, fachadas, calle. Se pinta UNA vez.
     · vida   — ventanas encendidas, nubes, coches, peatones. Cada tick.
     · frente — cornisa inferior. Una vez.

   Dos escenas que alternan con fundido cruzado:
     · torre   — skyline nocturno; cada ventana es una micro-escena
                 (gente en escritorios, dashboards, terminales, videollamadas).
     · oficina — interior de un piso alto mirando hacia la ciudad.

   Uso:  <div data-ciudad></div>
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Paleta de marca SYN — negro + morado ──────────────────────────
     Las claves u1/u2/u3 son los tonos estructurales (bordes, luces,
     reflejos). En el original venían hardcodeados en azul y cian, lo
     que desteñía la escena; aquí se derivan de la marca.            */
  var PAL = {
    skyTop: '#000000', skyA: '#040409', skyB: '#090713', skyC: '#0f0a1e', skyD: '#170f2c',
    glowA: '#20142f', glowB: '#361c54', glowC: '#55278a',
    cityFar: '#08070e', cityFarB: '#0e0c17',
    face2: '#0b0a13', side2: '#050508', edge2: '#2a1e44',
    face3: '#090810', side3: '#030305', edge3: '#31234f',
    glassDark: '#0b0a13', glassRefl: '#171325',
    roomWarm: '#4e3868', roomCool: '#3a3160', ceilWarm: '#8b3dff', ceilCool: '#9a6cff',
    floor: '#1a1530', desk: '#2a2342', bezel: '#070610',
    screen: '#b47bff', scDim: '#6631b8', scHi: '#f4ecff',
    person: '#050409', rim: '#c69bff', ok: '#8b3dff', warn: '#c9a0ff',
    street: '#030207', walk: '#0a0812', head: '#f4ecff', tail: '#8b3dff',
    cloud: '#130f22', cloudLit: '#2a1c42', beacon: '#8b3dff', ledge: '#000000',
    pInt: '#41356a', floorInt: '#0a0812', spill: '#8b3dff',
    mull: '#070610', mullHi: '#2a1e44',
    sillC: '#100c1e', sillHi: '#4a2b80', divC: '#0f0b1c', divHi: '#4a2b80',
    lamp: '#c69bff',
    /* estructurales */
    u1: '#150e28',   /* bordes y sombras frías profundas */
    u2: '#3a2a62',   /* bordes medios, marcos, siluetas */
    u3: '#8b6bd0',   /* reflejos y luces tenues */
    u4: '#c9b0f5',   /* brillos altos */
    verde: '#8b3dff', /* acentos "ok" — en marca son morados */
    verdeOsc: '#2a1650',
    calido: '#a98a6e', /* farolas y tazas: el único guiño cálido */
    calidoHi: '#c9a888',
    sombra: '#000000',
    gris: '#2a2129',
    /* capa flotante */
    cardBg: 'rgba(4,3,8,.86)', cardBd: 'rgba(139,61,255,.38)',
    dotDone: '#8b3dff', dotRun: 'rgba(255,255,255,.45)', dotWarn: '#c9a0ff'
  };

  var TICK_MS = 92;          /* ~10.9 fps — deliberado, refuerza el stop-motion */
  var CICLO_MS = 11000;      /* cuánto dura cada escena antes de cambiar */

  /* ═══════════════════════════════════════════════════════════════════
     CONTENIDO DE LAS TARJETAS
     ───────────────────────────────────────────────────────────────────
     Todo lo que se lee en la capa flotante sale de aquí. Para cambiar
     los textos no hace falta tocar nada más abajo.
     ═══════════════════════════════════════════════════════════════════ */

  var KPIS = [
    { label: 'Ingresos del mes', value: '$128,400', delta: '+12.4%', bars: [3, 5, 4, 6, 8, 7, 9] },
    { label: 'Tickets resueltos', value: '1,284', delta: '+8.1%', bars: [4, 4, 6, 5, 7, 6, 8] },
    { label: 'Costo por lead', value: '$18.20', delta: '−6.3%', bars: [8, 7, 7, 5, 6, 4, 3] },
    { label: 'Tiempo de respuesta', value: '2.4 min', delta: '−31%', bars: [9, 8, 6, 5, 4, 4, 3] }
  ];

  var PROGS = [
    { title: 'Migración de datos', pct: 68, note: 'ETA 12 min' },
    { title: 'Onboarding · Acme', pct: 41, note: '3 de 7 pasos' },
    { title: 'Cierre contable', pct: 92, note: 'Revisión final' },
    { title: 'Índice de documentos', pct: 23, note: '18k archivos' }
  ];

  var MSGS = [
    { who: 'Automatización · Ventas', text: '12 correos de seguimiento listos para enviar.', time: 'hace 2 min' },
    { who: 'Automatización · Datos', text: 'El tablero de ingresos ya está actualizado.', time: 'hace 6 min' },
    { who: 'Automatización · Soporte', text: 'Ticket #4821 escalado a ingeniería.', time: 'hace 9 min' },
    { who: 'Automatización · Finanzas', text: 'Conciliación lista para tu aprobación.', time: 'hace 14 min' }
  ];

  var CHIPS_A = [
    ['12 tareas en curso', 'run'], ['4 procesos automatizados', 'done'],
    ['98.2% uptime', 'done'], ['Sincronizado hace 40 s', 'run']
  ];

  var CHIPS_B = [
    ['3 aprobaciones pendientes', 'warn'], ['2 flujos programados', 'run'],
    ['Backup completado', 'done'], ['1 alerta de costos', 'warn']
  ];

  var STRIPS = [
    [['Activos', '4'], ['En cola', '12'], ['Hoy', '38']],
    [['MRR', '$42k'], ['Churn', '1.2%'], ['NPS', '61']],
    [['Leads', '128'], ['Demos', '24'], ['Cierres', '7']]
  ];

  var CARDS = [
    { dot: 'done', label: 'Completado', strong: 'Reporte de cierre enviado' },
    { dot: 'run', label: 'En ejecución', strong: 'Sincronizando CRM' },
    { dot: 'done', label: 'Completado', strong: 'Tablero de ventas publicado' },
    { dot: 'warn', label: 'Requiere aprobación', strong: 'Pago a proveedor' },
    { dot: 'run', label: 'Compilando', strong: 'Release 4.2' },
    { dot: 'done', label: 'Completado', strong: 'Onboarding de 3 clientes' },
    { dot: 'run', label: 'En vivo', strong: 'Junta de operaciones' },
    { dot: 'warn', label: 'Atención', strong: 'Ticket escalado a soporte' },
    { dot: 'done', label: 'Completado', strong: 'Campaña de correo enviada' }
  ];

  /* Los periodos son primos entre sí a propósito: así las seis tarjetas
     nunca se sincronizan y la escena no cae en un patrón perceptible. */
  var ROT = {
    kpi:   { periodo: 5200, retraso: 2600 },
    prog:  { periodo: 4300, retraso: 3900 },
    msg:   { periodo: 6100, retraso: 5200 },
    chipA: { periodo: 3700, retraso: 1800 },
    chipB: { periodo: 4900, retraso: 4400 },
    strip: { periodo: 7300, retraso: 6800 }
  };

  var PILA_MS = 2900;   /* cada cuánto rota una tarjeta de la pila 3D */
  var SALIDA_MS = 320;  /* cuánto tarda en irse antes de volver con el dato nuevo */

  /* ═════════════════════════════════════════════════════════════════
     Constructor
     ═════════════════════════════════════════════════════════════════ */
  function Ciudad(root) {
    this.root = root;
    this.riel = root.closest('.ciudad-riel');
    this.pal = PAL;
    this.T = 0;
    this.last = 0;
    this.scene = 'torre';
    this.visible = false;
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var mk = function (z) {
      var cv = document.createElement('canvas');
      cv.style.cssText = 'position:absolute;top:0;left:0;z-index:' + z +
        ';image-rendering:pixelated;image-rendering:crisp-edges;will-change:transform';
      cv.setAttribute('aria-hidden', 'true');
      root.appendChild(cv);
      return cv;
    };
    this.bg = mk(0);
    this.life = mk(1);
    this.fg = mk(2);
    this.snap = mk(3);            /* congela el cuadro anterior para el fundido */
    this.snap.style.opacity = '0';
    this.snap.style.pointerEvents = 'none';

    this.montar();
    this.montarUI();
    this.escuchar();

    /* Las tarjetas arrancan solas y no esperan al IntersectionObserver:
       si ese aviso falla o llega tarde se quedarían invisibles para siempre.
       Cuestan seis timers que solo tocan texto, nada comparable al canvas. */
    this.arrancarUI();
  }

  /* ── Utilidades de dibujo ───────────────────────────────────────── */
  Ciudad.prototype.P = function (c, x, y, w, h, col) {
    c.fillStyle = col;
    c.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
  };

  /* Generador congruencial lineal: la ciudad es idéntica en cada carga */
  Ciudad.prototype.rng = function (seed) {
    var s = seed >>> 0;
    return function () { return (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };
  };

  /* Tablero de ajedrez en la costura entre bandas de cielo — dithering 8-bit */
  Ciudad.prototype.dither = function (c, x, y, w, h, col, dens) {
    c.fillStyle = col;
    for (var j = 0; j < h; j++)
      for (var i = 0; i < w; i++)
        if (((i + j) % 2 === 0) && Math.random() < dens) c.fillRect(x + i, y + j, 1, 1);
  };

  Ciudad.prototype.disc = function (c, cx, cy, r, col) {
    c.fillStyle = col;
    for (var dy = -r; dy <= r; dy++) {
      var w = Math.floor(Math.sqrt(Math.max(0, r * r - dy * dy)));
      if (w > 0) c.fillRect(Math.round(cx - w), Math.round(cy + dy), w * 2, 1);
    }
  };

  /* ═════════════════════════════════════════════════════════════════
     Montaje — dimensiona al CONTENEDOR, no al viewport
     ═════════════════════════════════════════════════════════════════ */
  Ciudad.prototype.montar = function () {
    var r = this.root.getBoundingClientRect();
    var ancho = Math.max(320, Math.round(r.width));
    var alto = Math.max(220, Math.round(r.height));
    if (!ancho || !alto) return;

    /* El modelo se define en fracciones de W y H, así que lo que fija la
       escala aparente es cuántas unidades de alto tiene el buffer. Se busca
       H ≈ 190 para que las ventanas queden del tamaño correcto, sea cual sea
       la altura del contenedor. */
    var S = Math.max(2, Math.min(6, Math.round(alto / 190)));
    this.S = S;
    var W = Math.ceil(ancho / S), H = Math.ceil(alto / S);
    this.W = W; this.H = H;

    var cfg = function (cv) {
      cv.width = W; cv.height = H;
      cv.style.width = (W * S) + 'px';
      cv.style.height = (H * S) + 'px';
      var c = cv.getContext('2d');
      c.imageSmoothingEnabled = false;
      c.clearRect(0, 0, W, H);
      return c;
    };
    this.cbg = cfg(this.bg);
    this.clife = cfg(this.life);
    this.cfg2 = cfg(this.fg);

    this.M = this.scene === 'oficina' ? this.buildOficina(W, H) : this.buildTorre(W, H);

    /* Descarta ventanas tapadas por torres de tier superior */
    var TW = this.M.towers;
    this.M.windows = this.M.windows.filter(function (w) {
      return !TW.some(function (t, i) {
        return i > (w.ti === undefined ? -1 : w.ti) && t.tier > 1 &&
          w.x + w.w > t.x && w.x < t.x + t.w && w.y + w.h > t.y && w.y < t.y + t.h;
      });
    });

    /* Perfil de tejado: nubes y avión no se dibujan sobre los edificios */
    var roof = new Int16Array(W).fill(H + 40);
    this.M.towers.forEach(function (t) {
      for (var i = Math.max(0, t.x); i < Math.min(W, t.x + t.w); i++)
        if (t.y < roof[i]) roof[i] = t.y;
    });
    this.M.roof = roof;

    this.paintStatic();
    this.paintLife(this.T);
  };

  /* ═════════════════════════════════════════════════════════════════
     Modelos
     ═════════════════════════════════════════════════════════════════ */
  Ciudad.prototype.addTower = function (M, t) {
    var R = this.rng(t.seed);
    t.ti = M.towers.length;
    M.towers.push(t);
    var sp = t.tier === 3 ? { ww: 11, wh: 8, gx: 5, gy: 6, pad: 5 }
      : t.tier === 2 ? { ww: 5, wh: 4, gx: 3, gy: 4, pad: 2 }
        : { ww: 3, wh: 2, gx: 2, gy: 3, pad: 2 };
    if (t.ww) { sp.ww = t.ww; sp.wh = t.wh; sp.gx = t.gx; sp.gy = t.gy; sp.pad = t.pad; }

    var x0 = t.x + (t.sideW || 0);
    for (var wy = t.y + sp.pad + 2; wy + sp.wh <= t.y + t.h - sp.pad; wy += sp.wh + sp.gy) {
      for (var wx = x0 + sp.pad; wx + sp.ww <= t.x + t.w - sp.pad; wx += sp.ww + sp.gx) {
        var r = R(), dk = t.dark === undefined ? .16 : t.dark;
        /* ruleta de contenido: qué se ve dentro de esa ventana */
        var kind = r < dk ? 'dark' : r < dk + .20 ? 'dash' : r < dk + .38 ? 'code'
          : r < dk + .54 ? 'chat' : r < dk + .68 ? 'call' : r < dk + .80 ? 'phone'
            : r < dk + .92 ? 'meet' : 'plant';
        M.windows.push({
          x: wx, y: wy, w: sp.ww, h: sp.wh, kind: kind,
          seed: (R() * 1e6) | 0, tone: R() < .30 ? 'warm' : 'cool',
          tier: t.tier, ti: t.ti
        });
      }
    }
  };

  Ciudad.prototype.buildTorre = function (W, H) {
    var R = this.rng(31417);
    var HZ = Math.round(H * .805);
    var GR = Math.round(H * .875);
    var M = {
      type: 'torre', W: W, H: H, HZ: HZ, ground: GR,
      towers: [], windows: [], dots: [], links: [], clouds: [], cars: [], peds: [], beacons: []
    };

    /* Skyline lejano: siluetas apiladas con puntos de luz sueltos */
    var x = -4;
    while (x < W + 6) {
      var w = Math.round(W * (.02 + R() * .04)), h = Math.round(H * (.03 + R() * .075));
      M.towers.push({ x: x, y: HZ - h, w: w, h: h + 12, tier: 1 });
      for (var wy = HZ - h + 3; wy < HZ - 2; wy += 3)
        for (var wx = x + 1; wx < x + w - 1; wx += 2)
          if (R() < .32) M.dots.push({ x: wx, y: wy, warm: R() < .5, blink: R() < .06, seed: (R() * 1e5) | 0 });
      x += w + 1 + Math.floor(R() * 3);
    }

    /* Torres de tier medio */
    var self = this;
    [[.155, .05, .195], [.05, .065, .315], [.33, .062, .372], [.005, .085, .585],
    [.08, .075, .655], [.295, .085, .625], [.395, .065, .69]].forEach(function (f, i) {
      var tx = Math.round(W * f[0]), tw = Math.round(W * f[1]), ty = Math.round(H * f[2]);
      self.addTower(M, { x: tx, y: ty, w: tw, h: GR - ty, tier: 2, sideW: i % 2 ? 4 : 0, seed: 700 + i * 37, dark: .26 });
      if (i === 0) {
        M.spire = { x: tx + Math.round(tw * .5), y: ty };
        M.beacons.push({ x: tx + Math.round(tw * .5), y: ty - Math.round(H * .05) - 2, ph: 3 });
      }
      if (i === 2) M.beacons.push({ x: tx + Math.round(tw * .5), y: ty - 5, ph: 9 });
    });

    /* Torre secundaria (izquierda) */
    var mx = Math.round(W * .155), mw = Math.round(W * .175), mt = Math.round(H * .43);
    this.addTower(M, { x: mx, y: mt, w: mw, h: GR - mt, tier: 3, sideW: 5, seed: 2468, dark: .08, ww: 9, wh: 6, gx: 5, gy: 6, pad: 5 });
    M.beacons.push({ x: mx + Math.round(mw * .5), y: mt - 6, ph: 7 });

    /* Rascacielos protagonista */
    var hx = Math.round(W * .455), hw = Math.round(W * .44);
    var htop = Math.round(H * .145), sideW = Math.max(5, Math.round(W * .05));
    var sp = { ww: 12, wh: 9, gx: 5, gy: 7, pad: 6 };
    this.addTower(M, {
      x: hx, y: htop, w: hw, h: GR - htop, tier: 3, sideW: sideW, seed: 555, dark: .05,
      ww: sp.ww, wh: sp.wh, gx: sp.gx, gy: sp.gy, pad: sp.pad
    });
    M.hero = { x: hx, w: hw, y: htop, sideW: sideW, ground: GR, ti: M.towers.length - 1 };

    /* Ventanas del costado en escorzo */
    var SR = this.rng(777);
    for (var wy2 = htop + sp.pad + 2; wy2 + sp.wh <= GR - sp.pad; wy2 += sp.wh + sp.gy) {
      var sx2 = hx + 2, step = [4, 3, 2];
      for (var si = 0; si < step.length; si++) {
        var sw = step[si];
        if (sx2 + sw > hx + sideW - 1) break;
        M.windows.push({
          x: sx2, y: wy2, w: sw, h: sp.wh - 1,
          kind: SR() < .3 ? 'dark' : 'side', seed: (SR() * 1e6) | 0,
          tone: SR() < .4 ? 'warm' : 'cool', tier: 3, ti: M.hero.ti
        });
        sx2 += sw + 2;
      }
    }

    /* Torres de encuadre */
    this.addTower(M, { x: Math.round(W * .885), y: Math.round(H * .02), w: Math.round(W * .19), h: GR - Math.round(H * .02), tier: 3, sideW: 4, seed: 909, dark: .72, ww: 11, wh: 8, gx: 5, gy: 7, pad: 5 });
    this.addTower(M, { x: -Math.round(W * .04), y: Math.round(H * .215), w: Math.round(W * .105), h: H - Math.round(H * .215), tier: 3, sideW: 0, seed: 121, dark: .70, ww: 9, wh: 7, gx: 4, gy: 6, pad: 4 });

    this.linksFor(M, hx + sideW + 6, hw - sideW - 14, htop + 14);

    for (var i2 = 0; i2 < 9; i2++)
      M.clouds.push({ x: R() * W, y: Math.round(H * (.06 + R() * .30)), w: Math.round(W * (.06 + R() * .14)), h: 2 + Math.round(R() * 2), v: .08 + R() * .15 });

    var av = GR + Math.round((H - GR) * .48);
    for (var i3 = 0; i3 < 14; i3++)
      M.cars.push({ x: R() * W, y: av + (R() < .5 ? 0 : 3), v: (R() < .5 ? 1 : -1) * (.5 + R() * .9), len: 2 + Math.round(R() * 2) });
    for (var i4 = 0; i4 < 14; i4++)
      M.peds.push({ x: R() * W, y: GR + Math.round((H - GR) * .22), v: (R() < .5 ? 1 : -1) * (.07 + R() * .1) });

    M.avenue = av;
    M.lobby = { x: hx + sideW, y: GR - Math.round(H * .05), w: hw - sideW, h: Math.round(H * .05) };
    return M;
  };

  Ciudad.prototype.buildOficina = function (W, H) {
    var R = this.rng(24680);
    var M = {
      type: 'oficina', W: W, H: H,
      towers: [], windows: [], dots: [], links: [], clouds: [], cars: [], peds: [], desks: [], beacons: []
    };
    M.ceil = Math.round(H * .115);
    M.sill = Math.round(H * .60);
    M.mullion = Math.max(24, Math.round(W * .135));
    var HZ = Math.round(M.sill - (M.sill - M.ceil) * .14);
    M.HZ = HZ;

    var x = -4;
    while (x < W + 6) {
      var w = Math.round(W * (.018 + R() * .038)), h = Math.round(H * (.03 + R() * .115));
      M.towers.push({ x: x, y: HZ - h, w: w, h: h + 16, tier: 1 });
      for (var wy = HZ - h + 3; wy < HZ + 2; wy += 3)
        for (var wx = x + 1; wx < x + w - 1; wx += 2)
          if (R() < .34) M.dots.push({ x: wx, y: wy, warm: R() < .5, blink: R() < .07, seed: (R() * 1e5) | 0 });
      x += w + 1 + Math.floor(R() * 2);
    }

    for (var i = 0; i < 5; i++)
      M.clouds.push({ x: R() * W, y: Math.round(M.ceil + (HZ - M.ceil) * (.18 + R() * .5)), w: Math.round(W * (.07 + R() * .12)), h: 2, v: .08 + R() * .13 });

    var kinds = ['dash', 'code', 'chat', 'call', 'dash', 'chat'];
    var midW = Math.round(H * .16), frontW = Math.round(H * .235), PC = PAL.pInt;

    [.12, .36, .61, .86].forEach(function (fx, i) {
      M.desks.push({
        x: Math.round(W * fx), base: Math.round(H * (.785 + (i % 2) * .012)), dw: midW,
        kind: kinds[i], seed: 300 + i * 31, dir: i % 2 ? -1 : 1, pc: PC, lamp: i % 2 === 0
      });
    });
    [.265, .79].forEach(function (fx, i) {
      M.desks.push({
        x: Math.round(W * fx), base: Math.round(H * .945), dw: frontW,
        kind: i ? 'code' : 'dash', seed: 700 + i * 53, dir: i ? -1 : 1, pc: PC, lamp: i === 1
      });
    });

    M.stand = { x: Math.round(W * .49), base: Math.round(H * .725), h: Math.round(H * .15), pc: PAL.pInt };
    M.walker = { x: R() * W, base: Math.round(H * .695), h: Math.round(H * .135), v: .16, pc: PAL.pInt };
    M.plant = { x: Math.round(W * .035), base: Math.round(H * .75), h: Math.round(H * .105) };
    M.divider = { y: Math.round(H * .705), h: Math.max(2, Math.round(H * .025)) };
    return M;
  };

  Ciudad.prototype.linksFor = function (M, x0, w, top) {
    var R = this.rng(6161);
    for (var i = 0; i < 3; i++) {
      var lx = x0 + Math.round(R() * Math.max(4, w));
      var y0 = top + 20 + Math.round(R() * 30), y1 = y0 + 26 + Math.round(R() * 34);
      M.links.push({ x: lx, y0: y0, y1: y1, ph: R() });
    }
  };

  /* ═════════════════════════════════════════════════════════════════
     Capa estática
     ═════════════════════════════════════════════════════════════════ */
  Ciudad.prototype.paintStatic = function () {
    var c = this.cbg, f = this.cfg2, M = this.M, p = this.pal;
    if (!c || !M) return;
    var W = M.W, H = M.H, HZ = M.HZ;
    var self = this;

    c.clearRect(0, 0, W, H);
    f.clearRect(0, 0, W, H);

    /* Cielo: 8 bandas + dithering en las costuras */
    var skyBottom = M.type === 'oficina' ? Math.round(HZ * 1.06) : HZ;
    var bands = [[p.skyTop, 0, .20], [p.skyA, .20, .40], [p.skyB, .40, .57], [p.skyC, .57, .71],
    [p.skyD, .71, .80], [p.glowA, .80, .885], [p.glowB, .885, .95], [p.glowC, .95, 1]];
    bands.forEach(function (b) { self.P(c, 0, skyBottom * b[1], W, Math.ceil(skyBottom * (b[2] - b[1])) + 1, b[0]); });
    bands.slice(1).forEach(function (b) { self.dither(c, 0, Math.round(skyBottom * b[1]) - 4, W, 8, b[0], .5); });

    /* Estrellas */
    var SR = this.rng(4242);
    for (var i = 0; i < Math.round(W * .14); i++) {
      var sx = Math.round(SR() * W), sy = Math.round(SR() * skyBottom * .52), v = SR();
      c.globalAlpha = .2 + v * .55;
      this.P(c, sx, sy, 1, 1, v > .8 ? p.u4 : p.u3);
    }
    c.globalAlpha = 1;

    M.towers.filter(function (t) { return t.tier === 1; }).forEach(function (t) {
      self.P(c, t.x, t.y, t.w, t.h, M.type === 'oficina' ? p.cityFarB : p.cityFar);
      self.P(c, t.x, t.y, t.w, 1, p.cityFarB);
    });

    if (M.type === 'oficina') { this.paintOfficeShell(c, f, M, p); return; }

    /* Calle y avenida */
    var GR = M.ground || HZ;
    this.P(c, 0, HZ, W, H - HZ, p.street);
    this.dither(c, 0, HZ, W, 6, p.walk, .5);
    this.P(c, 0, GR, W, 2, p.u1);
    this.P(c, 0, M.avenue - 3, W, 9, p.walk);
    for (var sx2 = 4; sx2 < W; sx2 += 17) this.P(c, sx2, M.avenue - 8, 1, 6, p.u1);
    for (var sx3 = 2; sx3 < W; sx3 += 6) this.P(c, sx3, M.avenue + 1, 3, 1, p.u2);
    for (var g = 0; g < W * (H - GR) * .05; g++)
      this.P(c, Math.random() * W, GR + Math.random() * (H - GR), 1, 1, p.u1);

    /* Fachadas */
    M.towers.filter(function (t) { return t.tier > 1; }).forEach(function (t) {
      var face = t.tier === 3 ? p.face3 : p.face2;
      var side = t.tier === 3 ? p.side3 : p.side2;
      var edge = t.tier === 3 ? p.edge3 : p.edge2;
      self.P(c, t.x, t.y, t.w, t.h, face);
      if (t.sideW) self.P(c, t.x, t.y + 2, t.sideW, t.h, side);
      self.P(c, t.x, t.y, t.w, 2, edge);
      self.P(c, t.x + (t.sideW || 0), t.y, 1, t.h, edge);
      self.P(c, t.x + t.w - 1, t.y, 1, t.h, side);
      if (t.ww) {
        var x0 = t.x + (t.sideW || 0);
        for (var cx = x0 + t.pad - 2; cx < t.x + t.w - 2; cx += t.ww + t.gx) self.P(c, cx, t.y + 2, 2, t.h - 2, edge);
        for (var ry = t.y + t.pad + 2; ry + t.wh < t.y + t.h; ry += t.wh + t.gy) self.P(c, x0, ry + t.wh + 1, t.w - (t.sideW || 0) - 1, 2, side);
        c.globalAlpha = .10;
        self.P(c, x0, t.y + 2, Math.round((t.w - (t.sideW || 0)) * .45), t.h - 2, p.u3);
        c.globalAlpha = 1;
      } else if (t.tier === 3) self.P(c, t.x + Math.round(t.w * .32), t.y - 7, 1, 7, p.u2);
    });

    /* Marcos de ventana */
    M.windows.forEach(function (w) {
      self.P(c, w.x, w.y, w.w, w.h, p.glassDark);
      self.P(c, w.x - 1, w.y - 2, w.w + 2, 2, p.u2);
      self.P(c, w.x - 1, w.y + w.h, w.w + 2, 1, p.u1);
    });

    M.dots.forEach(function (d) { self.P(c, d.x, d.y, 1, 1, d.warm ? p.calido : p.u3); });

    if (M.spire) {
      var mh = Math.round(H * .05);
      this.P(c, M.spire.x, M.spire.y - mh, 1, mh, p.u2);
      this.P(c, M.spire.x - 2, M.spire.y - 3, 5, 3, p.face2);
      this.P(c, M.spire.x - 2, M.spire.y - 3, 5, 1, p.edge2);
    }
    if (M.hero) this.towerExtras(c, M, p);
    this.P(f, 0, Math.round(H * .985), W, H, p.ledge);
  };

  Ciudad.prototype.towerExtras = function (c, M, p) {
    var W = M.W, H = M.H, hero = M.hero, GR = M.ground, L = M.lobby;
    var fx = hero.x + hero.sideW, fw = hero.x + hero.w - fx;

    this.P(c, hero.x - 1, hero.y - 4, hero.w + 2, 4, p.face3);
    this.P(c, hero.x - 1, hero.y - 4, hero.w + 2, 1, p.u2);

    var pw = Math.round(fw * .46), px = fx + Math.round(fw * .26), ph = Math.round(H * .032);
    this.P(c, px, hero.y - 4 - ph, pw, ph, p.face3);
    this.P(c, px, hero.y - 4 - ph, pw, 1, p.edge3);
    this.P(c, px + 2, hero.y - 3 - ph, 3, 2, p.u2);

    var mx = px + Math.round(pw * .62), mh = Math.round(H * .055);
    this.P(c, mx, hero.y - 4 - ph - mh, 1, mh, p.u2);
    hero.mast = { x: mx, y: hero.y - 4 - ph - mh };

    /* Lobby iluminado a pie de torre */
    if (L) {
      this.P(c, L.x, L.y, L.w, L.h, p.roomWarm);
      this.P(c, L.x, L.y, L.w, 1, p.ceilWarm);
      this.P(c, L.x, L.y + L.h - 1, L.w, 1, p.roomWarm);
      for (var cx = L.x + 5; cx < L.x + L.w - 3; cx += Math.max(9, Math.round(L.w / 7)))
        this.P(c, cx, L.y + 1, 2, L.h - 2, p.bezel);
      var dw = Math.round(L.w * .17), dx = L.x + Math.round(L.w * .40);
      this.P(c, dx, L.y + 1, dw, L.h - 1, p.screen);
      this.P(c, dx + Math.round(dw / 2), L.y + 1, 1, L.h - 1, p.roomWarm);
      this.P(c, L.x - 4, L.y - 3, L.w + 8, 3, p.side3);
      this.P(c, L.x - 4, L.y - 3, L.w + 8, 1, p.edge3);
      for (var i = 0; i < 4; i++) {
        c.globalAlpha = .16 - i * .035;
        this.P(c, L.x - 6 + i * 2, GR + i * 2, L.w + 12 - i * 4, 2, p.lamp);
      }
      c.globalAlpha = 1;
    }

    /* Farolas */
    var lh = Math.max(4, Math.round((H - GR) * .62)), by = M.avenue - 3;
    for (var lx = 6; lx < W; lx += Math.max(14, Math.round(W * .12))) {
      this.P(c, lx, by - lh, 1, lh, p.face2);
      this.P(c, lx - 1, by - lh - 1, 3, 1, p.lamp);
      c.globalAlpha = .12; this.P(c, lx - 2, by - lh, 5, lh, p.lamp); c.globalAlpha = 1;
    }
  };

  Ciudad.prototype.paintOfficeShell = function (c, f, M, p) {
    var W = M.W, H = M.H, gT = M.ceil, gB = M.sill;
    var self = this;

    c.globalAlpha = .06;
    for (var rx = Math.round(W * .03); rx < W; rx += Math.round(W * .19))
      this.P(c, rx, gT, Math.max(2, Math.round(W * .028)), gB - gT, p.spill);
    c.globalAlpha = 1;

    /* Montantes del ventanal */
    for (var mx = -6; mx < W + M.mullion; mx += M.mullion) {
      this.P(c, mx, gT, 3, gB - gT, p.mull);
      this.P(c, mx, gT, 1, gB - gT, p.mullHi);
    }
    this.P(c, 0, Math.round(gT + (gB - gT) * .30), W, 2, p.mull);

    /* Techo con luminarias */
    this.P(c, 0, 0, W, gT, p.side3);
    this.P(c, 0, gT - 2, W, 2, p.mullHi);
    var sw = Math.round(W * .16);
    for (var lx = Math.round(W * .05); lx < W; lx += Math.round(W * .27)) {
      this.P(c, lx, Math.round(gT * .40), sw, 2, p.ceilCool);
      this.P(c, lx, Math.round(gT * .40) + 2, sw, 1, p.scHi);
      c.globalAlpha = .12;
      this.P(c, lx - 3, Math.round(gT * .40) + 3, sw + 6, Math.round(gT * .55), p.spill);
      c.globalAlpha = 1;
    }

    /* Alféizar y suelo */
    this.P(c, 0, gB, W, 3, p.sillC);
    this.P(c, 0, gB, W, 1, p.sillHi);
    this.P(c, 0, gB + 3, W, H - gB, p.floorInt);
    c.globalAlpha = .13; this.P(c, 0, gB + 3, W, Math.round(H * .07), p.spill); c.globalAlpha = 1;
    c.globalAlpha = .07;
    for (var mx2 = -6; mx2 < W + M.mullion; mx2 += M.mullion)
      this.P(c, mx2 + 4, gB + 3, M.mullion - 7, Math.round(H * .085), p.spill);
    c.globalAlpha = 1;
    this.dither(c, 0, gB + Math.round(H * .07), W, 10, p.mull, .45);
    for (var i = 0; i < W * .5; i++)
      this.P(c, Math.random() * W, gB + 4 + Math.random() * (H - gB - 4), 1, 1, p.glassRefl);

    var dv = M.divider;
    if (dv) {
      this.P(c, 0, dv.y, W, dv.h, p.divC);
      this.P(c, 0, dv.y, W, 1, p.divHi);
      c.globalAlpha = .35; this.P(c, 0, dv.y + dv.h, W, 1, p.sombra); c.globalAlpha = 1;
    }

    var pl = M.plant;
    if (pl) {
      this.P(c, pl.x - 2, pl.base - 3, 5, 3, p.u1);
      this.P(c, pl.x, pl.base - pl.h, 1, pl.h - 2, p.verdeOsc);
      this.disc(c, pl.x - 1, pl.base - pl.h + 2, Math.max(2, Math.round(pl.h * .28)), p.verdeOsc);
      this.disc(c, pl.x + 2, pl.base - pl.h + Math.round(pl.h * .35), Math.max(1, Math.round(pl.h * .22)), p.u2);
    }
    this.P(f, 0, H - Math.max(2, Math.round(H * .012)), W, H, p.ledge);
  };

  /* ═════════════════════════════════════════════════════════════════
     Capa animada
     ═════════════════════════════════════════════════════════════════ */
  Ciudad.prototype.paintLife = function (T) {
    var c = this.clife, M = this.M, p = this.pal;
    if (!c || !M) return;
    var W = M.W, H = M.H, self = this;
    c.clearRect(0, 0, W, H);

    var office = M.type === 'oficina';
    var roof = M.roof;
    var skyB = office ? M.sill : M.HZ;

    /* Nubes */
    M.clouds.forEach(function (cl) {
      var x0 = (cl.x + T * cl.v) % (W + 90) - 45;
      var lit = cl.y > skyB * .70;
      for (var i = 0; i < cl.w; i++) {
        var cx = Math.round(x0 + i);
        if (cx < 0 || cx >= W) continue;
        if (roof && cl.y + cl.h + 2 >= roof[cx]) continue;
        if (office && (cl.y < M.ceil + 3 || cl.y + cl.h > M.sill - 4)) continue;
        var f = Math.min(i, cl.w - 1 - i) / (cl.w * .40);
        var hh = Math.max(1, Math.round(cl.h * Math.min(1, f)));
        self.P(c, cx, cl.y + cl.h - hh, 1, hh, lit ? p.cloudLit : p.cloud);
        if (f > .9 && i % 3 !== 0) self.P(c, cx, cl.y + cl.h - hh - 1, 1, 1, p.cloud);
        if (lit && hh === cl.h) self.P(c, cx, cl.y + cl.h, 1, 1, p.u2);
      }
    });

    if (office) {
      for (var mx = -6; mx < W + M.mullion; mx += M.mullion) {
        this.P(c, mx, M.ceil, 3, M.sill - M.ceil, p.u1);
        this.P(c, mx, M.ceil, 1, M.sill - M.ceil, p.u2);
      }
      this.P(c, 0, Math.round(M.ceil + (M.sill - M.ceil) * .34), W, 2, p.u1);
    } else {
      /* Avión cruzando el cielo */
      var px = (T * .22) % (W + 60) - 30;
      var pxi = Math.round(px);
      if (pxi > 0 && pxi < W && (!roof || roof[pxi] > H * .16)) {
        this.P(c, px, Math.round(H * .13), 2, 1, p.u3);
        if (T % 10 < 4) this.P(c, px + 2, Math.round(H * .13), 1, 1, p.beacon);
      }
    }

    M.dots.forEach(function (d) {
      if (d.blink && ((T + d.seed) >> 2) % 7 === 0) self.P(c, d.x, d.y, 1, 1, p.u1);
    });

    M.windows.forEach(function (w) { self.drawWindow(c, w, T, p); });

    /* Ascensores subiendo por la torre */
    M.links.forEach(function (l) {
      for (var k = 0; k < 2; k++) {
        var t = ((T * .012) + l.ph + k * .5) % 1;
        var y = l.y0 + (l.y1 - l.y0) * t;
        c.globalAlpha = .55; self.P(c, l.x, y, 1, 2, p.screen); c.globalAlpha = 1;
      }
    });

    M.beacons.forEach(function (b) { if ((T + b.ph) % 14 < 5) self.P(c, b.x, b.y, 1, 1, p.beacon); });
    if (M.hero && M.hero.mast && (T % 16) < 6) this.P(c, M.hero.mast.x, M.hero.mast.y, 1, 1, p.beacon);

    /* Siluetas entrando y saliendo del lobby */
    if (M.lobby) {
      var L = M.lobby, hh2 = Math.max(3, Math.round(L.h * .52)), span = L.w + 12;
      for (var i2 = 0; i2 < 6; i2++) {
        var v = (i2 % 2 ? .11 : -.14) - i2 * .006;
        var x = L.x + (((i2 * 29 + T * v) % span) + span) % span - 6;
        this.P(c, x, L.y + L.h - hh2, 1, hh2, p.gris);
        this.P(c, x, L.y + L.h - hh2 - 1, 1, 1, p.gris);
      }
    }

    if (M.type !== 'oficina') {
      /* Coches: faros hacia la derecha, pilotos hacia la izquierda */
      M.cars.forEach(function (car) {
        var x = ((car.x + T * car.v) % (W + 24) + W + 24) % (W + 24) - 12;
        self.P(c, x, car.y, car.len, 1, car.v > 0 ? p.head : p.tail);
        c.globalAlpha = .35;
        self.P(c, x + (car.v > 0 ? car.len : -2), car.y, 2, 1, car.v > 0 ? p.head : p.tail);
        c.globalAlpha = 1;
      });
      M.peds.forEach(function (pd, i) {
        var x = ((pd.x + T * pd.v) % (W + 12) + W + 12) % (W + 12) - 6;
        self.P(c, x, pd.y - 3, 1, 2, p.u1);
        self.P(c, x, pd.y - 1, 1, 1, ((T + i) >> 1) % 2 ? p.u1 : p.u2);
      });
    } else {
      this.officeLife(c, M, T, p);
    }
  };

  /* ═════════════════════════════════════════════════════════════════
     Ventanas — cada una es una micro-escena
     ═════════════════════════════════════════════════════════════════ */
  Ciudad.prototype.drawWindow = function (c, wn, T, p) {
    var x = wn.x, y = wn.y, w = wn.w, h = wn.h, kind = wn.kind, tone = wn.tone;

    if (kind === 'dark') {
      this.P(c, x, y, w, h, p.glassDark);
      this.P(c, x + w - 2, y + 1, 1, h - 2, p.glassRefl);
      return;
    }

    var room = tone === 'warm' ? p.roomWarm : p.roomCool;
    c.globalAlpha = .16;
    this.P(c, x - 1, y - 1, w + 2, h + 2, tone === 'warm' ? p.ceilWarm : p.screen);
    c.globalAlpha = 1;
    this.P(c, x, y, w, h, room);
    this.P(c, x, y, w, 1, tone === 'warm' ? p.ceilWarm : p.ceilCool);

    var t = T + (wn.seed % 23);
    if (kind === 'side') {
      this.P(c, x, y + h - 1, w, 1, p.floor);
      this.P(c, x, y + Math.round(h * .55), w, 1, tone === 'warm' ? p.calido : p.u3);
      if ((t >> 2) % 6 !== 0) this.P(c, x + 1, y + h - 3, 1, 2, p.screen);
      return;
    }
    if (w >= 9 && h >= 6) this.bigRoom(c, wn, t, p);
    else if (w >= 5 && h >= 4) this.midRoom(c, wn, t, p);
    else this.P(c, x + 1, y + h - 2, 1, 1, p.screen);
  };

  Ciudad.prototype.bigRoom = function (c, wn, T, p) {
    var x = wn.x, y = wn.y, w = wn.w, h = wn.h, kind = wn.kind;
    var self = this;
    this.P(c, x, y + h - 1, w, 1, p.floor);

    if (kind === 'plant') {
      this.P(c, x + 2, y + h - 4, 1, 3, p.verdeOsc);
      this.P(c, x + 1, y + h - 5, 3, 1, p.u2);
      this.P(c, x + w - 4, y + h - 3, 3, 2, p.desk);
      return;
    }

    /* Sala de reunión: 3 figuras, una se mueve */
    if (kind === 'meet') {
      var tx = x + 2, tw = w - 4, ty = y + h - 4;
      this.P(c, tx, ty, tw, 2, p.desk);
      var bob = (T >> 2) % 3;
      [0, 1, 2].forEach(function (i) {
        var pxx = tx + 1 + i * Math.max(2, Math.floor(tw / 3));
        if (pxx + 1 >= x + w - 1) return;
        self.P(c, pxx, ty - 3 - (i === bob ? 1 : 0), 2, 2, p.person);
      });
      this.P(c, x + w - 3, y + 1, 2, h - 6, p.u2);
      return;
    }

    /* Persona de pie hablando por teléfono */
    if (kind === 'phone') {
      var px = x + Math.round(w * .55);
      this.P(c, px, y + h - 7, 2, 2, p.person);
      this.P(c, px - 1, y + h - 5, 3, 4, p.person);
      var on = (T % 34) < 22;
      this.P(c, px + 2, y + h - 5, 1, 2, on ? p.screen : p.scDim);
      if ((T % 34) < 5) this.P(c, px + 3, y + h - 7, 1, 1, p.ok);
      this.P(c, x + 1, y + h - 3, 3, 2, p.desk);
      return;
    }

    /* Escritorio con monitor y persona */
    var dy = y + h - 3, dx = x + 1, dw = w - 3;
    this.P(c, dx, dy, dw, 1, p.desk);
    var sw = Math.min(6, w - 5), sh = Math.min(4, h - 4);
    var sx = dx + 1, sy = dy - sh - 1;
    this.P(c, sx - 1, sy - 1, sw + 2, sh + 2, p.bezel);
    this.P(c, sx, sy, sw, sh, p.scDim);
    this.screen(c, sx, sy, sw, sh, kind, T, p);
    this.P(c, sx, dy - 1, sw, 1, p.bezel);
    var hx = x + w - 4, hy = dy - 5;
    this.P(c, hx, hy, 2, 2, p.person);
    this.P(c, hx - 1, hy + 2, 3, 3, p.person);
    this.P(c, hx - 1, hy, 1, 4, p.rim);
    this.P(c, hx - 2, hy + 3 + ((T >> 1) % 2), 1, 1, p.person);
    this.P(c, sx, dy, sw - 1, 1, p.u2);
  };

  Ciudad.prototype.midRoom = function (c, wn, T, p) {
    var x = wn.x, y = wn.y, w = wn.w, h = wn.h, kind = wn.kind;
    this.P(c, x, y + h - 1, w, 1, p.floor);
    this.P(c, x + 1, y + h - 2, w - 2, 1, p.desk);

    if (kind === 'meet' || kind === 'plant') {
      this.P(c, x + 1, y + h - 4, 1, 2, p.person);
      this.P(c, x + 3, y + h - 4, 1, 2, p.person);
      return;
    }
    var sx = x + 1, sy = y + h - 4;
    var on = kind === 'code' ? ((T >> 2) % 9 !== 0) : true;
    this.P(c, sx, sy, 2, 2, on ? p.screen : p.scDim);
    if (kind === 'dash' && (T >> 2) % 2) this.P(c, sx, sy, 1, 1, p.scHi);
    if (kind === 'chat' && (T >> 3) % 3 === 0) this.P(c, sx + 1, sy - 1, 1, 1, p.ok);
    this.P(c, x + w - 2, sy, 1, 3, p.person);
    this.P(c, x + w - 3, sy + 1 + ((T >> 1) % 2), 1, 1, p.person);
  };

  /* Contenido de los monitores */
  Ciudad.prototype.screen = function (c, x, y, w, h, kind, T, p) {
    /* Dashboard: barras sinusoidales */
    if (kind === 'dash') {
      this.P(c, x, y + h - 1, w, 1, p.u2);
      var n = Math.max(2, Math.floor((w - 1) / 2));
      for (var i = 0; i < n; i++) {
        var v = Math.round((Math.sin(T * .15 + i * 1.15) * .5 + .5) * (h - 3)) + 1;
        this.P(c, x + 1 + i * 2, y + h - 1 - v, 1, v, i % 2 ? p.screen : p.scHi);
      }
      if (h >= 6 && w >= 8) {
        this.P(c, x + 1, y + 1, Math.max(2, Math.round(w * .35)), 1, p.scHi);
        this.P(c, x + 1, y + 3, Math.max(2, Math.round(w * .2)), 1, p.u3);
      }
      return;
    }

    /* Terminal: líneas de código con scroll — cada 72 ticks, "build passed" */
    if (kind === 'code') {
      if ((T % 72) < 5) {
        this.P(c, x, y, w, h, p.ok);
        if (w >= 8) this.P(c, x + 2, y + Math.floor(h / 2), Math.max(2, w - 4), 1, p.verdeOsc);
        return;
      }
      this.P(c, x, y, 1, h, p.u2);
      for (var r = 0; r < h; r++) {
        var nn = ((r + (T >> 2)) * 2654435761) % 97;
        var len = 1 + (nn % Math.max(1, w - 2));
        this.P(c, x + 2, y + r, len, 1, r % 3 === 0 ? p.scHi : p.screen);
        if (len + 3 < w && r % 4 === 1) this.P(c, x + 2 + len + 1, y + r, 1, 1, p.verde);
      }
      if ((T >> 2) % 2) this.P(c, x + w - 1, y + h - 1, 1, 1, p.scHi);
      return;
    }

    /* Chat: burbujas que se acumulan alternando lado */
    if (kind === 'chat') {
      var rows = Math.max(1, Math.floor(h / 2)), n2 = 1 + ((T >> 3) % rows);
      for (var r2 = 0; r2 < n2; r2++) {
        var left = r2 % 2 === 0, yy = y + r2 * 2;
        var len2 = Math.max(2, w - 4 - (r2 % 3));
        this.P(c, left ? x + 2 : x + w - len2, yy, len2, 1, left ? p.screen : p.scHi);
        this.P(c, left ? x : x + w - 1, yy, 1, 1, left ? p.verde : p.calidoHi);
      }
      if ((T >> 2) % 4 === 0) this.P(c, x + w - 2, y + h - 1, 1, 1, p.scHi);
      return;
    }

    /* Videollamada: dos participantes, el que habla se ilumina */
    if (kind === 'call') {
      var half = Math.floor(w / 2), spk = (T >> 3) % 2;
      this.P(c, x, y, half, h, spk === 0 ? p.screen : p.u3);
      this.P(c, x + half + 1, y, w - half - 1, h, spk === 1 ? p.screen : p.u3);
      this.disc(c, x + Math.round(half / 2), y + Math.round(h * .42), Math.max(1, Math.round(h * .22)), p.bezel);
      this.disc(c, x + half + Math.round((w - half) / 2), y + Math.round(h * .42), Math.max(1, Math.round(h * .22)), p.bezel);
      this.P(c, x + half, y, 1, h, p.u1);
      var sx2 = spk === 0 ? x : x + half + 1, sw2 = spk === 0 ? half : w - half - 1;
      this.P(c, sx2, y, sw2, 1, p.scHi);
      return;
    }
    this.P(c, x, y, w, h, p.screen);
  };

  /* ═════════════════════════════════════════════════════════════════
     Escena interior
     ═════════════════════════════════════════════════════════════════ */
  Ciudad.prototype.desk = function (c, d, T, p) {
    var x = d.x, base = d.base, dw = d.dw, kind = d.kind, dir = d.dir;
    var pc = d.pc || p.person;
    var t = T + (d.seed % 23);
    var dh = Math.max(2, Math.round(dw * .07)), x0 = Math.round(x - dw / 2);
    var legH = Math.max(3, Math.round(dw * .32));

    c.globalAlpha = .3; this.P(c, x0 - 1, base + dh + legH, dw + 2, 1, p.sombra); c.globalAlpha = 1;
    this.P(c, x0 + 2, base + dh, 1, legH, p.u1);
    this.P(c, x0 + dw - 3, base + dh, 1, legH, p.u1);
    this.P(c, x0, base, dw, dh, p.desk);
    this.P(c, x0, base, dw, 1, p.u2);

    var mw = Math.max(6, Math.round(dw * .44)), mh = Math.max(4, Math.round(dw * .30));
    var mx = dir > 0 ? x0 + Math.round(dw * .05) : x0 + dw - Math.round(dw * .05) - mw;
    var my = base - mh - Math.max(2, Math.round(dw * .08));
    c.globalAlpha = .16; this.P(c, mx - 3, my - 3, mw + 6, mh + 9, p.screen); c.globalAlpha = 1;
    this.P(c, mx - 1, my - 1, mw + 2, mh + 2, p.bezel);
    this.P(c, mx, my, mw, mh, p.scDim);
    this.screen(c, mx, my, mw, mh, kind, t, p);
    this.P(c, mx + Math.round(mw / 2) - 1, my + mh + 1, 2, Math.max(1, base - my - mh - 1), p.bezel);

    var kw = Math.max(3, Math.round(dw * .24));
    var kx = dir > 0 ? mx + mw + Math.round(dw * .06) : mx - kw - Math.round(dw * .06);
    this.P(c, kx, base - 1, kw, 1, p.u2);

    var pxp = dir > 0 ? x0 + dw - Math.round(dw * .24) : x0 + Math.round(dw * .24);
    var hr = Math.max(1, Math.round(dw * .09));
    var tw = Math.max(4, Math.round(dw * .34)), th = Math.max(4, Math.round(dw * .30));
    var ty = base - 1 - th, hy = ty - hr * 2 - 1;
    var cbx = dir > 0 ? pxp + Math.round(tw / 2) : pxp - Math.round(tw / 2) - 3;

    this.P(c, cbx, ty - 1, 3, th + Math.max(2, Math.round(dw * .12)), p.bezel);
    this.P(c, cbx + (dir > 0 ? 2 : 0), ty - 1, 1, th + 2, p.desk);
    this.P(c, pxp - Math.round(tw / 2), ty + 1, tw, th - 1, pc);
    this.P(c, pxp - Math.round(tw / 2) + 1, ty, tw - 2, 2, pc);
    this.disc(c, pxp, hy + hr, hr, pc);

    var bob = (t >> 1) % 2;
    var ax = dir > 0 ? pxp - Math.round(tw / 2) - Math.round(dw * .13) : pxp + Math.round(tw / 2);
    this.P(c, ax, base - 2 + bob, Math.max(2, Math.round(dw * .14)), 1, pc);
    var rx = dir > 0 ? pxp - Math.round(tw / 2) - 1 : pxp + Math.round(tw / 2);
    this.P(c, rx, hy, 1, th + hr * 2 + 1, p.rim);
    this.P(c, pxp - hr, hy, hr * 2, 1, p.ceilCool);

    /* Taza de café */
    if (dw > 22) {
      var cux = dir > 0 ? mx + mw + 3 : mx - 4;
      this.P(c, cux, base - 3, 2, 3, p.calido);
      this.P(c, cux, base - 4, 2, 1, p.calidoHi);
    }
    /* Lámpara de escritorio */
    if (d.lamp) {
      var lx = dir > 0 ? x0 + 2 : x0 + dw - 3, lh = Math.max(3, Math.round(dw * .30));
      this.P(c, lx, base - lh, 1, lh, p.desk);
      this.P(c, lx - 1, base - lh - 1, 3, 1, p.lamp);
      c.globalAlpha = .13; this.P(c, lx - 3, base - lh, 7, lh, p.lamp); c.globalAlpha = 1;
    }
    c.globalAlpha = .10; this.P(c, mx, base + dh + legH + 1, mw, 2, p.screen); c.globalAlpha = 1;
  };

  Ciudad.prototype.officeLife = function (c, M, T, p) {
    var W = M.W, s = M.stand, wk = M.walker, self = this;

    /* Persona caminando de fondo */
    if (wk) {
      var span = W + 34, x = ((wk.x + T * wk.v) % span + span) % span - 17;
      var hh = wk.h, hr = Math.max(1, Math.round(hh * .15)), st = (T >> 1) % 2;
      var wc = wk.pc || p.pInt;
      this.disc(c, x, wk.base - hh + hr, hr, wc);
      this.P(c, x - Math.round(hh * .15), wk.base - hh + hr * 2, Math.max(3, Math.round(hh * .30)), Math.round(hh * .42), wc);
      this.P(c, x - 1 - st, wk.base - Math.round(hh * .34), 1, Math.round(hh * .34), wc);
      this.P(c, x + 1 + st, wk.base - Math.round(hh * .34), 1, Math.round(hh * .34), wc);
      this.P(c, x - hr, wk.base - hh, hr * 2, 1, p.u2);
    }

    /* Persona de pie con teléfono */
    if (s) {
      var hr2 = Math.max(1, Math.round(s.h * .15)), sc = s.pc || p.person;
      this.disc(c, s.x, s.base - s.h + hr2, hr2, sc);
      this.P(c, s.x - Math.round(s.h * .15), s.base - s.h + hr2 * 2, Math.max(3, Math.round(s.h * .30)), Math.round(s.h * .44), sc);
      this.P(c, s.x - Math.round(s.h * .09), s.base - Math.round(s.h * .36), 1, Math.round(s.h * .36), sc);
      this.P(c, s.x + Math.round(s.h * .07), s.base - Math.round(s.h * .36), 1, Math.round(s.h * .36), sc);
      var on = (T % 42) < 27;
      this.P(c, s.x + Math.round(s.h * .17), s.base - Math.round(s.h * .50), 1, 2, on ? p.screen : p.scDim);
      if ((T % 42) < 5) this.P(c, s.x + Math.round(s.h * .22), s.base - Math.round(s.h * .62), 1, 1, p.ok);
      this.P(c, s.x - Math.round(s.h * .13), s.base - s.h + hr2, 1, Math.round(s.h * .5), p.rim);
    }

    M.desks.forEach(function (d) { self.desk(c, d, T, p); });
  };

  /* ═════════════════════════════════════════════════════════════════
     Cambio de escena con fundido cruzado
     ═════════════════════════════════════════════════════════════════ */
  Ciudad.prototype.congelar = function () {
    var cv = this.snap, src = this.bg;
    if (!cv || !src || this.reduced) return;
    cv.width = src.width; cv.height = src.height;
    cv.style.width = src.style.width; cv.style.height = src.style.height;
    this._extra = '';
    cv.style.transform = src.style.transform || '';
    var c = cv.getContext('2d');
    c.imageSmoothingEnabled = false;
    c.clearRect(0, 0, cv.width, cv.height);
    [this.bg, this.life, this.fg].forEach(function (l) { c.drawImage(l, 0, 0); });
    cv.style.transition = 'none';
    cv.style.opacity = '1';
  };

  /* La capa nueva entra rápido y la vieja se sostiene y cae al final,
     así el brillo total no se hunde a mitad del fundido. */
  Ciudad.prototype.aparecer = function (desde) {
    if (this.reduced) return;
    var cv = this.snap;
    var saliendo = desde === 'oficina';   /* el interior es mucho más brillante */
    /* Al ENTRAR al piso 23 el fundido va corto a propósito: el tramo de riel
       que queda por delante es finito y un fundido de 1,3 s se comía casi todo
       el tiempo en que la escena debería estar ya a plena vista. Al SALIR sigue
       lento, que ahí sí sobra recorrido y el interior es mucho más brillante. */
    var inMs = saliendo ? 1700 : 420, outMs = saliendo ? 2200 : 600;
    var capas = [this.bg, this.life, this.fg];
    var self = this;

    capas.forEach(function (l) { l.style.transition = 'none'; l.style.opacity = '0'; });

    /* Reflow forzado: obliga al navegador a dar por buena la opacidad 0 ANTES
       de pedirle la transición, que es lo único que hacía falta.
       Antes esto se resolvía con dos requestAnimationFrame encadenados, y ahí
       estaba el fallo de "se pierde el piso 23": hasta que esos dos cuadros no
       llegaban, las capas seguían en opacidad 0 con la foto de la escena
       anterior (snap, z-index 3) tapándolo todo. Si los cuadros se retrasaban
       —pestaña en segundo plano, scroll rápido, cuadros descartados— la escena
       nueva no aparecía nunca y te quedabas mirando una torre congelada.
       Un reflow es síncrono: no depende del planificador de cuadros. */
    void this.bg.offsetWidth;

    capas.forEach(function (l, i) {
      l.style.transition = 'opacity ' + inMs + 'ms cubic-bezier(.16,.72,.34,1) ' + (i * (saliendo ? 130 : 35)) + 'ms';
      l.style.opacity = '1';
    });
    if (cv) {
      cv.style.transition = 'opacity ' + outMs + 'ms ' +
        (saliendo ? 'cubic-bezier(.32,.06,.44,1)' : 'cubic-bezier(.55,.06,.78,.34)') +
        ', transform ' + (outMs + 300) + 'ms cubic-bezier(.22,.62,.24,1)';
      cv.style.opacity = '0';
      if (saliendo) {
        self._extra = ' scale(1.07)';
        cv.style.transform = (self.bg.style.transform || '') + self._extra;
      }
    }

    /* Red de seguridad. Si una transición se pierde por lo que sea, esto deja
       la escena visible igual: nunca se vuelve a quedar la foto encima. */
    clearTimeout(this._red);
    this._red = setTimeout(function () {
      capas.forEach(function (l) { l.style.opacity = '1'; });
      if (cv) cv.style.opacity = '0';
    }, Math.max(inMs, outMs) + 400);
  };

  Ciudad.prototype.cambiarEscena = function () {
    this.irA(this.scene === 'torre' ? 'oficina' : 'torre');
  };

  Ciudad.prototype.irA = function (escena) {
    if (escena === this.scene || this._cambiando) return;
    var desde = this.scene;
    this.scene = escena;

    /* Reconstruir la escena es caro (el cielo se pinta entero con dithering).
       El cerrojo evita encadenar montajes si el scroll cruza el umbral rápido.
       Dura más que el fundido de entrada (600 ms) a propósito: congelar() copia
       los bitmaps ignorando la opacidad CSS que aún se está animando, así que
       revertir a media transición daría un fogonazo. Cubriendo el fundido
       entero, ese caso no se alcanza. */
    this._cambiando = true;
    var self = this;
    setTimeout(function () { self._cambiando = false; }, 700);

    this.congelar();
    this.montar();
    this.aparecer(desde);
    this.marcarEscena();
  };

  Ciudad.prototype.marcarEscena = function () {
    var marcas = this.root.querySelectorAll('[data-escena]');
    var self = this;
    /* La escena viva también se anota en la raíz: el CSS la necesita para
       apartar las tarjetas flotantes de la banda baja del lienzo, que en el
       piso 23 es justo donde están los escritorios. */
    this.root.setAttribute('data-escena-activa', this.scene);
    Array.prototype.forEach.call(marcas, function (m) {
      if (m.getAttribute('data-escena') === self.scene) m.setAttribute('data-activa', '');
      else m.removeAttribute('data-activa');
    });
  };

  /* ═════════════════════════════════════════════════════════════════
     Escena gobernada por el scroll
     ───────────────────────────────────────────────────────────────────
     El riel mide cuánto has recorrido: 0 al entrar, 1 al salir. Pronto
     se cruza al interior — el piso 23 se lleva la mayor parte del tramo
     pegado, porque es lo que cuesta apreciar. Los dos umbrales no coinciden a
     propósito (histéresis): si fueran el mismo, quedarse justo encima
     haría parpadear las escenas sin parar.

     OJO con el valor de estos dos: se miden sobre `recorrido` (alto del riel
     menos el viewport), NO sobre el tramo en que el lienzo está pegado. Como
     el riel arranca pegado 11vh antes de que p valga 0, un 0.20 aquí equivale
     al 28% del tramo congelado real. Por eso los números parecen bajos.
     UMBRAL_SALE tiene que ser > 0: progresoRiel recorta a [0,1], así que con
     0 la condición `p < SALE` no se cumple nunca y no se volvería a la torre.
     ═════════════════════════════════════════════════════════════════ */
  var UMBRAL_ENTRA = 0.16;   /* bajando: a partir de aquí, piso 23 */
  var UMBRAL_SALE  = 0.02;   /* subiendo: por debajo de aquí, torre */

  /* p = fracción del tramo en que el lienzo está PEGADO, no del riel entero.
     Antes se medía contra `alto del riel − viewport`, que es otra cosa: el
     lienzo empieza a pegar bastante antes de que ese cálculo valga 0, así que
     un umbral de 0.20 caía en realidad al 28% del tramo pegado y adelantarlo
     obligaba a estrechar la histéresis hasta hacerla inestable.
     Medido así, 0.16 significa exactamente eso: el 16% del tiempo que el
     lienzo pasa congelado en pantalla. Y de paso desaparece la deriva de
     móvil, donde `vh` (viewport grande) e `innerHeight` (viewport visual con
     la barra de direcciones puesta) no coinciden: ahora numerador y
     denominador salen los dos del mismo sistema de unidades. */
  Ciudad.prototype.progresoRiel = function () {
    var r = this.riel.getBoundingClientRect();
    var alto = this.root.offsetHeight;                 /* alto del lienzo */
    var recorrido = r.height - alto;                   /* el tramo pegado exacto */
    if (recorrido <= 0) return 0;
    /* Dónde empieza a pegar: el `top` resuelto del sticky, leído del CSS para
       no repetir aquí el calc() de la hoja de estilos. */
    var top0 = parseFloat(window.getComputedStyle(this.root).top);
    if (isNaN(top0)) top0 = (window.innerHeight - alto) / 2;
    return Math.min(1, Math.max(0, (top0 - r.top) / recorrido));
  };

  Ciudad.prototype.revisarScroll = function () {
    var p = this.progresoRiel();
    if (this.scene === 'torre' && p >= UMBRAL_ENTRA) this.irA('oficina');
    else if (this.scene === 'oficina' && p < UMBRAL_SALE) this.irA('torre');
  };

  /* ═════════════════════════════════════════════════════════════════
     Eventos y bucle
     ═════════════════════════════════════════════════════════════════ */
  Ciudad.prototype.escuchar = function () {
    var self = this;

    /* Redimensionado con debounce */
    this._onResize = function () {
      clearTimeout(self._rt);
      self._rt = setTimeout(function () { self.montar(); }, 180);
    };
    window.addEventListener('resize', this._onResize);

    /* Si hay riel, manda el scroll y no el reloj. Va ANTES del corte por
       movimiento reducido: si no, con esa preferencia activa nunca se instala
       el oyente y la escena se queda en la torre para siempre — el piso 23 no
       aparecía jamás por mucho que bajaras. El cambio en sí ya es seguro sin
       movimiento: congelar() y aparecer() se cortan solos y el relevo es
       instantáneo, que es justo lo que esa preferencia pide.
       No se condiciona a que el IntersectionObserver haya marcado la escena
       como visible: ese aviso es asíncrono y llegaría tarde. */
    if (this.riel) {
      this._pendiente = false;
      this._onScroll = function () {
        if (self._pendiente) return;
        self._pendiente = true;
        requestAnimationFrame(function () {
          self._pendiente = false;
          self.revisarScroll();
        });
      };
      window.addEventListener('scroll', this._onScroll, { passive: true });
      this.revisarScroll();   /* por si la página carga ya a media altura */
    }

    if (this.reduced) return;

    /* Parallax de ratón, relativo al contenedor. Solo transform: no repinta. */
    this._onMove = function (e) {
      var r = self.root.getBoundingClientRect();
      var dx = (e.clientX - r.left) / r.width - .5;
      var dy = (e.clientY - r.top) / r.height - .5;
      var t1 = 'translate3d(' + (dx * -9) + 'px,' + (dy * -5) + 'px,0)';
      self.bg.style.transform = t1;
      self.life.style.transform = t1;
      self.fg.style.transform = 'translate3d(' + (dx * -24) + 'px,' + (dy * -11) + 'px,0)';
      if (self.snap.style.opacity !== '0') self.snap.style.transform = t1 + (self._extra || '');
    };
    this.root.addEventListener('mousemove', this._onMove, { passive: true });

    /* Solo anima mientras está en pantalla: fuera, ni un frame. */
    if ('IntersectionObserver' in window) {
      this._io = new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { self.visible = en.isIntersecting; });
        self.visible ? self.arrancar() : self.parar();
      }, { threshold: 0.01 });
      this._io.observe(this.root);
    } else {
      this.visible = true;
      this.arrancar();
    }
  };

  Ciudad.prototype.arrancar = function () {
    this.arrancarUI();
    if (this._raf || this.reduced) return;
    var self = this;
    this._loop = function (ts) {
      self._raf = requestAnimationFrame(self._loop);
      if (ts - self.last < TICK_MS) return;
      self.last = ts;
      self.T++;
      self.paintLife(self.T);
      /* Respaldo del evento scroll: algunos navegadores lo agrupan o lo
         suprimen durante desplazamientos rápidos. Revisar aquí cuesta un
         getBoundingClientRect cada 92 ms y hace el cambio infalible. */
      if (self.riel) self.revisarScroll();
    };
    this._raf = requestAnimationFrame(this._loop);

    /* Con riel manda el scroll; sin él, la escena alterna sola */
    if (this.riel) this.revisarScroll();
    else if (!this._ciclo) this._ciclo = setInterval(function () { self.cambiarEscena(); }, CICLO_MS);
  };

  /* Solo se detiene el canvas, que es lo caro. Las tarjetas siguen. */
  Ciudad.prototype.parar = function () {
    cancelAnimationFrame(this._raf);
    this._raf = null;
    clearInterval(this._ciclo);
    this._ciclo = null;
  };

  /* ═════════════════════════════════════════════════════════════════
     Capa flotante — las tarjetas sobre la ciudad
     ═════════════════════════════════════════════════════════════════ */

  /* Crea un elemento con clase y, opcionalmente, HTML dentro */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }

  function colorPunto(kind) {
    return kind === 'done' ? PAL.dotDone : kind === 'warn' ? PAL.dotWarn : PAL.dotRun;
  }

  Ciudad.prototype.montarUI = function () {
    var capa = el('div', 'cd');
    capa.setAttribute('aria-hidden', 'true');
    this.capa = capa;

    /* KPI */
    this.uiKpi = el('div', 'cd__caja cd__kpi',
      '<div class="cd__label" data-k="label"></div>' +
      '<div class="cd__fila"><div class="cd__valor" data-k="value"></div>' +
      '<div class="cd__delta" data-k="delta"></div></div>' +
      '<div class="cd__barras" data-k="bars"></div>');

    /* Progreso */
    this.uiProg = el('div', 'cd__caja cd__prog',
      '<div class="cd__fila cd__fila--sep"><div class="cd__titulo" data-k="title"></div>' +
      '<div class="cd__pct" data-k="pctTxt"></div></div>' +
      '<div class="cd__pista"><i data-k="barra"></i></div>' +
      '<div class="cd__nota" data-k="note"></div>');

    /* Mensaje de agente */
    this.uiMsg = el('div', 'cd__caja cd__msg',
      '<div class="cd__fila cd__fila--sep"><span class="cd__punto" data-k="dot"></span>' +
      '<span class="cd__quien" data-k="who"></span>' +
      '<span class="cd__hora" data-k="time"></span></div>' +
      '<p class="cd__texto" data-k="text"></p>');

    /* Dos chips píldora */
    var chip = function () {
      return el('div', 'cd__chip',
        '<span class="cd__punto" data-k="dot"></span><span data-k="txt"></span>');
    };
    this.uiChipA = chip(); this.uiChipA.classList.add('cd__chip--a');
    this.uiChipB = chip(); this.uiChipB.classList.add('cd__chip--b');

    /* Strip de 3 métricas */
    this.uiStrip = el('div', 'cd__caja cd__strip');

    /* Pila 3D de tareas */
    this.uiPila = el('div', 'cd__pila');
    this.slots = [];
    for (var i = 0; i < 3; i++) {
      var it = el('div', 'cd__tarea',
        '<span class="cd__punto" data-k="dot"></span>' +
        '<span data-k="label"></span>' +
        '<strong data-k="strong"></strong>');
      it.style.width = 'calc(100% - ' + (i * 6) + 'px)';
      it.style.marginTop = i ? '6px' : '0';
      this.uiPila.appendChild(it);
      this.slots.push({ nodo: it, i: i, fuera: true });
    }

    /* La pila se despliega al pasar el ratón */
    var self = this;
    this.uiPila.addEventListener('mouseenter', function () { self.hover = true; self.pintarPila(); });
    this.uiPila.addEventListener('mouseleave', function () { self.hover = false; self.pintarPila(); });

    [this.uiKpi, this.uiProg, this.uiMsg, this.uiChipA, this.uiChipB, this.uiStrip, this.uiPila]
      .forEach(function (n) { capa.appendChild(n); });
    this.root.appendChild(capa);

    /* Estado de cada rotador: qué índice muestra y si está saliendo */
    this.ui = {
      kpi:   { nodo: this.uiKpi,   i: 0, fuera: true, dx: -16, dy: 8, ry: 5 },
      prog:  { nodo: this.uiProg,  i: 0, fuera: true, dx: -16, dy: 8, ry: 5 },
      msg:   { nodo: this.uiMsg,   i: 0, fuera: true, dx: -18, dy: 10, ry: 4 },
      chipA: { nodo: this.uiChipA, i: 0, fuera: true, dx: -12, dy: 6, ry: 0 },
      chipB: { nodo: this.uiChipB, i: 0, fuera: true, dx: -12, dy: 6, ry: 0 },
      strip: { nodo: this.uiStrip, i: 0, fuera: true, dx: 16, dy: 8, ry: -5 }
    };

    Object.keys(this.ui).forEach(function (k) { self.pintar(k); });
    this.pintarPila();
  };

  /* Coloca una tarjeta según esté entrando o saliendo */
  Ciudad.prototype.situar = function (u) {
    u.nodo.style.opacity = u.fuera ? '0' : '1';
    u.nodo.style.transform = 'perspective(900px) rotateY(' + u.ry + 'deg) translate3d(' +
      (u.fuera ? u.dx : 0) + 'px,' + (u.fuera ? u.dy : 0) + 'px,0)';
  };

  Ciudad.prototype.pintar = function (clave) {
    var u = this.ui[clave], n = u.nodo;
    var q = function (k) { return n.querySelector('[data-k="' + k + '"]'); };

    if (clave === 'kpi') {
      var d = KPIS[u.i % KPIS.length];
      q('label').textContent = d.label;
      q('value').textContent = d.value;
      q('delta').textContent = d.delta;
      q('delta').style.color = PAL.dotDone;
      q('bars').innerHTML = d.bars.map(function (v, i) {
        return '<i style="height:' + (5 + v * 3) + 'px;background:' +
          (i > 4 ? PAL.dotDone : 'rgba(255,255,255,.26)') + '"></i>';
      }).join('');
    } else if (clave === 'prog') {
      var p = PROGS[u.i % PROGS.length];
      q('title').textContent = p.title;
      q('pctTxt').textContent = p.pct + '%';
      q('barra').style.width = p.pct + '%';
      q('note').textContent = p.note;
    } else if (clave === 'msg') {
      var m = MSGS[u.i % MSGS.length];
      q('dot').style.background = PAL.dotRun;
      q('who').textContent = m.who;
      q('time').textContent = m.time;
      q('text').textContent = m.text;
    } else if (clave === 'chipA' || clave === 'chipB') {
      var pool = clave === 'chipA' ? CHIPS_A : CHIPS_B;
      var c = pool[u.i % pool.length];
      q('txt').textContent = c[0];
      q('dot').style.background = colorPunto(c[1]);
    } else if (clave === 'strip') {
      var s = STRIPS[u.i % STRIPS.length];
      n.innerHTML = s.map(function (kv, i) {
        return '<div class="cd__met"' + (i ? ' style="border-left:1px solid ' + PAL.cardBd + '"' : '') + '>' +
          '<div class="cd__label">' + kv[0] + '</div><div class="cd__met-v">' + kv[1] + '</div></div>';
      }).join('');
    }
    this.situar(u);
  };

  Ciudad.prototype.pintarPila = function () {
    var hov = this.hover, self = this;
    this.slots.forEach(function (s, i) {
      var card = CARDS[s.i % CARDS.length];
      var base = 'rotateY(' + (hov ? -4 : -11) + 'deg) rotateX(' + (hov ? 1 : 3) +
        'deg) translateZ(' + (hov ? 0 : i * -14) + 'px)';
      s.nodo.style.opacity = s.fuera ? '0' : '1';
      s.nodo.style.transform = s.fuera ? base + ' translate3d(28px,12px,-40px)' : base;
      s.nodo.querySelector('[data-k="dot"]').style.background = colorPunto(card.dot);
      s.nodo.querySelector('[data-k="label"]').textContent = card.label;
      s.nodo.querySelector('[data-k="strong"]').textContent = card.strong;
      void self;
    });
  };

  /* Arranca los seis rotadores + la pila, cada uno con su propio compás */
  Ciudad.prototype.arrancarUI = function () {
    var self = this;
    if (this._timers) return;
    this._timers = [];

    /* Entrada escalonada al aparecer */
    Object.keys(this.ui).forEach(function (k, i) {
      self._timers.push(setTimeout(function () {
        self.ui[k].fuera = false;
        self.situar(self.ui[k]);
      }, 300 + i * 110));
    });
    this.slots.forEach(function (s, i) {
      self._timers.push(setTimeout(function () { s.fuera = false; self.pintarPila(); }, 240 + i * 130));
    });

    if (this.reduced) return;   /* sin movimiento: se quedan en el primer dato */

    /* Espera puntual que se da de baja sola. Estos timeouts nacen dentro de
       intervalos que se repiten toda la sesión: si no se podaran, `_timers`
       acumularía un id por cada rotación y crecería sin fin. */
    var trasUnRato = function (fn, ms) {
      var id = setTimeout(function () {
        var i = self._timers.indexOf(id);
        if (i !== -1) self._timers.splice(i, 1);
        fn();
      }, ms);
      self._timers.push(id);
    };

    Object.keys(ROT).forEach(function (k) {
      var r = ROT[k];
      var paso = function () {
        var u = self.ui[k];
        u.fuera = true; self.situar(u);
        trasUnRato(function () {
          u.i++; u.fuera = false; self.pintar(k);
        }, SALIDA_MS);
      };
      self._timers.push(setTimeout(function () {
        paso();
        self._timers.push(setInterval(paso, r.periodo));
      }, r.retraso));
    });

    this._rotPila = 0;
    this._timers.push(setInterval(function () {
      var k = self._rotPila % 3; self._rotPila++;
      var s = self.slots[k];
      s.fuera = true; self.pintarPila();
      trasUnRato(function () {
        s.i = (s.i + 3) % CARDS.length; s.fuera = false; self.pintarPila();
      }, SALIDA_MS);
    }, PILA_MS));
  };

  Ciudad.prototype.pararUI = function () {
    if (!this._timers) return;
    this._timers.forEach(function (id) { clearTimeout(id); clearInterval(id); });
    this._timers = null;
  };

  /* ── Arranque automático ────────────────────────────────────────── */
  function iniciar() {
    document.querySelectorAll('[data-ciudad]').forEach(function (el) {
      if (el._ciudad) return;
      el._ciudad = new Ciudad(el);
    });
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', iniciar)
    : iniciar();

  window.SYNCiudad = Ciudad;
})();
