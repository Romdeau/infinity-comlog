import { describe, it, expect } from 'vitest';
import { type StoredArmyList, type EnrichedArmyList, generateValidationHash } from './unit-service';

describe('StoredArmyList Utilities', () => {
  const mockEnrichedList: EnrichedArmyList = {
    rawCode: 'test_code',
    faction: 'test_faction',
    sectoralId: 101,
    combatGroups: [],
    version: 1
  } as unknown as EnrichedArmyList;

  it('should generate a consistent hash for an army list', () => {
    const hash1 = generateValidationHash(mockEnrichedList);
    const hash2 = generateValidationHash(mockEnrichedList);
    expect(hash1).toBe(hash2);
    expect(hash1).toBeTruthy();
  });

  it('should generate different hashes for different lists', () => {
    const list1 = { ...mockEnrichedList, rawCode: 'A' };
    const list2 = { ...mockEnrichedList, rawCode: 'B' };
    expect(generateValidationHash(list1)).not.toBe(generateValidationHash(list2));
  });
});

import { migrateToStoredList } from './unit-service';

describe('migrateToStoredList', () => {
  const mockEnrichedList: EnrichedArmyList = {
    rawCode: 'test_code',
    faction: 'test_faction',
    sectoralId: 101,
    combatGroups: [],
    version: 1,
    // @ts-expect-error - legacy lists might not have name
    name: 'Legacy List' 
  } as unknown as EnrichedArmyList;

  it('should convert a legacy list to StoredArmyList with default values', () => {
    const stored = migrateToStoredList(mockEnrichedList);
    
    expect(stored.schemaVersion).toBe(1);
    expect(stored.rawBase64).toBe(''); // Empty string for legacy
    expect(stored.validationHash).toBeTruthy();
    expect(stored.importTimestamp).toBeGreaterThan(0);
    // Should preserve existing data
    expect(stored.rawCode).toBe('test_code');
  });

  it('should not modify an already stored list', () => {
    const existing: StoredArmyList = {
      ...mockEnrichedList,
      schemaVersion: 2,
      rawBase64: 'existing_base64',
      importTimestamp: 100,
      validationHash: 'hash',
      name: 'Existing'
    };
    
    const stored = migrateToStoredList(existing);
    expect(stored).toEqual(existing);
  });
});

