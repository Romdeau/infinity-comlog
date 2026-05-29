import type { WeaponMode } from "@/lib/weapon-data"
import type { MeasurementUnit } from "@/lib/metadata-service"
import { cn } from "@/lib/utils"

type RangeDistance = NonNullable<WeaponMode["distance"]>

const RANGE_BAND_KEYS = [
  "short",
  "med",
  "long",
  "max",
] as const satisfies readonly (keyof RangeDistance)[]

/** Sample range midpoints (cm) used to colour the 7-cell visualization. */
const RANGE_SAMPLES_METRIC = [10, 30, 50, 70, 90, 110, 180]
const RANGE_SAMPLES_IMPERIAL = [4, 12, 20, 28, 36, 44, 72]

/** Maps a weapon range modifier to a semantic band token + foreground. */
function bandClassesForMod(mod: string | null): { bg: string; fg: string } {
  switch (mod) {
    case "+6":
      return { bg: "bg-band-plus", fg: "text-band-foreground font-black" }
    case "+3":
      return { bg: "bg-band-good", fg: "text-band-foreground font-black" }
    case "0":
      return { bg: "bg-band-neutral", fg: "text-band-foreground font-black" }
    case "-3":
      return { bg: "bg-band-bad", fg: "text-band-foreground font-black" }
    case "-6":
      return { bg: "bg-band-worst", fg: "text-band-foreground font-black" }
    default:
      return { bg: "bg-muted/20", fg: "text-muted-foreground/40" }
  }
}

export interface RangeBandProps {
  distance: WeaponMode["distance"]
  unit: MeasurementUnit
  className?: string
}

/**
 * 7-cell weapon range visualization driven by the `--band-*` tokens so it
 * re-themes cleanly. Each cell shows the range modifier and is coloured by
 * its band; meaning is conveyed by both the modifier text and the band colour.
 */
export function RangeBand({ distance, unit, className }: RangeBandProps) {
  if (!distance) return <div className={cn("h-full bg-muted/10", className)} />

  const isMetric = unit === "metric"

  const getMod = (val: number): string | null => {
    const cm = isMetric ? val : val * 2.5
    for (const band of RANGE_BAND_KEYS) {
      const entry = distance[band]
      if (entry && entry.max >= cm) {
        const prevBandIdx = RANGE_BAND_KEYS.indexOf(band) - 1
        const prevBand = prevBandIdx >= 0 ? RANGE_BAND_KEYS[prevBandIdx] : null
        const prevMax = prevBand ? distance[prevBand]?.max || 0 : 0
        if (cm > prevMax) return entry.mod
      }
    }
    return null
  }

  const ranges = isMetric ? RANGE_SAMPLES_METRIC : RANGE_SAMPLES_IMPERIAL

  return (
    <div className={cn("grid h-full grid-cols-7 items-stretch", className)}>
      {ranges.map((r, i) => {
        const mod = getMod(r)
        const { bg, fg } = bandClassesForMod(mod)
        return (
          <div
            key={i}
            className={cn(
              "flex h-full items-center justify-center border-r text-[9px] last:border-r-0",
              bg,
              fg
            )}
          >
            {mod || ""}
          </div>
        )
      })}
    </div>
  )
}
