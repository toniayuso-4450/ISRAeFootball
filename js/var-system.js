/* ================================================================
   VAR SYSTEM — Revisión de Vídeo (IA vs. IA)
   Versión 1.0
   ================================================================
   Probabilidades de activación:
     · Goles / Penaltis : 1 de cada 3  (~33 %)
     · Tarjetas          : 1 de cada 4  (~25 %)

   Flujo por evento con VAR:
     t = 0  → Muestra "📺 VAR" en el marcador (parpadeante, amarillo)
     t = 3s → Restaura marcador, actualiza resultado, añade al acta
================================================================ */

(function () {
  /* ── Inyectar estilos CSS ─────────────────────────────────────── */
  var _style = document.createElement('style');
  _style.textContent = [
    /* Texto VAR en el marcador */
    '.ml-var-text{',
    '  display:inline-block;',
    '  font-size:1.05em;',
    '  font-weight:900;',
    '  letter-spacing:.06em;',
    '  color:#f5c518;',
    '  text-shadow:0 0 8px #f5c518,0 0 18px rgba(245,197,24,.55);',
    '  animation:var-blink .65s step-start infinite;',
    '}',
    '@keyframes var-blink{',
    '  0%,100%{opacity:1;}',
    '  50%{opacity:0;}',
    '}',
    /* Indicador en el botón del cronómetro */
    '.ml-timer.ml-var-reviewing{',
    '  border-color:#f5c518!important;',
    '  color:#f5c518!important;',
    '  box-shadow:0 0 6px rgba(245,197,24,.4);',
    '}',
    /* Etiqueta VAR en el acta */
    '.ml-evt-var{',
    '  display:block;',
    '  font-size:9px;',
    '  font-weight:700;',
    '  letter-spacing:.04em;',
    '  color:#f5c518;',
    '  opacity:.85;',
    '  margin-top:1px;',
    '}'
  ].join('');
  document.head.appendChild(_style);

  /* ── API pública ─────────────────────────────────────────────── */
  var VAR_REVIEW_MS = 3000;   /* duración de revisión: 3 segundos reales */
  var VAR_PROB_GOAL = 1 / 3;  /* 33.3 %: goles y penaltis */
  var VAR_PROB_CARD = 0.25;   /* 25 %: tarjetas */

  window.mlVARSystem = {
    /** Duración de la revisión VAR en milisegundos (exportado para uso externo) */
    REVIEW_MS: VAR_REVIEW_MS,

    /** Pone ev.var = true/false según probabilidades */
    tagEvents: function (evts) {
      evts.forEach(function (ev) {
        if (
          ev.type === 'gol' ||
          ev.type === 'falta-gol' ||
          ev.type === 'propia' ||
          ev.type === 'pen-prov'
        ) {
          ev.var = Math.random() < VAR_PROB_GOAL;
        } else if (
          ev.ico === '🟨' ||
          ev.ico === '🟥' ||
          ev.ico === '🟨🟥'
        ) {
          ev.var = Math.random() < VAR_PROB_CARD;
        }
        /* pen-gol no se etiqueta por separado; ya cubierto por pen-prov */
      });
    },

    /** Texto que se añade al acta según tipo de evento */
    varLogSuffix: function (type) {
      if (
        type === 'gol' ||
        type === 'falta-gol' ||
        type === 'propia' ||
        type === 'pen-gol'
      ) {
        return 'Confirmado por 📺 VAR';
      }
      if (type === 'pen-prov') {
        return 'Tras revisión 📺 VAR';
      }
      return 'Validada por 📺 VAR';
    }
  };
})();
