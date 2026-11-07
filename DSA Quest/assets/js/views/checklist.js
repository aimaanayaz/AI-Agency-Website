/* Checklist: the same course as a plain list, like the old tracker. Tick things off in any order with one tap.
   Nothing else is asked for: "How did it go?" is offered once after a tick and can be ignored. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, ui = DQ.ui;
  const open = {};      // topics he opened or closed
  const more = {};      // "More practice" lists he opened
  let ticked = null;    // the row just ticked
  let reviseOpen = false;
  const revised = [];   // revised in this visit: they stay listed (done) so "How did it go?" can still be answered

  const SOLVE = [['clean', 'Clean'], ['struggle', 'Struggled'], ['hint', 'Needed a hint'], ['solution', 'Saw the solution']];
  const RECALL = [['remembered', 'Remembered'], ['fuzzy', 'Partly'], ['forgot', 'Forgot']];
  const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard' };

  const isTheory = ref => !E.isVideo(ref) && E.problem(E.idOf(ref)).d === 'T';
  const urlOf = ref => { if (E.isVideo(ref)) return U.ytUrl(E.idOf(ref)); const p = E.problem(E.idOf(ref)); return p.lc ? U.lcUrl(p.lc) : p.gfg || ''; };

  function metaOf(ref, unit, challenge) {
    if (E.isVideo(ref)) { const v = E.video(E.idOf(ref)) || { dur: 0 }; return `Lecture, ${Math.round(v.dur / 60)} min${unit && E.isEmbedded(ref, unit) ? ', solves the problem above' : ''}`; }
    const p = E.problem(E.idOf(ref));
    if (p.d === 'T') return 'Concept';
    return [E.showDiff(ref) ? DIFF[p.d] : '', E.isBlind75(p) ? 'Blind 75' : '', challenge ? 'Unit challenge' : ''].filter(Boolean).join(', ');
  }

  function how(ref, again) {
    const it = S.peek(ref) || {}, opts = again && it.attempts && it.attempts.slice(-1)[0].kind === 'recall' ? RECALL : SOLVE;
    return `<div class="ck-how" role="group" aria-label="How did it go?"><span>How did it go?</span>${opts.map(([k, l]) => `<button class="ck-how-opt" data-act="ck-amend" data-ref="${ref}" data-o="${k}" aria-pressed="${it.outcome === k}">${l}</button>`).join('')}</div>`;
  }

  function row(ref, unit, o = {}) {
    const done = o.again ? false : E.isDone(ref), url = urlOf(ref), title = U.esc(E.title(ref));
    const label = o.again ? `Revised ${title}` : done ? `Untick ${title}` : `Tick ${title}`;
    return `<li class="ck-row ${done ? 'is-done' : ''}">
      <button class="ck-tick" data-act="ck-tick" data-ref="${ref}" ${o.again ? 'data-again="1"' : ''} aria-pressed="${done}" aria-label="${label}"><span class="ck-box">${U.icon('check', 13)}</span></button>
      <span class="ck-main">${url ? `<a class="ck-title" href="${url}" target="_blank" rel="noopener">${title}</a>` : `<span class="ck-title">${title}</span>`}<span class="ck-meta">${U.esc(o.meta || metaOf(ref, unit, o.challenge))}</span></span>
      <button class="ck-notes" data-act="open" data-ref="${ref}" aria-label="Notes and hints for ${title}">${U.icon('note-pencil', 16)}</button>
      ${ticked === ref && !E.isVideo(ref) && !isTheory(ref) && (o.again || done) ? how(ref, o.again) : ''}
    </li>`;
  }

  // A topic's main list is its essentials (and the unit challenge); everything else waits under "More practice".
  function lists(u) {
    const main = [], extra = [], ch = E.challengeOf(u), core = E.coreBosses(u);
    u.lessons.forEach(l => E.orderedItems(l).forEach(i => { if (!i.optional) (E.isRequired(i, u) ? main : extra).push(i.ref); }));
    u.boss.forEach(b => (b === ch || core.includes(b) ? main : extra).push(b));
    return E.isKnown(u) ? { main: extra, extra: [], ch } : { main, extra, ch };
  }

  // A closed topic draws no rows (the whole course is ~500 of them); they are drawn when it opens.
  function topicBody(u) {
    const { main, extra, ch } = lists(u), moreOpen = !!more[u.id], extraDone = extra.filter(E.isDone).length;
    return `<ul class="ck-list">${main.map(r => row(r, u, { challenge: r === ch })).join('')}</ul>
        ${extra.length ? `<button class="ck-more" data-act="ck-more" data-unit="${u.id}" aria-expanded="${moreOpen}">${U.icon(moreOpen ? 'caret-down' : 'caret-right', 14)}<span>More practice</span><span class="num">${extraDone}/${extra.length}</span></button>
          ${moreOpen ? `<ul class="ck-list is-extra">${extra.map(r => row(r, u)).join('')}</ul>` : ''}` : ''}`;
  }

  function topic(u, cur) {
    const { main, extra } = lists(u);
    if (!main.length && !extra.length) return '';
    const done = main.filter(E.isDone).length, isOpen = open[u.id] !== undefined ? open[u.id] : u === cur;
    return `<div class="unit t-acc ${done === main.length ? 'is-complete' : ''} ${u === cur ? 'is-current' : ''}" data-open="${isOpen}" data-unit="${u.id}">
      <button class="unit-head" data-act="ck-toggle" aria-expanded="${isOpen}">
        <span class="unit-title">${U.esc(u.title)}</span>
        <span class="unit-progress"><span class="mini-bar"><span style="width:${main.length ? Math.round(done / main.length * 100) : 100}%"></span></span><span class="num">${done}/${main.length}</span></span>
        <span class="unit-when num">${done === main.length ? 'Done' : `${main.length - done} left`}</span>
        <span class="t-acc-chevron">${U.icon('caret-down', 14)}</span>
      </button>
      <div class="t-acc-panel"><div class="t-acc-panel-inner"><div class="ck-body">${isOpen ? topicBody(u) : ''}</div></div></div>
    </div>`;
  }

  function revise() {
    const due = E.dueAgain();
    if (!due.length && !revised.length) return '';
    const doneRows = revised.map(ref => `<li class="ck-row is-done"><span class="ck-tick" aria-hidden="true"><span class="ck-box">${U.icon('check', 13)}</span></span>
      <span class="ck-main"><span class="ck-title">${U.esc(E.title(ref))}</span><span class="ck-meta">Revised</span></span><span></span>
      ${ticked === ref ? how(ref, true) : ''}</li>`).join('');
    return `<section class="ck-revise ${reviseOpen ? 'is-open' : ''}">
      <button class="ck-revise-head" data-act="ck-revise" aria-expanded="${reviseOpen}">${U.icon('arrow-counter-clockwise', 16)}<span><b>Revise</b> <span class="num">${due.length}</span> ${due.length === 1 ? 'problem is' : 'problems are'} due</span><span class="muted small">Optional</span>${U.icon(reviseOpen ? 'caret-down' : 'caret-right', 14)}</button>
      ${reviseOpen ? `<ul class="ck-list">${doneRows}${due.slice(0, 12).map(d => row(d.ref, E.idx.loc[d.ref] && E.idx.loc[d.ref].unit, { again: true, meta: d.it.mode === 'recall' ? 'Say the approach out loud, then check your note' : 'Solve it again from scratch' })).join('')}</ul>` : ''}
    </section>`;
  }

  DQ.views.checklist = {
    render() {
      const cur = E.currentUnit(), start = E.startIndex(), core = E.coreCount();
      const secs = E.idx.sections.filter(s => s.index >= start).map(s => {
        const body = s.units.map(u => topic(u, cur)).join('');
        if (!body) return '';
        const sp = E.sectionProgress(s);
        return `<section class="sec"><h2>${U.esc(s.title)}${sp.total ? `<span class="muted num">${sp.done}/${sp.total}</span>` : ''}</h2>${body}</section>`;
      }).join('');
      const known = E.idx.sections.filter(s => s.index > 0 && s.index < start).map(s => s.units.map(u => topic(u, null)).join('')).join('');
      return `<div class="page">
        <header class="page-head"><h1>Checklist</h1>
          <p class="sub">The same course as a plain list. Tick things off in any order: one tap is enough. Essentials: <span class="num">${core.done}</span> of <span class="num">${core.total}</span> done.</p></header>
        ${revise()}
        ${secs}
        ${known ? `<section class="sec"><h2>Already known<span class="muted">extra practice</span></h2>${known}</section>` : ''}
      </div>`;
    },
  };

  ui.on('ck-toggle', el => {
    const u = el.closest('.unit'), now = u.dataset.open !== 'true', body = u.querySelector('.ck-body');
    if (now && !body.innerHTML.trim()) body.innerHTML = topicBody(E.idx.unitById[u.dataset.unit]);
    u.dataset.open = String(now); el.setAttribute('aria-expanded', String(now)); open[u.dataset.unit] = now;
  });
  ui.on('ck-more', el => { more[el.dataset.unit] = !more[el.dataset.unit]; ui.render(); });
  ui.on('ck-revise', () => { reviseOpen = !reviseOpen; ui.render(); });

  ui.on('ck-tick', el => {
    const ref = el.dataset.ref, it = S.peek(ref);
    if (el.dataset.again) {
      const mode = it && it.mode === 'recall' ? 'recall' : 'resolve';
      E.record({ ref, kind: 'again', mode }, mode === 'recall' ? 'remembered' : 'clean');
      ticked = ref; revised.push(ref);
    } else if (E.isDone(ref)) {
      // Unticking something from an earlier day wipes its history, so that one asks first.
      const today = !!(it && it.doneAt) && U.dayKey(new Date(it.doneAt)) === U.today();
      if (!today && !confirm(`Untick "${E.title(ref)}"? Its history goes with it.`)) return;
      E.undo(ref); ticked = null;
    } else {
      const mode = E.isVideo(ref) ? 'watch' : isTheory(ref) ? 'read' : 'solve';
      E.record({ ref, kind: 'new', mode }, mode === 'solve' ? 'clean' : 'done');
      ticked = mode === 'solve' ? ref : null;
    }
    S.commit({ silent: true });
    ui.render();
  });
  ui.on('ck-amend', el => { E.amend(el.dataset.ref, el.dataset.o); S.commit({ silent: true }); ui.render(); });
})();
