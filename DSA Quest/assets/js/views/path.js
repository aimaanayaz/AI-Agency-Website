/* Syllabus: the whole path, in teaching order. No dates: he sets the pace. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, ui = DQ.ui, D = window.DQ_DATA;
  let query = '';
  const open = {};

  function itemRow(entry, unit, extra) {
    const ref = entry.ref, it = S.peek(ref) || {}, done = E.isDone(ref);
    const req = E.isRequired(entry, unit);
    let meta;
    if (E.isVideo(ref)) { const v = E.video(E.idOf(ref)) || { dur: 0 }; meta = `Lecture, ${Math.round(v.dur / 60)} min${E.isEmbedded(ref, unit) ? ', the solution to the problems above' : ''}`; }
    else { const p = E.problem(E.idOf(ref)); meta = p.d === 'T' ? 'Concept' : `${E.showDiff(ref) ? { E: 'Easy', M: 'Medium', H: 'Hard' }[p.d] : 'Problem'}${E.isBlind75(p) ? ', Blind 75' : ''}${ui.srcLabel(p) ? ', ' + ui.srcLabel(p).replace(/^\w/, c => c.toLowerCase()) : ''}`; }
    const o = it.outcome && E.outcomeMeta(it.outcome);
    return `<li><button class="prow ${done ? 'is-done' : ''} ${req ? '' : 'is-optional'}" data-act="open" data-ref="${ref}">
      ${ui.dot(it.outcome, done)}
      <span class="prow-title">${U.esc(E.title(ref))}${extra || ''}</span>
      <span class="prow-meta">${U.esc(meta)}${req ? '' : entry.optional ? ', optional' : ', extra practice'}</span>
      <span class="prow-status">${o && !E.isVideo(ref) ? `<span class="tone-text-${o.tone}">${U.esc(o.label)}</span>` : ''}${it.locked ? `<span class="locked">${U.icon('target', 14)}Locked in</span>` : ''}</span>
    </button></li>`;
  }

  function unitBlock(u, cur) {
    const up = E.unitProgress(u);
    const isOpen = open[u.id] !== undefined ? open[u.id] : u === cur;
    const ch = E.challengeOf(u);
    const when = up.complete ? 'Done' : `${up.total - up.done} left`;
    return `<div class="unit t-acc ${up.complete ? 'is-complete' : ''} ${u === cur ? 'is-current' : ''}" data-open="${isOpen}" data-unit="${u.id}">
      <button class="unit-head" data-act="unit-toggle" aria-expanded="${isOpen}">
        <span class="unit-title">${U.esc(u.title)}</span>
        <span class="unit-progress"><span class="mini-bar"><span style="width:${Math.round(up.pct * 100)}%"></span></span><span class="num">${up.done}/${up.total}</span></span>
        <span class="unit-when num">${when}</span>
        <span class="t-acc-chevron">${U.icon('caret-down', 14)}</span>
      </button>
      <div class="t-acc-panel"><div class="t-acc-panel-inner"><div class="unit-body">
        ${u.desc ? `<p class="unit-desc">${U.esc(u.desc)}</p>` : ''}
        ${u.lessons.map(l => `<div class="lesson"><h4>${U.esc(l.title)}</h4><ul class="prows">${E.orderedItems(l).map(i => itemRow(i, u)).join('')}</ul></div>`).join('')}
        ${u.boss.length ? `<div class="lesson"><h4>Challenge problems</h4><ul class="prows">${u.boss.map((b, i) => itemRow({ ref: b, optional: !(ch && i === 0) }, u)).join('')}</ul></div>` : ''}
        ${u.guide && u.guide.keys ? `<div class="guide"><h4>Remember from this unit</h4><ul>${u.guide.keys.map(k => `<li>${U.esc(k)}</li>`).join('')}</ul>${u.guide.traps ? `<h4>Common traps</h4><ul>${u.guide.traps.map(k => `<li>${U.esc(k)}</li>`).join('')}</ul>` : ''}</div>` : ''}
      </div></div></div>
    </div>`;
  }

  function beyond() {
    const F = D.future, done = S.state.future;
    const total = F.branches.reduce((s, b) => s + b.quests.length, 0), n = Object.keys(done).length;
    return `<section class="beyond t-acc" data-open="${!!open.beyond}">
      <button class="unit-head" data-act="beyond-toggle" aria-expanded="${!!open.beyond}"><span class="unit-title">Beyond DSA: what 2027-28 interviews also test</span><span class="unit-progress"><span class="num">${n}/${total}</span></span><span class="unit-when"></span><span class="t-acc-chevron">${U.icon('caret-down', 14)}</span></button>
      <div class="t-acc-panel"><div class="t-acc-panel-inner"><div class="unit-body">
        <p class="unit-desc">${U.esc(F.headline)}</p>
        <ul class="evidence">${F.evidence.map(e => `<li><b>${U.esc(e.title)}.</b> ${U.esc(e.so)} <span class="src">${e.src.map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener">${U.esc(l)}</a>`).join(', ')}</span></li>`).join('')}</ul>
        ${F.branches.map(b => `<div class="lesson"><h4>${U.esc(b.title)}</h4><p class="muted small">${U.esc(b.why)}</p><ul class="checks">${b.quests.map(([id, t, d]) => `<li><label class="check-row"><input type="checkbox" data-future="${id}" ${done[id] ? 'checked' : ''}><span><b>${U.esc(t)}</b><span class="muted">${U.esc(d)}</span></span></label></li>`).join('')}</ul></div>`).join('')}
      </div></div></div>
    </section>`;
  }

  function results() {
    const q = query.toLowerCase(); const out = [];
    E.idx.units.forEach(u => {
      u.lessons.forEach(l => l.items.forEach(i => { if (E.title(i.ref).toLowerCase().includes(q)) out.push([i, u]); }));
      u.boss.forEach(b => { if (E.title(b).toLowerCase().includes(q)) out.push([{ ref: b, optional: true }, u]); });
    });
    return out.length ? `<ul class="prows results">${out.slice(0, 80).map(([i, u]) => itemRow(i, u, `<span class="muted"> in ${U.esc(u.title)}</span>`)).join('')}</ul>` : `<p class="empty">Nothing matches "${U.esc(query)}".</p>`;
  }

  DQ.views.path = {
    render() {
      const a2z = E.a2zProgress(), cur = E.currentUnit();
      return `<div class="page">
        <header class="page-head"><h1>Syllabus</h1>
          <p class="sub">Everything on the path, in order. Essentials: <span class="num">${E.coreCount().done}</span> of <span class="num">${E.coreCount().total}</span> done. Dimmed rows are extra practice, which comes after the essentials (<span class="num">${E.extraLeft()}</span> left).</p></header>
        <div class="toolbar"><label class="search">${U.icon('magnifying-glass', 16)}<input class="input" data-search placeholder="Find a problem or lecture" value="${U.esc(query)}" aria-label="Search the path"></label></div>
        <div id="path-body">${query ? results() : E.idx.sections.map(sec => {
          const sp = E.sectionProgress(sec);
          return `<section class="sec"><h2>${U.esc(sec.title)}<span class="muted num">${sp.done}/${sp.total}</span></h2>${sec.units.map(u => unitBlock(u, cur)).join('')}</section>`;
        }).join('') + beyond()}</div>
      </div>`;
    },
    mount(root) {
      const s = root.querySelector('[data-search]');
      if (s) s.addEventListener('input', U.debounce(() => { query = s.value.trim(); const cur = E.currentUnit(); root.querySelector('#path-body').innerHTML = query ? results() : E.idx.sections.map(sec => { const sp = E.sectionProgress(sec); return `<section class="sec"><h2>${U.esc(sec.title)}<span class="muted num">${sp.done}/${sp.total}</span></h2>${sec.units.map(u => unitBlock(u, cur)).join('')}</section>`; }).join('') + beyond(); }, 180));
      if (!DQ.views.path._scrolled) { DQ.views.path._scrolled = true; const c = root.querySelector('.unit.is-current'); if (c) setTimeout(() => c.scrollIntoView({ block: 'start' }), 30); }
    },
  };
  window.addEventListener('hashchange', () => { if (!location.hash.startsWith('#/path')) DQ.views.path._scrolled = false; });

  ui.on('unit-toggle', el => { const u = el.closest('.unit'); const now = u.dataset.open !== 'true'; u.dataset.open = String(now); el.setAttribute('aria-expanded', String(now)); open[u.dataset.unit] = now; });
  ui.on('beyond-toggle', el => { const b = el.closest('.beyond'); const now = b.dataset.open !== 'true'; b.dataset.open = String(now); el.setAttribute('aria-expanded', String(now)); open.beyond = now; });
  document.addEventListener('change', e => {
    const id = e.target.dataset && e.target.dataset.future; if (!id) return;
    if (e.target.checked) S.state.future[id] = Date.now(); else delete S.state.future[id];
    S.save();
  });
})();
