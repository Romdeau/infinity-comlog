import * as React from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { GameStep, GameGroup } from "@/components/game-flow-components"

export function ComponentExample() {
  return (
    <ExampleWrapper>
      <InfinityGameFlow />
      <TurnReference />
    </ExampleWrapper>
  )
}

function InfinityGameFlow() {
  const [gameStep, setGameStep] = React.useState({
    scenario: "",
    classifiedsCount: 1,
    scenarioPicked: false,
    listPicked: false,
    classifiedsDrawn: false,
    initiationDoneOverride: false,
    setupDoneOverride: false,
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

  // Derived state for automatic checkbox logic (Child -> Parent propagation)
  const isInitiativeComplete = gameStep.initiationSubSteps.rollOff &&
    gameStep.initiationSubSteps.deployment &&
    gameStep.initiationSubSteps.commandTokens

  const isSetupComplete = !!gameStep.scenario &&
    gameStep.scenarioPicked &&
    gameStep.listPicked &&
    gameStep.classifiedsDrawn &&
    isInitiativeComplete

  const toggleStep = (key: string, subKey?: string) => {
    setGameStep(prev => {
      const next = { ...prev }

      if (key === 'setup') {
        const val = !prev.setupDoneOverride && !isSetupComplete
        next.setupDoneOverride = val
        next.scenarioPicked = val
        next.listPicked = val
        next.classifiedsDrawn = val
        next.initiationDoneOverride = val
        next.initiationSubSteps = {
          rollOff: val,
          deployment: val,
          commandTokens: val
        }
      } else if (key === 'initiation') {
        const val = !prev.initiationDoneOverride && !isInitiativeComplete
        next.initiationDoneOverride = val
        next.initiationSubSteps = {
          rollOff: val,
          deployment: val,
          commandTokens: val
        }
        // If unchecking initiation, we must also uncheck setup override
        if (!val) next.setupDoneOverride = false
      } else if (subKey) {
        // Individual item update
        if (key === 'initiationSubSteps') {
          next.initiationSubSteps = {
            ...prev.initiationSubSteps,
            [subKey]: !(prev.initiationSubSteps as any)[subKey]
          }
          if (!(next.initiationSubSteps as any)[subKey]) next.initiationDoneOverride = false
        } else if (key === 'turns') {
          next.turns = {
            ...prev.turns,
            [subKey]: !(prev.turns as any)[subKey]
          }
        }
      } else {
        const stateKey = key as keyof typeof prev
        const newVal = !prev[stateKey]
          ; (next as any)[stateKey] = newVal

        // If any setup item is unchecked, setup override must be false
        if (!newVal && ['scenarioPicked', 'listPicked', 'classifiedsDrawn', 'initiationDoneOverride'].includes(key)) {
          next.setupDoneOverride = false
        }
      }

      return next
    })
  }

  const completedCount = [
    (gameStep.setupDoneOverride || isSetupComplete),
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
          <GameGroup
            label="Game Setup"
            value="setup"
            info="Initial phase to prepare the battlefield and armies."
            checked={gameStep.setupDoneOverride || isSetupComplete}
            onCheckedChange={() => toggleStep('setup')}
            className="px-4"
          >
            {/* Pick Scenario */}
            <div className="space-y-1">
              <GameStep
                label="Pick Scenario"
                info="Select the mission for the match. Usually decided by the TO or rolled for."
                checked={gameStep.scenarioPicked}
                onCheckedChange={() => toggleStep('scenarioPicked')}
                size="sm"
              />
              <div className="pl-7 pr-4">
                <Select
                  value={gameStep.scenario}
                  onValueChange={(val) => {
                    setGameStep(prev => ({ ...prev, scenario: val, scenarioPicked: true }))
                  }}
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
            </div>

            <GameStep
              label="Choose List"
              info="In tournament games, you bring two army lists and choose one after seeing the scenario and opponent's faction."
              checked={gameStep.listPicked}
              onCheckedChange={() => toggleStep('listPicked')}
              size="sm"
            />

            <div className="flex items-center justify-between pr-4">
              <GameStep
                label="Draw Classifieds"
                info="Secondary objectives that provide additional Victory Points."
                checked={gameStep.classifiedsDrawn}
                onCheckedChange={() => toggleStep('classifiedsDrawn')}
                size="sm"
              />
              <Input
                type="number"
                min={0}
                className="w-12 h-7 text-xs px-1 text-center"
                value={gameStep.classifiedsCount}
                onChange={(e) => setGameStep(prev => ({ ...prev, classifiedsCount: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <GameGroup
              label="Initiative & Deployment"
              value="initiative"
              defaultOpen
              info="Phase where players determine turn order and deploy their models."
              checked={gameStep.initiationDoneOverride || isInitiativeComplete}
              onCheckedChange={() => toggleStep('initiation')}
            >
              <GameStep
                label="Face-to-Face Roll Off"
                checked={gameStep.initiationSubSteps.rollOff}
                onCheckedChange={() => toggleStep('initiationSubSteps', 'rollOff')}
                size="sm"
              />
              <GameStep
                label="Army Deployment"
                checked={gameStep.initiationSubSteps.deployment}
                onCheckedChange={() => toggleStep('initiationSubSteps', 'deployment')}
                size="sm"
              />
              <GameStep
                label="Strategic Cmd Tokens"
                checked={gameStep.initiationSubSteps.commandTokens}
                onCheckedChange={() => toggleStep('initiationSubSteps', 'commandTokens')}
                size="sm"
              />
            </GameGroup>
          </GameGroup>

          <div className="px-4 pb-4 mt-4 space-y-3">
            <GameStep
              label="Turn 1"
              info="First round of tactical actions and combat."
              checked={gameStep.turns.turn1}
              onCheckedChange={() => toggleStep('turns', 'turn1')}
            />
            <GameStep
              label="Turn 2"
              info="Mid-game maneuvering and objective capturing."
              checked={gameStep.turns.turn2}
              onCheckedChange={() => toggleStep('turns', 'turn2')}
            />
            <GameStep
              label="Turn 3"
              info="Final round to secure victory points."
              checked={gameStep.turns.turn3}
              onCheckedChange={() => toggleStep('turns', 'turn3')}
            />
            <GameStep
              label="Finalising Scoring"
              info="Tabulate all Victory Points from the mission and classifieds to determine the winner."
              checked={gameStep.scoring}
              onCheckedChange={() => toggleStep('scoring')}
            />
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
