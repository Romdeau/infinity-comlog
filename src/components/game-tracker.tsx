import * as React from "react"
import {
  SectionWrapper,
  AppLayout,
} from "@/components/layout-containers"
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
import { cn } from "@/lib/utils"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { GameStep, GameGroup } from "@/components/game-flow-components"
import missions from "@/data/missions.json"

export function GameTracker() {
  return (
    <AppLayout>
      <InfinityGameFlow />
      <TurnReference />
    </AppLayout>
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
    initiative: {
      winner: 'player' as 'player' | 'opponent',
      choice: 'initiative' as 'initiative' | 'deployment',
      firstTurn: null as 'player' | 'opponent' | null,
      firstDeployment: null as 'player' | 'opponent' | null,
    },
    deploymentDetails: {
      hidden: false,
      infiltration: false,
      forward: false,
      heldBack: 1,
      booty: false,
    },
    turns: {
      turn1: { doneOverride: false, p1: initialPlayerTurn(), p2: initialPlayerTurn() },
      turn2: { doneOverride: false, p1: initialPlayerTurn(), p2: initialPlayerTurn() },
      turn3: { doneOverride: false, p1: initialPlayerTurn(), p2: initialPlayerTurn() },
    },
    scoring: {
      doneOverride: false,
      player: {
        op: 0,
        vp: 0,
        objectives: {} as Record<string, any>
      },
      opponent: {
        op: 0,
        vp: 0,
        objectives: {} as Record<string, any>
      },
    },
  })

  // Helper to get active mission details
  const activeMission = missions.find(m => m.id === gameStep.scenario)



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
    gameStep.initiationSubSteps.commandTokens &&
    gameStep.initiative.firstTurn !== null &&
    gameStep.initiative.firstDeployment !== null

  const isSetupComplete = !!gameStep.scenario &&
    gameStep.scenarioPicked &&
    gameStep.listPicked &&
    gameStep.classifiedsDrawn &&
    isInitiativeComplete

  // Calculate OP based on objectives
  const calculateOP = (role: 'player' | 'opponent') => {
    if (!activeMission) return gameStep.scoring[role].op

    let total = 0
    const objProgress = gameStep.scoring[role].objectives

    // Determine player's role (Attacker/Defender)
    let assignedRole: string | undefined = undefined
    if (activeMission.hasRoles) {
      if (gameStep.initiative.firstTurn === null) {
        assignedRole = undefined
      } else {
        const isFirst =
          (role === 'player' && gameStep.initiative.firstTurn === 'player') ||
          (role === 'opponent' && gameStep.initiative.firstTurn === 'opponent')
        assignedRole = isFirst ? 'attacker' : 'defender'
      }
    }

    activeMission.objectives.forEach((obj: any) => {
      // Check if objective applies to the player's role
      if (obj.role && obj.role !== assignedRole) return

      const progress = objProgress[obj.id]
      if (progress) {
        if (typeof progress === 'number') {
          total += progress * obj.op
        } else if (progress === true) {
          total += obj.op
        }
      }
    })

    return Math.min(10, total) // Cap at 10 OP
  }

  const playerOP = calculateOP('player')
  const opponentOP = calculateOP('opponent')

  const isScoringComplete = playerOP > 0 || opponentOP > 0

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
    <SectionWrapper title="Infinity Game Flow" className="items-start justify-center">
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
                    const mission = missions.find(m => m.id === val)
                    setGameStep(prev => ({
                      ...prev,
                      scenario: val,
                      scenarioPicked: true,
                      classifiedsCount: mission?.classifieds.count ?? 1
                    }))
                  }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select a scenario" />
                  </SelectTrigger>
                  <SelectContent>
                    {missions.map(mission => (
                      <SelectItem key={mission.id} value={mission.id}>{mission.name}</SelectItem>
                    ))}
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
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  const val = e.target.value
                  setGameStep(prev => ({ ...prev, classifiedsCount: val === "" ? 0 : parseInt(val) }))
                }}
              />
            </div>

            <GameGroup
              label="Initiative & Deployment"
              value="initiative"
              defaultOpen
              info="Phase where you and your opponent determine turn order and deploy models."
              checked={gameStep.initiationDoneOverride || isInitiativeComplete}
              onCheckedChange={() => toggleStep('initiation')}
              size="sm"
            >
              {/* Lieutenant Roll Section */}
              <div className="space-y-3 pb-2 border-b border-muted/30">
                <GameStep
                  label="Lieutenant Roll"
                  info="The winner can choose Deployment or Initiative. The one who kept Initiative chooses who goes first/second."
                  checked={gameStep.initiationSubSteps.rollOff}
                  onCheckedChange={() => toggleStep('initiationSubSteps', 'rollOff')}
                  size="sm"
                />

                <div className="pl-7 space-y-3 pr-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground">Roll Winner</span>
                    <div className="flex bg-muted/50 rounded-md p-0.5">
                      <Button
                        variant={gameStep.initiative.winner === 'player' ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => setGameStep(p => ({ ...p, initiative: { ...p.initiative, winner: 'player' } }))}
                      >
                        You
                      </Button>
                      <Button
                        variant={gameStep.initiative.winner === 'opponent' ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => setGameStep(p => ({ ...p, initiative: { ...p.initiative, winner: 'opponent' } }))}
                      >
                        Opponent
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-muted-foreground">Winner Choice</span>
                    <div className="flex bg-muted/50 rounded-md p-0.5">
                      <Button
                        variant={gameStep.initiative.choice === 'initiative' ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => setGameStep(p => ({ ...p, initiative: { ...p.initiative, choice: 'initiative' } }))}
                      >
                        Initiative
                      </Button>
                      <Button
                        variant={gameStep.initiative.choice === 'deployment' ? "secondary" : "ghost"}
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => setGameStep(p => ({ ...p, initiative: { ...p.initiative, choice: 'deployment' } }))}
                      >
                        Deployment
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/30 p-2 text-[11px] leading-relaxed border border-border/50">
                    <span className="font-bold text-primary">{gameStep.initiative.winner === 'player' ? 'You' : 'The Opponent'}</span> {gameStep.initiative.winner === 'player' ? 'have' : 'has'} won the lieutenant roll and {gameStep.initiative.winner === 'player' ? 'have' : 'has'} chosen to keep <span className="font-bold text-primary">{gameStep.initiative.choice}</span>.
                    {activeMission?.hasRoles && (
                      <div className="mt-2 pt-2 border-t border-muted/30">
                        <p className="font-semibold text-primary">Role-Based Mission:</p>
                        <p className="text-muted-foreground mt-0.5">In this scenario, two distinct roles are established: Attacker and Defender. Each has different Main Objectives.</p>
                        {gameStep.initiative.firstTurn === null ? (
                          <p className="text-muted-foreground mt-1 italic">The player with the first Player Turn is the <span className="font-bold text-foreground">Attacker</span>. The second is the <span className="font-bold text-foreground">Defender</span>.</p>
                        ) : (
                          <div className="mt-2 p-2 bg-primary/5 rounded border border-primary/20">
                            <p className="text-[11px] leading-tight flex items-center gap-1.5">
                              <span className="font-bold text-primary">You</span> are the <span className="font-bold uppercase tracking-wider">{gameStep.initiative.firstTurn === 'player' ? 'Attacker' : 'Defender'}</span>
                            </p>
                            <p className="text-[11px] mt-1 leading-tight flex items-center gap-1.5 opacity-80">
                              <span className="font-bold">The Opponent</span> is the <span className="font-bold uppercase tracking-wider">{gameStep.initiative.firstTurn === 'opponent' ? 'Attacker' : 'Defender'}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dependent choices */}
                  <div className="space-y-2 pt-1 border-t border-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {(() => {
                          const actor = gameStep.initiative.choice === 'deployment' ? gameStep.initiative.winner : (gameStep.initiative.winner === 'player' ? 'opponent' : 'player');
                          return actor === 'player' ? (
                            <><span className="font-bold">You</span> have <span className="font-semibold">deployment</span> and deploy:</>
                          ) : (
                            <><span className="font-bold">The Opponent</span> has <span className="font-semibold">deployment</span> and deploys:</>
                          );
                        })()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-6 text-[10px] px-2 font-bold",
                          gameStep.initiative.firstDeployment === null && "text-muted-foreground font-normal"
                        )}
                        onClick={() => {
                          const current = gameStep.initiative.firstDeployment

                          if (current === null) setGameStep(p => ({ ...p, initiative: { ...p.initiative, firstDeployment: 'player' } }))
                          else if (current === 'player') setGameStep(p => ({ ...p, initiative: { ...p.initiative, firstDeployment: 'opponent' } }))
                          else setGameStep(p => ({ ...p, initiative: { ...p.initiative, firstDeployment: null } }))
                        }}
                      >
                        {gameStep.initiative.firstDeployment ? (gameStep.initiative.firstDeployment === 'player' ? "You First" : "Opponent First") : "First/Second"}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted-foreground">
                        {(() => {
                          const actor = gameStep.initiative.choice === 'initiative' ? gameStep.initiative.winner : (gameStep.initiative.winner === 'player' ? 'opponent' : 'player');
                          return actor === 'player' ? (
                            <><span className="font-bold">You</span> have <span className="font-semibold">initiative</span> and play:</>
                          ) : (
                            <><span className="font-bold">The Opponent</span> has <span className="font-semibold">initiative</span> and plays:</>
                          );
                        })()}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-6 text-[10px] px-2 font-bold",
                          gameStep.initiative.firstTurn === null && "text-muted-foreground font-normal"
                        )}
                        onClick={() => {
                          const current = gameStep.initiative.firstTurn
                          if (current === null) setGameStep(p => ({ ...p, initiative: { ...p.initiative, firstTurn: 'player' } }))
                          else if (current === 'player') setGameStep(p => ({ ...p, initiative: { ...p.initiative, firstTurn: 'opponent' } }))
                          else setGameStep(p => ({ ...p, initiative: { ...p.initiative, firstTurn: null } }))
                        }}
                      >
                        {gameStep.initiative.firstTurn ? (gameStep.initiative.firstTurn === 'player' ? "You First" : "Opponent First") : "First/Second"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deployment Section */}
              <div className="space-y-1 py-1 border-b border-muted/30">
                <GameStep
                  label="Army Deployment"
                  checked={gameStep.initiationSubSteps.deployment}
                  onCheckedChange={() => toggleStep('initiationSubSteps', 'deployment')}
                  size="sm"
                />

                <div className="pl-7 space-y-1 pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <GameStep
                      label="Hidden Deployment"
                      size="sm"
                      className="p-1 border-none hover:bg-transparent"
                      checked={gameStep.deploymentDetails.hidden}
                      onCheckedChange={(val) => setGameStep(p => ({ ...p, deploymentDetails: { ...p.deploymentDetails, hidden: val } }))}
                      info="Trooper is not placed on the table. Record its position."
                    />
                    <GameStep
                      label="Infiltration"
                      size="sm"
                      className="p-1 border-none hover:bg-transparent"
                      checked={gameStep.deploymentDetails.infiltration}
                      onCheckedChange={(val) => setGameStep(p => ({ ...p, deploymentDetails: { ...p.deploymentDetails, infiltration: val } }))}
                      info="Deploy outside Deployment Zone (requires PH roll for some)."
                    />
                    <GameStep
                      label="Forward Deployment"
                      size="sm"
                      className="p-1 border-none hover:bg-transparent"
                      checked={gameStep.deploymentDetails.forward}
                      onCheckedChange={(val) => setGameStep(p => ({ ...p, deploymentDetails: { ...p.deploymentDetails, forward: val } }))}
                      info="Deploy 4 or 8 inches further than standard."
                    />
                    <div className="flex items-center justify-between px-1">
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">Held Back</span>
                      <Input
                        type="number"
                        min={0}
                        className="w-8 h-5 text-[10px] px-0.5 text-center"
                        value={gameStep.deploymentDetails.heldBack}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => setGameStep(prev => ({ ...prev, deploymentDetails: { ...prev.deploymentDetails, heldBack: parseInt(e.target.value) || 0 } }))}
                      />
                    </div>
                  </div>

                  {/* Booty Reminder (if applicable/manual toggle for now) */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-md p-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle2Icon className="size-3.5 text-primary" />
                        <span className="text-[11px] font-bold">Booty Roll Reminder!</span>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 bg-background">View Table</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 overflow-hidden">
                          <div className="bg-primary text-primary-foreground text-[10px] font-bold p-2 text-center uppercase tracking-widest">
                            Booty Table
                          </div>
                          <div className="p-0 text-[10px]">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-muted text-muted-foreground border-b border-border">
                                  <th className="p-1 text-center border-r border-border">Roll</th>
                                  <th className="p-1 text-left border-r border-border">Item</th>
                                  <th className="p-1 text-center border-r border-border">Roll</th>
                                  <th className="p-1 text-left">Item</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr className="border-b border-border">
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">1-2</td>
                                  <td className="p-1 border-r border-border">+1 ARM</td>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">13</td>
                                  <td className="p-1">Panzerfaust</td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">3-4</td>
                                  <td className="p-1 border-r border-border">Light Flamethrower</td>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">14</td>
                                  <td className="p-1">Monofilament CCW</td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">5-6</td>
                                  <td className="p-1 border-r border-border">Grenades</td>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">15</td>
                                  <td className="p-1">MOV 8-4</td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">7-8</td>
                                  <td className="p-1 border-r border-border">DA CCW</td>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">16</td>
                                  <td className="p-1">Shock/MULTI Rifle</td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">9</td>
                                  <td className="p-1 border-r border-border">MSV L1</td>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">17</td>
                                  <td className="p-1">MULTI Sniper</td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">10</td>
                                  <td className="p-1 border-r border-border">EXP CCW</td>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">18</td>
                                  <td className="p-1">Immune(ARM)/+4 ARM</td>
                                </tr>
                                <tr className="border-b border-border">
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">11</td>
                                  <td className="p-1 border-r border-border">Adhesive L.</td>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">19</td>
                                  <td className="p-1">Mimetism (-6)</td>
                                </tr>
                                <tr>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">12</td>
                                  <td className="p-1 border-r border-border">Immune(AP)/+2 ARM</td>
                                  <td className="p-1 text-center font-bold bg-muted/30 border-r border-border">20</td>
                                  <td className="p-1">B+1/HMG</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
              </div>

              <GameStep
                label="Strategic Cmd Tokens"
                checked={gameStep.initiationSubSteps.commandTokens}
                onCheckedChange={() => toggleStep('initiationSubSteps', 'commandTokens')}
                size="sm"
              />
            </GameGroup>
          </GameGroup>

          <div className="px-4 pb-4 mt-4 space-y-3">
            {(['turn1', 'turn2', 'turn3'] as const).map((turnKey, idx) => {
              const turn = gameStep.turns[turnKey]
              const isPlayerFirst = gameStep.initiative.firstTurn === 'player'
              return (
                <GameGroup
                  key={turnKey}
                  label={`Turn ${idx + 1}`}
                  value={turnKey}
                  info={`Round ${idx + 1} of tactical actions and combat.`}
                  checked={isTurnComplete(turn)}
                  onCheckedChange={() => toggleStep(turnKey)}
                >
                  {(['p1', 'p2'] as const).map((pKey) => {
                    const isFirst = pKey === 'p1'
                    const isUser = isFirst ? isPlayerFirst : !isPlayerFirst
                    const label = isUser ? "Your Turn" : "Opponent Turn"

                    return (
                      <GameGroup
                        key={pKey}
                        label={label}
                        value={`${turnKey}-${pKey}`}
                        checked={isPlayerComplete(turn[pKey])}
                        onCheckedChange={() => toggleStep(turnKey, pKey)}
                        size="sm"
                      >
                        <GameGroup
                          label="Start of the Turn: Tactical Phase"
                          value={`${turnKey}-${pKey}-tactical`}
                          checked={isTacticalComplete(turn[pKey].tactical)}
                          onCheckedChange={() => toggleStep(turnKey, pKey, 'tactical')}
                          size="sm"
                        >
                          <GameStep
                            label="Executive Use of Command Tokens"
                            checked={turn[pKey].tactical.tokens}
                            onCheckedChange={() => toggleStep(turnKey, pKey, 'tokens')}
                            size="sm"
                          />
                          <GameStep
                            label="Retreat! Check"
                            checked={turn[pKey].tactical.retreat}
                            onCheckedChange={() => toggleStep(turnKey, pKey, 'retreat')}
                            size="sm"
                          />
                          <GameStep
                            label="Loss of Lieutenant check"
                            checked={turn[pKey].tactical.lol}
                            onCheckedChange={() => toggleStep(turnKey, pKey, 'lol')}
                            size="sm"
                          />
                          <GameStep
                            label="Order count"
                            checked={turn[pKey].tactical.count}
                            onCheckedChange={() => toggleStep(turnKey, pKey, 'count')}
                            size="sm"
                          />
                        </GameGroup>

                        <GameStep
                          label="Impetuous Phase"
                          checked={turn[pKey].impetuous}
                          onCheckedChange={() => toggleStep(turnKey, pKey, 'impetuous')}
                          size="sm"
                        />
                        <GameStep
                          label="Orders Phase"
                          checked={turn[pKey].orders}
                          onCheckedChange={() => toggleStep(turnKey, pKey, 'orders')}
                          size="sm"
                        />
                        <GameStep
                          label="States Phase"
                          checked={turn[pKey].states}
                          onCheckedChange={() => toggleStep(turnKey, pKey, 'states')}
                          size="sm"
                        />
                        <GameStep
                          label="End of the Turn"
                          checked={turn[pKey].end}
                          onCheckedChange={() => toggleStep(turnKey, pKey, 'end')}
                          size="sm"
                        />
                      </GameGroup>
                    )
                  })}
                </GameGroup>
              )
            })}

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

                {activeMission?.hasRoles && gameStep.initiative.firstTurn === null && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-2 mb-2">
                    <ZapIcon className="size-4 text-red-500 mt-0.5 shrink-0" />
                    <div className="text-[10px] text-red-400 font-medium">
                      Turn order must be selected in the <strong>Initiative</strong> section before role-based scoring can be calculated.
                    </div>
                  </div>
                )}

                {['player', 'opponent'].map((role) => {
                  const isPlayer = role === 'player'
                  const op = isPlayer ? playerOP : opponentOP
                  const rivalOp = isPlayer ? opponentOP : playerOP

                  let assignedRole: string | undefined = undefined
                  if (activeMission?.hasRoles) {
                    if (gameStep.initiative.firstTurn === null) {
                      assignedRole = undefined
                    } else {
                      const isFirst =
                        (isPlayer && gameStep.initiative.firstTurn === 'player') ||
                        (!isPlayer && gameStep.initiative.firstTurn === 'opponent')
                      assignedRole = isFirst ? 'attacker' : 'defender'
                    }
                  }

                  return (
                    <div key={role} className="space-y-3">
                      <div className="grid grid-cols-4 gap-2 items-center">
                        <div className="flex flex-col">
                          <div className="text-[11px] font-semibold">{isPlayer ? "You" : "Opponent"}</div>
                          {assignedRole && (
                            <div className="text-[9px] uppercase font-bold text-primary/70 tracking-tighter -mt-0.5 capitalize">{assignedRole}</div>
                          )}
                        </div>
                        <div className="bg-primary/10 rounded-md border border-primary/20 flex items-center justify-center h-8 text-sm font-bold text-primary">
                          {calculateTP(op, rivalOp)}
                        </div>
                        <div className="bg-muted/50 rounded-md border border-border flex items-center justify-center h-8 text-sm font-bold">
                          {op}
                        </div>
                        <Input
                          type="number"
                          min={0}
                          max={300}
                          className="h-8 text-center text-xs px-1 bg-muted/50 focus:bg-background"
                          value={gameStep.scoring[role as 'player' | 'opponent'].vp}
                          onFocus={(e) => e.target.select()}
                          onChange={(e) => {
                            const val = e.target.value
                            setGameStep(prev => ({
                              ...prev,
                              scoring: {
                                ...prev.scoring,
                                [role]: { ...prev.scoring[role as 'player' | 'opponent'], vp: val === "" ? 0 : parseInt(val) }
                              }
                            }))
                          }}
                        />
                      </div>

                      {/* Objective Checklist for this player */}
                      {activeMission && (
                        <div className="pl-4 pr-1 py-2 space-y-2 border-l-2 border-muted/30 ml-2">
                          {activeMission.objectives
                            .filter((obj: any) => !obj.role || obj.role === assignedRole)
                            .map((obj: any) => (
                              <div key={obj.id} className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <div
                                    className={cn(
                                      "size-4 rounded border border-primary/30 flex items-center justify-center cursor-pointer transition-colors",
                                      gameStep.scoring[role as 'player' | 'opponent'].objectives[obj.id] ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50"
                                    )}
                                    onClick={() => {
                                      setGameStep(prev => {
                                        const objectives = { ...prev.scoring[role as 'player' | 'opponent'].objectives }
                                        if (obj.type === 'manual' || obj.type === 'round-end-manual') {
                                          const current = objectives[obj.id] || 0
                                          objectives[obj.id] = current >= (obj.max || 1) ? 0 : current + 1
                                        } else {
                                          objectives[obj.id] = !objectives[obj.id]
                                        }
                                        return {
                                          ...prev,
                                          scoring: {
                                            ...prev.scoring,
                                            [role]: { ...prev.scoring[role as 'player' | 'opponent'], objectives }
                                          }
                                        }
                                      })
                                    }}
                                  >
                                    {gameStep.scoring[role as 'player' | 'opponent'].objectives[obj.id] ? (
                                      <CheckCircle2Icon className="size-3" />
                                    ) : null}
                                  </div>
                                  <span className="text-[10px] leading-tight text-muted-foreground mr-1">
                                    {obj.text}
                                  </span>
                                </div>
                                {(obj.type === 'manual' || obj.type === 'round-end-manual') && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-bold text-primary/80">
                                      {gameStep.scoring[role as 'player' | 'opponent'].objectives[obj.id] || 0}/{obj.max}
                                    </span>
                                  </div>
                                )}
                                <span className="text-[9px] font-bold text-muted-foreground/50 whitespace-nowrap pt-0.5">
                                  {obj.op} OP
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )
                })}
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
    </SectionWrapper>
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
    <SectionWrapper title="Turn Reference" className="items-start justify-center">
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
    </SectionWrapper>
  )
}
