/* ═══════════════════════════════════════════════════════════════════
   SYN · El puente — mapa radial de áreas
   ───────────────────────────────────────────────────────────────────
   Ocho áreas de la empresa dispuestas en elipse alrededor de SYN.
   Al hacer clic en una, el panel de la derecha muestra qué cambia:
   cómo se trabaja hoy, cómo queda con SYN y qué se gana.

   Un segundo clic sobre la misma área vuelve a la vista general.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var ACENTO = '#7A22F0';

  /* Qué cambia en cada área. Editar aquí, no en el HTML. */
  var AREAS = {
    ventas: {
      nombre: 'Ventas',
      antes: 'Cotizaciones en Excel, dos días de ida y vuelta',
      despues: 'Cotizador conectado al ERP, aprobación el mismo día',
      gana: '−70% tiempo', nota: 'por cotización'
    },
    finanzas: {
      nombre: 'Finanzas',
      antes: 'Facturas capturadas a mano, errores al cierre',
      despues: 'Facturación automática y conciliación diaria',
      gana: '−90% captura', nota: 'cierre mensual'
    },
    ops: {
      nombre: 'Operaciones',
      antes: 'Cada área con su propio archivo y su verdad',
      despues: 'Un tablero con datos en vivo para toda la operación',
      gana: '1 fuente', nota: 'de verdad'
    },
    logistica: {
      nombre: 'Logística',
      antes: 'Seguimiento por WhatsApp y llamadas',
      despues: 'Rastreo en línea con alertas automáticas',
      gana: '−40% llamadas', nota: 'a soporte'
    },
    atencion: {
      nombre: 'Atención',
      antes: 'Tickets perdidos entre correos',
      despues: 'Bandeja única con prioridad y tiempos de respuesta',
      gana: '2h respuesta', nota: 'promedio'
    },
    rrhh: {
      nombre: 'Talento',
      antes: 'Altas y accesos gestionados a mano',
      despues: 'Alta, accesos y equipo listos en un solo flujo',
      gana: '−3 días', nota: 'por ingreso'
    },
    marketing: {
      nombre: 'Marketing',
      antes: 'Campañas sin datos de venta reales',
      despues: 'Atribución conectada al cierre de cada trato',
      gana: '+2.4x', nota: 'retorno visible'
    },
    direccion: {
      nombre: 'Dirección',
      antes: 'Reportes armados a fin de mes',
      despues: 'Tablero de indicadores actualizado cada día',
      gana: 'Tiempo real', nota: 'sin esperar reportes'
    }
  };

  /* Sin área elegida, el panel resume el conjunto */
  var GENERAL = {
    nombre: 'Impacto · esta semana',
    antes: 'Ocho áreas trabajando en archivos separados',
    despues: 'Un solo puente técnico entre todas ellas',
    gana: '−18h/semana', nota: 'trabajo manual'
  };

  function iniciar() {
    var raiz = document.querySelector('[data-radial]');
    if (!raiz) return;

    var mapa = raiz.querySelector('[data-map]');
    var nodos = [].slice.call(raiz.querySelectorAll('[data-dept]'));
    if (!mapa || !nodos.length) return;

    var campos = {
      ctx: raiz.querySelector('[data-ctx]'),
      antes: raiz.querySelector('[data-antes]'),
      despues: raiz.querySelector('[data-despues]'),
      gana: raiz.querySelector('[data-gana]'),
      nota: raiz.querySelector('[data-nota]')
    };

    var elegida = null;

    function pintar() {
      var d = (elegida && AREAS[elegida]) || GENERAL;

      if (campos.ctx) campos.ctx.textContent = elegida ? 'Impacto · ' + d.nombre : d.nombre;
      if (campos.antes) campos.antes.textContent = d.antes;
      if (campos.despues) campos.despues.textContent = d.despues;
      if (campos.gana) campos.gana.textContent = d.gana;
      if (campos.nota) campos.nota.textContent = d.nota;

      nodos.forEach(function (el) {
        var on = el.dataset.dept === elegida;
        el.style.borderColor = on ? ACENTO : 'rgba(242,242,244,.16)';
        el.style.background = on ? 'rgba(122,34,240,.16)' : '#131318';
        el.style.color = on ? '#fff' : '';
        el.style.boxShadow = on ? '0 0 34px rgba(122,34,240,.30)' : 'none';
        el.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }

    function elegir(clave) {
      elegida = (elegida === clave) ? null : clave;   /* volver a tocarla la deselecciona */
      pintar();
    }

    mapa.addEventListener('click', function (e) {
      var nodo = e.target.closest && e.target.closest('[data-dept]');
      if (nodo) elegir(nodo.dataset.dept);
    });

    /* Cada área es un botón real: teclado y lectores de pantalla incluidos */
    nodos.forEach(function (el) {
      el.setAttribute('role', 'button');
      el.tabIndex = 0;
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); elegir(el.dataset.dept); }
      });
    });

    pintar();
  }

  document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', iniciar)
    : iniciar();
})();
