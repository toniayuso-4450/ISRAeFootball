/* ================================================================
   MATCH ENGINE: BARAJAS DE PODER (SISTEMA COMPLETO)
   Versión: 2.0 - TODO EN UNO
   ================================================================
*/

(function() {
    // 1. REGLAMENTO DE PROBABILIDADES
    const BASE_PROB = { 'P': 0.001, 'D': 7.5, 'M': 17.5, 'F': 70.0 };
    const MIRACLE_FACTORS = { 2: 0.37, 3: 0.22, 4: 0.12, 5: 0.06 };

    // 2. MATEMÁTICA DEL GOL
    window.calculateGoalProbability = function(pos, power, isLocal, goalsAlreadyScored) {
        // Porteros casi nunca marcan: probabilidad fija 0.001 ignorando su poder de portería
        if (pos === 'P') return 0.001;

        let probBase = BASE_PROB[pos] || 17.5;
        let pwr = parseFloat(power) || 0;
        let calculationBase = probBase + (pwr / 100);

        // Ventaja local: +10% sobre el valor base
        let finalFirstGoalProb = isLocal ? (calculationBase * 1.10) : calculationBase;

        let result = finalFirstGoalProb;
        let nextGoalNumber = (parseInt(goalsAlreadyScored) || 0) + 1;

        if (nextGoalNumber > 1) {
            let miracleFactor = MIRACLE_FACTORS[nextGoalNumber] || 0.02; 
            result = finalFirstGoalProb * miracleFactor;
        }
        return parseFloat(result.toFixed(2));
    };

    // 3. INICIALIZADOR DE EQUIPOS (Llena los desplegables)
    window.initMatchSelectors = function(teamAName, teamBName) {
        const getOptions = (name) => {
            let squad = window.SQUAD_REGISTRY[name] || [];
            if (squad.length === 0) return '<option value="">Equipo no encontrado</option>';
            return squad
                .filter(p => !p.h) 
                .map(p => `<option value="${p[1]}" data-pos="${p[2]}" data-power="${p[3]}">${p[0]}. ${p[1]} (${p[2]})</option>`)
                .join('');
        };

        document.querySelectorAll('.select-team-a').forEach(el => el.innerHTML = getOptions(teamAName));
        document.querySelectorAll('.select-team-b').forEach(el => el.innerHTML = getOptions(teamBName));
        console.log("✅ Selectores listos.");
    };

    // 4. FUNCIÓN DEL BOTÓN "GOL" (La que hace la magia)
    window.intentarGol = function(teamSide, selectId) {
        let select = document.getElementById(selectId);
        let opt = select.options[select.selectedIndex];
        
        let nombre = opt.value;
        let posicion = opt.getAttribute('data-pos');
        let poder = opt.getAttribute('data-power');
        let esLocal = (teamSide === 'A');

        // Contamos cuántos goles lleva ya este jugador en el acta para la "Carta de Milagros"
        let golesPrevios = document.querySelectorAll(`.gol-en-acta[data-player="${nombre}"]`).length;

        let probabilidad = window.calculateGoalProbability(posicion, poder, esLocal, golesPrevios);
        let dado = Math.random() * 100;

        if (dado <= probabilidad) {
            alert(`⚽ ¡GOOOL DE ${nombre}! (${probabilidad}%)`);
            anadirAlActa(nombre, teamSide);
            actualizarMarcador(teamSide);
        } else {
            alert(`❌ ${nombre} falló. Probabilidad: ${probabilidad}% - Dado: ${dado.toFixed(2)}`);
        }
    };

    // 5. ACTUALIZAR EL ACTA Y MARCADOR VISUAL
    function anadirAlActa(jugador, lado) {
        let acta = document.getElementById('acta-partido');
        let entrada = document.createElement('div');
        entrada.className = 'gol-en-acta';
        entrada.setAttribute('data-player', jugador);
        entrada.innerHTML = `⚽ GOL - ${jugador} (${lado === 'A' ? 'Local' : 'Visitante'})`;
        acta.prepend(entrada);
    }

    function actualizarMarcador(lado) {
        let id = lado === 'A' ? 'score-local' : 'score-visitante';
        let el = document.getElementById(id);
        el.innerText = parseInt(el.innerText) + 1;
    }

})();
