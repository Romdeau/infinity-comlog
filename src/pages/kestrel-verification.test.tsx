import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render } from '@testing-library/react';
import ArmyListViewPage from './army-list-view';
import { ArmyParser } from '@/lib/army-parser';
import { clearFactionDataCacheForTest, setFactionDataForTest, type FactionPayload } from '@/lib/faction-data-service';
import { unitService } from '@/lib/unit-service';
import { SettingsProvider } from '@/context/settings-context';
import * as fs from 'fs';
import * as path from 'path';

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

describe('Kestrel List Verification', () => {
  let faction107: FactionPayload;

  beforeAll(() => {
    // Load the real JSON file
    const jsonPath = path.resolve(process.cwd(), 'public/data/factions/107.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    faction107 = JSON.parse(jsonContent);

    clearFactionDataCacheForTest();
    unitService.clearCacheForTest();
    setFactionDataForTest(107, faction107);
  });

  it('Parses and Hydrates Kestrel List correctly (Unit 935 -> Tech-Bee)', async () => {
    const kestrelCode = 'axZrZXN0cmVsLWNvbG9uaWFsLWZvcmNlDkNvbXByZWhlbnNpYmxlgSwCAQEACQAhAQQAABABAgAAhxEBBAAAhwwBAwAAhxUBAgAAhxUBAgAAhxUBBQAAg6cBAgAAEwEBAAIBAAYAhxIBAwAALgECAACHCwEJAACGIgEEAACHIAEFAACHIAEFAA%3D%3D';

    // 1. Parse
    const parser = new ArmyParser(kestrelCode);
    const parsed = parser.parse();
    expect(parsed.sectoralId).toBe(107); // Kestrel ID

    // 2. Hydrate
    const hydrated = await unitService.enrichArmyList(parsed);

    // 3. Verify Data
    // Find unit 935
    const techBee = hydrated.combatGroups.flatMap(g => g.members).find(m => m.id === 935);
    expect(techBee).toBeDefined();
    expect(techBee?.name).toContain('TECH-BEE');
    expect(techBee?.name).not.toContain('Unit 935');

    // 4. Render UI
    mockUseArmy.mockReturnValue({
      lists: { listA: hydrated, listB: null },
    });

    const { getAllByText } = render(
      <SettingsProvider>
        <ArmyListViewPage />
      </SettingsProvider>
    );
    
    expect(getAllByText(/TECH-BEE/i).length).toBeGreaterThan(0);
  });
});
