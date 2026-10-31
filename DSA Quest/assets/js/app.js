/* Boot. */
(async function () {
  const DQ = window.DQ, U = DQ.U, S = DQ.store, E = DQ.engine, ui = DQ.ui;
  const main = document.getElementById('main');
  try {
    // Hosted copy on a device that has never opened it: fetch the online progress first.
    if (DQ.sync.enabled && !S.hasLocal()) {
      main.innerHTML = '<div class="boot"><span class="brand-mark lg">DQ</span><p class="muted">Loading your progress</p></div>';
      await DQ.sync.preload();
    }
    S.load();
    E.buildIndex();
    if (!S.state.legacyImported) S.importLegacy();
    E.reconcile();
    S.save(true);
    ui.init();
    ui.render();
    S.restoreFileHandle();
    DQ.sync.start();
    let day = U.today();
    setInterval(() => { if (U.today() !== day) { day = U.today(); E.reconcile(); S.commit(); } }, 60000);
  } catch (err) {
    console.error(err);
    main.innerHTML = `<div class="page narrow"><h1>Something went wrong while loading</h1><p class="muted">Your progress is safe. Reload the page; if this keeps happening, export a backup from the browser console with <code>DQ.store.exportJSON()</code>.</p><pre class="code">${U.esc(err && err.stack || err)}</pre></div>`;
  }
})();
