import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArmyProvider, useArmy } from './army-context';
import { type StoredArmyList } from '@/lib/unit-service';

// Mock crypto.randomUUID
if (!global.crypto) {
  // @ts-expect-error - polyfilling for node
  global.crypto = {};
}
if (!global.crypto.randomUUID) {
  global.crypto.randomUUID = vi.fn(() => 'test-uuid-' + Math.random());
}

describe('ArmyContext', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ArmyProvider>{children}</ArmyProvider>
  );

  it('should store lists as StoredArmyList objects when saved', () => {
    const { result } = renderHook(() => useArmy(), { wrapper });
    
    const mockEnrichedList = {
      armyName: 'Test List',
      sectoralId: 101,
      sectoralName: 'PanOceania',
      points: 300,
      combatGroups: [],
      rawCode: 'test-base64'
    };

    // @ts-expect-error - mock list
    React.act(() => {
      result.current.saveList(mockEnrichedList, 'test-base64');
    });

    const storedIds = Object.keys(result.current.storedLists);
    expect(storedIds.length).toBe(1);
    const storedList = result.current.storedLists[storedIds[0]];
    
    expect(storedList.rawBase64).toBe('test-base64');
    expect(storedList.schemaVersion).toBe(1);
    expect(storedList.validationHash).toBeTruthy();
    expect(storedList.importTimestamp).toBeGreaterThan(0);
  });

  it('should auto-migrate legacy lists on mount', async () => {
    const legacyList = {
      armyName: 'Legacy List',
      sectoralId: 101,
      points: 300,
      combatGroups: [],
      // No schemaVersion, no rawBase64
    };

    window.localStorage.setItem('comlog_stored_lists', JSON.stringify({
      'legacy-id': legacyList
    }));

    const { result } = renderHook(() => useArmy(), { wrapper });

    // Wait for useEffect migration
    await waitFor(() => {
      const list = result.current.storedLists['legacy-id'];
      expect(list).toBeDefined();
      expect(list).toHaveProperty('validationHash');
    }, { timeout: 1000 });

    const storedList = result.current.storedLists['legacy-id'];
    expect(storedList.schemaVersion).toBe(1);
    expect(storedList.rawBase64).toBe('');
    expect(storedList.validationHash).toBeTruthy();
  });

  it('should re-parse lists with outdated schema version on mount', async () => {
    const outdatedList = {
      armyName: 'Outdated List',
      sectoralId: 101,
      sectoralName: 'PanOceania',
      points: 300,
      combatGroups: [],
      rawBase64: 'gr8Kb3BlcmF0aW9ucwEggSwCAQoAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgA=',
      schemaVersion: 0, // Outdated
      importTimestamp: 1000,
      validationHash: 'old-hash'
    };

    window.localStorage.setItem('comlog_stored_lists', JSON.stringify({
      'outdated-id': outdatedList
    }));

    const { result } = renderHook(() => useArmy(), { wrapper });

    await waitFor(() => {
      const list = result.current.storedLists['outdated-id'];
      expect(list).toBeDefined();
      expect(list.schemaVersion).toBe(1);
      expect(list.validationHash).not.toBe('old-hash');
    }, { timeout: 2000 });
  });

  it('should detect and re-parse lists with invalid validation hash', async () => {
    const corruptedList = {
      armyName: 'Corrupted List',
      sectoralId: 101,
      sectoralName: 'PanOceania',
      points: 300,
      combatGroups: [],
      rawBase64: 'gr8Kb3BlcmF0aW9ucwEggSwCAQoAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgA=',
      schemaVersion: 1,
      importTimestamp: 1000,
      validationHash: 'wrong-hash'
    };

    window.localStorage.setItem('comlog_stored_lists', JSON.stringify({
      'corrupted-id': corruptedList
    }));

    const { result } = renderHook(() => useArmy(), { wrapper });

    await waitFor(() => {
      const list = result.current.storedLists['corrupted-id'];
      expect(list).toBeDefined();
      expect(list.validationHash).not.toBe('wrong-hash');
      expect(list.validationHash).toBeTruthy();
    }, { timeout: 2000 });
  });
});
