import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ListAnalysisPage from './list-analysis';

// Mock the hook
const mockUseArmy = vi.fn();
vi.mock('@/context/army-context', () => ({
  useArmy: () => mockUseArmy(),
}));

// Mock ResizeObserver for Recharts
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('ListAnalysisPage', () => {
  it('renders empty state when no lists are loaded', () => {
    mockUseArmy.mockReturnValue({
      lists: { listA: null, listB: null },
    });

    render(<ListAnalysisPage />);
    expect(screen.getAllByText(/No Army Lists Loaded/i).length).toBeGreaterThan(0);
  });

  it('renders analysis when listA is present', () => {
    const mockList = {
      armyName: 'Test Army',
      combatGroups: [
        {
          members: [
            {
              points: 30,
              swc: '0',
              type: 'LI',
              training: 'REGULAR',
              profiles: [
                { resolvedSkills: [], resolvedEquip: [] }
              ]
            }
          ]
        }
      ]
    };

    mockUseArmy.mockReturnValue({
      lists: { listA: mockList, listB: null },
    });

    render(<ListAnalysisPage />);
    // Check for the header
    expect(screen.getByText(/Test Army Analysis/i)).toBeTruthy();
    // Check for "Order Pool" card title
    expect(screen.getByText(/Order Pool/i)).toBeTruthy();
  });
});
