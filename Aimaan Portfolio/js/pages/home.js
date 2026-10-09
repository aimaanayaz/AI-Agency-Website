import { PROFILE, HOME } from "../data.js";
import { h, esc, num, revealer, counters, pageEnd, lines, focusLines, speedLines } from "../fx.js";

export default {
  id: "home",
  title: "Aimaan Ayaz | Systems, design and marketing",
  render() {
    const P = PROFILE, H = HOME;
    const clients = H.clients.map((c) => `<li>${esc(c)}</li>`).join("");
    return h(`
      <div class="page page-home">
        <section class="hero" aria-labelledby="hero-name">
          <div class="hero-slab" aria-hidden="true"></div>
          <div class="hero-panel" aria-hidden="true">
            ${lines(focusLines, { cx: 0.57, cy: 0.46, count: 180, inner: 0.3, seed: 11 }, "hero-focus")}
            <span class="hero-tone"></span>
            <span class="hero-mono">AA</span>
          </div>
          ${lines(speedLines, { count: 60, seed: 7, angle: -12 }, "hero-speed")}
          <div class="wrap hero-in">
            <p class="hero-k rise" style="--d:0">${esc(P.roles)}</p>
            <h1 class="hero-name" id="hero-name">
              <span class="mask"><span class="rise-up" style="--d:1">${esc(P.first)}</span></span>
              <span class="mask"><span class="rise-up" style="--d:2">${esc(P.last)}</span></span>
            </h1>
            <p class="hero-lines">
              ${P.lines.map((l, i) => `<span class="rise" style="--d:${4 + i}">${esc(l[0])}<em>${esc(l[1])}</em>${esc(l[2])}</span>`).join("")}
            </p>
            <div class="hero-cta rise" style="--d:7">
              <a class="btn btn-primary" href="#/work">See the work <i class="ph ph-arrow-right" aria-hidden="true"></i></a>
              <a class="btn btn-ghost" href="#/contact">Get in touch</a>
            </div>
          </div>
        </section>

        <section class="proof" aria-label="Results in numbers">
          <div class="wrap proof-grid">
            ${H.proof.map((p, i) => `
              <div class="proof-item" data-reveal style="--d:${i}">
                ${lines(focusLines, { cx: 0.2, cy: 0.35, count: 70, inner: 0.12, seed: 30 + i }, "burst")}
                <p class="proof-num">${num(p.value, p)}</p>
                <p class="proof-label">${esc(p.label)}</p>
                <p class="proof-mean">${esc(p.meaning)}</p>
              </div>`).join("")}
          </div>
        </section>

        <section class="clients" aria-label="Clients and collaborators">
          <p class="wrap clients-k">Built for and with</p>
          <div class="marquee"><ul>${clients}</ul><ul aria-hidden="true">${clients}</ul></div>
        </section>

        <section class="sec" aria-labelledby="ch-h">
          <div class="wrap">
            <h2 class="h2" id="ch-h" data-reveal>Three episodes,<br><span class="dim">all of them for real clients.</span></h2>
            <div class="chapters">
              ${H.chapters.map((c, i) => `
                <a class="chapter ch-${i}" href="${c.route}" data-reveal style="--d:${i}">
                  <span class="ch-img"><img src="${c.img}" alt="${esc(c.alt)}" loading="lazy">${lines(focusLines, { cx: 0.5, cy: 0.45, count: 120, inner: 0.25, seed: 50 + i }, "ch-lines")}<span class="ch-tone"></span></span>
                  <span class="ch-body">
                    <span class="ch-top"><span class="ch-num">EP.${c.num}</span><span class="ch-stat">${esc(c.stat)}</span></span>
                    <span class="ch-kicker">${esc(c.kicker)}</span>
                    <span class="ch-title">${esc(c.title)}<i class="ph ph-arrow-up-right" aria-hidden="true"></i></span>
                    <span class="ch-text">${esc(c.text)}</span>
                  </span>
                </a>`).join("")}
            </div>
          </div>
        </section>

        <section class="sec about" aria-labelledby="about-h">
          <div class="wrap about-grid">
            <h2 class="h2" id="about-h" data-reveal>${esc(H.about.title)}</h2>
            <ol class="beats">
              ${H.about.beats.map((b, i) => `<li data-reveal style="--d:${i}"><span class="beat-y">${esc(b.year)}</span><p>${esc(b.text)}</p></li>`).join("")}
            </ol>
          </div>
        </section>

        <section class="cta-band" aria-labelledby="cta-h">
          <div class="wrap">
            <h2 class="cta-h" id="cta-h" data-reveal>Tell me what you sell.<br><span class="dim">I'll tell you the first thing I'd automate.</span></h2>
            <div class="cta-row" data-reveal>
              <a class="btn btn-primary btn-lg" href="mailto:${P.email}"><i class="ph ph-envelope-simple" aria-hidden="true"></i>${esc(P.email)}</a>
              <div class="socials">
                ${P.links.filter((l) => l.id !== "email").map((l) => `<a href="${l.href}" target="_blank" rel="noopener" aria-label="${l.label}"><i class="ph ${l.icon}" aria-hidden="true"></i></a>`).join("")}
              </div>
            </div>
          </div>
        </section>
        ${pageEnd(null)}
      </div>`);
  },
  mount(el) {
    const c = [revealer(el), counters(el)];
    return () => c.forEach((f) => f());
  },
};
