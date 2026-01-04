import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import ArmyListViewPage from './army-list-view';
import { ArmyParser } from '@/lib/army-parser';
import { ArmyListService, FactionData } from '@/lib/army-list-service';
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
  let faction107: FactionData;

  beforeAll(() => {
    // Load the real JSON file
    const jsonPath = path.resolve(process.cwd(), 'public/data/factions/107.json');
    const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
    faction107 = JSON.parse(jsonContent);

    // Mock ArmyListService.getFactionData to return real data
    // We mock the static method directly to avoid fetch issues
    vi.spyOn(ArmyListService, 'getFactionData').mockResolvedValue(faction107);
  });

  it('Parses and Hydrates Kestrel List correctly (Unit 935 -> Tech-Bee)', async () => {
    const kestrelCode = 'axZrZXN0cmVsLWNvbG9uaWFsLWZvcmNlDkNvbXByZWhlbnNpYmxlgSwCAQEACQAhAQQAABABAgAAhxEBBAAAhwwBAwAAhxUBAgAAhxUBAgAAhxUBBQAAg6cBAgAAEwEBAAIBAAYAhxIBAwAALgECAACHCwEJAACGIgEEAACHIAEFAACHIAEFAA%3D%3D';

    // 1. Parse
    const parser = new ArmyParser(kestrelCode);
    const parsed = parser.parse();
    expect(parsed.sectoralId).toBe(107); // Kestrel ID

    // 2. Hydrate
    const hydrated = await ArmyListService.hydrate(parsed);

    // 3. Verify Data
    // Find unit 935
    const techBee = hydrated.combatGroups.flatMap(g => g.members).find(m => m.id === 935);
    expect(techBee).toBeDefined();
    // It matches "Tech-Bees" in the JSON but the test expects "Tech-Bee" or similar.
    // The JSON output showed "TECH-BEES, Maintenance Battalions".
    expect(techBee?.unitName).toContain('TECH-BEES');
    expect(techBee?.unitName).not.toContain('Unit 935');

    // 4. Render UI
    mockUseArmy.mockReturnValue({
      lists: { listA: hydrated, listB: null },
    });

    render(<ArmyListViewPage />);
    
    // Check if "TECH-BEES" is visible
    expect(screen.getAllByText(/TECH-BEES/i).length).toBeGreaterThan(0);
  });
});
