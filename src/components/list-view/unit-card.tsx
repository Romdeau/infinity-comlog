import { InfoIcon, Maximize2Icon } from "lucide-react"

import type { EnrichedTrooper } from "@/lib/unit-service"
import { WEAPON_DATA } from "@/lib/weapon-data"
import { MetadataService } from "@/lib/metadata-service"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatLine } from "@/components/system"
import {
  getProfileWeapons,
  getResolvedEquipmentNames,
  getResolvedSkillNames,
  getUnitProfiles,
} from "./list-view-helpers"
import { UnitDetailDialog } from "./unit-detail-dialog"

/** Dossier panel for a single trooper. */
export function UnitCard({ unit }: { unit: EnrichedTrooper }) {
  const profiles = getUnitProfiles(unit)

  return (
    <div className="card panel-frame flex h-full flex-col overflow-hidden break-inside-avoid rounded-lg">
      <div className="border-b border-border/60 bg-muted/30 px-3 pt-2.5 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              {unit.logo ? (
                <img
                  src={unit.logo}
                  alt=""
                  className="size-10 shrink-0 object-contain print:grayscale"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
                  <InfoIcon className="size-5 text-muted-foreground/40" />
                </div>
              )}
              <div className="min-w-0">
                <div className="truncate font-display text-sm leading-none font-semibold tracking-tight uppercase">
                  {unit.name}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[9px] font-bold tracking-wider text-muted-foreground uppercase">
                  <span className="shrink-0">{unit.type}</span>
                  <span className="opacity-30">•</span>
                  <span
                    className={cn(
                      "shrink-0",
                      unit.training?.toUpperCase() === "REGULAR" && "text-status-complete",
                      unit.training?.toUpperCase() === "IRREGULAR" && "text-status-warning"
                    )}
                  >
                    {unit.training}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              <div className="flex flex-wrap justify-end gap-1">
                <Badge
                  variant="outline"
                  className="hud-readout h-5 border-primary/30 bg-background/50 px-1.5 text-[10px] font-semibold whitespace-nowrap text-primary"
                >
                  {unit.points} PTS
                </Badge>
                {unit.swc !== "0" && (
                  <Badge
                    variant="outline"
                    className="hud-readout h-5 rounded-full border-status-info/30 bg-status-info/10 px-1.5 text-[10px] font-semibold whitespace-nowrap text-status-info"
                  >
                    {unit.swc} SWC
                  </Badge>
                )}
              </div>
              <UnitDetailDialog unit={unit}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6 shrink-0 transition-colors hover:bg-primary/10 print:hidden"
                >
                  <Maximize2Icon className="size-3.5" />
                </Button>
              </UnitDetailDialog>
            </div>
          </div>

          <div className="px-0.5 text-[9px] leading-tight font-bold tracking-widest break-words text-foreground/60 uppercase">
            {unit.isc}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-0">
        {profiles.length > 0 ? (
          profiles.map((profile, pIdx) => {
            const resolvedSkills = getResolvedSkillNames(profile)
            const resolvedEquip = getResolvedEquipmentNames(profile)
            const weapons = getProfileWeapons(profile)

            return (
              <div
                key={pIdx}
                className={cn(
                  "flex flex-col",
                  pIdx > 0 && "mt-2 border-t-2 border-dashed border-border/60 pt-2"
                )}
              >
                {profiles.length > 1 && (
                  <div className="bg-primary/5 px-3 py-1 text-[9px] font-bold tracking-widest text-primary/70 uppercase">
                    Profile: {profile.name || `Option ${pIdx + 1}`}
                  </div>
                )}

                <StatLine
                  profile={{
                    mov: profile.mov,
                    cc: profile.cc,
                    bs: profile.bs,
                    ph: profile.ph,
                    wip: profile.wip,
                    arm: profile.arm,
                    bts: profile.bts,
                    w: profile.w,
                    s: profile.s,
                    isStr: profile.isStr,
                  }}
                />

                <div className="space-y-2.5 p-2.5">
                  {resolvedSkills.length > 0 && (
                    <div className="space-y-0.5">
                      <div className="text-ui-label">Skills</div>
                      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
                        {resolvedSkills.map((s, idx) => (
                          <span key={idx} className="text-[10px] font-bold text-foreground/90">
                            {s}
                            {idx < resolvedSkills.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {resolvedEquip.length > 0 && (
                    <div className="space-y-0.5">
                      <div className="text-ui-label">Equipment</div>
                      <div className="flex flex-wrap gap-x-1.5 gap-y-0.5">
                        {resolvedEquip.map((e, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold text-foreground/80 italic"
                          >
                            {e}
                            {idx < resolvedEquip.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {weapons.length > 0 && (
                    <div className="space-y-0.5">
                      <div className="text-ui-label">Weapons</div>
                      <div className="grid gap-1.5">
                        {weapons.map((w, idx) => {
                          const modes = WEAPON_DATA[w.id]
                          if (!modes)
                            return (
                              <div
                                key={idx}
                                className="font-display text-[10px] font-semibold tracking-tight text-primary/90 uppercase"
                              >
                                {MetadataService.getWeaponName(w.id)}
                              </div>
                            )

                          return modes.map((m, mIdx) => (
                            <div
                              key={`${idx}-${mIdx}`}
                              className="flex items-start justify-between gap-3 border-b border-border/40 pb-1 last:border-0 last:pb-0"
                            >
                              <div className="flex min-w-0 flex-1 flex-col">
                                <div className="font-display text-[10px] leading-tight font-semibold tracking-tight break-words text-primary uppercase">
                                  {m.name}{" "}
                                  {modes.length > 1 && (
                                    <span className="text-[8px] font-bold text-muted-foreground italic">
                                      ({m.mode})
                                    </span>
                                  )}
                                </div>
                                {m.traits.length > 0 && (
                                  <div className="mt-0.5 text-[8px] leading-snug break-words text-muted-foreground">
                                    {m.traits.join(", ")}
                                  </div>
                                )}
                              </div>
                              <div className="flex shrink-0 items-center gap-1.5 pt-0.5">
                                <WeaponStat label="PS" value={m.damage} />
                                <WeaponStat label="B" value={m.burst} />
                                <WeaponStat
                                  label="Ammo"
                                  value={m.ammo}
                                  className="text-status-info"
                                />
                              </div>
                            </div>
                          ))
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-4 text-center text-xs text-muted-foreground italic">
            No profile data available. Please re-import your list.
          </div>
        )}
      </div>
    </div>
  )
}

function WeaponStat({
  label,
  value,
  className,
}: {
  label: string
  value: React.ReactNode
  className?: string
}) {
  return (
    <div className="flex min-w-[16px] flex-col items-center">
      <span className="mb-0.5 text-[6px] leading-none font-bold text-muted-foreground uppercase">
        {label}
      </span>
      <span className={cn("hud-readout text-[9px] leading-none font-semibold", className)}>
        {value}
      </span>
    </div>
  )
}
