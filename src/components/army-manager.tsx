import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArmyListImporter } from "./army-list-importer"
import { type ArmyList } from "@/lib/army-parser"
import { type EnrichedArmyList, unitService } from "@/lib/unit-service"
import { LayersIcon, Trash2, ShieldCheck, Sword, Loader2, LibraryIcon, CopyIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useArmy } from "@/context/army-context"

interface ArmyManagerProps {
  containerClassName?: string
}

export function ArmyManager({ containerClassName }: ArmyManagerProps) {
  const { lists, setLists, storedLists, deleteList } = useArmy()
  const { listA, listB } = lists
  const [loading, setLoading] = React.useState<string | null>(null)

  const setListA = (list: EnrichedArmyList | null) => {
    setLists({ ...lists, listA: list })
  }

  const setListB = (list: EnrichedArmyList | null) => {
    setLists({ ...lists, listB: list })
  }

  const handleListParsed = async (list: ArmyList | null, key: 'listA' | 'listB', rawCode: string) => {
    if (!list) {
      if (key === 'listA') setListA(null)
      else setListB(null)
      return
    }

    // Validation: Check against existing list
    const otherKey = key === 'listA' ? 'listB' : 'listA'
    const otherList = lists[otherKey]

    if (otherList) {
      if (otherList.sectoralId !== list.sectoralId) {
        alert(`Sectoral mismatch! Both lists must be from the same sectoral (${otherList.sectoralName}).`)
        return
      }
      if (otherList.points !== list.points) {
        alert(`Points mismatch! Both lists must have the same points value (${otherList.points}).`)
        return
      }
    }

    setLoading(key)
    try {
      const enriched = await unitService.enrichArmyList(list)
      // Ensure rawCode is preserved
      enriched.rawCode = rawCode
      if (key === 'listA') setListA(enriched)
      else setListB(enriched)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className={cn("w-full overflow-hidden", containerClassName)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-lg p-2">
            <LayersIcon className="text-primary size-5" />
          </div>
          <div>
            <CardTitle className="text-lg">Army Lists</CardTitle>
            <CardDescription className="text-xs">Manage your tournament lists</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="listA" className="w-full">
          <TabsList className="w-full rounded-none h-10 bg-muted/30 border-b border-border/50">
            <TabsTrigger value="listA" className="flex-1 rounded-none data-[state=active]:bg-background transition-all text-xs gap-1.5">
              <ShieldCheck className="size-3.5" />
              List A
              {listA && <div className="size-1.5 rounded-full bg-green-500 animate-pulse ml-1" />}
              {loading === 'listA' && <Loader2 className="size-3 animate-spin ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="listB" className="flex-1 rounded-none data-[state=active]:bg-background transition-all text-xs gap-1.5">
              <Sword className="size-3.5" />
              List B
              {listB && <div className="size-1.5 rounded-full bg-green-500 animate-pulse ml-1" />}
              {loading === 'listB' && <Loader2 className="size-3 animate-spin ml-1" />}
            </TabsTrigger>
            <TabsTrigger value="library" className="flex-1 rounded-none data-[state=active]:bg-background transition-all text-xs gap-1.5">
              <LibraryIcon className="size-3.5" />
              Library
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listA" className="p-4 m-0 space-y-4">
            {listA ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <ArmyListDisplay list={listA} onClear={() => setListA(null)} />
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <ArmyListImporter onListParsed={(list, rawCode) => handleListParsed(list, 'listA', rawCode)} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="listB" className="p-4 m-0 space-y-4">
            {listB ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <ArmyListDisplay list={listB} onClear={() => setListB(null)} />
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <ArmyListImporter onListParsed={(list, rawCode) => handleListParsed(list, 'listB', rawCode)} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="library" className="p-4 m-0 space-y-4">
            <div className="space-y-4">
              {Object.keys(storedLists).length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <LibraryIcon className="size-8 mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No lists in your library yet.</p>
                  <p className="text-[10px]">Import a list to save it here.</p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {Object.entries(storedLists).map(([id, list]) => (
                    <div key={id} className="flex items-center justify-between p-2 rounded-md border border-border/50 bg-muted/20">
                      <div className="flex items-center gap-2 min-w-0">
                        {list.logo && <img src={list.logo} alt="" className="size-4 object-contain" />}
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{list.armyName || "Unnamed"}</div>
                          <div className="text-[10px] text-muted-foreground">{list.sectoralName} • {list.points}pt</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("size-7", (listA?.armyName === list.armyName && listA?.sectoralId === list.sectoralId) && "text-green-500")}
                          onClick={() => setListA(list)}
                          title="Set as List A"
                        >
                          <ShieldCheck className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn("size-7", (listB?.armyName === list.armyName && listB?.sectoralId === list.sectoralId) && "text-green-500")}
                          onClick={() => setListB(list)}
                          title="Set as List B"
                        >
                          <Sword className="size-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteList(id)}
                          title="Delete from Library"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function ArmyListDisplay({ list, onClear }: { list: EnrichedArmyList; onClear: () => void }) {
  const [copied, setCopied] = React.useState(false)

  const handleExport = () => {
    const code = list.rawCode || (list as any).rawBase64 || ""
    if (code) {
      navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {list.logo && (
            <img
              src={list.logo}
              alt=""
              className="size-6 object-contain filter drop-shadow-sm"
            />
          )}
          <div className="font-bold text-sm truncate max-w-[150px]">
            {list.armyName || "Unnamed List"}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn("size-8 transition-colors shrink-0", copied ? "text-green-500" : "text-muted-foreground hover:text-primary")}
            onClick={handleExport}
            title="Export Army Code (Base64)"
          >
            {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 text-destructive hover:text-white hover:bg-destructive transition-colors shrink-0"
            onClick={onClear}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-muted-foreground border-y border-border/50 py-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-[9px] uppercase font-bold tracking-tight opacity-60">Faction</span>
          <span className="text-foreground font-semibold text-xs leading-tight">
            {list.sectoralName}
          </span>
          {list.parentName && list.parentName !== list.sectoralName && (
            <span className="text-[10px] italic">({list.parentName})</span>
          )}
        </div>
        <div className="flex flex-col gap-0.5 text-right">
          <span className="text-[9px] uppercase font-bold tracking-tight opacity-60">Points</span>
          <span className="text-foreground font-bold text-sm tracking-tight">{list.points}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground opacity-50 flex items-center gap-2">
          Composition
          <div className="h-px flex-1 bg-border/50" />
        </div>
        {list.combatGroups.map(group => (
          <div key={group.groupNumber} className="bg-muted/30 p-2 rounded-md border border-border/30 leading-tight">
            <div className="font-bold mb-1 text-primary/80 text-[11px] flex items-center justify-between">
              <span>Group {group.groupNumber}</span>
              <span className="opacity-60 font-normal">{group.members.length} units</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {group.members.map((m, idx) => (
                <div key={idx} className="text-[9px] bg-background border border-border/50 px-1.5 py-0.5 rounded-sm truncate max-w-[100px]" title={m.name}>
                  {m.name}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
