"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { formatPrice } from "@/lib/cart";
import Icon from "@/components/Icon";

interface Props {
  count: number;
  total: number;
  onView: () => void;
}

export default function CartBar({ count, total, onView }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { y: 96 }}
      animate={reduce ? { opacity: 1 } : { y: 0 }}
      exit={reduce ? { opacity: 0 } : { y: 96 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <motion.button
        onClick={onView}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        className="flex w-full items-center justify-between gap-3 rounded-panel bg-ink py-3.5 pr-4 pl-3.5 text-cream shadow-bar transition-colors hover:bg-ink/92"
      >
        <span className="flex items-center gap-3">
          <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-cream px-2 text-[13px] font-bold text-ink tabular-nums">
            {count}
          </span>
          <span className="flex flex-col items-start leading-tight">
            <span className="text-[11px] tracking-wide text-cream/70">
              {count === 1 ? "item" : "items"} in your order
            </span>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={total}
                initial={reduce ? false : { y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { y: 10, opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="text-[15px] font-bold tabular-nums"
              >
                {formatPrice(total)}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>

        <span className="flex items-center gap-1.5 text-[13px] font-semibold">
          View cart
          <Icon name="arrowRight" size={16} strokeWidth={2} />
        </span>
      </motion.button>
    </motion.div>
  );
}
