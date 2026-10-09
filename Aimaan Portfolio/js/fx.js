// Small helpers: templating, scroll reveals, count-ups.

export const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function h(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}

export const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/** Reveal [data-reveal] elements as they enter the viewport. */
export function revealer(root) {
  const els = [...root.querySelectorAll("[data-reveal]")];
  if (reduced() || !("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("is-in")); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
  els.forEach((e) => io.observe(e));
  return () => io.disconnect();
}

/** Count [data-count] numbers up once they are on screen. */
export function counters(root) {
  const els = [...root.querySelectorAll("[data-count]")];
  const fmt = (el, n) => `${el.dataset.prefix || ""}${Math.round(n).toLocaleString("en-US")}${el.dataset.suffix || ""}`;
  const run = (el) => {
    const to = +el.dataset.count;
    if (reduced()) { el.textContent = fmt(el, to); return; }
    const start = performance.now(), dur = 1400;
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      el.textContent = fmt(el, to * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (!("IntersectionObserver" in window)) { els.forEach(run); return () => {}; }
  const io = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
  }, { threshold: 0.4 });
  els.forEach((e) => { e.textContent = fmt(e, 0); io.observe(e); });
  return () => io.disconnect();
}

/** Number markup used by count-ups. Real value is in the text for no-JS and screen readers. */
export const num = (value, { prefix = "", suffix = "" } = {}) =>
  `<span class="tabular" data-count="${value}" data-prefix="${prefix}" data-suffix="${suffix}" aria-label="${prefix}${value.toLocaleString("en-US")}${suffix}">${prefix}${value.toLocaleString("en-US")}${suffix}</span>`;

/** Shared page footer: next page link + simple credits. */
export function pageEnd(next) {
  return `
    ${next ? `
    <a class="next" href="${next.route}" data-reveal>
      <span class="next-k">Next</span>
      <span class="next-t">${esc(next.label)}</span>
      <i class="ph ph-arrow-right" aria-hidden="true"></i>
    </a>` : ""}
    <footer class="foot">
      <div class="wrap foot-in">
        <span>© 2026 Aimaan Ayaz</span>
        <span>Designed and built by me, in New Delhi.</span>
      </div>
    </footer>`;
}

/* ---------------- anime line work (static SVG, seeded so it never changes) ---------------- */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Focus lines: wedges converging on a point with a clear centre, the anime "dramatic moment" frame. */
export function focusLines({ cx = 0.5, cy = 0.5, count = 140, inner = 0.3, seed = 1, w = 1600, hgt = 1000 } = {}) {
  const r = rng(seed);
  const X = cx * w, Y = cy * hgt, R = Math.hypot(w, hgt), minR = inner * Math.min(w, hgt);
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + (r() - 0.5) * 0.05;
    const s = 0.003 + r() * 0.013;
    const tip = minR * (0.8 + r() * 0.7);
    d += `M${(X + Math.cos(a) * tip).toFixed(1)} ${(Y + Math.sin(a) * tip).toFixed(1)}L${(X + Math.cos(a - s) * R).toFixed(1)} ${(Y + Math.sin(a - s) * R).toFixed(1)}L${(X + Math.cos(a + s) * R).toFixed(1)} ${(Y + Math.sin(a + s) * R).toFixed(1)}Z`;
  }
  return `<svg viewBox="0 0 ${w} ${hgt}" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path fill="currentColor" d="${d}"/></svg>`;
}

/** Speed lines: parallel streaks. */
export function speedLines({ count = 80, seed = 3, angle = 0, w = 1600, hgt = 900 } = {}) {
  const r = rng(seed);
  let d = "";
  for (let i = 0; i < count; i++) {
    const y = r() * hgt, len = w * (0.2 + r() * 0.6), x = r() * w - len * 0.3, t = 0.6 + r() * 3.2;
    d += `M${x.toFixed(1)} ${y.toFixed(1)}L${(x + len).toFixed(1)} ${(y - t / 2).toFixed(1)}L${(x + len).toFixed(1)} ${(y + t / 2).toFixed(1)}Z`;
  }
  return `<svg viewBox="0 0 ${w} ${hgt}" preserveAspectRatio="none" aria-hidden="true"><g transform="rotate(${angle} ${w / 2} ${hgt / 2})"><path fill="currentColor" d="${d}"/></g></svg>`;
}

export const lines = (gen, opts = {}, cls = "") => `<div class="lines ${cls}" aria-hidden="true">${gen(opts)}</div>`;
