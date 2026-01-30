const CLANS_URL = 'https://2110000e-d11b-4acc-803c-9d8d776b7411.mock.pstmn.io/Clans';

export type Clan = {
  clan_id: string;
  name: string;
  house: string | null;
  branch: string | null;
  founder: string | null;
  region: string[];
  association: string[];
  lineage_type: string;
  descendants: string[];
};

type ClansApiResponse = {
  clans: Clan[];
};

/**
 * Fetch all clans from the mock API.
 */
export async function getAllClans(): Promise<Clan[]> {
  const response = await fetch(CLANS_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch clans. Please try again later.');
  }

  const data: ClansApiResponse | Clan[] = await response.json();

  // API may return either { clans: [...] } or just [...]
  if (Array.isArray(data)) {
    return data;
  }

  return data.clans ?? [];
}

/**
 * Simple client-side search helper by clan name.
 * This can be wired into the Plaza "Clan Search" field.
 */
export async function searchClansByName(query: string): Promise<Clan[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const clans = await getAllClans();
  return clans.filter((clan) => clan.name.toLowerCase().includes(trimmed));
}

