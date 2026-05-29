import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  SwordIcon,
  ZapIcon,
  CheckCircle2Icon,
  LayersIcon,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { GameStep, GameGroup } from "@/components/game-flow-components"
import { type EnrichedArmyList } from "@/lib/unit-service"
import missions from "@/data/missions.json"

import { useGame, type GameSession } from "@/context/game-context"
import { calculateTP, isTacticalComplete, isPlayerComplete, isTurnComplete, isSetupComplete, getPlayerByTurnOrder } from "@/lib/game-flow-helpers"
import { getRelevantSkillsForPhase, type GamePhase, type ContextualHint } from "@/lib/army-context-mapping"
import { calculateObjectivePoints, getAssignedMissionRole, getRoundObjectiveProgress, objectiveAppliesToRole } from "@/features/game/scoring/scoring-service"
import type { MissionDefinition, MissionObjective } from "@/shared/types/missions"
import { scoringSides, turnKeys, turnPlayerKeys, type ScoringSide, type TurnKey, type TurnPlayerKey } from "@/shared/types/game"

type GameState = GameSession["state"]
type GameTurn = GameState["turns"][TurnKey]
type PlayerTurn = GameTurn[TurnPlayerKey]
type RoundObjective = Extract<MissionObjective, { type: "round-end" | "round-end-boolean" | "round-end-manual" }>

const missionDefinitions = missions as MissionDefinition[]

function isRoundObjective(objective: MissionObjective): objective is RoundObjective {
  return objective.type === "round-end" || objective.type === "round-end-boolean" || objective.type === "round-end-manual"
}

function updateTurn(state: GameState, turnKey: TurnKey, updater: (turn: GameTurn) => GameTurn): GameState {
  return {
    ...state,
    turns: {
      ...state.turns,
      [turnKey]: updater(state.turns[turnKey]),
    },
  }
}

function updateTurnPlayer(state: GameState, turnKey: TurnKey, playerKey: TurnPlayerKey, updater: (player: PlayerTurn) => PlayerTurn): GameState {
  return updateTurn(state, turnKey, (turn) => ({
    ...turn,
    [playerKey]: updater(turn[playerKey]),
  }))
}

function toggleRoundObjective(state: GameState, turnKey: TurnKey, side: ScoringSide, objective: RoundObjective): GameState {
  return updateTurn(state, turnKey, (turn) => {
    const currentObjectives = turn.objectives[side]
    const current = currentObjectives[objective.id]
    const nextValue = objective.type === "round-end-manual"
      ? (typeof current === "number" && current >= objective.max ? 0 : (typeof current === "number" ? current : 0) + 1)
      : !current

    return {
      ...turn,
      objectives: {
        ...turn.objectives,
        [side]: {
          ...currentObjectives,
          [objective.id]: nextValue,
        },
      },
    }
  })
}

function toggleScoringObjective(state: GameState, side: ScoringSide, objective: MissionObjective): GameState {
  const currentObjectives = state.scoring[side].objectives
  const current = currentObjectives[objective.id]
  const nextValue = objective.type === "manual"
    ? (typeof current === "number" && current >= objective.max ? 0 : (typeof current === "number" ? current : 0) + 1)
    : !current

  return {
    ...state,
    scoring: {
      ...state.scoring,
      [side]: {
        ...state.scoring[side],
        objectives: {
          ...currentObjectives,
          [objective.id]: nextValue,
        },
      },
    },
  }
}

function FlowStatusCard({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={cn(
      "rounded-xl border px-4 py-3",
      emphasis ? "border-primary/30 bg-primary/8" : "border-border/70 bg-background/70"
    )}>
      <div className="text-ui-label">{label}</div>
      <div className={cn("mt-2 text-sm font-medium", emphasis && "text-primary")}>{value}</div>
    </div>
  )
}

