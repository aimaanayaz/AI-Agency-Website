"use client";

import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/data/brand";
import { formatPrice } from "@/lib/cart";
import BottomSheet from "@/components/BottomSheet";
import Icon from "@/components/Icon";

export type PayMethod = "Google Pay" | "PhonePe" | "Paytm" | "Card";

/** Brand hues, deepened just enough that the white initial clears WCAG AA. */
const UPI_OPTIONS: { method: PayMethod; badge: string; color: string }[] = [
  { method: "Google Pay", badge: "G", color: "#1967d2" },
  { method: "PhonePe", badge: "Pe", color: "#5f259f" },
  { method: "Paytm", badge: "P", color: "#0072a8" },
];

interface Props {
  total: number;
  table: string;
  method: PayMethod;
  onSelect: (m: PayMethod) => void;
  onBack: () => void;
  onPay: () => void;
}

function Radio({ selected }: { selected: boolean }) {
  return (
    <span
      aria-hidden
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        selected ? "border-accent" : "border-ink/55"
      }`}
    >
      {selected && <span className="h-2.5 w-2.5 rounded-full bg-accent" />}
    </span>
  );
}

export default function PaymentSheet({ total, table, method, onSelect, onBack, onPay }: Props) {
  const reduce = useReducedMotion();

  const row = (
    key: PayMethod,
    badge: React.ReactNode,
    label: string,
    last = false
  ) => (
    <button
      key={key}
      role="radio"
      aria-checked={method === key}
      onClick={() => onSelect(key)}
      className={`flex w-full items-center gap-3 px-4 py-3.5 transition-colors hover:bg-cream active:bg-cream ${
        last ? "" : "border-b border-line"
      }`}
    >
      {badge}
      <span className="flex-1 text-left text-[14px] font-medium">{label}</span>
      <Radio selected={method === key} />
    </button>
  );

  return (
    <BottomSheet label="Choose a payment method" onClose={onBack}>
      <div className="mx-5 flex items-center justify-between gap-3 rounded-panel bg-ink px-4 py-3.5 text-cream">
        <div className="min-w-0">
          <p className="font-display text-[15px] font-medium tracking-[0.14em] uppercase">
            {brand.name}
          </p>
          <p className="mt-0.5 text-[11.5px] text-cream/70">Dine-in · Table {table}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[19px] font-bold tabular-nums">{formatPrice(total)}</p>
          <p className="mt-0.5 text-[10px] tracking-wide text-cream/70 uppercase">Amount payable</p>
        </div>
      </div>

      <div className="px-5 pt-5 pb-6">
        <div role="radiogroup" aria-label="UPI apps">
          <p className="mb-2 text-[12px] font-semibold text-ink-soft">Pay by UPI</p>
          <div className="overflow-hidden rounded-panel border border-line bg-paper">
            {UPI_OPTIONS.map((opt, i) =>
              row(
                opt.method,
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
                  style={{ background: opt.color }}
                >
                  {opt.badge}
                </span>,
                opt.method,
                i === UPI_OPTIONS.length - 1
              )
            )}
          </div>
        </div>

        <div role="radiogroup" aria-label="Cards" className="mt-5">
          <p className="mb-2 text-[12px] font-semibold text-ink-soft">Pay by card</p>
          <div className="overflow-hidden rounded-panel border border-line bg-paper">
            {row(
              "Card",
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-cream"
              >
                <Icon name="card" size={17} />
              </span>,
              "Credit or debit card",
              true
            )}
          </div>
        </div>

        <motion.button
          whileTap={reduce ? undefined : { scale: 0.98 }}
          onClick={onPay}
          className="mt-6 w-full rounded-panel bg-accent py-4 text-[15px] font-semibold text-white transition-colors hover:bg-accent-deep active:bg-accent-deep"
        >
          Pay {formatPrice(total)}
        </motion.button>

        <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
          <Icon name="lock" size={12} strokeWidth={1.9} />
          Secured checkout. This is a demo, so no real payment is taken.
        </p>
      </div>
    </BottomSheet>
  );
}
