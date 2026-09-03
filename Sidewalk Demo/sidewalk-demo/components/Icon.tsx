import type { ReactNode } from "react";

/**
 * Interface icons, drawn in exactly the same language as the menu
 * illustrations in FoodIcon.tsx — 24px box, no fill, round caps, one
 * stroke weight. One icon family for the whole app, so the chrome and
 * the menu look like they were drawn by the same hand.
 */

const PATHS = {
  minus: <path d="M6 12h12" />,
  plus: <path d="M12 6v12M6 12h12" />,
  arrowRight: (
    <>
      <path d="M4.5 12h15" />
      <path d="m13.5 6 6 6-6 6" />
    </>
  ),
  sections: (
    <>
      <path d="M4 6h6v5H4zM14 6h6v5h-6zM4 14h6v4H4zM14 14h6v4h-6z" />
    </>
  ),
  check: <path d="m5 12.5 5 5L19 7" />,
  lock: (
    <>
      <path d="M5.5 10.5h13v9.5h-13z" />
      <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
    </>
  ),
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
  flame: (
    <>
      <path d="M12 21c3.3 0 5.5-2.2 5.5-5.2 0-3.9-3.7-5.6-3.2-9.8-2 .8-3.4 2.4-3.6 4.3-1-.5-1.4-1.4-1.5-2.5-1.6 1.5-2.7 3.6-2.7 6 0 4.3 2.9 7.2 5.5 7.2Z" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3.5h12v17l-2-1.4-2 1.4-2-1.4-2 1.4-2-1.4-2 1.4Z" />
      <path d="M9 8.5h6M9 12.5h6" />
    </>
  ),
  card: (
    <>
      <path d="M3 6.5h18v11H3z" />
      <path d="M3 10.5h18" />
      <path d="M6.5 14.5h4" />
    </>
  ),
} as const;

export type IconName = keyof typeof PATHS;

interface Props {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function Icon({ name, size = 20, strokeWidth = 1.7, className }: Props): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[name]}
    </svg>
  );
}

/** The ☺ mark the printed menu puts beside a Sidewalk Special. */
export function SpecialMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      className={className}
    >
      <title>Sidewalk Special</title>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M8.4 13.4c.9 1.2 2.1 1.8 3.6 1.8s2.7-.6 3.6-1.8" />
      <path d="M9.2 9v1.3M14.8 9v1.3" />
    </svg>
  );
}
