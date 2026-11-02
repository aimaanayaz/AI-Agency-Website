/* Progress: proof of growth, honest outcome mix, rewards he chooses, the finish line. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, ui = DQ.ui;

  function summary() {
    const a2z = E.a2zProgress(), locked = E.lockedCount();
    let days = 0; for (let i = 0; i < 14; i++) if (E.isActive(U.addDays(U.today(), -i))) days++;
    const core = E.coreCount();
    return `<p class="lede">Essentials: <b>${core.done} of ${core.total}</b> done (${a2z.done} of ${a2z.total} Striver A2Z problems in all). ${locked ? `<b>${locked}</b> ${locked === 1 ? 'is' : 'are'} locked in, meaning you solved ${locked === 1 ? 'it' : 'them'} cleanly again weeks later.` : 'None is locked in yet. A problem locks in when you solve it cleanly again weeks later.'} You studied on <b>${days} of the last 14 days</b>.</p>`;
  }

  // One row per problem: its first solve against its latest re-solve (like with like). Recalls are counted, never timed against a solve.
  function growthRows() {
    const rank = o => (E.outcomeMeta(o) || { rank: 0 }).rank, rows = [];
    Object.entries(S.state.items).forEach(([ref, it]) => {
      if (E.isVideo(ref)) return;
      const at = it.attempts || [];
      const first = at.find(a => a.kind === 'first') || (it.imported ? { outcome: 'imported', mins: 0 } : null);
      if (!first) return;
      const later = at.filter(a => a !== first); if (!later.length) return;
      const resolves = later.filter(a => a.kind === 'resolve'), last = resolves[resolves.length - 1];
      const recalled = later.filter(a => a.kind === 'recall' && a.outcome === 'remembered').length;
      const better = last && (rank(last.outcome) > rank(first.outcome) || (first.mins && last.mins && last.mins <= first.mins * 0.75 && rank(last.outcome) >= rank(first.outcome)));
      if (!better && !(recalled && !last)) return;
      rows.push({ ref, first, last: better ? last : null, recalled, returns: later.length, d: later[later.length - 1].d });
    });
    return rows.sort((a, b) => (a.d < b.d ? 1 : a.d > b.d ? -1 : 0));
  }
  function growth() {
    const rows = growthRows().slice(0, 12);
    if (!rows.length) return `<p class="empty">When an earlier problem comes back and you solve it better or faster than the first time, it shows up here. This is the proof that the work sticks.</p>`;
    const mark = (a, label) => { const m = E.outcomeMeta(a.outcome) || {}; return `<span class="tone-text-${m.tone || 'muted'}">${U.esc(label || m.label || 'First try')}</span>${a.mins ? `<span class="num muted">${a.mins} min</span>` : ''}`; };
    return `<ul class="growth">${rows.map(r => `<li>
        <button class="growth-title" data-act="open" data-ref="${r.ref}">${U.esc(E.title(r.ref))}</button>
        <span class="growth-then">${mark(r.first)}</span>
        ${r.last ? `${U.icon('arrow-right', 14)}<span class="growth-now">${mark(r.last)}</span>`
          : `<span class="growth-now growth-recall"><span class="muted">then</span><span class="tone-text-good">recalled it ${r.recalled === 1 ? 'once' : r.recalled + ' times'}</span></span>`}
        <span class="growth-when"><span class="muted">${U.plural(r.returns, 'return')}</span><span class="num muted">${U.fmtDay(r.d)}</span></span></li>`).join('')}</ul>`;
  }

  // Where you stand on the A2Z sheet: by difficulty (plus the Blind 75 classics), then by topic.
  function stand() {
    const b = E.breakdown(), L = { E: 'Easy', M: 'Medium', H: 'Hard' };
    const row = (label, c) => `<li class="${c.total && c.done === c.total ? 'is-complete' : ''}"><span class="stand-label">${label}</span><span class="mini-bar"><span style="width:${c.total ? Math.round((c.done / c.total) * 100) : 0}%"></span></span><span class="num muted">${c.done}/${c.total}</span></li>`;
    return `<ul class="stand">${b.byDiff.map(x => row(L[x.d], x)).join('')}${row('Blind 75 classics', b.blind)}</ul>
      <h3 class="stand-h">By topic</h3>
      <ul class="stand stand-topics">${b.topics.map(t => row(U.esc(t.title), t)).join('')}</ul>`;
  }

  function mix() {
    const counts = {}; let total = 0;
    Object.values(S.state.items).forEach(it => { if (it.firstOutcome && E.OUTCOMES[it.firstOutcome]) { counts[it.firstOutcome] = (counts[it.firstOutcome] || 0) + 1; total++; } });
    if (!total) return '<p class="empty">Your first attempts will be summarised here once you start recording outcomes.</p>';
    const keys = Object.keys(E.OUTCOMES).filter(k => counts[k]);
    return `<div class="mix" role="img" aria-label="How first attempts went">${keys.map(k => `<span class="mix-seg tone-bg-${E.OUTCOMES[k].tone}" style="flex:${counts[k]}"></span>`).join('')}</div>
      <ul class="legend">${keys.map(k => `<li><span class="sw tone-bg-${E.OUTCOMES[k].tone}"></span>${U.esc(E.OUTCOMES[k].label)}<span class="num muted">${counts[k]}</span></li>`).join('')}</ul>`;
  }

  function calendar() {
    const weeks = 20, today = U.today();
    const start = U.addDays(today, -(weeks * 7 - 1) - U.weekday(U.addDays(today, -(weeks * 7 - 1))));
    const cols = [];
    for (let w = 0; w <= weeks; w++) {
      const cells = [];
      for (let d = 0; d < 7; d++) {
        const k = U.addDays(start, w * 7 + d);
        if (k > today) { cells.push('<i class="cal-cell is-future"></i>'); continue; }
        const n = (S.state.days[k] || { steps: 0 }).steps;
        const l = n === 0 ? 0 : n < 3 ? 1 : n < 5 ? 2 : n < 8 ? 3 : 4;
        cells.push(`<i class="cal-cell l${l}" title="${U.fmtDay(k, { weekday: 'short', day: 'numeric', month: 'short' })}: ${U.plural(n, 'step')}"></i>`);
      }
      cols.push(`<span class="cal-col">${cells.join('')}</span>`);
    }
    return `<div class="cal">${cols.join('')}</div>`;
  }

  function rewards() {
    const list = S.state.rewards;
    const options = E.milestones().filter(m => !E.milestoneReached(m) && !list.some(r => !r.earnedAt && r.milestone.type === m.type && r.milestone.target === m.target));
    return `${list.length ? `<ul class="rewards">${list.map((r, i) => `<li class="${r.earnedAt ? 'is-earned' : ''}">
        <span class="rw-text"><b>${U.esc(r.text)}</b><span class="muted">${U.esc(r.label)}</span></span>
        ${r.earnedAt ? `<span class="chip tone-good">Earned ${U.fmtDay(U.dayKey(new Date(r.earnedAt)))}</span>` : (c => `<span class="rw-progress"><span class="mini-bar"><span style="width:${Math.round(E.milestoneProgress(r.milestone) * 100)}%"></span></span><span class="num muted">${c.done}/${c.total}</span></span>`)(E.milestoneCount(r.milestone))}
        <button class="icon-btn" data-act="rw-remove" data-i="${i}" aria-label="Remove">${U.icon('trash', 15)}</button></li>`).join('')}</ul>` : '<p class="empty">Rewards you pick yourself work better than points. Pair a milestone with something you actually want.</p>'}
      <form class="rw-form" data-act="none">
        <label class="field"><span class="field-label">When I</span><select class="input" id="rw-m">${options.slice(0, 40).map((m, i) => `<option value="${i}">${U.esc(m.label)}</option>`).join('')}</select></label>
        <label class="field grow"><span class="field-label">I get to</span><input class="input" id="rw-t" placeholder="A movie night, that keyboard"></label>
        <button class="btn btn-primary" data-act="rw-add">${U.icon('plus', 16)}<span>Add reward</span></button>
      </form>`;
  }

  DQ.views.progress = {
    render() {
      const p = S.state.profile;
      return `<div class="page narrow">
        <header class="page-head"><h1>Progress</h1></header>
        ${summary()}
        <section class="block"><h2>Then and now</h2>${growth()}</section>
        <section class="block"><h2>Where you stand</h2>${stand()}</section>
        <section class="block"><h2>How first attempts went</h2>${mix()}</section>
        <section class="block"><h2>Study days</h2>${calendar()}</section>
        <section class="block"><h2>Your rewards</h2>${rewards()}</section>
        <section class="block"><h2>Session ritual</h2>
          <p class="muted small">Keep something you enjoy only for DSA time, like a playlist. Pairing a treat with the work made people show up about 50% more often in a study of gym habits. It appears at the top of your path.</p>
          <div class="rw-form"><label class="field grow"><span class="field-label">Only during DSA</span><input class="input" data-prof-ritual="text" value="${U.esc(p.ritual.text)}" placeholder="My lo-fi focus playlist"></label>
          <label class="field grow"><span class="field-label">Link (optional)</span><input class="input" data-prof-ritual="url" value="${U.esc(p.ritual.url)}" placeholder="https://open.spotify.com/..."></label></div></section>
      </div>`;
    },
    mount(root) {
      root.querySelectorAll('[data-prof-ritual]').forEach(inp => inp.addEventListener('input', U.debounce(() => { S.state.profile.ritual[inp.dataset.profRitual] = inp.value.trim(); S.save(); }, 300)));
    },
  };

  ui.on('rw-add', () => {
    const text = document.getElementById('rw-t').value.trim(); if (!text) return ui.toast('Write the reward first.');
    const list = S.state.rewards;
    const options = E.milestones().filter(m => !E.milestoneReached(m) && !list.some(r => !r.earnedAt && r.milestone.type === m.type && r.milestone.target === m.target));
    const m = options[Number(document.getElementById('rw-m').value)]; if (!m) return;
    list.push({ milestone: { type: m.type, target: m.target }, label: m.label, text, createdAt: Date.now() });
    S.commit(); ui.toast('Reward saved. It unlocks the moment you get there.');
  });
  let removed = null;
  ui.on('rw-remove', el => {
    const i = Number(el.dataset.i); removed = { i, r: S.state.rewards[i] };
    S.state.rewards.splice(i, 1); S.commit();
    ui.toast(`<b>Reward removed</b><span class="toast-sub">${U.esc(removed.r.text)} <button class="link toast-undo" data-act="rw-undo">Undo</button></span>`, '', 6000);
  });
  ui.on('rw-undo', () => { if (!removed) return; S.state.rewards.splice(Math.min(removed.i, S.state.rewards.length), 0, removed.r); removed = null; S.commit(); });
})();
