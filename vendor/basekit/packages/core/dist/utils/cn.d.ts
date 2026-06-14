export type ClassValue = string | number | false | null | undefined | ClassValue[];
/**
 * Tiny, dependency-free class name joiner. Flattens arrays and drops falsy
 * values so conditional classes read cleanly: `cn("base", active && "on")`.
 */
export declare const cn: (...inputs: ClassValue[]) => string;
//# sourceMappingURL=cn.d.ts.map