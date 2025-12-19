import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Example,
  ExampleWrapper,
} from "@/components/example"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ExternalLinkIcon,
  SwordIcon,
  MoveIcon,
  RadioIcon,
  ShieldCheckIcon,
  ZapIcon,
  CheckCircle2Icon,
  LayersIcon
} from "lucide-react"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <InfinityGameFlow />
      <TurnReference />
    </ExampleWrapper>
  )
}

function InfinityGameFlow() {
  const [steps, setSteps] = React.useState([
    { id: "scenario", label: "Scenario Choice", checked: false },
    { id: "army", label: "Army Choice", checked: false },
    { id: "classifieds", label: "Picking Classifieds", checked: false },
    { id: "initiative", label: "Rolling for Initiative/Deployment", checked: false },
    { id: "turn1", label: "Turn 1", checked: false },
    { id: "turn2", label: "Turn 2", checked: false },
    { id: "turn3", label: "Turn 3", checked: false },
    { id: "scoring", label: "Finalising Scoring", checked: false },
  ])

  const toggleStep = (id: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, checked: !step.checked } : step
      )
    )
  }

  return (
    <Example title="Infinity Game Flow" className="items-start justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <ZapIcon className="text-primary size-5" />
            </div>
            <div>
              <CardTitle>N5 Game Sequence</CardTitle>
              <CardDescription>Track your progress during the match</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className="group flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <Checkbox
                id={step.id}
                checked={step.checked}
                onCheckedChange={() => toggleStep(step.id)}
              />
              <label
                htmlFor={step.id}
                className={cn(
                  "text-sm font-medium leading-none transition-all cursor-pointer",
                  step.checked && "text-muted-foreground line-through opacity-70"
                )}
              >
                {step.label}
              </label>
            </div>
          ))}
        </CardContent>
        <CardFooter className="bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground p-4">
          <span>{steps.filter(s => s.checked).length} of {steps.length} steps completed</span>
          {steps.every(s => s.checked) && (
            <div className="flex items-center gap-1 text-primary font-medium">
              <CheckCircle2Icon className="size-3" />
              Game Finished
            </div>
          )}
        </CardFooter>
      </Card>
    </Example>
  )
}

const ACTION_GROUPS = [
  {
    title: "Movement Actions",
    icon: MoveIcon,
    actions: [
      { name: "Move", type: "Short Movement", url: "https://infinitythewiki.com/Move" },
      { name: "Cautious Movement", type: "Entire Order", url: "https://infinitythewiki.com/Cautious_Movement" },
      { name: "Climb", type: "Movement", url: "https://infinitythewiki.com/Climb" },
      { name: "Jump", type: "Movement", url: "https://infinitythewiki.com/Jump" },
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
      { name: "Reset", type: "Short Action", url: "https://infinitythewiki.com/Reset" },
      { name: "Hacking Program", type: "Varies", url: "https://infinitythewiki.com/Hacking" },
      { name: "Interact", type: "Short Action", url: "https://infinitythewiki.com/Interact" },
    ],
  },
]

function TurnReference() {
  return (
    <Example title="Turn Reference" className="items-start justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <LayersIcon className="text-primary size-5" />
            </div>
            <div>
              <CardTitle>Skill Quick Reference</CardTitle>
              <CardDescription>Commonly used skills and AROs</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6">
          {ACTION_GROUPS.map((group) => (
            <div key={group.title} className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary/80 uppercase tracking-wider">
                <group.icon className="size-4" />
                {group.title}
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
    </Example>
  )
}
