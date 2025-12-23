/* eslint-disable @typescript-eslint/no-explicit-any */
import { useArmy } from "@/context/army-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SKILL_MAP, EQUIP_MAP } from "@/lib/constants";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function ListAnalysisPage() {
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
      <div className="flex justify-end print:hidden">
        <span className="text-[10px] font-black text-orange-500 uppercase tracking-tighter bg-orange-500/10 px-2 py-0.5 rounded-full">
          Alpha Feature
        </span>
      </div>
      <div className="space-y-8">
        {lists.listA && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-primary pb-1">
              <h2 className="text-xl font-black uppercase tracking-tight text-primary">
                {lists.listA.armyName} Analysis
              </h2>
              <span className="text-xs font-black text-orange-500 uppercase tracking-tighter ml-auto">(Alpha)</span>
            </div>
            <ListAnalysis list={lists.listA} />
          </div>
        )}

        {lists.listB && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b-2 border-primary pb-1">
              <h2 className="text-xl font-black uppercase tracking-tight text-primary">
                {lists.listB.armyName} Analysis
              </h2>
              <span className="text-xs font-black text-orange-500 uppercase tracking-tighter ml-auto">(Alpha)</span>
            </div>
            <ListAnalysis list={lists.listB} />
          </div>
        )}
      </div>
    </div>
  )
}

function ListAnalysis({ list }: { list: any }) {
  // 1. Points by Troop Type
  const typePoints: Record<string, number> = {};
  const typeCounts: Record<string, number> = {};
  
  // 2. Orders & SWC
  let regular = 0;
  let irregular = 0;
  let impetuous = 0;
  let tacticalAwareness = 0;
  let totalSwc = 0;

  list.combatGroups.forEach((group: any) => {
    group.members.forEach((unit: any) => {
      // Points & Type
      const type = unit.type || 'Unknown';
      typePoints[type] = (typePoints[type] || 0) + unit.points;
      typeCounts[type] = (typeCounts[type] || 0) + 1;

      // SWC
      totalSwc += parseFloat(unit.swc || '0');

      // Orders
      const training = unit.training?.toUpperCase();
      if (training === 'REGULAR') regular++;
      else if (training === 'IRREGULAR') irregular++;
      
      // Check for Impetuous & Tactical Awareness (Deduplicated per unit)
      const unitSkills = new Set<string>();
      unit.profiles.forEach((p: any) => {
        p.skills?.forEach((s: any) => {
          const name = SKILL_MAP[s.id];
          if (name) unitSkills.add(name);
        });
      });

      let hasImpetuous = false;
      let hasTacAware = false;
      unitSkills.forEach(name => {
        if (name.includes('Impetuous') || name.includes('Frenzy')) hasImpetuous = true;
        if (name.includes('Tactical Awareness')) hasTacAware = true;
      });
      if (hasImpetuous) impetuous++;
      if (hasTacAware) tacticalAwareness++;
    });
  });

  // 3. Specialist Counts (Deduplicated per unit)
  const unitSpecialists = list.combatGroups.flatMap((g: any) => g.members).map((unit: any) => {
    const unitSpecs = new Set<string>();
    unit.profiles.forEach((p: any) => {
      p.skills?.forEach((s: any) => {
        const name = SKILL_MAP[s.id];
        if (!name) return;
        if (name.includes('Hacker')) unitSpecs.add('Hacker');
        if (name.includes('Doctor')) unitSpecs.add('Doctor');
        if (name.includes('Engineer')) unitSpecs.add('Engineer');
        if (name.includes('Paramedic')) unitSpecs.add('Paramedic');
        if (name.includes('Forward Observer')) unitSpecs.add('Forward Observer');
        if (name.includes('Chain of Command')) unitSpecs.add('Chain of Command');
        if (name.includes('Specialist Operative')) unitSpecs.add('Specialist Operative');
      });
      p.equip?.forEach((e: any) => {
        const name = EQUIP_MAP[e.id];
        if (name?.includes('Hacking Device')) unitSpecs.add('Hacker');
      });
    });
    return Array.from(unitSpecs);
  });

  const finalSpecialists: Record<string, number> = {
    'Hacker': 0,
    'Doctor': 0,
    'Engineer': 0,
    'Paramedic': 0,
    'Forward Observer': 0,
    'Chain of Command': 0,
    'Specialist Operative': 0,
  };

  unitSpecialists.forEach((specs: string[]) => {
    specs.forEach((s: string) => {
      finalSpecialists[s]++;
    });
  });

  // Format data for Recharts
  const typeData = Object.keys(typePoints).map(type => ({
    name: type,
    points: typePoints[type],
    count: typeCounts[type]
  })).sort((a, b) => b.points - a.points);

  const COLORS = ['#0ea5e9', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Summary Cards */}
      <Card className="bg-muted/30 border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Order Pool</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black tracking-tighter">{regular + irregular}</span>
            <div className="flex flex-col text-[10px] font-bold leading-tight pb-1">
              <span className="text-primary">{regular} Regular</span>
              <span className="text-orange-500">{irregular} Irregular</span>
              {tacticalAwareness > 0 && <span className="text-sky-500">+{tacticalAwareness} TacAware</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Specialists</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black tracking-tighter">
              {Object.values(finalSpecialists).reduce((a, b) => a + b, 0)}
            </span>
            <div className="flex flex-col text-[10px] font-bold leading-tight pb-1">
              <span className="text-emerald-500">{finalSpecialists['Hacker']} Hackers</span>
              <span className="text-muted-foreground">{finalSpecialists['Doctor'] + finalSpecialists['Paramedic']} Medical</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-muted/30 border-none shadow-none">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">SWC Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black tracking-tighter text-sky-600">{totalSwc.toFixed(1)}</span>
            <div className="flex flex-col text-[10px] font-bold leading-tight pb-1">
              <span className="text-muted-foreground">Total SWC</span>
              {impetuous > 0 && <span className="text-orange-600">{impetuous} Impetuous</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Points Distribution Chart */}
      <Card className="lg:col-span-1 bg-muted/30 border-none shadow-none overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Points by Troop Type</CardTitle>
        </CardHeader>
        <CardContent className="h-[120px] p-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fontWeight: 'bold' }} 
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold' }}
                cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                {typeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
