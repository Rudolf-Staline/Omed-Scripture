import type { ReactElement, SVGProps } from "react";

/**
 * A tiny curated icon set (stroke-based, currentColor) so the library stays
 * dependency-free. Pass `name` for a built-in glyph; components also accept a
 * raw ReactNode wherever an icon is expected, so any icon library still works.
 */
export type IconName =
  | "filter"
  | "undo"
  | "close"
  | "check"
  | "check-circle"
  | "info"
  | "warning"
  | "error"
  | "search"
  | "plus"
  | "calendar"
  | "chevron-down"
  | "chevron-right"
  | "chevron-left"
  | "menu"
  | "arrow-right"
  | "trash"
  | "settings"
  | "user"
  | "external"
  | "spinner";

const paths: Record<IconName, ReactElement> = {
  filter: <path d="M3 5h18M6 12h12M10 19h4" />,
  undo: <path d="M9 14 4 9l5-5M4 9h11a5 5 0 0 1 0 10h-4" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  check: <path d="m20 6-11 11-5-5" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  warning: <path d="M12 3 2 20h20L12 3ZM12 10v4M12 17h.01" />,
  error: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v4M12 16h.01" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  calendar: (
    <>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  trash: <path d="M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 7.5 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.5-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 8.5a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.5V2a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 20.4 8.5a1.65 1.65 0 0 0 1.5 1H22a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
  external: (
    <path d="M15 3h6v6M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
  ),
  spinner: <path d="M21 12a9 9 0 1 1-6.2-8.5" />,
};

export type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number | string;
  title?: string;
};

export const Icon = ({ name, size = "1em", title, ...props }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden={title ? undefined : true}
    role={title ? "img" : undefined}
    {...props}
  >
    {title ? <title>{title}</title> : null}
    {paths[name]}
  </svg>
);
