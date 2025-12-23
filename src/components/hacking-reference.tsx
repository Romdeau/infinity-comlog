import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon, RadioIcon, ZapIcon } from "lucide-react"
import metadata from "@/data/metadata.json"

interface HackingProgram {
  name: string
  deviceIds: number[]
  target: string
  burst: string
  damage: string
  attack: string
  opponent: string
  special: string
  skillType: string
  wiki?: string
}

// Map metadata hacking programs to the UI format
const HACKING_PROGRAMS: HackingProgram[] = ((metadata as any).hack || []).map((prog: any) => {
  return {
    name: (prog.name || "Unknown").replace(/\u00a0/g, ' '), // Clean up non-breaking spaces
    deviceIds: prog.devices || [],
    target: Array.isArray(prog.target) && prog.target.length > 0 ? prog.target.join(", ") : "Any",
    burst: prog.burst || "-",
    damage: prog.damage || "-",
    attack: prog.attack || "-",
    opponent: prog.opponent || "-",
    special: prog.special || "-",
    skillType: Array.isArray(prog.skillType) ? prog.skillType.join(" / ").toUpperCase() : "-",
    wiki: `https://infinitythewiki.com/${(prog.name || "").replace(/\u00a0/g, '_').replace(/ /g, '_')}`
  }
})

// Get device names from metadata
const DEVICES = ((metadata as any).equips || []).reduce((acc: Record<number, string>, equip: any) => {
  if (equip.name.toLowerCase().includes("hacking device")) {
    acc[equip.id] = equip.name
  }
  return acc
}, {} as Record<number, string>)

export function HackingReference() {
  // Group programs by device
  // Note: A program can belong to multiple devices. 
  // Programs with no devices are grouped under "Upgrade / Other"
  const groupedByDevice = React.useMemo(() => {
    const groups: Record<string, HackingProgram[]> = {}

    HACKING_PROGRAMS.forEach(prog => {
      if (prog.deviceIds.length === 0) {
        const key = "Upgrade / Other"
        if (!groups[key]) groups[key] = []
        groups[key].push(prog)
      } else {
        prog.deviceIds.forEach(id => {
          const deviceName = DEVICES[id] || `Device ${id}`
          if (!groups[deviceName]) groups[deviceName] = []
          groups[deviceName].push(prog)
        })
      }
    })

    return groups
  }, [])

  const deviceOrder = [
    "EVO Hacking Device",
    "Hacking Device Plus",
    "Hacking Device",
    "Killer Hacking Device",
    "Upgrade / Other"
  ]

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1.5 px-2">
          <ZapIcon className="size-3" />
          Programs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[95vw] max-w-[95vw] w-full max-h-[90vh] overflow-y-auto p-0 sm:p-6">
        <div className="p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <RadioIcon className="size-5 text-primary" />
              Hacking Programs Reference
            </DialogTitle>
            <DialogDescription className="text-sm">
              Quick reference for N5 hacking programs and supportware.
              <a href="https://infinitythewiki.com/Hacking_Programs" target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center text-primary hover:underline">
                Wiki <ExternalLinkIcon className="ml-1 size-3" />
              </a>
            </DialogDescription>
          </DialogHeader>

          <Accordion type="multiple" defaultValue={deviceOrder} className="space-y-4">
            {deviceOrder.map(deviceName => groupedByDevice[deviceName] && (
              <AccordionItem key={deviceName} value={deviceName} className="border rounded-lg overflow-hidden border-border bg-card/50">
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`size-2 rounded-full ${deviceName.includes("Killer") ? "bg-red-500" :
                        deviceName.includes("EVO") ? "bg-green-500" :
                          deviceName.includes("Plus") ? "bg-blue-500" :
                            deviceName.includes("Upgrade") ? "bg-orange-500" :
                              "bg-primary"
                      }`} />
                    <span className="text-sm font-bold uppercase tracking-wider">{deviceName}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      ({groupedByDevice[deviceName].length} Programs)
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <table className="w-full text-left text-xs border-t border-border">
                      <thead className="bg-muted/50 text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                        <tr>
                          <th className="p-3 border-r border-border w-56">Program</th>
                          <th className="p-3 border-r border-border w-16 text-center">Burst</th>
                          <th className="p-3 border-r border-border w-16 text-center">PS</th>
                          <th className="p-3 border-r border-border w-16 text-center">Save</th>
                          <th className="p-3 border-r border-border w-12 text-center">Mod</th>
                          <th className="p-3">Properties / Special</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {groupedByDevice[deviceName].map((prog, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 font-bold text-primary border-r border-border">
                              <div className="flex items-center gap-1.5">
                                {prog.name}
                                {prog.wiki && (
                                  <a href={prog.wiki} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100">
                                    <ExternalLinkIcon className="size-2.5" />
                                  </a>
                                )}
                              </div>
                              <div className="text-[11px] text-muted-foreground font-normal mt-0.5">Target: {prog.target}</div>
                            </td>
                            <td className="p-3 text-center border-r border-border font-mono">{prog.burst}</td>
                            <td className="p-3 text-center border-r border-border font-mono">{prog.damage}</td>
                            <td className="p-3 text-center border-r border-border font-mono">BTS</td>
                            <td className="p-3 text-center border-r border-border font-mono">{prog.opponent === '-' ? '' : prog.opponent}</td>
                            <td className="p-3">
                              <div className="text-xs leading-relaxed">
                                {prog.special}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden divide-y divide-border border-t border-border">
                    {groupedByDevice[deviceName].map((prog, i) => (
                      <div key={i} className="p-4 space-y-3 bg-card">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-primary flex items-center gap-1.5">
                            {prog.name}
                            {prog.wiki && (
                              <a href={prog.wiki} target="_blank" rel="noopener noreferrer" className="opacity-50">
                                <ExternalLinkIcon className="size-3" />
                              </a>
                            )}
                          </div>
                          <div className="flex gap-3 text-[10px] font-mono">
                            <div className="flex flex-col items-center">
                              <span className="text-muted-foreground text-[8px] uppercase">Att</span>
                              <span>{prog.attack}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-muted-foreground text-[8px] uppercase">Opp</span>
                              <span>{prog.opponent}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-muted-foreground text-[8px] uppercase">PS</span>
                              <span>{prog.damage}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-muted-foreground text-[8px] uppercase">B</span>
                              <span>{prog.burst}</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2 text-[11px]">
                          <div className="flex gap-2">
                            <span className="text-muted-foreground font-semibold w-16 shrink-0">Skill:</span>
                            <span className="font-medium">{prog.skillType}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-muted-foreground font-semibold w-16 shrink-0">Targets:</span>
                            <span className="font-medium">{prog.target}</span>
                          </div>
                          <div className="pt-1 border-t border-border/50">
                            <p className="leading-relaxed italic text-muted-foreground">{prog.special}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  )
}
