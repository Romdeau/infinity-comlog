import type { EnrichedArmyList } from "@/lib/unit-service"
import type { MeasurementUnit } from "@/lib/metadata-service"
import { WEAPON_DATA } from "@/lib/weapon-data"
import { RangeBand } from "@/components/system"
import {
  getProfileWeaponIds,
  getUnitProfiles,
  type WeaponChartRow,
} from "./list-view-helpers"

const RANGE_HEADERS_METRIC = [
  "0-20",
  "20-40",
  "40-60",
  "60-80",
  "80-100",
  "100-120",
  "120-240",
]
const RANGE_HEADERS_IMPERIAL = [
  "0-8",
  "8-16",
  "16-24",
  "24-32",
  "32-40",
  "40-48",
  "48-96",
]

/**
 * Fire-control table: every unique weapon mode in the list rendered with the
 * tokenized range-band scale, mono numerics, a sticky header and horizontal
 * scroll on small screens.
 */
export function WeaponChart({
  list,
  unit,
}: {
  list: EnrichedArmyList
  unit: MeasurementUnit
}) {
  const weaponIds = new Set<number>()
  list.combatGroups.forEach((group) => {
    group.members.forEach((member) => {
      getUnitProfiles(member).forEach((profile) => {
        getProfileWeaponIds(profile).forEach((id) => weaponIds.add(id))
      })
    })
  })

  const sortedWeapons = Array.from(weaponIds)
    .flatMap((id): WeaponChartRow[] => {
      const modes = WEAPON_DATA[id]
      if (!modes) return []
      return modes.map((m) => ({ id, ...m }))
    })
    .filter((w) => w.name)
    .sort((a, b) => {
      const nameCompare = a.name.localeCompare(b.name)
      if (nameCompare !== 0) return nameCompare
      return a.mode.localeCompare(b.mode)
    })

  if (sortedWeapons.length === 0) return null

  const isMetric = unit === "metric"
  const rangeHeaders = isMetric ? RANGE_HEADERS_METRIC : RANGE_HEADERS_IMPERIAL

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <table className="w-full border-collapse text-[10px]">
        <thead className="sticky top-0 z-10">
          <tr className="border-b border-border bg-muted text-ui-label">
            <th className="border-r border-border p-2 text-left">Name</th>
            <th className="border-r border-border p-2 text-left">Mode</th>
            <th className="min-w-[280px] border-r border-border p-0">
              <div className="border-b border-border bg-muted/40 py-0.5 text-center text-[8px] tracking-widest">
                Range ({isMetric ? "cm" : "Inches"})
              </div>
              <div className="grid grid-cols-7 py-1 text-center text-[8px] font-bold">
                {rangeHeaders.map((h) => (
                  <div key={h}>{h}</div>
                ))}
              </div>
            </th>
            <th className="border-r border-border p-2 text-center">PS</th>
            <th className="border-r border-border p-2 text-center">B</th>
            <th className="border-r border-border p-2 text-center">Ammo</th>
            <th className="border-r border-border p-2 text-center">SR: Attrib</th>
            <th className="border-r border-border p-2 text-center">SR: No</th>
            <th className="p-2 text-left">Traits</th>
          </tr>
        </thead>
        <tbody>
          {sortedWeapons.map((w, idx) => (
            <tr
              key={`${w.id}-${idx}`}
              className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/30"
            >
              <td className="border-r border-border/60 p-2 font-display text-xs font-semibold whitespace-nowrap uppercase">
                {w.name}
              </td>
              <td className="border-r border-border/60 p-2 font-bold whitespace-nowrap text-muted-foreground italic">
                {w.mode}
              </td>
              <td className="border-r border-border/60 p-0">
                <RangeBand distance={w.distance} unit={unit} />
              </td>
              <td className="hud-readout border-r border-border/60 p-2 text-center font-semibold text-primary">
                {w.damage}
              </td>
              <td className="hud-readout border-r border-border/60 p-2 text-center font-semibold">
                {w.burst}
              </td>
              <td className="border-r border-border/60 p-2 text-center font-bold text-muted-foreground">
                {w.ammo}
              </td>
              <td className="border-r border-border/60 p-2 text-center font-bold text-muted-foreground">
                {w.saving}
              </td>
              <td className="border-r border-border/60 p-2 text-center font-bold text-muted-foreground">
                {w.savingNum}
              </td>
              <td className="p-2 text-[9px] leading-tight font-medium text-muted-foreground/80">
                {w.traits?.join(" • ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