export function ContextualHints({ hints, phase, onToggle, checkedMap }: { 
  hints: ContextualHint[], 
  phase: GamePhase, 
  onToggle?: (id: string, val: boolean) => void,
  checkedMap?: Record<string, boolean>
}) {
  if (hints.length === 0) return null;

  return (
    <div className={cn(
      "border rounded-lg p-3 space-y-3",
      phase === "setup" ? "border-border/70 bg-muted/30" : "border-primary/10 bg-primary/5"
    )}>
      <div className={cn(
        "flex items-center gap-2 text-ui-label",
        phase === "setup" ? "text-foreground" : "text-primary"
      )}>
        <LayersIcon className="size-3.5" />
        {phase === "setup" ? "Deployment Assistance" : "Phase Hints"}
      </div>
      <div className="grid gap-2">
        {hints.map((item) => {
          const isStrategic = item.unitName === "Strategic Use";
          return (
            <label 
              key={item.id} 
              className={cn(
                "flex items-center justify-between p-2 rounded border transition-colors cursor-pointer",
                isStrategic 
                  ? "bg-accent border-border/70 hover:bg-accent/80" 
                  : "bg-background/40 border-border/40 hover:bg-background/60"
              )}
            >
              <div className="flex items-center gap-3">
                {onToggle && !isStrategic && (
                  <Checkbox
                    checked={checkedMap?.[item.id] || false}
                    onCheckedChange={(val) => onToggle(item.id, !!val)}
                  />
                )}
                <span className={cn(
                  "text-xs font-medium uppercase tracking-[0.14em]",
                  isStrategic ? "text-foreground" : (checkedMap?.[item.id] && "text-muted-foreground line-through opacity-70")
                )}>{item.unitName}</span>
              </div>
              <div className="flex flex-wrap gap-1 justify-end">
                {item.skills.map((skill, i) => (
                  <div key={i} className={cn(
                    "text-xs px-2 py-0.5 rounded-md border flex items-center gap-1",
                    isStrategic
                      ? "bg-accent text-accent-foreground border-border/70"
                      : (skill === "Booty"
                        ? "bg-accent text-foreground border-border/70"
                        : "bg-muted/50 text-muted-foreground border-border")
                  )}>
                    {skill === "Booty" ? (
                    <Popover>
                      <PopoverTrigger className="hover:underline cursor-pointer flex items-center gap-1">
                        Booty <CheckCircle2Icon className="size-2.5" />
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-0 overflow-hidden" align="end">
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
                  ) : (
                    skill
                  )}
                </div>
              ))}
            </div>
          </label>
        );
      })}
      </div>
    </div>
  );
}

