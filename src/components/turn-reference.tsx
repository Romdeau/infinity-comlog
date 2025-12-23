import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ExternalLinkIcon,
  SwordIcon,
  MoveIcon,
  RadioIcon,
  ShieldCheckIcon,
  LayersIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HackingReference } from "./hacking-reference"

const ACTION_GROUPS = [
  {
    title: "Movement Actions",
    icon: MoveIcon,
    actions: [
      { name: "Move", type: "Short Movement", url: "https://infinitythewiki.com/Move" },
      { name: "Cautious Movement", type: "Entire Order", url: "https://infinitythewiki.com/Cautious_Movement" },
      { name: "Climb", type: "Movement", url: "https://infinitythewiki.com/Climb" },
      { name: "Jump", type: "Movement", url: "https://infinitythewiki.com/Jump" },
      { name: "Dodge", type: "Short / ARO", url: "https://infinitythewiki.com/Dodge" },
    ],
  },
  {
    title: "Combat Actions",
    icon: SwordIcon,
    actions: [
      { name: "BS Attack", type: "Short Action", url: "https://infinitythewiki.com/BS_Attack" },
      { name: "CC Attack", type: "Short Action", url: "https://infinitythewiki.com/CC_Attack" },
      { name: "Suppressive Fire", type: "Entire Order", url: "https://infinitythewiki.com/Suppressive_Fire" },
      { name: "Speculative Attack", type: "Entire Order", url: "https://infinitythewiki.com/Speculative_Attack" },
      { name: "Intuitive Attack", type: "Short / Entire", url: "https://infinitythewiki.com/Intuitive_Attack" },
    ],
  },
  {
    title: "AROs",
    icon: ShieldCheckIcon,
    actions: [
      { name: "BS Attack", type: "ARO", url: "https://infinitythewiki.com/BS_Attack" },
      { name: "Dodge", type: "ARO", url: "https://infinitythewiki.com/Dodge" },
      { name: "Reset", type: "ARO", url: "https://infinitythewiki.com/Reset" },
      { name: "Look Out!", type: "ARO", url: "https://infinitythewiki.com/Look_Out!" },
    ],
  },
  {
    title: "Technical Actions",
    icon: RadioIcon,
    actions: [
      { name: "Discover", type: "Short Action", url: "https://infinitythewiki.com/Discover" },
      { name: "Reset", type: "Short / ARO", url: "https://infinitythewiki.com/Reset" },
      { name: "Hacking Program", type: "Varies", url: "https://infinitythewiki.com/Hacking" },
      { name: "Interact", type: "Short Action", url: "https://infinitythewiki.com/Interact" },
      { name: "Place Deployable", type: "Short Action", url: "https://infinitythewiki.com/Place_Deployable" },
      { name: "Idle", type: "Short / ARO", url: "https://infinitythewiki.com/Idle" },
      { name: "Reload", type: "Short Action", url: "https://infinitythewiki.com/Reload" },
      { name: "Request Speedball", type: "Short Action", url: "https://infinitythewiki.com/Request_Speedball" },
    ],
  },
]

export function TurnReference() {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-lg p-2">
            <LayersIcon className="text-primary size-5" />
          </div>
          <div>
            <CardTitle>Order Reference</CardTitle>
            <CardDescription>Commonly used skills and AROs</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6">
        {ACTION_GROUPS.map((group) => (
          <div key={group.title} className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-wider justify-between">
              <div className="flex items-center gap-2">
                <group.icon className="size-4" />
                {group.title}
              </div>
              {group.title === "Technical Actions" && <HackingReference />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {group.actions.map((action) => (
                <a
                  key={action.name}
                  href={action.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md border bg-muted/20 p-2.5 transition-all hover:bg-muted hover:border-primary/50 group/link"
                >
                  <div className="grid gap-0.5">
                    <span className="text-sm font-medium leading-none group-hover/link:text-primary transition-colors">
                      {action.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground uppercase">
                      {action.type}
                    </span>
                  </div>
                  <ExternalLinkIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover/link:opacity-100" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter className="bg-muted/30 border-t flex items-center justify-center p-3">
        <Button variant="ghost" size="sm" asChild className="w-full text-muted-foreground hover:text-primary">
          <a href="https://infinitythewiki.com/Main_Page" target="_blank" rel="noopener noreferrer">
            View Full Wiki <ExternalLinkIcon className="ml-2 size-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
