import { createNode } from "../node/createNode";
/**
 * Defines a page. This is a typed identity helper: it returns the definition
 * unchanged but pins down the `State`/`Actions`/`Data` generics so the `view`,
 * `actions` and `data` callbacks are fully inferred.
 *
 * Run the result with `usePageRuntime` (or render its `view` directly with a
 * supplied context).
 */
export const createPage = (definition) => definition;
/**
 * The page *shell* node. Used inside a `view` to lay out title, actions and
 * content with the standard page chrome.
 */
export const Page = (props = {}) => createNode("Page", props, props.content);
export const DashboardPage = (props = {}) => Page({ ...props, layout: "dashboard" });
export const AuthPage = (props = {}) => Page({ ...props, layout: "auth" });
export const SettingsPage = (props = {}) => Page({ ...props, layout: "settings" });
export const ReaderPage = (props = {}) => Page({ ...props, layout: "reader" });
export const FormPage = (props = {}) => Page({ ...props, layout: "form" });
//# sourceMappingURL=createPage.js.map