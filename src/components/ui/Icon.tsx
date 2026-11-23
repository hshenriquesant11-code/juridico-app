import type { ReactNode } from "react";

export type IconName =
  | "overview"
  | "leads"
  | "clients"
  | "cases"
  | "tasks"
  | "settings"
  | "search"
  | "bell"
  | "chevron"
  | "plus"
  | "arrow"
  | "calendar"
  | "clock"
  | "dots"
  | "menu"
  | "close";

export function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  const paths: Record<IconName, ReactNode> = {
    overview: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="4" rx="1.5" />
        <rect x="13.5" y="10.5" width="7" height="10" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
    leads: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19v-1.2A4.8 4.8 0 0 1 8.3 13h1.4a4.8 4.8 0 0 1 4.8 4.8V19M16 5.3a3 3 0 0 1 0 5.7M17 14h.5a3 3 0 0 1 3 3v2" />
      </>
    ),
    clients: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20v-1.5A4.5 4.5 0 0 1 8 14h2a4.5 4.5 0 0 1 4.5 4.5V20M17 11.5a3.5 3.5 0 1 0 0-7M18 14.5a4 4 0 0 1 3 3.9V20" />
      </>
    ),
    cases: (
      <>
        <path d="M3.5 8.5h17v11h-17zM8 8.5V6a1.5 1.5 0 0 1 1.5-1.5h5A1.5 1.5 0 0 1 16 6v2.5M3.5 12h17M10 12v2h4v-2" />
      </>
    ),
    tasks: (
      <>
        <rect x="4" y="4" width="16" height="17" rx="2" />
        <path d="M8 2.5v3M16 2.5v3M4 9h16M8 13h3M8 17h6" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="m19.4 15 .1.1 1.1.9-1 1.8-1.4-.5a7.7 7.7 0 0 1-1.4.8l-.2 1.5h-2.1l-.4-1.4a7.7 7.7 0 0 1-1.7 0l-.7 1.3-2-.7.1-1.5a7.7 7.7 0 0 1-1.2-1.2l-1.5.1-.7-2 1.3-.8a7.7 7.7 0 0 1 0-1.7l-1.2-.9.9-1.8 1.5.4a7.7 7.7 0 0 1 1.4-.8l.2-1.5h2.1l.4 1.4a7.7 7.7 0 0 1 1.7 0l.7-1.3 2 .7-.1 1.5a7.7 7.7 0 0 1 1.2 1.2l1.5-.1.7 2-1.3.8a7.7 7.7 0 0 1 0 1.7Z" />
      </>
    ),
    search: (
      <>
        <circle cx="10.8" cy="10.8" r="6.3" />
        <path d="m15.5 15.5 4.2 4.2" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="16" rx="2" />
        <path d="M7.5 3v4M16.5 3v4M3.5 10h17" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </>
    ),
    dots: (
      <>
        <circle cx="5" cy="12" r=".8" />
        <circle cx="12" cy="12" r=".8" />
        <circle cx="19" cy="12" r=".8" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
  };
  return <svg {...common}>{paths[name]}</svg>;
}
