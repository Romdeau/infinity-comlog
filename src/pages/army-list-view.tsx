/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { useArmy } from "@/context/army-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2Icon } from "lucide-react"
import { SKILL_MAP, WEAPON_MAP, EQUIP_MAP } from "@/lib/constants";

export default function ArmyListViewPage() {
  const { lists } = useArmy()

  if (!lists.listA && !lists.listB) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md border-dashed">
          <CardHeader className="text-center">
            <CardTitle>No Army Lists Loaded</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground">
            Please import an army list in the Army Lists page first.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Tabs defaultValue="listA" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="listA" disabled={!lists.listA}>
            {lists.listA?.armyName || "List A"}
          </TabsTrigger>
          <TabsTrigger value="listB" disabled={!lists.listB}>
            {lists.listB?.armyName || "List B"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="listA" className="mt-4">
          {lists.listA && <ListView list={lists.listA} />}
        </TabsContent>
        <TabsContent value="listB" className="mt-4">
          {lists.listB && <ListView list={lists.listB} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ListView({ list }: { list: any }) {
  return (
    <div className="space-y-8">
      {list.combatGroups.map((group: any, gIdx: number) => (
        <div key={gIdx} className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <h2 className="text-xl font-bold tracking-tight">Combat Group {group.groupNumber}</h2>
            <Badge variant="secondary">{group.members.length} Units</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {group.members.map((member: any, mIdx: number) => (
              <UnitCard key={`${gIdx}-${mIdx}`} unit={member} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function UnitCard({ unit }: { unit: any }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full border-muted-foreground/20 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="bg-muted/30 p-3 border-b border-muted-foreground/10">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            {unit.logo ? (
              <img src={unit.logo} alt="" className="size-10 object-contain shrink-0" />
            ) : (
              <div className="size-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                <span className="text-[10px] text-muted-foreground">N/A</span>
              </div>
            )}
            <div className="min-w-0">
              <CardTitle className="text-sm font-bold uppercase truncate leading-tight">{unit.name}</CardTitle>
              <div className="text-[10px] text-muted-foreground uppercase font-medium tracking-wider truncate">
                {unit.type} • {unit.isc}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <Badge variant="outline" className="text-[10px] font-bold h-5 px-1.5">S{unit.s}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        {/* Stat Line */}
        <div className="grid grid-cols-9 border-b border-muted-foreground/10 text-center text-[9px] font-bold uppercase bg-muted/10">
          <div className="border-r border-muted-foreground/10 py-1">MOV</div>
          <div className="border-r border-muted-foreground/10 py-1">CC</div>
          <div className="border-r border-muted-foreground/10 py-1">BS</div>
          <div className="border-r border-muted-foreground/10 py-1">PH</div>
          <div className="border-r border-muted-foreground/10 py-1">WIP</div>
          <div className="border-r border-muted-foreground/10 py-1">ARM</div>
          <div className="border-r border-muted-foreground/10 py-1">BTS</div>
          <div className="border-r border-muted-foreground/10 py-1">W</div>
          <div className="py-1">S</div>
        </div>
        <div className="grid grid-cols-9 text-center text-xs border-b border-muted-foreground/10 font-medium">
          <div className="border-r border-muted-foreground/10 py-2 bg-background">{unit.mov}</div>
          <div className="border-r border-muted-foreground/10 py-2 bg-background">{unit.cc}</div>
          <div className="border-r border-muted-foreground/10 py-2 bg-background">{unit.bs}</div>
          <div className="border-r border-muted-foreground/10 py-2 bg-background">{unit.ph}</div>
          <div className="border-r border-muted-foreground/10 py-2 bg-background">{unit.wip}</div>
          <div className="border-r border-muted-foreground/10 py-2 bg-background">{unit.arm}</div>
          <div className="border-r border-muted-foreground/10 py-2 bg-background">{unit.bts}</div>
          <div className="border-r border-muted-foreground/10 py-2 bg-background">{unit.w}</div>
          <div className="py-2 bg-background">{unit.s}</div>
        </div>

        <div className="p-3 space-y-4 flex-1">
          {/* Skills */}
          {unit.skills && unit.skills.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Skills</div>
              <div className="flex flex-wrap gap-1">
                {unit.skills.map((s: any, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0 h-4 font-medium bg-primary/10 text-primary hover:bg-primary/20 border-none">
                    {SKILL_MAP[s.id] || `Skill ${s.id}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Equipment */}
          {unit.equip && unit.equip.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Equipment</div>
              <div className="flex flex-wrap gap-1">
                {unit.equip.map((e: any, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-medium border-muted-foreground/30">
                    {EQUIP_MAP[e.id] || `Equip ${e.id}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Weapons */}
          {unit.weapons && unit.weapons.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Weapons</div>
              <div className="flex flex-wrap gap-1">
                {unit.weapons.map((w: any, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-medium border-muted-foreground/30">
                    {WEAPON_MAP[w.id] || `Weapon ${w.id}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
