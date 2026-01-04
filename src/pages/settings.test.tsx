import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from './settings';
import { ArmyContext } from '@/context/army-context-core';
import { SettingsProvider } from '@/context/settings-context';

describe('SettingsPage', () => {
  const mockReimportAllLists = vi.fn(() => Promise.resolve());
  
  const mockContext = {
    lists: { listA: null, listB: null },
    setLists: vi.fn(),
    storedLists: {},
    saveList: vi.fn(),
    deleteList: vi.fn(),
    reimportAllLists: mockReimportAllLists,
    importErrors: [],
    clearImportErrors: vi.fn(),
  };

  it('renders and allows re-importing all lists', async () => {
    render(
      <MemoryRouter>
        <SettingsProvider>
          <ArmyContext.Provider value={mockContext}>
            <SettingsPage />
          </ArmyContext.Provider>
        </SettingsProvider>
      </MemoryRouter>
    );

    expect(screen.getByText('Settings')).toBeDefined();
    
    const reimportButton = screen.getByText('Re-import All');
    fireEvent.click(reimportButton);

    expect(screen.getByText('Re-importing...')).toBeDefined();
    expect(mockReimportAllLists).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText('Updated just now')).toBeDefined();
    });
  });
});
