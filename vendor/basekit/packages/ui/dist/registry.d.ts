import type { ComponentType } from "react";
import { type ComponentRegistry, type UIChild } from "@basekit/core";
type AnyComponent = ComponentType<Record<string, unknown>>;
export declare const defaultRegistry: ComponentRegistry;
/** Register (or override) a component in the default registry at runtime. */
export declare const registerComponent: (name: string, component: AnyComponent | string) => void;
export declare const registerComponents: (entries: ComponentRegistry) => void;
/** React component that renders a declarative node tree with the default registry. */
export declare const RenderNode: ({ node, registry, }: {
    node: UIChild;
    registry?: ComponentRegistry;
}) => import("react").JSX.Element;
export {};
//# sourceMappingURL=registry.d.ts.map