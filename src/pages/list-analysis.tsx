import { useArmy } from "@/context/army-context"
import { analyzeList, type AnalysisMetric } from "@/features/army/domain/list-analysis"
import type { EnrichedArmyList } from "@/lib/unit-service"
import { PageEmptyState } from "@/components/page-empty-state"
import { PageHeader, Panel, Readout } from "@/components/system"
import { useChartPalette } from "@/lib/chart-palette"
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

export default function ListAnalysisPage() {
  const { lists } = useArmy()

  if (!lists.listA && !lists.listB) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <PageHeader
          eyebrow="Composition Telemetry"
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

  const activeLists = [lists.listA, lists.listB].filter(
    (list): list is NonNullable<typeof list> => Boolean(list)
  )

  return (
    <div className="flex flex-1 flex-col gap-6">
      <PageHeader
        eyebrow="Composition Telemetry"
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

function ListAnalysisPanel({ list }: { list: EnrichedArmyList }) {
  const metrics = analyzeList(list)

  return (
    <Panel
      eyebrow="Army Insight"
      title={`${list.armyName} Analysis`}
      density="comfortable"
      className="space-y-4"
    >
      <p className="-mt-2 mb-4 text-sm text-muted-foreground">
        {list.sectoralName} • {list.points} points • {list.combatGroups.length} combat group
        {list.combatGroups.length === 1 ? "" : "s"}
      </p>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryStatCard
          label="Order Pool"
          value={metrics.regular + metrics.irregular}
          detail={[
            `${metrics.regular} Regular`,
            `${metrics.irregular} Irregular`,
            metrics.tacticalAwareness > 0 ? `+${metrics.tacticalAwareness} TacAware` : null,
          ]}
        />
        <SummaryStatCard
          label="Specialists"
          value={metrics.totalSpecialists}
          detail={[
            `${metrics.finalSpecialists.Hacker} Hackers`,
            `${metrics.finalSpecialists.Doctor + metrics.finalSpecialists.Paramedic} Medical`,
            metrics.finalSpecialists["Forward Observer"] > 0
              ? `${metrics.finalSpecialists["Forward Observer"]} FO`
              : null,
          ]}
        />
        <SummaryStatCard
          label="SWC Usage"
          value={metrics.totalSwc.toFixed(1)}
          detail={["Total SWC", metrics.impetuous > 0 ? `${metrics.impetuous} Impetuous` : null]}
        />
        <SummaryStatCard
          label="Troop Types"
          value={metrics.typeData.length}
          detail={[
            metrics.typeData[0] ? `${metrics.typeData[0].name} leads by points` : "No typed units",
            metrics.typeData[0] ? `${metrics.typeData[0].points} points invested` : null,
          ]}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <Panel
          variant="inset"
          eyebrow="Telemetry"
          title="Points by Troop Type"
          density="compact"
        >
          <p className="-mt-2 mb-3 text-xs text-muted-foreground">
            See where list investment is concentrated across the troop categories represented in the roster.
          </p>
          <ChartFrame data={metrics.typeData} />
        </Panel>

        <Panel
          variant="inset"
          eyebrow="Coverage"
          title="Specialist Breakdown"
          density="compact"
        >
          <p className="-mt-2 mb-3 text-xs text-muted-foreground">
            Useful when checking mission readiness and redundant access to key objectives.
          </p>
          <div className="space-y-3">
            {Object.entries(metrics.finalSpecialists).map(([label, value]) => (
              <SpecialistRow key={label} label={label} value={value} />
            ))}
          </div>
        </Panel>
      </div>
    </Panel>
  )
}

function SummaryStatCard({
  label,
  value,
  detail,
}: {
  label: string
  value: string | number
  detail: Array<string | null>
}) {
  return (
    <div className="rounded-lg border border-border/70 bg-surface-2 p-4">
      <Readout label={label} value={value} size="lg" />
      <div className="mt-3 space-y-1 text-xs text-muted-foreground">
        {detail.filter(Boolean).map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
    </div>
  )
}

function SpecialistRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5 text-sm">
      <span className="text-foreground">{label}</span>
      <span className="hud-readout font-semibold text-foreground">{value}</span>
    </div>
  )
}

function ChartFrame({ data }: { data: AnalysisMetric["typeData"] }) {
  const { palette, chrome } = useChartPalette()

  if (data.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/20 text-sm text-muted-foreground">
        No troop type data available for this list.
      </div>
    )
  }

  return (
    <div className="h-72 min-h-72 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%" minWidth={240}>
        <BarChart data={data} margin={{ top: 12, right: 16, left: 0, bottom: 8 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" stroke={chrome.grid} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
          <YAxis hide />
          <Tooltip
            cursor={{ fill: chrome.cursor }}
            contentStyle={{
              backgroundColor: chrome.surface,
              border: `1px solid ${chrome.border}`,
              borderRadius: "12px",
              fontSize: "12px",
            }}
          />
          <Bar dataKey="points" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`${entry.name}-${index}`} fill={palette[index % palette.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
