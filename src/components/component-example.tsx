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
  const initialPlayerTurn = () => ({
    doneOverride: false,
    tactical: {
      doneOverride: false,
      tokens: false,
      retreat: false,
      lol: false,
      count: false,
    },
    impetuous: false,
    orders: false,
    states: false,
    end: false,
  })

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
      turn1: { doneOverride: false, p1: initialPlayerTurn(), p2: initialPlayerTurn() },
      turn2: { doneOverride: false, p1: initialPlayerTurn(), p2: initialPlayerTurn() },
      turn3: { doneOverride: false, p1: initialPlayerTurn(), p2: initialPlayerTurn() },
    },
    scoring: {
      doneOverride: false,
      player: { op: 0, vp: 0 },
      opponent: { op: 0, vp: 0 },
    },
  })

  // TP Calculation Logic
  const calculateTP = (op: number, rivalOp: number) => {
    let tp = 0
    if (op > rivalOp) tp = 4
    else if (op === rivalOp) tp = 2
    else {
      tp = 0
      if (rivalOp - op < 2) tp += 1 // Bonus for close loss
    }
    if (op >= 5) tp += 1 // Bonus for 5+ OP
    return tp
  }

  // Derived state for automatic checkbox logic (Child -> Parent propagation)
  const isTacticalComplete = (t: any) => t.tokens && t.retreat && t.lol && t.count
  const isPlayerComplete = (p: any) =>
    (p.doneOverride || (isTacticalComplete(p.tactical) && p.impetuous && p.orders && p.states && p.end))
  const isTurnComplete = (t: any) =>
    (t.doneOverride || (isPlayerComplete(t.p1) && isPlayerComplete(t.p2)))

  const isInitiativeComplete = gameStep.initiationSubSteps.rollOff &&
    gameStep.initiationSubSteps.deployment &&
    gameStep.initiationSubSteps.commandTokens

  const isSetupComplete = !!gameStep.scenario &&
    gameStep.scenarioPicked &&
    gameStep.listPicked &&
    gameStep.classifiedsDrawn &&
    isInitiativeComplete

  const isScoringComplete = gameStep.scoring.player.op > 0 || gameStep.scoring.opponent.op > 0

  const toggleStep = (key: string, subKey?: string, tertiaryKey?: string) => {
    setGameStep(prev => {
      const next = JSON.parse(JSON.stringify(prev))

      if (key === 'setup') {
        const val = !prev.setupDoneOverride && !isSetupComplete
        next.setupDoneOverride = val
        next.scenarioPicked = val
        next.listPicked = val
        next.classifiedsDrawn = val
        next.initiationDoneOverride = val
        next.initiationSubSteps = { rollOff: val, deployment: val, commandTokens: val }
        if (!val) next.scenario = ""
      } else if (key === 'initiation') {
        const val = !prev.initiationDoneOverride && !isInitiativeComplete
        next.initiationDoneOverride = val
        next.initiationSubSteps = { rollOff: val, deployment: val, commandTokens: val }
        if (!val) next.setupDoneOverride = false
      } else if (key.startsWith('turn')) {
        const turnKey = key as 'turn1' | 'turn2' | 'turn3'
        const turn = next.turns[turnKey]

        if (subKey === 'p1' || subKey === 'p2') {
          const player = turn[subKey]
          if (tertiaryKey === 'tactical') {
            const val = !player.tactical.doneOverride && !isTacticalComplete(player.tactical)
            player.tactical.doneOverride = val
            player.tactical.tokens = val
            player.tactical.retreat = val
            player.tactical.lol = val
            player.tactical.count = val
            if (!val) {
              player.doneOverride = false
              turn.doneOverride = false
            }
          } else if (tertiaryKey) {
            // Tactical sub-steps or player phases
            if (['tokens', 'retreat', 'lol', 'count'].includes(tertiaryKey)) {
              player.tactical[tertiaryKey as 'tokens' | 'retreat' | 'lol' | 'count'] = !player.tactical[tertiaryKey as 'tokens' | 'retreat' | 'lol' | 'count']
              if (!player.tactical[tertiaryKey as 'tokens' | 'retreat' | 'lol' | 'count']) {
                player.tactical.doneOverride = false
                player.doneOverride = false
                turn.doneOverride = false
              }
            } else {
              player[tertiaryKey as 'impetuous' | 'orders' | 'states' | 'end'] = !player[tertiaryKey as 'impetuous' | 'orders' | 'states' | 'end']
              if (!player[tertiaryKey as 'impetuous' | 'orders' | 'states' | 'end']) {
                player.doneOverride = false
                turn.doneOverride = false
              }
            }
          } else {
            // Toggle whole player turn
            const val = !player.doneOverride && !isPlayerComplete(player)
            player.doneOverride = val
            player.impetuous = val
            player.orders = val
            player.states = val
            player.end = val
            player.tactical.doneOverride = val
            player.tactical.tokens = val
            player.tactical.retreat = val
            player.tactical.lol = val
            player.tactical.count = val
            if (!val) turn.doneOverride = false
          }
        } else {
          // Toggle whole turn
          const val = !turn.doneOverride && !isTurnComplete(turn)
          turn.doneOverride = val
          const players = ['p1', 'p2'] as const
          players.forEach(p => {
            turn[p].doneOverride = val
            turn[p].impetuous = val
            turn[p].orders = val
            turn[p].states = val
            turn[p].end = val
            turn[p].tactical.doneOverride = val
            turn[p].tactical.tokens = val
            turn[p].tactical.retreat = val
            turn[p].tactical.lol = val
            turn[p].tactical.count = val
          })
        }
      } else if (key === 'scoring') {
        const val = !prev.scoring.doneOverride && !isScoringComplete
        next.scoring.doneOverride = val
        if (!val) {
          next.scoring.player = { op: 0, vp: 0 }
          next.scoring.opponent = { op: 0, vp: 0 }
        }
      } else {
        const stateKey = key as keyof typeof prev
        const newVal = !(prev as any)[stateKey]
          ; (next as any)[stateKey] = newVal
        if (key === 'scenarioPicked' && !newVal) next.scenario = ""
        if (!newVal && ['scenarioPicked', 'listPicked', 'classifiedsDrawn', 'initiationDoneOverride'].includes(key)) {
          next.setupDoneOverride = false
        }
      }

      return next
    })
  }

  const completedCount = [
    (gameStep.setupDoneOverride || isSetupComplete),
    isTurnComplete(gameStep.turns.turn1),
    isTurnComplete(gameStep.turns.turn2),
    isTurnComplete(gameStep.turns.turn3),
    (gameStep.scoring.doneOverride || isScoringComplete)
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
              size="sm"
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
            {(['turn1', 'turn2', 'turn3'] as const).map((turnKey, idx) => (
              <GameGroup
                key={turnKey}
                label={`Turn ${idx + 1}`}
                value={turnKey}
                info={`Round ${idx + 1} of tactical actions and combat.`}
                checked={isTurnComplete(gameStep.turns[turnKey])}
                onCheckedChange={() => toggleStep(turnKey)}
              >
                {(['p1', 'p2'] as const).map((pKey) => (
                  <GameGroup
                    key={pKey}
                    label={pKey === 'p1' ? "Player 1 Turn" : "Player 2 Turn"}
                    value={`${turnKey}-${pKey}`}
                    checked={isPlayerComplete(gameStep.turns[turnKey][pKey])}
                    onCheckedChange={() => toggleStep(turnKey, pKey)}
                    size="sm"
                  >
                    <GameGroup
                      label="Start of the Turn: Tactical Phase"
                      value={`${turnKey}-${pKey}-tactical`}
                      checked={isTacticalComplete(gameStep.turns[turnKey][pKey].tactical)}
                      onCheckedChange={() => toggleStep(turnKey, pKey, 'tactical')}
                      size="sm"
                    >
                      <GameStep
                        label="Executive Use of Command Tokens"
                        checked={gameStep.turns[turnKey][pKey].tactical.tokens}
                        onCheckedChange={() => toggleStep(turnKey, pKey, 'tokens')}
                        size="sm"
                      />
                      <GameStep
                        label="Retreat! Check"
                        checked={gameStep.turns[turnKey][pKey].tactical.retreat}
                        onCheckedChange={() => toggleStep(turnKey, pKey, 'retreat')}
                        size="sm"
                      />
                      <GameStep
                        label="Loss of Lieutenant check"
                        checked={gameStep.turns[turnKey][pKey].tactical.lol}
                        onCheckedChange={() => toggleStep(turnKey, pKey, 'lol')}
                        size="sm"
                      />
                      <GameStep
                        label="Order count"
                        checked={gameStep.turns[turnKey][pKey].tactical.count}
                        onCheckedChange={() => toggleStep(turnKey, pKey, 'count')}
                        size="sm"
                      />
                    </GameGroup>

                    <GameStep
                      label="Impetuous Phase"
                      checked={gameStep.turns[turnKey][pKey].impetuous}
                      onCheckedChange={() => toggleStep(turnKey, pKey, 'impetuous')}
                      size="sm"
                    />
                    <GameStep
                      label="Orders Phase"
                      checked={gameStep.turns[turnKey][pKey].orders}
                      onCheckedChange={() => toggleStep(turnKey, pKey, 'orders')}
                      size="sm"
                    />
                    <GameStep
                      label="States Phase"
                      checked={gameStep.turns[turnKey][pKey].states}
                      onCheckedChange={() => toggleStep(turnKey, pKey, 'states')}
                      size="sm"
                    />
                    <GameStep
                      label="End of the Turn"
                      checked={gameStep.turns[turnKey][pKey].end}
                      onCheckedChange={() => toggleStep(turnKey, pKey, 'end')}
                      size="sm"
                    />
                  </GameGroup>
                ))}
              </GameGroup>
            ))}

            <GameGroup
              label="Finalising Scoring"
              value="scoring"
              info="Tabulate tournament points based on objective points and victory points."
              checked={gameStep.scoring.doneOverride || isScoringComplete}
              onCheckedChange={() => toggleStep('scoring')}
            >
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-4 gap-2 text-[10px] uppercase font-bold text-muted-foreground px-1">
                  <div></div>
                  <div className="text-center">TP</div>
                  <div className="text-center">OP</div>
                  <div className="text-center">VP</div>
                </div>

                {/* Player Row */}
                <div className="grid grid-cols-4 gap-2 items-center">
                  <div className="text-[11px] font-semibold">Player</div>
                  <div className="bg-primary/10 rounded-md border border-primary/20 flex items-center justify-center h-8 text-sm font-bold text-primary">
                    {calculateTP(gameStep.scoring.player.op, gameStep.scoring.opponent.op)}
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    className="h-8 text-center text-xs px-1 bg-muted/50 focus:bg-background"
                    value={gameStep.scoring.player.op}
                    onChange={(e) => setGameStep(prev => ({
                      ...prev,
                      scoring: { ...prev.scoring, player: { ...prev.scoring.player, op: parseInt(e.target.value) || 0 } }
                    }))}
                  />
                  <Input
                    type="number"
                    min={0}
                    max={300}
                    className="h-8 text-center text-xs px-1 bg-muted/50 focus:bg-background"
                    value={gameStep.scoring.player.vp}
                    onChange={(e) => setGameStep(prev => ({
                      ...prev,
                      scoring: { ...prev.scoring, player: { ...prev.scoring.player, vp: parseInt(e.target.value) || 0 } }
                    }))}
                  />
                </div>

                {/* Opponent Row */}
                <div className="grid grid-cols-4 gap-2 items-center">
                  <div className="text-[11px] font-semibold text-muted-foreground">Opponent</div>
                  <div className="bg-muted/50 rounded-md border border-border flex items-center justify-center h-8 text-sm font-bold text-muted-foreground">
                    {calculateTP(gameStep.scoring.opponent.op, gameStep.scoring.player.op)}
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    className="h-8 text-center text-xs px-1 bg-muted/50 focus:bg-background"
                    value={gameStep.scoring.opponent.op}
                    onChange={(e) => setGameStep(prev => ({
                      ...prev,
                      scoring: { ...prev.scoring, opponent: { ...prev.scoring.opponent, op: parseInt(e.target.value) || 0 } }
                    }))}
                  />
                  <Input
                    type="number"
                    min={0}
                    max={300}
                    className="h-8 text-center text-xs px-1 bg-muted/50 focus:bg-background"
                    value={gameStep.scoring.opponent.vp}
                    onChange={(e) => setGameStep(prev => ({
                      ...prev,
                      scoring: { ...prev.scoring, opponent: { ...prev.scoring.opponent, vp: parseInt(e.target.value) || 0 } }
                    }))}
                  />
                </div>
              </div>
            </GameGroup>
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
