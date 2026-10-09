// Router, page transitions and navigation.

import home from "./pages/home.js";
import work from "./pages/work.js";
import design from "./pages/design.js";
import marketing from "./pages/marketing.js";
import contact from "./pages/contact.js";
import { NAV } from "./data.js";
import { reduced, wait, speedLines } from "./fx.js";

const ROUTES = { "": home, "#/": home, "#/work": work, "#/design": design, "#/marketing": marketing, "#/contact": contact };
// old links from earlier versions of the site still land somewhere sensible
const ALIASES = { "#/menu": "#/", "#/operator": "#/work", "#/graphics": "#/design", "#/ads": "#/marketing" };

const app = document.getElementById("app");
const navLinks = document.getElementById("nav-links");
const menuBtn = document.getElementById("menu-btn");
const panel = document.getElementById("menu-panel");
const eye = document.getElementById("eye");
const eyeLabel = eye.querySelector(".eye-label");
eye.querySelector(".eye-lines").innerHTML = speedLines({ count: 90, seed: 4, angle: -14 });
const LABELS = { home: "Home", work: "EP.01  Systems", design: "EP.02  Design", marketing: "EP.03  Marketing", contact: "EP.04  Contact" };

navLinks.innerHTML = NAV.map((n) => `<a href="${n.route}">${n.label}</a>`).join("");
panel.innerHTML = `<a href="#/">Home</a>` + NAV.map((n) => `<a href="${n.route}">${n.label}</a>`).join("");

let current = null, cleanup = null, busy = false;

function setActive(hash) {
  document.querySelectorAll("#nav-links a, #menu-panel a").forEach((a) => {
    const on = a.getAttribute("href") === hash;
    a.classList.toggle("is-on", on);
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
}

async function render() {
  if (ALIASES[location.hash]) { location.replace(ALIASES[location.hash]); return; }
  const page = ROUTES[location.hash] || home;
  if (busy || page === current) return;
  busy = true;
  closeMenu();

  const first = current === null;
  if (!first && !reduced()) {
    // anime eyecatch: a panel full of speed lines sweeps across, naming the next episode
    eyeLabel.textContent = LABELS[page.id] || "";
    eye.classList.remove("is-out"); eye.classList.add("is-on");
    await wait(440);
  }

  if (cleanup) { try { cleanup(); } catch (e) { console.error(e); } cleanup = null; }
  const el = page.render();
  app.replaceChildren(el);
  document.body.dataset.page = page.id;
  document.title = page.title;
  setActive(location.hash || "#/");
  window.scrollTo(0, 0);
  try { cleanup = page.mount(el) || null; } catch (e) { console.error(e); }
  current = page;

  if (!first && !reduced()) {
    await wait(140);
    eye.classList.add("is-out");
    setTimeout(() => eye.classList.remove("is-on", "is-out"), 520);
  }
  requestAnimationFrame(() => el.classList.add("is-live"));
  if (!first) app.focus({ preventScroll: true });
  busy = false;
  if ((ROUTES[location.hash] || home) !== current) render();
}

/* mobile menu */
function closeMenu() {
  document.body.classList.remove("menu-open");
  menuBtn.setAttribute("aria-expanded", "false");
}
menuBtn.addEventListener("click", () => {
  const open = !document.body.classList.contains("menu-open");
  document.body.classList.toggle("menu-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
});
window.addEventListener("keydown", (e) => { if (e.key === "Escape" && !document.querySelector("dialog[open]")) closeMenu(); });

/* nav gets a background once the page has scrolled (sentinel, no scroll listener) */
const sentinel = document.getElementById("top-sentinel");
new IntersectionObserver(([en]) => document.body.classList.toggle("scrolled", !en.isIntersecting)).observe(sentinel);

/* anime opening: plays once per visit, any click or key skips it */
async function opening() {
  let seen = false;
  try { seen = sessionStorage.getItem("op-seen") === "1"; sessionStorage.setItem("op-seen", "1"); } catch { /* storage blocked */ }
  const op = document.getElementById("op");
  if (seen || reduced()) { op.remove(); return; }
  op.querySelector(".op-lines").innerHTML = speedLines({ count: 120, seed: 9, angle: -14 });
  op.hidden = false;
  document.body.classList.add("op-running");
  let done;
  const skipped = new Promise((r) => (done = r));
  window.addEventListener("pointerdown", done, { once: true });
  window.addEventListener("keydown", done, { once: true });
  requestAnimationFrame(() => op.classList.add("is-play"));
  await Promise.race([wait(2300), skipped]);
  op.classList.add("is-out");
  document.body.classList.remove("op-running");
  setTimeout(() => op.remove(), 800);
}

/* hash links: handle them here so they never trigger a full page load
   (the deployed copy uses <base href>, which would otherwise resolve "#/work" to a new URL) */
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  const href = a.getAttribute("href");
  if (href.startsWith("#/")) {
    if (location.hash === href) window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" });
    else location.hash = href;
  } else {
    const t = document.getElementById(href.slice(1));
    if (t) t.focus();
  }
});

window.addEventListener("hashchange", render);
opening();
render();

