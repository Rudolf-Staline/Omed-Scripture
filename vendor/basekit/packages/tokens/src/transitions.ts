export const transitions = {
  fast: "120ms cubic-bezier(0.4, 0, 0.2, 1)",
  normal: "180ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "260ms cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

export const zIndex = {
  base: 0,
  docked: 10,
  sticky: 100,
  overlay: 1000,
  dropdown: 1100,
  drawer: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
  tooltip: 1600,
} as const;

export type ZIndexToken = keyof typeof zIndex;
export type TransitionToken = keyof typeof transitions;
