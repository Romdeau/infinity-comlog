import type { ActiveListSlot } from "@/shared/types/army"
import type { EnrichedArmyList } from "@/lib/unit-service"

export type PairableArmyList = Pick<EnrichedArmyList, "armyName" | "sectoralId" | "sectoralName" | "points">

export type ActiveArmyLists = {
  listA: PairableArmyList | null
  listB: PairableArmyList | null
}

export type PairValidationResult =
  | { valid: true }
  | { valid: false; reason: "sectoral" | "points"; message: string }

function getSlotLabel(slot: ActiveListSlot) {
  return slot === "listA" ? "List A" : "List B"
}

function validateAgainstOtherList(candidate: PairableArmyList, candidateSlot: ActiveListSlot, otherList: PairableArmyList | null): PairValidationResult {
  if (!otherList) return { valid: true }

  const otherSlot = candidateSlot === "listA" ? "listB" : "listA"
  const otherLabel = getSlotLabel(otherSlot)

  if (otherList.sectoralId !== candidate.sectoralId) {
    return {
      valid: false,
      reason: "sectoral",
      message: `This list does not match ${otherLabel}. Both active lists need to use the same sectoral (${otherList.sectoralName}).`,
    }
  }

  if (otherList.points !== candidate.points) {
    return {
      valid: false,
      reason: "points",
      message: `This list does not match ${otherLabel}. Both active lists need the same points value (${otherList.points}).`,
    }
  }

  return { valid: true }
}

export function validateActivePairAssignment(slot: ActiveListSlot, candidate: PairableArmyList | null, lists: ActiveArmyLists): PairValidationResult {
  if (!candidate) return { valid: true }

  const otherList = slot === "listA" ? lists.listB : lists.listA
  return validateAgainstOtherList(candidate, slot, otherList)
}

export function validateActivePair(lists: ActiveArmyLists): PairValidationResult {
  if (!lists.listA || !lists.listB) return { valid: true }
  return validateAgainstOtherList(lists.listB, "listB", lists.listA)
}
