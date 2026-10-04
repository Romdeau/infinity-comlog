import type { EnrichedTrooper } from "./unit-service"
import type { FactionPayload } from "./faction-data-service"

export type OrderCounts = {
  regular: number
  irregular: number
  lieutenant: number
  tactical: number
  impetuous: number
  frenzy: number
  unknown: number
}
export const emptyOrders = (): OrderCounts => ({
  regular: 0,
  irregular: 0,
  lieutenant: 0,
  tactical: 0,
  impetuous: 0,
  frenzy: 0,
  unknown: 0,
})

/** Recover authoritative order totals for lists imported before orders were stored. */
export function withOrderMetadata(
  member: EnrichedTrooper,
  data: FactionPayload | null
): EnrichedTrooper {
  if (Array.isArray(member.orders) || !data) return member
  const unit = data.units.find((unit) => (unit.id ?? unit.idArmy) === member.id)
  const group = unit?.profileGroups.find((group) => group.id === member.groupId)
  const option = group?.options.find((option) => option.id === member.optionId)
  return option?.orders ? { ...member, orders: option.orders } : member
}

export function getUnitOrders(member: EnrichedTrooper): OrderCounts {
  const counts = emptyOrders()
  const skills = [
    ...new Set(
      (member.profiles || []).flatMap((profile) => profile.resolvedSkills || [])
    ),
  ]
  const has = (pattern: RegExp) => skills.some((skill) => pattern.test(skill))
  if (Array.isArray(member.orders)) {
    const keys = {
      REGULAR: "regular",
      IRREGULAR: "irregular",
      LIEUTENANT: "lieutenant",
      TACTICAL: "tactical",
      IMPETUOUS: "impetuous",
    } as const
    member.orders.forEach((order) => {
      const key = keys[order.type as keyof typeof keys]
      if (key)
        counts[key] += Number.isFinite(order.total)
          ? Math.max(0, order.total!)
          : 1
    })
  } else {
    // Legacy fallback counts the trooper once, regardless of alternate profiles.
    const peripheral = has(/^Peripheral\b/i)
    if (!peripheral) {
      if (member.training?.toUpperCase() === "REGULAR") counts.regular = 1
      else if (member.training?.toUpperCase() === "IRREGULAR")
        counts.irregular = 1
      else counts.unknown = 1
      if (member.isLieutenant) {
        const extra = skills
          .filter((skill) => /^Lieutenant\b/i.test(skill))
          .map((skill) => Number(skill.match(/\+(\d+)\s*Order/i)?.[1] || 0))
        counts.lieutenant = 1 + Math.max(0, ...extra)
      }
    }
  }
  // Team Ops may add these skills without changing the source option's orders.
  if (has(/^Tactical Awareness\b/i))
    counts.tactical = Math.max(counts.tactical, 1)
  if (has(/^Impetuous\b/i)) counts.impetuous = Math.max(counts.impetuous, 1)
  if (has(/^Frenzy\b/i) && !counts.impetuous) counts.frenzy = 1
  // Builder lists mark peripherals and additional proxies as sharing an order.
  if (member.orderContribution === 0) {
    counts.regular = 0
    counts.irregular = 0
    counts.unknown = 0
  }
  return counts
}

export function sumOrders(members: EnrichedTrooper[]): OrderCounts {
  return members.reduce((total, member) => {
    const orders = getUnitOrders(member)
    for (const key of Object.keys(total) as (keyof OrderCounts)[])
      total[key] += orders[key]
    return total
  }, emptyOrders())
}
export const totalOrders = (counts: OrderCounts) =>
  counts.regular + counts.irregular + counts.lieutenant + counts.tactical
