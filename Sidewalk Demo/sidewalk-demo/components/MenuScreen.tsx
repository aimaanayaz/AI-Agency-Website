"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { MenuItem } from "@/data/menu";
import { menu } from "@/data/menu";
import { brand } from "@/data/brand";
import type { CartLine, Variant } from "@/lib/cart";
import { tintClass } from "@/lib/theme";
import ItemCard from "@/components/ItemCard";
import SectionsSheet from "@/components/CategoryNav";
import Icon from "@/components/Icon";
import logo from "@/public/logo.png";

interface Props {
  table: string;
  lines: CartLine[];
  onAdd: (item: MenuItem, variant?: Variant) => void;
  onInc: (item: MenuItem) => void;
  onDec: (item: MenuItem) => void;
}

export default function MenuScreen({ table, lines, onAdd, onInc, onDec }: Props) {
  const [activeCat, setActiveCat] = useState(menu[0].id);
  const [sectionsOpen, setSectionsOpen] = useState(false);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const suppressSpy = useRef(false);
  const reduce = useReducedMotion();

  // Scroll-spy: the rail always shows the section you are actually reading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressSpy.current) return;
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveCat(visible[0].target.id.replace("cat-", ""));
        }
      },
      { rootMargin: "-140px 0px -60% 0px" }
    );
    for (const cat of menu) {
      const el = document.getElementById(`cat-${cat.id}`);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Keep the active tab in view on the rail
  useEffect(() => {
    tabRefs.current[activeCat]?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCat, reduce]);

  const jumpTo = (catId: string) => {
    setActiveCat(catId);
    // Don't let the spy fight the smooth scroll
    suppressSpy.current = true;
    document.getElementById(`cat-${catId}`)?.scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
    });
    setTimeout(() => (suppressSpy.current = false), 900);
  };

  const qtyOf = (item: MenuItem) =>
    lines.filter((l) => l.item.id === item.id).reduce((n, l) => n + l.qty, 0);

  return (
    <main className="pb-32">
      <header className="sticky top-0 z-20 border-b border-line bg-cream/92 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
          <Image src={logo} alt={brand.logoAlt} priority className="h-6 w-auto" />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSectionsOpen(true)}
              aria-label="Jump to a menu section"
              className="flex h-8 w-8 items-center justify-center rounded-control border border-ink/60 text-ink transition-colors hover:bg-ink/8 active:bg-ink active:text-cream"
            >
              <Icon name="sections" size={17} />
            </button>
            <span className="rounded-full bg-ink px-3 py-1.5 font-display text-[11px] font-medium tracking-[0.16em] text-cream uppercase">
              Table {table}
            </span>
          </div>
        </div>

        {/* Section rail. Quiet sans, not shouting caps — the underline does
            the work, and it slides so you feel where you are. */}
        <nav aria-label="Menu sections" className="no-scrollbar flex gap-1 overflow-x-auto px-4">
          {menu.map((cat) => {
            const active = cat.id === activeCat;
            return (
              <button
                key={cat.id}
                ref={(el) => {
                  tabRefs.current[cat.id] = el;
                }}
                onClick={() => jumpTo(cat.id)}
                aria-current={active ? "true" : undefined}
                className={`relative shrink-0 px-2 pt-1 pb-2.5 text-[13px] whitespace-nowrap transition-colors ${
                  active ? "font-semibold text-ink" : "font-medium text-ink-soft hover:text-ink"
                }`}
              >
                {cat.name}
                {active && (
                  <motion.span
                    layoutId="rail-underline"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    className="absolute inset-x-2 -bottom-px h-[2.5px] rounded-full bg-ink"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="px-5 pt-7 pb-2">
        <h1 className="font-display text-[32px] leading-none font-medium tracking-[0.02em] uppercase">
          {brand.welcome}
        </h1>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
          {brand.tagline}. Order right here and we&apos;ll bring it to Table {table}.
        </p>
      </div>

      {menu.map((cat) => (
        <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-28 px-5 pt-7">
          {/* Section band, tinted to match every tile inside it */}
          <div className={`-mx-5 px-5 py-3.5 ${tintClass(cat.id)}`}>
            <h2 className="font-display text-[19px] leading-tight font-medium tracking-[0.06em] uppercase">
              {cat.name}
            </h2>
            {cat.note && (
              <p className="mt-1 text-[11.5px] leading-relaxed text-ink-soft">{cat.note}</p>
            )}
          </div>

          <ul>
            {cat.items.map((item) => (
              <li key={item.id} className="border-b border-line last:border-b-0">
                <ItemCard
                  item={item}
                  categoryId={cat.id}
                  qty={qtyOf(item)}
                  onAdd={onAdd}
                  onInc={() => onInc(item)}
                  onDec={() => onDec(item)}
                />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <SectionsSheet
        open={sectionsOpen}
        activeCat={activeCat}
        onClose={() => setSectionsOpen(false)}
        onJump={jumpTo}
      />

      <footer className="mt-10 border-t border-line px-5 pt-6 pb-8 text-center">
        <p className="text-[11px] leading-relaxed text-ink-soft">{brand.finePrint}</p>
        <p className="mt-3 font-display text-[11px] tracking-[0.22em] uppercase">
          With love, Team {brand.name}
        </p>
      </footer>
    </main>
  );
}
