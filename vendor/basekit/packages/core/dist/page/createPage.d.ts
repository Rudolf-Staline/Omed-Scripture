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
export declare const createPage: <State extends object = Record<string, never>, Actions extends object = Record<string, never>, Data = undefined, Services = unknown>(definition: PageDefinition<State, Actions, Data, Services>) => PageDefinition<State, Actions, Data, Services>;
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
export declare const Page: (props?: PageNodeProps) => UINode;
export declare const DashboardPage: (props?: Omit<PageNodeProps, "layout">) => UINode<Record<string, unknown>>;
export declare const AuthPage: (props?: Omit<PageNodeProps, "layout">) => UINode<Record<string, unknown>>;
export declare const SettingsPage: (props?: Omit<PageNodeProps, "layout">) => UINode<Record<string, unknown>>;
export declare const ReaderPage: (props?: Omit<PageNodeProps, "layout">) => UINode<Record<string, unknown>>;
export declare const FormPage: (props?: Omit<PageNodeProps, "layout">) => UINode<Record<string, unknown>>;
//# sourceMappingURL=createPage.d.ts.map