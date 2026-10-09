import { GRAPHICS } from "../data.js";
import { h, esc, revealer, pageEnd } from "../fx.js";
import { pageHead } from "./shared.js";

const all = GRAPHICS.arcs.flatMap((a) => a.pieces.map((p) => ({ ...p, arc: a.name, years: a.years })));
const byId = Object.fromEntries(all.map((p) => [p.id, p]));

// Pieces in a row share one height: each column is as wide as its image's aspect ratio.
const ROWS = {
  esports: [["viper", "amoliq"], ["redragon", "ant"]],
  campus: [["cc-cover", "cc-hr", "cc-gold", "eureka"]],
  agency: [["zaid-post"]],
};

function piece(p, i) {
  return `
    <button class="g-piece" type="button" data-k="${all.findIndex((x) => x.id === p.id)}" data-reveal style="--d:${i}" aria-label="Open: ${esc(p.title)}">
      <span class="g-img"><img src="${p.img}" alt="${esc(p.title)}, ${esc(p.format)} for ${esc(p.client)}" width="${p.w}" height="${p.h}" loading="lazy"></span>
      <span class="g-cap"><span>${esc(p.title)}</span><i class="ph ph-arrows-out-simple" aria-hidden="true"></i></span>
    </button>`;
}

function row(ids, note) {
  const ps = ids.map((id) => byId[id]);
  if (ps.length === 1) {
    const r = ps[0].w / ps[0].h;
    return `<div class="g-row g-solo" style="grid-template-columns:${r.toFixed(3)}fr ${(r * 1.6).toFixed(3)}fr">${piece(ps[0], 0)}${note ? `<p class="g-note" data-reveal>${esc(note)}</p>` : ""}</div>`;
  }
  return `<div class="g-row" data-n="${ps.length}" style="grid-template-columns:${ps.map((p) => `${(p.w / p.h).toFixed(3)}fr`).join(" ")}">${ps.map(piece).join("")}</div>`;
}

function arc(a) {
  const rows = ROWS[a.id];
  const solo = rows.length === 1 && rows[0].length === 1;
  return `
    <section class="g-arc" aria-labelledby="arc-${a.id}">
      <div class="wrap">
        <header class="g-head" data-reveal>
          <p class="g-year">${esc(a.years)}</p>
          <h2 class="h2" id="arc-${a.id}">${esc(a.name)}</h2>
          <p class="g-why">${esc(a.why)}</p>
        </header>
        ${rows.map((r) => row(r, solo ? a.note : null)).join("")}
        ${!solo && a.note ? `<p class="g-note" data-reveal>${esc(a.note)}</p>` : ""}
      </div>
    </section>`;
}

export default {
  id: "design",
  title: "Design | Aimaan Ayaz",
  render() {
    const G = GRAPHICS;
    return h(`
      <div class="page page-design">
        ${pageHead({ kicker: "EP.02 / Design", title: "Five years of design, for real audiences.", lede: G.lede })}
        ${G.arcs.map(arc).join("")}
        ${pageEnd({ route: "#/marketing", label: "Marketing" })}

        <dialog class="lb" id="lb" aria-labelledby="lb-title">
          <div class="lb-in">
            <button class="lb-close" type="button" aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button>
            <div class="lb-img"><img id="lb-img" alt=""></div>
            <div class="lb-file">
              <p class="phead-k" id="lb-arc"></p>
              <h3 class="h3" id="lb-title"></h3>
              <dl class="lb-dl">
                <dt>Client</dt><dd id="lb-client"></dd>
                <dt>Format</dt><dd id="lb-format"></dd>
              </dl>
              <p class="lb-what" id="lb-what"></p>
              <ul class="lb-notes" id="lb-notes" aria-label="Design notes"></ul>
              <div class="lb-nav">
                <button type="button" data-dir="-1" aria-label="Previous piece"><i class="ph ph-arrow-left" aria-hidden="true"></i></button>
                <span id="lb-count" class="tabular"></span>
                <button type="button" data-dir="1" aria-label="Next piece"><i class="ph ph-arrow-right" aria-hidden="true"></i></button>
              </div>
            </div>
          </div>
        </dialog>
      </div>`);
  },
  mount(el) {
    const cleanups = [revealer(el)];
    const lb = el.querySelector("#lb");
    const img = el.querySelector("#lb-img");
    const $ = (s) => el.querySelector(s);
    let k = 0, opener = null;

    const fill = (i, swap = false) => {
      k = (i + all.length) % all.length;
      const p = all[k];
      const set = () => {
        img.src = p.img; img.alt = `${p.title}, full size`; img.width = p.w; img.height = p.h;
        $("#lb-title").textContent = p.title;
        $("#lb-client").textContent = p.client;
        $("#lb-format").textContent = p.format;
        $("#lb-arc").textContent = `${p.arc}, ${p.years}`;
        $("#lb-what").textContent = p.what;
        $("#lb-notes").innerHTML = p.notes.map((n) => `<li>${esc(n)}</li>`).join("");
        $("#lb-count").textContent = `${k + 1} / ${all.length}`;
        img.classList.remove("is-swapping");
      };
      if (!swap) return set();
      img.classList.add("is-swapping");
      setTimeout(set, 160);
    };
    const close = () => (lb.close ? lb.close() : lb.removeAttribute("open"));
    el.querySelectorAll(".g-piece").forEach((b) => b.addEventListener("click", () => {
      opener = b; fill(+b.dataset.k);
      if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    }));
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.querySelectorAll(".lb-nav button").forEach((b) => b.addEventListener("click", () => fill(k + +b.dataset.dir, true)));
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    lb.addEventListener("close", () => opener && opener.focus({ preventScroll: true }));
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") fill(k + 1, true);
      if (e.key === "ArrowLeft") fill(k - 1, true);
    });
    return () => { if (lb.open) close(); cleanups.forEach((f) => f()); };
  },
};
