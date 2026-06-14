import { createNode } from "../node/createNode";
import type { UIChild, UINode } from "../node/types";
import type { PageDefinition, PageLayout } from "./types";

/**
 * Defines a page. This is a typed identity helper: it returns the definition
 * unchanged but pins down the `State`/`Actions`/`Data` generics so the `view`,
 * `actions` and `data` callbacks are fully inferred.
 *
 * Run the result with `usePageRuntime` (or render its `view` directly with a
 * supplied context).
 */
export const createPage = <
  State extends object = Record<string, never>,
  Actions extends object = Record<string, never>,
  Data = undefined,
  Services = unknown,
>(
  definition: PageDefinition<State, Actions, Data, Services>,
): PageDefinition<State, Actions, Data, Services> => definition;

/** Props for the `Page` shell node (rendered by `@basekit/ui`'s `PageView`). */
export type PageNodeProps = {
  id?: string;
  layout?: PageLayout;
  title?: string;
  description?: string;
  /** Main content. */
  content?: UIChild | UIChild[];
  /** Page-level header actions (buttons, menus). */
  actions?: UIChild | UIChild[];
  /** Optional breadcrumb / sub-navigation slot. */
  header?: UIChild | UIChild[];
  footer?: UIChild | UIChild[];
};

/**
 * The page *shell* node. Used inside a `view` to lay out title, actions and
 * content with the standard page chrome.
 */
export const Page = (props: PageNodeProps = {}): UINode =>
  createNode("Page", props as Record<string, unknown>, props.content);

export const DashboardPage = (props: Omit<PageNodeProps, "layout"> = {}) =>
  Page({ ...props, layout: "dashboard" });
export const AuthPage = (props: Omit<PageNodeProps, "layout"> = {}) =>
  Page({ ...props, layout: "auth" });
export const SettingsPage = (props: Omit<PageNodeProps, "layout"> = {}) =>
  Page({ ...props, layout: "settings" });
export const ReaderPage = (props: Omit<PageNodeProps, "layout"> = {}) =>
  Page({ ...props, layout: "reader" });
export const FormPage = (props: Omit<PageNodeProps, "layout"> = {}) =>
  Page({ ...props, layout: "form" });
