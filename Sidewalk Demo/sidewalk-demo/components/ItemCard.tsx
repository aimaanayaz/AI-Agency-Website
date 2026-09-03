"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { MenuItem, Tag } from "@/data/menu";
import type { Variant } from "@/lib/cart";
import { formatPrice } from "@/lib/cart";
import { tintClass } from "@/lib/theme";
import FoodIcon from "@/components/FoodIcon";
import Icon, { SpecialMark } from "@/components/Icon";

/**
 * The diet mark, drawn the way it is printed on Indian menus: a filled dot
 * inside a ruled square. Deep enough to actually be read at 12px.
 */
const DIET_LABEL = {
  veg: "Vegetarian",
  nonveg: "Non-vegetarian",
  egg: "Contains egg",
} as const;

/* Whole class names, not template strings: see the note in lib/theme.ts. */
const DIET_COLOR = {
  veg: "text-veg",
  nonveg: "text-nonveg",
  egg: "text-egg",
} as const;

function DietMark({ tags }: { tags?: Tag[] }) {
  const diet = tags?.find((t) => t === "veg" || t === "nonveg" || t === "egg");
  if (!diet) return null;
  return (
    <span
      role="img"
      aria-label={DIET_LABEL[diet]}
      title={DIET_LABEL[diet]}
      className={`mt-[3px] flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border border-current ${DIET_COLOR[diet]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
    </span>
  );
}

interface Props {
  item: MenuItem;
  categoryId: string;
  qty: number;
  onAdd: (item: MenuItem, variant?: Variant) => void;
  onInc: () => void;
  onDec: () => void;
}

export default function ItemCard({ item, categoryId, qty, onAdd, onInc, onDec }: Props) {
  const [choosing, setChoosing] = useState(false);
  const reduce = useReducedMotion();
  const hasVariants = item.icedPrice !== undefined;

  const add = (variant?: Variant) => {
    setChoosing(false);
    onAdd(item, variant);
  };

  const press = reduce ? undefined : { scale: 0.94 };

  return (
    <div className="py-4">
      <div className="flex gap-3.5">
        {/* Section-tinted tile carrying the menu's own line illustration */}
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-control text-ink/70 shadow-[inset_0_0_0_1px_rgb(25_23_19_/_0.09)] ${tintClass(categoryId)}`}
        >
          <FoodIcon item={item} categoryId={categoryId} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="flex items-start gap-1.5 text-[15px] leading-snug font-semibold">
            <DietMark tags={item.tags} />
            <span className="min-w-0">
              {item.name}
              {item.tags?.includes("special") && (
                <SpecialMark className="ml-1.5 inline-block align-[-2px] text-accent" />
              )}
              {item.tags?.includes("spicy") && (
                <Icon
                  name="flame"
                  size={13}
                  className="ml-1 inline-block align-[-2px] text-spice"
                />
              )}
            </span>
          </h3>

          {item.description && (
            <p className="clamp-2 mt-1 text-[12.5px] leading-[1.45] text-ink-soft">
              {item.description}
            </p>
          )}

          {/* Price and control share one baseline row, so the control can
              never crowd the description no matter how long it runs. */}
          <div className="mt-2.5 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold whitespace-nowrap">
              {hasVariants ? (
                <>
                  {formatPrice(item.price)}
                  <span className="font-normal text-ink-soft"> hot</span>
                  <span className="mx-1.5 text-ink/30">·</span>
                  {formatPrice(item.icedPrice!)}
                  <span className="font-normal text-ink-soft"> iced</span>
                </>
              ) : (
                formatPrice(item.price)
              )}
            </p>

            {qty === 0 ? (
              <motion.button
                whileTap={press}
                onClick={() => (hasVariants ? setChoosing((c) => !c) : add())}
                aria-expanded={hasVariants ? choosing : undefined}
                className="shrink-0 rounded-control border border-ink px-4 py-1.5 text-[13px] font-semibold tracking-wide transition-colors hover:bg-ink hover:text-cream active:bg-ink active:text-cream"
              >
                Add
              </motion.button>
            ) : (
              <div className="flex shrink-0 items-center rounded-full bg-ink text-cream">
                <motion.button
                  whileTap={press}
                  onClick={onDec}
                  className="flex h-8 w-9 items-center justify-center rounded-l-full transition-colors hover:bg-cream/15"
                  aria-label={`Remove one ${item.name}`}
                >
                  <Icon name="minus" size={15} strokeWidth={2} />
                </motion.button>
                <span className="w-4 text-center text-[13px] font-semibold tabular-nums">
                  {qty}
                </span>
                <motion.button
                  whileTap={press}
                  onClick={() => (hasVariants ? setChoosing((c) => !c) : onInc())}
                  className="flex h-8 w-9 items-center justify-center rounded-r-full transition-colors hover:bg-cream/15"
                  aria-label={`Add one ${item.name}`}
                >
                  <Icon name="plus" size={15} strokeWidth={2} />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hot or Iced is asked inline rather than in a popover: nothing can clip
          it, and the choice stays next to the item it belongs to. */}
      <AnimatePresence initial={false}>
        {choosing && hasVariants && (
          <motion.div
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-3 ml-[74px] flex gap-2">
              {(
                [
                  ["Hot", item.price],
                  ["Iced", item.icedPrice!],
                ] as const
              ).map(([variant, price]) => (
                <motion.button
                  key={variant}
                  whileTap={press}
                  onClick={() => add(variant)}
                  className="flex-1 rounded-control border border-ink/55 bg-paper px-3 py-2 text-[13px] font-medium transition-colors hover:border-ink hover:bg-cream active:bg-ink active:text-cream"
                >
                  {variant}
                  <span className="ml-1.5 text-ink-soft">{formatPrice(price)}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
