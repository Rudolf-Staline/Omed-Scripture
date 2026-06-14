import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
export function usePageRuntime(definition, options = {}) {
    const services = options.services;
    const [state, setStateRaw] = useState(() => (definition.state ?? {}));
    const stateRef = useRef(state);
    stateRef.current = state;
    const setState = useCallback((patch) => {
        setStateRaw((prev) => ({
            ...prev,
            ...(typeof patch === "function" ? patch(prev) : patch),
        }));
    }, []);
    const getState = useCallback(() => stateRef.current, []);
    const actions = useMemo(() => definition.actions?.({ setState, getState, services }) ?? {}, [definition, setState, getState, services]);
    const [data, setData] = useState(undefined);
    const [loading, setLoading] = useState(Boolean(definition.data));
    const [error, setError] = useState(null);
    const load = useCallback(() => {
        if (!definition.data)
            return;
        let cancelled = false;
        setLoading(true);
        setError(null);
        Promise.resolve(definition.data({ state: stateRef.current, services }))
            .then((result) => {
            if (!cancelled)
                setData(result);
        })
            .catch((err) => {
            if (!cancelled) {
                setError(err instanceof Error ? err : new Error(String(err)));
            }
        })
            .finally(() => {
            if (!cancelled)
                setLoading(false);
        });
        return () => {
            cancelled = true;
        };
    }, [definition, services]);
    useEffect(() => {
        const cleanup = load();
        return cleanup;
    }, [load]);
    const reload = useCallback(() => {
        load();
    }, [load]);
    const context = useMemo(() => ({ state, actions, data, loading, error, reload }), [state, actions, data, loading, error, reload]);
    const node = useMemo(() => definition.view(context), [definition, context]);
    return { node, context };
}
//# sourceMappingURL=PageRuntime.js.map