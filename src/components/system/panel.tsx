import * as React from "react"

import { cn } from "@/lib/utils"
import { StatusPip, type StatusKind } from "./status-pip"

export interface PanelProps extends Omit<React.ComponentProps<"section">, "title"> {
  title?: React.ReactNode
  eyebrow?: string
  status?: StatusKind
  statusLabel?: string
  actions?: React.ReactNode
  density?: "comfortable" | "compact"
  variant?: "default" | "raised" | "inset"
}

const PADDING: Record<NonNullable<PanelProps["density"]>, string> = {
  comfortable: "p-4 sm:p-5",
  compact: "p-3",
}

const VARIANT_BG: Record<NonNullable<PanelProps["variant"]>, string> = {
  default: "",
  raised: "bg-surface-raised",
  inset: "bg-surface-2",
}

/**
 * Major surface primitive. Renders the themeable `.panel-frame` chrome with an
 * optional header (eyebrow / title / status / actions). Replaces ad-hoc Card
 * usage for primary surfaces while leaving the shadcn Card available for small
 * uses.
 */
export function Panel({
  title,
  eyebrow,
  status,
  statusLabel,
  actions,
  density = "comfortable",
  variant = "default",
  className,
  children,
  ...props
}: PanelProps) {
  const hasHeader = Boolean(title || eyebrow || status || actions)

  return (
    <section
      className={cn(
        "panel-frame text-card-foreground rounded-lg",
        VARIANT_BG[variant],
        PADDING[density],
        className
      )}
      {...props}
    >
      {hasHeader && (
        <header className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            {eyebrow && <div className="text-ui-label">{eyebrow}</div>}
            {title && (
              <h3 className="font-display text-lg leading-tight font-semibold tracking-[var(--text-display-tracking)]">
                {title}
              </h3>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {status && <StatusPip status={status} label={statusLabel} />}
            {actions}
          </div>
        </header>
      )}
      {children}
    </section>
  )
}
