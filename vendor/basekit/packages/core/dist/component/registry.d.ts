import type { ComponentType } from "react";
import type { ComponentRegistry } from "./types";
/**
 * A mutable component registry. `@basekit/ui` ships a populated default
 * registry; apps can create their own or register additional components.
 */
export declare const createRegistry: (initial?: ComponentRegistry) => {
    registry: ComponentRegistry;
    register: (name: string, component: ComponentType<any> | string) => void;
    registerMany: (entries: ComponentRegistry) => void;
    get: (name: string) => ComponentType<any> | string | undefined;
    has: (name: string) => boolean;
};
//# sourceMappingURL=registry.d.ts.map