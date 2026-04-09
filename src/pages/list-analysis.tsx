/* eslint-disable @typescript-eslint/no-explicit-any */
import { useArmy } from "@/context/army-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageEmptyState } from "@/components/page-empty-state"
import { PageIntro } from "@/components/page-intro"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"

type AnalysisMetric = {
  typeData: { name: string; points: number; count: number }[]
  regular: number
  irregular: number
  impetuous: number
  tacticalAwareness: number
  totalSwc: number
  totalSpecialists: number
  finalSpecialists: Record<string, number>
}

const CHART_COLORS = ["#0ea5e9", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#64748b"]

function getUnitProfiles(unit: any) {
  return Array.isArray(unit?.profiles) ? unit.profiles : []
}

export default function ListAnalysisPage() {
  const { lists } = useArmy()

  if (!lists.listA && !lists.listB) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <PageIntro
          eyebrow="Insights"
          title="Analyze List Composition"
          description="Compare order pools, specialists, SWC usage, and troop type spread for the active lists in your current pairing."
          status="Alpha"
        />
        <PageEmptyState
          title="No Army Lists Loaded"
          description="Please import an army list in the Army Lists page first."
        />
      </div>
    )
  }

  const activeLists = [lists.listA, lists.listB].filter((list): list is NonNullable<typeof list> => Boolean(list))

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageIntro
        eyebrow="Insights"
        title="Analyze List Composition"
        description="Review order efficiency, specialist coverage, and troop investment across your active lists before locking in a round plan."
        status="Alpha"
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {activeLists.map((list) => (
          <ListAnalysisPanel key={`${list.armyName}-${list.points}`} list={list} />
        ))}
      </div>
    </div>
  )
}

