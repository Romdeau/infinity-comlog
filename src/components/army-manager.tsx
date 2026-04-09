import * as React from "react"

import { ArmyListImporter } from "./army-list-importer"
import { useArmy } from "@/context/army-context"
import { type ArmyList } from "@/lib/army-parser"
import { type EnrichedArmyList, type StoredArmyList, unitService } from "@/lib/unit-service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  ArrowRightLeft,
  BookCopy,
  CheckIcon,
  CopyIcon,
  LibraryIcon,
  Loader2,
  ShieldCheck,
  Sword,
  Trash2,
} from "lucide-react"

interface ArmyManagerProps {
  containerClassName?: string
}

type ActiveListKey = "listA" | "listB"

type PairableList = Pick<EnrichedArmyList, "armyName" | "sectoralId" | "sectoralName" | "points">

export function ArmyManager({ containerClassName }: ArmyManagerProps) {
  const { lists, setLists, storedLists, deleteList } = useArmy()
  const { listA, listB } = lists
  const [importTarget, setImportTarget] = React.useState<ActiveListKey>("listA")
  const [loadingTarget, setLoadingTarget] = React.useState<ActiveListKey | null>(null)
  const [validationError, setValidationError] = React.useState<string | null>(null)

  const setActiveList = React.useCallback((key: ActiveListKey, list: EnrichedArmyList | null) => {
    setLists({
      ...lists,
      [key]: list,
    })
  }, [lists, setLists])

  const getPairValidationMessage = React.useCallback((candidate: PairableList, key: ActiveListKey) => {
    const otherKey = key === "listA" ? "listB" : "listA"
    const otherList = lists[otherKey]

    if (!otherList) return null

    if (otherList.sectoralId !== candidate.sectoralId) {
      return `This list does not match ${otherKey === "listA" ? "List A" : "List B"}. Both active lists need to use the same sectoral (${otherList.sectoralName}).`
    }

    if (otherList.points !== candidate.points) {
      return `This list does not match ${otherKey === "listA" ? "List A" : "List B"}. Both active lists need the same points value (${otherList.points}).`
    }

    return null
  }, [lists])

  const applyListToSlot = React.useCallback((key: ActiveListKey, list: EnrichedArmyList) => {
    const message = getPairValidationMessage(list, key)

    if (message) {
      setValidationError(message)
      setImportTarget(key)
      return false
    }

    setValidationError(null)
    setActiveList(key, list)
    return true
  }, [getPairValidationMessage, setActiveList])

  const handleListParsed = async (list: ArmyList | null, rawCode: string) => {
    if (!list) {
      setActiveList(importTarget, null)
      return
    }

    const message = getPairValidationMessage(list, importTarget)
    if (message) {
      setValidationError(message)
      return
    }

    setValidationError(null)
    setLoadingTarget(importTarget)

    try {
      const enriched = await unitService.enrichArmyList(list)
      enriched.rawCode = rawCode
      setActiveList(importTarget, enriched)
    } finally {
      setLoadingTarget(null)
    }
  }

  const storedEntries = Object.entries(storedLists)

  return (
    <div className={cn("grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]", containerClassName)}>
      <div className="space-y-6">
        <Card>
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <ArrowRightLeft className="size-4" />
              </div>
              <div>
                <CardTitle>Active Pair</CardTitle>
                <CardDescription>Keep two compatible lists ready for viewing, analysis, and live play.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <ActiveListPanel
              slotLabel="List A"
              icon={ShieldCheck}
              list={listA}
              isLoading={loadingTarget === "listA"}
              onClear={() => setActiveList("listA", null)}
              onImport={() => {
                setImportTarget("listA")
                setValidationError(null)
              }}
            />
            <ActiveListPanel
              slotLabel="List B"
              icon={Sword}
              list={listB}
              isLoading={loadingTarget === "listB"}
              onClear={() => setActiveList("listB", null)}
              onImport={() => {
                setImportTarget("listB")
                setValidationError(null)
              }}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <BookCopy className="size-4" />
              </div>
              <div>
                <CardTitle>Import List</CardTitle>
                <CardDescription>Paste an Infinity Army code and choose which active slot it should replace.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Import into</span>
              <TargetButton
                label="List A"
                icon={ShieldCheck}
                isActive={importTarget === "listA"}
                onClick={() => {
                  setImportTarget("listA")
                  setValidationError(null)
                }}
              />
              <TargetButton
                label="List B"
                icon={Sword}
                isActive={importTarget === "listB"}
                onClick={() => {
                  setImportTarget("listB")
                  setValidationError(null)
                }}
              />
              {loadingTarget && (
                <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  Updating {loadingTarget === "listA" ? "List A" : "List B"}
                </div>
              )}
            </div>

            {validationError && (
              <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <div className="space-y-1">
                  <p className="font-medium">Unable to apply this list</p>
                  <p className="text-destructive/80">{validationError}</p>
                </div>
              </div>
            )}

            <ArmyListImporter onListParsed={handleListParsed} />
          </CardContent>
        </Card>
      </div>

      <Card className="h-fit">
        <CardHeader className="gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-primary/10 p-2 text-primary">
                <LibraryIcon className="size-4" />
              </div>
              <div>
                <CardTitle>Saved Library</CardTitle>
                <CardDescription>Reuse imported lists without pasting the code again.</CardDescription>
              </div>
            </div>
            <Badge variant="secondary">{storedEntries.length}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {storedEntries.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 px-4 py-10 text-center text-sm text-muted-foreground">
              <LibraryIcon className="mx-auto mb-3 size-8 opacity-30" />
              <p className="font-medium text-foreground">No saved lists yet</p>
              <p className="mt-1">Import a list and it will be available here for quick reassignment.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {storedEntries.map(([id, list]) => (
                <LibraryListItem
                  key={id}
                  list={list}
                  isActiveA={isSameList(listA, list)}
                  isActiveB={isSameList(listB, list)}
                  onAssignA={() => applyListToSlot("listA", list)}
                  onAssignB={() => applyListToSlot("listB", list)}
                  onDelete={() => deleteList(id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TargetButton({
  label,
  icon: Icon,
  isActive,
  onClick,
}: {
  label: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
  onClick: () => void
}) {
  return (
    <Button variant={isActive ? "default" : "outline"} size="sm" onClick={onClick}>
      <Icon className="mr-2 size-4" />
      {label}
    </Button>
  )
}

function ActiveListPanel({
  slotLabel,
  icon: Icon,
  list,
  isLoading,
  onClear,
  onImport,
}: {
  slotLabel: string
  icon: React.ComponentType<{ className?: string }>
  list: EnrichedArmyList | null
  isLoading: boolean
  onClear: () => void
  onImport: () => void
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/15 p-4">
      <div className="flex items-center justify-between gap-3 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-primary" />
          <div>
            <div className="text-sm font-semibold">{slotLabel}</div>
            <div className="text-xs text-muted-foreground">{list ? "Ready to use across the app" : "No active list assigned"}</div>
          </div>
        </div>
        {isLoading ? (
          <Badge variant="secondary">
            <Loader2 className="size-3 animate-spin" />
            Loading
          </Badge>
        ) : (
          <Badge variant={list ? "secondary" : "outline"}>{list ? "Active" : "Empty"}</Badge>
        )}
      </div>

      <div className="mt-4">
        {list ? (
          <ArmyListDisplay list={list} onClear={onClear} />
        ) : (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-background/70 px-6 py-8 text-center">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">Nothing assigned to {slotLabel}</p>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Choose this slot in the importer below or pull a saved list from the library.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={onImport}>
              Import into {slotLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

function LibraryListItem({
  list,
  isActiveA,
  isActiveB,
  onAssignA,
  onAssignB,
  onDelete,
}: {
  list: StoredArmyList
  isActiveA: boolean
  isActiveB: boolean
  onAssignA: () => void
  onAssignB: () => void
  onDelete: () => void
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/15 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex min-w-0 items-center gap-2">
            {list.logo && <img src={list.logo} alt="" className="size-5 shrink-0 object-contain" />}
            <div className="truncate text-sm font-semibold">{list.armyName || "Unnamed list"}</div>
          </div>
          <div className="text-xs text-muted-foreground">{list.sectoralName} • {list.points} points</div>
          <div className="flex flex-wrap items-center gap-2">
            {isActiveA && <Badge variant="secondary">List A</Badge>}
            {isActiveB && <Badge variant="secondary">List B</Badge>}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 text-destructive hover:bg-destructive/10"
          onClick={onDelete}
          title="Delete from library"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button variant={isActiveA ? "secondary" : "outline"} size="sm" onClick={onAssignA}>
          <ShieldCheck className="mr-2 size-4" />
          Set as A
        </Button>
        <Button variant={isActiveB ? "secondary" : "outline"} size="sm" onClick={onAssignB}>
          <Sword className="mr-2 size-4" />
          Set as B
        </Button>
      </div>
    </div>
  )
}

function ArmyListDisplay({ list, onClear }: { list: EnrichedArmyList; onClear: () => void }) {
  const [copied, setCopied] = React.useState(false)

  const handleExport = () => {
    const code = list.rawCode || ("rawBase64" in list ? (list as StoredArmyList).rawBase64 : "") || ""
    if (!code) return

    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4 rounded-xl border border-border/70 bg-background/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex items-center gap-2">
            {list.logo && (
              <img
                src={list.logo}
                alt=""
                className="size-6 shrink-0 object-contain drop-shadow-sm"
              />
            )}
            <div className="truncate text-base font-semibold">{list.armyName || "Unnamed List"}</div>
          </div>
          <p className="text-sm text-muted-foreground">{list.sectoralName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8 shrink-0", copied ? "text-primary" : "text-muted-foreground")}
            onClick={handleExport}
            title="Copy army code"
          >
            {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 text-destructive hover:bg-destructive/10"
            onClick={onClear}
            title="Clear active slot"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-xl border border-border/60 bg-muted/20 p-3 text-sm">
        <div>
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Faction</div>
          <div className="mt-1 font-medium text-foreground">{list.sectoralName}</div>
          {list.parentName && list.parentName !== list.sectoralName && (
            <div className="text-xs text-muted-foreground">{list.parentName}</div>
          )}
        </div>
        <div className="text-right">
          <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Points</div>
          <div className="mt-1 font-semibold text-foreground">{list.points}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Combat Groups</div>
        {list.combatGroups.map((group) => (
          <div key={group.groupNumber} className="rounded-xl border border-border/60 bg-muted/15 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-foreground">Group {group.groupNumber}</span>
              <span className="text-xs text-muted-foreground">{group.members.length} units</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.members.map((member, idx) => (
                <span
                  key={`${group.groupNumber}-${idx}`}
                  className="rounded-full border border-border/60 bg-background px-2.5 py-1 text-xs text-foreground/85"
                  title={member.name}
                >
                  {member.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function isSameList(current: EnrichedArmyList | null, candidate: StoredArmyList) {
  if (!current) return false

  return (
    current.armyName === candidate.armyName &&
    current.sectoralId === candidate.sectoralId &&
    JSON.stringify(current.combatGroups) === JSON.stringify(candidate.combatGroups)
  )
}
