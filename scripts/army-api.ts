const API_URL = 'https://api.corvusbelli.com/army/';

/** Download and validate an official Army payload before callers write it to disk. */
export async function fetchArmyData(endpoint: string): Promise<Record<string, unknown> | null> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      // The official site moved domains; the API rejects the old Origin with 403.
      Origin: 'https://infinityuniverse.com',
      Accept: 'application/json',
    },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`${endpoint}: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  if (endpoint === 'units/en/901' && text.trim().startsWith('<') && /<Code>NoSuchKey<\/Code>/.test(text)) {
    return null;
  }

  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${endpoint}: upstream did not return JSON`);
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error(`${endpoint}: expected a JSON object`);
  }
  const payload = data as Record<string, unknown>;
  if (endpoint === 'infinity/en/metadata') {
    const factions = payload.factions;
    if (!Array.isArray(factions) || factions.length === 0 || factions.some(faction =>
      !faction || !Number.isSafeInteger(faction.id) || faction.id <= 0 || typeof faction.name !== 'string',
    )) {
      throw new Error(`${endpoint}: missing or invalid factions`);
    }
    for (const key of ['skills', 'weapons', 'equips', 'ammunitions', 'hack']) {
      if (!Array.isArray(payload[key])) throw new Error(`${endpoint}: missing or invalid ${key}`);
    }
  } else if (!Array.isArray(payload.units)) {
    throw new Error(`${endpoint}: missing or invalid units`);
  }
  return payload;
}
