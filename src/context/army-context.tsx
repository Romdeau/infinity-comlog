/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { type EnrichedArmyList, unitService } from "@/lib/unit-service"
import { ArmyParser } from "@/lib/army-parser"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ArmyContext, type ArmyContextType, useArmy } from "./army-context-core"

export { useArmy }
export type { ArmyContextType }

export function ArmyProvider({ children }: { children: React.ReactNode }) {
  const [storedLists, setStoredLists] = useLocalStorage<Record<string, EnrichedArmyList>>("comlog_stored_lists", {})
  const [activePairIds, setActivePairIds] = useLocalStorage<{ a: string | null; b: string | null }>("comlog_active_pair", { a: null, b: null })

  // Auto-migration/Re-enrichment for stale lists
  React.useEffect(() => {
    const migrate = async () => {
      let changed = false;
      const newStored = { ...storedLists };

      for (const [id, list] of Object.entries(storedLists)) {
        // If list is missing version or has old version, and we have the raw code
        // Version 1 introduced the 'profiles' array structure
        if ((!list.version || list.version < 1) && list.rawCode) {
          try {
            const parser = new ArmyParser(list.rawCode);
            const rawList = parser.parse();
            const enriched = await unitService.enrichArmyList(rawList);
            newStored[id] = enriched;
            changed = true;
          } catch (e) {
            console.error(`Failed to auto-migrate list ${id}:`, e);
          }
        }
      }

      if (changed) {
        setStoredLists(newStored);
      }
    };

    migrate();
    // We only want to run this once on mount or when storedLists changes from external source
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lists = React.useMemo(() => ({
    listA: activePairIds.a ? storedLists[activePairIds.a] || null : null,
    listB: activePairIds.b ? storedLists[activePairIds.b] || null : null
  }), [activePairIds, storedLists])

  const setLists = (newLists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }) => {
    // When setting active lists, we ensure they are in the store first
    const newStored = { ...storedLists }
    let aId = activePairIds.a
    let bId = activePairIds.b

    if (newLists.listA) {
      // Check if this exact list object (by reference or content) is already in storedLists
      // For now, we'll just generate a new ID if it's not already one of our active ones
      const existingId = Object.entries(storedLists).find(([, l]) =>
        l.armyName === newLists.listA?.armyName &&
        l.sectoralId === newLists.listA?.sectoralId &&
        JSON.stringify(l.combatGroups) === JSON.stringify(newLists.listA?.combatGroups)
      )?.[0]

      if (existingId) {
        aId = existingId
      } else {
        const id = crypto.randomUUID()
        newStored[id] = newLists.listA
        aId = id
      }
    } else {
      aId = null
    }

    if (newLists.listB) {
      const existingId = Object.entries(storedLists).find(([, l]) =>
        l.armyName === newLists.listB?.armyName &&
        l.sectoralId === newLists.listB?.sectoralId &&
        JSON.stringify(l.combatGroups) === JSON.stringify(newLists.listB?.combatGroups)
      )?.[0]

      if (existingId) {
        bId = existingId
      } else {
        const id = crypto.randomUUID()
        newStored[id] = newLists.listB
        bId = id
      }
    } else {
      bId = null
    }

    setStoredLists(newStored)
    setActivePairIds({ a: aId, b: bId })
  }

  const saveList = (list: EnrichedArmyList) => {
    const id = crypto.randomUUID()
    setStoredLists(prev => ({ ...prev, [id]: list }))
  }

  const deleteList = (listId: string) => {
    setStoredLists(prev => {
      const next = { ...prev }
      delete next[listId]
      return next
    })
    // If it was active, clear it
    if (activePairIds.a === listId) setActivePairIds(p => ({ ...p, a: null }))
    if (activePairIds.b === listId) setActivePairIds(p => ({ ...p, b: null }))
  }

  return (
    <ArmyContext.Provider value={{ lists, setLists, storedLists, saveList, deleteList }}>
      {children}
    </ArmyContext.Provider>
  )
}
