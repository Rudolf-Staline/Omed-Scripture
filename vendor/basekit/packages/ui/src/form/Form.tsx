import { type FormHTMLAttributes, type ReactNode } from "react";
import {
  cn,
  createComponent,
  isUINode,
  renderNode,
  type UIChild,
} from "@basekit/core";
import { defaultRegistry } from "../registry";
import { CardView } from "../composition/Card";

/** Renders a slot that may hold declarative nodes, arrays, or React nodes. */
const renderSlot = (slot: unknown): ReactNode => {
  if (Array.isArray(slot)) {
    return slot.map((child, i) => (
      <span key={i} className="contents">
        {renderSlot(child)}
      </span>
    ));
  }
  if (isUINode(slot)) return renderNode(slot as UIChild, defaultRegistry);
  return slot as ReactNode;
};

/* Form ----------------------------------------------------------------- */

export type FormProps = {
  children?: ReactNode;
  onSubmit?: () => void;
  className?: string;
  id?: string;
} & Omit<FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "className" | "id">;

export const FormView = ({
  children,
  onSubmit,
  className,
  id,
  ...rest
}: FormProps) => (
  <form
    id={id}
    className={cn("space-y-6", className)}
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.();
    }}
    {...rest}
  >
    {renderSlot(children)}
  </form>
);

export const Form = createComponent<FormProps>("Form");

/* FormSection ---------------------------------------------------------- */

export type FormSectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
};

export const FormSectionView = ({
  title,
  description,
  children,
  className,
}: FormSectionProps) => (
  <section className={cn("space-y-4", className)}>
    {(title != null || description != null) && (
      <div className="space-y-1">
        {title != null && (
          <h3 className="font-semibold text-foreground">{title}</h3>
        )}
        {description != null && (
          <p className="text-bk-sm text-muted-foreground">{description}</p>
        )}
      </div>
    )}
    <div className="space-y-4">{renderSlot(children)}</div>
  </section>
);

export const FormSection = createComponent<FormSectionProps>("FormSection");

/* FormField — labelled wrapper for arbitrary controls ------------------ */

export type FormFieldProps = {
  label?: ReactNode;
  htmlFor?: string;
  error?: ReactNode;
  helperText?: ReactNode;
  required?: boolean;
  children?: ReactNode;
  className?: string;
};

export const FormFieldView = ({
  label,
  htmlFor,
  error,
  helperText,
  required,
  children,
  className,
}: FormFieldProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    {label != null && (
      <label
        htmlFor={htmlFor}
        className="text-bk-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-danger"> *</span>}
      </label>
    )}
    {renderSlot(children)}
    {error ? (
      <p className="text-bk-sm text-danger" role="alert">
        {error}
      </p>
    ) : helperText ? (
      <p className="text-bk-sm text-muted-foreground">{helperText}</p>
    ) : null}
  </div>
);

export const FormField = createComponent<FormFieldProps>("FormField");

/* FormActions ---------------------------------------------------------- */

export type FormActionsProps = {
  children?: ReactNode;
  align?: "start" | "end" | "between";
  className?: string;
};

export const FormActionsView = ({
  children,
  align = "end",
  className,
}: FormActionsProps) => (
  <div
    className={cn(
      "flex items-center gap-3 border-t border-border pt-4",
      align === "end" && "justify-end",
      align === "start" && "justify-start",
      align === "between" && "justify-between",
      className,
    )}
  >
    {renderSlot(children)}
  </div>
);

export const FormActions = createComponent<FormActionsProps>("FormActions");

/* FilterBar ------------------------------------------------------------ */

export type FilterBarProps = {
  title?: ReactNode;
  icon?: ReactNode;
  fields?: UIChild[];
  actions?: UIChild[];
  className?: string;
};

export const FilterBarView = ({
  title,
  fields,
  actions,
  className,
}: FilterBarProps) => (
  <CardView className={cn("p-4", className)}>
    {title != null && (
      <p className="mb-3 text-bk-sm font-medium text-muted-foreground">
        {title}
      </p>
    )}
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
      <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields?.map((field, i) => (
          <div key={i}>{renderSlot(field)}</div>
        ))}
      </div>
      {actions != null && actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, i) => (
            <div key={i}>{renderSlot(action)}</div>
          ))}
        </div>
      )}
    </div>
  </CardView>
);

export const FilterBar = createComponent<FilterBarProps>("FilterBar");

/* Field primitives ------------------------------------------------------ */
export type FieldLabelProps = { children?: ReactNode; htmlFor?: string; required?: boolean; className?: string };
export const FieldLabelView = ({ children, htmlFor, required, className }: FieldLabelProps) => <label htmlFor={htmlFor} className={cn("text-bk-sm font-medium text-foreground", className)}>{children}{required && <span className="text-danger"> *</span>}</label>;
export const FieldLabel = createComponent<FieldLabelProps>("FieldLabel");
export type FieldHintProps = { children?: ReactNode; className?: string };
export const FieldHintView = ({ children, className }: FieldHintProps) => <p className={cn("text-bk-sm text-muted-foreground", className)}>{children}</p>;
export const FieldHint = createComponent<FieldHintProps>("FieldHint");
export type FieldErrorProps = { children?: ReactNode; className?: string };
export const FieldErrorView = ({ children, className }: FieldErrorProps) => <p role="alert" className={cn("text-bk-sm text-danger", className)}>{children}</p>;
export const FieldError = createComponent<FieldErrorProps>("FieldError");
