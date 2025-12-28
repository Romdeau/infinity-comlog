/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { type EnrichedArmyList, type StoredArmyList, unitService, migrateToStoredList } from "@/lib/unit-service"
import { ArmyParser } from "@/lib/army-parser"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ArmyContext, type ArmyContextType, useArmy } from "./army-context-core"

export { useArmy }
export type { ArmyContextType }

export function ArmyProvider({ children }: { children: React.ReactNode }) {
  const [storedLists, setStoredLists] = useLocalStorage<Record<string, StoredArmyList>>("comlog_stored_lists", {})
  const [activePairIds, setActivePairIds] = useLocalStorage<{ a: string | null; b: string | null }>("comlog_active_pair", { a: null, b: null })

  // Auto-migration/Re-enrichment for stale lists
  React.useEffect(() => {
    const migrate = async () => {
      let changed = false;
      const newStored = { ...storedLists };

      for (const [id, list] of Object.entries(storedLists)) {
        // First, ensure all lists are in the new StoredArmyList format
        if (!('validationHash' in list)) {
          newStored[id] = migrateToStoredList(list);
          changed = true;
        }

        const currentList = newStored[id];

        // If list is missing version or has old version, and we have the raw code
        // Version 1 introduced the 'profiles' array structure
        if ((!currentList.version || currentList.version < 1) && currentList.rawCode) {
          try {
            const parser = new ArmyParser(currentList.rawCode);
            const rawList = parser.parse();
            const enriched = await unitService.enrichArmyList(rawList);
            // We preserve the storage metadata when re-parsing
            newStored[id] = {
              ...migrateToStoredList(enriched),
              rawBase64: currentList.rawBase64 || currentList.rawCode || '',
              importTimestamp: currentList.importTimestamp || Date.now()
            };
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
        newStored[id] = {
          ...migrateToStoredList(newLists.listA),
          rawBase64: newLists.listA.rawCode || ''
        }
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
        newStored[id] = {
          ...migrateToStoredList(newLists.listB),
          rawBase64: newLists.listB.rawCode || ''
        }
        bId = id
      }
    } else {
      bId = null
    }

    setStoredLists(newStored)
    setActivePairIds({ a: aId, b: bId })
  }

  const saveList = (list: EnrichedArmyList, rawBase64?: string) => {
    const id = crypto.randomUUID()
    const stored = migrateToStoredList(list);
    if (rawBase64) {
      stored.rawBase64 = rawBase64;
    } else if (list.rawCode) {
      stored.rawBase64 = list.rawCode;
    }
    setStoredLists(prev => ({ ...prev, [id]: stored }))
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
