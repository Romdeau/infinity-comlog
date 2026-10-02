import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchArmyData } from './army-api';

afterEach(() => vi.unstubAllGlobals());

describe('Army data downloads', () => {
  it('uses the current official origin for metadata and faction requests', async () => {
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ units: [] }));
    vi.stubGlobal('fetch', fetchMock);
    await fetchArmyData('units/en/101');
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.corvusbelli.com/army/units/en/101',
      expect.objectContaining({ headers: {
        Origin: 'https://infinityuniverse.com', Accept: 'application/json',
      } }),
    );
  });

  it('reports HTTP errors rather than treating error JSON as data', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"message":"Forbidden"}', { status: 403 })));
    await expect(fetchArmyData('units/en/101')).rejects.toThrow('403');
  });

  it('skips only the known missing-key response for faction 901', async () => {
    vi.stubGlobal('fetch', vi.fn().mockImplementation(() => Promise.resolve(
      new Response('<?xml version="1.0"?><Error><Code>NoSuchKey</Code></Error>'),
    )));
    await expect(fetchArmyData('units/en/901')).resolves.toBeNull();
    await expect(fetchArmyData('units/en/101')).rejects.toThrow();
  });

  it('keeps valid faction 901 data and rejects malformed faction payloads', async () => {
    const payload = { version: 'current', units: [{ name: 'Trooper' }] };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json(payload))
      .mockResolvedValueOnce(Response.json({ message: 'error' }))
      .mockResolvedValueOnce(new Response('<html>Service unavailable</html>'));
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchArmyData('units/en/901')).resolves.toEqual(payload);
    await expect(fetchArmyData('units/en/101')).rejects.toThrow('units');
    await expect(fetchArmyData('units/en/901')).rejects.toThrow();
  });

  it('validates metadata before accepting it', async () => {
    const metadata = { factions: [{ id: 101, name: 'PanOceania' }], skills: [], weapons: [], equips: [], ammunitions: [], hack: [] };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(Response.json(metadata))
      .mockResolvedValueOnce(Response.json({ factions: [] }))
      .mockResolvedValueOnce(Response.json({ ...metadata, factions: [{ id: '../bad', name: 'Bad' }] }))
      .mockResolvedValueOnce(Response.json({ ...metadata, weapons: undefined }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(fetchArmyData('infinity/en/metadata')).resolves.toEqual(metadata);
    await expect(fetchArmyData('infinity/en/metadata')).rejects.toThrow('factions');
    await expect(fetchArmyData('infinity/en/metadata')).rejects.toThrow('factions');
    await expect(fetchArmyData('infinity/en/metadata')).rejects.toThrow('weapons');
  });
});
