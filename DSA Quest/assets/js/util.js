/* Shared helpers. Attached to window.DQ.U */
(function () {
  const DQ = (window.DQ = window.DQ || {});
  const U = {};

  U.esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  U.pad = n => String(n).padStart(2, '0');
  U.clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  U.sum = a => a.reduce((s, x) => s + x, 0);
  U.plural = (n, w, ws) => `${n} ${n === 1 ? w : ws || w + 's'}`;

  // A study "day" starts at dayStartHour (4 AM by default) so late nights count for the same day.
  U.dayStartHour = 4;
  const keyOf = d => `${d.getFullYear()}-${U.pad(d.getMonth() + 1)}-${U.pad(d.getDate())}`;
  U.dayKey = (d = new Date()) => keyOf(new Date(d.getTime() - U.dayStartHour * 3600e3));
  U.today = () => U.dayKey(new Date());
  U.parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
  U.addDays = (k, n) => { const d = U.parseDay(k); d.setDate(d.getDate() + n); return keyOf(d); };
  U.diffDays = (a, b) => Math.round((U.parseDay(b) - U.parseDay(a)) / 864e5);
  U.weekday = k => U.parseDay(k).getDay();
  U.fmtDay = (k, o) => U.parseDay(k).toLocaleDateString('en-IN', o || { day: 'numeric', month: 'short' });
  // Long dates add the year only when it is not this year (the finish date is often next year).
  U.fmtLong = k => { const d = U.parseDay(k); return d.toLocaleDateString('en-IN', Object.assign({ weekday: 'long', day: 'numeric', month: 'long' }, d.getFullYear() !== new Date().getFullYear() ? { year: 'numeric' } : {})); };
  U.fmtMonth = k => U.parseDay(k).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  U.relDay = k => {
    const d = U.diffDays(U.today(), k);
    if (d === 0) return 'today'; if (d === 1) return 'tomorrow'; if (d === -1) return 'yesterday';
    if (d > 1 && d < 7) return `in ${d} days`; if (d < -1 && d > -7) return `${-d} days ago`;
    return U.fmtDay(k);
  };
  U.fmtMin = m => { m = Math.round(m || 0); if (m < 60) return `${m} min`; const h = Math.floor(m / 60), r = m % 60; return r ? `${h} h ${r} min` : `${h} h`; };
  U.fmtClock = sec => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60; return (h ? h + ':' + U.pad(m) : m) + ':' + U.pad(s); };

  U.hash = str => { let h = 2166136261; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  U.debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

  U.lcUrl = slug => `https://leetcode.com/problems/${slug}/`;
  U.lcEditorial = slug => `https://leetcode.com/problems/${slug}/editorial/`;
  U.lcSolutions = slug => `https://leetcode.com/problems/${slug}/solutions/?languageTags=java`;
  U.ytUrl = (id, t) => `https://www.youtube.com/watch?v=${id}${t ? '&t=' + Math.round(t) + 's' : ''}`;
  U.ytThumb = id => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
  U.ytSearch = q => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  U.google = q => `https://www.google.com/search?q=${encodeURIComponent(q)}`;

  U.copy = async text => {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) {
      const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand('copy'); } catch (_) { /* ignore */ }
      ta.remove(); return ok;
    }
  };
  U.download = (name, text, type = 'application/json') => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name;
    document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  };

  // The DSA Quest mark (same as assets/img/icon.svg): the path so far solid, the road ahead faded, the amber node is now.
  let logoN = 0;
  U.logo = () => { const g = 'dqlogo' + (++logoN); return `<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7078ff"/><stop offset="1" stop-color="#3f3fc9"/></linearGradient></defs><rect width="64" height="64" rx="16" fill="url(#${g})"/><path d="M17 45L32 21" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="M32 21L47 40" stroke="#fff" stroke-opacity=".45" stroke-width="6" stroke-linecap="round"/><circle cx="17" cy="45" r="7" fill="#fff"/><circle cx="32" cy="21" r="7" fill="#fff"/><circle cx="47" cy="40" r="8" fill="#ffd166"/></svg>`; };
  // Phosphor icons (assets/js/icons.js).
  U.icon = (name, size = 18) => `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${(window.DQ_ICONS || {})[name] || ''}</svg>`;

  DQ.U = U;
})();
