/**
 * Light theme. A calm, slightly cool neutral base with a confident indigo
 * primary and a vivid violet accent — designed to read well on dense
 * dashboards and serious tools, not a generic Bootstrap blue.
 */
export const lightColors = {
    background: "#f6f7f9",
    foreground: "#161a22",
    surface: "#ffffff",
    surfaceRaised: "#ffffff",
    surfaceMuted: "#eef0f4",
    primary: "#4f46e5",
    primaryForeground: "#ffffff",
    accent: "#7c3aed",
    accentForeground: "#ffffff",
    success: "#15803d",
    successForeground: "#ffffff",
    warning: "#b45309",
    warningForeground: "#ffffff",
    danger: "#dc2626",
    dangerForeground: "#ffffff",
    muted: "#eef0f4",
    mutedForeground: "#5b6472",
    border: "#e2e5ea",
    input: "#d4d9e0",
    ring: "#6366f1",
};
/** Dark theme — same roles, re-tuned for low-light comfort and contrast. */
export const darkColors = {
    background: "#0b0d12",
    foreground: "#e8eaf0",
    surface: "#13161d",
    surfaceRaised: "#191d26",
    surfaceMuted: "#1c212b",
    primary: "#818cf8",
    primaryForeground: "#0b0d12",
    accent: "#a78bfa",
    accentForeground: "#0b0d12",
    success: "#4ade80",
    successForeground: "#0b0d12",
    warning: "#fbbf24",
    warningForeground: "#0b0d12",
    danger: "#f87171",
    dangerForeground: "#0b0d12",
    muted: "#1c212b",
    mutedForeground: "#9aa2b1",
    border: "#262c38",
    input: "#2f3645",
    ring: "#818cf8",
};
/**
 * Maps every {@link Tone} to the colour roles it paints with. `neutral` is the
 * odd one out: it leans on the surface/foreground roles rather than a vivid hue.
 */
export const toneColorRoles = {
    neutral: { base: "foreground", foreground: "background" },
    primary: { base: "primary", foreground: "primaryForeground" },
    accent: { base: "accent", foreground: "accentForeground" },
    success: { base: "success", foreground: "successForeground" },
    warning: { base: "warning", foreground: "warningForeground" },
    danger: { base: "danger", foreground: "dangerForeground" },
};
export const themes = {
    light: lightColors,
    dark: darkColors,
};
//# sourceMappingURL=colors.js.map