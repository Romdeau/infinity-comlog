import * as React from "react"

import { cn } from "@/lib/utils"

export interface ReadoutProps {
  /** Small uppercase label above the value. */
  label: string
  value: React.ReactNode
  /** Optional unit/suffix shown next to the value. */
  unit?: string
  /** Visual emphasis: larger value text for headline stats. */
  size?: "sm" | "md" | "lg"
  align?: "start" | "center" | "end"
  className?: string
}

const VALUE_SIZE: Record<NonNullable<ReadoutProps["size"]>, string> = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-3xl",
}

/**
 * Monospace numeric display (label + value + optional unit) used for live
 * stats: orders, points, SWC, scores, ranges.
 */
export function Readout({
  label,
  value,
  unit,
  size = "md",
  align = "start",
  className,
}: ReadoutProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5",
        align === "center" && "items-center text-center",
        align === "end" && "items-end text-right",
        className
      )}
    >
      <span className="text-ui-label">{label}</span>
      <span className={cn("hud-readout font-semibold leading-none", VALUE_SIZE[size])}>
        {value}
        {unit ? (
          <span className="ml-1 text-[0.6em] font-medium text-muted-foreground">
            {unit}
          </span>
        ) : null}
      </span>
    </div>
  )
}
