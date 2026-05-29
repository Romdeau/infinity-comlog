import * as React from "react"

import { useSettings } from "@/context/settings-context"
import type { EnrichedTrooper } from "@/lib/unit-service"
import { WEAPON_DATA } from "@/lib/weapon-data"
import { MetadataService } from "@/lib/metadata-service"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RangeBand, Readout, StatLine } from "@/components/system"
import {
  getProfileWeapons,
  getResolvedEquipmentNames,
  getResolvedSkillNames,
  getUnitProfiles,
} from "./list-view-helpers"

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="mb-3 flex items-center gap-2 text-ui-label">
      <span className="h-px flex-1 bg-border" />
      {children}
      <span className="h-px flex-1 bg-border" />
    </h4>
  )
}

/** Full-screen unit dossier sharing the StatLine / RangeBand primitives. */
export function UnitDetailDialog({
  unit,
  children,
}: {
  unit: EnrichedTrooper
  children: React.ReactNode
}) {
  const { settings } = useSettings()
  const profiles = getUnitProfiles(unit)

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex h-[95vh] w-full flex-col overflow-hidden border-none p-0 sm:max-w-[95vw]">
        <DialogHeader className="shrink-0 border-b bg-muted/30 p-4 pr-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                {unit.logo && (
                  <img src={unit.logo} alt="" className="size-10 shrink-0 object-contain" />
                )}
                <div className="min-w-0">
                  <DialogTitle className="truncate font-display text-2xl leading-none font-semibold tracking-[var(--text-display-tracking)] uppercase">
                    {unit.name}
                  </DialogTitle>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-bold tracking-widest uppercase">
                      {unit.type}
                    </Badge>
                    <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-bold tracking-widest uppercase">
                      {unit.training}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 gap-4">
                <Readout label="Points" value={unit.points} size="md" align="center" />
                <Readout label="SWC" value={unit.swc} size="md" align="center" />
              </div>
            </div>

            <div className="border-t border-border/60 pt-3 text-[10px] leading-relaxed font-bold tracking-[0.2em] break-words text-foreground/70 uppercase">
              {unit.isc}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto bg-muted/5 p-4">
          <div className="mx-auto max-w-[1600px] space-y-6">
            {profiles.map((profile, pIdx) => {
              const resolvedSkills = getResolvedSkillNames(profile)
              const resolvedEquip = getResolvedEquipmentNames(profile)
              const weapons = getProfileWeapons(profile)

              return (
                <div
                  key={pIdx}
                  className="panel-frame space-y-6 rounded-lg p-5"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight uppercase">
                      <span className="size-2 rounded-full bg-primary" />
                      {profile.name || "Unit Profile"}
                    </div>
                    <Readout label="Silhouette" value={`S${profile.s}`} size="sm" align="center" />
                  </div>

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
                    className="overflow-hidden rounded-md border border-border"
                  />

                  <div className="grid gap-6 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-3">
                      <section>
                        <SectionLabel>Skills</SectionLabel>
                        <div className="flex flex-wrap gap-1.5">
                          {resolvedSkills.map((s, idx) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="rounded border-primary/10 bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </section>

                      <section>
                        <SectionLabel>Equipment</SectionLabel>
                        <div className="flex flex-wrap gap-1.5">
                          {resolvedEquip.map((e, idx) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="rounded border-border px-2 py-0.5 text-[10px] font-bold italic"
                            >
                              {e}
                            </Badge>
                          ))}
                        </div>
                      </section>
                    </div>

                    <div className="space-y-4 lg:col-span-9">
                      <SectionLabel>Weapon Systems</SectionLabel>
                      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {weapons.map((w, idx) => {
                          const modes = WEAPON_DATA[w.id]
                          if (!modes)
                            return (
                              <div
                                key={idx}
                                className="rounded border border-border bg-muted/10 p-3 font-display text-[10px] font-semibold tracking-widest uppercase"
                              >
                                {MetadataService.getWeaponName(w.id)}
                              </div>
                            )

                          return modes.map((m, mIdx) => (
                            <div
                              key={`${idx}-${mIdx}`}
                              className="space-y-2 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/40"
                            >
                              <div className="flex items-start justify-between">
                                <div className="space-y-0.5">
                                  <div className="font-display text-sm font-semibold tracking-tight text-primary uppercase">
                                    {m.name}
                                  </div>
                                  <div className="inline-flex items-center rounded bg-muted px-1.5 py-0 text-[8px] font-bold tracking-widest text-muted-foreground uppercase">
                                    {m.mode}
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <Readout label="DMG" value={m.damage} size="sm" align="center" />
                                  <Readout label="B" value={m.burst} size="sm" align="center" />
                                  <Readout label="Ammo" value={m.ammo} size="sm" align="center" />
                                </div>
                              </div>

                              <div className="flex min-h-[18px] flex-wrap gap-1">
                                {m.traits.map((trait, tIdx) => (
                                  <span
                                    key={tIdx}
                                    className="rounded bg-muted/40 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-muted-foreground uppercase"
                                  >
                                    {trait}
                                  </span>
                                ))}
                              </div>

                              {m.distance && Object.keys(m.distance).length > 0 && (
                                <div className="h-6 overflow-hidden rounded border border-border bg-muted/5">
                                  <RangeBand
                                    distance={m.distance}
                                    unit={settings.measurementUnit}
                                  />
                                </div>
                              )}
                            </div>
                          ))
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
