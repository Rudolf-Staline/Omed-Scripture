import { jsx as _jsx } from "react/jsx-runtime";
import { createElement } from "react";
import { cn, createComponent } from "@basekit/core";
import { textToneStyles } from "../internal";
const textStyleClass = {
    display: "text-[2.25rem] font-bold leading-tight tracking-tight",
    title: "text-2xl font-bold leading-tight tracking-tight",
    heading: "text-xl font-semibold leading-snug",
    subtitle: "text-lg font-semibold leading-snug",
    body: "text-bk-sm leading-relaxed",
    label: "text-bk-sm font-medium",
    caption: "text-bk-xs",
    code: "font-mono text-bk-sm",
};
export const TextView = ({ value, children, as = "p", textVariant = "body", tone = "neutral", align, truncate, weight, className, id, hidden, testId, }) => {
    if (hidden)
        return null;
    return createElement(as, {
        id,
        "data-testid": testId,
        className: cn(textStyleClass[textVariant], textToneStyles[tone], align === "center" && "text-center", align === "right" && "text-right", truncate && "truncate", weight === "normal" && "font-normal", weight === "medium" && "font-medium", weight === "semibold" && "font-semibold", weight === "bold" && "font-bold", className),
    }, children ?? value);
};
export const Text = createComponent("Text");
const headingStyle = {
    1: "title",
    2: "heading",
    3: "subtitle",
    4: "label",
};
export const HeadingView = ({ level = 2, ...props }) => createElement(`h${level}`, {}, _jsx(TextView, { as: "span", textVariant: headingStyle[level], ...props }));
export const Heading = createComponent("Heading");
//# sourceMappingURL=Text.js.map