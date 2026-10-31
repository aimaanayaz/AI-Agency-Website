/* Today: the day's session. One ordered list, one focus panel. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, ui = DQ.ui;

  function stepMeta(s) {
    const it = S.peek(s.ref) || {};
    if (s.mode === 'watch') {
      const v = E.video(E.idOf(s.ref)) || {}; const n = s.parts || E.videoParts(E.idOf(s.ref));
      return `${v.src === 'babbar' ? 'Babbar lecture' : 'Striver lecture'}${n > 1 ? `, part ${s.part + 1} of ${n}` : ''}`;
    }
    const p = E.problem(E.idOf(s.ref)); if (!p) return '';
    if (s.mode === 'recall') return `${E.lastSeenText(it)}, quick recall`;
    if (s.mode === 'resolve') return `${E.lastSeenText(it)}, re-solve`;
    if (s.mode === 'read') return 'Concept';
    return `${{ E: 'Easy', M: 'Medium', H: 'Hard' }[p.d] || ''}${p.src === 'boss' ? ', unit challenge' : ''}`;
  }

  function row(s, sel) {
    const est = Math.round(E.stepEstimate(s));
    const title = s.mode === 'watch' ? E.title(s.ref).replace(/^Lecture (\d+):\s*/, 'Lecture $1: ') : E.title(s.ref);
    const just = ui._justDone && ui._justDone === s.id;
    return `<li><button class="step ${s.done ? 'is-done' : ''} ${sel ? 'is-selected' : ''}" data-act="select-step" data-step="${s.id}" ${sel ? 'aria-current="step"' : ''}>
      ${s.done ? (just ? `<span class="dot tone-${(E.outcomeMeta(s.outcome) || { tone: 'muted' }).tone}"><span class="t-success-check" data-state="in"><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M6 12.5l4 4 8-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:19;stroke-dashoffset:19"/></svg></span></span>` : ui.dot(s.outcome, true)) : `<span class="dot ${sel ? 'dot-current' : 'dot-todo'}"></span>`}
      <span class="step-text"><span class="step-title">${U.esc(title)}</span><span class="step-meta">${U.esc(stepMeta(s))}${s.done && s.outcome && s.outcome !== 'done' ? ` <span class="sep">/</span> ${U.esc((E.outcomeMeta(s.outcome) || {}).label || '')}` : ''}</span></span>
      <span class="step-min num">${s.done && s.mins ? s.mins : est}<small> min</small></span>
    </button></li>`;
  }

  function bar(sess, selId) {
    return `<div class="sbar" role="img" aria-label="Session time: each block is as wide as its minutes">${sess.steps.map(s => `<span class="sbar-seg ${s.done ? 'is-done' : ''} ${s.id === selId ? 'is-current' : ''}" style="flex:${Math.max(3, E.stepEstimate(s))}"></span>`).join('')}</div>`;
  }

  function donePanel(sess, stats) {
    const tomorrow = E.dueAgain(U.addDays(U.today(), 1)).length;
    const mins = Math.round((S.state.days[U.today()] || { minutes: 0 }).minutes);
    const next = E.newQueue()[0];
    const wins = (S.state.days[U.today()] || {}).wins || [];
    return `<div class="panel-inner done-state">
      <span class="t-success-check big-check" data-state="in"><svg viewBox="0 0 48 48" fill="none" width="52" height="52"><circle cx="24" cy="24" r="22" class="check-ring"/><path d="M15 24.5l6.5 6.5L33.5 18" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:28;stroke-dashoffset:28"/></svg></span>
      <h2>Done for today</h2>
      <p class="muted">${U.plural(stats.done, 'step')} and ${mins} minutes. ${next ? `Next up: ${U.esc(E.title(next.ref))}.` : ''}${tomorrow ? ` ${U.plural(tomorrow, 'earlier problem')} will come back tomorrow.` : ''}</p>
      ${wins.length ? `<ul class="wins">${wins.map(w => `<li>${U.icon(w.type === 'reward' ? 'gift' : 'flag-pennant', 16)}<span><b>${U.esc(w.title)}</b><span>${U.esc(w.sub)}</span></span></li>`).join('')}</ul>` : ''}
      <div class="panel-actions"><button class="btn btn-primary" data-act="keep-going">${U.icon('plus', 16)}<span>Keep going, about 25 more minutes</span></button></div>
    </div>`;
  }

  DQ.views.today = {
    render() {
      const sess = E.session(), stats = E.sessionStats(sess), p = S.state.profile;
      const day = U.fmtLong(U.today());
      if (sess.rest && !sess.steps.length) {
        return `<div class="page narrow"><header class="page-head"><h1>Rest day</h1><p class="sub">${day}. Rest is part of the plan, and your streak is safe.</p></header>
          <button class="btn btn-primary" data-act="study-anyway">${U.icon('play', 16)}<span>Study anyway</span></button></div>`;
      }
      if (!sess.steps.length) {
        return `<div class="page narrow"><header class="page-head"><h1>Nothing due today</h1><p class="sub">${day}. You have finished the path and every earlier problem is up to date.</p></header></div>`;
      }
      const picked = ui._sel && sess.steps.find(s => s.id === ui._sel);
      const sel = picked || stats.current;
      ui._ctxStep = sel && !sel.done ? sel : null;
      const content = picked && picked.done ? panelForDone(picked) : stats.current ? ui.itemPanel(sel.ref, sel) : donePanel(sess, stats);
      const unit = E.currentUnit();
      const ritual = p.ritual && p.ritual.text ? `<p class="ritual">${U.icon('sparkle', 14)}<span>${p.ritual.url ? `<a href="${U.esc(p.ritual.url)}" target="_blank" rel="noopener">${U.esc(p.ritual.text)}</a>` : U.esc(p.ritual.text)}</span></p>` : '';
      const legacy = !p.legacyConfirmed && S.state.legacyImported ? `<div class="note-line">${U.icon('warning', 16)}<span>Your old tracker said Bit Manipulation 4 of 18 without saying which. The first four are marked done. <a href="#/settings">Check them</a></span><button class="icon-btn" data-act="dismiss-legacy" aria-label="Dismiss">${U.icon('x', 14)}</button></div>` : '';
      return `<div class="today">
        <section class="session" aria-label="Today's session">
          <header class="page-head"><h1>Today</h1>
            <p class="sub">${day}. ${stats.done < stats.count ? `${U.plural(stats.count - stats.done, 'step')} left, about ${Math.round(stats.left)} minutes.` : 'All steps done.'}${unit ? ` ${U.esc(unit.title)}.` : ''}</p></header>
          ${ritual}${legacy}
          ${bar(sess, sel && sel.id)}
          <ol class="steps">${sess.steps.map(s => row(s, sel && s.id === sel.id)).join('')}</ol>
        </section>
        <section class="focus" aria-label="Current step"><div class="panel t-panel-slide" data-open="false">${content}</div></section>
      </div>`;
    },
    mount(root) {
      ui.bindFields(root);
      const panel = root.querySelector('.focus .panel');
      if (panel) requestAnimationFrame(() => requestAnimationFrame(() => panel.dataset.open = 'true'));
      root.querySelectorAll('.t-success-check path').forEach(path => { const len = Math.ceil(path.getTotalLength()) + 1; path.style.strokeDasharray = len; path.style.strokeDashoffset = len; });
      ui._justDone = null;
    },
  };

  function panelForDone(sel) {
    // A finished step that was clicked: show the item read-only, with history and notes.
    return ui.itemPanel(sel.ref, null);
  }

  ui.on('select-step', el => { ui._sel = ui._sel === el.dataset.step ? null : el.dataset.step; ui.render(); });
  ui.on('keep-going', () => { const n = E.keepGoing(); S.commit({ silent: true }); ui._sel = null; ui.render(); if (!n) ui.toast('Nothing left to add today.'); });
  ui.on('study-anyway', () => { E.studyAnyway(); S.commit({ silent: true }); ui.render(); });
  ui.on('dismiss-legacy', () => { S.state.profile.legacyConfirmed = true; S.commit(); });
})();