function ListAnalysisPanel({ list }: { list: any }) {
  const metrics = analyzeList(list)

  return (
    <section className="space-y-4 rounded-2xl border border-border/70 bg-card/60 p-5">
      <div className="space-y-1 border-b border-border/70 pb-4">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Army insight</div>
        <h2 className="text-xl font-semibold tracking-tight">{list.armyName} Analysis</h2>
        <p className="text-sm text-muted-foreground">
          {list.sectoralName} • {list.points} points • {list.combatGroups.length} combat group{list.combatGroups.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          label="Order Pool"
          value={metrics.regular + metrics.irregular}
          detail={[`${metrics.regular} Regular`, `${metrics.irregular} Irregular`, metrics.tacticalAwareness > 0 ? `+${metrics.tacticalAwareness} TacAware` : null]}
        />
        <SummaryStatCard
          label="Specialists"
          value={metrics.totalSpecialists}
          detail={[`${metrics.finalSpecialists.Hacker} Hackers`, `${metrics.finalSpecialists.Doctor + metrics.finalSpecialists.Paramedic} Medical`, metrics.finalSpecialists["Forward Observer"] > 0 ? `${metrics.finalSpecialists["Forward Observer"]} FO` : null]}
        />
        <SummaryStatCard
          label="SWC Usage"
          value={metrics.totalSwc.toFixed(1)}
          detail={["Total SWC", metrics.impetuous > 0 ? `${metrics.impetuous} Impetuous` : null]}
        />
        <SummaryStatCard
          label="Troop Types"
          value={metrics.typeData.length}
          detail={[metrics.typeData[0] ? `${metrics.typeData[0].name} leads by points` : "No typed units", metrics.typeData[0] ? `${metrics.typeData[0].points} points invested` : null]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <Card className="border-border/70 bg-background/70 shadow-none">
          <CardHeader>
            <CardTitle>Points by Troop Type</CardTitle>
            <CardDescription>See where list investment is concentrated across the troop categories represented in the roster.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartFrame data={metrics.typeData} />
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-background/70 shadow-none">
          <CardHeader>
            <CardTitle>Specialist Breakdown</CardTitle>
            <CardDescription>Useful when checking mission readiness and redundant access to key objectives.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(metrics.finalSpecialists).map(([label, value]) => (
              <SpecialistRow key={label} label={label} value={value} />
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function SummaryStatCard({ label, value, detail }: { label: string; value: string | number; detail: Array<string | null> }) {
  return (
    <Card className="border-border/70 bg-background/70 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-4xl font-semibold tracking-tight text-foreground">{value}</div>
        <div className="space-y-1 text-xs text-muted-foreground">
          {detail.filter(Boolean).map((line) => (
            <div key={line}>{line}</div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SpecialistRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/20 px-3 py-2.5 text-sm">
      <span className="text-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  )
}

function ChartFrame({ data }: { data: AnalysisMetric["typeData"] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground">
        No troop type data available for this list.
      </div>
    )
  }

  return (
    <div className="h-72 min-h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={240}>
        <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.18)" />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="points" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function analyzeList(list: any): AnalysisMetric {
  const typePoints: Record<string, number> = {}
  const typeCounts: Record<string, number> = {}

  let regular = 0
  let irregular = 0
  let impetuous = 0
  let tacticalAwareness = 0
  let totalSwc = 0

  list.combatGroups.forEach((group: any) => {
    group.members.forEach((unit: any) => {
      const type = unit.type || "Unknown"
      typePoints[type] = (typePoints[type] || 0) + unit.points
      typeCounts[type] = (typeCounts[type] || 0) + 1

      totalSwc += parseFloat(unit.swc || "0")

      const training = unit.training?.toUpperCase()
      if (training === "REGULAR") regular += 1
      else if (training === "IRREGULAR") irregular += 1

      const unitSkills = new Set<string>()
      getUnitProfiles(unit).forEach((profile: any) => {
        profile.resolvedSkills?.forEach((name: string) => {
          unitSkills.add(name)
        })
      })

      let hasImpetuous = false
      let hasTacAware = false

      unitSkills.forEach((name) => {
        const lowerName = name.toLowerCase()
        if (lowerName.includes("impetuous") || lowerName.includes("frenzy")) hasImpetuous = true
        if (lowerName.includes("tactical awareness")) hasTacAware = true
      })

      if (hasImpetuous) impetuous += 1
      if (hasTacAware) tacticalAwareness += 1
    })
  })

  const unitSpecialists = list.combatGroups
    .flatMap((group: any) => group.members)
    .map((unit: any) => {
      const specialistSet = new Set<string>()

      getUnitProfiles(unit).forEach((profile: any) => {
        profile.resolvedSkills?.forEach((name: string) => {
          const lowerName = name.toLowerCase()
          if (lowerName.includes("hacker")) specialistSet.add("Hacker")
          if (lowerName.includes("doctor")) specialistSet.add("Doctor")
          if (lowerName.includes("engineer")) specialistSet.add("Engineer")
          if (lowerName.includes("paramedic")) specialistSet.add("Paramedic")
          if (lowerName.includes("forward observer")) specialistSet.add("Forward Observer")
          if (lowerName.includes("chain of command")) specialistSet.add("Chain of Command")
          if (lowerName.includes("specialist operative")) specialistSet.add("Specialist Operative")
        })

        profile.resolvedEquip?.forEach((name: string) => {
          if (name.toLowerCase().includes("hacking device")) specialistSet.add("Hacker")
        })
      })

      return Array.from(specialistSet)
    })

  const finalSpecialists: Record<string, number> = {
    Hacker: 0,
    Doctor: 0,
    Engineer: 0,
    Paramedic: 0,
    "Forward Observer": 0,
    "Chain of Command": 0,
    "Specialist Operative": 0,
  }

  unitSpecialists.forEach((specialists: string[]) => {
    specialists.forEach((specialist) => {
      finalSpecialists[specialist] += 1
    })
  })

  const typeData = Object.keys(typePoints)
    .map((type) => ({
      name: type,
      points: typePoints[type],
      count: typeCounts[type],
    }))
    .sort((a, b) => b.points - a.points)

  return {
    typeData,
    regular,
    irregular,
    impetuous,
    tacticalAwareness,
    totalSwc,
    totalSpecialists: Object.values(finalSpecialists).reduce((a, b) => a + b, 0),
    finalSpecialists,
  }
}
