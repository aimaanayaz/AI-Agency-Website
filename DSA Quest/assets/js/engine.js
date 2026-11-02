/* Engine: journey index, outcomes and resurfacing, the path as one ordered line (with due revisits slipped in),
   growth proof, user rewards and the streak. No days, no time budgets: Aimaan sets his own pace. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, D = window.DQ_DATA;
  const E = { version: 0 };
  const st = () => S.state;
  const prof = () => S.state.profile;
  const P = D.problems;

  // ─────────────────────────────── Catalog
  const videoMeta = {};
  (D.playlist.videos || []).forEach(v => { videoMeta[v.id] = { t: v.t, dur: v.dur || 0, src: 'babbar', lec: v.lec, ch: v.ch }; });
  Object.entries(D.striverVideos || {}).forEach(([id, [t, dur]]) => { if (!videoMeta[id]) videoMeta[id] = { t, dur, src: 'striver' }; });

  E.isVideo = ref => ref.startsWith('v:');
  E.idOf = ref => ref.slice(2);
  E.problem = id => P[id];
  E.video = id => videoMeta[id];
  E.title = ref => (E.isVideo(ref) ? (videoMeta[E.idOf(ref)] || {}).t || 'Lecture' : (P[E.idOf(ref)] || {}).t || ref);
  E.kindOf = ref => (E.isVideo(ref) ? 'video' : (P[E.idOf(ref)] || {}).d === 'T' ? 'theory' : 'problem');

  E.practiceLink = p => {
    if (p.lc) return { label: 'LeetCode', url: U.lcUrl(p.lc), kind: 'lc' };
    if (p.gfg) return { label: 'GeeksforGeeks', url: p.gfg, kind: 'gfg' };
    if (p.spoj) return { label: 'SPOJ', url: p.spoj, kind: 'spoj' };
    if (p.ib) return { label: 'InterviewBit', url: p.ib, kind: 'ib' };
    return { label: 'a search', url: U.google(p.t + ' problem practice'), kind: 'search' };
  };

  // The original Blind 75: the most repeated interview problems. Shown as a tag, never as a separate list.
  const BLIND75 = new Set(D.blind75 || []);
  E.isBlind75 = p => !!(p && p.lc && BLIND75.has(p.lc));
  // "Hide difficulty until solved": like an interview, you don't know if it's Easy or Hard going in.
  E.showDiff = ref => !prof().hideDifficulty || E.isSolved(ref);
  // A unit challenge keeps its hints closed for the first 25 minutes on the timer.
  E.CHALLENGE_LOCK_MIN = 25;

  // ─────────────────────────────── Journey index
  const NEW_LECTURE_RULES = [
    [/binary search tree|\bbst\b/i, 'u-bst'], [/queue|deque/i, 'u-queue'], [/stack/i, 'u-mono'],
    [/sliding window|two pointer|2 pointer/i, 'u-sw'], [/heap|priority queue/i, 'u-heap'], [/greedy/i, 'u-greedy'],
    [/tree/i, 'u-tree1'], [/graph|bfs|dfs|dijkstra|topo|spanning|disjoint/i, 'u-g1'], [/\bdp\b|dynamic programming|knapsack|memo/i, 'u-dp1'],
    [/trie/i, 'u-trie'], [/kmp|z-function|rabin|string/i, 'u-str2'], [/linked list|\bll\b/i, 'u-ll3'], [/backtrack|recursion/i, 'u-bt'],
    [/bit/i, 'u-bits'], [/binary search/i, 'u-bs2'], [/sort/i, 'u-sort'], [/array|matrix/i, 'u-arr3'],
  ];
  // Order that research supports: a lecture that introduces a topic is watched first (worked examples help when
  // something is new), then its problems are practice. A lecture where Babbar solves a specific problem comes after
  // you try that problem yourself (trying first, even failing, makes the solution stick).
  const STOP = new Set('lecture problem problems series day part video check the and or of in to a an is not find leetcode coding solving solve using with from for all ll linked list lists array arrays string strings stack stacks queue queues number numbers element elements warm up one given return count based approach'.split(' '));
  const stem = w => (w.length > 4 && w.endsWith('s') ? w.slice(0, -1) : w);
  const words = t => String(t).toLowerCase().replace(/^lecture\s*\d+\s*:\s*/, '').replace(/^[a-z]+\s*-?\s*\d+\.\s*/, '')
    .replace(/·.*$/, '').replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9 ]+/g, ' ')
    .split(/\s+/).filter(w => w.length >= 3 && !STOP.has(w) && !/^\d+$/.test(w)).map(stem);
  const INTRO = /\b(intro|introduction|in 1 video|in one video|basics|all about|patterns?|implement|disjoint set)\b/i;
  const TEACHES = /^(implement|introduction)\b|\(theory\)/i; // a lecture followed by these is teaching a structure, not solving a puzzle
  const FIRST = /^(l|g|dp)\s*-?\s*1\.|\bday[\s-]*1(?!\d)/i;
  function solvesOnScreen(lectureTitle, p) {
    if (!p || p.d === 'T' || INTRO.test(lectureTitle) || FIRST.test(lectureTitle) || TEACHES.test(p.t)) return false;
    if (p.src === 'babbar') return true; // the problems Babbar solves in his lectures
    const a = new Set(words(lectureTitle)), b = words(p.t);
    if (!a.size || !b.length) return false;
    const overlap = b.filter(w => a.has(w)).length;
    return overlap >= 1 && overlap / Math.min(a.size, b.length) >= 0.5;
  }

  E.buildIndex = () => {
    const idx = { sections: [], units: [], unitById: {}, lessons: [], loc: {}, lectureFor: {}, newLectures: [], solutionFor: {}, walkOf: {} };
    const used = new Set();
    D.journey.forEach(s => s.units.forEach(u => u.lessons.forEach(l => l.items.forEach(r => used.add(r.replace(/\?$/, ''))))));
    const fresh = {};
    (D.playlist.videos || []).filter(v => !used.has('v:' + v.id) && (v.lec == null || v.lec > 0)).forEach(v => {
      const rule = NEW_LECTURE_RULES.find(([re]) => re.test(v.t)); const uid = rule ? rule[1] : 'u-mono';
      (fresh[uid] = fresh[uid] || []).push('v:' + v.id); idx.newLectures.push({ id: v.id, unit: uid });
    });
    D.journey.forEach((s, si) => {
      const sec = { id: s.id, title: s.title, sub: s.sub, index: si, units: [] };
      idx.sections.push(sec);
      s.units.forEach(u => {
        const unit = { id: u.id, title: u.title, desc: u.desc, story: u.story, guide: u.guide, cleared: !!u.cleared, section: sec, lessons: [], boss: (u.boss || []).slice(), index: idx.units.length };
        const lessons = u.lessons.slice();
        if (fresh[u.id]) lessons.unshift({ title: 'New from Babbar', items: fresh[u.id], fresh: true });
        lessons.forEach((l, li) => {
          const lesson = { key: `${u.id}#${l.fresh ? 'new' : li - (fresh[u.id] ? 1 : 0)}`, title: l.title, note: l.note, unit, items: [] };
          let lastBabbar = null;
          l.items.forEach(raw => {
            const ref = raw.replace(/\?$/, '');
            const optional = raw.endsWith('?') || (u.cleared && ref.startsWith('v:'));
            lesson.items.push({ ref, optional });
            idx.loc[ref] = { unit, lesson };
            if (ref.startsWith('v:')) { if ((videoMeta[E.idOf(ref)] || {}).src === 'babbar') lastBabbar = E.idOf(ref); }
            else if (lastBabbar && !idx.lectureFor[E.idOf(ref)]) idx.lectureFor[E.idOf(ref)] = lastBabbar;
          });
          unit.lessons.push(lesson); idx.lessons.push(lesson);
        });
        // Which problems each lecture solves on screen. Those are tried first; the lecture becomes their solution.
        // A lecture that teaches a structure (followed by "Implement…") or covers more than three problems is an overview: watched first.
        unit.lessons.forEach(lesson => {
          const groups = []; let g = null;
          lesson.items.forEach(it => {
            if (E.isVideo(it.ref)) { g = { lec: it.optional ? null : it.ref, probs: [] }; groups.push(g); }
            else if (g && !it.optional) g.probs.push(it.ref);
          });
          groups.forEach(({ lec, probs }) => {
            if (!lec || probs.some(r => P[E.idOf(r)] && TEACHES.test(P[E.idOf(r)].t))) return;
            const solved = probs.filter(r => solvesOnScreen(E.title(lec), P[E.idOf(r)]));
            if (!solved.length || solved.length > 3) return;
            solved.forEach(r => { idx.solutionFor[r] = lec; });
            idx.walkOf[lec] = solved;
          });
        });
        unit.boss.forEach((ref, i) => { idx.loc[ref] = { unit, lesson: null, boss: true, bossIndex: i }; });
        sec.units.push(unit); idx.units.push(unit); idx.unitById[u.id] = unit;
      });
    });
    E.idx = idx;
  };

  // Essentials first: the hand-picked core (data/core.js) is the path; everything else is Extra practice, which comes after.
  // With "Essentials first" off, the whole syllabus is the path again. `all` asks the question for the extra-practice pass.
  const CORE = new Set(D.core || []);
  E.isCore = ref => CORE.has(E.idOf(ref));
  E.essentialsOnly = () => prof().scope !== 'all';
  // Where the path starts ("Start from" in Settings). Sections before it are ones he already knows: they leave the path,
  // and their problems stay as extra practice. Problems he has solved there still come back as revisits.
  E.startIndex = () => { const s = E.idx.sections.find(x => x.id === prof().startAt); return s ? s.index : 0; };
  E.isKnown = unit => !!unit && unit.section.index < E.startIndex();
  const needed = (ref, unit, all) => all || (!E.isKnown(unit) && (!E.essentialsOnly() || CORE.has(E.idOf(ref))));
  E.isRequired = (entry, unit, all = false) => {
    if (entry.optional) return false;
    const ref = entry.ref;
    if (E.isVideo(ref)) {
      if (!all && E.isKnown(unit)) return false;
      const w = E.idx && E.idx.walkOf[ref];
      return !w || w.some(r => E.isRequired({ ref: r }, unit, all)); // a solution lecture is needed only for a needed problem
    }
    return needed(ref, unit, all);
  };
  E.challengeOf = unit => (prof().bosses && unit.boss.length && !E.isKnown(unit) ? unit.boss[0] : null);
  // Challenge-slot problems that are essentials anyway (Blind 75 classics) are practised like any other essential.
  E.coreBosses = (unit, all = false) => { const ch = E.challengeOf(unit); return unit.boss.filter(b => b !== ch && needed(b, unit, all)); };

  // ─────────────────────────────── Status
  E.isDone = ref => { const it = S.peek(ref); return !!(it && (it.status === 'done' || it.status === 'skip')); };
  E.isSolved = ref => { const it = S.peek(ref); return !!(it && it.status === 'done'); };
  E.lessonProgress = lesson => {
    const req = lesson.items.filter(i => E.isRequired(i, lesson.unit));
    const done = req.filter(i => E.isDone(i.ref)).length;
    return { done, total: req.length, complete: done === req.length };
  };
  E.unitProgress = unit => {
    let done = 0, total = 0;
    unit.lessons.forEach(l => { const p = E.lessonProgress(l); done += p.done; total += p.total; });
    const ch = E.challengeOf(unit); if (ch) { total++; if (E.isDone(ch)) done++; }
    E.coreBosses(unit).forEach(b => { total++; if (E.isDone(b)) done++; });
    return { done, total, pct: total ? done / total : 1, complete: done === total };
  };
  E.sectionProgress = sec => { let done = 0, total = 0; sec.units.forEach(u => { const p = E.unitProgress(u); done += p.done; total += p.total; }); return { done, total, pct: total ? done / total : 1, complete: done === total }; };
  E.a2zIds = (() => { const s = new Set(); D.sheet.filter(t => !['babbar', 'boss'].includes(t.key)).forEach(t => t.sections.forEach(x => x.items.forEach(id => s.add(id)))); return [...s]; })();
  E.a2zProgress = () => { const done = E.a2zIds.filter(id => E.isDone('p:' + id)).length; return { done, total: E.a2zIds.length, pct: done / E.a2zIds.length }; };
  // Where you stand on the A2Z sheet: by difficulty, by topic, and how many Blind 75 classics are done.
  E.breakdown = () => {
    const count = ids => ({ done: ids.filter(id => E.isDone('p:' + id)).length, total: ids.length });
    const byDiff = ['E', 'M', 'H'].map(d => Object.assign({ d }, count(E.a2zIds.filter(id => P[id] && P[id].d === d))));
    const topics = D.sheet.filter(t => !['babbar', 'boss'].includes(t.key)).map(t => {
      const ids = [...new Set(t.sections.flatMap(x => x.items))];
      return Object.assign({ key: t.key, title: t.title }, count(ids));
    });
    const seen = new Set(), blind = [];
    Object.keys(P).forEach(id => { const p = P[id]; if (E.isBlind75(p) && !seen.has(p.lc)) { seen.add(p.lc); blind.push(id); } });
    return { byDiff, topics, blind: count(blind) };
  };
  E.currentUnit = () => E.idx.units.find(u => !E.unitProgress(u).complete) || E.idx.units[E.idx.units.length - 1];
  // The big picture: essentials done, and the course as sections with where you are.
  const knownId = id => { const l = E.idx.loc['p:' + id]; return !!l && E.isKnown(l.unit); };
  E.coreCount = () => { const ids = (D.core || []).filter(id => P[id] && !knownId(id)); return { done: ids.filter(id => E.isDone('p:' + id)).length, total: ids.length }; };
  E.extraLeft = () => Object.keys(P).filter(id => E.idx.loc['p:' + id] && (!CORE.has(id) || knownId(id)) && !E.isDone('p:' + id)).length;
  E.courseMap = () => {
    const cur = E.currentUnit();
    return E.idx.sections.map(s => Object.assign({ id: s.id, title: s.title, current: s === cur.section }, E.sectionProgress(s))).filter(s => s.total > 0);
  };

  // ─────────────────────────────── Outcomes and resurfacing
  E.OUTCOMES = {
    clean: { label: 'Solved it cleanly', sub: 'Optimal approach, on my own', rank: 6, tone: 'good' },
    struggle: { label: 'Solved, but it was a struggle', sub: 'Took a lot of time or effort', rank: 5, tone: 'ok' },
    brute: { label: 'Solved, not the optimal way', sub: 'Brute force, or better but not the best', rank: 4, tone: 'ok' },
    hint: { label: 'Solved after a hint', sub: 'Needed a nudge, then finished it myself', rank: 3, tone: 'warn' },
    half: { label: 'Got halfway, then saw the solution', sub: 'Had part of the idea', rank: 2, tone: 'warn' },
    solution: { label: 'Learned it from the solution', sub: "Couldn't crack it, studied the answer", rank: 1, tone: 'bad' },
  };
  E.RECALL = {
    remembered: { label: 'I remembered it', sub: 'The approach and its complexity came back', rank: 6, tone: 'good' },
    fuzzy: { label: 'Partly', sub: 'Some of it, not all', rank: 3, tone: 'warn' },
    forgot: { label: "I didn't remember", sub: 'Blank, or the wrong idea', rank: 1, tone: 'bad' },
  };
  E.outcomeMeta = o => E.OUTCOMES[o] || E.RECALL[o] || (o === 'imported' ? { label: 'Done on the old tracker', rank: 4, tone: 'muted' } : null);

  // Memory still fades with real time, so a solved problem comes back after a number of days that depends on how it went.
  const fuzz = (ref, iv) => (iv > 7 ? Math.round(iv * (0.9 + (U.hash(ref + iv) % 21) / 100)) : iv);
  function schedule(ref, it, outcome, mode) {
    const prev = it.interval || 0; let iv, next;
    if (mode === 'recall') {
      if (outcome === 'remembered') { iv = Math.max(7, Math.round(Math.max(prev, 3) * 2.5)); next = 'recall'; }
      else if (outcome === 'fuzzy') { iv = 2; next = 'resolve'; }
      else { iv = 1; next = 'resolve'; }
    } else {
      const first = mode === 'solve';
      switch (outcome) {
        case 'clean': iv = first ? 7 : Math.max(7, Math.round(Math.max(prev, 3) * 2.5)); next = 'recall'; break;
        case 'struggle': iv = first ? 3 : Math.max(3, Math.round(Math.max(prev, 2) * 1.5)); next = 'resolve'; break;
        case 'brute': iv = 3; next = 'resolve'; break;
        case 'hint': iv = 2; next = 'resolve'; break;
        default: iv = 1; next = 'resolve';
      }
    }
    iv = Math.min(120, fuzz(ref, iv));
    it.interval = iv; it.next = U.addDays(U.today(), iv); it.mode = next;
    it.aim = outcome === 'brute' ? 'optimal' : (outcome === 'clean' ? null : it.aim || null);
    const good = outcome === 'clean' || outcome === 'remembered';
    it.locked = good && iv >= 30 ? true : (good ? !!it.locked : false);
  }

  const bumpDay = mins => { const k = U.today(); const d = st().days[k] || (st().days[k] = { minutes: 0, steps: 0 }); d.minutes += mins || 0; d.steps += 1; };

  // Record any step. Returns events for the UI (growth, unit cleared, reward earned…).
  E.record = (step, outcome, mins) => {
    const ref = step.ref, it = S.item(ref), events = [];
    const m = mins || 0;
    const lockedBefore = !!it.locked;
    const unitWas = E.idx.loc[ref] ? E.unitProgress(E.idx.loc[ref].unit).complete : true;
    const secWas = E.idx.loc[ref] ? E.sectionProgress(E.idx.loc[ref].unit.section).complete : true;

    if (step.mode === 'watch' || step.mode === 'read') {
      it.status = 'done'; it.doneAt = Date.now();
    } else {
      const meta = E.outcomeMeta(outcome);
      const first = step.mode === 'solve';
      // Growth compares like with like: a re-solve against the first solve. A 2-minute recall is not a faster solve.
      if (step.mode === 'resolve') {
        const from = { o: it.firstOutcome || it.outcome, m: it.firstMins || 0 };
        const fromRank = (E.outcomeMeta(from.o) || { rank: 3 }).rank;
        const faster = m && from.m && m <= from.m * 0.75;
        if (meta.rank > fromRank || (faster && meta.rank >= fromRank) || (meta.rank === 6 && fromRank === 6 && faster)) {
          const g = { ref, d: U.today(), from, to: { o: outcome, m } };
          st().growth.push(g); events.push({ type: 'growth', growth: g });
        }
      }
      if (first) { it.status = 'done'; it.doneAt = Date.now(); it.firstOutcome = outcome; if (m) it.firstMins = m; }
      if (first && E.idx.loc[ref]) settleLecture(E.idx.solutionFor[ref], E.idx.loc[ref].unit); // its solution lecture is now watched
      it.outcome = outcome;
      if (m) it.bestMins = it.bestMins ? Math.min(it.bestMins, m) : m;
      it.attempts = (it.attempts || []).concat([{ d: U.today(), kind: first ? 'first' : step.mode, outcome, mins: m }]);
      schedule(ref, it, outcome, step.mode);
      if (it.locked && !lockedBefore) events.push({ type: 'locked', ref });
    }
    bumpDay(m);
    // What happened last decides what comes next (one revisit after each new problem), and feeds "Just done".
    const kind = step.kind === 'again' ? 'again' : step.mode === 'watch' ? 'new-watch' : 'new-solve';
    st().lastKind = kind; st().lastAt = Date.now();
    if (kind === 'again') st().sinceRevisit = 0; else if (kind === 'new-solve') st().sinceRevisit = (st().sinceRevisit || 0) + 1;
    if (kind !== 'again') st().skipped = [];
    st().log = (st().log || []).concat([{ ref, kind, mode: step.mode, outcome: outcome || 'done', at: Date.now(), mins: m }]).slice(-40);
    // Milestones
    const loc = E.idx.loc[ref];
    if (loc && !unitWas && E.unitProgress(loc.unit).complete && !loc.unit.cleared) events.push({ type: 'unit', unit: loc.unit });
    if (loc && !secWas && E.sectionProgress(loc.unit.section).complete) events.push({ type: 'section', section: loc.unit.section });
    E.checkRewards(events);
    E.version++;
    return events;
  };

  E.undo = ref => {
    const it = S.peek(ref); if (!it) return;
    ['status', 'doneAt', 'outcome', 'firstOutcome', 'next', 'interval', 'mode', 'locked', 'aim', 'parts'].forEach(k => delete it[k]);
    it.attempts = [];
    st().log = (st().log || []).filter(x => x.ref !== ref);
    E.version++;
  };

  // ─────────────────────────────── The line: the path in order, earlier problems slipped in when due
  E.dueAgain = () => {
    const k = U.today();
    return Object.entries(st().items)
      .filter(([ref, it]) => it.status === 'done' && it.next && it.next <= k && !E.isVideo(ref) && P[E.idOf(ref)] && P[E.idOf(ref)].d !== 'T')
      .map(([ref, it]) => ({ ref, it, overdue: U.diffDays(it.next, k) }))
      .sort((a, b) => b.overdue - a.overdue || ((E.outcomeMeta(a.it.outcome) || {}).rank || 3) - ((E.outcomeMeta(b.it.outcome) || {}).rank || 3));
  };
  const againStep = (ref, it) => ({ id: 'again:' + ref, ref, kind: 'again', mode: it.mode === 'recall' ? 'recall' : 'resolve', aim: it.aim || null });

  // A lecture that solves specific problems is "embedded": its problems carry it as their solution, so it never
  // needs a row of its own and counts as watched once those problems are done.
  const solvedOnScreen = (v, unit, all = false) => (E.idx.walkOf[v] || []).filter(r => E.isRequired({ ref: r }, unit, all));
  E.isEmbedded = (v, unit, all = false) => solvedOnScreen(v, unit, all).length > 0;
  E.solutionOf = (ref, all = false) => { const v = E.idx.solutionFor[ref], loc = E.idx.loc[ref]; return v && loc && E.isEmbedded(v, loc.unit, all) ? v : null; };
  // Watched once the problems it solves are done: the essential ones, or (for a lecture of extra problems) all of them.
  const settleLecture = (v, unit) => {
    if (!v || E.isDone(v) || !E.idx.walkOf[v]) return;
    const core = solvedOnScreen(v, unit), list = core.length ? core : solvedOnScreen(v, unit, true);
    if (!list.length || !list.every(E.isDone)) return;
    const it = S.item(v); it.status = 'done'; it.doneAt = Date.now(); it.viaProblems = true;
  };
  // Items of a lesson in learning order: problems a lecture solves come before it, practice problems after it.
  E.orderedItems = lesson => {
    const items = lesson.items, out = [];
    for (let i = 0; i < items.length;) {
      const it = items[i];
      if (E.isVideo(it.ref) && E.idx.walkOf[it.ref]) {
        const tried = [], practice = []; let j = i + 1;
        for (; j < items.length && !E.isVideo(items[j].ref); j++) (E.idx.solutionFor[items[j].ref] === it.ref ? tried : practice).push(items[j]);
        out.push(...tried, it, ...practice); i = j;
      } else { out.push(it); i++; }
    }
    return out;
  };

  // What is left in learning order: the essentials through the whole course; once those are done, the extra practice.
  // "Skip for now" moves an item behind the next one.
  const buildQueue = all => {
    const out = [];
    E.idx.units.forEach(u => {
      u.lessons.forEach(l => E.orderedItems(l).forEach(i => {
        if (!E.isRequired(i, u, all) || E.isDone(i.ref)) return;
        if (E.isVideo(i.ref) && E.isEmbedded(i.ref, u, all)) return;
        const step = { id: 'new:' + i.ref, ref: i.ref, kind: 'new', mode: E.isVideo(i.ref) ? 'watch' : P[E.idOf(i.ref)].d === 'T' ? 'read' : 'solve' };
        const sol = !E.isVideo(i.ref) && E.solutionOf(i.ref, all); if (sol) step.solution = sol;
        if (all) step.extra = true;
        out.push(step);
      }));
      E.coreBosses(u, all).forEach(b => { if (!E.isDone(b)) out.push({ id: 'new:' + b, ref: b, kind: 'new', mode: 'solve', extra: all || undefined }); });
      const ch = E.challengeOf(u); if (ch && !E.isDone(ch)) out.push({ id: 'new:' + ch, ref: ch, kind: 'new', mode: 'solve', challenge: true });
    });
    return out;
  };
  E.phase = () => (buildQueue(false).length ? 'core' : 'extra');
  E.newQueue = () => {
    let out = buildQueue(false);
    if (!out.length) out = buildQueue(true);
    const skipped = st().skipped || [];
    if (!skipped.length) return out;
    const keep = out.filter(s => !skipped.includes(s.ref)), later = out.filter(s => skipped.includes(s.ref));
    keep.splice(Math.min(1, keep.length), 0, ...later);
    return keep;
  };

  // The next steps, in order. The path is the spine: after every two new problems, one due revisit.
  // Coming back after a break, a revisit first as a warm-up.
  const REVISIT_EVERY = 2;
  E.line = (limit = 12) => {
    const fresh = E.newQueue(), due = E.dueAgain().map(d => againStep(d.ref, d.it));
    const returning = !st().lastAt || Date.now() - st().lastAt > 3 * 3600e3;
    const steps = []; let since = st().sinceRevisit || 0;
    if (due.length && (returning || since >= REVISIT_EVERY)) { steps.push(due.shift()); since = 0; }
    for (const s of fresh) {
      if (steps.length >= limit) break;
      steps.push(s);
      if (s.mode !== 'watch') since++;
      if (since >= REVISIT_EVERY && due.length && steps.length < limit) { steps.push(due.shift()); since = 0; }
    }
    while (steps.length < limit && due.length) steps.push(due.shift());
    return steps;
  };
  E.findStep = id => E.line(200).find(s => s.id === id) || null;
  E.recent = (n = 3) => (st().log || []).slice(-n).reverse();
  E.remaining = () => E.newQueue().length;

  E.skipStep = step => {
    if (step.kind === 'again') { S.item(step.ref).next = U.addDays(U.today(), 1); } // a revisit waits a little
    else { const s = st().skipped || (st().skipped = []); if (!s.includes(step.ref)) s.push(step.ref); }
    E.version++;
  };

  E.lastSeenText = it => {
    if (!it || !it.doneAt) return '';
    const last = (it.attempts || []).slice(-1)[0];
    const k = last ? last.d : U.dayKey(new Date(it.doneAt));
    const n = U.diffDays(k, U.today());
    return n <= 0 ? 'Seen earlier today' : n === 1 ? 'Seen yesterday' : `Seen ${n} days ago`;
  };

  // ─────────────────────────────── Streak (one missed day a week is forgiven)
  E.isActive = k => !!(st().days[k] && st().days[k].steps > 0);
  E.streak = () => {
    const today = U.today(); let k = E.isActive(today) ? today : U.addDays(today, -1);
    let n = 0, grace = null;
    for (let i = 0; i < 2000; i++) {
      if (E.isActive(k)) n++;
      else if (grace === null || U.diffDays(k, grace) >= 7) grace = k; // forgive one missed day per week
      else break;
      k = U.addDays(k, -1);
    }
    return n;
  };
  E.doneToday = () => (st().days[U.today()] || { steps: 0 }).steps;

  // ─────────────────────────────── Rewards he sets himself
  E.milestones = () => {
    const out = [];
    E.idx.units.filter(u => !u.cleared && !E.isKnown(u)).forEach(u => out.push({ type: 'unit', target: u.id, label: `Finish ${u.title}` }));
    E.idx.sections.filter(s => s.index > 0 && s.index >= E.startIndex()).forEach(s => out.push({ type: 'section', target: s.id, label: `Finish the ${s.title} section` }));
    [10, 25, 50, 100, 200].forEach(n => out.push({ type: 'locked', target: n, label: `${n} problems locked in` }));
    [25, 50, 75, 100].forEach(n => out.push({ type: 'a2z', target: n, label: `${n}% of Striver's A2Z` }));
    return out;
  };
  E.milestoneReached = m => {
    if (m.type === 'unit') return E.unitProgress(E.idx.unitById[m.target]).complete;
    if (m.type === 'section') return E.sectionProgress(E.idx.sections.find(s => s.id === m.target)).complete;
    if (m.type === 'locked') return E.lockedCount() >= m.target;
    if (m.type === 'a2z') return E.a2zProgress().pct * 100 >= m.target;
    return false;
  };
  E.milestoneProgress = m => {
    if (m.type === 'unit') return E.unitProgress(E.idx.unitById[m.target]).pct;
    if (m.type === 'section') return E.sectionProgress(E.idx.sections.find(s => s.id === m.target)).pct;
    if (m.type === 'locked') return Math.min(1, E.lockedCount() / m.target);
    if (m.type === 'a2z') return Math.min(1, E.a2zProgress().pct * 100 / m.target);
    return 0;
  };
  E.milestoneCount = m => {
    if (m.type === 'unit') return E.unitProgress(E.idx.unitById[m.target]);
    if (m.type === 'section') return E.sectionProgress(E.idx.sections.find(s => s.id === m.target));
    if (m.type === 'locked') return { done: Math.min(E.lockedCount(), m.target), total: m.target };
    if (m.type === 'a2z') { const a = E.a2zProgress(), total = Math.ceil(a.total * m.target / 100); return { done: Math.min(a.done, total), total }; }
    return { done: 0, total: 0 };
  };
  E.checkRewards = events => {
    st().rewards.forEach(r => { if (!r.earnedAt && E.milestoneReached(r.milestone)) { r.earnedAt = Date.now(); events.push({ type: 'reward', reward: r }); } });
  };
  E.lockedCount = () => Object.values(st().items).filter(it => it.locked).length;

  // ─────────────────────────────── Notes helpers
  E.hasNote = it => !!(it && ((it.note && it.note.trim()) || (it.key && it.key.trim())));

  // ─────────────────────────────── Timer (measures a solve, so outcomes can say how long it took)
  E.timerStart = ref => { const t = st().timer; if (t && t.ref === ref) { if (!t.running) { t.start = Date.now(); t.running = true; } return; } st().timer = { ref, start: Date.now(), acc: 0, running: true }; };
  E.timerToggle = () => { const t = st().timer; if (!t) return; if (t.running) { t.acc += Date.now() - t.start; t.running = false; } else { t.start = Date.now(); t.running = true; } };
  E.timerSeconds = ref => { const t = st().timer; if (!t || (ref && t.ref !== ref)) return 0; return (t.acc + (t.running ? Date.now() - t.start : 0)) / 1000; };
  E.timerStop = ref => { const sec = E.timerSeconds(ref); if (!ref || (st().timer && st().timer.ref === ref)) st().timer = null; return Math.round(sec / 60); };

  // On start: a solution lecture whose problems were all done earlier (or imported) counts as watched.
  E.reconcile = () => {
    st().lastSeen = U.today();
    Object.keys(E.idx.walkOf).forEach(v => { const loc = E.idx.loc[v]; if (loc) settleLecture(v, loc.unit); });
  };

  DQ.engine = E;
})();
