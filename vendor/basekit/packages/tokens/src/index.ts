/**
 * @basekit/tokens — the single source of visual truth.
 *
 * Exposes design tokens as TypeScript values, as `--bk-*` CSS variables, and as
 * a Tailwind preset of semantic utilities. Components reference tokens only;
 * raw colours never appear outside this package.
 */

export * from "./types";
export * from "./colors";
export * from "./spacing";
export * from "./typography";
export * from "./radius";
export * from "./shadows";
export * from "./transitions";
export * from "./cssVariables";
export { basekitPreset } from "./tailwindPreset";
export { default as tailwindPreset } from "./tailwindPreset";
