import { esc, lines, speedLines } from "../fx.js";

/** Page header for the inner pages: a quiet kicker, one big line, one paragraph. */
export function pageHead({ kicker, title, lede, aside = "" }) {
  return `
    <header class="phead">
      ${lines(speedLines, { count: 70, seed: 21, angle: -10 }, "phead-speed")}
      <div class="wrap phead-in">
        <a class="back rise" href="#/" style="--d:0"><i class="ph ph-arrow-left" aria-hidden="true"></i>Home</a>
        <p class="phead-k rise" style="--d:0">${esc(kicker)}</p>
        <h1 class="phead-t"><span class="mask"><span class="rise-up" style="--d:1">${esc(title)}</span></span></h1>
        <p class="phead-l rise" style="--d:3">${esc(lede)}</p>
        ${aside}
      </div>
    </header>`;
}
