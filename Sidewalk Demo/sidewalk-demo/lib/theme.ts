import { menu } from "@/data/menu";

/**
 * One tint per menu section, assigned in menu order and cycling through the
 * six tones in globals.css. Colour tells you *where in the menu you are* —
 * it never encodes anything about an individual dish, so two neighbouring
 * sections always look different and a section always looks like itself.
 *
 * These are written out as whole class names on purpose. Tailwind v4 only
 * emits a @theme variable it can see being used, and it cannot see one that
 * is assembled at runtime into a style attribute — building the name from a
 * template string leaves the variable undefined and the tint transparent.
 */
const TINT_BG = [
  "bg-tint-1",
  "bg-tint-2",
  "bg-tint-3",
  "bg-tint-4",
  "bg-tint-5",
  "bg-tint-6",
] as const;

const TINT_BY_CATEGORY = new Map(
  menu.map((cat, i) => [cat.id, TINT_BG[i % TINT_BG.length]])
);

/** Tailwind background class for a section's tint. */
export function tintClass(categoryId: string): string {
  return TINT_BY_CATEGORY.get(categoryId) ?? TINT_BG[0];
}
