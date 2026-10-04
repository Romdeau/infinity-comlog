import { useEffect, useMemo, useState } from "react"
import { UsersIcon } from "lucide-react"
import {
  loadFactionData,
  type FactionPayload,
} from "@/lib/faction-data-service"
import { getFireteamChoices, type FireteamChoice } from "@/lib/fireteam-options"
import type { EnrichedArmyList } from "@/lib/unit-service"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { withOrderMetadata } from "@/lib/order-counts"
import { OrderSummary } from "./order-summary"
import { UnitCard } from "./unit-card"

type Selection = { group: number; choice: string; members: number[] }
const grid = "grid gap-4 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-2"

export function FireteamRoster({ list }: { list: EnrichedArmyList }) {
  const [data, setData] = useState<{
    id: number
    payload: FactionPayload | null
  } | null>(null)
  useEffect(() => {
    let active = true
    if (list.sectoralId)
      void loadFactionData(list.sectoralId).then((payload) => {
        if (active) setData({ id: list.sectoralId, payload })
      })
    return () => {
      active = false
    }
  }, [list.sectoralId])
  const payload = data && data.id === list.sectoralId ? data.payload : null
  const identity = JSON.stringify([
    list.sectoralId,
    list.combatGroups.map((group) =>
      group.members.map((member) => [
        member.id,
        member.groupId,
        member.optionId,
        member.teamOps,
      ])
    ),
  ])
  const roster = useMemo(
    () => ({
      ...list,
      combatGroups: list.combatGroups.map((group) => ({
        ...group,
        members: group.members.map((member) =>
          withOrderMetadata(member, payload)
        ),
      })),
    }),
    [list, payload]
  )
  return (
    <>
      <OrderSummary list={roster} />
      <Roster
        key={identity}
        list={roster}
        data={payload}
        storageKey={`comlog_fireteams:${identity}`}
        loading={!!list.sectoralId && data?.id !== list.sectoralId}
      />
    </>
  )
}

