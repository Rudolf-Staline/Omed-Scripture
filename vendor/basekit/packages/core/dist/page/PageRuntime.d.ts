import type { UIChild } from "../node/types";
import type { PageContext, PageDefinition } from "./types";
type RuntimeOptions<Services> = {
    /** Injected services (e.g. an API client) available to `data`/`actions`. */
    services?: Services;
};
type RuntimeResult<State extends object, Actions extends object, Data> = {
    node: UIChild;
    context: PageContext<State, Actions, Data>;
};
/**
 * Runs a {@link PageDefinition} as live React state.
 *
 * - owns the page state (seeded from `definition.state`)
 * - builds memoised `actions` with `setState`/`getState`/`services`
 * - runs the async `data` loader with `loading`/`error`/`reload`
 * - returns the declarative node produced by `view`, ready for `RenderNode`
 *
 * This is what makes `createPage` real rather than decorative.
 */
export declare function usePageRuntime<State extends object, Actions extends object, Data, Services = unknown>(definition: PageDefinition<State, Actions, Data, Services>, options?: RuntimeOptions<Services>): RuntimeResult<State, Actions, Data>;
export {};
//# sourceMappingURL=PageRuntime.d.ts.map