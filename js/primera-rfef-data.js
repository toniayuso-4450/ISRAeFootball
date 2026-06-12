/* ================================================================
   PRIMERA RFEF ↔ EFOOTBALL ALIAS SYSTEM
   Versión: 1.1
   ================================================================
   Lógica:
   - Vista Humano vs 1ª RFEF: muestra el alias eFootball del rival
     entre paréntesis en el panel de Copa (chp-local / chp-visit)
   - Vista IA vs IA: sin cambios (nombres reales en el acta)
   - Pantallazo de Lesión (equipo humano): muestra el equipo eFootball
     que debe usar el usuario al gestionar la lesión
   ================================================================ */

(function () {
  'use strict';

  // ── MAPPING: 1ª RFEF / 2ª Fed team → alias eFootball ─────────────
  var MAP = {
    // ── Asia / Oceanía ──────────────────────────────────────────────
    'AD Alcorcón':            'Lee Man',
    'Alcorcón':               'Lee Man',
    'Algeciras CF':           'Yokohama F. Marinos',
    'Algeciras':              'Yokohama F. Marinos',
    'SD Amorebieta':          'Machida Zelvia',
    'Amorebieta':             'Machida Zelvia',
    'Arenas de Getxo':        'Cebu FC',
    'Arenas Club':            'Cebu FC',
    'Athletic Club B':        'Al Kuwait SC',
    'Bilbao Ath.':            'Kaya FC-Iloilo',
    'Atlético Madrid B':      'Ravshan Kulob',
    'Atlético Madrileño':     'Ravshan Kulob',
    'Real Avilés Industrial': 'Pakhtakor Tashkent',
    'Avilés':                 'Pakhtakor Tashkent',
    'Barakaldo':              'Jeonbuk Hyundai',
    'Barakaldo CF':           'Jeonbuk Hyundai',
    'Bilbao Athletic':        'Kaya FC-Iloilo',
    'Celta Fortuna':          'Sydney FC',
    'Cultural Leonesa':       'Seoul E-Land',
    'CE Europa':              'Altyn Asyr Asgabat',
    'Europa':                 'Altyn Asyr Asgabat',
    'CF Fuenlabrada':         'Montedio Yamagata',
    'Fuenlabrada':            'Montedio Yamagata',
    'Hércules CF':            'Al-Shorta',
    'Hércules':               'Al-Shorta',
    'CF Intercity':           'Tochigi SC',
    'Intercity':              'Tochigi SC',
    'Linares Deportivo':      'Yokohama FC',
    'CD Lugo':                'Gwangju FC',
    'Lugo':                   'Gwangju FC',
    'AD Mérida':              'Al-Taawoun',
    'Mérida AD':              'Al-Taawoun',
    'Mérida':                 'Al-Taawoun',
    'Gimnàstic Tarragona':    'Muangthong United',
    'Nástic':                 'Muangthong United',
    'SD Ponferradina':        'Kawasaki Frontale',
    'Ponferradina':           'Kawasaki Frontale',
    'Pontevedra CF':          'Zhejiang FC',
    'Pontevedra':             'Zhejiang FC',
    'Rayo Cantabria':         'Brisbane Roar',
    'Real Madrid Castilla':   'Al Ain',
    'RM Castilla':            'Al Ain',
    'Real Murcia CF':         'Al Rayyan',
    'Real Murcia':            'Al Rayyan',
    'Real Unión':             'Oita Trinita',
    'Real Unión Club':        'Oita Trinita',
    'Salamanca UDS':          'Chiangrai United',
    'UD Logroñés':            'Sangju Sangmu',
    'SD Logroñés':            'Sangju Sangmu',
    'Sestao River':           'Bangkok United',
    'Sestao River Club':      'Bangkok United',
    'CF Talavera':            'Port FC',
    'Talavera':               'Port FC',
    'SD Tarazona':            'Shandong Taishan',
    'Tarazona':               'Shandong Taishan',
    'CD Teruel':              'Nassaji Mazandaran',
    'Teruel':                 'Nassaji Mazandaran',
    'UD Ibiza':               'Al Wakrah SC',
    'Unionistas CF':          'Central Coast Mariners',
    'Unionistas':             'Central Coast Mariners',

    // ── Sudamérica ──────────────────────────────────────────────────
    'CD Alcoyano':            'Confiança',
    'Alcoyano':               'Confiança',
    'Antequera CF':           'CRB',
    'Antequera':              'CRB',
    'CD Arenteiro':           'América Mineiro',
    'Arenteiro':              'América Mineiro',
    'At. Baleares':           'CSA',
    'Atlético Baleares':      'CSA',
    'CE Sabadell':            'AB Remo',
    'Sabadell':               'AB Remo',
    'Barça Atlètic':          'Ferroviária (Araraquara)',
    'Barça Atlétic':          'Ferroviária (Araraquara)',
    'Betis Deportivo':        'Chapecoense',
    'Betis Deportivo Balompié': 'Chapecoense',
    'CP Cacereño':            'Coritiba',
    'Cacereño':               'Coritiba',
    'FC Cartagena':           'Criciúma EC',
    'Cartagena':              'Criciúma EC',
    'AD Ceuta B':             'Ponte Preta',
    'Ceuta B':                'Ponte Preta',
    'CD Eldense':             'Botafogo SP',
    'Eldense':                'Botafogo SP',
    'Gimnástica Segoviana':   'Ituano FC',
    'G. Segoviana':           'Ituano FC',
    'CD Guadalajara':         'Volta Redonda',
    'Guadalajara':            'Volta Redonda',
    'Juventud Torremolinos':  'Paysandu',
    'Juventud Torremolinos CF': 'Paysandu',
    'Marbella FC':            'Operário Ferroviário',
    'Marbella':               'Operário Ferroviário',
    'CD Mirandés':            'Sport Recife',
    'Mirandés':               'Sport Recife',
    'CD Numancia':            'Vila Nova',
    'Numancia':               'Vila Nova',
    'Osasuna B':              'Athletic Club (Minas)',
    'Osasuna Promesas':       'Athletic Club (Minas)',
    'Ourense CF':             'Amazonas FC',
    'Ourense':                'Amazonas FC',
    'Racing Club de Ferrol':  'Goiás EC',
    'Racing Ferrol':          'Goiás EC',
    'Real Zaragoza':          'Santos FC',
    'Real Zaragoza Deportivo Aragón': 'Santos FC',
    'Recreativo de Huelva':   'Avaí FC',
    'Recreativo Huelva':      'Avaí FC',
    'Atlético Sanluqueño':    'Juventude',
    'At. Sanluqueño':         'Juventude',
    'Sanluqueño':             'Juventude',
    'SD Huesca':              'San Lorenzo / Ituano',
    'Huesca':                 'San Lorenzo / Ituano',
    'Sevilla Atlético':       'Cuiabá VA',
    'Sevilla At.':            'Cuiabá VA',
    'CD Tenerife':            'Athletico Paranaense',
    'Tenerife':               'Athletico Paranaense',
    'Villarreal B':           'Novorizontino',
    'Yeclano Deportivo':      'Ferroviária',
    'Yeclano':                'Ferroviária',
    'Zamora CF':              'Avaí Figueirense',
    'Zamora':                 'Avaí Figueirense'
  };

  // ── Mapping: equipo humano (La Liga) → B-team alias en eFootball ──
  var BTEAM = {
    'Real Madrid':      'Al Ain',
    'FC Barcelona':     'Ferroviária (Araraquara)',
    'Athletic Club':    'Bilbao Athletic',
    'Real Betis':       'Betis Deportivo',
    'Atlético Madrid':  'Atlético Madrid B',
    'CA Osasuna':       'Osasuna B',
    'Sevilla FC':       'Sevilla Atlético'
    // Real Sociedad no tiene B en 1ª RFEF en el mapeado actual
  };

  // ── API pública ───────────────────────────────────────────────────
  window.PRIMERA_RFEF_EFOOTBALL = MAP;

  window.getPrimeraRFEFAlias = function (name) {
    return MAP[name] || null;
  };

  // ── Estilos ───────────────────────────────────────────────────────
  var _style = document.createElement('style');
  _style.textContent = [
    /* Alias italics bajo el nombre del rival en Copa panel */
    '.rfef-efootball-alias{',
    '  display:block;font-size:11px;font-style:italic;',
    '  color:rgba(255,255,255,0.45);margin-top:3px;letter-spacing:0.3px;',
    '}',
    /* Hint de B-team en el overlay de lesión */
    '.lpost-efootball-hint{',
    '  margin-top:8px;font-size:11px;color:rgba(255,200,80,0.9);',
    '  border-top:1px solid rgba(255,255,255,0.08);padding-top:6px;',
    '  font-family:Oswald,sans-serif;letter-spacing:0.3px;line-height:1.4;',
    '}',
    '.lpost-efootball-hint em{font-style:italic;color:#ffd700;font-weight:600;}'
  ].join('');
  document.head.appendChild(_style);

  // ── Inyectar alias bajo el nombre del equipo en el panel Copa ─────
  function _injectAlias(el) {
    var existing = el.querySelector('.rfef-efootball-alias');
    if (existing) existing.remove();
    // Primer nodo de texto = nombre real del equipo
    var textNode = el.childNodes[0];
    var name = (textNode && textNode.nodeType === 3)
      ? textNode.textContent.trim()
      : el.textContent.trim();
    var alias = MAP[name];
    if (alias) {
      var span = document.createElement('span');
      span.className = 'rfef-efootball-alias';
      span.textContent = '(' + alias + ')';
      el.appendChild(span);
    }
  }

  function _watchCopaEl(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var _injecting = false;
    var obs = new MutationObserver(function () {
      if (_injecting) return;
      var textNode = el.childNodes[0];
      var name = (textNode && textNode.nodeType === 3)
        ? textNode.textContent.trim()
        : el.textContent.trim();
      var alias = MAP[name];
      var existing = el.querySelector('.rfef-efootball-alias');
      if (alias && !existing) {
        _injecting = true;
        _injectAlias(el);
        _injecting = false;
      } else if (!alias && existing) {
        existing.remove();
      }
    });
    obs.observe(el, { childList: true, characterData: true, subtree: true });
  }

  // ── Parche para overlay de lesión: añadir instrucción B-team ─────
  function _patchLesionOverlay() {
    var _orig = window.showLesionPostOverlay;
    if (typeof _orig !== 'function') return false;
    window.showLesionPostOverlay = function (lesiones, onConfirm) {
      _orig.call(window, lesiones, onConfirm);
      // Tras renderizar, inyectar hint de B-team si procede
      setTimeout(function () {
        var cards = document.querySelectorAll('#lpost-list .lpost-card');
        (lesiones || []).forEach(function (l, i) {
          var equipo = l.teamName || l.equipo || '';
          var bAlias = BTEAM[equipo];
          var card = cards[i];
          if (bAlias && card && !card.querySelector('.lpost-efootball-hint')) {
            var hint = document.createElement('div');
            hint.className = 'lpost-efootball-hint';
            hint.innerHTML = '🎮 Debes realizar el cambio en tu estrategia de eFootball dentro del equipo: <em>' + bAlias + '</em>.';
            var body = card.querySelector('.lpost-card-body');
            if (body) body.appendChild(hint);
          }
        });
      }, 50);
    };
    return true;
  }

  // ── Init ──────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    _watchCopaEl('chp-local');
    _watchCopaEl('chp-visit');

    // Parche para lesiones (index.bundle.js ya está cargado antes)
    if (!_patchLesionOverlay()) {
      var _tries = 0;
      var _iv = setInterval(function () {
        if (_patchLesionOverlay() || ++_tries > 30) clearInterval(_iv);
      }, 100);
    }
  });

  console.log('[eFootball] 1ª RFEF ↔ eFootball alias system activado ✓');
})();
