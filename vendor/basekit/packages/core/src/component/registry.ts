import type { ComponentType } from "react";
import type { ComponentRegistry } from "./types";

/**
 * A mutable component registry. `@basekit/ui` ships a populated default
 * registry; apps can create their own or register additional components.
 */
export const createRegistry = (
  initial: ComponentRegistry = {},
): {
  registry: ComponentRegistry;
  register: (name: string, component: ComponentType<any> | string) => void;
  registerMany: (entries: ComponentRegistry) => void;
  get: (name: string) => ComponentType<any> | string | undefined;
  has: (name: string) => boolean;
} => {
  const registry: ComponentRegistry = { ...initial };
  return {
    registry,
    register: (name, component) => {
      registry[name] = component as ComponentType<Record<string, unknown>>;
    },
    registerMany: (entries) => {
      Object.assign(registry, entries);
    },
    get: (name) => registry[name],
    has: (name) => name in registry,
  };
};
