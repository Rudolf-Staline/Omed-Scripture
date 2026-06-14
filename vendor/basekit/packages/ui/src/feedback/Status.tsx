import { cn, createComponent } from "@basekit/core";
import type { Tone } from "@basekit/tokens";

/* Skeleton ------------------------------------------------------------- */

export type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  radius?: "sm" | "md" | "lg" | "full";
  className?: string;
  /** Render N stacked lines. */
  lines?: number;
};

const skeletonRadius = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export const SkeletonView = ({
  width,
  height = "1rem",
  radius = "md",
  className,
  lines,
}: SkeletonProps) => {
  if (lines && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "animate-pulse bg-surface-muted",
              skeletonRadius[radius],
              className,
            )}
            style={{
              width: i === lines - 1 ? "70%" : (width ?? "100%"),
              height,
            }}
          />
        ))}
      </div>
    );
  }
  return (
    <div
      className={cn(
        "animate-pulse bg-surface-muted",
        skeletonRadius[radius],
        className,
      )}
      style={{ width: width ?? "100%", height }}
    />
  );
};

export const Skeleton = createComponent<SkeletonProps>("Skeleton");

/* Progress ------------------------------------------------------------- */

export type ProgressProps = {
  value: number;
  max?: number;
  tone?: Tone;
  label?: string;
  showValue?: boolean;
  className?: string;
};

const progressFill: Record<Tone, string> = {
  neutral: "bg-foreground",
  primary: "bg-primary",
  accent: "bg-accent",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

export const ProgressView = ({
  value,
  max = 100,
  tone = "primary",
  label,
  showValue,
  className,
}: ProgressProps) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("space-y-1.5", className)}>
      {(label != null || showValue) && (
        <div className="flex items-center justify-between text-bk-xs text-muted-foreground">
          {label && <span>{label}</span>}
          {showValue && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-surface-muted"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all",
            progressFill[tone],
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

export const Progress = createComponent<ProgressProps>("Progress");
