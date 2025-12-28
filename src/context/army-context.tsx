/* eslint-disable react-refresh/only-export-components */
import * as React from "react"
import { 
  type EnrichedArmyList, 
  type StoredArmyList, 
  unitService, 
  migrateToStoredList, 
  CURRENT_SCHEMA_VERSION, 
  generateValidationHash 
} from "@/lib/unit-service"
import { ArmyParser } from "@/lib/army-parser"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { ArmyContext, type ArmyContextType, useArmy } from "./army-context-core"

export { useArmy }
export type { ArmyContextType }

export function ArmyProvider({ children }: { children: React.ReactNode }) {
  const [storedLists, setStoredLists] = useLocalStorage<Record<string, StoredArmyList>>("comlog_stored_lists", {})
  const [activePairIds, setActivePairIds] = useLocalStorage<{ a: string | null; b: string | null }>("comlog_active_pair", { a: null, b: null })
  const [importErrors, setImportErrors] = React.useState<string[]>([])

  const clearImportErrors = () => setImportErrors([])

  // Auto-validation/Re-enrichment for stale or invalid lists
  React.useEffect(() => {
    const validateAndMigrate = async () => {
      let changed = false;
      const newStored = { ...storedLists };
      const errors: string[] = [];

      for (const [id, list] of Object.entries(storedLists)) {
        // 1. Ensure all lists are in the new StoredArmyList format structure
        if (!('validationHash' in list)) {
          newStored[id] = migrateToStoredList(list);
          changed = true;
        }

        const currentList = newStored[id];

        // 2. Validate Schema Version and Hash
        const isOutdated = (currentList.schemaVersion || 0) < CURRENT_SCHEMA_VERSION;
        
        // Extract EnrichedArmyList properties for hash validation
        // We exclude metadata that is added by StoredArmyList
        const { 
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          rawBase64, schemaVersion, importTimestamp, validationHash, name, 
          ...coreEnriched 
        } = currentList;
        
        const computedHash = generateValidationHash(coreEnriched as EnrichedArmyList);
        const isCorrupted = validationHash !== computedHash;

        // 3. Attempt automatic re-parse if needed and rawBase64 is available
        if ((isOutdated || isCorrupted) && (currentList.rawBase64 || currentList.rawCode)) {
          try {
            const rawCode = currentList.rawBase64 || currentList.rawCode || '';
            const parser = new ArmyParser(rawCode);
            const rawList = parser.parse();
            const enriched = await unitService.enrichArmyList(rawList);
            
            newStored[id] = {
              ...enriched,
              rawBase64: rawCode,
              schemaVersion: CURRENT_SCHEMA_VERSION,
              importTimestamp: currentList.importTimestamp || Date.now(),
              validationHash: generateValidationHash(enriched),
              name: currentList.name || enriched.armyName
            };
            changed = true;
          } catch (e) {
            console.error(`Failed to auto-reparse list ${id}:`, e);
            errors.push(`Failed to update list "${currentList.armyName || id}": ${e instanceof Error ? e.message : 'Unknown error'}`);
          }
        }
      }

      if (changed) {
        setStoredLists(newStored);
      }
      if (errors.length > 0) {
        setImportErrors(errors);
      }
    };

    validateAndMigrate();
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

  const reimportAllLists = async () => {
    let changed = false;
    const newStored = { ...storedLists };
    const errors: string[] = [];

    for (const [id, currentList] of Object.entries(storedLists)) {
      if (currentList.rawBase64 || currentList.rawCode) {
        try {
          const rawCode = currentList.rawBase64 || currentList.rawCode || '';
          const parser = new ArmyParser(rawCode);
          const rawList = parser.parse();
          const enriched = await unitService.enrichArmyList(rawList);
          
          newStored[id] = {
            ...enriched,
            rawBase64: rawCode,
            schemaVersion: CURRENT_SCHEMA_VERSION,
            importTimestamp: currentList.importTimestamp || Date.now(),
            validationHash: generateValidationHash(enriched),
            name: currentList.name || enriched.armyName
          };
          changed = true;
        } catch (e) {
          console.error(`Failed to re-import list ${id}:`, e);
          errors.push(`Failed to re-import list "${currentList.armyName || id}": ${e instanceof Error ? e.message : 'Unknown error'}`);
        }
      }
    }

    if (changed) {
      setStoredLists(newStored);
    }
    if (errors.length > 0) {
      setImportErrors(errors);
    }
  }

  return (
    <ArmyContext.Provider value={{ lists, setLists, storedLists, saveList, deleteList, reimportAllLists, importErrors, clearImportErrors }}>
      {children}
    </ArmyContext.Provider>
  )
}
