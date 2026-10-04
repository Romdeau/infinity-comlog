import { describe, expect, it } from "vitest"
import {
  getUnitOrders,
  sumOrders,
  totalOrders,
  withOrderMetadata,
} from "./order-counts"
import type { EnrichedTrooper } from "./unit-service"
const member = (extra: Partial<EnrichedTrooper> = {}): EnrichedTrooper => ({
  id: 1,
  groupId: 1,
  optionId: 1,
  name: "Test",
  isc: "",
  type: "LI",
  training: "REGULAR",
  points: 10,
  swc: "0",
  isLieutenant: false,
  profiles: [],
  ...extra,
})
const profile = (skills: string[]) =>
  ({ resolvedSkills: skills }) as EnrichedTrooper["profiles"][number]

describe("order counts", () => {
  it("uses source totals, including two lieutenant orders, without double counting skills", () => {
    const unit = member({
      isLieutenant: true,
      orders: [
        { type: "REGULAR", total: 1 },
        { type: "LIEUTENANT", total: 2 },
        { type: "TACTICAL", total: 1 },
      ],
      profiles: [profile(["Lieutenant (+1 Order)", "Tactical Awareness"])],
    })
    expect(getUnitOrders(unit)).toMatchObject({
      regular: 1,
      lieutenant: 2,
      tactical: 1,
    })
    expect(totalOrders(getUnitOrders(unit))).toBe(4)
  })
  it("counts alternate profiles once for legacy lists", () => {
    const unit = member({
      isLieutenant: true,
      profiles: [
        profile(["Lieutenant (+1 Order)", "Tactical Awareness"]),
        profile(["Lieutenant (+1 Order)", "Tactical Awareness"]),
      ],
    })
    expect(totalOrders(getUnitOrders(unit))).toBe(4)
  })
  it("separates impetuous activations and conditional frenzy from orders", () => {
    const counts = sumOrders([
      member({ training: "IRREGULAR", profiles: [profile(["Impetuous"])] }),
      member({ profiles: [profile(["Frenzy"])] }),
    ])
    expect(counts).toMatchObject({
      regular: 1,
      irregular: 1,
      impetuous: 1,
      frenzy: 1,
    })
    expect(totalOrders(counts)).toBe(2)
  })
  it("does not invent orders for peripherals or explicit empty order data", () => {
    expect(totalOrders(getUnitOrders(member({ orders: [] })))).toBe(0)
    expect(
      totalOrders(
        getUnitOrders(member({ profiles: [profile(["Peripheral (Servant)"])] }))
      )
    ).toBe(0)
    expect(getUnitOrders(member({ training: "" })).unknown).toBe(1)
  })
  it("recovers exact option orders for previously imported lists", () => {
    const unit = withOrderMetadata(member(), {
      units: [
        {
          id: 1,
          name: "Test",
          profileGroups: [
            {
              id: 1,
              profiles: [],
              options: [{ id: 1, orders: [{ type: "REGULAR", total: 2 }] }],
            },
          ],
        },
      ],
    })
    expect(getUnitOrders(unit).regular).toBe(2)
  })
})
