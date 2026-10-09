import { WORK } from "../data.js";
import { h, esc, revealer, pageEnd } from "../fx.js";
import { pageHead } from "./shared.js";

const block = (k, v) => `<div class="pbr"><p class="pbr-k">${k}</p><p class="pbr-v">${esc(v)}</p></div>`;
const stack = (s) => `<ul class="stack">${s.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;

export default {
  id: "work",
  title: "Systems | Aimaan Ayaz",
  render() {
    const W = WORK, f = W.featured;
    return h(`
      <div class="page page-work">
        ${pageHead({ kicker: "EP.01 / Systems", title: "Software and AI that run the business.", lede: W.lede })}

        <section class="sec sec-tight" aria-labelledby="ft-h">
          <div class="wrap feature">
            <figure class="feature-img" data-reveal>
              <img src="${f.img}" alt="Screenshot of ${esc(f.title)}" width="960" height="600" loading="lazy">
            </figure>
            <div class="feature-copy" data-reveal style="--d:1">
              <p class="meta"><span class="dot-live"></span>${esc(f.status)}<span class="sep"></span>${esc(f.client)}</p>
              <h2 class="h2" id="ft-h">${esc(f.title)}</h2>
              ${block("The problem", f.problem)}
              ${block("What I built", f.built)}
              ${block("What it means", f.result)}
              ${stack(f.stack)}
              <a class="link" href="${f.href}" target="_blank" rel="noopener">Visit trestle.nxdl.in <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
            </div>
          </div>
        </section>

        <section class="sec sec-tight" aria-label="More case studies">
          <div class="wrap">
            <ol class="cases">
              ${W.cases.map((c, i) => `
                <li class="case" data-reveal style="--d:${i % 2}">
                  <div class="case-head">
                    <span class="case-n">0${i + 2}</span>
                    <h3 class="h3">${esc(c.title)}</h3>
                    <p class="meta"><span class="dot-live"></span>${esc(c.status)}</p>
                    <p class="case-client">${esc(c.client)}</p>
                  </div>
                  <div class="case-body">
                    ${block("The problem", c.problem)}
                    ${block("What I built", c.built)}
                    <p class="case-result">${esc(c.result)}</p>
                    ${stack(c.stack)}
                  </div>
                </li>`).join("")}
            </ol>
          </div>
        </section>

        <section class="sec sec-tight" aria-labelledby="more-h">
          <div class="wrap">
            <h2 class="h2" id="more-h" data-reveal>More builds</h2>
            <ul class="more">
              ${W.more.map((m, i) => `
                <li data-reveal style="--d:${i % 3}">
                  ${m.href ? `<a class="more-in" href="${m.href}" target="_blank" rel="noopener">` : `<div class="more-in">`}
                    <span class="more-tag">${esc(m.tag)}</span>
                    <span class="more-t">${esc(m.title)}${m.href ? ` <i class="ph ph-arrow-up-right" aria-hidden="true"></i>` : ""}</span>
                    <span class="more-x">${esc(m.text)}</span>
                  ${m.href ? `</a>` : `</div>`}
                </li>`).join("")}
            </ul>
          </div>
        </section>

        <section class="sec sec-tight" aria-labelledby="kit-h">
          <div class="wrap">
            <h2 class="h2" id="kit-h" data-reveal>Toolkit</h2>
            <div class="kit">
              ${W.toolkit.map((g, i) => `<div data-reveal style="--d:${i}"><p class="kit-g">${esc(g.group)}</p>${stack(g.items)}</div>`).join("")}
            </div>
          </div>
        </section>

        ${pageEnd({ route: "#/design", label: "Design" })}
      </div>`);
  },
  mount(el) {
    const c = [revealer(el)];
    return () => c.forEach((f) => f());
  },
};
