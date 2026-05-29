import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ArmyProvider, useArmy } from './army-context';

import { SettingsProvider } from './settings-context';

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
    // Mock fetch to return a valid faction data structure
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          version: "1.0",
          units: [{
            idArmy: 1, // Matches a dummy unit if needed, but the parser might produce IDs we don't know. 
            // We need to match what the parser produces for the test base64. 
            // For the specific base64 used in tests ("gr8Kb3BlcmF0aW9ucw..."), it's a PanO list. 
            // However, just ensuring it returns *some* data is better than the error.
            name: "Fusilier",
            isc: "Fusilier",
            profileGroups: [{
              id: 1,
              options: [{ id: 1, name: "Fusilier", points: 10, swc: "0" }],
              profiles: [{
                name: "Fusilier", move: [10, 10], type: 1,
                w: 1, arm: 1, bts: 0, str: 0, s: 2,
                weapons: [], skills: [], equip: []
              }]
            }]
          }]
        })
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <SettingsProvider>
      <ArmyProvider>{children}</ArmyProvider>
    </SettingsProvider>
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

  it('stores an assigned active list and persists the active slot id', () => {
    const { result } = renderHook(() => useArmy(), { wrapper });

    const mockEnrichedList = {
      armyName: 'Assigned Test List',
      sectoralId: 101,
      sectoralName: 'PanOceania',
      points: 300,
      combatGroups: [],
      rawCode: 'assigned-base64'
    };

    React.act(() => {
      result.current.setLists({ listA: mockEnrichedList, listB: null });
    });

    const storedIds = Object.keys(result.current.storedLists);
    expect(storedIds.length).toBe(1);
    expect(result.current.lists.listA?.armyName).toBe('Assigned Test List');

    const activePair = JSON.parse(window.localStorage.getItem('comlog_active_pair') || '{}');
    expect(activePair.a).toBe(storedIds[0]);
    expect(activePair.b).toBeNull();
  });

  it('rejects incompatible active pairs in context actions', () => {
    const { result } = renderHook(() => useArmy(), { wrapper });

    const listA = {
      armyName: 'List A',
      sectoralId: 101,
      sectoralName: 'PanOceania',
      points: 300,
      combatGroups: [],
    };
    const listB = {
      armyName: 'List B',
      sectoralId: 102,
      sectoralName: 'Nomads',
      points: 300,
      combatGroups: [],
    };

    let validation: ReturnType<typeof result.current.setLists> | undefined;
    React.act(() => {
      validation = result.current.setLists({ listA, listB });
    });

    expect(validation).toMatchObject({ valid: false, reason: 'sectoral' });
    expect(result.current.lists.listA).toBeNull();
    expect(result.current.lists.listB).toBeNull();
    expect(window.localStorage.getItem('comlog_stored_lists')).toBeNull();
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

  it('clears active pair IDs that no longer exist in stored lists', async () => {
    window.localStorage.setItem('comlog_active_pair', JSON.stringify({ a: 'missing-a', b: 'missing-b' }));

    const { result } = renderHook(() => useArmy(), { wrapper });

    await waitFor(() => {
      expect(result.current.lists.listA).toBeNull();
      expect(result.current.lists.listB).toBeNull();
      expect(JSON.parse(window.localStorage.getItem('comlog_active_pair') || '{}')).toEqual({ a: null, b: null });
    });
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

  it('should manually re-import all lists when requested', async () => {
    const list = {
      armyName: 'To Reimport',
      sectoralId: 101,
      sectoralName: 'PanOceania',
      points: 300,
      combatGroups: [],
      rawBase64: 'gr8Kb3BlcmF0aW9ucwEggSwCAQoAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgAAgMkBAgA=',
      schemaVersion: 1,
      importTimestamp: 1000,
      validationHash: 'manual-reimport-test'
    };

    window.localStorage.setItem('comlog_stored_lists', JSON.stringify({
      'test-id': list
    }));

    const { result } = renderHook(() => useArmy(), { wrapper });

    await React.act(async () => {
      await result.current.reimportAllLists();
    });

    const updatedList = result.current.storedLists['test-id'];
    expect(updatedList.validationHash).not.toBe('manual-reimport-test');
    expect(updatedList.validationHash).toBeTruthy();
  });
});
