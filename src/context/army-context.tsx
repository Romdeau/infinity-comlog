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
import { useSettings } from "@/context/settings-context"
import { STORAGE_KEYS } from "@/shared/storage/storage-keys"
import { migrateActivePairStorage, validateActivePairStorage, validateStoredListsStorage } from "@/shared/storage/storage-schemas"
import { validateActivePair, type PairValidationResult } from "@/features/army/domain/pair-validation"
import { ArmyContext, type ArmyContextType, useArmy } from "./army-context-core"

export { useArmy }
export type { ArmyContextType }

export function ArmyProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings()
  const [storedLists, setStoredLists] = useLocalStorage<Record<string, StoredArmyList>>(STORAGE_KEYS.storedLists, {}, {
    validate: validateStoredListsStorage,
  })
  const [activePairIds, setActivePairIds] = useLocalStorage<{ a: string | null; b: string | null }>(STORAGE_KEYS.activePair, { a: null, b: null }, {
    validate: validateActivePairStorage,
    migrate: migrateActivePairStorage,
    writeMigrated: true,
  })
  const [importErrors, setImportErrors] = React.useState<string[]>([])

  const clearImportErrors = React.useCallback(() => setImportErrors([]), [])

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
            const enriched = await unitService.enrichArmyList(rawList, settings.measurementUnit);
            
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
  }, [settings.measurementUnit]);

  const lists = React.useMemo(() => ({
    listA: activePairIds.a ? storedLists[activePairIds.a] || null : null,
    listB: activePairIds.b ? storedLists[activePairIds.b] || null : null
  }), [activePairIds, storedLists])

  React.useEffect(() => {
    const nextPair = {
      a: activePairIds.a && storedLists[activePairIds.a] ? activePairIds.a : null,
      b: activePairIds.b && storedLists[activePairIds.b] ? activePairIds.b : null,
    }

    if (nextPair.a !== activePairIds.a || nextPair.b !== activePairIds.b) {
      setActivePairIds(nextPair)
    }
  }, [activePairIds.a, activePairIds.b, setActivePairIds, storedLists])

  const setLists = React.useCallback((newLists: { listA: EnrichedArmyList | null; listB: EnrichedArmyList | null }): PairValidationResult => {
    const validation = validateActivePair(newLists)
    if (!validation.valid) return validation

    // When setting active lists, we ensure they are in the store first
    const newStored = { ...storedLists }

    const aId = newLists.listA ? (() => {
      // Check if this exact list object (by reference or content) is already in storedLists
      // For now, we'll just generate a new ID if it's not already one of our active ones
      const existingId = Object.entries(storedLists).find(([, l]) =>
        l.armyName === newLists.listA?.armyName &&
        l.sectoralId === newLists.listA?.sectoralId &&
        JSON.stringify(l.combatGroups) === JSON.stringify(newLists.listA?.combatGroups)
      )?.[0]

      if (existingId) {
        return existingId
      } else {
        const id = crypto.randomUUID()
        newStored[id] = {
          ...migrateToStoredList(newLists.listA),
          rawBase64: newLists.listA.rawCode || ''
        }
        return id
      }
    })() : null

    const bId = newLists.listB ? (() => {
      const existingId = Object.entries(storedLists).find(([, l]) =>
        l.armyName === newLists.listB?.armyName &&
        l.sectoralId === newLists.listB?.sectoralId &&
        JSON.stringify(l.combatGroups) === JSON.stringify(newLists.listB?.combatGroups)
      )?.[0]

      if (existingId) {
        return existingId
      } else {
        const id = crypto.randomUUID()
        newStored[id] = {
          ...migrateToStoredList(newLists.listB),
          rawBase64: newLists.listB.rawCode || ''
        }
        return id
      }
    })() : null

    setStoredLists(newStored)
    setActivePairIds({ a: aId, b: bId })
    return { valid: true }
  }, [setActivePairIds, setStoredLists, storedLists])

  const saveList = React.useCallback((list: EnrichedArmyList, rawBase64?: string) => {
    const id = crypto.randomUUID()
    const stored = migrateToStoredList(list);
    if (rawBase64) {
      stored.rawBase64 = rawBase64;
    } else if (list.rawCode) {
      stored.rawBase64 = list.rawCode;
    }
    setStoredLists(prev => ({ ...prev, [id]: stored }))
  }, [setStoredLists])

  const deleteList = React.useCallback((listId: string) => {
    setStoredLists(prev => {
      const next = { ...prev }
      delete next[listId]
      return next
    })
    // If it was active, clear it
    if (activePairIds.a === listId) setActivePairIds(p => ({ ...p, a: null }))
    if (activePairIds.b === listId) setActivePairIds(p => ({ ...p, b: null }))
  }, [activePairIds.a, activePairIds.b, setActivePairIds, setStoredLists])

  const reimportAllLists = React.useCallback(async () => {
    let changed = false;
    const newStored = { ...storedLists };
    const errors: string[] = [];

    for (const [id, currentList] of Object.entries(storedLists)) {
      if (currentList.rawBase64 || currentList.rawCode) {
        try {
          const rawCode = currentList.rawBase64 || currentList.rawCode || '';
          const parser = new ArmyParser(rawCode);
          const rawList = parser.parse();
          const enriched = await unitService.enrichArmyList(rawList, settings.measurementUnit);
          
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
  }, [settings.measurementUnit, setStoredLists, storedLists])

  const value = React.useMemo<ArmyContextType>(() => ({
    lists,
    setLists,
    storedLists,
    saveList,
    deleteList,
    reimportAllLists,
    importErrors,
    clearImportErrors,
  }), [clearImportErrors, deleteList, importErrors, lists, reimportAllLists, saveList, setLists, storedLists])


  return (
    <ArmyContext.Provider value={value}>
      {children}
    </ArmyContext.Provider>
  )
}
