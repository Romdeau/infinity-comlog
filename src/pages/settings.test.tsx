import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import SettingsPage from './settings';

describe('SettingsPage', () => {
  it('renders the settings page title and description', () => {
    render(
      <MemoryRouter>
        <SettingsPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Settings')).toBeDefined();
    expect(screen.getByText('Manage application preferences and data.')).toBeDefined();
    expect(screen.getByText('Data Management')).toBeDefined();
  });
});
