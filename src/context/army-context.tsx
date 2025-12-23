import * as React from "react"
import { type EnrichedArmyList } from "@/lib/unit-service"

interface ArmyContextType {
  lists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }
  setLists: React.Dispatch<React.SetStateAction<{ listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }>>
}

const ArmyContext = React.createContext<ArmyContextType | undefined>(undefined)

export function ArmyProvider({ children }: { children: React.ReactNode }) {
  const [lists, setLists] = React.useState<{ listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }>({
    listA: null,
    listB: null
  })

  return (
    <ArmyContext.Provider value={{ lists, setLists }}>
      {children}
    </ArmyContext.Provider>
  )
}

export function useArmy() {
  const context = React.useContext(ArmyContext)
  if (context === undefined) {
    throw new Error("useArmy must be used within an ArmyProvider")
  }
  return context
}
