import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type PageIntroProps = {
  eyebrow?: string
  title: string
  description: string
  status?: string
  actions?: React.ReactNode
  className?: string
}

export function PageIntro({
  eyebrow,
  title,
  description,
  status,
  actions,
  className,
}: PageIntroProps) {
  return (
    <section className={cn("flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 sm:p-6", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          {eyebrow && (
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {eyebrow}
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
            {status && (
              <Badge variant="outline" className="text-xs">
                {status}
              </Badge>
            )}
          </div>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </section>
  )
}
