export type ArmyCode = string & { readonly __brand: "ArmyCode" }
export type ActiveListSlot = "listA" | "listB"

export type ActivePair = {
  listAId: string | null
  listBId: string | null
}

export type ArmyItemRef = {
  id: number
  q?: number
  extra?: number[]
}
