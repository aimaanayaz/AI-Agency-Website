/* Notebook: every note and key idea, together. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, ui = DQ.ui;
  let query = '', filter = 'all';
  const FILTERS = [['all', 'All notes'], ['pinned', 'Pinned'], ['work', 'Needs work'], ['old', 'Old tracker']];

  // Weak outcomes only: not optimal, needed a hint, halfway, from the solution, or a recall that did not fully come back.
  const WEAK = new Set(['brute', 'hint', 'half', 'solution', 'fuzzy', 'forgot']);
  const needsWork = it => WEAK.has(it.outcome);

  function entries() {
    const q = query.toLowerCase(), out = [];
    E.idx.units.forEach(u => {
      const refs = []; u.lessons.forEach(l => l.items.forEach(i => refs.push(i.ref))); refs.push(...u.boss);
      refs.forEach(ref => {
        const it = S.peek(ref); if (!it) return;
        if (filter === 'pinned' ? !it.pinned : filter === 'work' ? !needsWork(it) : filter === 'old' ? !it.imported : !E.hasNote(it)) return;
        if (q && ![E.title(ref), it.key, it.note].join(' ').toLowerCase().includes(q)) return;
        out.push({ ref, it, unit: u });
      });
    });
    return out;
  }

  function list() {
    const items = entries();
    if (!items.length) {
      const msg = query ? `Nothing matches "${U.esc(query)}".` : filter === 'pinned' ? 'Pin a problem from its panel to keep it here.' : filter === 'work' ? 'Problems you solved with help, solved the slow way or could not recall show up here.' : filter === 'old' ? 'Problems done on your old tracker show up here, so you can add notes to them.' : 'Write a key idea or a note on any problem or lecture and it collects here.';
      return `<p class="empty">${msg}</p>`;
    }
    let lastUnit = null; let html = '';
    items.forEach(({ ref, it, unit }) => {
      if (unit !== lastUnit) { html += `<h2 class="nb-unit">${U.esc(unit.title)}</h2>`; lastUnit = unit; }
      const when = it.doneAt ? U.fmtDay(U.dayKey(new Date(it.doneAt))) : '';
      html += `<article class="nb-entry">
        <header><button class="nb-title" data-act="open" data-ref="${ref}">${U.esc(E.title(ref))}</button>${it.outcome ? ui.outcomeChip(it.outcome) : ''}<span class="muted num">${when}</span></header>
        ${it.key ? `<p class="nb-key">${U.esc(it.key)}</p>` : ''}
        ${it.note ? `<p class="nb-note">${U.esc(it.note)}</p>` : ''}
        ${!it.key && !it.note ? '<p class="muted small">No note yet. Open it to add one.</p>' : ''}
      </article>`;
    });
    return html;
  }

  DQ.views.notebook = {
    render() {
      const n = Object.values(S.state.items).filter(E.hasNote).length;
      return `<div class="page narrow">
        <header class="page-head"><h1>Notebook</h1><p class="sub">${U.plural(n, 'note')}, grouped by unit in the order you learn them.</p></header>
        <div class="toolbar">
          <div class="t-tabs" role="tablist" aria-label="Filter notes"><span class="t-tabs-pill" aria-hidden="true"></span>${FILTERS.map(([k, l]) => `<button class="t-tab" role="tab" aria-selected="${filter === k}" data-act="nb-filter" data-k="${k}">${l}</button>`).join('')}</div>
          <label class="search">${U.icon('magnifying-glass', 16)}<input class="input" data-search placeholder="Search your notes" value="${U.esc(query)}" aria-label="Search notes"></label>
          <button class="btn" data-act="nb-export">${U.icon('download-simple', 16)}<span>Export</span></button>
        </div>
        <div id="nb-list">${list()}</div>
      </div>`;
    },
    mount(root) {
      const s = root.querySelector('[data-search]');
      s.addEventListener('input', U.debounce(() => { query = s.value.trim(); root.querySelector('#nb-list').innerHTML = list(); }, 180));
      moveTabs(root, false);
    },
  };

  function moveTabs(root, animate) {
    const bar = root.querySelector('.t-tabs'); if (!bar) return;
    const pill = bar.querySelector('.t-tabs-pill'), tab = bar.querySelector('[aria-selected="true"]');
    if (!animate) { const prev = pill.style.transition; pill.style.transition = 'none'; pill.style.transform = `translateX(${tab.offsetLeft}px)`; pill.style.width = `${tab.offsetWidth}px`; void pill.offsetWidth; pill.style.transition = prev; }
    else { pill.style.transform = `translateX(${tab.offsetLeft}px)`; pill.style.width = `${tab.offsetWidth}px`; }
  }
  window.addEventListener('resize', () => { if (ui.route() === 'notebook') moveTabs(document, false); });

  ui.on('nb-filter', el => {
    filter = el.dataset.k;
    el.parentNode.querySelectorAll('.t-tab').forEach(t => t.setAttribute('aria-selected', String(t === el)));
    moveTabs(document, true);
    document.getElementById('nb-list').innerHTML = list();
  });
  ui.on('nb-export', () => {
    const lines = ['# My DSA notebook', '', `Exported ${U.fmtLong(U.today())} from DSA Quest.`, ''];
    let last = null;
    E.idx.units.forEach(u => {
      const refs = []; u.lessons.forEach(l => l.items.forEach(i => refs.push(i.ref))); refs.push(...u.boss);
      refs.forEach(ref => {
        const it = S.peek(ref); if (!E.hasNote(it)) return;
        if (u !== last) { lines.push(`## ${u.title}`, ''); last = u; }
        const p = !E.isVideo(ref) && E.problem(E.idOf(ref));
        lines.push(`### ${E.title(ref)}${p && p.lc ? ` (${U.lcUrl(p.lc)})` : ''}`);
        if (it.outcome) lines.push(`_${(E.outcomeMeta(it.outcome) || {}).label || ''}_`);
        if (it.key) lines.push('', `**Key idea:** ${it.key}`);
        if (it.note) lines.push('', it.note);
        lines.push('');
      });
    });
    U.download(`dsa-notebook-${U.today()}.md`, lines.join('\n'), 'text/markdown');
  });
})();
