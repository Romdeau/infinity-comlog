import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ArmyListViewPage from './army-list-view';

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

describe('ArmyListViewPage', () => {
  it('renders empty state when no lists are loaded', () => {
    mockUseArmy.mockReturnValue({
      lists: { listA: null, listB: null },
    });

    render(<ArmyListViewPage />);
    expect(screen.getByText(/No Army Lists Loaded/i)).toBeTruthy();
  });

  it('renders list view when listA is present', () => {
    const mockList = {
      armyName: 'Test Army',
      sectoralName: 'Test Sectorial',
      points: 300,
      combatGroups: [
        {
          groupNumber: 1,
          members: [
            {
              name: 'Test Unit',
              type: 'LI',
              training: 'REGULAR',
              isc: 'TEST',
              points: 25,
              swc: '0',
              profiles: [
                {
                  name: 'Test Profile',
                  mov: '4-4', cc: 13, bs: 11, ph: 10, wip: 13, arm: 1, bts: 0, w: 1, s: 2,
                  weapons: [],
                  resolvedSkills: [],
                  resolvedEquip: []
                }
              ]
            }
          ]
        }
      ]
    };

    mockUseArmy.mockReturnValue({
      lists: { listA: mockList, listB: null },
    });

    render(<ArmyListViewPage />);
    // Use getAllByText because it appears in the Tab and the Header
    expect(screen.getAllByText('Test Army').length).toBeGreaterThan(0);
    expect(screen.getByText('Test Unit')).toBeTruthy();
  });
});
