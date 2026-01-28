import { API_ROUTES } from '@/constants/routes';

const PROFILES_URL = API_ROUTES.PROFILES.BASE;

export type Profile = {
  id: string;
  name?: string;
  fullName?: string;
  [key: string]: any;
};

type ProfilesApiResponse = {
  profiles: Profile[];
};

/**
 * Fetch all profiles from the mock API.
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const response = await fetch(PROFILES_URL);

  if (!response.ok) {
    throw new Error('Failed to fetch profiles. Please try again later.');
  }

  const data: ProfilesApiResponse | Profile[] = await response.json();

  // API may return either { profiles: [...] } or just [...]
  if (Array.isArray(data)) {
    return data;
  }

  return data.profiles ?? [];
}

/**
 * Client-side search helper by profile name.
 * Tries both `name` and `fullName` fields when present.
 */
export async function searchProfilesByName(query: string): Promise<Profile[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  const profiles = await getAllProfiles();

  return profiles.filter((profile) => {
    const name = (profile.fullName || profile.name || '').toString().toLowerCase();
    return name.includes(trimmed);
  });
}

