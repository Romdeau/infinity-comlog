import * as React from "react"
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

const SKILL_MAP: Record<number, string> = {
  238: "Hidden Deployment",
  47: "Infiltration",
  46: "Infiltration", // Inferior
  48: "Infiltration", // Superior
  161: "Forward Deployment",
  25: "Booty",
  35: "Combat Jump",
  33: "Parachutist",
  251: "Strategic Deployment",
  28: "Camouflage"
}

export function InfinityGameFlow({ armyLists }: { armyLists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null } }) {
  const { activeSession, updateActiveSession, createSession } = useGame()

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
  const setGameStep = (updater: GameSession['state'] | ((prev: GameSession['state']) => GameSession['state'])) => {
    updateActiveSession((prev: GameSession['state']) => {
      if (typeof updater === 'function') {
        return updater(prev)
      }
      return updater
    })
  }

  // Helper to get active mission details
  const activeMission = missions.find(m => m.id === gameStep.scenario)

  const assistance = React.useMemo(() => {
    if (gameStep.selectedList === 'none') return [];
    const list = armyLists[gameStep.selectedList];
    if (!list) return [];

    const items: { id: string; unitName: string; skills: string[] }[] = [];

    list.combatGroups.forEach((group, gIdx) => {
      group.members.forEach((member, mIdx) => {
        const relevantSkills = new Set<string>();

        const check = (s: { id: number }) => {
          const skillName = SKILL_MAP[s.id];
          if (skillName) {
            relevantSkills.add(skillName);
          }
        };

        if (member.skills) member.skills.forEach(check);
        if (member.equip) member.equip.forEach(check);

        if (relevantSkills.size > 0) {
          items.push({
            // Use a stable ID based on position in the list
            id: `${gameStep.selectedList}-${gIdx}-${mIdx}-${member.id}`,
            unitName: member.name || `Unit ${member.id}`,
            skills: Array.from(relevantSkills)
          });
        }
      });
    });

    return items;
  }, [armyLists, gameStep.selectedList]);

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
      if (gameStep.initiative.firstTurn !== null) {
        const isPlayer = role === 'player'
        const isFirst =
          (isPlayer && gameStep.initiative.firstTurn === 'player') ||
          (!isPlayer && gameStep.initiative.firstTurn === 'opponent')
        assignedRole = isFirst ? 'attacker' : 'defender'
      }
    }

    activeMission.objectives.forEach((obj: any) => {
      if (obj.role && obj.role !== assignedRole) return

      if (obj.type === 'manual') {
        total += (objProgress[obj.id] || 0) * obj.op
      } else if (obj.type === 'boolean') {
        if (objProgress[obj.id]) total += obj.op
      } else if (obj.type === 'round-end-boolean' || obj.type === 'round-end-manual') {
        // Sum from turns
        Object.keys(gameStep.turns).forEach(tKey => {
          const val = (gameStep.turns as any)[tKey].objectives[role][obj.id]
          if (obj.type === 'round-end-boolean' && val === true) total += obj.op
          else if (obj.type === 'round-end-manual' && typeof val === 'number') total += val * obj.op
        })
      }
    })
    return Math.min(10, total)
  }

  const playerOP = calculateOP('player')
  const opponentOP = calculateOP('opponent')

  const completedCount = [
    isSetupComplete,
    isTurnComplete(gameStep.turns.turn1),
    isTurnComplete(gameStep.turns.turn2),
    isTurnComplete(gameStep.turns.turn3),
    gameStep.scoring.doneOverride
  ].filter(Boolean).length

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-lg p-2">
            <SwordIcon className="text-primary size-5" />
          </div>
          <div>
            <CardTitle>Infinity Game Flow</CardTitle>
            <CardDescription>N5 Sequence of Play & Scoring</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* 1. Setup & Initiative */}
          <GameGroup
            label="1. Setup & Initiative"
            value="setup"
            checked={isSetupComplete || gameStep.setupDoneOverride}
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
                      {missions.map(m => (
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
                      onValueChange={(val) => setGameStep(prev => ({ ...prev, selectedList: val as any, listPicked: val !== 'none' }))}
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
                    <div className="grid grid-cols-2 gap-2">
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

                    <div className="grid grid-cols-2 gap-2">
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

                  <GameStep
                    label="Deployment"
                    size="sm"
                    checked={gameStep.initiationSubSteps.deployment}
                    onCheckedChange={(val) => setGameStep(prev => ({ ...prev, initiationSubSteps: { ...prev.initiationSubSteps, deployment: !!val } }))}
                  />

                  {assistance.length > 0 && (
                    <div className="border border-fuchsia-500/20 rounded-lg bg-fuchsia-500/5 p-3 space-y-3">
                      <div className="flex items-center gap-2 text-fuchsia-500 font-bold text-[11px] uppercase tracking-wider">
                        <LayersIcon className="size-3.5" />
                        Deployment Assistance
                      </div>
                      <div className="grid gap-2">
                        {assistance.map((item) => (
                          <label key={item.id} className="flex items-center justify-between bg-background/40 p-2 rounded border border-border/40 cursor-pointer hover:bg-background/60 transition-colors">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={gameStep.deploymentDetails.deployedUnits[item.id] || false}
                                onCheckedChange={(val) => setGameStep(p => ({
                                  ...p,
                                  deploymentDetails: {
                                    ...p.deploymentDetails,
                                    deployedUnits: {
                                      ...p.deploymentDetails.deployedUnits,
                                      [item.id]: val as boolean
                                    }
                                  }
                                }))}
                              />
                              <span className={cn(
                                "text-[10px] font-bold uppercase tracking-tight",
                                gameStep.deploymentDetails.deployedUnits[item.id] && "text-muted-foreground line-through opacity-70"
                              )}>{item.unitName}</span>
                            </div>
                            <div className="flex flex-wrap gap-1 justify-end">
                              {item.skills.map((skill, i) => (
                                <div key={i} className={cn(
                                  "text-[9px] px-2 py-0.5 rounded-md border flex items-center gap-1",
                                  skill === "Booty"
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                    : "bg-muted/50 text-muted-foreground border-border"
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
                        ))}
                      </div>
                    </div>
                  )}

                  <GameStep
                    label="Command Tokens"
                    size="sm"
                    checked={gameStep.initiationSubSteps.commandTokens}
                    onCheckedChange={(val) => setGameStep(prev => ({ ...prev, initiationSubSteps: { ...prev.initiationSubSteps, commandTokens: !!val } }))}
                  />
                </div>
              </div>
            </div>
          </GameGroup>

          {/* 2-4. Turns */}
          {[1, 2, 3].map((turnNum) => {
            const tKey = `turn${turnNum}` as keyof typeof gameStep.turns
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
                  {['p1', 'p2'].map((pKey) => {
                    const player = (turn as any)[pKey]
                    const label = pKey === 'p1' ? "First Player" : "Second Player"
                    const playerName = (pKey === 'p1' && gameStep.initiative.firstTurn === 'player') || (pKey === 'p2' && gameStep.initiative.firstTurn === 'player') ? "You" : "Opponent"

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
                            onCheckedChange={(val) => setGameStep(prev => {
                              const newTurns = { ...prev.turns }
                              const t = (newTurns as any)[tKey]
                              t[pKey].tactical.doneOverride = !!val
                              return { ...prev, turns: newTurns }
                            })}
                          >
                            <div className="grid gap-1">
                              <GameStep
                                label="Command Tokens"
                                size="sm"
                                checked={player.tactical.tokens}
                                onCheckedChange={(val) => setGameStep(prev => {
                                  const newTurns = { ...prev.turns }
                                  const t = (newTurns as any)[tKey]
                                  t[pKey].tactical.tokens = !!val
                                  return { ...prev, turns: newTurns }
                                })}
                              />
                              <GameStep
                                label="Retreat! Check"
                                size="sm"
                                checked={player.tactical.retreat}
                                onCheckedChange={(val) => setGameStep(prev => {
                                  const newTurns = { ...prev.turns }
                                  const t = (newTurns as any)[tKey]
                                  t[pKey].tactical.retreat = !!val
                                  return { ...prev, turns: newTurns }
                                })}
                              />
                              <GameStep
                                label="Loss of Control"
                                size="sm"
                                checked={player.tactical.lol}
                                onCheckedChange={(val) => setGameStep(prev => {
                                  const newTurns = { ...prev.turns }
                                  const t = (newTurns as any)[tKey]
                                  t[pKey].tactical.lol = !!val
                                  return { ...prev, turns: newTurns }
                                })}
                              />
                              <GameStep
                                label="Order Count"
                                size="sm"
                                checked={player.tactical.count}
                                onCheckedChange={(val) => setGameStep(prev => {
                                  const newTurns = { ...prev.turns }
                                  const t = (newTurns as any)[tKey]
                                  t[pKey].tactical.count = !!val
                                  return { ...prev, turns: newTurns }
                                })}
                              />
                            </div>
                          </GameGroup>
                          <GameStep
                            label="Impetuous Phase"
                            size="sm"
                            checked={player.impetuous}
                            onCheckedChange={(val) => setGameStep(prev => {
                              const newTurns = { ...prev.turns }
                              const t = (newTurns as any)[tKey]
                              t[pKey].impetuous = !!val
                              return { ...prev, turns: newTurns }
                            })}
                          />
                          <GameStep
                            label="Orders Phase"
                            size="sm"
                            checked={player.orders}
                            onCheckedChange={(val) => setGameStep(prev => {
                              const newTurns = { ...prev.turns }
                              const t = (newTurns as any)[tKey]
                              t[pKey].orders = !!val
                              return { ...prev, turns: newTurns }
                            })}
                          />
                          <GameStep
                            label="States Phase"
                            size="sm"
                            checked={player.states}
                            onCheckedChange={(val) => setGameStep(prev => {
                              const newTurns = { ...prev.turns }
                              const t = (newTurns as any)[tKey]
                              t[pKey].states = !!val
                              return { ...prev, turns: newTurns }
                            })}
                          />
                          <GameStep
                            label="End of Turn"
                            size="sm"
                            checked={player.end}
                            onCheckedChange={(val) => setGameStep(prev => {
                              const newTurns = { ...prev.turns }
                              const t = (newTurns as any)[tKey]
                              t[pKey].end = !!val
                              return { ...prev, turns: newTurns }
                            })}
                          />
                        </div>

                        {/* Round-end objectives for this player */}
                        {activeMission && (
                          <div className="mt-3 space-y-2 bg-muted/20 p-2 rounded-md border border-border/50">
                            <div className="text-[9px] font-bold uppercase text-muted-foreground px-1">Round {turnNum} Objectives</div>
                            <div className="grid gap-1.5">
                              {activeMission.objectives
                                .filter((obj: any) => obj.type.startsWith('round-end'))
                                .map((obj: any) => {
                                  const role = playerName === "You" ? "player" : "opponent"
                                  const val = (turn as any).objectives[role][obj.id]

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
                                              const newTurns = { ...prev.turns }
                                              const t = (newTurns as any)[tKey]
                                              if (obj.type === 'round-end-manual') {
                                                const current = t.objectives[role][obj.id] || 0
                                                t.objectives[role][obj.id] = current >= obj.max ? 0 : current + 1
                                              } else {
                                                t.objectives[role][obj.id] = !t.objectives[role][obj.id]
                                              }
                                              return { ...prev, turns: newTurns }
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
                      <div className="pl-4 pr-1 py-1 space-y-2 border-l-2 border-muted/30 ml-2">
                        {activeMission.objectives
                          .filter((obj: any) => !obj.role || obj.role === assignedRole)
                          .map((obj: any) => {
                            const isRoundEnd = obj.type.startsWith('round-end')
                            // Sum progress for round-end objectives
                            let roundProgress = 0
                            if (isRoundEnd) {
                              Object.keys(gameStep.turns).forEach(tKey => {
                                const val = (gameStep.turns as any)[tKey].objectives[role][obj.id]
                                if (typeof val === 'number') roundProgress += val
                                else if (val === true) roundProgress += 1
                              })
                            }

                            return (
                              <div key={obj.id} className="flex items-start justify-between gap-2 opacity-90">
                                <div className="flex items-center gap-2 flex-1">
                                  <div
                                    className={cn(
                                      "size-4 rounded border border-primary/20 flex items-center justify-center transition-colors",
                                      (isRoundEnd ? roundProgress > 0 : gameStep.scoring[role as 'player' | 'opponent'].objectives[obj.id])
                                        ? "bg-primary/40 text-primary-foreground border-primary/40"
                                        : "bg-muted/30",
                                      isRoundEnd && "cursor-default" // Readonly for round end
                                    )}
                                    onClick={() => {
                                      if (isRoundEnd) return // Managed in turn tracker
                                      setGameStep(prev => {
                                        const objectives = { ...prev.scoring[role as 'player' | 'opponent'].objectives }
                                        if (obj.type === 'manual') {
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
                                    {(isRoundEnd ? roundProgress > 0 : gameStep.scoring[role as 'player' | 'opponent'].objectives[obj.id]) ? (
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
                                      {(isRoundEnd ? roundProgress : gameStep.scoring[role as 'player' | 'opponent'].objectives[obj.id]) || 0}/{isRoundEnd ? (obj.max * 3) : obj.max}
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
            Game Finished
          </div>
        )}
      </CardFooter>
    </Card >
  )
}
