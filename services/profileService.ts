import { collection, doc, getDoc, getDocs } from "firebase/firestore";

import { db } from "@/app/firebase/config";

export type Profile = {
  id: string;
  name?: string;
  fullName?: string;
  [key: string]: unknown;
};

const profilesRef = collection(db, "profiles");

/**
 * Fetch all profiles from Firestore.
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const snapshot = await getDocs(profilesRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Profile, "id">),
  }));
}

/**
 * Search profiles by name (client-side filter after fetching; for larger datasets use a query).
 */
export async function searchProfilesByName(searchQuery: string): Promise<Profile[]> {
  const trimmed = searchQuery.trim().toLowerCase();
  if (!trimmed) return [];

  const profiles = await getAllProfiles();
  return profiles.filter((profile) => {
    const name = (profile.fullName ?? profile.name ?? "")
      .toString()
      .toLowerCase();
    return name.includes(trimmed);
  });
}

/**
 * Get a single profile by id.
 */
export async function getProfileById(profileId: string): Promise<Profile | null> {
  const snap = await getDoc(doc(db, "profiles", profileId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<Profile, "id">) };
}
