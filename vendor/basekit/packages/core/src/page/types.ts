import type { UIChild } from "../node/types";

export type PageLayout =
  | "default"
  | "dashboard"
  | "auth"
  | "reader"
  | "settings"
  | "form";

/** Patch-style state updater, like React's but accepting partials. */
export type SetState<State> = (
  patch: Partial<State> | ((prev: State) => Partial<State>),
) => void;

/** Helpers handed to the `actions` factory. */
export type PageActionHelpers<State, Services = unknown> = {
  setState: SetState<State>;
  getState: () => State;
  services: Services;
};

/** What the `view` receives. A page is a pure function of this context. */
export type PageContext<State extends object, Actions extends object, Data> = {
  state: State;
  actions: Actions;
  data: Data;
  loading: boolean;
  error: Error | null;
  reload: () => void;
};

export type PageGuardResult =
  | boolean
  | { redirect: string }
  | { error: string };

/**
 * Declarative description of a page: identity, layout, initial state, an
 * optional async data loader, an actions factory and a pure `view`. Everything
 * needed for {@link import("./PageRuntime").usePageRuntime} to run it.
 */
export interface PageDefinition<
  State extends object = Record<string, never>,
  Actions extends object = Record<string, never>,
  Data = undefined,
  Services = unknown,
> {
  id: string;
  layout?: PageLayout;
  title?: string;
  description?: string;
  meta?: Record<string, unknown>;
  /** Initial state. */
  state?: State;
  /** Optional async (or sync) data loader, re-runnable via `reload`. */
  data?: (ctx: { state: State; services: Services }) => Promise<Data> | Data;
  /** Builds the action handlers from state helpers. */
  actions?: (helpers: PageActionHelpers<State, Services>) => Actions;
  /** Optional access guards evaluated before rendering. */
  guards?: Array<
    (ctx: { state: State; services: Services }) => PageGuardResult
  >;
  /** Pure render function returning a declarative tree. */
  view: (ctx: PageContext<State, Actions, Data>) => UIChild;
}