function Roster({
  list,
  data,
  storageKey,
  loading,
}: {
  list: EnrichedArmyList
  data: FactionPayload | null
  storageKey: string
  loading: boolean
}) {
  const choices = useMemo(
    () =>
      list.combatGroups.map((group) =>
        data ? getFireteamChoices(group.members, data) : []
      ),
    [data, list]
  )
  const [saved, setSaved] = useLocalStorage<Selection[]>(storageKey, [], {
    validate: (value) =>
      Array.isArray(value) &&
      value.every(
        (item) =>
          item &&
          Number.isInteger(item.group) &&
          typeof item.choice === "string" &&
          Array.isArray(item.members) &&
          item.members.every(Number.isInteger)
      )
        ? (value as Selection[])
        : undefined,
  })
  const [editing, setEditing] = useState<{
    group: number
    choice: FireteamChoice
  } | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  // Revalidate persisted selections against current faction data and army-wide caps.
  const teams: Selection[] = []
  saved.forEach((team) => {
    const choice = choices[team.group]?.find(
      (choice) => choice.key === team.choice
    )
    if (
      !choice ||
      !choice.combinations.some(
        (combo) =>
          combo.length === team.members.length &&
          combo.every((index) => team.members.includes(index))
      )
    )
      return
    if (
      teams.some(
        (other) =>
          other.group === team.group &&
          other.members.some((index) => team.members.includes(index))
      )
    )
      return
    if (
      teams.filter(
        (other) =>
          choices[other.group].find((choice) => choice.key === other.choice)
            ?.type === choice.type
      ).length >= (data?.fireteamChart?.spec[choice.type] || 0)
    )
      return
    teams.push(team)
  })
  const available = (group: number, choice: FireteamChoice) => {
    if (
      teams.filter(
        (team) =>
          choices[team.group].find((other) => other.key === team.choice)
            ?.type === choice.type
      ).length >= (data?.fireteamChart?.spec[choice.type] || 0)
    )
      return []
    return choice.combinations.filter(
      (combo) =>
        !teams.some(
          (team) =>
            team.group === group &&
            team.members.some((index) => combo.includes(index))
        )
    )
  }
  const openChoice = (group: number, choice: FireteamChoice) => {
    setSelected([])
    setEditing({ group, choice })
  }
  const combinations = editing ? available(editing.group, editing.choice) : []
  const valid = combinations.some(
    (combo) =>
      combo.length === selected.length &&
      combo.every((index) => selected.includes(index))
  )
  return (
    <>
      <p className="text-sm text-muted-foreground print:hidden">
        {loading
          ? "Loading fireteam chart…"
          : !data?.fireteamChart
            ? "Fireteam chart unavailable for this list."
            : "Fireteam badges show compatible units in this combat group. Choose members to group them. Selections are saved on this device."}
      </p>
      {list.combatGroups.map((group, gIdx) => {
        const assigned = new Set(
          teams
            .filter((team) => team.group === gIdx)
            .flatMap((team) => team.members)
        )
        const card = (index: number) => (
          <UnitCard
            key={index}
            unit={group.members[index]}
            fireteams={
              !assigned.has(index) &&
              choices[gIdx].some((choice) =>
                available(gIdx, choice).some((combo) => combo.includes(index))
              ) ? (
                <div className="flex flex-wrap gap-1 border-b border-border bg-status-info/5 px-3 py-2">
                  {choices[gIdx]
                    .filter((choice) =>
                      available(gIdx, choice).some((combo) =>
                        combo.includes(index)
                      )
                    )
                    .map((choice) => (
                      <button
                        key={choice.key}
                        onClick={() => openChoice(gIdx, choice)}
                        className="inline-flex items-center gap-1 rounded border border-status-info/40 px-2 py-1 text-left text-[10px] font-semibold text-status-info hover:bg-status-info/10 focus-visible:outline-2 focus-visible:outline-primary"
                        title="Choose fireteam members"
                      >
                        <UsersIcon className="size-3 shrink-0" />
                        {choice.name} · {choice.type}
                      </button>
                    ))}
                </div>
              ) : undefined
            }
          />
        )
        return (
          <section key={gIdx} className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-border pb-1">
              <h2 className="font-display text-lg font-semibold uppercase">
                Combat Group {group.groupNumber}
              </h2>
              <Badge variant="secondary">{group.members.length} Units</Badge>
            </div>
            {teams
              .filter((team) => team.group === gIdx)
              .map((team, index) => {
                const choice = choices[gIdx].find(
                  (choice) => choice.key === team.choice
                )!
                return (
                  <section
                    key={`${team.choice}-${team.members.join("-")}`}
                    aria-label={`${choice.name} ${choice.type}`}
                    className="space-y-3 rounded-lg border-2 border-status-info/50 bg-status-info/5 p-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="flex items-center gap-2 font-display font-semibold text-status-info">
                        <UsersIcon className="size-4" />
                        {choice.name} · {choice.type} · Team {index + 1}
                      </h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="print:hidden"
                        onClick={() =>
                          setSaved(teams.filter((other) => other !== team))
                        }
                      >
                        Ungroup
                      </Button>
                    </div>
                    {choice.notes && (
                      <p className="text-sm text-muted-foreground">
                        {choice.notes}
                      </p>
                    )}
                    <div className={grid}>{team.members.map(card)}</div>
                  </section>
                )
              })}
            <div className={grid}>
              {group.members.map((_, index) =>
                !assigned.has(index) ? card(index) : null
              )}
            </div>
          </section>
        )
      })}
      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing?.choice.name} · {editing?.choice.type}
            </DialogTitle>
            <DialogDescription>
              Choose{" "}
              {editing?.choice.type === "DUO"
                ? "2"
                : editing?.choice.type === "HARIS"
                  ? "3"
                  : "3–5"}{" "}
              members. Only combinations meeting the chart's composition limits
              can be grouped.
            </DialogDescription>
          </DialogHeader>
          {editing?.choice.notes && (
            <p className="rounded border border-border p-3 text-sm">
              {editing.choice.notes}
            </p>
          )}
          <div className="space-y-2">
            {editing &&
              list.combatGroups[editing.group].members.map((member, index) => {
                if (!combinations.some((combo) => combo.includes(index)))
                  return null
                const checked = selected.includes(index)
                const disabled =
                  !checked &&
                  !combinations.some(
                    (combo) =>
                      combo.includes(index) &&
                      selected.every((member) => combo.includes(member))
                  )
                return (
                  <label
                    key={index}
                    className={`flex items-center gap-3 rounded border border-border p-3 ${disabled ? "opacity-40" : "cursor-pointer hover:bg-muted"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() =>
                        setSelected(
                          checked
                            ? selected.filter((member) => member !== index)
                            : [...selected, index]
                        )
                      }
                    />
                    <span className="text-sm">
                      <span className="font-semibold">
                        {index + 1}. {member.name}
                      </span>
                      <span className="ml-2 text-muted-foreground">
                        {member.points} PT
                        {member.isLieutenant ? " · Lieutenant" : ""}
                      </span>
                    </span>
                  </label>
                )
              })}
          </div>
          <p className="text-xs text-muted-foreground">
            {selected.length} selected. This checks roster composition. Apply
            chart notes, deployment and game-state restrictions at the table.
          </p>
          <Button
            disabled={!valid}
            onClick={() => {
              if (editing && valid) {
                setSaved([
                  ...teams,
                  {
                    group: editing.group,
                    choice: editing.choice.key,
                    members: [...selected].sort((a, b) => a - b),
                  },
                ])
                setEditing(null)
              }
            }}
          >
            Group fireteam
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