export function InfinityGameFlow({ armyLists }: { armyLists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null } }) {
  const { activeSession, updateActiveSession, createSession } = useGame()

  const getHints = (phase: GamePhase, isOpponent: boolean = false) => {
    if (!activeSession) return [];
    const gameStep = activeSession.state;
    if (gameStep.selectedList === 'none') return [];
    
    let hints: ContextualHint[] = [];

    // Add strategic hints at the TOP
    if (phase === "setup" && !isOpponent) {
      if (gameStep.initiative.firstTurn === "player" && gameStep.strategicOptions.p1Reserve) {
        hints.push({
          id: "strat-reserve",
          unitName: "Strategic Use",
          skills: ["You have an extra unit in reserve."]
        });
      }
    }

    if (phase === "tactical") {
      const isUserP1 = gameStep.initiative.firstTurn === "player";
      const isUserP2 = gameStep.initiative.firstTurn === "opponent";
      
      if (isOpponent) {
        // Looking at opponent's tactical phase. They are P1 if user is P2.
        if (isUserP2 && gameStep.strategicOptions.p2OrderReduction) {
          hints.push({
            id: "strat-order-reduction",
            unitName: "Strategic Use",
            skills: ["Opponent's Order Pool reduced by 2 Regular Orders."]
          });
        }
      } else {
        // Looking at user's tactical phase. They are P1 if user is P1.
        if (isUserP1 && gameStep.strategicOptions.p2OrderReduction) {
          hints.push({
            id: "strat-order-reduction",
            unitName: "Strategic Use",
            skills: ["Your Order Pool reduced by 2 Regular Orders."]
          });
        }
      }
    }

    // Add unit-specific hints for the user
    if (!isOpponent) {
      const list = armyLists[gameStep.selectedList];
      if (list) {
        const unitsWithIds = list.combatGroups.flatMap((group, gIdx) => 
          group.members.map((member, mIdx) => ({
            id: `${gameStep.selectedList}-${gIdx}-${mIdx}-${member.id}`,
            unit: member
          }))
        );
        hints = [...hints, ...getRelevantSkillsForPhase(unitsWithIds, phase)];
      }
    }

    return hints;
  };

  if (!activeSession) {
    return (
      <Card className="w-full border-dashed">
        <CardHeader className="text-center">
          <CardTitle>No Active Session</CardTitle>
          <CardDescription>Start a new game session to track your progress</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-6">
          <Button onClick={() => createSession(`Game ${new Date().toLocaleDateString()}`)}>
            <ZapIcon className="mr-2 size-4" />
            Start New Game
          </Button>
        </CardContent>
      </Card>
    )
  }

  const gameStep = activeSession.state
  const setGameStep = (updater: GameState | ((prev: GameState) => GameState)) => {
    updateActiveSession((prev) => {
      if (typeof updater === 'function') {
        return updater(prev)
      }
      return updater
    })
  }

  // Helper to get active mission details
  const activeMission = missionDefinitions.find(m => m.id === gameStep.scenario)

  const playerOP = calculateObjectivePoints(activeMission, gameStep, 'player')
  const opponentOP = calculateObjectivePoints(activeMission, gameStep, 'opponent')

  const completedCount = [
    isSetupComplete(gameStep),
    isTurnComplete(gameStep.turns.turn1),
    isTurnComplete(gameStep.turns.turn2),
    isTurnComplete(gameStep.turns.turn3),
    gameStep.scoring.doneOverride
  ].filter(Boolean).length

  const p1Identity = getPlayerByTurnOrder(gameStep.initiative, 1);
  const p2Identity = getPlayerByTurnOrder(gameStep.initiative, 2);
  const p1Label = p1Identity === 'player' ? "You" : "Opponent";
  const p2Label = p2Identity === 'player' ? "You" : "Opponent";
  const selectedArmy = gameStep.selectedList === "listA" ? armyLists.listA : gameStep.selectedList === "listB" ? armyLists.listB : null
  const missionName = activeMission?.name || "No mission selected"
  const currentStatus = completedCount === 5
    ? (playerOP > opponentOP ? "Finished: Victory" : playerOP === opponentOP ? "Finished: Draw" : "Finished: Defeat")
    : !gameStep.scenario
      ? "Choose mission"
      : gameStep.selectedList === "none"
        ? "Choose active list"
        : !gameStep.initiationSubSteps.rollOff
          ? "Resolve initiative"
          : "Continue game flow"

  return (
    <Card className="w-full border-border/70 bg-card/70 shadow-none">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 rounded-lg p-2">
              <SwordIcon className="text-primary size-5" />
            </div>
            <div>
              <CardTitle>Infinity Game Flow</CardTitle>
              <CardDescription>N5 Sequence of Play & Scoring</CardDescription>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-4">
            <FlowStatusCard label="Status" value={currentStatus} emphasis />
            <FlowStatusCard label="Mission" value={missionName} />
            <FlowStatusCard label="Active List" value={selectedArmy?.armyName || "None selected"} />
            <FlowStatusCard label="Progress" value={`${completedCount}/5 phases`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* 1. Setup & Initiative */}
          <GameGroup
            label="1. Setup & Initiative"
            value="setup"
            checked={isSetupComplete(gameStep) || gameStep.setupDoneOverride}
            onCheckedChange={(val) => setGameStep(prev => ({ ...prev, setupDoneOverride: !!val }))}
            defaultOpen={true}
          >
            <div className="space-y-4">
              <div className="grid gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Mission Selection</label>
                  <Select
                    value={gameStep.scenario}
                    onValueChange={(val) => setGameStep(prev => ({ ...prev, scenario: val }))}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select Mission..." />
                    </SelectTrigger>
                    <SelectContent>
                      {missionDefinitions.map(m => (
                        <SelectItem key={m.id} value={m.id} className="text-xs">{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <GameStep
                    label="Scenario Picked"
                    size="sm"
                    checked={gameStep.scenarioPicked}
                    onCheckedChange={(val) => setGameStep(prev => ({ ...prev, scenarioPicked: !!val }))}
                  />
                  <GameStep
                    label="Classifieds Drawn"
                    size="sm"
                    checked={gameStep.classifiedsDrawn}
                    onCheckedChange={(val) => setGameStep(prev => ({ ...prev, classifiedsDrawn: !!val }))}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Army List Selection</label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={gameStep.selectedList}
                      onValueChange={(val) => setGameStep(prev => ({ ...prev, selectedList: val as "none" | "listA" | "listB", listPicked: val !== 'none' }))}
                    >
                      <SelectTrigger className="h-9 text-xs flex-1">
                        <SelectValue placeholder="Select List..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none" className="text-xs">None</SelectItem>
                        <SelectItem value="listA" className="text-xs" disabled={!armyLists.listA}>List A {armyLists.listA?.armyName ? `(${armyLists.listA.armyName})` : ""}</SelectItem>
                        <SelectItem value="listB" className="text-xs" disabled={!armyLists.listB}>List B {armyLists.listB?.armyName ? `(${armyLists.listB.armyName})` : ""}</SelectItem>
                      </SelectContent>
                    </Select>
                    <GameStep
                      label="List Picked"
                      size="sm"
                      className="border-none p-0"
                      checked={gameStep.listPicked}
                      onCheckedChange={(val) => setGameStep(prev => ({ ...prev, listPicked: !!val }))}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-border/50">
                <div className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Initiative & Deployment</div>
                <div className="grid gap-2">
                  <GameStep
                    label="Roll-off"
                    size="sm"
                    checked={gameStep.initiationSubSteps.rollOff}
                    onCheckedChange={(val) => setGameStep(prev => ({ ...prev, initiationSubSteps: { ...prev.initiationSubSteps, rollOff: !!val } }))}
                  />

                  <div className="pl-4 space-y-3 py-1 border-l-2 border-muted/30 ml-2">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Winner</span>
                        <div className="flex bg-muted/50 rounded-md p-0.5">
                          <button
                            onClick={() => setGameStep(prev => ({ ...prev, initiative: { ...prev.initiative, winner: 'player' } }))}
                            className={cn("flex-1 text-[10px] py-1 rounded-sm transition-colors", gameStep.initiative.winner === 'player' ? "bg-background shadow-sm font-bold" : "opacity-50")}
                          >You</button>
                          <button
                            onClick={() => setGameStep(prev => ({ ...prev, initiative: { ...prev.initiative, winner: 'opponent' } }))}
                            className={cn("flex-1 text-[10px] py-1 rounded-sm transition-colors", gameStep.initiative.winner === 'opponent' ? "bg-background shadow-sm font-bold" : "opacity-50")}
                          >Opponent</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Choice</span>
                        <div className="flex bg-muted/50 rounded-md p-0.5">
                          <button
                            onClick={() => setGameStep(prev => ({ ...prev, initiative: { ...prev.initiative, choice: 'initiative' } }))}
                            className={cn("flex-1 text-[10px] py-1 rounded-sm transition-colors", gameStep.initiative.choice === 'initiative' ? "bg-background shadow-sm font-bold" : "opacity-50")}
                          >Init</button>
                          <button
                            onClick={() => setGameStep(prev => ({ ...prev, initiative: { ...prev.initiative, choice: 'deployment' } }))}
                            className={cn("flex-1 text-[10px] py-1 rounded-sm transition-colors", gameStep.initiative.choice === 'deployment' ? "bg-background shadow-sm font-bold" : "opacity-50")}
                          >Dep</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">First Turn</span>
                        <div className="flex bg-muted/50 rounded-md p-0.5">
                          <button
                            onClick={() => setGameStep(prev => ({ ...prev, initiative: { ...prev.initiative, firstTurn: 'player' } }))}
                            className={cn("flex-1 text-[10px] py-1 rounded-sm transition-colors", gameStep.initiative.firstTurn === 'player' ? "bg-primary/20 text-primary font-bold" : "opacity-50")}
                          >You</button>
                          <button
                            onClick={() => setGameStep(prev => ({ ...prev, initiative: { ...prev.initiative, firstTurn: 'opponent' } }))}
                            className={cn("flex-1 text-[10px] py-1 rounded-sm transition-colors", gameStep.initiative.firstTurn === 'opponent' ? "bg-primary/20 text-primary font-bold" : "opacity-50")}
                          >Opp</button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">First Dep</span>
                        <div className="flex bg-muted/50 rounded-md p-0.5">
                          <button
                            onClick={() => setGameStep(prev => ({ ...prev, initiative: { ...prev.initiative, firstDeployment: 'player' } }))}
                            className={cn("flex-1 text-[10px] py-1 rounded-sm transition-colors", gameStep.initiative.firstDeployment === 'player' ? "bg-primary/20 text-primary font-bold" : "opacity-50")}
                          >You</button>
                          <button
                            onClick={() => setGameStep(prev => ({ ...prev, initiative: { ...prev.initiative, firstDeployment: 'opponent' } }))}
                            className={cn("flex-1 text-[10px] py-1 rounded-sm transition-colors", gameStep.initiative.firstDeployment === 'opponent' ? "bg-primary/20 text-primary font-bold" : "opacity-50")}
                          >Opp</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {p1Identity && (
                    <div className="space-y-2 pt-1">
                      <div className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                        First Player Strategic Use ({p1Label})
                      </div>
                      <div className="pl-2 space-y-2">
                        <div className="flex items-start gap-2 bg-muted/30 p-2 rounded-md border border-border/50">
                          <Checkbox 
                            id="p1-reserve"
                            checked={gameStep.strategicOptions.p1Reserve}
                            onCheckedChange={(val) => setGameStep(prev => ({ 
                              ...prev, 
                              strategicOptions: { ...prev.strategicOptions, p1Reserve: !!val } 
                            }))}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label htmlFor="p1-reserve" className="text-[10px] font-bold leading-none cursor-pointer">
                              Procedural: Reserve Trooper
                            </label>
                            <p className="text-[9px] text-muted-foreground">
                              Set aside one extra Trooper and their Peripherals to be deployed in reserve.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <GameStep
                    label="Deployment"
                    size="sm"
                    checked={gameStep.initiationSubSteps.deployment}
                    onCheckedChange={(val) => setGameStep(prev => ({ ...prev, initiationSubSteps: { ...prev.initiationSubSteps, deployment: !!val } }))}
                  />

                  <ContextualHints 
                    phase="setup" 
                    hints={getHints('setup')} 
                    checkedMap={gameStep.deploymentDetails.deployedUnits}
                    onToggle={(id, val) => setGameStep(p => ({
                      ...p,
                      deploymentDetails: {
                        ...p.deploymentDetails,
                        deployedUnits: {
                          ...p.deploymentDetails.deployedUnits,
                          [id]: val
                        }
                      }
                    }))}
                  />

                  <GameStep
                    label="Strategic Use of Command Tokens"
                    size="sm"
                    checked={gameStep.initiationSubSteps.strategicUse}
                    onCheckedChange={(val) => setGameStep(prev => ({ ...prev, initiationSubSteps: { ...prev.initiationSubSteps, strategicUse: !!val } }))}
                  >
                    <div className="pl-6 pt-2 space-y-4">
                      {/* Second Player Procedural */}
                      {p2Identity && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase text-muted-foreground">
                              Second Player Procedural ({p2Label})
                            </span>
                            <a href="https://infinitythewiki.com/Command_Tokens#Command_Tokens:_Strategic_Use" target="_blank" rel="noopener noreferrer" className="text-[9px] text-primary underline hover:text-primary/80">Wiki</a>
                          </div>
                          
                          <div className="grid gap-2">
                            <div className={cn(
                              "flex items-start gap-2 p-2 rounded-md border transition-colors",
                              gameStep.strategicOptions.p2OrderReduction ? "bg-primary/5 border-primary/30" : "bg-muted/20 border-border/50"
                            )}>
                              <Checkbox 
                                id="p2-order"
                                checked={gameStep.strategicOptions.p2OrderReduction}
                                onCheckedChange={(val) => setGameStep(prev => ({ 
                                  ...prev, 
                                  strategicOptions: { 
                                    ...prev.strategicOptions, 
                                    p2OrderReduction: !!val,
                                    p2CtLimit: false,
                                    p2SuppressiveFire: false
                                  } 
                                }))}
                              />
                              <label htmlFor="p2-order" className="text-[10px] font-medium leading-none cursor-pointer">
                                Remove 2 Regular Orders from opponent
                              </label>
                            </div>

                            <div className={cn(
                              "flex items-start gap-2 p-2 rounded-md border transition-colors",
                              gameStep.strategicOptions.p2CtLimit ? "bg-primary/5 border-primary/30" : "bg-muted/20 border-border/50"
                            )}>
                              <Checkbox 
                                id="p2-ct"
                                checked={gameStep.strategicOptions.p2CtLimit}
                                onCheckedChange={(val) => setGameStep(prev => ({ 
                                  ...prev, 
                                  strategicOptions: { 
                                    ...prev.strategicOptions, 
                                    p2CtLimit: !!val,
                                    p2OrderReduction: false,
                                    p2SuppressiveFire: false
                                  } 
                                }))}
                              />
                              <label htmlFor="p2-ct" className="text-[10px] font-medium leading-none cursor-pointer">
                                Limit opponent to 1 Command Token use
                              </label>
                            </div>

                            <div className={cn(
                              "flex items-start gap-2 p-2 rounded-md border transition-colors",
                              gameStep.strategicOptions.p2SuppressiveFire ? "bg-primary/5 border-primary/30" : "bg-muted/20 border-border/50"
                            )}>
                              <Checkbox 
                                id="p2-sf"
                                checked={gameStep.strategicOptions.p2SuppressiveFire}
                                onCheckedChange={(val) => setGameStep(prev => ({ 
                                  ...prev, 
                                  strategicOptions: { 
                                    ...prev.strategicOptions, 
                                    p2SuppressiveFire: !!val,
                                    p2OrderReduction: false,
                                    p2CtLimit: false
                                  } 
                                }))}
                              />
                              <label htmlFor="p2-sf" className="text-[10px] font-medium leading-none cursor-pointer">
                                Activate Suppressive Fire on 1 Trooper
                              </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Logistical Use */}
                      <div className="space-y-2 pt-2 border-t border-border/30">
                        <span className="text-[10px] font-bold uppercase text-muted-foreground">
                          Logistical Use (Both Players)
                        </span>
                        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
                          <div className={cn(
                            "flex items-center gap-2 p-2 rounded-md border transition-colors",
                            gameStep.strategicOptions.p1Speedball ? "bg-primary/5 border-primary/30" : "bg-muted/20 border-border/50"
                          )}>
                            <Checkbox 
                              id="p1-speedball"
                              checked={gameStep.strategicOptions.p1Speedball}
                              onCheckedChange={(val) => setGameStep(prev => ({ 
                                ...prev, 
                                strategicOptions: { ...prev.strategicOptions, p1Speedball: !!val } 
                              }))}
                            />
                            <label htmlFor="p1-speedball" className="text-[10px] font-medium leading-none cursor-pointer">
                              {p1Label}: Speedballs
                            </label>
                          </div>
                          <div className={cn(
                            "flex items-center gap-2 p-2 rounded-md border transition-colors",
                            gameStep.strategicOptions.p2Speedball ? "bg-primary/5 border-primary/30" : "bg-muted/20 border-border/50"
                          )}>
                            <Checkbox 
                              id="p2-speedball"
                              checked={gameStep.strategicOptions.p2Speedball}
                              onCheckedChange={(val) => setGameStep(prev => ({ 
                                ...prev, 
                                strategicOptions: { ...prev.strategicOptions, p2Speedball: !!val } 
                              }))}
                            />
                            <label htmlFor="p2-speedball" className="text-[10px] font-medium leading-none cursor-pointer">
                              {p2Label}: Speedballs
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </GameStep>
                </div>
              </div>
            </div>
          </GameGroup>

          {/* 2-4. Turns */}
          {turnKeys.map((tKey, turnIndex) => {
            const turnNum = turnIndex + 1
            const turn = gameStep.turns[tKey]

            return (
              <GameGroup
                key={turnNum}
                label={`${turnNum + 1}. Game Round ${turnNum}`}
                value={tKey}
                checked={isTurnComplete(turn)}
                onCheckedChange={(val) => setGameStep(prev => ({
                  ...prev,
                  turns: { ...prev.turns, [tKey]: { ...prev.turns[tKey], doneOverride: !!val } }
                }))}
              >
                <div className="space-y-4">
                  {turnPlayerKeys.map((pKey) => {
                    const player = turn[pKey]
                    const label = pKey === 'p1' ? "First Player" : "Second Player"
                    const playerName = getPlayerByTurnOrder(gameStep.initiative, pKey === 'p1' ? 1 : 2) === 'player' ? "You" : "Opponent"
                    const scoringSide: ScoringSide = playerName === "You" ? "player" : "opponent"

                    return (
                      <div key={pKey} className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground">{label} ({playerName})</span>
                          {isPlayerComplete(player) && <CheckCircle2Icon className="size-3 text-green-500" />}
                        </div>
                        <div className="grid gap-1.5">
                          <GameGroup
                            label="Tactical Phase"
                            size="sm"
                            value={`${tKey}-${pKey}-tactical`}
                            checked={isTacticalComplete(player.tactical) || player.tactical.doneOverride}
                            onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                              ...current,
                              tactical: { ...current.tactical, doneOverride: !!val },
                            })))}
                          >
                            <div className="grid gap-1">
                              <GameStep
                                label="Command Tokens"
                                size="sm"
                                checked={player.tactical.tokens}
                                onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                                  ...current,
                                  tactical: { ...current.tactical, tokens: !!val },
                                })))}
                              />
                              <GameStep
                                label="Retreat! Check"
                                size="sm"
                                checked={player.tactical.retreat}
                                onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                                  ...current,
                                  tactical: { ...current.tactical, retreat: !!val },
                                })))}
                              />
                              <GameStep
                                label="Loss of Control"
                                size="sm"
                                checked={player.tactical.lol}
                                onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                                  ...current,
                                  tactical: { ...current.tactical, lol: !!val },
                                })))}
                              />
                              <GameStep
                                label="Order Count"
                                size="sm"
                                checked={player.tactical.count}
                                onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                                  ...current,
                                  tactical: { ...current.tactical, count: !!val },
                                })))}
                              />
                            </div>
                            <ContextualHints phase="tactical" hints={getHints('tactical', playerName === "Opponent")} />
                          </GameGroup>
                          <GameStep
                            label="Impetuous Phase"
                            size="sm"
                            checked={player.impetuous}
                            onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                              ...current,
                              impetuous: !!val,
                            })))}
                          >
                            {playerName === "You" && <ContextualHints phase="impetuous" hints={getHints('impetuous')} />}
                          </GameStep>
                          <GameStep
                            label="Orders Phase"
                            size="sm"
                            checked={player.orders.done}
                            onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                              ...current,
                              orders: { ...current.orders, done: !!val },
                            })))}
                          >
                             {playerName === "You" && <ContextualHints phase="orders" hints={getHints('orders')} />}
                          </GameStep>
                          <GameStep
                            label="States Phase"
                            size="sm"
                            checked={player.states}
                            onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                              ...current,
                              states: !!val,
                            })))}
                          >
                            {playerName === "You" && <ContextualHints phase="states" hints={getHints('states')} />}
                          </GameStep>
                          <GameStep
                            label="End of Turn"
                            size="sm"
                            checked={player.end}
                            onCheckedChange={(val) => setGameStep(prev => updateTurnPlayer(prev, tKey, pKey, (current) => ({
                              ...current,
                              end: !!val,
                            })))}
                          />
                        </div>

                        {/* Round-end objectives for this player */}
                        {activeMission && (
                          <div className="mt-3 space-y-2 bg-muted/20 p-2 rounded-md border border-border/50">
                            <div className="text-[9px] font-bold uppercase text-muted-foreground px-1">Round {turnNum} Objectives</div>
                            <div className="grid gap-1.5">
                              {activeMission.objectives
                                .filter(isRoundObjective)
                                .map((obj) => {
                                  const val = turn.objectives[scoringSide][obj.id]

                                  return (
                                    <div key={obj.id} className="flex items-center justify-between gap-2 px-1">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className={cn(
                                            "size-3.5 rounded border border-primary/20 flex items-center justify-center transition-colors cursor-pointer",
                                            val ? "bg-primary/40 text-primary-foreground border-primary/40" : "bg-background"
                                          )}
                                          onClick={() => {
                                            setGameStep(prev => {
                                              return toggleRoundObjective(prev, tKey, scoringSide, obj)
                                            })
                                          }}
                                        >
                                          {val ? <CheckCircle2Icon className="size-2.5" /> : null}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground leading-tight">{obj.text}</span>
                                      </div>
                                      {obj.type === 'round-end-manual' && (
                                        <span className="text-[9px] font-bold text-primary/60">{val || 0}/{obj.max}</span>
                                      )}
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </GameGroup>
            )
          })}

          {/* 5. Final Scoring */}
          <GameGroup
            label="5. Final Scoring"
            value="scoring"
            checked={gameStep.scoring.doneOverride}
            onCheckedChange={(val) => setGameStep(prev => ({ ...prev, scoring: { ...prev.scoring, doneOverride: !!val } }))}
          >
            <div className="space-y-6">
              <div className="grid grid-cols-4 gap-2 text-[9px] font-bold uppercase text-muted-foreground px-1">
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

              {scoringSides.map((role) => {
                const isPlayer = role === 'player'
                const op = isPlayer ? playerOP : opponentOP
                const rivalOp = isPlayer ? opponentOP : playerOP

                const assignedRole = getAssignedMissionRole(activeMission, gameStep, role)

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
                        value={gameStep.scoring[role].vp}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          const val = e.target.value
                          setGameStep(prev => ({
                            ...prev,
                            scoring: {
                              ...prev.scoring,
                              [role]: { ...prev.scoring[role], vp: val === "" ? 0 : parseInt(val) }
                            }
                          }))
                        }}
                      />
                    </div>

                    {/* Classifieds Input */}
                    <div className="flex items-center justify-between px-1 py-1 border-b border-border/50 ml-2 border-l-2 border-muted/30 pl-4">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Classified Points</span>
                        <Input
                            type="number"
                            min={0}
                            max={10}
                            className="h-6 w-12 text-center text-[10px] px-1 bg-muted/30 focus:bg-background"
                            value={gameStep.scoring[role].classifieds}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                                const val = e.target.value
                                setGameStep(prev => ({
                                    ...prev,
                                    scoring: {
                                        ...prev.scoring,
                                        [role]: { ...prev.scoring[role], classifieds: val === "" ? 0 : parseInt(val) }
                                    }
                                }))
                            }}
                        />
                    </div>

                    {/* Objective Checklist for this player */}
                    {activeMission && (
                      <div className="pl-4 pr-1 py-1 space-y-2 border-l-2 border-muted/30 ml-2">
                        {activeMission.objectives
                          .filter((obj) => objectiveAppliesToRole(obj, assignedRole))
                          .map((obj) => {
                            const isRoundEnd = isRoundObjective(obj)
                            // Sum progress for round-end objectives
                            const roundProgress = isRoundEnd
                              ? getRoundObjectiveProgress(gameStep, role, obj.id)
                              : 0

                            return (
                              <div key={obj.id} className="flex items-start justify-between gap-2 opacity-90">
                                <div className="flex items-center gap-2 flex-1">
                                  <div
                                    className={cn(
                                      "size-4 rounded border border-primary/20 flex items-center justify-center transition-colors",
                                      (isRoundEnd ? roundProgress > 0 : gameStep.scoring[role].objectives[obj.id])
                                        ? "bg-primary/40 text-primary-foreground border-primary/40"
                                        : "bg-muted/30",
                                      isRoundEnd && "cursor-default" // Readonly for round end
                                    )}
                                    onClick={() => {
                                      if (isRoundEnd) return // Managed in turn tracker
                                      setGameStep(prev => toggleScoringObjective(prev, role, obj))
                                    }}
                                  >
                                    {(isRoundEnd ? roundProgress > 0 : gameStep.scoring[role].objectives[obj.id]) ? (
                                      <CheckCircle2Icon className="size-3" />
                                    ) : null}
                                  </div>
                                  <span className={cn(
                                    "text-[10px] leading-tight text-muted-foreground mr-1",
                                    isRoundEnd && "italic"
                                  )}>
                                    {obj.text} {isRoundEnd && <span className="text-[8px] font-bold opacity-50 ml-1">(Managed per-round)</span>}
                                  </span>
                                </div>
                                {(obj.type === 'manual' || obj.type === 'round-end-manual') && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-bold text-primary/60">
                                      {(isRoundEnd ? roundProgress : gameStep.scoring[role].objectives[obj.id]) || 0}/{isRoundEnd ? (obj.max * 3) : obj.max}
                                    </span>
                                  </div>
                                )}
                                <span className="text-[9px] font-bold text-muted-foreground/30 whitespace-nowrap pt-0.5">
                                  {obj.op} OP
                                </span>
                              </div>
                            )
                          })}
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
            Game Finished: {playerOP > opponentOP ? "Victory!" : playerOP === opponentOP ? "Draw" : "Defeat"}
          </div>
        )}
      </CardFooter>
    </Card >
  )
}
