import { type ClassValue } from "./cn";
/**
 * A small, type-safe variant resolver in the spirit of `cva`, without the
 * dependency. Maps named option groups to class strings and supports a base
 * class plus per-component defaults.
 *
 * @example
 * const button = variants({
 *   base: "inline-flex rounded-md",
 *   variants: { tone: { primary: "bg-primary", danger: "bg-danger" } },
 *   defaults: { tone: "primary" },
 * });
 * button({ tone: "danger" }); // "inline-flex rounded-md bg-danger"
 */
export type VariantSchema = Record<string, Record<string, ClassValue>>;
export type VariantSelection<Schema extends VariantSchema> = {
    [Key in keyof Schema]?: keyof Schema[Key];
};
export type VariantConfig<Schema extends VariantSchema> = {
    base?: ClassValue;
    variants: Schema;
    defaults?: VariantSelection<Schema>;
};
export declare const variants: <Schema extends VariantSchema>(config: VariantConfig<Schema>) => (selection?: VariantSelection<Schema>) => string;
//# sourceMappingURL=variants.d.ts.map