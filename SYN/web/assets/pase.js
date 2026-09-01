/* ═══════════════════════════════════════════════════════════════════
   SYN · Pase de acceso — efecto cristal
   ───────────────────────────────────────────────────────────────────
   Una tarjeta que se inclina siguiendo el cursor, con capas de fondo
   que se mueven a distinta velocidad (parallax de profundidad), brillo
   especular, película holográfica y giro 3D para ver el reverso.

   El cristal esmerilado no es un blur único: son cinco capas de
   backdrop-filter con máscaras escalonadas, de 1px abajo a 26px
   arriba. Eso imita cómo se difumina el vidrio real por grosor,
   en vez del blur plano de siempre.

   Todo se interpola con lerp dentro de un rAF: el cursor marca un
   destino y la tarjeta lo persigue, nunca salta.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var TILT = 13;          /* grados máximos de inclinación */
  var HOLO = true;        /* película holográfica al pasar el cursor */
  var HOOK_MS = 3400;     /* cada cuánto rota la frase de abajo */

  function iniciar() {
    var stage = document.querySelector('[data-pass-stage]');
    var card = document.querySelector('[data-pass-card]');
    if (!stage || !card) return;

    var front = card.querySelector('[data-pass-face="front"]');
    var back = card.querySelector('[data-pass-face="back"]');
    var sheen = card.querySelector('[data-pass-sheen]');
    var holo = card.querySelector('[data-pass-holo]');
    var copy = card.querySelector('[data-pass-copy]');
    var capas = [].slice.call(card.querySelectorAll('[data-depth]'));

    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* tx/ty = destino que marca el cursor · x/y = valor actual, que lo persigue */
    var p = { tx: 0, ty: 0, x: 0, y: 0, hov: 0, hovT: 0, flip: 0, flipT: 0 };

    /* ── Cursor ─────────────────────────────────────────────────── */
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      p.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      p.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      p.hovT = 1;
    }, { passive: true });

    stage.addEventListener('pointerleave', function () {
      p.tx = 0; p.ty = 0; p.hovT = 0;
    });

    /* ── Giro ───────────────────────────────────────────────────── */
    var girar = function (v) {
      p.flipT = v;
      /* Con movimiento reducido el giro es instantáneo: se pinta un cuadro y se
         corta el bucle que `pintar` deja encolado al final, o cada clic dejaría
         un requestAnimationFrame corriendo para siempre. */
      if (reduced) {
        p.flip = v;
        pintar(performance.now());
        cancelAnimationFrame(raf); raf = null;
      }
    };
    card.addEventListener('click', function (e) {
      if (e.target.closest('[data-flip]')) girar(1);
      if (e.target.closest('[data-unflip]')) girar(0);
    });
    /* Con teclado el giro también debe funcionar */
    card.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      if (e.target.closest('[data-flip]')) { e.preventDefault(); girar(1); }
      if (e.target.closest('[data-unflip]')) { e.preventDefault(); girar(0); }
    });

    /* ── Cupos del mes en curso ─────────────────────────────────── */
    var cupos = card.querySelector('[data-cupos]');
    if (cupos) {
      var meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      var d = new Date();
      cupos.textContent = (2 + (d.getMonth() % 3)) + ' cupos en ' + meses[d.getMonth()];
    }

    /* ── Fecha de emisión: siempre hoy, para que no envejezca ───── */
    var emitido = card.querySelector('[data-emitido]');
    if (emitido) {
      var f = new Date();
      emitido.textContent = String(f.getDate()).padStart(2, '0') + '.' +
        String(f.getMonth() + 1).padStart(2, '0') + '.' + f.getFullYear();
    }

    /* ── Frases que se turnan ───────────────────────────────────── */
    var hooks = [].slice.call(card.querySelectorAll('[data-hook]'));
    if (hooks.length > 1 && !reduced) {
      var hi = 0;
      setInterval(function () {
        hi = (hi + 1) % hooks.length;
        hooks.forEach(function (el, i) { el.style.opacity = i === hi ? '1' : '0'; });
      }, HOOK_MS);
    }

    /* ── Bucle ──────────────────────────────────────────────────── */
    var t0 = performance.now();

    function pintar(now) {
      var t = (now - t0) / 1000;

      /* Persecución suave del destino */
      p.x += (p.tx - p.x) * 0.09;
      p.y += (p.ty - p.y) * 0.09;
      p.hov += (p.hovT - p.hov) * 0.07;
      p.flip += (p.flipT - p.flip) * 0.075;

      /* En reposo la tarjeta respira sola; al acercar el cursor, manda él */
      var reposo = 1 - p.hov;
      var ry = p.x * TILT + Math.sin(t * 0.55) * 2.4 * reposo + p.flip * 180;
      var rx = -p.y * TILT * 0.7 + Math.cos(t * 0.42) * 1.6 * reposo;
      var ty = Math.sin(t * 0.75) * 6 * reposo - p.hov * 12;

      card.style.transform = 'translate3d(0,' + ty.toFixed(2) + 'px,0) rotateX(' +
        rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) scale(' +
        (1 + p.hov * 0.022).toFixed(4) + ')';

      /* Solo la cara que mira al frente recibe clics */
      var reverso = p.flip > 0.5;
      var sombra = '0 ' + (40 + p.hov * 26).toFixed(0) + 'px ' +
        (120 + p.hov * 40).toFixed(0) + 'px rgba(0,0,0,.75)';
      [[front, !reverso], [back, reverso]].forEach(function (par) {
        var el = par[0], visible = par[1];
        if (!el) return;
        el.style.boxShadow = sombra;
        el.style.visibility = visible ? 'visible' : 'hidden';
        el.style.pointerEvents = visible ? 'auto' : 'none';
      });

      /* Cada capa se desplaza según su profundidad: eso da el relieve */
      for (var i = 0; i < capas.length; i++) {
        var el = capas[i], d = +el.dataset.depth;
        el.style.transform = 'translate3d(' + (-p.x * d * 0.5).toFixed(2) + 'px,' +
          (-p.y * d * 0.34).toFixed(2) + 'px,0)';
      }

      if (sheen) {
        sheen.style.opacity = (p.hov * 0.9).toFixed(3);
        sheen.style.transform = 'translate3d(' + (p.x * 90).toFixed(1) + 'px,' +
          (p.y * 60).toFixed(1) + 'px,0)';
      }
      if (holo) {
        holo.style.opacity = (HOLO ? p.hov * 0.55 : 0).toFixed(3);
        holo.style.backgroundPosition = (p.x * 220).toFixed(0) + 'px ' +
          (p.y * 120).toFixed(0) + 'px';
      }
      if (copy) copy.style.transform = 'translate3d(0,' + (-p.hov * 5).toFixed(2) + 'px,0)';

      raf = requestAnimationFrame(pintar);
    }

    var raf = null;

    /* Solo se anima mientras está en pantalla */
    if ('IntersectionObserver' in window && !reduced) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) {
          if (en.isIntersecting && !raf) raf = requestAnimationFrame(pintar);
          else if (!en.isIntersecting && raf) { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0.01 }).observe(stage);
    } else if (reduced) {
      pintar(performance.now());          /* un cuadro fijo, sin bucle */
      cancelAnimationFrame(raf); raf = null;
    } else {
      raf = requestAnimationFrame(pintar);
    }
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', iniciar)
    : iniciar();
})();
