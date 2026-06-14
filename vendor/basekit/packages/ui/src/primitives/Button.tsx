import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";
import { cn, createComponent } from "@basekit/core";
import type { Radius, Size, Tone, Variant } from "@basekit/tokens";
import {
  controlSizeStyles,
  focusRing,
  Icon,
  iconButtonSizeStyles,
  interactiveToneStyles,
  radiusStyles,
  renderIcon,
  type IconSlot,
} from "../internal";

export type ButtonProps = {
  id?: string;
  className?: string;
  children?: ReactNode;
  text?: string;
  type?: "button" | "submit" | "reset";
  tone?: Tone;
  variant?: Variant;
  size?: Size;
  radius?: Radius;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  hidden?: boolean;
  iconLeft?: IconSlot;
  iconRight?: IconSlot;
  /** Square, icon-sized control (used by IconButton). */
  square?: boolean;
  testId?: string;
  title?: string;
  "aria-label"?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
  onMouseDown?: ButtonHTMLAttributes<HTMLButtonElement>["onMouseDown"];
  onMouseEnter?: ButtonHTMLAttributes<HTMLButtonElement>["onMouseEnter"];
  onMouseLeave?: ButtonHTMLAttributes<HTMLButtonElement>["onMouseLeave"];
  onFocus?: ButtonHTMLAttributes<HTMLButtonElement>["onFocus"];
  onBlur?: ButtonHTMLAttributes<HTMLButtonElement>["onBlur"];
};

const base =
  "relative inline-flex items-center justify-center whitespace-nowrap font-medium " +
  "transition-colors select-none disabled:pointer-events-none disabled:opacity-55";

export const ButtonView = forwardRef<HTMLButtonElement, ButtonProps>(
  function ButtonView(
    {
      id,
      className,
      children,
      text,
      type = "button",
      tone = "primary",
      variant = "solid",
      size = "md",
      radius = "md",
      disabled,
      loading,
      fullWidth,
      hidden,
      iconLeft,
      iconRight,
      square,
      testId,
      title,
      onClick,
      ...rest
    },
    ref,
  ) {
    if (hidden) return null;
    const label = children ?? text;
    return (
      <button
        ref={ref}
        id={id}
        type={type}
        title={title}
        data-testid={testId}
        data-loading={loading || undefined}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        aria-label={rest["aria-label"]}
        onClick={onClick}
        onMouseDown={rest.onMouseDown}
        onMouseEnter={rest.onMouseEnter}
        onMouseLeave={rest.onMouseLeave}
        onFocus={rest.onFocus}
        onBlur={rest.onBlur}
        className={cn(
          base,
          focusRing,
          square ? iconButtonSizeStyles[size] : controlSizeStyles[size],
          radiusStyles[radius],
          interactiveToneStyles[variant][tone],
          fullWidth && "w-full",
          className,
        )}
      >
        {loading && (
          <Icon name="spinner" className="absolute animate-spin" aria-hidden />
        )}
        <span
          className={cn(
            "inline-flex items-center gap-2",
            loading && "invisible",
          )}
        >
          {renderIcon(iconLeft)}
          {label != null && <span>{label}</span>}
          {renderIcon(iconRight)}
        </span>
      </button>
    );
  },
);

export const Button = createComponent<ButtonProps>("Button");

/* ------------------------------------------------------------------ */
/* IconButton                                                          */
/* ------------------------------------------------------------------ */

export type IconButtonProps = Omit<
  ButtonProps,
  "text" | "iconLeft" | "iconRight" | "fullWidth" | "children"
> & {
  icon: IconSlot;
  /** Required for accessibility — icon-only buttons need a label. */
  "aria-label": string;
};

export const IconButtonView = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButtonView(
    {
      icon,
      tone = "neutral",
      variant = "ghost",
      size = "md",
      radius = "md",
      className,
      loading,
      ...rest
    },
    ref,
  ) {
    return (
      <ButtonView
        ref={ref}
        tone={tone}
        variant={variant}
        size={size}
        radius={radius}
        loading={loading}
        square
        className={className}
        {...rest}
      >
        {renderIcon(icon)}
      </ButtonView>
    );
  },
);

export const IconButton = createComponent<IconButtonProps>("IconButton");

/* ------------------------------------------------------------------ */
/* ButtonGroup                                                         */
/* ------------------------------------------------------------------ */

export type ButtonGroupProps = {
  id?: string;
  className?: string;
  children?: ReactNode;
  /** Stacking direction. */
  orientation?: "horizontal" | "vertical";
  /** Render the buttons as a single segmented control with shared borders. */
  attached?: boolean;
  /** Defaults forwarded to child buttons that don't set their own. */
  size?: Size;
  variant?: Variant;
  tone?: Tone;
  disabled?: boolean;
  hidden?: boolean;
  /** Accessible label for the group. */
  "aria-label"?: string;
};

/** Props ButtonGroup forwards to button-like children when they are unset. */
type GroupChildProps = {
  size?: Size;
  variant?: Variant;
  tone?: Tone;
  disabled?: boolean;
};

export const ButtonGroupView = forwardRef<HTMLDivElement, ButtonGroupProps>(
  function ButtonGroupView(
    {
      id,
      className,
      children,
      orientation = "horizontal",
      attached,
      size,
      variant,
      tone,
      disabled,
      hidden,
      ...rest
    },
    ref,
  ) {
    if (hidden) return null;
    const vertical = orientation === "vertical";

    // Forward group-level defaults to children that haven't set their own.
    const enhanced = Children.map(children, (child) => {
      if (!isValidElement(child)) return child;
      const childProps = child.props as GroupChildProps;
      const next: GroupChildProps = {};
      if (size != null && childProps.size == null) next.size = size;
      if (variant != null && childProps.variant == null) next.variant = variant;
      if (tone != null && childProps.tone == null) next.tone = tone;
      if (disabled && childProps.disabled == null) next.disabled = true;
      return Object.keys(next).length > 0 ? cloneElement(child, next) : child;
    });

    return (
      <div
        ref={ref}
        id={id}
        role="group"
        aria-label={rest["aria-label"]}
        className={cn(
          "isolate inline-flex",
          vertical ? "flex-col" : "flex-row",
          attached
            ? cn(
                "[&>button]:rounded-none",
                vertical
                  ? "[&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button+button]:-mt-px"
                  : "[&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button+button]:-ml-px",
                "[&>button]:focus-visible:z-10",
              )
            : "gap-2",
          className,
        )}
      >
        {enhanced}
      </div>
    );
  },
);

export const ButtonGroup = createComponent<ButtonGroupProps>("ButtonGroup");
