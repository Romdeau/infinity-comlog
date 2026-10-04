import { RadioIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getDevicePrograms } from "@/lib/device-programs"
import type { EnrichedProfile } from "./list-view-helpers"

export function DevicePrograms({
  name,
  profile,
}: {
  name: string
  profile: EnrichedProfile
}) {
  const data = getDevicePrograms(name, profile)
  if (!data) return <>{name}</>
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center gap-1 rounded text-left text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary focus-visible:outline-2 focus-visible:outline-primary"
          aria-label={`View programs for ${name}`}
        >
          <RadioIcon className="size-3 shrink-0" />
          {name}
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{data.device.name}</DialogTitle>
          <DialogDescription>
            {profile.name || "This profile"} · {data.programs.length} programs.
            Program stats below are the base values; apply the listed upgrades.
          </DialogDescription>
        </DialogHeader>
        {data.upgrades.length > 0 && (
          <section className="space-y-1 rounded-md border border-primary/40 bg-primary/5 p-3">
            <h3 className="text-sm font-semibold">Device upgrades</h3>
            {data.upgrades.map((upgrade) => (
              <p key={upgrade} className="text-sm">
                {upgrade}
              </p>
            ))}
          </section>
        )}
        <div className="space-y-3">
          {data.programs.map((program) => (
            <article
              key={program.name}
              className="rounded-md border border-border p-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <a
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                  href={program.wiki}
                  target="_blank"
                  rel="noreferrer"
                >
                  {program.name}
                </a>
                {program.added && (
                  <span className="text-xs font-semibold text-primary">
                    Extra program
                  </span>
                )}
              </div>
              {program.upgrades.map((upgrade) => (
                <p
                  key={upgrade}
                  className="mt-1 text-xs font-semibold text-primary"
                >
                  {upgrade}
                </p>
              ))}
              <dl className="my-3 grid grid-cols-4 gap-2 text-xs">
                {[
                  ["Burst", program.burst],
                  ["PS", program.damage],
                  ["Attack", program.attack],
                  ["Opponent", program.opponent],
                ].map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-mono font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="text-xs">
                {program.skillType} · Target: {program.target}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {program.special}
              </p>
            </article>
          ))}
          {data.programs.length === 0 && (
            <p>No program data available for this device.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
