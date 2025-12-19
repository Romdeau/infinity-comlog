import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ExternalLinkIcon, RadioIcon, ZapIcon } from "lucide-react"

interface HackingProgram {
  name: string
  type: "Attack" | "Support" | "CLAW-1" | "CLAW-2" | "CLAW-3" | "Shield"
  target: string
  burst: string
  ammo: string
  damage: string
  save: string
  opponent: string
  special: string
  wiki?: string
}

const HACKING_PROGRAMS: HackingProgram[] = [
  // CLAW-1
  {
    name: "Carbonite",
    type: "CLAW-1",
    target: "TAG, HI, REM, Hacker",
    burst: "2",
    ammo: "Double Trouble",
    damage: "13",
    save: "BTS",
    opponent: "-",
    special: "Immobilized-B state.",
    wiki: "https://infinitythewiki.com/Carbonite"
  },
  {
    name: "Spotlight",
    type: "CLAW-1",
    target: "Any",
    burst: "1",
    ammo: "-",
    damage: "-",
    save: "BTS",
    opponent: "-",
    special: "Targeted state.",
    wiki: "https://infinitythewiki.com/Spotlight"
  },
  // CLAW-2
  {
    name: "Basilisk",
    type: "CLAW-2",
    target: "TAG, HI, REM, Hacker",
    burst: "2",
    ammo: "-",
    damage: "13",
    save: "BTS",
    opponent: "-",
    special: "Immobilized-A state.",
    wiki: "https://infinitythewiki.com/Basilisk"
  },
  {
    name: "Oblivion",
    type: "CLAW-2",
    target: "TAG, HI, REM, Hacker",
    burst: "2",
    ammo: "-",
    damage: "16",
    save: "BTS",
    opponent: "-",
    special: "Isolated state.",
    wiki: "https://infinitythewiki.com/Oblivion"
  },
  // CLAW-3
  {
    name: "Total Control",
    type: "CLAW-3",
    target: "TAG, REM",
    burst: "1",
    ammo: "-",
    damage: "15",
    save: "BTS",
    opponent: "-6",
    special: "Possessed state. Only vs TAG/REM.",
    wiki: "https://infinitythewiki.com/Total_Control"
  },
  // SWORD
  {
    name: "Sword-1 (Trinity)",
    type: "Attack",
    target: "Hacker",
    burst: "3",
    ammo: "Shock",
    damage: "13",
    save: "BTS",
    opponent: "-3",
    special: "-",
    wiki: "https://infinitythewiki.com/Trinity"
  },
  // SHIELD
  {
    name: "Fairy Dust",
    type: "Shield",
    target: "Active Turn",
    burst: "-",
    ammo: "-",
    damage: "-",
    save: "-",
    opponent: "-",
    special: "Entire Order. Hacking Area. Target: HI/REM/TAG in Fireteam. Effect: Firewall (-3 Mods).",
    wiki: "https://infinitythewiki.com/Fairy_Dust"
  },
  {
    name: "Controlled Jump",
    type: "Support",
    target: "Global",
    burst: "-",
    ammo: "-",
    damage: "-",
    save: "-",
    opponent: "-",
    special: "+3 PH to allied Combat Jump. -3 PH to enemy Combat Jump.",
    wiki: "https://infinitythewiki.com/Controlled_Jump"
  },
  {
    name: "Assist Fire",
    type: "Support",
    target: "REM in Zone of Control",
    burst: "-",
    ammo: "-",
    damage: "-",
    save: "-",
    opponent: "-",
    special: "Supportware. Target gains Marksmanship.",
    wiki: "https://infinitythewiki.com/Assist_Fire"
  },
  {
    name: "Enhanced Reaction",
    type: "Support",
    target: "REM in Zone of Control",
    burst: "-",
    ammo: "-",
    damage: "-",
    save: "-",
    opponent: "-",
    special: "Supportware. Target gains Burst +1 in ARO.",
    wiki: "https://infinitythewiki.com/Enhanced_Reaction"
  }
]

export function HackingReference() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1.5 px-2">
          <ZapIcon className="size-3" />
          Programs
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto w-full md:w-[90vw]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RadioIcon className="size-5 text-primary" />
            Hacking Programs Reference
          </AlertDialogTitle>
          <AlertDialogDescription>
            Quick reference for common N4 hacking programs/supportware.
            <a href="https://infinitythewiki.com/Hacking_Programs" target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center text-primary hover:underline">
              Wiki <ExternalLinkIcon className="ml-1 size-3" />
            </a>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 mt-2 mb-4">
          <div className="rounded-md border border-border overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-2 border-r border-border">Program</th>
                  <th className="p-2 border-r border-border w-24">Type</th>
                  <th className="p-2 border-r border-border w-16 text-center">Burst</th>
                  <th className="p-2 border-r border-border w-16 text-center">Dmg</th>
                  <th className="p-2 border-r border-border w-16 text-center">Save</th>
                  <th className="p-2 border-r border-border w-12 text-center">Mod</th>
                  <th className="p-2">Properties / Special</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {HACKING_PROGRAMS.map((prog, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="p-2 font-bold text-primary border-r border-border">
                      <div className="flex items-center gap-1.5">
                        {prog.name}
                        {prog.wiki && (
                          <a href={prog.wiki} target="_blank" rel="noopener noreferrer" className="opacity-50 hover:opacity-100">
                            <ExternalLinkIcon className="size-2.5" />
                          </a>
                        )}
                      </div>
                      <div className="text-[10px] text-muted-foreground font-normal mt-0.5">Target: {prog.target}</div>
                    </td>
                    <td className="p-2 border-r border-border">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${prog.type.startsWith('CLAW') ? 'bg-red-500/10 text-red-500' :
                          prog.type === 'Shield' ? 'bg-blue-500/10 text-blue-500' :
                            prog.type === 'Support' ? 'bg-green-500/10 text-green-500' :
                              'bg-orange-500/10 text-orange-500'
                        }`}>
                        {prog.type}
                      </span>
                    </td>
                    <td className="p-2 text-center border-r border-border font-mono">{prog.burst}</td>
                    <td className="p-2 text-center border-r border-border font-mono">{prog.damage}</td>
                    <td className="p-2 text-center border-r border-border font-mono">{prog.save === '-' ? '' : prog.save}</td>
                    <td className="p-2 text-center border-r border-border font-mono">{prog.opponent === '-' ? '' : prog.opponent}</td>
                    <td className="p-2">
                      <div className="text-[11px] leading-tight max-w-[300px]">
                        {prog.ammo !== '-' && <span className="font-semibold text-foreground/80 mr-1">{prog.ammo},</span>}
                        {prog.special}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
