import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from './settings';
import { SettingsProvider } from '@/context/settings-context';

const mockReimportAllLists = vi.fn(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));

vi.mock('@/context/army-context', () => ({
  useArmy: () => ({
    lists: { listA: null, listB: null },
    setLists: vi.fn(),
    storedLists: {},
    saveList: vi.fn(),
    deleteList: vi.fn(),
    reimportAllLists: mockReimportAllLists,
    importErrors: [],
    clearImportErrors: vi.fn(),
  }),
}));

describe('SettingsPage', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('renders and allows re-importing all lists', async () => {
    render(
      <MemoryRouter>
        <SettingsProvider>
          <SettingsPage />
        </SettingsProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Settings')).toBeDefined();
    
    const reimportButton = screen.getByText('Re-import All');
    fireEvent.click(reimportButton);

    expect(mockReimportAllLists).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('Updated just now')).toBeDefined();
    });
  });
});
