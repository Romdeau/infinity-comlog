import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ArmyBuilderPage from './army-builder';
import { ArmyProvider } from '@/context/army-context';
import { SettingsProvider } from '@/context/settings-context';
import {
  clearFactionDataCacheForTest,
  setFactionDataForTest,
  type FactionPayload,
} from '@/lib/faction-data-service';
import { unitService } from '@/lib/unit-service';
import { STORAGE_KEYS } from '@/shared/storage/storage-keys';

const data: FactionPayload = {
  units: [
    {
      id: 1,
      name: 'Test troops',
      factions: [101],
      profileGroups: [
        {
          id: 1,
          profiles: [
            {
              ava: 255,
              name: 'Test trooper',
              move: [10, 10],
              skills: [],
              weapons: [],
              equip: [],
            },
          ],
          options: [
            { id: 1, name: 'Rifleman', points: 10, swc: '0', minis: 1 },
            {
              id: 2,
              name: 'Officer',
              points: 10,
              swc: '0',
              minis: 1,
              skills: [{ id: 119 }],
            },
          ],
        },
      ],
    },
  ],
};
function renderBuilder() {
  return render(
    <MemoryRouter>
      <SettingsProvider>
        <ArmyProvider>
          <ArmyBuilderPage />
        </ArmyProvider>
      </SettingsProvider>
    </MemoryRouter>,
  );
}
describe('army builder workflow', () => {
  beforeEach(() => {
    localStorage.clear();
    setFactionDataForTest(101, data);
    unitService.clearCacheForTest();
  });
  afterEach(() => {
    cleanup();
    clearFactionDataCacheForTest();
    vi.restoreAllMocks();
  });
  it('offers presets, validates custom input and calculates SWC from the format', async () => {
    renderBuilder();
    await screen.findByText('Available units');
    fireEvent.click(screen.getByRole('button', { name: '100 pt' }));
    expect(screen.getByText('2 base SWC · 1 SWC per 50 points')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '200 pt' }));
    expect(screen.getByText('4 base SWC · 1 SWC per 50 points')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Edit points limit' }));
    const points = screen.getByLabelText('Points');
    fireEvent.change(points, { target: { value: '0' } });
    expect(
      screen
        .getByRole('button', { name: 'Apply limit' })
        .hasAttribute('disabled'),
    ).toBe(true);
    fireEvent.change(points, { target: { value: '175' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply limit' }));
    expect(screen.getByText('3.5 base SWC · 1 SWC per 50 points')).toBeTruthy();
  });
  it('persists drafts, prevents a second lieutenant, and saves a playable local list', async () => {
    const view = renderBuilder();
    await screen.findByText('Available units');
    fireEvent.change(
      screen.getByRole('textbox', { name: 'Search units and loadouts' }),
      { target: { value: 'Test troops' } },
    );
    expect(
      screen
        .getByRole('button', { name: 'Save to library' })
        .hasAttribute('disabled'),
    ).toBe(true);
    fireEvent.click(
      screen.getByRole('button', { name: 'Add Officer, 10 points, option 2' }),
    );
    expect(
      screen
        .getByRole('button', { name: 'Add Officer, 10 points, option 2' })
        .hasAttribute('disabled'),
    ).toBe(true);
    fireEvent.click(
      screen.getByRole('button', { name: 'Add Rifleman, 10 points, option 1' }),
    );
    fireEvent.change(screen.getByLabelText('Army name'), {
      target: { value: 'Local patrol' },
    });
    view.unmount();
    renderBuilder();
    await screen.findByRole('button', { name: 'Remove Officer' });
    expect(screen.getByDisplayValue('Local patrol')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Save to library' }));
    await screen.findByRole('button', { name: 'Saved to library' });
    const library = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.storedLists) || '{}',
    );
    expect(Object.values(library)).toEqual([
      expect.objectContaining({
        armyName: 'Local patrol',
        builderDraft: expect.objectContaining({ entries: expect.any(Array) }),
      }),
    ]);
    fireEvent.click(screen.getByRole('button', { name: 'Remove Officer' }));
    await waitFor(() =>
      expect(
        screen
          .getByRole('button', { name: 'Save to library' })
          .hasAttribute('disabled'),
      ).toBe(true),
    );
  });
});
