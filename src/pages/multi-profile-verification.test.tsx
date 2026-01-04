import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ArmyListViewPage from './army-list-view';
import { ArmyListService, FactionData } from '@/lib/army-list-service';
import { ArmyList } from '@/lib/army-parser';
import { SettingsProvider } from '@/context/settings-context';

// Mock the hook
const mockUseArmy = vi.fn();
vi.mock('@/context/army-context', () => ({
  useArmy: () => mockUseArmy(),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('Multi-Profile Unit Verification', () => {
  it('Renders multiple profiles for a single unit member', async () => {
    // 1. Setup Data
    const mockFactionData: FactionData = {
      units: [{
        id: 999,
        name: 'Transforming Unit',
        isc: 'Transformer',
        profileGroups: [{
          id: 1,
          profiles: [
            {
              id: 10,
              name: 'Mobility Form',
              cc: 10, bs: 10, ph: 10, wip: 10, arm: 1, bts: 0, w: 1, s: 2,
              move: [6, 4], type: 1, skills: [], equip: [], str: true
            },
            {
              id: 11,
              name: 'Combat Form',
              cc: 20, bs: 13, ph: 14, wip: 13, arm: 4, bts: 3, w: 1, s: 2,
              move: [4, 4], type: 1, skills: [], equip: [], str: true
            }
          ],
          options: [{
            id: 100,
            name: 'Option A',
            points: 50,
            swc: '0',
            weapons: [],
            skills: [],
            equip: []
          }]
        }]
      }]
    };

    // Mock Service
    vi.spyOn(ArmyListService, 'getFactionData').mockResolvedValue(mockFactionData);

    // 2. Hydrate List
    const rawList = {
      sectoralId: 999,
      sectoralName: 'Test Sectorial',
      armyName: 'Test Army',
      points: 300,
      combatGroups: [{
        groupNumber: 1,
        members: [{
          id: 999,
          groupId: 1, // Matches profileGroups[0].id? No, usually index or mapped ID.
          // Wait, ArmyListService uses: unit.profileGroups.find((pg) => pg.id === member.groupId)
          // So groupId should be 1.
          optionId: 100,
          name: ''
        }]
      }]
    } as unknown as ArmyList;

    const hydrated = await ArmyListService.hydrate(rawList);

    // 3. Render
    mockUseArmy.mockReturnValue({
      lists: { listA: hydrated, listB: null },
    });

    render(
      <SettingsProvider>
        <ArmyListViewPage />
      </SettingsProvider>
    );

    // 4. Verify
    // Should see "Transforming Unit"
    expect(screen.getByText('Transforming Unit')).toBeTruthy();
    
    // Should see both profile names
    expect(screen.getByText(/Mobility Form/i)).toBeTruthy();
    expect(screen.getByText(/Combat Form/i)).toBeTruthy();
    
    // In UnitCard:
    // {unit.profiles.length > 1 && ( <div ...>Profile: {profile.name}</div> )}
    // So if length > 1, it renders the profile name banner.
  });
});
