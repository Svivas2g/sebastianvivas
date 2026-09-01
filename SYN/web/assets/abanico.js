/* ═══════════════════════════════════════════════════════════════════
   SYN · Portafolio en abanico
   ───────────────────────────────────────────────────────────────────
   Nueve maquetas de sistema desplegadas en arco, como una mano de
   cartas. La activa queda al centro, erguida y ampliada; las demás
   se abren a los lados rotando y bajando por la curva.

   El mecanismo
   ────────────
   Cada tarjeta cuelga de un "radio": un div de tamaño cero cuyo
   transform-origin está --radio píxeles MÁS ABAJO. Al rotar ese div,
   su punta describe un arco y la tarjeta va anclada a esa punta.
   Todo es 2D: no hay perspective ni translateZ.

   No se redibuja nada nunca. El estado solo escribe custom properties
   y el navegador interpola el resto.

   Interacción: clic, arrastre (ratón y táctil), teclado ← → y avance
   automático que se pausa en cuanto tocas algo.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var OPC = {
    spread: 5.6,        /* grados entre tarjetas */
    curve: 1,           /* multiplicador del radio resuelto */
    autoplay: 4600,     /* ms entre avances; 0 lo desactiva */
    gracia: 9000,       /* pausa tras tocar algo a mano */
    sensibilidad: 0.045,/* grados por píxel arrastrado */

    /* El arco NO se centra del todo sobre la elegida: se queda a este
       porcentaje del camino. Sin esto, al activar un extremo el abanico
       entero gira y las del otro lado se salen de cuadro. */
    amortiguador: 0.85
  };

  function limitar(lo, v, hi) { return Math.max(lo, Math.min(v, hi)); }

  function Abanico(raiz) {
    this.raiz = raiz;
    this.pista = raiz.querySelector('[data-pista]');
    this.radios = [].slice.call(raiz.querySelectorAll('.ab__radio'));
    this.tarjetas = [].slice.call(raiz.querySelectorAll('.ab__tarjeta'));
    this.fichas = [].slice.call(raiz.querySelectorAll('.ab__ficha'));
    this.n = this.tarjetas.length;
    if (!this.n) return;

    this.act = Math.floor(this.n / 2);
    this.drag = 0;
    this.arrastrando = false;
    this.encima = false;
    this.espera = 0;
    this.gesto = { on: false, x0: 0, delta: 0, movio: false, i0: -1, href0: '' };
    this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* Entrada escalonada desde el centro hacia fuera */
    var self = this;
    this.radios.forEach(function (r, i) {
      var env = r.firstElementChild;
      if (env) env.style.animationDelay = (Math.abs(i - self.act) * 0.07) + 's';
    });

    this.medir();
    this.aplicar();
    this.escuchar();
    if (OPC.autoplay && !this.reduced) this.auto();
  }

  /* ═══════════════════════════════════════════════════════════════════
     Geometría
     ───────────────────────────────────────────────────────────────────
     Se resuelve el radio del arco para que TODO quepa en el ancho real
     de la pista. El original medía contra window.innerWidth, lo que
     desborda en cuanto el componente no ocupa la ventana entera.
     ═══════════════════════════════════════════════════════════════════ */
  Abanico.prototype.medir = function () {
    var ancho = this.pista.clientWidth || this.raiz.clientWidth || 1200;
    var movil = ancho <= 760;

    var w = movil ? limitar(66, ancho * 0.135, 104) : limitar(88, ancho * 0.086, 142);
    var wa = movil ? limitar(188, ancho * 0.56, 292) : limitar(220, ancho * 0.205, 356);
    var h = w * 1.6;        /* inactiva: retrato */
    var ha = wa * 0.765;    /* activa: apaisada */

    var paso = movil ? 6.4 : OPC.spread;
    var borde = ((this.n - 1) / 2) * paso * Math.PI / 180;   /* semiapertura */

    var util = ancho - 36;
    var sin = Math.sin(borde), cos = Math.cos(borde);

    /* Una tarjeta rotada ocupa más de lo que mide: w·cos + h·sin */
    var huella = Math.max(w * cos + h * sin, wa * cos + ha * sin);

    /* Se despeja el radio para que 2·radio·sin(borde) + huella entre en útil */
    var radio = limitar(260, ((util - huella) / (2 * sin)) * OPC.curve, 1600);

    var caida = radio * (1 - cos);       /* cuánto baja el extremo del arco */
    var alza = movil ? 20 : 26;          /* cuánto se eleva la activa */

    this.g = {
      w: w, h: h, wa: wa, ha: ha, paso: paso, radio: radio, alza: alza,
      alto: Math.round(alza + Math.max(ha, caida + h) + 56)
    };
  };

  /* ═══════════════════════════════════════════════════════════════════
     Estado → custom properties. Cero redibujado.
     ═══════════════════════════════════════════════════════════════════ */
  Abanico.prototype.aplicar = function () {
    var g = this.g, self = this;
    var mitad = (this.n - 1) / 2;
    var r = this.raiz.style;

    /* El orden importa: la duración va ANTES que el ángulo, o el primer
       frame de un arrastre se interpolaría con la transición larga. */
    r.setProperty('--tr', this.arrastrando ? '0s' : (this.suave ? '1.5s' : '.72s'));
    r.setProperty('--drag', this.drag.toFixed(3) + 'deg');
    r.setProperty('--paso', g.paso + 'deg');
    r.setProperty('--radio', Math.round(g.radio) + 'px');
    r.setProperty('--alza', g.alza + 'px');
    r.setProperty('--alto', g.alto + 'px');
    r.setProperty('--cur', this.arrastrando ? 'grabbing' : 'grab');
    r.setProperty('--act', (mitad + (this.act - mitad) * OPC.amortiguador).toFixed(3));

    this.tarjetas.forEach(function (t, i) {
      var on = i === self.act;
      /* --a, --cw y --ch viven en la tarjeta, no en la raíz: así una sola
         regla :hover sirve para las nueve en vez de una por índice. */
      t.style.setProperty('--a', on ? 1 : 0);
      t.style.setProperty('--cw', Math.round(on ? g.wa : g.w) + 'px');
      t.style.setProperty('--ch', Math.round(on ? g.ha : g.h) + 'px');
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      self.radios[i].style.zIndex = 100 - Math.abs(i - self.act);
      if (self.fichas[i]) {
        self.fichas[i].style.setProperty('--a', on ? 1 : 0);
        self.fichas[i].setAttribute('aria-hidden', on ? 'false' : 'true');
      }
    });
  };

  Abanico.prototype.ir = function (i, suave) {
    var nuevo = limitar(0, i, this.n - 1);
    if (nuevo === this.act && !suave) return;
    this.act = nuevo;
    this.suave = !!suave;
    if (!suave) this.espera = Date.now() + OPC.gracia;
    this.aplicar();
  };

  Abanico.prototype.auto = function () {
    var self = this;
    this._t = setInterval(function () {
      if (self.encima || self.gesto.on || Date.now() < self.espera) return;
      self.ir((self.act + 1) % self.n, true);
    }, OPC.autoplay);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Eventos — uno por tipo, con delegación sobre la pista
     ═══════════════════════════════════════════════════════════════════ */
  Abanico.prototype.escuchar = function () {
    var self = this, p = this.pista;

    p.addEventListener('pointerenter', function () { self.encima = true; });
    p.addEventListener('pointerleave', function () { self.encima = false; });

    p.addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      if (self.gesto.movio) return;             /* un arrastre no es un clic */
      /* El target del click es la pista, no la tarjeta (ver el pointerdown):
         se recurre a lo anotado allí y solo se usa el target si sirve. */
      var el = e.target.closest('[data-i]');
      var i = el ? Number(el.dataset.i) : self.gesto.i0;
      var href = el ? (el.dataset.href || '') : self.gesto.href0;
      if (i < 0 || isNaN(i)) return;
      /* Segundo clic sobre la que ya está activa: abre el destino del caso.
         Puede ser un ancla de la propia página o un enlace externo (hoy es la
         conversación de WhatsApp con el texto ya escrito para ese proyecto). */
      if (i === self.act && href) {
        if (href.charAt(0) === '#') {
          var destino = document.querySelector(href);
          if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.open(href, '_blank', 'noopener');
        }
        return;
      }
      self.ir(i);
    });

    p.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); self.ir(self.act + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); self.ir(self.act - 1); }
    });

    p.addEventListener('pointerdown', function (e) {
      /* La tarjeta de origen se anota aquí porque después ya no se puede saber:
         el setPointerCapture de abajo redirige el pointerup a la pista, y el
         navegador dispara el click en el ancestro común, no en la tarjeta. */
      var t0 = e.target.closest('[data-i]');
      self.gesto = {
        on: true, x0: e.clientX, delta: 0, movio: false,
        i0: t0 ? Number(t0.dataset.i) : -1,
        href0: t0 ? (t0.dataset.href || '') : ''
      };
      self.arrastrando = true;
      self.aplicar();
      try { p.setPointerCapture(e.pointerId); } catch (err) { /* ya soltado */ }
    });

    p.addEventListener('pointermove', function (e) {
      if (!self.gesto.on) return;
      var dx = e.clientX - self.gesto.x0;
      if (Math.abs(dx) > 4) self.gesto.movio = true;
      self.gesto.delta = dx * OPC.sensibilidad;
      self.drag = self.gesto.delta;
      self.aplicar();
    });

    var soltar = function () {
      if (!self.gesto.on) return;
      self.gesto.on = false;
      self.arrastrando = false;
      /* Encaja en la tarjeta más cercana según cuánto se giró */
      var saltos = Math.round(-self.gesto.delta / self.g.paso);
      self.drag = 0;
      self.ir(self.act + saltos);
      setTimeout(function () { self.gesto.movio = false; }, 60);
    };
    p.addEventListener('pointerup', soltar);
    p.addEventListener('pointercancel', soltar);

    /* Se remide contra la pista, no contra la ventana */
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(function () { self.medir(); self.aplicar(); });
      this._ro.observe(this.pista);
    } else {
      window.addEventListener('resize', function () { self.medir(); self.aplicar(); });
    }
  };

  /* ── Arranque automático ────────────────────────────────────────── */
  function iniciar() {
    document.querySelectorAll('[data-abanico]').forEach(function (el) {
      if (el._abanico) return;
      el._abanico = new Abanico(el);
    });
  }
  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', iniciar)
    : iniciar();

  window.SYNAbanico = Abanico;
})();
