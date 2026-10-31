/* Shell: routing, sidebar, the shared item panel, outcomes, sheet, toasts, timer. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, D = window.DQ_DATA;
  const ui = (DQ.ui = { actions: {} });
  DQ.views = DQ.views || {};
  ui.on = (name, fn) => { ui.actions[name] = fn; };

  const NAV = [['today', 'Path', 'path'], ['path', 'Syllabus', 'list-checks'], ['notebook', 'Notebook', 'notebook'], ['progress', 'Progress', 'chart-line-up']];

  // ───────────────────────── Router
  ui.route = () => location.hash.replace(/^#\/?/, '').split('?')[0] || 'today';
  ui.params = () => new URLSearchParams(location.hash.split('?')[1] || '');
  ui.render = () => {
    const ob = !S.state.onboarded;
    document.body.classList.toggle('is-onboarding', ob);
    const r = ui.route(), view = ob ? DQ.views.onboarding : DQ.views[r] || DQ.views.today;
    const main = document.getElementById('main');
    // On laptops .main is the scroll container; on narrow screens the window is.
    const same = ui._last === r, y = same ? main.scrollTop || window.scrollY : 0;
    if (!same) ui._sel = null;
    main.innerHTML = view.render(ui.params());
    main.scrollTop = y; window.scrollTo(0, y);
    if (view.mount) view.mount(main);
    ui._last = r;
    ui.renderSidebar();
  };

  ui.renderSidebar = () => {
    const r = ui.route(), streak = E.streak();
    document.getElementById('sidebar').innerHTML = `
      <a class="brand" href="#/today"><span class="brand-mark">DQ</span><span>DSA Quest</span></a>
      <nav class="nav" aria-label="Main">${NAV.map(([id, label, ic]) => `<a class="nav-item" href="#/${id}" ${r === id ? 'aria-current="page"' : ''}>${U.icon(ic)}<span>${label}</span></a>`).join('')}</nav>
      <div class="side-foot">
        <div class="side-stat">${U.icon('fire', 16)}<span>${streak ? U.plural(streak, 'day') + ' in a row' : 'Start a streak today'}</span></div>
        <div class="side-stat">${U.icon('check-circle', 16)}<span><span class="num">${E.doneToday()}</span> done today</span></div>
        ${DQ.sync.enabled ? `<div class="side-stat sync-line" id="sync-line">${ui.syncLine()}</div>` : ''}
        <a class="nav-item" href="#/settings" ${r === 'settings' ? 'aria-current="page"' : ''}>${U.icon('gear-six')}<span>Settings</span></a>
      </div>`;
  };

  // Online saving status (hosted copy only). Updated in place, no re-render.
  ui.syncLine = () => {
    const s = DQ.sync.status, label = DQ.sync.label();
    return label ? `${U.icon(s === 'offline' || s === 'error' ? 'cloud-slash' : 'cloud-check', 16)}<span>${label}</span>` : '';
  };
  DQ.sync.onStatus(() => {
    const el = document.getElementById('sync-line'); if (!el) return;
    el.innerHTML = ui.syncLine(); el.dataset.status = DQ.sync.status;
  });

  // ───────────────────────── Small building blocks
  const DIFF = { E: 'Easy', M: 'Medium', H: 'Hard', T: 'Concept' };
  ui.diff = d => `<span class="chip diff-${d}">${DIFF[d] || d}</span>`;
  ui.outcomeChip = o => { const m = E.outcomeMeta(o); return m ? `<span class="chip tone-${m.tone}">${U.esc(m.label)}</span>` : ''; };
  ui.dot = (o, done) => {
    if (!done) return '<span class="dot dot-todo" aria-hidden="true"></span>';
    const m = E.outcomeMeta(o);
    return `<span class="dot tone-${m ? m.tone : 'muted'}" aria-hidden="true">${U.icon('check', 12)}</span>`;
  };
  ui.srcLabel = p => (p.src === 'boss' ? 'Unit challenge' : p.src === 'babbar' ? "From Babbar's lecture" : p.src === 'bonus' ? 'Warm-up' : '');
  const linkBtn = (label, url, icon = 'arrow-square-out') => `<a class="btn btn-quiet" href="${url}" target="_blank" rel="noopener">${U.icon(icon, 16)}<span>${label}</span></a>`;

  // ───────────────────────── The item panel (session step or browse)
  ui.panelMode = (ref, step) => {
    if (step) return step.mode;
    const kind = E.kindOf(ref);
    if (kind === 'video') return 'watch-all';
    if (kind === 'theory') return 'read';
    return E.isSolved(ref) ? 'again' : 'solve';
  };

  function instruction(ref, mode, it) {
    const last = it && (it.attempts || []).slice(-1)[0];
    const lastTxt = last ? `${(E.outcomeMeta(last.outcome) || {}).label || 'Done'}${last.mins ? ', ' + last.mins + ' min' : ''}` : '';
    if (mode === 'solve') { const p = E.problem(E.idOf(ref)); return p && p.src === 'boss' ? "A problem you haven't seen, to check you really own this unit. No hints for the first 25 minutes." : 'Try it on your own first. Open a hint only when you are truly stuck.'; }
    if (mode === 'resolve') return `${E.lastSeenText(it)}. Re-solve it from scratch.${it && it.aim === 'optimal' ? ' Go for the optimal approach this time.' : ''}${lastTxt ? ' Last time: ' + lastTxt + '.' : ''}`;
    if (mode === 'recall') return `${E.lastSeenText(it)}. Without opening it, say how you'd solve it: the pattern, the key idea and the complexity. Then check your note.`;
    if (mode === 'read') return 'A short concept. Read it once, then write the one idea you want to remember.';
    return '';
  }

  // A unit challenge is a small mock interview: hints stay closed for the first 25 minutes on the timer.
  const lockLeft = ref => Math.max(0, Math.ceil(E.CHALLENGE_LOCK_MIN - E.timerSeconds(ref) / 60));
  const lockText = ref => (S.state.timer && S.state.timer.ref === ref ? `Hints open in ${lockLeft(ref)} min` : `Hints open ${E.CHALLENGE_LOCK_MIN} minutes after you start`);
  function hintLock(ref) {
    return `<div class="hint-lock">${U.icon('lock-simple', 16)}<span data-unlock-ref="${ref}">${lockText(ref)}</span>
      <button class="link" data-act="unlock-hints" data-ref="${ref}">Show them anyway</button></div>`;
  }

  function helpBlock(ref, p, mode) {
    const it = S.peek(ref) || {};
    if (p.src === 'boss' && mode === 'solve' && !it.hintUnlocked && lockLeft(ref) > 0) return hintLock(ref);
    const lec = E.idx.lectureFor[E.idOf(ref)], lecV = lec && E.video(lec);
    const pats = p.pt.map(k => D.patterns[k]).filter(Boolean);
    return `<div class="t-acc acc" data-open="false">
      <button class="acc-head" data-act="acc" aria-expanded="false">${U.icon('lightbulb', 16)}<span>Stuck? Hints and solutions</span><span class="t-acc-chevron">${U.icon('caret-down', 14)}</span></button>
      <div class="t-acc-panel"><div class="t-acc-panel-inner"><div class="acc-body">
        <button class="hint ${S.peek(ref) && S.peek(ref).hintSeen ? 'is-seen' : ''}" data-act="hint" data-ref="${ref}"><span class="hint-label">Hint</span><span class="hint-text">${U.esc(p.h)}</span></button>
        <div class="link-row">
          ${p.yt ? linkBtn("Striver's video", U.ytUrl(p.yt), 'youtube-logo') : linkBtn('Find a video', U.ytSearch('take U forward ' + p.t + ' java'), 'magnifying-glass')}
          ${lecV ? linkBtn(`Babbar, lecture ${lecV.lec}`, U.ytUrl(lec), 'youtube-logo') : ''}
          ${p.lc ? linkBtn('Editorial', U.lcEditorial(p.lc), 'book-open') + linkBtn('Java solutions', U.lcSolutions(p.lc), 'code') : ''}
          <button class="btn btn-quiet" data-act="ai-tutor" data-ref="${ref}">${U.icon('robot', 16)}<span>Ask AI as a tutor</span></button>
        </div>
        ${pats.length ? `<div class="pattern-line"><span class="muted">Pattern</span> ${S.peek(ref) && S.peek(ref).patternSeen || E.isSolved(ref) ? pats.map(x => `<button class="chip chip-btn" data-act="pattern" data-k="${p.pt[pats.indexOf(x)]}">${U.esc(x.name)}</button>`).join(' ') : `<button class="chip chip-btn" data-act="reveal-pattern" data-ref="${ref}">Show the pattern</button>`}</div>` : ''}
        <div class="pattern-slot"></div>
      </div></div></div>
    </div>`;
  }

  function notesBlock(ref, mode, it) {
    const hidden = mode === 'recall' && !ui._revealed[ref];
    if (hidden) return `<section class="notes"><button class="btn btn-quiet wide" data-act="reveal-note" data-ref="${ref}">${U.icon('eye', 16)}<span>I've said it. Show my note</span></button></section>`;
    return `<section class="notes">
      <label class="field"><span class="field-label">Key idea</span><input class="input" data-field="key" data-ref="${ref}" value="${U.esc(it.key || '')}" placeholder="The one line that cracks it"></label>
      <label class="field"><span class="field-label">Notes</span><textarea class="input textarea" rows="4" data-field="note" data-ref="${ref}" placeholder="Approach, complexity, edge cases, Java gotchas">${U.esc(it.note || '')}</textarea></label>
    </section>`;
  }

  function outcomeBlock(ref, mode) {
    const set = mode === 'recall' ? E.RECALL : E.OUTCOMES;
    const q = mode === 'recall' ? 'Did it come back?' : 'How did it go?';
    return `<section class="outcome"><h3>${q}</h3><div class="outcome-list" role="group" aria-label="${q}">
      ${Object.entries(set).map(([k, o], i) => `<button class="outcome-opt tone-${o.tone}" data-act="choose" data-ref="${ref}" data-outcome="${k}"><span class="kbd">${i + 1}</span><span class="o-text"><b>${U.esc(o.label)}</b><span>${U.esc(o.sub)}</span></span></button>`).join('')}
    </div></section>`;
  }

  ui.itemPanel = (ref, step) => {
    const it = S.peek(ref) || {}, mode = ui.panelMode(ref, step);
    const kind = E.kindOf(ref);
    const timerOn = S.state.timer && S.state.timer.ref === ref;
    const timer = `<button class="timer ${timerOn && S.state.timer.running ? 'is-running' : ''}" data-act="timer" data-ref="${ref}" title="${timerOn ? 'Pause or resume' : 'Start the timer'}">${U.icon('timer', 16)}<span class="num" data-timer="${ref}">${U.fmtClock(E.timerSeconds(ref))}</span></button>`;

    if (kind === 'video') {
      const id = E.idOf(ref), v = E.video(id) || { t: 'Lecture', dur: 0 };
      const chapters = v.ch || [];
      return `<div class="panel-inner" data-ref="${ref}">
        <header class="panel-head"><h2>${U.esc(v.t)}</h2>
          <div class="meta">${v.src === 'babbar' ? '<span class="chip">Babbar, Java</span>' : '<span class="chip">Striver</span>'}${v.dur ? `<span class="muted"><span class="num">${Math.round(v.dur / 60)}</span> min</span>` : ''}</div></header>
        <a class="video" href="${U.ytUrl(id)}" target="_blank" rel="noopener" data-act="start-timer" data-ref="${ref}"><img src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" alt="" loading="lazy"><span class="video-play">${U.icon('play', 22)}</span></a>
        <p class="instruction">Watch at your own speed and pause to write the code yourself before Babbar does. Mark it watched whenever you finish, in one go or over a few sittings.</p>
        ${chapters.length ? `<div class="chapters">${chapters.map(([t, l]) => `<a href="${U.ytUrl(id, t)}" target="_blank" rel="noopener"><span class="num">${U.fmtClock(t)}</span>${U.esc(l)}</a>`).join('')}</div>` : ''}
        ${notesBlock(ref, 'watch', it)}
        <div class="panel-actions">
          ${mode === 'watch-all' && E.isDone(ref) ? `<button class="btn" data-act="undo" data-ref="${ref}">${U.icon('arrow-counter-clockwise', 16)}<span>Mark as not watched</span></button>`
            : `<button class="btn btn-primary" data-act="watched" data-ref="${ref}">${U.icon('check', 16)}<span>Mark as watched</span></button>`}
          ${step ? `<button class="btn btn-quiet" data-act="skip" data-step="${step.id}">${U.icon('skip-forward', 16)}<span>Skip for now</span></button>` : ''}
        </div>
      </div>`;
    }

    const p = E.problem(E.idOf(ref));
    const link = E.practiceLink(p);
    const loc = E.idx.loc[ref];
    const src = ui.srcLabel(p);
    const done = E.isSolved(ref);
    const history = (it.attempts || []).length ? `<section class="history"><h3>History</h3>${it.attempts.slice().reverse().map(a => `<div class="hist-row"><span class="muted num">${U.fmtDay(a.d)}</span><span>${a.kind === 'first' ? 'First try' : a.kind === 'recall' ? 'Recall' : 'Re-solve'}</span>${ui.outcomeChip(a.outcome)}<span class="muted num">${a.mins ? a.mins + ' min' : ''}</span></div>`).join('')}
      ${it.next ? `<p class="muted small">Comes back ${U.relDay(it.next)}${it.locked ? '. Locked in.' : '.'}</p>` : ''}</section>` : (it.imported ? '<p class="muted small">Done on your old tracker.</p>' : '');

    let outcome = '';
    if (mode === 'read') outcome = `<div class="panel-actions"><button class="btn btn-primary" data-act="read" data-ref="${ref}">${U.icon('check', 16)}<span>Done</span></button></div>`;
    else if (mode === 'again') outcome = `<div class="t-acc acc" data-open="false"><button class="acc-head" data-act="acc" aria-expanded="false">${U.icon('arrow-counter-clockwise', 16)}<span>Practise it again now</span><span class="t-acc-chevron">${U.icon('caret-down', 14)}</span></button><div class="t-acc-panel"><div class="t-acc-panel-inner"><div class="acc-body">${outcomeBlock(ref, 'resolve')}</div></div></div></div>`;
    else outcome = outcomeBlock(ref, mode);

    return `<div class="panel-inner" data-ref="${ref}" data-mode="${mode}">
      <header class="panel-head">
        <h2>${U.esc(p.t)}</h2>
        <div class="meta">${E.showDiff(ref) ? ui.diff(p.d) : ''}${E.isBlind75(p) ? '<span class="chip">Blind 75</span>' : ''}${src ? `<span class="chip">${src}</span>` : ''}${p.prem ? '<span class="chip">LeetCode Premium</span>' : ''}${loc ? `<span class="muted">${U.esc(loc.unit.title)}</span>` : ''}
          <button class="pin ${it.pinned ? 'is-on' : ''}" data-act="pin" data-ref="${ref}" title="${it.pinned ? 'Unpin' : 'Pin to the Notebook'}" aria-pressed="${!!it.pinned}">${U.icon('push-pin', 16)}</button></div>
      </header>
      ${mode !== 'again' ? `<p class="instruction">${U.esc(instruction(ref, mode, it))}</p>` : ''}
      ${mode !== 'recall' ? `<div class="panel-actions">
        ${p.d === 'T' ? `<a class="btn btn-primary" href="${p.gfg || U.google(p.t + ' java explained')}" target="_blank" rel="noopener">${U.icon('book-open', 16)}<span>Read about it</span></a>` :`<a class="btn btn-primary" href="${link.url}" target="_blank" rel="noopener" data-act="start-timer" data-ref="${ref}">${U.icon('arrow-square-out', 16)}<span>Open on ${link.label}</span></a>${timer}`}
      </div>` : ''}
      ${p.d !== 'T' && !(mode === 'recall' && !ui._revealed[ref]) ? helpBlock(ref, p, mode) : ''}
      ${notesBlock(ref, mode, it)}
      ${outcome}
      ${step ? '' : history}
      ${step ? `<div class="panel-foot"><button class="link" data-act="skip" data-step="${step.id}">${U.icon('skip-forward', 14)}Skip for now</button></div>` : (done ? `<div class="panel-foot"><button class="link" data-act="undo" data-ref="${ref}">${U.icon('arrow-counter-clockwise', 14)}Mark as not done</button></div>` : '')}
    </div>`;
  };

  // ───────────────────────── Recording an outcome
  ui._revealed = {};
  ui.findStep = id => E.findStep(id);
  ui.recordFrom = (ref, outcome, stepOverride) => {
    let step = stepOverride || (ui._ctxStep && ui._ctxStep.ref === ref ? ui._ctxStep : null);
    if (!step) step = E.isSolved(ref) ? { ref, kind: 'again', mode: 'resolve' } : { ref, kind: 'new', mode: E.kindOf(ref) === 'theory' ? 'read' : 'solve' };
    const mins = E.timerStop(ref);
    const events = E.record(step, outcome, mins);
    ui._justDone = step.id || null;
    S.commit({ silent: true });
    return events;
  };
  ui.afterRecord = events => {
    ui._sel = null; ui._arrived = true;
    events.forEach(e => { if (e.type === 'unit' || e.type === 'reward') ui.logWin(e); });
    if (ui._sheetRef) ui.refreshSheet();
    ui.render();
    events.forEach((e, i) => setTimeout(() => ui.event(e), 250 + i * 200));
  };
  // A finished unit or an earned reward becomes a quiet line on today's Done panel, never a modal.
  ui.logWin = e => {
    const k = U.today(), d = S.state.days[k] || (S.state.days[k] = { minutes: 0, steps: 0 });
    const wins = d.wins || (d.wins = []);
    if (e.type === 'unit') {
      const refs = []; e.unit.lessons.forEach(l => l.items.forEach(i => { if (!E.isVideo(i.ref)) refs.push(i.ref); }));
      const clean = refs.filter(r => (S.peek(r) || {}).firstOutcome === 'clean').length;
      wins.push({ type: 'unit', title: `${e.unit.title} done`, sub: `${U.plural(refs.filter(E.isSolved).length, 'problem')}${clean ? `, ${clean} clean on the first try` : ''}. They keep coming back until they are locked in.` });
    }
    if (e.type === 'reward') wins.push({ type: 'reward', title: `You get to: ${e.reward.text}`, sub: e.reward.label });
    S.save();
  };
  ui.event = e => {
    if (e.type === 'growth') {
      const f = E.outcomeMeta(e.growth.from.o) || {}, t = E.outcomeMeta(e.growth.to.o) || {};
      ui.toast(`<b>${U.esc(E.title(e.growth.ref))}</b><span class="toast-sub">Then: ${U.esc(f.label || 'first try')}${e.growth.from.m ? ', ' + e.growth.from.m + ' min' : ''}. Now: ${U.esc(t.label)}${e.growth.to.m ? ', ' + e.growth.to.m + ' min' : ''}.</span>`, 'growth', 7000);
    }
    if (e.type === 'locked') ui.toast(`<b>Locked in</b><span class="toast-sub">${U.esc(E.title(e.ref))} now comes back only every month or so.</span>`, 'good', 5000);
    if (e.type === 'reward') ui.toast(`<b>You get to: ${U.esc(e.reward.text)}</b><span class="toast-sub">${U.esc(e.reward.label)}</span>`, 'good', 7000);
  };

  // ───────────────────────── Sheet (item details outside the session)
  ui.openSheet = ref => {
    ui._sheetRef = ref; ui._ctxStep = null;
    const root = document.getElementById('sheet-root');
    root.innerHTML = `<div class="sheet-backdrop" data-act="close-sheet"></div><aside class="sheet" role="dialog" aria-modal="true" aria-label="${U.esc(E.title(ref))}"><button class="icon-btn sheet-close" data-act="close-sheet" aria-label="Close">${U.icon('x', 18)}</button><div class="sheet-body">${ui.itemPanel(ref, null)}</div></aside>`;
    requestAnimationFrame(() => requestAnimationFrame(() => root.dataset.open = 'true'));
    ui.bindFields(root);
  };
  ui.refreshSheet = () => {
    const body = document.querySelector('#sheet-root .sheet-body'); if (!body || !ui._sheetRef) return;
    body.innerHTML = ui.itemPanel(ui._sheetRef, null); ui.bindFields(body);
  };
  ui.closeSheet = () => { const root = document.getElementById('sheet-root'); root.dataset.open = 'false'; ui._sheetRef = null; setTimeout(() => { if (root.dataset.open !== 'true') root.innerHTML = ''; }, 360); };
  ui.on('close-sheet', ui.closeSheet);
  ui.on('open', el => ui.openSheet(el.dataset.ref));

  // ───────────────────────── Notes fields (autosave, no re-render)
  ui.bindFields = root => {
    root.querySelectorAll('[data-field]').forEach(inp => {
      inp.addEventListener('input', U.debounce(() => { S.item(inp.dataset.ref)[inp.dataset.field] = inp.value; S.save(); }, 300));
    });
  };

  // ───────────────────────── Toasts
  ui.toast = (html, tone = '', ms = 3500) => {
    const root = document.getElementById('toast-root');
    const t = document.createElement('div'); t.className = `toast t-toast ${tone}`; t.setAttribute('role', 'status'); t.innerHTML = html;
    root.appendChild(t); requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('is-open')));
    const close = () => { t.classList.remove('is-open'); setTimeout(() => t.remove(), 400); };
    t.addEventListener('click', e => { if (e.target.closest('button')) setTimeout(close, 0); });
    setTimeout(close, ms);
  };

  // ───────────────────────── Shared actions
  ui.on('acc', el => { const acc = el.closest('.t-acc'); const open = acc.dataset.open !== 'true'; acc.dataset.open = String(open); el.setAttribute('aria-expanded', String(open)); });
  ui.on('hint', el => { const it = S.item(el.dataset.ref); it.hintSeen = true; S.save(); el.classList.add('is-seen'); });
  ui.on('reveal-pattern', el => { S.item(el.dataset.ref).patternSeen = true; S.save(); const panel = el.closest('.panel-inner'); ui.rerenderPanel(panel); });
  ui.on('pattern', el => {
    const k = el.dataset.k, pat = D.patterns[k]; const slot = el.closest('.acc-body').querySelector('.pattern-slot');
    slot.innerHTML = slot.dataset.k === k ? '' : `<div class="pattern-box"><b>${U.esc(pat.name)}</b><p class="muted small">Use it when: ${pat.cues.map(U.esc).join('; ')}.</p><pre class="code">${U.esc(pat.code)}</pre></div>`;
    slot.dataset.k = slot.dataset.k === k ? '' : k;
  });
  ui.on('reveal-note', el => { ui._revealed[el.dataset.ref] = true; ui.rerenderPanel(el.closest('.panel-inner')); });
  ui.on('pin', el => { const it = S.item(el.dataset.ref); it.pinned = !it.pinned; S.save(); el.classList.toggle('is-on', it.pinned); el.setAttribute('aria-pressed', String(it.pinned)); });
  ui.on('timer', el => { const ref = el.dataset.ref; if (S.state.timer && S.state.timer.ref === ref) E.timerToggle(); else E.timerStart(ref); S.save(); el.classList.toggle('is-running', !!(S.state.timer && S.state.timer.running)); });
  ui.on('start-timer', el => { E.timerStart(el.dataset.ref); S.save(); const t = document.querySelector(`.timer[data-ref="${el.dataset.ref}"]`); if (t) t.classList.add('is-running'); });
  ui.on('choose', el => ui.afterRecord(ui.recordFrom(el.dataset.ref, el.dataset.outcome)));
  ui.on('read', el => ui.afterRecord(ui.recordFrom(el.dataset.ref, 'done')));
  ui.on('watched', el => {
    const ref = el.dataset.ref;
    const step = ui._ctxStep && ui._ctxStep.ref === ref ? ui._ctxStep : { ref, kind: 'new', mode: 'watch' };
    ui.afterRecord(ui.recordFrom(ref, 'done', step));
  });
  ui.on('undo', el => { E.undo(el.dataset.ref); S.commit({ silent: true }); ui.refreshSheet(); ui.render(); });
  ui.on('skip', el => { const step = ui.findStep(el.dataset.step); if (!step) return; E.skipStep(step); S.commit({ silent: true }); ui._sel = null; ui.render(); ui.toast(step.kind === 'again' ? 'It will come back a little later.' : 'Moved behind the next step.'); });
  ui.on('ai-tutor', async el => {
    const p = E.problem(E.idOf(el.dataset.ref)); const url = p.lc ? U.lcUrl(p.lc) : p.gfg || '';
    const text = `You are my DSA tutor. Problem: "${p.t}"${url ? ` (${url})` : ''}. I code in Java.\n\nRules:\n- Do not give me code or the full solution.\n- Ask me one guiding question at a time so I find the approach myself.\n- If I'm still stuck after three questions, give one small hint about the key idea only.\n- When I propose an approach, ask me for its time and space complexity and one edge case.\n\nMy current thinking: `;
    const ok = await U.copy(text);
    ui.toast(ok ? 'Tutor prompt copied. Paste it into Claude.' : 'Could not copy the prompt.');
    window.open('https://claude.ai/new', '_blank', 'noopener');
  });

  ui.rerenderPanel = panelInner => {
    if (!panelInner) return;
    const ref = panelInner.dataset.ref; const inSheet = !!panelInner.closest('#sheet-root');
    const step = inSheet ? null : ui._ctxStep;
    const wrap = document.createElement('div'); wrap.innerHTML = ui.itemPanel(ref, step && step.ref === ref ? step : null);
    const fresh = wrap.firstElementChild; panelInner.replaceWith(fresh); ui.bindFields(fresh.parentNode);
  };

  // Live timers, and the challenge hint lock counting down with them
  setInterval(() => {
    const t = S.state && S.state.timer; if (!t) return;
    document.querySelectorAll(`[data-timer="${t.ref}"]`).forEach(n => { n.textContent = U.fmtClock(E.timerSeconds(t.ref)); });
    document.querySelectorAll(`[data-unlock-ref="${t.ref}"]`).forEach(n => {
      if (lockLeft(t.ref) > 0) n.textContent = lockText(t.ref); else ui.rerenderPanel(n.closest('.panel-inner'));
    });
  }, 1000);
  ui.on('unlock-hints', el => { S.item(el.dataset.ref).hintUnlocked = true; S.save(); ui.rerenderPanel(el.closest('.panel-inner')); });

  // ───────────────────────── Global wiring
  ui.init = () => {
    document.addEventListener('click', e => {
      const el = e.target.closest('[data-act]'); if (!el) return;
      const fn = ui.actions[el.dataset.act]; if (!fn) return;
      if (el.tagName === 'BUTTON') e.preventDefault();
      fn(el, e);
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && ui._sheetRef) return ui.closeSheet();
      if (/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
      if (/^[1-6]$/.test(e.key)) {
        const scope = ui._sheetRef ? document.querySelector('#sheet-root') : document.querySelector('.focus');
        const opts = scope ? [...scope.querySelectorAll('.outcome-opt')].filter(o => o.offsetParent) : [];
        const o = opts[Number(e.key) - 1]; if (o) { e.preventDefault(); o.click(); }
      }
      if (e.key === '/' && ui.route() !== 'today') { const s = document.querySelector('[data-search]'); if (s) { e.preventDefault(); s.focus(); } }
    });
    window.addEventListener('hashchange', () => { if (ui._sheetRef) ui.closeSheet(); ui.render(); });
    S.onChange(() => ui.render());
  };
})();
