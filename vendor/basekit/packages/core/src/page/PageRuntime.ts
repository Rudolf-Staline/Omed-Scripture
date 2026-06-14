import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
export function usePageRuntime<
  State extends object,
  Actions extends object,
  Data,
  Services = unknown,
>(
  definition: PageDefinition<State, Actions, Data, Services>,
  options: RuntimeOptions<Services> = {},
): RuntimeResult<State, Actions, Data> {
  const services = options.services as Services;
  const [state, setStateRaw] = useState<State>(
    () => (definition.state ?? {}) as State,
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const setState = useCallback(
    (patch: Partial<State> | ((prev: State) => Partial<State>)) => {
      setStateRaw((prev) => ({
        ...prev,
        ...(typeof patch === "function" ? patch(prev) : patch),
      }));
    },
    [],
  );

  const getState = useCallback(() => stateRef.current, []);

  const actions = useMemo<Actions>(
    () =>
      definition.actions?.({ setState, getState, services }) ?? ({} as Actions),
    [definition, setState, getState, services],
  );

  const [data, setData] = useState<Data>(undefined as Data);
  const [loading, setLoading] = useState<boolean>(Boolean(definition.data));
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(() => {
    if (!definition.data) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    Promise.resolve(definition.data({ state: stateRef.current, services }))
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
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

  const context = useMemo<PageContext<State, Actions, Data>>(
    () => ({ state, actions, data, loading, error, reload }),
    [state, actions, data, loading, error, reload],
  );

  const node = useMemo(() => definition.view(context), [definition, context]);

  return { node, context };
}
