/* Path: the line. One ordered path (A, then B, then C) with the last steps done, the step he is on now,
   and what comes next, joined by a rail that is indigo up to "now". No days, no time budgets. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, ui = DQ.ui;
  const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' };
  let lastBar = null; // { unit, pct } so the unit bar can grow from where it was

  function stepMeta(s) {
    const it = S.peek(s.ref) || {};
    if (s.mode === 'watch') {
      const v = E.video(E.idOf(s.ref)) || {};
      return `${v.src === 'babbar' ? 'Babbar lecture' : 'Striver lecture'}${v.dur ? `, <span class="num">${Math.round(v.dur / 60)}</span> min` : ''}`;
    }
    const p = E.problem(E.idOf(s.ref)); if (!p) return '';
    if (s.kind === 'again') return `Revisit, ${U.esc(E.lastSeenText(it).toLowerCase())}, ${s.mode === 'recall' ? 'quick recall' : 're-solve'}`;
    if (s.mode === 'read') return 'Concept';
    const diff = E.showDiff(s.ref) ? DIFF[p.d] || '' : 'Problem';
    return `${diff}${E.isBlind75(p) ? ', Blind 75' : ''}${s.challenge || p.src === 'boss' ? ', unit challenge' : ''}`;
  }

  const thumb = (s, big) => (s.mode === 'watch' ? `<span class="node-thumb${big ? ' is-big' : ''}"><img src="https://i.ytimg.com/vi/${E.idOf(s.ref)}/mqdefault.jpg" alt="" loading="lazy"></span>` : '');

  function nodeDot(kind, s) {
    if (kind === 'now') return '<span class="node-dot is-now" aria-hidden="true"></span>';
    if (kind === 'past') {
      const m = E.outcomeMeta(s.outcome);
      const just = ui._justDone && ui._justDone === s.id;
      return `<span class="node-dot is-past tone-${m ? m.tone : 'muted'}" aria-hidden="true">${just
        ? '<span class="t-success-check" data-state="in"><svg viewBox="0 0 24 24" fill="none" width="12" height="12"><path d="M6 12.5l4 4 8-9" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg></span>'
        : U.icon('check', 12)}</span>`;
    }
    return `<span class="node-dot${s.kind === 'again' ? ' is-again' : ''}" aria-hidden="true">${s.kind === 'again' ? U.icon('arrow-counter-clockwise', 10) : ''}</span>`;
  }

  function row(kind, s, selId) {
    const sel = s.id === selId;
    const meta = kind === 'past'
      ? (o => (o ? `<span class="tone-text-${o.tone}">${U.esc(o.label)}</span>` : s.mode === 'watch' ? 'Watched' : 'Done'))(E.outcomeMeta(s.outcome))
      : stepMeta(s);
    const cls = ['node', `is-${kind}`, kind === 'next' && s.kind === 'again' ? 'is-again' : '', sel ? 'is-selected' : '', kind === 'past' && ui._justDone === s.id ? 'is-just' : '', kind === 'now' && ui._arrived ? 'is-arriving' : ''].filter(Boolean).join(' ');
    return `<li class="${cls}"><button class="node-btn" data-act="select-step" data-step="${s.id}" ${kind === 'now' ? 'aria-current="step"' : ''}>
      ${nodeDot(kind, s)}
      <span class="node-body"><span class="node-title">${U.esc(E.title(s.ref))}</span><span class="node-meta">${meta}</span></span>
      ${thumb(s, kind === 'now')}
    </button>${kind === 'now' ? nowActions(s) : ''}</li>`;
  }

  // Phone only (hidden on desktop, where the side panel holds these): the current step's actions, within thumb reach.
  function nowActions(s) {
    const p = !E.isVideo(s.ref) && E.problem(E.idOf(s.ref));
    const open = (label, cls = 'btn') => `<button class="${cls}" data-act="open-step" data-step="${s.id}">${label}</button>`;
    let primary = '';
    if (s.mode === 'watch') primary = `<a class="btn btn-primary" href="${U.ytUrl(E.idOf(s.ref))}" target="_blank" rel="noopener" data-act="start-timer" data-ref="${s.ref}">${U.icon('play', 16)}<span>Watch</span></a>`;
    else if (s.mode === 'read') primary = `<a class="btn btn-primary" href="${p.gfg || U.google(p.t + ' java explained')}" target="_blank" rel="noopener">${U.icon('book-open', 16)}<span>Read about it</span></a>`;
    else if (s.mode !== 'recall') { const l = E.practiceLink(p); primary = `<a class="btn btn-primary" href="${l.url}" target="_blank" rel="noopener" data-act="start-timer" data-ref="${s.ref}">${U.icon('arrow-square-out', 16)}<span>Open on ${l.label}</span></a>`; }
    const second = s.mode === 'recall' ? open('Recall it', 'btn btn-primary') : s.mode === 'watch' || s.mode === 'read' ? open('Notes and done') : open('How did it go?');
    return `<div class="node-actions">${primary}${second}</div>`;
  }

  // Phone: a step opens in a bottom sheet; the path stays where it is behind it.
  function openStep(id) {
    const step = E.line(12).find(x => x.id === id);
    if (step) return ui.openSheet(step.ref, step);
    const past = E.recent(2).find(x => 'log:' + x.at === id);
    if (past) ui.openSheet(past.ref, null);
  }

  // The line: last two done, the current step, then what comes next, with a divider where a new unit starts.
  function line(steps, selId) {
    const past = E.recent(2).reverse().map(x => ({ id: 'log:' + x.at, ref: x.ref, kind: x.kind, mode: x.mode, outcome: x.outcome }));
    if (ui._justDone && past.length) past[past.length - 1].id = ui._justDone;
    let html = past.map(s => row('past', s, selId)).join('');
    // Dividers compare against the unit in the header; revisits from older units never start a new section.
    let unitNow = E.currentUnit();
    steps.forEach((s, i) => {
      const u = s.kind === 'new' && E.idx.loc[s.ref] ? E.idx.loc[s.ref].unit : null;
      if (u && u !== unitNow) { html += `<li class="line-unit"><span>${U.esc(u.title)}</span></li>`; unitNow = u; }
      html += row(i === 0 ? 'now' : 'next', s, selId);
    });
    return html;
  }

  function finishedPanel() {
    return `<div class="panel-inner done-state">
      <span class="t-success-check big-check" data-state="in"><svg viewBox="0 0 48 48" fill="none" width="52" height="52"><circle cx="24" cy="24" r="22" class="check-ring"/><path d="M15 24.5l6.5 6.5L33.5 18" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
      <h2>The path is done</h2>
      <p class="muted">Every lecture and problem is finished and nothing is due to revisit right now. Earlier problems will come back here when it's time.</p>
    </div>`;
  }

  DQ.views.today = {
    render() {
      const steps = E.line(12), p = S.state.profile;
      const unit = E.currentUnit(), up = E.unitProgress(unit);
      const picked = ui._sel && (steps.find(s => s.id === ui._sel) || E.recent(2).map(x => ({ id: 'log:' + x.at, ref: x.ref })).find(s => s.id === ui._sel));
      const sel = picked || steps[0] || null;
      const isStep = sel && steps.includes(sel);
      ui._ctxStep = isStep ? sel : null;
      const content = !sel ? finishedPanel() : ui.itemPanel(sel.ref, isStep ? sel : null);
      const pct = Math.round(up.pct * 100);
      const from = lastBar && lastBar.unit === unit.id ? lastBar.pct : pct;
      lastBar = { unit: unit.id, pct };
      const wins = (S.state.days[U.today()] || {}).wins || [];
      const ritual = p.ritual && p.ritual.text ? `<p class="ritual">${U.icon('sparkle', 14)}<span>${p.ritual.url ? `<a href="${U.esc(p.ritual.url)}" target="_blank" rel="noopener">${U.esc(p.ritual.text)}</a>` : U.esc(p.ritual.text)}</span></p>` : '';
      const left = Math.max(0, up.total - up.done);
      return `<div class="today">
        <section class="session" aria-label="The path">
          <header class="unit-hero">
            <h1>${U.esc(unit.title)}</h1>
            <p class="sub"><span class="num">${up.done}/${up.total}</span> done in this unit, unit <span class="num">${unit.index + 1}</span> of <span class="num">${E.idx.units.length}</span></p>
            <div class="unit-bar" role="img" aria-label="${pct}% of this unit done"><span data-to="${pct}" style="width:${from}%"></span></div>
            ${unit.desc ? `<p class="unit-lede">${U.esc(unit.desc)}</p>` : ''}
            <p class="phone-stats"><span>${U.icon('fire', 15)}<span>${E.streak() ? `<span class="num">${E.streak()}</span> ${E.streak() === 1 ? 'day' : 'days'} in a row` : 'Start a streak today'}</span></span><span>${U.icon('check-circle', 15)}<span><span class="num">${E.doneToday()}</span> done today</span></span>${DQ.sync.enabled ? `<span class="sync-line" data-sync-line>${ui.syncLine()}</span>` : ''}</p>
            ${ritual}
            ${wins.length ? `<ul class="wins">${wins.map(w => `<li>${U.icon(w.type === 'reward' ? 'gift' : 'flag-pennant', 16)}<span><b>${U.esc(w.title)}</b><span>${U.esc(w.sub)}</span></span></li>`).join('')}</ul>` : ''}
          </header>
          ${steps.length ? `<ol class="line">${line(steps, sel && sel.id)}</ol>
          <p class="line-more">${left > 1 ? `<span class="num">${left}</span> steps left in this unit. ` : ''}<a href="#/path">See the whole syllabus</a></p>` : ''}
        </section>
        <section class="focus" aria-label="Current step"><div class="panel t-panel-slide" data-open="false">${content}</div></section>
      </div>`;
    },
    mount(root) {
      ui.bindFields(root);
      const panel = root.querySelector('.focus .panel');
      if (panel) requestAnimationFrame(() => requestAnimationFrame(() => (panel.dataset.open = 'true')));
      root.querySelectorAll('.t-success-check path').forEach(path => { const len = Math.ceil(path.getTotalLength()) + 1; path.style.strokeDasharray = len; path.style.strokeDashoffset = len; });
      const bar = root.querySelector('.unit-bar > span');
      if (bar) requestAnimationFrame(() => requestAnimationFrame(() => (bar.style.width = bar.dataset.to + '%')));
      ui._justDone = null; ui._arrived = false;
    },
  };

  ui.on('select-step', el => {
    if (ui.compact()) return openStep(el.dataset.step);
    ui._sel = ui._sel === el.dataset.step ? null : el.dataset.step; ui.render();
  });
  ui.on('open-step', el => openStep(el.dataset.step));
})();
