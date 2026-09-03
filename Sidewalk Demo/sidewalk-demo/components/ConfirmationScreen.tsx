"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { brand } from "@/data/brand";
import type { CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/cart";
import Icon from "@/components/Icon";
import logo from "@/public/logo.png";

interface Props {
  order: { number: string; lines: CartLine[]; total: number };
  table: string;
  onDone: () => void;
}

export default function ConfirmationScreen({ order, table, onDone }: Props) {
  const reduce = useReducedMotion();

  return (
    <motion.main
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      className="flex min-h-dvh flex-col px-5 pt-8 pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <div className="flex justify-center">
        <Image src={logo} alt={brand.logoAlt} className="h-6 w-auto" />
      </div>

      <div className="mt-9 flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white">
          <Icon name="check" size={28} strokeWidth={2.4} />
        </span>
        <h1 className="mt-4 font-display text-[26px] leading-tight font-medium tracking-[0.08em] uppercase">
          Order confirmed
        </h1>
        <p className="mt-2.5 rounded-full bg-ink px-4 py-1.5 font-display text-[12px] tracking-[0.16em] text-cream uppercase">
          {order.number}
        </p>
      </div>

      <div className="mt-8 rounded-panel border border-line bg-paper p-5">
        <div className="flex items-baseline justify-between border-b-2 border-ink pb-2.5">
          <span className="font-display text-[13px] tracking-[0.14em] uppercase">
            Order summary
          </span>
          <span className="font-display text-[13px] tracking-[0.14em] uppercase">
            Table {table}
          </span>
        </div>

        <ul>
          {order.lines.map((line) => (
            <li
              key={line.key}
              className="flex items-baseline justify-between gap-3 border-b border-line py-2.5 text-[13.5px] last:border-b-0"
            >
              <span className="min-w-0">
                <span className="font-semibold tabular-nums">{line.qty}</span>
                <span className="text-ink-soft"> × </span>
                {line.item.name}
                {line.variant && <span className="text-ink-soft"> ({line.variant})</span>}
              </span>
              <span className="shrink-0 font-medium tabular-nums">
                {formatPrice(line.qty * line.unitPrice)}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-1 flex items-baseline justify-between border-t-2 border-ink pt-3">
          <span className="font-display text-[13px] tracking-[0.14em] uppercase">Total paid</span>
          <span className="text-[17px] font-bold tabular-nums">{formatPrice(order.total)}</span>
        </div>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="mt-5 rounded-panel bg-ink px-5 py-4 text-center text-cream"
      >
        <p className="font-display text-[15px] tracking-[0.1em] uppercase">
          We&apos;re making it now
        </p>
        <p className="mt-1 text-[13px] text-cream/75">
          About {brand.estimatedTime} to Table {table}. Sit back.
        </p>
      </motion.div>

      <div className="flex-1" />

      <p className="mt-8 text-center text-[12px] leading-relaxed text-ink-soft">
        Keep this screen handy. Your server may ask for the order number.
      </p>

      <button
        onClick={onDone}
        className="mt-3 w-full rounded-panel border border-ink py-4 text-[14px] font-semibold transition-colors hover:bg-ink hover:text-cream active:bg-ink active:text-cream"
      >
        Order something else
      </button>
    </motion.main>
  );
}
