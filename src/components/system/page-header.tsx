import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  description: string
  status?: string
  actions?: React.ReactNode
  /** Optional live status strip rendered below the description. */
  systemStatus?: React.ReactNode
  className?: string
}

/**
 * Command-console page header. Replaces PageIntro: renders the page title in
 * the theme's display font and supports an optional live "system status" strip.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  status,
  actions,
  systemStatus,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "panel-frame flex flex-col gap-4 rounded-lg p-5 sm:p-6",
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          {eyebrow && <div className="text-ui-label">{eyebrow}</div>}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-display text-xl font-semibold tracking-[var(--text-display-tracking)] sm:text-2xl">
              {title}
            </h2>
            {status && (
              <Badge variant="outline" className="text-xs">
                {status}
              </Badge>
            )}
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {systemStatus ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/60 pt-3">
          {systemStatus}
        </div>
      ) : null}
    </section>
  )
}
