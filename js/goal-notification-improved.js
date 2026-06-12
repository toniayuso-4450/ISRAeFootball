/**
 * IMPROVED GOAL NOTIFICATION SYSTEM
 *
 * Replaces the central "GOOOOL" overlay with individual goal animations
 * within each match scoreboard, along with sound effects and a mute button.
 */

(function() {
  // Audio context and oscillator management
  let audioContext = null;
  let audioMuted = false;

  /**
   * Initialize audio context (must be called after user interaction)
   */
  function initAudioContext() {
    if (audioContext) return;
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }

  /**
   * Play goal sound using Web Audio API
   * Creates a "goal horn" effect with crowd noise for maximum impact
   */
  function playGoalSound() {
    if (audioMuted || !audioContext) return;

    try {
      // Resume context if suspended (browser autoplay policy)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const now = audioContext.currentTime;

      // ── GOAL HORN ──────────────────────────────────────────────────────
      const hornGain = audioContext.createGain();
      hornGain.connect(audioContext.destination);
      hornGain.gain.setValueAtTime(0, now);
      hornGain.gain.linearRampToValueAtTime(0.28, now + 0.04);
      hornGain.gain.setValueAtTime(0.28, now + 0.9);
      hornGain.gain.linearRampToValueAtTime(0, now + 1.4);

      // Primary horn – square wave (brass-like timbre)
      const horn1 = audioContext.createOscillator();
      horn1.type = 'square';
      horn1.frequency.setValueAtTime(440, now);
      horn1.frequency.linearRampToValueAtTime(880, now + 0.08);
      horn1.frequency.setValueAtTime(880, now + 0.9);
      horn1.frequency.linearRampToValueAtTime(660, now + 1.4);
      horn1.connect(hornGain);
      horn1.start(now);
      horn1.stop(now + 1.5);

      // Second harmonic – sawtooth
      const horn2Gain = audioContext.createGain();
      horn2Gain.gain.setValueAtTime(0.10, now);
      horn2Gain.gain.setValueAtTime(0.10, now + 0.9);
      horn2Gain.gain.linearRampToValueAtTime(0, now + 1.2);
      horn2Gain.connect(audioContext.destination);

      const horn2 = audioContext.createOscillator();
      horn2.type = 'sawtooth';
      horn2.frequency.setValueAtTime(880, now);
      horn2.frequency.linearRampToValueAtTime(1760, now + 0.08);
      horn2.connect(horn2Gain);
      horn2.start(now);
      horn2.stop(now + 1.3);

      // Sub-bass thump at the hit
      const subGain = audioContext.createGain();
      subGain.gain.setValueAtTime(0.35, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      subGain.connect(audioContext.destination);

      const sub = audioContext.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(80, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.25);
      sub.connect(subGain);
      sub.start(now);
      sub.stop(now + 0.28);

      // ── CROWD CHEER (filtered noise burst) ────────────────────────────
      const crowdDur = 2.2;
      const sr = audioContext.sampleRate;
      const crowdBuf = audioContext.createBuffer(1, Math.ceil(sr * crowdDur), sr);
      const crowdData = crowdBuf.getChannelData(0);
      for (let i = 0; i < crowdData.length; i++) {
        crowdData[i] = Math.random() * 2 - 1;
      }

      const crowdSrc = audioContext.createBufferSource();
      crowdSrc.buffer = crowdBuf;

      const crowdFilter = audioContext.createBiquadFilter();
      crowdFilter.type = 'bandpass';
      crowdFilter.frequency.value = 1100;
      crowdFilter.Q.value = 0.45;

      const crowdGain = audioContext.createGain();
      crowdGain.gain.setValueAtTime(0, now + 0.08);
      crowdGain.gain.linearRampToValueAtTime(0.18, now + 0.45);
      crowdGain.gain.setValueAtTime(0.18, now + 1.6);
      crowdGain.gain.linearRampToValueAtTime(0, now + crowdDur);

      crowdSrc.connect(crowdFilter);
      crowdFilter.connect(crowdGain);
      crowdGain.connect(audioContext.destination);
      crowdSrc.start(now + 0.08);
      crowdSrc.stop(now + crowdDur + 0.1);

    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  /**
   * Show goal animation within the match scoreboard
   *
   * @param {string} matchId    - Match identifier (e.g., "j1m1")
   * @param {string} team       - Team that scored ("a" or "b")
   * @param {string} [playerName] - Name of the goal scorer (optional)
   */
  function showGoalNotification(matchId, team, playerName) {
    // Locate the scoreboard container for this match
    const scoreEl = document.querySelector(`#mlw-${matchId} .ml-score`);
    if (!scoreEl) return;

    // Also flash the whole scoreboard wrap for visual punch
    const wrapEl = document.querySelector(`#mlw-${matchId} .ml-score-wrap`);
    if (wrapEl) {
      wrapEl.classList.remove('score-goal-flash');
      void wrapEl.offsetWidth;
      wrapEl.classList.add('score-goal-flash');
      setTimeout(() => wrapEl.classList.remove('score-goal-flash'), 3000);
    }

    // Build / reuse the goal flash element
    let goalFlash = scoreEl.querySelector('.goal-flash-anim');
    if (!goalFlash) {
      goalFlash = document.createElement('div');
      goalFlash.className = 'goal-flash-anim';
      scoreEl.appendChild(goalFlash);
    }

    // Build inner HTML: "¡GOL!" + optional player name
    const playerHtml = playerName
      ? `<span class="goal-player">⚽ ${playerName}</span>`
      : '';
    goalFlash.innerHTML = `<span class="goal-text">¡GOL!</span>${playerHtml}`;

    // Restart animation
    goalFlash.classList.remove('active');
    void goalFlash.offsetWidth; // force reflow
    goalFlash.classList.add('active');

    // Auto-remove after 3 s
    clearTimeout(goalFlash._gTimer);
    goalFlash._gTimer = setTimeout(() => goalFlash.classList.remove('active'), 3000);

    // Play sound effect
    playGoalSound();
  }

  /**
   * Toggle audio mute state
   */
  function toggleAudioMute() {
    audioMuted = !audioMuted;
    const btn = document.getElementById('audio-mute-btn');
    if (btn) {
      btn.setAttribute('data-muted', audioMuted);
      btn.setAttribute('aria-pressed', audioMuted ? 'true' : 'false');
      if (audioMuted) {
        btn.textContent = '🔇';
        btn.setAttribute('aria-label', 'Sonido desactivado – clic para activar');
        btn.title = 'Sonido desactivado – clic para activar';
      } else {
        btn.textContent = '🔊';
        btn.setAttribute('aria-label', 'Sonido activado – clic para silenciar');
        btn.title = 'Sonido activado – clic para silenciar';
      }
    }
    return audioMuted;
  }

  /**
   * Get current mute state
   */
  function isAudioMuted() {
    return audioMuted;
  }

  // ── Public API ────────────────────────────────────────────────────────────
  window.goalNotificationImproved = {
    show:       showGoalNotification,
    playSound:  playGoalSound,
    toggleMute: toggleAudioMute,
    isMuted:    isAudioMuted,
    initAudio:  initAudioContext
  };

  // Initialise AudioContext on first user interaction (browser autoplay policy)
  document.addEventListener('click',      initAudioContext, { once: true });
  document.addEventListener('touchstart', initAudioContext, { once: true });

  // Wire up the mute button once the DOM is ready
  function attachMuteBtn() {
    const btn = document.getElementById('audio-mute-btn');
    if (!btn) return;
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      toggleAudioMute();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachMuteBtn);
  } else {
    attachMuteBtn();
  }
})();
