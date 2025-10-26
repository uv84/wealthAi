"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

function sanitizeStyle(obj?: unknown): React.CSSProperties | undefined {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return undefined;
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => isNaN(Number(key)))
  ) as React.CSSProperties;
}

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
  extraStyles?: React.CSSProperties;
  indicatorClassName?: string;
  indicatorStyle?: React.CSSProperties;
};

function Progress({
  className,
  value,
  extraStyles,
  indicatorClassName,
  indicatorStyle,
  ...props
}: ProgressProps) {
  const base = (props.style as React.CSSProperties | undefined) ?? {};
  const safeExtra = sanitizeStyle(extraStyles);
  const mergedStyle = { ...base, ...(safeExtra ?? {}) };

  const safeIndicatorStyle = sanitizeStyle(indicatorStyle);

  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      )}
      {...props}
      style={mergedStyle}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 transition-all", indicatorClassName)}
        style={{
          transform: `translateX(-${100 - (value ?? 0)}%)`,
          ...(safeIndicatorStyle ?? {}),
        }}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };