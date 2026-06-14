import { createNode } from "../node/createNode";
import type { DeclarativeComponent, WithChildren } from "./types";

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
export const createComponent = <Props extends Record<string, unknown>>(
  componentName: string,
): DeclarativeComponent<Props> =>
  Object.assign(
    (props: WithChildren<Props> = {} as WithChildren<Props>) =>
      createNode(componentName, props as Props, props.children),
    { componentName } as const,
  );
