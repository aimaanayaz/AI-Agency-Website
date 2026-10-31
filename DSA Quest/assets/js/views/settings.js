/* Settings: the few knobs that matter, plus backups. */
(function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, ui = DQ.ui, D = window.DQ_DATA;
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const seg = (name, opts, cur) => `<div class="seg" role="radiogroup">${opts.map(([v, l]) => `<button role="radio" aria-checked="${String(cur) === String(v)}" data-act="set" data-k="${name}" data-v="${v}">${l}</button>`).join('')}</div>`;
  const toggle = (k, label, sub, on) => `<label class="toggle-row"><span><b>${label}</b><span class="muted small">${sub}</span></span><input type="checkbox" class="toggle" data-toggle="${k}" ${on ? 'checked' : ''}></label>`;

  DQ.views.settings = {
    render() {
      const p = S.state.profile, plan = E.plan(), fs = S.fileStatus();
      const online = DQ.sync.enabled;
      const savedAtText = () => new Date(DQ.sync.savedAt()).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
      const bits = D.sheet.find(t => t.key === 'bit').sections[0].items;
      return `<div class="page narrow">
        <header class="page-head"><h1>Settings</h1></header>

        <section class="block"><h2>Daily session</h2>
          <div class="set-row"><span><b>Time per day</b><span class="muted small">The session fills this. About a quarter goes to earlier problems coming back.</span></span>${seg('dailyMinutes', [[45, '45 min'], [60, '60 min'], [75, '75 min'], [90, '90 min'], [120, '2 h']], p.dailyMinutes)}</div>
          <div class="set-row"><span><b>Rest days</b><span class="muted small">No session, and the streak is safe.</span></span><div class="seg">${DAYS.map((d, i) => `<button aria-pressed="${p.restDays.includes(i)}" data-act="rest" data-d="${i}">${d}</button>`).join('')}</div></div>
          ${toggle('extras', "Babbar's extra problems", 'The problems Babbar solves in his lectures, beyond Striver A2Z.', p.extras)}
          ${toggle('bosses', 'Unit challenge', 'One unseen problem at the end of each unit, to check you own it.', p.bosses)}
          <p class="muted small">With these settings you finish around <b>${U.fmtMonth(plan.eta)}</b>.</p>
        </section>

        <section class="block"><h2>Appearance</h2>
          <div class="set-row"><span><b>Theme</b></span>${seg('theme', [['system', 'System'], ['dark', 'Dark'], ['light', 'Light']], p.theme)}</div>
        </section>

        <section class="block"><h2>Time estimates</h2>
          <p class="muted small">Minutes for a first attempt, including notes. Used for the session and the finish date.</p>
          <div class="est-grid">${[['E', 'Easy'], ['M', 'Medium'], ['H', 'Hard'], ['T', 'Concept']].map(([k, l]) => `<label class="field"><span class="field-label">${l}</span><input class="input num" type="number" min="5" max="240" data-est="${k}" value="${p.estimates[k]}"></label>`).join('')}</div>
        </section>

        <section class="block"><h2>Imported progress</h2>
          <p class="muted small">Your old tracker said Bit Manipulation 4 of 18 without saying which. Tick the ones you actually did.</p>
          <ul class="checks">${bits.map(id => `<li><label class="check-row"><input type="checkbox" data-legacy="${id}" ${E.isDone('p:' + id) ? 'checked' : ''}><span>${U.esc(D.problems[id].t)}</span></label></li>`).join('')}</ul>
        </section>

        <section class="block"><h2>${online ? 'Saving' : 'Backups'}</h2>
          <p class="muted small">${online ? `Your progress saves online after every change, so any device you unlock picks up where you left off. ${DQ.sync.savedAt() ? `Last saved online ${savedAtText()}.` : ''} You can still export a copy now and then.` : 'Progress is saved in this browser. Export now and then, or connect a backup file that updates itself (Chrome or Edge). Saving it in your OneDrive folder syncs it.'}</p>
          <div class="btn-row"><button class="btn" data-act="export">${U.icon('download-simple', 16)}<span>Export backup</span></button>
            <label class="btn">${U.icon('upload-simple', 16)}<span>Import backup</span><input type="file" accept=".json,application/json" id="import-file" hidden></label>
            ${!online && S.fileSupported() ? (fs === 'off' ? `<button class="btn" data-act="file-connect">${U.icon('link-simple', 16)}<span>Connect a backup file</span></button>` : fs === 'paused' ? `<button class="btn" data-act="file-resume">${U.icon('link-simple', 16)}<span>Allow backup file</span></button>` : `<button class="btn" data-act="file-disconnect">${U.icon('link-simple', 16)}<span>Auto-backup on: ${U.esc(S.fileName() || 'file')}</span></button>`) : ''}</div>
        </section>

        ${online ? `<section class="block"><h2>This device</h2>
          <div class="set-row"><span><b>Lock this device</b><span class="muted small">Forget the PIN here and remove the copy on this device. Your online progress stays. Use it on a shared computer.</span></span><button class="btn" data-act="lock-device">${U.icon('lock-simple', 16)}<span>Lock</span></button></div>
        </section>` : ''}

        <section class="block"><h2>New lectures</h2>
          <p class="muted small">Babbar's playlist was last synced on ${U.fmtLong(D.playlist.syncedAt)} (${D.playlist.videos.length} lectures). He is still uploading. ${online ? 'To add new ones, double-click <b>Sync Babbar Playlist.bat</b> on your laptop, then publish the site again.' : 'Double-click <b>Sync Babbar Playlist.bat</b> in this folder, then reload.'} New lectures land in the right unit on their own.</p>
        </section>

        <section class="block danger"><h2>Reset</h2><div class="btn-row"><button class="btn btn-danger" data-act="reset">${online ? 'Delete all progress, here and online' : 'Delete all progress in this browser'}</button></div></section>
      </div>`;
    },
    mount(root) {
      root.querySelectorAll('[data-toggle]').forEach(inp => inp.addEventListener('change', () => { S.state.profile[inp.dataset.toggle] = inp.checked; delete S.state.sessions[U.today()]; S.commit(); }));
      root.querySelectorAll('[data-est]').forEach(inp => inp.addEventListener('change', () => { const v = Number(inp.value); if (v > 0) { S.state.profile.estimates[inp.dataset.est] = v; S.commit(); } }));
      root.querySelectorAll('[data-legacy]').forEach(inp => inp.addEventListener('change', () => {
        const ref = 'p:' + inp.dataset.legacy;
        if (inp.checked && !E.isDone(ref)) { const it = S.item(ref); it.status = 'done'; it.outcome = 'imported'; it.imported = true; it.doneAt = Date.now() - 864e5; }
        else if (!inp.checked) E.undo(ref);
        S.state.profile.legacyConfirmed = true; S.commit({ silent: true });
      }));
      const f = root.querySelector('#import-file');
      if (f) f.addEventListener('change', () => { const file = f.files[0]; if (!file) return; file.text().then(t => { try { S.importJSON(t); location.reload(); } catch (e) { ui.toast(U.esc(e.message)); } }); });
    },
  };

  ui.on('set', el => {
    const k = el.dataset.k, v = el.dataset.v;
    S.state.profile[k] = k === 'theme' ? v : Number(v);
    if (k === 'dailyMinutes') delete S.state.sessions[U.today()];
    S.applyPrefs(); S.commit();
  });
  ui.on('rest', el => {
    const d = Number(el.dataset.d), r = new Set(S.state.profile.restDays);
    r.has(d) ? r.delete(d) : r.add(d); if (r.size >= 7) return;
    S.state.profile.restDays = [...r].sort(); delete S.state.sessions[U.today()]; S.commit();
  });
  ui.on('export', () => { S.exportJSON(); ui.toast('Backup downloaded.'); });
  ui.on('file-connect', async () => { try { await S.connectFile(); ui.render(); ui.toast('Auto-backup is on.'); } catch (e) { if (e.name !== 'AbortError') ui.toast('Could not connect the file.'); } });
  ui.on('file-resume', async () => { const ok = await S.resumeFile(); ui.toast(ok ? 'Auto-backup resumed.' : 'Permission was not given.'); ui.render(); });
  ui.on('file-disconnect', async () => { await S.disconnectFile(); ui.render(); });
  ui.on('reset', () => { if (confirm(DQ.sync.enabled ? 'Delete all progress on every device and online? Export a backup first if you might want it.' : 'Delete all progress in this browser? Export a backup first if you might want it.')) S.reset(); });
  ui.on('lock-device', () => { if (confirm('Lock this device? You will need the PIN to open DSA Quest here again.')) DQ.sync.lock(); });

  // First run: one screen.
  DQ.views.onboarding = {
    render() {
      const p = S.state.profile, n = Object.values(S.state.items).filter(it => it.status === 'done').length;
      return `<div class="onboard"><div class="onboard-card">
        <span class="brand-mark lg">DQ</span>
        <h1>${S.migrated ? 'DSA Quest, simplified' : `Welcome, ${U.esc(p.name)}`}</h1>
        <p class="muted">${S.migrated ? 'Same progress, calmer app.' : 'Babbar for lectures, Striver A2Z for practice, one session a day.'} ${n} problems from your old tracker are already done. Earlier problems come back inside your daily session, so there is no separate revision to remember.</p>
        <div class="field"><span class="field-label">How long can you study on most days?</span>${seg('dailyMinutes', [[60, '60 min'], [75, '75 min'], [90, '90 min']], p.dailyMinutes)}</div>
        <button class="btn btn-primary wide" data-act="ob-start">Start today's session</button>
      </div></div>`;
    },
  };
  ui.on('ob-start', () => { S.state.onboarded = true; delete S.state.sessions[U.today()]; S.commit({ silent: true }); if (ui.route() !== 'today') location.hash = '#/today'; else ui.render(); });
})();
