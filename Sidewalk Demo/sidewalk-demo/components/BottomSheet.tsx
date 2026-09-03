"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface Props {
  /** Announced as the dialog's name. */
  label: string;
  onClose?: () => void;
  children: ReactNode;
}

/**
 * Shared slide-up sheet. Closes on Escape and on backdrop tap, locks the page
 * behind it so the menu doesn't scroll under your thumb, and returns focus to
 * whatever opened it.
 */
/* Sheets can hand over to each other (cart to payment) while both are briefly
   mounted, so the page lock is counted rather than toggled. */
let openSheets = 0;

export default function BottomSheet({ label, onClose, children }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    if (openSheets === 0) document.body.style.overflow = "hidden";
    openSheets += 1;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);

    panel.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKey);
      openSheets -= 1;
      if (openSheets === 0) {
        document.body.style.overflow = "";
        // Only hand focus back once the last sheet has gone, or a sheet
        // opening from another sheet would steal it straight back.
        if (opener?.isConnected) opener.focus({ preventScroll: true });
      }
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 mx-auto flex max-w-md flex-col justify-end">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/45"
      />
      <motion.div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        initial={reduce ? { opacity: 0 } : { y: "100%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: "100%" }}
        transition={{ type: "spring", stiffness: 340, damping: 34 }}
        className="relative max-h-[88dvh] overflow-y-auto rounded-t-sheet bg-paper shadow-sheet outline-none"
      >
        <div className="sticky top-0 z-10 flex justify-center bg-paper pt-3 pb-2">
          <div className="h-1 w-9 rounded-full bg-ink/15" />
        </div>
        {children}
      </motion.div>
    </div>
  );
}
