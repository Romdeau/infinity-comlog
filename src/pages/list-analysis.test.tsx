import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import ListAnalysisPage from './list-analysis';

vi.mock('recharts', () => {
  const Div = ({ children }: { children?: React.ReactNode }) => <div>{children}</div>;

  return {
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div style={{ width: 400, height: 320 }}>{children}</div>,
    BarChart: Div,
    Bar: Div,
    XAxis: Div,
    YAxis: Div,
    CartesianGrid: Div,
    Tooltip: Div,
    Cell: Div,
  };
});

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
  afterEach(() => {
    cleanup();
    mockUseArmy.mockReset();
  });

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
    // Check for the summary heading
    expect(screen.getAllByRole('heading', { name: /Analyze List Composition/i }).length).toBeGreaterThan(0);
    // Order Pool metric is shown as a Readout label
    expect(screen.getByText('Order Pool')).toBeTruthy();
  });
});
