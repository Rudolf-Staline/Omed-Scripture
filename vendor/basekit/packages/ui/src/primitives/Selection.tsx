import { forwardRef, useId, useState, type ReactNode } from "react";
import { cn, createComponent } from "@basekit/core";
import { FieldShell } from "./Input";

export type ChoiceOption = { label: ReactNode; value: string; disabled?: boolean; helperText?: ReactNode };
export type RadioProps = { id?: string; name?: string; value?: string; checked?: boolean; defaultChecked?: boolean; disabled?: boolean; required?: boolean; label?: ReactNode; helperText?: ReactNode; error?: ReactNode; onChange?: React.ChangeEventHandler<HTMLInputElement>; onCheckedChange?: (checked: boolean) => void; testId?: string; className?: string };
export const RadioView = forwardRef<HTMLInputElement, RadioProps>(function RadioView({ id, name, value, checked, defaultChecked, disabled, required, label, helperText, error, onChange, onCheckedChange, testId, className }, ref) {
  const generated = useId(); const id_ = id ?? `${name ?? "radio"}-${generated}`;
  return <label htmlFor={id_} className={cn("flex cursor-pointer items-start gap-2.5", disabled && "cursor-not-allowed opacity-60", className)}>
    <span className="relative mt-0.5 inline-flex h-5 w-5"><input ref={ref} id={id_} name={name} value={value} type="radio" checked={checked} defaultChecked={defaultChecked} disabled={disabled} required={required} data-testid={testId} className="peer sr-only" aria-invalid={error ? true : undefined} onChange={(e)=>{onChange?.(e); onCheckedChange?.(e.target.checked);}}/><span className="h-5 w-5 rounded-full border border-input bg-surface transition-colors peer-checked:border-primary peer-focus-visible:ring-2 peer-focus-visible:ring-ring"/><span className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 peer-checked:opacity-100"/></span>
    {(label || helperText || error) && <span className="flex flex-col"><span className="text-bk-sm font-medium text-foreground">{label}</span>{error ? <span className="text-bk-sm text-danger">{error}</span> : helperText ? <span className="text-bk-sm text-muted-foreground">{helperText}</span> : null}</span>}
  </label>;
});
export const Radio = createComponent<RadioProps>("Radio");

export type RadioGroupProps = { id?: string; name?: string; label?: ReactNode; value?: string; defaultValue?: string; options: ChoiceOption[]; orientation?: "vertical" | "horizontal"; disabled?: boolean; required?: boolean; error?: ReactNode; helperText?: ReactNode; onValueChange?: (value: string) => void; testId?: string; className?: string };
export const RadioGroupView = ({ id, name, label, value, defaultValue, options, orientation="vertical", disabled, required, error, helperText, onValueChange, testId, className }: RadioGroupProps) => {
  const generated = useId(); const name_ = name ?? id ?? generated; const [internal, setInternal] = useState(defaultValue ?? ""); const current = value ?? internal;
  return <FieldShell id={id ?? name_} label={label} error={error} helperText={helperText} required={required} className={className}><div role="radiogroup" data-testid={testId} className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap")}>
    {options.map((o)=><RadioView key={o.value} name={name_} value={o.value} checked={current===o.value} disabled={disabled || o.disabled} required={required} label={o.label} helperText={o.helperText} onCheckedChange={(checked)=>{ if(checked){ setInternal(o.value); onValueChange?.(o.value); }}} />)}
  </div></FieldShell>;
};
export const RadioGroup = createComponent<RadioGroupProps>("RadioGroup");

export type CheckboxGroupProps = { label?: ReactNode; values?: string[]; defaultValues?: string[]; options: ChoiceOption[]; orientation?: "vertical" | "horizontal"; disabled?: boolean; error?: ReactNode; helperText?: ReactNode; onValuesChange?: (values: string[]) => void; testId?: string; className?: string };
export const CheckboxGroupView = ({ label, values, defaultValues=[], options, orientation="vertical", disabled, error, helperText, onValuesChange, testId, className }: CheckboxGroupProps) => {
  const id = useId(); const [internal, setInternal] = useState(defaultValues); const current = values ?? internal;
  const update = (v: string, checked: boolean) => { const next = checked ? Array.from(new Set([...current, v])) : current.filter((x)=>x!==v); setInternal(next); onValuesChange?.(next); };
  return <FieldShell id={id} label={label} error={error} helperText={helperText} className={className}><div data-testid={testId} className={cn("flex gap-3", orientation === "vertical" ? "flex-col" : "flex-row flex-wrap")}>
    {options.map((o)=><label key={o.value} className={cn("flex cursor-pointer items-start gap-2.5", (disabled || o.disabled) && "cursor-not-allowed opacity-60")}><input type="checkbox" className="mt-1 h-4 w-4 accent-primary" checked={current.includes(o.value)} disabled={disabled || o.disabled} onChange={(e)=>update(o.value,e.target.checked)} /><span className="text-bk-sm text-foreground">{o.label}</span></label>)}
  </div></FieldShell>;
};
export const CheckboxGroup = createComponent<CheckboxGroupProps>("CheckboxGroup");
