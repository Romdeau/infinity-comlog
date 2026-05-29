import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import ArmyListViewPage from './army-list-view';
import { SettingsProvider } from '@/context/settings-context';
import { useSettings } from '@/context/settings-context';

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

const makeRenderableList = () => ({
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
              weapons: [{ id: 2 }],
              resolvedSkills: [],
              resolvedEquip: []
            }
          ]
        }
      ]
    }
  ]
});

function MeasurementHarness() {
  const { updateSettings } = useSettings();
  return (
    <>
      <button onClick={() => updateSettings({ measurementUnit: 'metric' })}>Use Metric</button>
      <ArmyListViewPage />
    </>
  );
}

describe('ArmyListViewPage', () => {
  afterEach(() => {
    cleanup();
    mockUseArmy.mockReset();
    window.localStorage.clear();
  });

  it('renders empty state when no lists are loaded', () => {
    mockUseArmy.mockReturnValue({
      lists: { listA: null, listB: null },
    });

    const { getByText } = render(
      <SettingsProvider>
        <ArmyListViewPage />
      </SettingsProvider>
    );
    expect(getByText(/No Army Lists Loaded/i)).toBeTruthy();
  });

  it('renders list view when listA is present', () => {
    const mockList = makeRenderableList();

    mockUseArmy.mockReturnValue({
      lists: { listA: mockList, listB: null },
    });

    const { getAllByText, getByText } = render(
      <SettingsProvider>
        <ArmyListViewPage />
      </SettingsProvider>
    );
    // Use getAllByText because it appears in the Tab and the Header
    expect(getAllByText('Test Army').length).toBeGreaterThan(0);
    expect(getByText('Test Unit')).toBeTruthy();
  });

  it('updates weapon range units when the measurement setting changes', () => {
    mockUseArmy.mockReturnValue({
      lists: { listA: makeRenderableList(), listB: null },
    });

    render(
      <SettingsProvider>
        <MeasurementHarness />
      </SettingsProvider>
    );

    expect(screen.getByText('Range (Inches)')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /use metric/i }));

    expect(screen.getByText('Range (cm)')).toBeTruthy();
  });

  it('does not crash when a unit has missing weapon metadata', () => {
    const list = makeRenderableList();
    list.combatGroups[0].members[0].profiles[0].weapons = [{ id: 999999 }];

    mockUseArmy.mockReturnValue({
      lists: { listA: list, listB: null },
    });

    render(
      <SettingsProvider>
        <ArmyListViewPage />
      </SettingsProvider>
    );

    expect(screen.getByText('Weapon 999999')).toBeTruthy();
  });
});
