import {
  CircleIcon,
  DiamondIcon,
  FlameIcon,
  StarIcon,
  ZapIcon,
} from "lucide-react"
import type { EnrichedArmyList, EnrichedTrooper } from "@/lib/unit-service"
import {
  getUnitOrders,
  sumOrders,
  totalOrders,
  type OrderCounts,
} from "@/lib/order-counts"

const kinds = [
  {
    key: "regular",
    label: "Regular",
    icon: CircleIcon,
    color: "text-status-complete",
  },
  {
    key: "irregular",
    label: "Irregular",
    icon: DiamondIcon,
    color: "text-status-warning",
  },
  {
    key: "lieutenant",
    label: "Lieutenant",
    icon: StarIcon,
    color: "text-primary",
  },
  {
    key: "tactical",
    label: "Tactical",
    icon: ZapIcon,
    color: "text-status-info",
  },
] as const

function OrderBadges({ counts }: { counts: OrderCounts }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1">
      {kinds
        .filter((kind) => counts[kind.key] > 0)
        .map(({ key, label, icon: Icon, color }) => (
          <span
            key={key}
            className={`inline-flex items-center gap-1 text-[11px] font-semibold ${color}`}
          >
            <Icon aria-hidden className="size-3" />
            {counts[key]} {label}
          </span>
        ))}
      {counts.impetuous > 0 && (
        <span className="inline-flex items-center gap-1 text-[11px] text-status-warning">
          <FlameIcon aria-hidden className="size-3" />
          {counts.impetuous} Impetuous activation
          {counts.impetuous === 1 ? "" : "s"}
        </span>
      )}
      {counts.frenzy > 0 && (
        <span className="text-[11px] text-muted-foreground">
          Frenzy: {counts.frenzy} conditional activation
          {counts.frenzy === 1 ? "" : "s"}
        </span>
      )}
      {counts.unknown > 0 && (
        <span className="text-[11px] text-muted-foreground">
          {counts.unknown} unit{counts.unknown === 1 ? "" : "s"} with unknown
          orders
        </span>
      )}
    </div>
  )
}

export function UnitOrders({ unit }: { unit: EnrichedTrooper }) {
  const counts = getUnitOrders(unit)
  return (
    <div
      className="space-y-1 border-b border-border/60 bg-muted/10 px-3 py-2"
      aria-label={`${unit.name} orders`}
    >
      <div className="text-ui-label">Orders</div>
      <OrderBadges counts={counts} />
      {totalOrders(counts) === 0 && counts.unknown === 0 && (
        <p className="text-[11px] text-muted-foreground">No orders generated</p>
      )}
    </div>
  )
}

export function OrderSummary({ list }: { list: EnrichedArmyList }) {
  const counts = sumOrders(list.combatGroups.flatMap((group) => group.members))
  return (
    <section
      aria-label="Order summary"
      className="overflow-hidden rounded-lg border border-primary/40 bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-primary/5 px-4 py-3">
        <h2 className="font-display text-lg font-semibold uppercase">
          Order summary
        </h2>
        <p className="font-mono text-xl font-semibold text-primary">
          {totalOrders(counts)}{" "}
          <span className="text-xs font-normal">profile orders</span>
        </p>
      </div>
      <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
        {kinds.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="p-4">
            <p
              className={`flex items-center gap-2 text-xs font-semibold ${color}`}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </p>
            <p className="mt-1 font-mono text-3xl font-semibold">
              {counts[key]}
            </p>
          </div>
        ))}
      </div>
      <div className="space-y-3 border-t border-border px-4 py-3">
        {list.combatGroups.map((group, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center gap-x-4 gap-y-1"
          >
            <h3 className="text-xs font-semibold">Group {group.groupNumber}</h3>
            <OrderBadges counts={sumOrders(group.members)} />
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          Profile totals before deployment, casualties and skill conversions.
          Each group has its own Regular order pool. Impetuous and conditional
          Frenzy activations are separate from the order total.
        </p>
      </div>
    </section>
  )
}
