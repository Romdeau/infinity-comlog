import { LayersIcon, PackageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { GamePhase, ContextualHint } from "@/lib/army-context-mapping"
import { BOOTY_TABLE_LEFT, BOOTY_TABLE_RIGHT } from "@/data/booty-table"

function BootyPopover() {
  return (
    <Popover>
      <PopoverTrigger className="flex cursor-pointer items-center gap-1 hover:underline">
        Booty <PackageIcon className="size-2.5" />
      </PopoverTrigger>
      <PopoverContent className="w-80 overflow-hidden p-0" align="end">
        <div className="bg-primary p-2 text-center text-[10px] font-bold tracking-widest text-primary-foreground uppercase">
          Booty Table
        </div>
        <div className="p-0 text-[10px]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted text-muted-foreground">
                <th className="border-r border-border p-1 text-center">Roll</th>
                <th className="border-r border-border p-1 text-left">Item</th>
                <th className="border-r border-border p-1 text-center">Roll</th>
                <th className="p-1 text-left">Item</th>
              </tr>
            </thead>
            <tbody>
              {BOOTY_TABLE_LEFT.map((left, i) => {
                const right = BOOTY_TABLE_RIGHT[i]
                return (
                  <tr key={left.roll} className="border-b border-border last:border-0">
                    <td className="hud-readout border-r border-border bg-muted/30 p-1 text-center font-bold">
                      {left.roll}
                    </td>
                    <td className="border-r border-border p-1">{left.item}</td>
                    <td className="hud-readout border-r border-border bg-muted/30 p-1 text-center font-bold">
                      {right?.roll}
                    </td>
                    <td className="p-1">{right?.item}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Tactical advisories rail: unit/strategic hints for the current phase. Setup
 * phase surfaces deployment assistance; other phases surface phase hints.
 */
export function ContextualHints({
  hints,
  phase,
  onToggle,
  checkedMap,
}: {
  hints: ContextualHint[]
  phase: GamePhase
  onToggle?: (id: string, val: boolean) => void
  checkedMap?: Record<string, boolean>
}) {
  if (hints.length === 0) return null

  const isSetup = phase === "setup"

  return (
    <div
      className={cn(
        "space-y-3 rounded-lg border p-3",
        isSetup ? "border-border/70 bg-muted/30" : "border-primary/15 bg-primary/5"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-ui-label",
          isSetup ? "text-foreground" : "text-primary"
        )}
      >
        <LayersIcon className="size-3.5" />
        {isSetup ? "Deployment Assistance" : "Phase Hints"}
      </div>
      <div className="grid gap-2">
        {hints.map((item) => {
          const isStrategic = item.unitName === "Strategic Use"
          return (
            <label
              key={item.id}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded border p-2 transition-colors",
                isStrategic
                  ? "border-border/70 bg-accent hover:bg-accent/80"
                  : "border-border/40 bg-background/40 hover:bg-background/60"
              )}
            >
              <div className="flex items-center gap-3">
                {onToggle && !isStrategic && (
                  <Checkbox
                    checked={checkedMap?.[item.id] || false}
                    onCheckedChange={(val) => onToggle(item.id, !!val)}
                  />
                )}
                <span
                  className={cn(
                    "text-xs font-medium tracking-[0.14em] uppercase",
                    isStrategic
                      ? "text-foreground"
                      : checkedMap?.[item.id] &&
                          "text-muted-foreground line-through opacity-70"
                  )}
                >
                  {item.unitName}
                </span>
              </div>
              <div className="flex flex-wrap justify-end gap-1">
                {item.skills.map((skill, i) => (
                  <div
                    key={i}
                    className={cn(
                      "flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs",
                      isStrategic
                        ? "border-border/70 bg-accent text-accent-foreground"
                        : skill === "Booty"
                          ? "border-border/70 bg-accent text-foreground"
                          : "border-border bg-muted/50 text-muted-foreground"
                    )}
                  >
                    {skill === "Booty" ? <BootyPopover /> : skill}
                  </div>
                ))}
              </div>
            </label>
          )
        })}
      </div>
    </div>
  )
}
