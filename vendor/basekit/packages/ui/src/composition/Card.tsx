import { type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import type { Radius, Shadow, Size, Tone } from "@basekit/tokens";
import {
  paddingStyles,
  radiusStyles,
  shadowStyles,
  softToneStyles,
} from "../internal";

export type CardProps = {
  children?: ReactNode;
  variant?: "plain" | "outlined" | "elevated";
  tone?: Tone;
  padding?: Size | "none";
  radius?: Radius;
  shadow?: Shadow;
  border?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
  id?: string;
  hidden?: boolean;
  testId?: string;
};

const CardRootView = ({
  children,
  variant = "outlined",
  tone,
  padding = "none",
  radius = "lg",
  shadow,
  border,
  interactive,
  onClick,
  className,
  id,
  hidden,
  testId,
}: CardProps) => {
  if (hidden) return null;
  const resolvedShadow = shadow ?? (variant === "elevated" ? "soft" : "none");
  const showBorder = border ?? variant !== "elevated";
  const Tag = interactive || onClick ? "button" : "div";
  return (
    <Tag
      id={id}
      data-testid={testId}
      onClick={onClick}
      type={Tag === "button" ? "button" : undefined}
      className={cn(
        "bg-surface text-left text-foreground",
        radiusStyles[radius],
        shadowStyles[resolvedShadow],
        showBorder && "border border-border",
        tone && softToneStyles[tone],
        padding !== "none" && paddingStyles[padding],
        (interactive || onClick) &&
          "transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        Tag === "button" && "block w-full",
        className,
      )}
    >
      {children}
    </Tag>
  );
};

const CardHeaderView = ({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-start justify-between gap-4 border-b border-border p-5",
      className,
    )}
  >
    {children ?? (
      <div className="space-y-1">
        {title != null && (
          <h3 className="font-semibold text-foreground">{title}</h3>
        )}
        {description != null && (
          <p className="text-bk-sm text-muted-foreground">{description}</p>
        )}
      </div>
    )}
    {actions != null && (
      <div className="flex items-center gap-2">{actions}</div>
    )}
  </div>
);

const CardContentView = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => <div className={cn("p-5", className)}>{children}</div>;

const CardFooterView = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center justify-end gap-2 border-t border-border p-5",
      className,
    )}
  >
    {children}
  </div>
);

const CardTitleView = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <h3 className={cn("font-semibold text-foreground", className)}>{children}</h3>
);

const CardDescriptionView = ({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) => (
  <p className={cn("text-bk-sm text-muted-foreground", className)}>
    {children}
  </p>
);

/**
 * Card. React usage: `<Card.View>` + `<Card.Header/Content/Footer>`.
 * Declarative usage: `Card({ children: [CardHeader(...), CardContent(...)] })`.
 */
export const Card = Object.assign(createComponent<CardProps>("Card"), {
  View: CardRootView,
  Header: CardHeaderView,
  Content: CardContentView,
  Footer: CardFooterView,
  Title: CardTitleView,
  Description: CardDescriptionView,
});

export const CardView = CardRootView;

export const CardHeader = createComponent<{
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}>("CardHeader");
export const CardContent = createComponent<{ children?: unknown }>(
  "CardContent",
);
export const CardFooter = createComponent<{ children?: unknown }>("CardFooter");

export {
  CardHeaderView,
  CardContentView,
  CardFooterView,
  CardTitleView,
  CardDescriptionView,
};
