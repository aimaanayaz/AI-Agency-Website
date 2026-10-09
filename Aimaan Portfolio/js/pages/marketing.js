import { ADS } from "../data.js";
import { h, esc, num, revealer, counters, pageEnd, lines, focusLines } from "../fx.js";
import { pageHead } from "./shared.js";

function study(c, i) {
  const visual = c.img
    ? `<figure class="cs-creative" data-reveal>
         <img src="${c.img}" alt="${esc(c.imgAlt)}" width="900" height="1350" loading="lazy">
         <figcaption>${esc(c.imgCaption)}</figcaption>
       </figure>`
    : "";
  return `
    <section class="cs ${c.img ? "" : "cs-noimg"}" id="cs-${c.id}" aria-labelledby="cs-${c.id}-h">
      <div class="wrap">
        <header class="cs-head" data-reveal>
          <p class="phead-k">Arc ${String(i + 1).padStart(2, "0")} / ${esc(c.tag)}</p>
          <h2 class="h2" id="cs-${c.id}-h">${esc(c.client)}</h2>
        </header>
        <div class="cs-grid">
          <div class="cs-main">
            <div class="cs-result" data-reveal>
              <div class="cs-big">${lines(focusLines, { cx: 0.3, cy: 0.55, count: 110, inner: 0.16, seed: 80 + i }, "burst")}<span>${num(+c.result)}</span></div>
              <div>
                <p class="cs-rl">${esc(c.resultLabel)}</p>
                <p class="cs-cost">${esc(c.cost)}</p>
              </div>
            </div>
            <div class="cs-means" data-reveal>
              <p class="pbr-k">What it means</p>
              <p class="cs-means-t">${esc(c.meaning)}</p>
            </div>
            <ol class="moves">
              ${c.moves.map((m, j) => `
                <li data-reveal style="--d:${j}">
                  <span class="mv-n">0${j + 1}</span>
                  <div>
                    <h3 class="mv-t">${esc(m.title)}</h3>
                    <p class="mv-x">${esc(m.text)}</p>
                    ${m.quote ? `<p class="mv-q">“${esc(m.quote)}”</p>` : ""}
                    <p class="mv-r">${esc(m.result)}${m.best ? `<span class="best">Best performer</span>` : ""}</p>
                  </div>
                </li>`).join("")}
            </ol>
            <dl class="cs-stats" data-reveal>
              ${c.stats.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd class="tabular">${esc(v)}</dd></div>`).join("")}
            </dl>
          </div>
          ${visual}
        </div>
      </div>
    </section>`;
}

export default {
  id: "marketing",
  title: "Marketing | Aimaan Ayaz",
  render() {
    const A = ADS;
    return h(`
      <div class="page page-marketing">
        ${pageHead({ kicker: "EP.03 / Marketing", title: "₹81k in. 1,451 people asking to buy.", lede: A.lede })}

        <section class="sec sec-tight" aria-labelledby="tot-h">
          <div class="wrap">
            <h2 class="sr-only" id="tot-h">Totals</h2>
            <div class="totals">
              ${A.totals.map((t, i) => `
                <div class="tot" data-reveal style="--d:${i}">
                  <p class="tot-num">${num(t.value, t)}</p>
                  <p class="tot-l">${esc(t.label)}</p>
                  <p class="tot-m">${esc(t.meaning)}</p>
                </div>`).join("")}
            </div>
            <p class="statement" data-reveal>${esc(A.headline.big)} <span class="dim">${esc(A.headline.small)}</span></p>
          </div>
        </section>

        ${A.cases.map(study).join("")}

        <section class="sec sec-tight" aria-labelledby="pb-h">
          <div class="wrap">
            <h2 class="h2" id="pb-h" data-reveal>What worked, every time</h2>
            <ul class="playbook">
              ${A.playbook.map((p, i) => `<li data-reveal style="--d:${i}"><i class="ph ${p.icon}" aria-hidden="true"></i><h3 class="mv-t">${esc(p.title)}</h3><p class="mv-x">${esc(p.text)}</p></li>`).join("")}
            </ul>
            <p class="source">${esc(A.source)}</p>
          </div>
        </section>

        ${pageEnd({ route: "#/contact", label: "Contact" })}
      </div>`);
  },
  mount(el) {
    const c = [revealer(el), counters(el)];
    return () => c.forEach((f) => f());
  },
};
