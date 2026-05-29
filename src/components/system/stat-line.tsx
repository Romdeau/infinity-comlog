import { cn } from "@/lib/utils"

export interface StatLineProfile {
  mov: React.ReactNode
  cc: React.ReactNode
  bs: React.ReactNode
  ph: React.ReactNode
  wip: React.ReactNode
  arm: React.ReactNode
  bts: React.ReactNode
  /** Wounds (W) or Structure (STR). */
  w: React.ReactNode
  /** Silhouette (S). */
  s: React.ReactNode
  /** Whether the unit uses Structure (STR) rather than Vitality (VITA). */
  isStr?: boolean
}

export interface StatLineProps {
  profile: StatLineProfile
  className?: string
}

/**
 * The 9-column MOV/CC/BS/PH/WIP/ARM/BTS/W/S stat grid shared by the List View
 * unit cards and the unit detail dialog. Numeric values use the mono token.
 */
export function StatLine({ profile, className }: StatLineProps) {
  const headers = [
    "MOV",
    "CC",
    "BS",
    "PH",
    "WIP",
    "ARM",
    "BTS",
    profile.isStr ? "STR" : "VITA",
    "S",
  ]
  const values = [
    profile.mov,
    profile.cc,
    profile.bs,
    profile.ph,
    profile.wip,
    profile.arm,
    profile.bts,
    profile.w,
    profile.s,
  ]

  return (
    <div className={className}>
      <div className="grid grid-cols-9 border-b border-border/60 bg-muted/20 text-center text-[8px] font-black uppercase">
        {headers.map((h, i) => (
          <div
            key={h}
            className={cn(
              "py-0.5",
              i < headers.length - 1 && "border-r border-border/60"
            )}
          >
            {h}
          </div>
        ))}
      </div>
      <div className="hud-readout grid grid-cols-9 border-b border-border/60 text-center text-[11px] font-bold">
        {values.map((v, i) => (
          <div
            key={i}
            className={cn(
              "bg-card py-1",
              i < values.length - 1 && "border-r border-border/60"
            )}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  )
}
