/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { useArmy } from "@/context/army-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PrinterIcon, InfoIcon, Maximize2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { MetadataService } from "@/lib/metadata-service";
import { WEAPON_DATA } from "@/lib/weapon-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ArmyListViewPage() {
  const { lists } = useArmy()

  const handlePrint = () => {
    window.print()
  }

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
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter bg-orange-500/10 px-2 py-0.5 rounded-full">
            Alpha Feature
          </span>
        </div>
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <PrinterIcon className="mr-2 size-4" />
          Print List
        </Button>
      </div>

      <Tabs defaultValue="listA" className="w-full">
        <TabsList className="grid w-full grid-cols-2 print:hidden">
          <TabsTrigger value="listA" disabled={!lists.listA}>
            {lists.listA?.armyName || "List A"}
          </TabsTrigger>
          <TabsTrigger value="listB" disabled={!lists.listB}>
            {lists.listB?.armyName || "List B"}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="listA" className="mt-4 print:mt-0">
          {lists.listA && <ListView list={lists.listA} />}
        </TabsContent>
        <TabsContent value="listB" className="mt-4 print:mt-0">
          {lists.listB && <ListView list={lists.listB} />}
        </TabsContent>
      </Tabs>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            margin: 1cm;
            size: auto;
          }
          body {
            background: white !important;
            color: black !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:mt-0 {
            margin-top: 0 !important;
          }
          .card {
            border: 1px solid #e2e8f0 !important;
            box-shadow: none !important;
            break-inside: avoid;
          }
        }
      `}} />
    </div>
  )
}

function ListView({ list }: { list: any }) {
  return (
    <div className="space-y-8">
      <div className="hidden print:block border-b-2 border-primary pb-4 mb-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-primary">{list.armyName}</h1>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{list.sectoralName}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-primary">{list.points} PT</div>
          </div>
        </div>
      </div>

      {list.combatGroups.map((group: any, gIdx: number) => (
        <div key={gIdx} className="space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-muted pb-1">
            <h2 className="text-lg font-black uppercase tracking-tight">Combat Group {group.groupNumber}</h2>
            <Badge variant="secondary" className="font-bold">{group.members.length} Units</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 print:grid-cols-2">
            {group.members.map((member: any, mIdx: number) => (
              <UnitCard key={`${gIdx}-${mIdx}`} unit={member} />
            ))}
          </div>
        </div>
      ))}

      {/* Weapons Chart */}
      <div className="mt-12 space-y-4 break-inside-avoid">
        <div className="flex items-center gap-2 border-b-2 border-primary pb-1">
          <h2 className="text-xl font-black uppercase tracking-tight text-primary">Weapons Chart</h2>
        </div>
        <WeaponChart list={list} />
      </div>
    </div>
  )
}

function WeaponChart({ list }: { list: any }) {
  // Collect all unique weapons from the list
  const weaponIds = new Set<number>();
  list.combatGroups.forEach((group: any) => {
    group.members.forEach((member: any) => {
      member.profiles.forEach((profile: any) => {
        profile.weapons.forEach((w: any) => weaponIds.add(w.id));
      });
    });
  });

  const sortedWeapons = Array.from(weaponIds)
    .flatMap(id => {
      const modes = WEAPON_DATA[id];
      if (!modes) return [];
      return modes.map(m => ({ id, ...m }));
    })
    .filter(w => w.name)
    .sort((a, b) => {
      const nameCompare = a.name.localeCompare(b.name);
      if (nameCompare !== 0) return nameCompare;
      return a.mode.localeCompare(b.mode);
    });

  if (sortedWeapons.length === 0) return null;

  return (
    <div className="overflow-x-auto border-2 border-muted rounded-lg shadow-sm bg-card">
      <table className="w-full text-[10px] border-collapse">
        <thead>
          <tr className="bg-muted text-muted-foreground uppercase font-black border-b-2 border-muted">
            <th className="p-2 text-left border-r-2 border-muted">Name</th>
            <th className="p-2 text-left border-r-2 border-muted">Mode</th>
            <th className="p-0 border-r-2 border-muted min-w-[280px]">
              <div className="grid grid-cols-7 text-[8px] text-center border-b border-muted bg-muted/30">
                <div className="col-span-7 py-0.5 tracking-widest">Range (Inches)</div>
              </div>
              <div className="grid grid-cols-7 text-[8px] text-center py-1 font-bold">
                <div>0-8</div>
                <div>8-16</div>
                <div>16-24</div>
                <div>24-32</div>
                <div>32-40</div>
                <div>40-48</div>
                <div>48-96</div>
              </div>
            </th>
            <th className="p-2 text-center border-r-2 border-muted">PS</th>
            <th className="p-2 text-center border-r-2 border-muted">B</th>
            <th className="p-2 text-center border-r-2 border-muted">Ammo</th>
            <th className="p-2 text-center border-r-2 border-muted">SR: Attrib</th>
            <th className="p-2 text-center border-r-2 border-muted">SR: No</th>
            <th className="p-2 text-left">Traits</th>
          </tr>
        </thead>
        <tbody>
          {sortedWeapons.map((w, idx) => (
            <tr key={`${w.id}-${idx}`} className="border-b border-muted last:border-0 hover:bg-muted/10 transition-colors">
              <td className="p-2 font-black border-r-2 border-muted whitespace-nowrap uppercase tracking-tight">{w.name}</td>
              <td className="p-2 font-bold border-r-2 border-muted whitespace-nowrap text-muted-foreground italic">{w.mode}</td>
              <td className="p-0 border-r-2 border-muted">
                <RangeBands distance={w.distance} />
              </td>
              <td className="p-2 text-center border-r-2 border-muted font-black text-primary">{w.damage}</td>
              <td className="p-2 text-center border-r-2 border-muted font-black">{w.burst}</td>
              <td className="p-2 text-center border-r-2 border-muted font-bold text-muted-foreground">{w.ammo}</td>
              <td className="p-2 text-center border-r-2 border-muted font-bold text-muted-foreground">{w.saving}</td>
              <td className="p-2 text-center border-r-2 border-muted font-bold text-muted-foreground">{w.savingNum}</td>
              <td className="p-2 text-[9px] leading-tight font-medium text-muted-foreground/80">
                {w.traits?.join(" • ")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RangeBands({ distance }: { distance: any }) {
  if (!distance) return <div className="h-full bg-muted/10" />;

  // Helper to get mod for a range in inches
  const getMod = (inches: number) => {
    const cm = inches * 2.5;
    
    // Find the band that covers this range
    // Bands are usually: short (0-20), med (20-40), long (40-60/80), max (60/80-120)
    // We check which band's max is >= our cm
    const bands = ['short', 'med', 'long', 'max'];
    for (const band of bands) {
      if (distance[band] && distance[band].max >= cm) {
        // Check if it's actually within the band (greater than previous band's max)
        const prevBandIdx = bands.indexOf(band) - 1;
        const prevMax = prevBandIdx >= 0 ? (distance[bands[prevBandIdx]]?.max || 0) : 0;
        if (cm > prevMax) {
          return distance[band].mod;
        }
      }
    }
    return null;
  };

  const ranges = [4, 12, 20, 28, 36, 44, 72]; // Midpoints of 0-8, 8-16, 16-24, 24-32, 32-40, 40-48, 48-96
  
  return (
    <div className="grid grid-cols-7 h-full items-stretch">
      {ranges.map((r, i) => {
        const mod = getMod(r);
        let bgColor = "bg-muted/5";
        let textColor = "text-muted-foreground/40";
        
        if (mod === "+6") { bgColor = "bg-green-500/80"; textColor = "text-white font-black"; }
        else if (mod === "+3") { bgColor = "bg-green-600/60"; textColor = "text-white font-black"; }
        else if (mod === "0") { bgColor = "bg-sky-500/60"; textColor = "text-white font-black"; }
        else if (mod === "-3") { bgColor = "bg-orange-500/60"; textColor = "text-white font-black"; }
        else if (mod === "-6") { bgColor = "bg-red-600/60"; textColor = "text-white font-black"; }

        return (
          <div key={i} className={cn("flex items-center justify-center h-full text-[9px] border-r last:border-r-0", bgColor, textColor)}>
            {mod || ""}
          </div>
        );
      })}
    </div>
  );
}

function UnitCard({ unit }: { unit: any }) {
  return (
    <Card className="overflow-hidden flex flex-col h-full border-muted-foreground/20 shadow-sm hover:shadow-md transition-shadow break-inside-avoid card">
      <CardHeader className="bg-muted/30 p-3 border-b border-muted-foreground/10">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {unit.logo ? (
              <img src={unit.logo} alt="" className="size-10 object-contain shrink-0 print:grayscale" />
            ) : (
              <div className="size-10 bg-muted rounded-md flex items-center justify-center shrink-0">
                <InfoIcon className="size-5 text-muted-foreground/40" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm font-black uppercase truncate leading-tight tracking-tight">{unit.name}</CardTitle>
              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground uppercase font-bold tracking-wider truncate">
                <span>{unit.type}</span>
                <span>•</span>
                <span className={cn(
                  unit.training?.toUpperCase() === "REGULAR" ? "text-emerald-500" : 
                  unit.training?.toUpperCase() === "IRREGULAR" ? "text-amber-500" : ""
                )}>
                  {unit.training}
                </span>
                <span>•</span>
                <span>{unit.isc}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <div className="flex gap-1 items-center">
              <Badge variant="outline" className="text-[10px] font-black h-5 px-1.5 border-primary/30 text-primary whitespace-nowrap">
                {unit.points} PTS
              </Badge>
              {unit.swc !== "0" && (
                <Badge variant="outline" className="text-[10px] font-black h-5 px-1.5 border-sky-500/30 text-sky-600 whitespace-nowrap">
                  {unit.swc} SWC
                </Badge>
              )}
            </div>
            <UnitDetailDialog unit={unit}>
              <Button variant="ghost" size="icon" className="size-6 print:hidden shrink-0">
                <Maximize2Icon className="size-3.5" />
              </Button>
            </UnitDetailDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex-col">
        {unit.profiles ? unit.profiles.map((profile: any, pIdx: number) => (
          <div key={pIdx} className={cn("flex flex-col", pIdx > 0 && "border-t-2 border-dashed border-muted-foreground/20 mt-2 pt-2")}>
            {unit.profiles.length > 1 && (
              <div className="px-3 py-1 text-[9px] font-black uppercase bg-primary/5 text-primary/70 tracking-widest">
                Profile: {profile.name || `Option ${pIdx + 1}`}
              </div>
            )}
            
            {/* Stat Line */}
            <div className="grid grid-cols-9 border-b border-muted-foreground/10 text-center text-[8px] font-black uppercase bg-muted/10">
              <div className="border-r border-muted-foreground/10 py-1">MOV</div>
              <div className="border-r border-muted-foreground/10 py-1">CC</div>
              <div className="border-r border-muted-foreground/10 py-1">BS</div>
              <div className="border-r border-muted-foreground/10 py-1">PH</div>
              <div className="border-r border-muted-foreground/10 py-1">WIP</div>
              <div className="border-r border-muted-foreground/10 py-1">ARM</div>
              <div className="border-r border-muted-foreground/10 py-1">BTS</div>
              <div className="border-r border-muted-foreground/10 py-1">{profile.isStr ? "STR" : "VITA"}</div>
              <div className="py-1">S</div>
            </div>
            <div className="grid grid-cols-9 text-center text-[11px] border-b border-muted-foreground/10 font-bold">
              <div className="border-r border-muted-foreground/10 py-1.5 bg-background">{profile.mov}</div>
              <div className="border-r border-muted-foreground/10 py-1.5 bg-background">{profile.cc}</div>
              <div className="border-r border-muted-foreground/10 py-1.5 bg-background">{profile.bs}</div>
              <div className="border-r border-muted-foreground/10 py-1.5 bg-background">{profile.ph}</div>
              <div className="border-r border-muted-foreground/10 py-1.5 bg-background">{profile.wip}</div>
              <div className="border-r border-muted-foreground/10 py-1.5 bg-background">{profile.arm}</div>
              <div className="border-r border-muted-foreground/10 py-1.5 bg-background">{profile.bts}</div>
              <div className="border-r border-muted-foreground/10 py-1.5 bg-background">{profile.w}</div>
              <div className="py-1.5 bg-background">{profile.s}</div>
            </div>

            <div className="p-3 space-y-3">
              {/* Skills */}
              {profile.resolvedSkills && profile.resolvedSkills.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {profile.resolvedSkills.map((s: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-bold text-foreground/90">
                        {s}{idx < profile.resolvedSkills.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Equipment */}
              {profile.resolvedEquip && profile.resolvedEquip.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Equipment</div>
                  <div className="flex flex-wrap gap-1">
                    {profile.resolvedEquip.map((e: string, idx: number) => (
                      <span key={idx} className="text-[10px] font-bold text-foreground/80 italic">
                        {e}{idx < profile.resolvedEquip.length - 1 ? "," : ""}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Weapons */}
              {profile.weapons && profile.weapons.length > 0 && (
                <div className="space-y-1">
                  <div className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Weapons</div>
                  <div className="grid gap-2">
                    {profile.weapons.map((w: any, idx: number) => {
                      const modes = WEAPON_DATA[w.id];
                      if (!modes) return (
                        <div key={idx} className="text-[10px] font-black text-primary/90 uppercase tracking-tight">
                          {MetadataService.getWeaponName(w.id)}
                        </div>
                      );
                      
                      return modes.map((m, mIdx) => (
                        <div key={`${idx}-${mIdx}`} className="flex items-center justify-between gap-2 group border-b border-muted/20 last:border-0 pb-1 last:pb-0">
                          <div className="flex flex-col min-w-0">
                            <div className="text-[10px] font-black text-primary/90 uppercase tracking-tight truncate">
                              {m.name} {modes.length > 1 && <span className="text-[8px] text-muted-foreground italic">({m.mode})</span>}
                            </div>
                            {m.traits.length > 0 && (
                              <div className="text-[8px] text-muted-foreground truncate">
                                {m.traits.join(", ")}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <div className="flex flex-col items-center">
                              <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">PS</span>
                              <span className="text-[9px] font-black leading-none">{m.damage}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">B</span>
                              <span className="text-[9px] font-black leading-none">{m.burst}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="text-[6px] font-bold text-muted-foreground uppercase leading-none">Ammo</span>
                              <span className="text-[9px] font-black leading-none">{m.ammo}</span>
                            </div>
                          </div>
                        </div>
                      ));
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )) : (
          <div className="p-4 text-center text-xs text-muted-foreground italic">
            No profile data available. Please re-import your list.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function UnitDetailDialog({ unit, children }: { unit: any, children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
            <DialogContent className="sm:max-w-[95vw] w-full h-[95vh] p-0 flex flex-col border-none overflow-hidden">
        <DialogHeader className="p-4 pr-12 border-b bg-muted/30 shrink-0">
          <div className="flex items-center gap-4">
            {unit.logo && <img src={unit.logo} alt="" className="size-10 object-contain" />}
            <div className="flex-1">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter leading-none">
                {unit.name}
              </DialogTitle>
              <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">
                <span>{unit.isc}</span>
                <span>•</span>
                <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-black border-muted-foreground/30">
                  {unit.type}
                </Badge>
                <Badge variant="outline" className="h-4 px-1.5 text-[8px] font-black border-muted-foreground/30">
                  {unit.training}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex flex-col items-center bg-background border border-primary/20 rounded-md px-3 py-1 shadow-sm min-w-[60px]">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Points</span>
                <span className="text-lg font-black text-primary leading-none">{unit.points}</span>
              </div>
              <div className="flex flex-col items-center bg-background border border-sky-500/20 rounded-md px-3 py-1 shadow-sm min-w-[60px]">
                <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">SWC</span>
                <span className="text-lg font-black text-sky-600 leading-none">{unit.swc}</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto p-4 bg-muted/5">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {unit.profiles?.map((profile: any, pIdx: number) => (
              <div key={pIdx} className="space-y-6 bg-background border rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                    <div className="size-2 bg-primary rounded-full" />
                    {profile.name || `Unit Profile`}
                  </div>
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Silhouette</span>
                      <span className="text-base font-black">S{profile.s}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-8 text-center border rounded-md overflow-hidden shadow-sm">
                  {['MOV', 'CC', 'BS', 'PH', 'WIP', 'ARM', 'BTS', profile.isStr ? 'STR' : 'VITA'].map((stat) => (
                    <div key={stat} className="bg-muted/50 p-1.5 text-[9px] font-black border-r last:border-r-0 border-b">
                      {stat}
                    </div>
                  ))}
                  {[profile.mov, profile.cc, profile.bs, profile.ph, profile.wip, profile.arm, profile.bts, profile.w].map((val, i) => (
                    <div key={i} className="p-3 text-xl font-black border-r last:border-r-0 bg-background">
                      {val}
                    </div>
                  ))}
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-3 space-y-6">
                    <section>
                      <h4 className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-3 flex items-center gap-2">
                        <div className="h-px flex-1 bg-muted" />
                        Skills
                        <div className="h-px flex-1 bg-muted" />
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.resolvedSkills?.map((s: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/5 text-primary border-primary/10">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-3 flex items-center gap-2">
                        <div className="h-px flex-1 bg-muted" />
                        Equipment
                        <div className="h-px flex-1 bg-muted" />
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {profile.resolvedEquip?.map((e: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-[10px] font-bold italic px-2 py-0.5 rounded border-muted-foreground/20">
                            {e}
                          </Badge>
                        ))}
                      </div>
                    </section>
                  </div>

                  <div className="lg:col-span-9 space-y-4">
                    <h4 className="text-[9px] font-black uppercase text-muted-foreground tracking-[0.2em] mb-2 flex items-center gap-2">
                      <div className="h-px flex-1 bg-muted" />
                      Weapon Systems
                      <div className="h-px flex-1 bg-muted" />
                    </h4>
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                      {profile.weapons?.map((w: any, idx: number) => {
                        const modes = WEAPON_DATA[w.id];
                        if (!modes) return (
                          <div key={idx} className="p-3 border rounded bg-muted/10 font-black uppercase tracking-widest text-[10px]">
                            {MetadataService.getWeaponName(w.id)}
                          </div>
                        );
                        
                        return modes.map((m, mIdx) => (
                          <div key={`${idx}-${mIdx}`} className="space-y-2 border rounded-lg p-3 bg-background shadow-sm hover:border-primary/40 transition-all group">
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <div className="text-sm font-black uppercase text-primary tracking-tight">
                                  {m.name}
                                </div>
                                <div className="inline-flex items-center px-1.5 py-0 rounded bg-muted text-[8px] font-black uppercase tracking-widest text-muted-foreground">
                                  {m.mode}
                                </div>
                              </div>
                              <div className="flex gap-4">
                                <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">DMG</span>
                                  <span className="text-sm font-black text-primary">{m.damage}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">B</span>
                                  <span className="text-sm font-black">{m.burst}</span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">AMMO</span>
                                  <span className="text-sm font-black text-sky-600">{m.ammo}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-1 min-h-[18px]">
                              {m.traits.map((trait, tIdx) => (
                                <span key={tIdx} className="text-[8px] font-bold text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  {trait}
                                </span>
                              ))}
                            </div>

                            <div className="pt-1 space-y-1">
                              <div className="grid grid-cols-7 text-[7px] text-center font-black uppercase text-muted-foreground tracking-tighter px-[1px]">
                                <div className="border-r border-transparent">0-8</div>
                                <div className="border-r border-transparent">8-16</div>
                                <div className="border-r border-transparent">16-24</div>
                                <div className="border-r border-transparent">24-32</div>
                                <div className="border-r border-transparent">32-40</div>
                                <div className="border-r border-transparent">40-48</div>
                                <div>48-96</div>
                              </div>
                              <div className="h-6 border rounded overflow-hidden bg-muted/5">
                                <RangeBands distance={m.distance} />
                              </div>
                            </div>
                          </div>
                        ));
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
