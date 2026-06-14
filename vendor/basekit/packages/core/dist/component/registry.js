/**
 * A mutable component registry. `@basekit/ui` ships a populated default
 * registry; apps can create their own or register additional components.
 */
export const createRegistry = (initial = {}) => {
    const registry = { ...initial };
    return {
        registry,
        register: (name, component) => {
            registry[name] = component;
        },
        registerMany: (entries) => {
            Object.assign(registry, entries);
        },
        get: (name) => registry[name],
        has: (name) => name in registry,
    };
};
//# sourceMappingURL=registry.js.map