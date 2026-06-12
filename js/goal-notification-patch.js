/**
 * GOAL NOTIFICATION PATCH
 *
 * Intercepts the original window.mmShowFlash (central overlay) and reroutes
 * goal events to the improved per-match notification system.
 *
 * Load this AFTER index.bundle.js
 */

(function() {
  // Track the last match/team that had an event (fallback when team lookup fails)
  let lastEventMatch = null;
  let lastEventTeam  = null;

  // Retry until goalNotificationImproved is available
  let retryCount = 0;
  const MAX_RETRIES = 50;

  function waitForImprovedSystem() {
    if (window.goalNotificationImproved &&
        typeof window.goalNotificationImproved.show === 'function') {
      patchGoalFlash();
      return;
    }
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(waitForImprovedSystem, 100);
    }
  }

  /**
   * Find the match element and ID that contains a team with the given name.
   * Returns { match, matchId } or null.
   */
  function findMatchFromTeamName(teamName) {
    if (!teamName) return null;
    const matches = document.querySelectorAll('[id^="mlw-"]');
    for (const match of matches) {
      const teamNameEls = match.querySelectorAll('.ml-team-name');
      for (const el of teamNameEls) {
        if (el.textContent.trim().includes(teamName.trim())) {
          return { match, matchId: match.id.replace('mlw-', '') };
        }
      }
    }
    return null;
  }

  /**
   * Determine which slot ("a" or "b") a team occupies in a match element.
   */
  function resolveTeamSlot(matchEl, teamName) {
    const teamEls = matchEl.querySelectorAll('.ml-team-name');
    if (teamEls.length >= 2 &&
        teamEls[1].textContent.trim().includes(teamName.trim())) {
      return 'b';
    }
    return 'a';
  }

  /**
   * Observe match event-log lists for mutations so we can track which match
   * and team were last active (used as fallback if team-name lookup fails).
   */
  function observeActaEvents() {
    const observed = new Set();

    function attachObserver(listEl) {
      if (observed.has(listEl.id)) return;
      observed.add(listEl.id);

      const matchId = listEl.id.replace('ml-acta-list-', '');
      const obs = new MutationObserver(function() {
        const items = listEl.querySelectorAll('.ml-evt-item');
        if (!items.length) return;
        const last = items[items.length - 1];
        lastEventMatch = matchId;
        lastEventTeam  = last.getAttribute('data-team') || 'a';
      });
      obs.observe(listEl, { childList: true });
    }

    // Attach to any existing lists
    document.querySelectorAll('[id^="ml-acta-list-"]').forEach(attachObserver);

    // Watch for dynamically added lists
    const bodyObs = new MutationObserver(function() {
      document.querySelectorAll('[id^="ml-acta-list-"]').forEach(attachObserver);
    });
    bodyObs.observe(document.body, { childList: true, subtree: true });
  }

  /**
   * Replace window.mmShowFlash with our improved version and permanently
   * suppress the original central overlay element.
   */
  function patchGoalFlash() {
    // Replace the global flash function
    window.mmShowFlash = function(type, teamName, playerName) {
      if (type !== 'gol') return; // only intercept goals; ignore red cards etc.

      let matchId = null;
      let team    = 'a';

      // Primary lookup: find match by team name in the DOM
      const result = findMatchFromTeamName(teamName);
      if (result) {
        matchId = result.matchId;
        team    = resolveTeamSlot(result.match, teamName);
      } else if (lastEventMatch) {
        // Fallback: use the last match that had a tracked event
        matchId = lastEventMatch;
        team    = lastEventTeam || 'a';
      }

      if (matchId) {
        window.goalNotificationImproved.show(matchId, team, playerName || '');
      }
      // Intentionally do NOT call the original _mmFlash to prevent central overlay
    };

    // ── Suppress the central flash overlay ───────────────────────────────
    function forceHideEl(el) {
      if (!el) return;
      el.style.setProperty('display',        'none',   'important');
      el.style.setProperty('visibility',     'hidden', 'important');
      el.style.setProperty('pointer-events', 'none',   'important');
      el.style.setProperty('opacity',        '0',      'important');
      el.classList.remove('show', 'mm-flash-gol', 'mm-flash-roja');
    }

    // Attach a MutationObserver directly on the overlay element so any
    // class or style mutation (added by _mmFlash internals) is countered
    // within the same microtask tick.
    let overlayElObs = null;
    function attachOverlayObserver() {
      const el = document.getElementById('mm-event-flash');
      if (!el || el._gnPatched) return;
      el._gnPatched = true;
      forceHideEl(el);
      overlayElObs = new MutationObserver(function() { forceHideEl(el); });
      overlayElObs.observe(el, {
        attributes: true,
        attributeFilter: ['class', 'style']
      });
    }

    // Watch body for the element being created (it's created lazily by _mmEnsureFlash)
    const bodyOverlayObs = new MutationObserver(function(mutations) {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (node.id === 'mm-event-flash') { forceHideEl(node); attachOverlayObserver(); }
        }
      }
      attachOverlayObserver(); // also check if already present
    });
    bodyOverlayObs.observe(document.body, { childList: true });

    // Apply immediately (in case element already exists)
    attachOverlayObserver();

    // Belt-and-suspenders: 200 ms interval as last resort
    setInterval(function() {
      const el = document.getElementById('mm-event-flash');
      if (el && (el.classList.contains('show') || el.style.display !== 'none')) {
        forceHideEl(el);
      }
    }, 200);

    // Begin tracking events in the match acta lists
    observeActaEvents();
  }

  // Kick off the patching process
  waitForImprovedSystem();
})();
