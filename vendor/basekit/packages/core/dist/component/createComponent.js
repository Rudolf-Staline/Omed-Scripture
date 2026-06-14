import { createNode } from "../node/createNode";
/**
 * Builds a declarative factory for a registered component name.
 *
 * The returned function turns a props object into a {@link UINode}. Pair it in
 * `@basekit/ui` with a React view of the same name registered in the registry,
 * so the very same component is usable declaratively *and* as plain JSX.
 *
 * @example
 * export const Button = createComponent<ButtonProps>("Button");
 * const save = Button({ text: "Save", tone: "primary", onClick: handleSave });
 */
export const createComponent = (componentName) => Object.assign((props = {}) => createNode(componentName, props, props.children), { componentName });
//# sourceMappingURL=createComponent.js.map