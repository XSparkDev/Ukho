import { db } from "@/app/firebase/config";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

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

const clansRef = collection(db, "clans");


// 🟢 CREATE
export async function createClan(clan: Clan) {
  const clanRef = doc(db, "clans", clan.clan_id);
  await setDoc(clanRef, clan);
}


// 🔵 READ ALL
export async function getAllClans(): Promise<Clan[]> {
  const snapshot = await getDocs(clansRef);

  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Clan),
    clan_id: doc.id,
  }));
}


// 🔵 READ ONE
export async function getClanById(clanId: string): Promise<Clan | null> {
  const clanRef = doc(db, "clans", clanId);
  const snap = await getDoc(clanRef);

  if (!snap.exists()) return null;

  return {
    ...(snap.data() as Clan),
    clan_id: snap.id,
  };
}


// 🟡 UPDATE
export async function updateClan(clanId: string, updates: Partial<Clan>) {
  const clanRef = doc(db, "clans", clanId);
  await updateDoc(clanRef, updates);
}


// 🔴 DELETE
export async function deleteClan(clanId: string) {
  const clanRef = doc(db, "clans", clanId);
  await deleteDoc(clanRef);
}


// 🔍 SEARCH (by name)
export async function searchClansByName(queryText: string): Promise<Clan[]> {
  const trimmed = queryText.trim();
  if (!trimmed) return [];

  const q = query(
    clansRef,
    where("name", ">=", trimmed),
    where("name", "<=", trimmed + "\uf8ff")
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    ...(doc.data() as Clan),
    clan_id: doc.id,
  }));
}
