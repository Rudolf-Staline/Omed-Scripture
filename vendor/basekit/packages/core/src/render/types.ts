import type { ReactNode } from "react";
import type { ComponentRegistry } from "../component/types";
import type { UIChild } from "../node/types";

export type RenderOptions = {
  registry: ComponentRegistry;
  /** Rendered when a node references an unknown component. */
  fallback?: (componentName: string, node: UIChild) => ReactNode;
};
