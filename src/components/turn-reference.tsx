import { ExternalLinkIcon, LayersIcon, MoveIcon, RadioIcon, ShieldCheckIcon, SwordIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HackingReference } from "./hacking-reference"

const ACTION_GROUPS = [
  {
    title: "Movement Actions",
    description: "Core movement and positional tools used to advance, reposition, or avoid ARO pressure.",
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
    description: "Primary offensive tools for direct fire, close combat, and special attack declarations.",
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
    description: "Reactive declarations you will reach for most often when the opponent activates nearby units.",
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
    description: "Objective interaction, discovery, hacking access, and supporting technical declarations.",
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
    <div className="space-y-6">
      <section className="rounded-2xl border border-border/70 bg-card/55 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              <LayersIcon className="size-3.5" />
              Table Reference
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Common Skills And Reactive Options</h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Keep the most frequently checked Infinity actions within reach during a round, with direct links to the wiki when you need the full wording.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <HackingReference />
            <Button variant="outline" size="sm" asChild>
              <a href="https://infinitythewiki.com/Main_Page" target="_blank" rel="noopener noreferrer">
                Full Wiki
                <ExternalLinkIcon className="ml-2 size-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        {ACTION_GROUPS.map((group, index) => (
          <section key={group.title} className="space-y-4">
            {index > 0 && <Separator className="opacity-60" />}
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <group.icon className="size-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold tracking-tight">{group.title}</h3>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {group.actions.map((action) => (
                <ActionLinkCard key={action.name} name={action.name} type={action.type} url={action.url} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function ActionLinkCard({ name, type, url }: { name: string; type: string; url: string }) {
  return (
    <Card className="border-border/70 bg-background/70 shadow-none transition-colors hover:border-primary/40 hover:bg-muted/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base font-semibold tracking-tight">{name}</CardTitle>
            <CardDescription>{type}</CardDescription>
          </div>
          <ExternalLinkIcon className="mt-0.5 size-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" size="sm" asChild className="px-0 text-muted-foreground hover:text-primary">
          <a href={url} target="_blank" rel="noopener noreferrer">
            Open wiki entry
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}
