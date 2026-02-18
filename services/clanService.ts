import { db } from "@/app/firebase/config";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
} from "firebase/firestore";

/**
 * Core Clan document shape stored in Firestore.
 *
 * Collection: `clans`
 * Document ID: `clan_id`
 *
 * Optional fields (tribe, totem, advanced) are persisted when provided.
 */
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
  /** Tribe (e.g. Zulu, Xhosa). */
  tribe?: string | null;
  /** Totem (e.g. animal or symbol). */
  totem?: string | null;
  // --- Optional advanced / cultural fields ---
  clan_praise_name?: string | null;
  totem_image?: string | null;
  clan_colors?: string | null;
  origin_story?: string | null;
  ancestral_territory?: string | null;
  current_regions?: string | null;
  clan_symbol?: string | null;
  traditional_leadership?: string | null;
  member_count?: number | null;
  founded_date?: string | null;
  cultural_practices?: string | null;
  ceremonies?: string | null;
  traditions?: string | null;
  praise_poetry?: string | null;
  clan_history?: string | null;
  notable_ancestors?: string | null;
};

/**
 * Options used to search / filter clans.
 *
 * - `text`: fuzzy text search across name, house, and branch
 * - `regions`: match clans that belong to ANY of the given regions
 * - `branches`: match clans whose branch is in the list
 * - `lineageTypes`: match clans with lineage_type in the list
 */
export type ClanQueryOptions = {
  text?: string;
  regions?: string[];
  branches?: string[];
  lineageTypes?: string[];
};

const clansRef = collection(db, "clans");

/**
 * Create (or overwrite) a clan document.
 */
export async function createClan(clan: Clan): Promise<void> {
  const clanRef = doc(db, "clans", clan.clan_id);
  await setDoc(clanRef, clan);
}

/**
 * Fetch all clans from Firestore.
 *
 * NOTE: For large collections, consider adding pagination in the future.
 */
export async function getAllClans(): Promise<Clan[]> {
  const snapshot = await getDocs(clansRef);

  return snapshot.docs.map((d) => ({
    ...(d.data() as Clan),
    clan_id: d.id,
  }));
}

/**
 * Fetch a single clan by its id.
 */
export async function getClanById(clanId: string): Promise<Clan | null> {
  const clanRef = doc(db, "clans", clanId);
  const snap = await getDoc(clanRef);

  if (!snap.exists()) return null;

  return {
    ...(snap.data() as Clan),
    clan_id: snap.id,
  };
}

/**
 * Update an existing clan. Only provided fields are updated.
 */
export async function updateClan(
  clanId: string,
  updates: Partial<Clan>
): Promise<void> {
  const clanRef = doc(db, "clans", clanId);
  await updateDoc(clanRef, updates);
}

/**
 * Delete a clan by id.
 */
export async function deleteClan(clanId: string): Promise<void> {
  const clanRef = doc(db, "clans", clanId);
  await deleteDoc(clanRef);
}

/**
 * High-level search function that can combine text search and simple filters.
 *
 * For now this loads all clans and filters in-memory. If the dataset grows
 * significantly, this can be optimised with Firestore queries + pagination.
 */
export async function searchClans(options: ClanQueryOptions): Promise<Clan[]> {
  const { text, regions, branches, lineageTypes } = options;
  const hasFilters =
    !!text ||
    (regions && regions.length > 0) ||
    (branches && branches.length > 0) ||
    (lineageTypes && lineageTypes.length > 0);

  if (!hasFilters) {
    return getAllClans();
  }

  const allClans = await getAllClans();
  const textLower = text?.trim().toLowerCase() ?? "";
  const regionSet = new Set(
    (regions ?? []).map((r) => r.trim().toLowerCase()).filter(Boolean)
  );
  const branchSet = new Set(
    (branches ?? []).map((b) => b.trim().toLowerCase()).filter(Boolean)
  );
  const lineageSet = new Set(
    (lineageTypes ?? []).map((l) => l.trim().toLowerCase()).filter(Boolean)
  );

  return allClans.filter((clan) => {
    if (textLower) {
      const haystack = [
        clan.name,
        clan.tribe ?? "",
        clan.house ?? "",
        clan.branch ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(textLower)) return false;
    }

    if (regionSet.size > 0) {
      const clanRegionsLower = (clan.region ?? []).map((r) =>
        r.toLowerCase()
      );
      const matchesRegion = clanRegionsLower.some((r) => regionSet.has(r));
      if (!matchesRegion) return false;
    }

    if (branchSet.size > 0) {
      const branch = (clan.branch ?? "").toLowerCase();
      if (!branchSet.has(branch)) return false;
    }

    if (lineageSet.size > 0) {
      const lineage = (clan.lineage_type ?? "").toLowerCase();
      if (!lineageSet.has(lineage)) return false;
    }

    return true;
  });
}

/**
 * Simple helper to search clans by name. Thin wrapper around searchClans.
 */
export async function searchClansByName(query: string): Promise<Clan[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  return searchClans({ text: trimmed });
}
