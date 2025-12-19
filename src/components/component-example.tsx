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
  LayersIcon,
  InfoIcon
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <InfinityGameFlow />
      <TurnReference />
    </ExampleWrapper>
  )
}

function InfoTip({ content }: { content: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
          <InfoIcon className="size-3.5" />
          <span className="sr-only">Help</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="text-xs">
        {content}
      </PopoverContent>
    </Popover>
  )
}

function InfinityGameFlow() {
  const [gameStep, setGameStep] = React.useState({
    scenario: "",
    classifiedsCount: 1,
    setupDone: false,
    listPicked: false,
    classifiedsDrawn: false,
    initiationDone: false,
    initiationSubSteps: {
      rollOff: false,
      deployment: false,
      commandTokens: false,
    },
    turns: {
      turn1: false,
      turn2: false,
      turn3: false,
    },
    scoring: false,
  })

  const toggleState = (key: string, subKey?: string) => {
    if (subKey) {
      setGameStep(prev => ({
        ...prev,
        [key]: {
          ...prev[key as keyof typeof prev] as object,
          [subKey]: !(prev[key as keyof typeof prev] as any)[subKey]
        }
      }))
    } else {
      setGameStep(prev => ({
        ...prev,
        [key]: !prev[key as keyof typeof prev]
      }))
    }
  }

  const isSetupComplete = !!gameStep.scenario &&
    gameStep.listPicked &&
    gameStep.classifiedsDrawn &&
    gameStep.initiationSubSteps.rollOff &&
    gameStep.initiationSubSteps.deployment &&
    gameStep.initiationSubSteps.commandTokens

  const completedCount = [
    isSetupComplete,
    gameStep.turns.turn1,
    gameStep.turns.turn2,
    gameStep.turns.turn3,
    gameStep.scoring
  ].filter(Boolean).length

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
        <CardContent className="p-0">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="setup" className="border-none px-4">
              <div className="flex items-center gap-3 py-3">
                <Checkbox
                  checked={gameStep.setupDone || isSetupComplete}
                  onCheckedChange={() => toggleState('setupDone')}
                />
                <AccordionTrigger className="flex-1 py-0 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-semibold transition-all",
                      (gameStep.setupDone || isSetupComplete) && "text-muted-foreground line-through opacity-70"
                    )}>
                      Game Setup
                    </span>
                    <InfoTip content="Initial phase to prepare the battlefield and armies." />
                  </div>
                </AccordionTrigger>
              </div>
              <AccordionContent className="pl-7 pr-0 space-y-4 pt-1 pb-6">
                {/* Pick Scenario */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase text-muted-foreground tracking-wider">Pick Scenario</span>
                    <InfoTip content="Select the mission for the match. Usually decided by the TO or rolled for." />
                  </div>
                  <Select
                    value={gameStep.scenario}
                    onValueChange={(val) => setGameStep(prev => ({ ...prev, scenario: val }))}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select a scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="axial">Akial Interference</SelectItem>
                      <SelectItem value="bpong">B-Pong</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Choose List */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <Checkbox
                    checked={gameStep.listPicked}
                    onCheckedChange={() => toggleState('listPicked')}
                  />
                  <div className="flex items-center gap-1">
                    <span className={cn(
                      "text-xs font-medium",
                      gameStep.listPicked && "text-muted-foreground line-through opacity-70"
                    )}>
                      Choose List
                    </span>
                    <InfoTip content="In tournament games, you bring two army lists and choose one after seeing the scenario and opponent's faction." />
                  </div>
                </label>

                {/* Draw Classifieds */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between pr-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <Checkbox
                        checked={gameStep.classifiedsDrawn}
                        onCheckedChange={() => toggleState('classifiedsDrawn')}
                      />
                      <div className="flex items-center gap-1">
                        <span className={cn(
                          "text-xs font-medium",
                          gameStep.classifiedsDrawn && "text-muted-foreground line-through opacity-70"
                        )}>
                          Draw Classifieds
                        </span>
                        <InfoTip content="Secondary objectives that provide additional Victory Points. The number depends on the scenario." />
                      </div>
                    </label>
                    <Input
                      type="number"
                      min={0}
                      className="w-12 h-7 text-xs px-1 text-center"
                      value={gameStep.classifiedsCount}
                      onChange={(e) => setGameStep(prev => ({ ...prev, classifiedsCount: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                {/* Initiative & Deployment Sub-Group */}
                <div className="space-y-3 pt-2 border-l-2 ml-1.5 pl-4 border-muted">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={gameStep.initiationDone || (gameStep.initiationSubSteps.rollOff && gameStep.initiationSubSteps.deployment && gameStep.initiationSubSteps.commandTokens)}
                      onCheckedChange={() => toggleState('initiationDone')}
                    />
                    <div className="flex items-center gap-1">
                      <span className={cn(
                        "text-xs font-semibold text-muted-foreground/80",
                        (gameStep.initiationDone || (gameStep.initiationSubSteps.rollOff && gameStep.initiationSubSteps.deployment && gameStep.initiationSubSteps.commandTokens)) && "line-through opacity-70"
                      )}>
                        Initiative & Deployment
                      </span>
                      <InfoTip content="Phase where players determine turn order and deploy their models." />
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={gameStep.initiationSubSteps.rollOff}
                      onCheckedChange={() => toggleState('initiationSubSteps', 'rollOff')}
                    />
                    <span className={cn("text-xs transition-all", gameStep.initiationSubSteps.rollOff && "text-muted-foreground line-through opacity-70")}>
                      Face-to-Face Roll Off
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={gameStep.initiationSubSteps.deployment}
                      onCheckedChange={() => toggleState('initiationSubSteps', 'deployment')}
                    />
                    <span className={cn("text-xs transition-all", gameStep.initiationSubSteps.deployment && "text-muted-foreground line-through opacity-70")}>
                      Army Deployment
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <Checkbox
                      checked={gameStep.initiationSubSteps.commandTokens}
                      onCheckedChange={() => toggleState('initiationSubSteps', 'commandTokens')}
                    />
                    <span className={cn("text-xs transition-all", gameStep.initiationSubSteps.commandTokens && "text-muted-foreground line-through opacity-70")}>
                      Strategic Cmd Tokens
                    </span>
                  </label>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="px-4 pb-4 space-y-3">
            <label className="group flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer">
              <Checkbox
                checked={gameStep.turns.turn1}
                onCheckedChange={() => toggleState('turns', 'turn1')}
              />
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-sm font-medium leading-none transition-all",
                  gameStep.turns.turn1 && "text-muted-foreground line-through opacity-70"
                )}>
                  Turn 1
                </span>
                <InfoTip content="First round of tactical actions and combat." />
              </div>
            </label>
            <label className="group flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer">
              <Checkbox
                checked={gameStep.turns.turn2}
                onCheckedChange={() => toggleState('turns', 'turn2')}
              />
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-sm font-medium leading-none transition-all",
                  gameStep.turns.turn2 && "text-muted-foreground line-through opacity-70"
                )}>
                  Turn 2
                </span>
                <InfoTip content="Mid-game maneuvering and objective capturing." />
              </div>
            </label>
            <label className="group flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer">
              <Checkbox
                checked={gameStep.turns.turn3}
                onCheckedChange={() => toggleState('turns', 'turn3')}
              />
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-sm font-medium leading-none transition-all",
                  gameStep.turns.turn3 && "text-muted-foreground line-through opacity-70"
                )}>
                  Turn 3
                </span>
                <InfoTip content="Final round to secure victory points." />
              </div>
            </label>
            <label className="group flex items-center space-x-3 rounded-lg border p-3 transition-colors hover:bg-muted/50 cursor-pointer">
              <Checkbox
                checked={gameStep.scoring}
                onCheckedChange={() => toggleState('scoring')}
              />
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-sm font-medium leading-none transition-all",
                  gameStep.scoring && "text-muted-foreground line-through opacity-70"
                )}>
                  Finalising Scoring
                </span>
                <InfoTip content="Tabulate all Victory Points from the mission and classifieds to determine the winner." />
              </div>
            </label>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 border-t flex items-center justify-between text-xs text-muted-foreground p-4">
          <span>{completedCount} of 5 major phases completed</span>
          {completedCount === 5 && (
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
