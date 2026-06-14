import { createElement, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import type { TextStyle } from "@basekit/tokens";
import { textToneStyles } from "../internal";
import type { Tone } from "../internal";

const textStyleClass: Record<TextStyle, string> = {
  display: "text-[2.25rem] font-bold leading-tight tracking-tight",
  title: "text-2xl font-bold leading-tight tracking-tight",
  heading: "text-xl font-semibold leading-snug",
  subtitle: "text-lg font-semibold leading-snug",
  body: "text-bk-sm leading-relaxed",
  label: "text-bk-sm font-medium",
  caption: "text-bk-xs",
  code: "font-mono text-bk-sm",
};

export type TextProps = {
  value?: ReactNode;
  children?: ReactNode;
  as?: "p" | "span" | "div" | "label";
  textVariant?: TextStyle;
  tone?: Tone;
  align?: "left" | "center" | "right";
  truncate?: boolean;
  weight?: "normal" | "medium" | "semibold" | "bold";
  className?: string;
  id?: string;
  hidden?: boolean;
  testId?: string;
};

export const TextView = ({
  value,
  children,
  as = "p",
  textVariant = "body",
  tone = "neutral",
  align,
  truncate,
  weight,
  className,
  id,
  hidden,
  testId,
}: TextProps) => {
  if (hidden) return null;
  return createElement(
    as,
    {
      id,
      "data-testid": testId,
      className: cn(
        textStyleClass[textVariant],
        textToneStyles[tone],
        align === "center" && "text-center",
        align === "right" && "text-right",
        truncate && "truncate",
        weight === "normal" && "font-normal",
        weight === "medium" && "font-medium",
        weight === "semibold" && "font-semibold",
        weight === "bold" && "font-bold",
        className,
      ),
    },
    children ?? value,
  );
};

export const Text = createComponent<TextProps>("Text");

/* ------------------------------------------------------------------ */
/* Heading                                                             */
/* ------------------------------------------------------------------ */

export type HeadingProps = Omit<TextProps, "as" | "textVariant"> & {
  level?: 1 | 2 | 3 | 4;
};

const headingStyle: Record<1 | 2 | 3 | 4, TextStyle> = {
  1: "title",
  2: "heading",
  3: "subtitle",
  4: "label",
};

export const HeadingView = ({ level = 2, ...props }: HeadingProps) =>
  createElement(
    `h${level}`,
    {},
    <TextView as="span" textVariant={headingStyle[level]} {...props} />,
  );

export const Heading = createComponent<HeadingProps>("Heading");
