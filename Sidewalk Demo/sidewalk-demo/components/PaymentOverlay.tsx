"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/cart";
import type { PayMethod } from "@/components/PaymentSheet";

interface Props {
  success: boolean;
  total: number;
  method: PayMethod;
}

/**
 * The one authored moment in the app. The same 96px disc carries the whole
 * beat: an arc travels while the payment is in flight, then the disc fills
 * with accent and the tick draws inside it. One object, two states — so it
 * reads as a single event rather than two screens.
 */
export default function PaymentOverlay({ success, total, method }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 mx-auto flex max-w-md flex-col items-center justify-center bg-cream px-8"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        {/* Track */}
        <svg viewBox="0 0 96 96" className="absolute inset-0 h-24 w-24" aria-hidden>
          <circle cx="48" cy="48" r="43" fill="none" stroke="currentColor" strokeWidth="3" className="text-ink/10" />
        </svg>

        {/* Travelling arc, only while the payment is in flight */}
        {!success && (
          <motion.svg
            viewBox="0 0 96 96"
            className="absolute inset-0 h-24 w-24 text-ink"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
            aria-hidden
          >
            <circle
              cx="48"
              cy="48"
              r="43"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="68 202"
            />
          </motion.svg>
        )}

        {/* The disc fills, then the tick draws inside it */}
        <AnimatePresence>
          {success && (
            <motion.div
              key="disc"
              initial={reduce ? { opacity: 0 } : { scale: 0.2, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 20 }}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-accent"
            >
              <svg width="46" height="46" viewBox="0 0 52 52" fill="none" aria-hidden>
                <motion.path
                  d="M14 26.8 22 34.8 38 17.6"
                  stroke="#fff"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.18, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-7 text-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={success ? "done" : "wait"}
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className={`font-display text-[20px] font-medium tracking-[0.12em] uppercase ${
              success ? "text-accent" : "text-ink"
            }`}
          >
            {success ? "Payment received" : "Processing payment"}
          </motion.p>
        </AnimatePresence>
        <p className="mt-1.5 text-[13px] text-ink-soft tabular-nums">
          {formatPrice(total)} · {method}
        </p>
      </div>
    </motion.div>
  );
}
