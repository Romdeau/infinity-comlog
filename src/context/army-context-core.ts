import * as React from "react"
import { type EnrichedArmyList } from "@/lib/unit-service"

export interface ArmyContextType {
  // The currently active pair for the game
  lists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }
  setLists: (lists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }) => void

  // The library of all imported lists
  storedLists: Record<string, EnrichedArmyList>
  saveList: (list: EnrichedArmyList) => void
  deleteList: (listId: string) => void
}

export const ArmyContext = React.createContext<ArmyContextType | undefined>(undefined)

export function useArmy() {
  const context = React.useContext(ArmyContext)
  if (context === undefined) {
    throw new Error("useArmy must be used within an ArmyProvider")
  }
  return context
}
