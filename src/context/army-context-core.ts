import * as React from "react"
import { type EnrichedArmyList, type StoredArmyList } from "@/lib/unit-service"

export interface ArmyContextType {
  // The currently active pair for the game
  lists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }
  setLists: (lists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }) => void

  // The library of all imported lists
  storedLists: Record<string, StoredArmyList>
  saveList: (list: EnrichedArmyList, rawBase64?: string) => void
  deleteList: (listId: string) => void
  reimportAllLists: () => Promise<void>

  // Error handling for background imports/migrations
  importErrors: string[]
  clearImportErrors: () => void
}

export const ArmyContext = React.createContext<ArmyContextType | undefined>(undefined)

export function useArmy() {
  const context = React.useContext(ArmyContext)
  if (context === undefined) {
    throw new Error("useArmy must be used within an ArmyProvider")
  }
  return context
}
