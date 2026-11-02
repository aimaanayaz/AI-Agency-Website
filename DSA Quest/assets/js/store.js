/* State, persistence, backups, migration from v1 and the one-time import of the old tracker. */
(function () {
  const DQ = window.DQ, U = DQ.U;
  const KEY = 'dsaquest.v2';
  const OLD_KEY = 'dsaquest.v1';
  const BAK = 'dsaquest.v2.daily';

  const S = { listeners: [] };

  S.defaults = () => ({
    v: 2,
    createdAt: new Date().toISOString(),
    onboarded: false,
    profile: {
      name: 'Aimaan',
      scope: 'core',      // essentials first ('core'), or every problem in teaching order ('all')
      bosses: true,       // one unseen "challenge" problem at the end of each unit
      hideDifficulty: false, // hide Easy/Medium/Hard until a problem is solved
      theme: 'system',
      ritual: { text: '', url: '' },
      dayStartHour: 4,
      legacyConfirmed: true, // confirmed: the old tracker's 4 Bit Manipulation problems were the first four
    },
    items: {},
    skipped: [],   // "Skip for now": these wait behind the next item
    log: [],       // recent steps, for "Just done"
    lastKind: null,
    lastAt: null,
    days: {},
    growth: [],
    rewards: [],
    future: {},
    timer: null,
    lastSeen: null,
    legacyImported: false,
  });

  function merge(base, extra) {
    if (!extra || typeof extra !== 'object' || Array.isArray(extra)) return extra === undefined ? base : extra;
    const out = Object.assign({}, base);
    for (const k of Object.keys(extra)) {
      out[k] = base && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) ? merge(base[k], extra[k]) : extra[k];
    }
    return out;
  }
  const read = k => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } };

  // v1 (gamified build) → v2. Keeps every solve, its notes and its review schedule.
  function migrateV1(old) {
    const st = S.defaults();
    st.createdAt = old.createdAt || st.createdAt;
    st.onboarded = false; // show the short new setup once
    st.legacyImported = !!old.legacyImported;
    const p = old.profile || {};
    if (p.name) st.profile.name = p.name;
    st.profile.legacyConfirmed = !!p.legacyConfirmed;
    const ratingToOutcome = (r, help) => (help >= 3 || r === 1 ? 'solution' : help === 2 || help === 1 ? 'hint' : r === 2 ? 'struggle' : 'clean');
    for (const [ref, it] of Object.entries(old.items || {})) {
      const n = {};
      if (it.s === 'done' || it.s === 'skip') n.status = it.s;
      if (it.notes || it.approach) n.note = [it.approach, it.notes].filter(Boolean).join('\n\n');
      if (it.insight) n.key = it.insight;
      if (it.star) n.pinned = true;
      if (it.imported) n.imported = true;
      if (it.s === 'done') {
        const last = (it.attempts || []).filter(a => !a.review).slice(-1)[0];
        n.outcome = it.imported ? 'imported' : ratingToOutcome(last ? last.r : 3, it.help || 0);
        n.doneAt = it.at || Date.now();
        if (last && last.mins) { n.firstMins = last.mins; n.bestMins = last.mins; }
        n.attempts = (it.attempts || []).map(a => ({ d: a.d, kind: a.review ? 'recall' : 'first', outcome: a.review ? (a.r >= 3 ? 'remembered' : a.r === 2 ? 'fuzzy' : 'forgot') : ratingToOutcome(a.r, a.help || 0), mins: a.mins || 0 }));
        if (it.srs) { n.next = it.srs.due; n.interval = it.srs.iv; n.mode = it.srs.iv >= 7 ? 'recall' : 'resolve'; }
      }
      if (Object.keys(n).length) st.items[ref] = n;
    }
    for (const [k, d] of Object.entries(old.days || {})) if (d && (d.minutes || d.solves || d.videos)) st.days[k] = { minutes: d.minutes || 0, steps: (d.solves || 0) + (d.videos || 0) + (d.reviews || 0) };
    st.future = old.future || {};
    return st;
  }

  S.load = () => {
    let raw = read(KEY) || read(BAK);
    if (!raw) { const old = read(OLD_KEY); if (old && old.v === 1) { raw = migrateV1(old); S.migrated = true; } }
    S.state = raw ? merge(S.defaults(), raw) : S.defaults();
    S.applyPrefs();
    return S.state;
  };

  S.applyPrefs = () => {
    const p = S.state.profile;
    U.dayStartHour = Number(p.dayStartHour) || 0;
    const theme = p.theme === 'system' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : p.theme;
    document.documentElement.dataset.theme = theme;
  };
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { if (S.state && S.state.profile.theme === 'system') S.applyPrefs(); });

  let t = null;
  S.save = immediate => {
    clearTimeout(t);
    const write = () => {
      try {
        const json = JSON.stringify(S.state);
        localStorage.setItem(KEY, json);
        const today = U.today();
        if (localStorage.getItem(BAK + '.day') !== today) { localStorage.setItem(BAK, json); localStorage.setItem(BAK + '.day', today); }
        S.fileBackup(json);
        if (DQ.sync) DQ.sync.touch(json);
      } catch (e) { DQ.ui && DQ.ui.toast('Could not save. Export a backup from Settings.'); }
    };
    if (immediate) write(); else t = setTimeout(write, 200);
  };
  S.hasLocal = () => !!(localStorage.getItem(KEY) || localStorage.getItem(OLD_KEY));
  // A newer copy arrived from the server: take it as is, without echoing it back.
  S.replace = data => {
    clearTimeout(t);
    S.state = merge(S.defaults(), data);
    localStorage.setItem(KEY, JSON.stringify(S.state));
    S.applyPrefs();
  };
  S.writeLocal = data => localStorage.setItem(KEY, JSON.stringify(data));
  S.commit = (opts = {}) => { if (DQ.engine) DQ.engine.version++; S.save(); if (!opts.silent) S.listeners.forEach(fn => fn()); };
  S.onChange = fn => S.listeners.push(fn);
  S.item = ref => S.state.items[ref] || (S.state.items[ref] = {});
  S.peek = ref => S.state.items[ref] || null;

  // Old tracker (a2zdsa.pages.dev screenshots, 30 Oct 2026). Unknown quality, so they come back gently.
  S.importLegacy = () => {
    const st = S.state; if (st.legacyImported) return 0;
    const imp = window.DQ_DATA.imported, P = window.DQ_DATA.problems;
    const at = U.parseDay(U.addDays(U.today(), -1)).getTime() + 12 * 3600e3;
    let i = 0;
    imp.done.forEach(id => {
      const p = P[id]; if (!p) return;
      const it = S.item('p:' + id);
      if (it.status) return;
      it.status = 'done'; it.outcome = 'imported'; it.imported = true; it.doneAt = at;
      if (p.topic !== 'basics' && p.d !== 'T') { it.next = U.addDays(U.today(), 1 + Math.floor(i / 2)); it.interval = 4; it.mode = 'recall'; i++; }
    });
    (imp.starred || []).forEach(id => { if (P[id]) S.item('p:' + id).pinned = true; });
    st.legacyImported = true;
    return imp.done.length;
  };

  S.exportJSON = () => U.download(`dsa-quest-backup-${U.today()}.json`, JSON.stringify(Object.assign({}, S.state, { exportedAt: new Date().toISOString() }), null, 1));
  S.importJSON = text => {
    const data = JSON.parse(text);
    if (data && data.v === 1 && data.items) { S.state = migrateV1(data); S.state.onboarded = true; }
    else if (data && data.v === 2 && data.items) S.state = merge(S.defaults(), data);
    else throw new Error('This file is not a DSA Quest backup.');
    S.applyPrefs(); S.save(true);
  };
  S.reset = async () => {
    if (DQ.sync && DQ.sync.enabled) await DQ.sync.wipe();
    [KEY, BAK, BAK + '.day'].forEach(k => localStorage.removeItem(k));
    location.reload();
  };

  // Optional auto-backup to a real file (Chrome / Edge). Handle kept in IndexedDB.
  let handle = null, ok = false, lastWrite = 0;
  const idb = (mode, fn) => new Promise((res, rej) => {
    const r = indexedDB.open('dsaquest', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => { const tx = r.result.transaction('kv', mode); const out = fn(tx.objectStore('kv')); tx.oncomplete = () => res(out && out.result); tx.onerror = () => rej(tx.error); };
    r.onerror = () => rej(r.error);
  });
  S.fileSupported = () => 'showSaveFilePicker' in window;
  S.fileStatus = () => (handle ? (ok ? 'on' : 'paused') : 'off');
  S.fileName = () => (handle ? handle.name : null);
  S.restoreFileHandle = async () => {
    if (!S.fileSupported()) return;
    try { handle = await idb('readonly', s => s.get('backupHandle')); if (handle) ok = (await handle.queryPermission({ mode: 'readwrite' })) === 'granted'; } catch (e) { handle = null; }
  };
  S.connectFile = async () => {
    handle = await window.showSaveFilePicker({ suggestedName: 'dsa-quest-progress.json', types: [{ description: 'JSON', accept: { 'application/json': ['.json'] } }] });
    await idb('readwrite', s => s.put(handle, 'backupHandle')); ok = true;
    await S.fileBackup(JSON.stringify(S.state), true);
  };
  S.resumeFile = async () => { if (!handle) return false; ok = (await handle.requestPermission({ mode: 'readwrite' })) === 'granted'; if (ok) await S.fileBackup(JSON.stringify(S.state), true); return ok; };
  S.disconnectFile = async () => { handle = null; ok = false; try { await idb('readwrite', s => s.delete('backupHandle')); } catch (e) { /* ignore */ } };
  S.fileBackup = async (json, force) => {
    if (!handle || !ok) return;
    if (!force && Date.now() - lastWrite < 15000) { clearTimeout(S._ft); S._ft = setTimeout(() => S.fileBackup(JSON.stringify(S.state), true), 15000); return; }
    try { const w = await handle.createWritable(); await w.write(json); await w.close(); lastWrite = Date.now(); } catch (e) { ok = false; }
  };

  DQ.store = S;
})();
