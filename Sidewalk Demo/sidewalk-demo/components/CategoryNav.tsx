"use client";

import { AnimatePresence } from "framer-motion";
import { menu } from "@/data/menu";
import { tintClass } from "@/lib/theme";
import BottomSheet from "@/components/BottomSheet";

interface Props {
  open: boolean;
  activeCat: string;
  onClose: () => void;
  onJump: (catId: string) => void;
}

/** The whole menu at a glance, for when scrubbing the rail is too slow. */
export default function SectionsSheet({ open, activeCat, onClose, onJump }: Props) {
  const jump = (catId: string) => {
    onClose();
    onJump(catId);
  };

  return (
    <AnimatePresence>
      {open && (
        <BottomSheet key="sections" label="Menu sections" onClose={onClose}>
          <div className="px-5 pb-8">
            <h2 className="font-display text-[22px] font-medium tracking-[0.06em] uppercase">
              The whole menu
            </h2>

            <ul className="mt-4 grid grid-cols-2 gap-2">
              {menu.map((cat) => {
                const active = cat.id === activeCat;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => jump(cat.id)}
                      aria-current={active ? "true" : undefined}
                      className={`flex h-full w-full items-start gap-2.5 rounded-control px-3 py-2.5 text-left transition-colors ${
                        active
                          ? "border border-ink bg-ink text-cream"
                          : "border border-ink/15 bg-cream hover:border-ink/35 hover:bg-line/60 active:bg-line"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`mt-[3px] h-3.5 w-3.5 shrink-0 rounded-[4px] ${tintClass(cat.id)}`}
                      />
                      <span className="min-w-0">
                        <span className="block text-[13px] leading-tight font-semibold">
                          {cat.name}
                        </span>
                        <span
                          className={`mt-0.5 block text-[11px] ${
                            active ? "text-cream/70" : "text-ink-soft"
                          }`}
                        >
                          {cat.items.length} items
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </BottomSheet>
      )}
    </AnimatePresence>
  );
}
