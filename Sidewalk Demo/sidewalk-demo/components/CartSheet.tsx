"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/data/brand";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/cart";
import BottomSheet from "@/components/BottomSheet";
import Icon from "@/components/Icon";

interface Props {
  lines: CartLine[];
  total: number;
  onInc: (key: string) => void;
  onDec: (key: string) => void;
  onClose: () => void;
  onPay: () => void;
}

export default function CartSheet({ lines, total, onInc, onDec, onClose, onPay }: Props) {
  const reduce = useReducedMotion();
  const press = reduce ? undefined : { scale: 0.94 };

  return (
    <BottomSheet label="Your order" onClose={onClose}>
      <div className="px-5 pb-6">
        <h2 className="font-display text-[22px] font-medium tracking-[0.06em] uppercase">
          Your order
        </h2>

        {lines.length === 0 ? (
          <div className="py-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-cream text-ink-soft">
              <Icon name="receipt" size={22} />
            </span>
            <p className="mt-3 text-sm font-semibold">Nothing here yet</p>
            <p className="mx-auto mt-1 max-w-[30ch] text-[13px] leading-relaxed text-ink-soft">
              Add anything from the menu and it lands in this order.
            </p>
            <button
              onClick={onClose}
              className="mx-auto mt-5 rounded-control border border-ink px-5 py-2.5 text-[13px] font-semibold transition-colors hover:bg-ink hover:text-cream active:bg-ink active:text-cream"
            >
              Back to menu
            </button>
          </div>
        ) : (
          <>
            <ul className="mt-3">
              {lines.map((line) => (
                <li
                  key={line.key}
                  className="flex items-center gap-3 border-b border-line py-3.5 last:border-b-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-[14px] leading-snug font-semibold">
                      {line.item.name}
                      {line.variant && (
                        <span className="ml-1.5 rounded-full bg-cream px-2 py-0.5 text-[10px] font-semibold tracking-wide text-ink-soft uppercase">
                          {line.variant}
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink-soft">
                      {formatPrice(line.unitPrice)} each
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center rounded-full border border-ink/55">
                    <motion.button
                      whileTap={press}
                      onClick={() => onDec(line.key)}
                      className="flex h-7 w-8 items-center justify-center rounded-l-full transition-colors hover:bg-ink/8"
                      aria-label={`Remove one ${line.item.name}`}
                    >
                      <Icon name="minus" size={14} strokeWidth={2} />
                    </motion.button>
                    <span className="w-4 text-center text-[13px] font-semibold tabular-nums">
                      {line.qty}
                    </span>
                    <motion.button
                      whileTap={press}
                      onClick={() => onInc(line.key)}
                      className="flex h-7 w-8 items-center justify-center rounded-r-full transition-colors hover:bg-ink/8"
                      aria-label={`Add one ${line.item.name}`}
                    >
                      <Icon name="plus" size={14} strokeWidth={2} />
                    </motion.button>
                  </div>

                  <span className="w-16 shrink-0 text-right text-[14px] font-semibold tabular-nums">
                    {formatPrice(line.qty * line.unitPrice)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-baseline justify-between border-t-2 border-ink pt-3.5">
              <span className="font-display text-[15px] tracking-[0.12em] uppercase">Subtotal</span>
              <span className="text-[19px] font-bold tabular-nums">{formatPrice(total)}</span>
            </div>

            <motion.button
              whileTap={reduce ? undefined : { scale: 0.98 }}
              onClick={onPay}
              className="mt-4 w-full rounded-panel bg-accent py-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-deep active:bg-accent-deep"
            >
              Proceed to pay {formatPrice(total)}
            </motion.button>

            <p className="mt-3.5 text-[10.5px] leading-relaxed text-ink-soft">{brand.finePrint}</p>
          </>
        )}
      </div>
    </BottomSheet>
  );
}
