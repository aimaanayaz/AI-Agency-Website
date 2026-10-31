/* Online saving for the hosted copy (zaid.agency/dsa).
   The server keeps the true copy, so any device picks up where the last one left off.
   Each device also keeps a cache in localStorage, so nothing is lost while offline.
   When the app is opened from a file (no <meta name="dq-sync">), this stays off. */
(function () {
  const DQ = window.DQ, U = DQ.U;
  const META = 'dsaquest.v2.sync';
  const API = 'api/state'; // relative to <base href="/dsa/">

  const sync = (DQ.sync = {
    enabled: /^https?:$/.test(location.protocol) && !!document.querySelector('meta[name="dq-sync"]'),
    status: 'off',
  });

  const readMeta = () => { try { return JSON.parse(localStorage.getItem(META)) || {}; } catch (e) { return {}; } };
  let meta = readMeta(); // { rev, hash, dirty, changedAt, savedAt }
  const saveMeta = () => localStorage.setItem(META, JSON.stringify(meta));
  sync.savedAt = () => meta.savedAt || null;

  const listeners = [];
  sync.onStatus = fn => listeners.push(fn);
  const setStatus = s => { sync.status = s; listeners.forEach(fn => fn(s)); };
  sync.label = () => ({
    saved: 'Saved online',
    saving: 'Saving online',
    offline: 'Offline, saved on this device',
    error: 'Online save failed, saved on this device',
  }[sync.status] || '');

  const LOCKED = 'locked';
  const req = async (method, body, query = '') => {
    const r = await fetch(API + query, {
      method, credentials: 'same-origin', cache: 'no-store',
      headers: Object.assign({ 'X-DQ': '1' }, body ? { 'Content-Type': 'application/json' } : {}),
      body: body ? JSON.stringify(body) : undefined,
    });
    if (r.status === 401) { location.reload(); throw new Error(LOCKED); } // the PIN cookie is gone: show the PIN screen
    if (!r.ok && r.status !== 409) throw new Error('HTTP ' + r.status);
    return r;
  };
  const failed = e => { if (e.message !== LOCKED) setStatus(navigator.onLine ? 'error' : 'offline'); };
  const timeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);

  // A fresh device: fetch the online copy before the app starts, so it opens on real progress, not the welcome screen.
  sync.preload = async () => {
    if (!sync.enabled) return;
    try {
      const d = await (await timeout(req('GET'), 8000)).json();
      if (d.empty) return;
      DQ.store.writeLocal(d.state);
      meta = { rev: d.rev, savedAt: d.savedAt, dirty: false, changedAt: d.savedAt, hash: 0 };
      saveMeta();
    } catch (e) { failed(e); }
  };

  // Called by store.save with the JSON it just wrote. Until the first check with the server is done, changes wait,
  // so the start-up save can never beat newer progress from another device.
  let applying = false, ready = false, late = null;
  sync.touch = json => {
    if (!sync.enabled || applying) return;
    if (!ready) { late = json; return; }
    const h = U.hash(json);
    if (h === meta.hash) return;
    meta.hash = h; meta.dirty = true; meta.changedAt = Date.now(); saveMeta();
    schedule(1500);
  };

  let timer = null, inflight = false;
  const schedule = ms => { clearTimeout(timer); timer = setTimeout(push, ms); };

  async function push() {
    if (!meta.dirty || inflight) return;
    inflight = true; setStatus('saving');
    const sent = meta.hash;
    try {
      const r = await req('PUT', { state: DQ.store.state, baseRev: meta.rev || 0 });
      const d = await r.json();
      if (r.status === 409) { inflight = false; return settle(d); }
      meta.rev = d.rev; meta.savedAt = d.savedAt;
      if (meta.hash === sent) meta.dirty = false;
      saveMeta(); setStatus('saved');
    } catch (e) { failed(e); schedule(30000); }
    inflight = false;
    if (meta.dirty && sync.status === 'saved') schedule(300);
  }

  // The server has a different copy. The newer change wins: this device's unsaved work, or the server's copy.
  function settle(d) {
    if (d.empty) { meta.rev = 0; saveMeta(); return push(); }
    if (meta.dirty && meta.changedAt > d.savedAt) { meta.rev = d.rev; saveMeta(); return push(); }
    adopt(d);
  }

  function adopt(d) {
    late = null;
    applying = true;
    DQ.store.replace(d.state);
    applying = false;
    meta = { rev: d.rev, savedAt: d.savedAt, dirty: false, changedAt: d.savedAt, hash: U.hash(JSON.stringify(DQ.store.state)) };
    saveMeta();
    const E = DQ.engine; E.version++; E.reconcile();
    if (DQ.ui && DQ.ui.render) { DQ.ui._sel = null; DQ.ui.render(); }
    setStatus('saved');
  }

  async function pull() {
    if (inflight) return;
    try {
      const d = await (await req('GET', null, '?have=' + (meta.rev || 0))).json();
      if (d.same) { meta.savedAt = d.savedAt; saveMeta(); return meta.dirty ? push() : setStatus('saved'); }
      return settle(d);
    } catch (e) { failed(e); }
  }

  sync.start = async () => {
    if (!sync.enabled) return;
    await pull();
    ready = true;
    if (late) { const j = late; late = null; sync.touch(j); }
    // Coming back to the tab (maybe after using another device): check for newer progress. Leaving it: save now.
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') pull(); else if (meta.dirty) push(); });
    addEventListener('online', () => (meta.dirty ? push() : pull()));
  };

  sync.saveNow = () => push();
  sync.wipe = async () => { try { await req('DELETE'); } catch (e) { /* offline: the local reset still happens */ } localStorage.removeItem(META); };
  // Forget the PIN on this device and remove the local copy. The online copy stays.
  sync.lock = async () => {
    if (meta.dirty) await push();
    try { await fetch('lock', { method: 'POST', headers: { 'X-DQ': '1' } }); } catch (e) { /* still clear locally */ }
    ['dsaquest.v2', 'dsaquest.v2.daily', 'dsaquest.v2.daily.day', META].forEach(k => localStorage.removeItem(k));
    location.reload();
  };
})();
