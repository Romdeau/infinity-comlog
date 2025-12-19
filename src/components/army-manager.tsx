import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArmyListImporter } from "./army-list-importer"
import { type ArmyList } from "@/lib/army-parser"
import { type EnrichedArmyList, unitService } from "@/lib/unit-service"
import { LayersIcon, Trash2, ShieldCheck, Sword, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionWrapper } from "@/components/layout-containers"

interface ArmyManagerProps {
  onListsChanged: (lists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }) => void
  containerClassName?: string
}

export function ArmyManager({ onListsChanged, containerClassName }: ArmyManagerProps) {
  const [listA, setListA] = React.useState<EnrichedArmyList | null>(null)
  const [listB, setListB] = React.useState<EnrichedArmyList | null>(null)
  const [loading, setLoading] = React.useState<string | null>(null)

  React.useEffect(() => {
    onListsChanged({ listA, listB })
  }, [listA, listB, onListsChanged])

  const handleListParsed = async (list: ArmyList | null, key: 'listA' | 'listB') => {
    if (!list) {
      if (key === 'listA') setListA(null)
      else setListB(null)
      return
    }

    setLoading(key)
    try {
      const enriched = await unitService.enrichArmyList(list)
      if (key === 'listA') setListA(enriched)
      else setListB(enriched)
    } finally {
      setLoading(null)
    }
  }

  return (
    <SectionWrapper
      title="Army List Integration"
      className="items-start justify-center"
      containerClassName={containerClassName}
    >
      <Card className="w-full overflow-hidden">
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
            </TabsList>

            <TabsContent value="listA" className="p-4 m-0 space-y-4">
              {listA ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <ArmyListDisplay list={listA} onClear={() => setListA(null)} />
                </div>
              ) : (
                <div className="animate-in fade-in duration-300">
                  <ArmyListImporter onListParsed={(list) => handleListParsed(list, 'listA')} />
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
                  <ArmyListImporter onListParsed={(list) => handleListParsed(list, 'listB')} />
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </SectionWrapper>
  )
}

function ArmyListDisplay({ list, onClear }: { list: EnrichedArmyList; onClear: () => void }) {
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
          <div className="font-bold text-sm truncate max-w-[180px]">
            {list.armyName || "Unnamed List"}
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-destructive hover:text-white hover:bg-destructive transition-colors shrink-0"
          onClick={onClear}
        >
          <Trash2 className="size-4" />
        </Button>
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
