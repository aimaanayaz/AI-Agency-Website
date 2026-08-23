"use client";

import { FormEvent, useState } from "react";
import { BGPattern } from "@/components/bg-pattern";

// A standalone visual screen. There is nothing behind it — no access
// codes, no session, no API. The field and the button are part of the
// composition; submitting does nothing by design.

// ── The access mark: one thin ring, one slow orbiting arc ──────────
function Mark() {
  return (
    <div className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center">
      {/* Static base ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: "1px solid rgba(255,255,255,0.12)" }}
      />
      {/* Slow orbiting highlight arc */}
      <svg className="absolute inset-0 w-full h-full j-orbit" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="rgba(255,255,255,0.85)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeDasharray="34 274"
          opacity={0.6}
        />
      </svg>
      {/* Inner luminance */}
      <div
        className="absolute rounded-full j-breathe"
        style={{
          width: "62%",
          height: "62%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.10) 0%, transparent 70%)",
        }}
      />
      <span className="j-mark text-lg sm:text-xl">JARVIS</span>
    </div>
  );
}

export default function JarvisPage() {
  const [value, setValue] = useState("");

  // Inert — the screen is decorative, so never navigate or post.
  const submit = (e: FormEvent) => e.preventDefault();

  return (
    <>
      {/* Atmosphere: the site's own dot pattern → ambient hairline → vignette */}
      <div className="absolute inset-0 -z-10 pointer-events-none" aria-hidden>
        <BGPattern
          variant="dots"
          fill="rgba(255,255,255,0.04)"
          size={26}
          mask="fade-edges"
        />
        <div className="j-drift" style={{ top: 0 }} />
        <div className="j-vignette" />
      </div>

      <div className="absolute inset-0 z-40 flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center">
          <span className="j-label mb-12">Z Agency · Private Access</span>

          <Mark />

          {/* Keeps the mark and the field at the spacing the composition wants */}
          <div className="h-5 mt-11" />

          <form onSubmit={submit} className="mt-7 w-[260px] sm:w-[300px]">
            <input
              type="password"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              aria-label="Access code"
              placeholder="ACCESS CODE"
              className="w-full bg-transparent text-center outline-none
                         j-mono text-base tracking-[0.5em]
                         placeholder:text-sm placeholder:tracking-[0.35em]"
              style={{
                color: "var(--j-t-1)",
                caretColor: "rgba(255,255,255,0.7)",
              }}
            />
            <div
              className="mt-4 h-px w-full origin-center transition-all duration-500 j-ease"
              style={{
                background: "rgba(255,255,255,0.5)",
                opacity: value ? 0.7 : 0.22,
              }}
            />

            <button
              type="submit"
              className="group mt-9 mx-auto flex items-center gap-3 px-6 py-2.5
                         rounded-full border j-ease transition-all
                         hover:bg-white/[0.04]"
              style={{ borderColor: "var(--j-line-strong)" }}
            >
              <span className="j-mono text-[10px] tracking-[0.35em] uppercase text-white/80">
                Enter
              </span>
              <span className="text-white/50 group-hover:text-white/90 group-hover:translate-x-0.5 transition-all duration-500 j-ease text-xs">
                →
              </span>
            </button>
          </form>
        </div>

        <span className="absolute bottom-8 j-label">EST. 2026 · Lucknow</span>
      </div>
    </>
  );
}
