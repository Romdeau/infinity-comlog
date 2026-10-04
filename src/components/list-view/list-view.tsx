import type { EnrichedArmyList } from "@/lib/unit-service"
import type { MeasurementUnit } from "@/lib/metadata-service"
import { Readout } from "@/components/system"
import { FireteamRoster } from "./fireteam-roster"
import { WeaponChart } from "./weapon-chart"

/** Renders one army list: combat groups of dossier cards + the fire-control chart. */
export function ListView({
  list,
  unit,
}: {
  list: EnrichedArmyList
  unit: MeasurementUnit
}) {
  return (
    <div className="space-y-8">
      {/* Print-only header. */}
      <div className="mb-6 hidden border-b-2 border-primary pb-4 print:block">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-primary uppercase">
              {list.armyName}
            </h1>
            <p className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
              {list.sectoralName}
            </p>
          </div>
          <div className="hud-readout text-right text-2xl font-semibold text-primary">
            {list.points} PT
          </div>
        </div>
      </div>

      <FireteamRoster list={list} />

      <div className="mt-12 space-y-4 break-inside-avoid">
        <div className="flex items-center justify-between gap-2 border-b-2 border-primary pb-1">
          <h2 className="font-display text-xl font-semibold tracking-tight text-primary uppercase">
            Weapons Chart
          </h2>
          <Readout
            label="Total Points"
            value={list.points}
            unit="PT"
            size="sm"
            align="end"
          />
        </div>
        <WeaponChart list={list} unit={unit} />
      </div>
    </div>
  )
}
