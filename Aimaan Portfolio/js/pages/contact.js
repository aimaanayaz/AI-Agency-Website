import { PROFILE, CONTACT } from "../data.js";
import { h, esc, lines, focusLines } from "../fx.js";

export default {
  id: "contact",
  title: "Contact | Aimaan Ayaz",
  render() {
    return h(`
      <div class="page page-contact">
        <section class="contact" aria-labelledby="c-title">
          <div class="wrap contact-in">
            <div class="contact-portrait rise" style="--d:2" aria-hidden="true">
              ${lines(focusLines, { cx: 0.5, cy: 0.5, count: 120, inner: 0.34, seed: 91, w: 1000, hgt: 1000 }, "cp-burst")}
              <span class="cp-ring"><span class="cp-mono">AA</span></span>
            </div>
            <a class="back rise" href="#/" style="--d:0"><i class="ph ph-arrow-left" aria-hidden="true"></i>Home</a>
            <p class="phead-k rise" style="--d:0">EP.04 / Contact</p>
            <h1 class="contact-t" id="c-title"><span class="mask"><span class="rise-up" style="--d:1">${esc(CONTACT.title)}</span></span></h1>
            <p class="contact-l rise" style="--d:3">${esc(CONTACT.line)}</p>
            <ul class="contact-links rise" style="--d:4">
              ${PROFILE.links.map((l) => `
                <li class="cl-row">
                  <a class="cl" href="${l.href}" ${l.id === "email" ? "" : `target="_blank" rel="noopener"`}>
                    <i class="ph ${l.icon}" aria-hidden="true"></i>
                    <span class="cl-l">${esc(l.label)}</span>
                    <span class="cl-v">${esc(l.value)}</span>
                    <i class="ph ph-arrow-up-right cl-a" aria-hidden="true"></i>
                  </a>
                  ${l.id === "email" ? `<button class="cl-copy" type="button" data-copy="${esc(l.value)}">Copy</button>` : ""}
                </li>`).join("")}
            </ul>
            <p class="contact-s rise" style="--d:5">${esc(CONTACT.sub)}</p>
          </div>
        </section>
      </div>`);
  },
  mount(el) {
    el.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = "Copied"; }
      catch { b.textContent = "Select it"; }
      setTimeout(() => { b.textContent = "Copy"; }, 1800);
    }));
    return () => {};
  },
};
