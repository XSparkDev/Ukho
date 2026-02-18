import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore";
import { serverTimestamp } from "firebase/firestore";

import { db } from "@/app/firebase/config";

// ---------------------------------------------------------------------------
// Enums / option types
// ---------------------------------------------------------------------------

export type UserType = "user" | "moderator" | "contributor" | "elder" | "clan_admin";

export type VerificationStatus = "pending" | "verified" | "rejected";

export type AccountStatus = "active" | "suspended" | "inactive";

// ---------------------------------------------------------------------------
// References (stored as IDs in Firestore)
// ---------------------------------------------------------------------------

export type ClanRef = { clan_id: string };

export type TribeRef = { tribe_id: string };

// ---------------------------------------------------------------------------
// Privacy Settings (nested object)
// ---------------------------------------------------------------------------

export type PrivacySettings = {
  profile_visible?: boolean;
  show_email?: boolean;
  show_region?: boolean;
  show_ancestral_region?: boolean;
  show_clan?: boolean;
  show_tribe?: boolean;
  show_languages?: boolean;
  show_bio?: boolean;
  show_profile_image?: boolean;
  [key: string]: boolean | undefined;
};

// ---------------------------------------------------------------------------
// User document (Firestore `users` collection)
// ---------------------------------------------------------------------------

export type User = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  primary_clan: ClanRef | null;
  secondary_clans: ClanRef[];
  tribe: TribeRef | null;
  region: string;
  ancestral_region: string;
  user_type: UserType;
  verification_status: VerificationStatus;
  verified_by: string | null; // user_id of elder/admin
  verification_date: Timestamp | null;
  profile_image: string;
  documents: string;
  images: string;
  bio: string;
  languages_spoken: string[];
  privacy_settings: PrivacySettings;
  account_status: AccountStatus;
  last_active: Timestamp | null;
  created_at: Timestamp;
  updated_at: Timestamp;
};

// Input type for create: required fields + optional with defaults
export type CreateUserInput = {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  primary_clan?: ClanRef | null;
  secondary_clans?: ClanRef[];
  tribe?: TribeRef | null;
  region?: string;
  ancestral_region?: string;
  user_type?: UserType;
  verification_status?: VerificationStatus;
  verified_by?: string | null;
  verification_date?: Timestamp | null;
  profile_image?: string;
  documents?: string;
  images?: string;
  bio?: string;
  languages_spoken?: string[];
  privacy_settings?: PrivacySettings;
  account_status?: AccountStatus;
  last_active?: Timestamp | null;
  /** Legacy auth fields: keep for Auth service compatibility */
  fullName?: string;
  cellNumber?: string;
};

// Partial for updates (all fields optional except user_id not updated)
export type UpdateUserInput = Partial<Omit<User, "user_id" | "created_at">> & {
  updated_at?: Timestamp;
};

// ---------------------------------------------------------------------------
// Defaults and helpers
// ---------------------------------------------------------------------------

const DEFAULT_PRIVACY: PrivacySettings = {
  profile_visible: true,
  show_email: false,
  show_region: true,
  show_ancestral_region: true,
  show_clan: true,
  show_tribe: true,
  show_languages: true,
  show_bio: true,
  show_profile_image: true,
};

function now(): ReturnType<typeof serverTimestamp> {
  return serverTimestamp() as ReturnType<typeof serverTimestamp>;
}

const usersRef = collection(db, "users");

function userDoc(uid: string) {
  return doc(db, "users", uid);
}

function toUser(docId: string, data: Record<string, unknown>): User {
  const getTs = (v: unknown): Timestamp | null =>
    v != null && typeof (v as Timestamp).toDate === "function" ? (v as Timestamp) : null;
  return {
    user_id: docId,
    first_name: (data.first_name as string) ?? "",
    last_name: (data.last_name as string) ?? "",
    email: (data.email as string) ?? "",
    primary_clan: (data.primary_clan as ClanRef) ?? null,
    secondary_clans: Array.isArray(data.secondary_clans) ? (data.secondary_clans as ClanRef[]) : [],
    tribe: (data.tribe as TribeRef) ?? null,
    region: (data.region as string) ?? "",
    ancestral_region: (data.ancestral_region as string) ?? "",
    user_type: (data.user_type as UserType) ?? "user",
    verification_status: (data.verification_status as VerificationStatus) ?? "pending",
    verified_by: (data.verified_by as string) ?? null,
    verification_date: getTs(data.verification_date),
    profile_image: (data.profile_image as string) ?? "",
    documents: (data.documents as string) ?? "",
    images: (data.images as string) ?? "",
    bio: (data.bio as string) ?? "",
    languages_spoken: Array.isArray(data.languages_spoken) ? (data.languages_spoken as string[]) : [],
    privacy_settings: (data.privacy_settings as PrivacySettings) ?? DEFAULT_PRIVACY,
    account_status: (data.account_status as AccountStatus) ?? "active",
    last_active: getTs(data.last_active),
    created_at: getTs(data.created_at) ?? ({} as Timestamp),
    updated_at: getTs(data.updated_at) ?? ({} as Timestamp),
  };
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Create a new user document in Firestore.
 * Uses user_id as document ID. Sets created_at and updated_at to server timestamp.
 */
export async function createUser(input: CreateUserInput): Promise<User> {
  const ref = userDoc(input.user_id);
  const nowTs = now();
  const doc: Omit<User, "user_id"> & { user_id: string } = {
    user_id: input.user_id,
    first_name: input.first_name,
    last_name: input.last_name,
    email: input.email,
    primary_clan: input.primary_clan ?? null,
    secondary_clans: input.secondary_clans ?? [],
    tribe: input.tribe ?? null,
    region: input.region ?? "",
    ancestral_region: input.ancestral_region ?? "",
    user_type: input.user_type ?? "user",
    verification_status: input.verification_status ?? "pending",
    verified_by: input.verified_by ?? null,
    verification_date: input.verification_date ?? null,
    profile_image: input.profile_image ?? "",
    documents: input.documents ?? "",
    images: input.images ?? "",
    bio: input.bio ?? "",
    languages_spoken: input.languages_spoken ?? [],
    privacy_settings: input.privacy_settings ?? DEFAULT_PRIVACY,
    account_status: input.account_status ?? "active",
    last_active: input.last_active ?? null,
    created_at: nowTs as Timestamp,
    updated_at: nowTs as Timestamp,
  };
  const docData: Record<string, unknown> = doc as Record<string, unknown>;
  if (input.fullName !== undefined) docData.fullName = input.fullName;
  if (input.cellNumber !== undefined) docData.cellNumber = input.cellNumber;
  await setDoc(ref, docData);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("User document was not created.");
  return toUser(snap.id, snap.data() as Record<string, unknown>);
}

/**
 * Ensure a user document exists for the given Auth UID and link Auth to the users table.
 * - If no document: creates one with first_name/last_name from fullName, email, and legacy fullName/cellNumber.
 * - If document exists with new shape (has created_at): touches last_active.
 * - If document exists with legacy shape only: migrates by adding new User fields, keeps fullName/email/cellNumber.
 * Call after register and after login so every authenticated user has a users table row.
 */
export type EnsureUserDocumentInput = {
  email: string;
  fullName?: string;
  cellNumber?: string;
};

export async function ensureUserDocument(
  userId: string,
  input: EnsureUserDocumentInput
): Promise<User | null> {
  const ref = userDoc(userId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    const fullName = input.fullName?.trim() ?? "";
    const parts = fullName.split(/\s+/).filter(Boolean);
    const first_name = parts[0] ?? "";
    const last_name = parts.slice(1).join(" ") ?? "";
    await createUser({
      user_id: userId,
      first_name,
      last_name,
      email: input.email.trim(),
      fullName: fullName || undefined,
      cellNumber: input.cellNumber?.trim() || undefined,
    });
    return getUserById(userId);
  }

  const data = snap.data() as Record<string, unknown>;
  const hasNewShape = data.created_at != null && typeof (data.created_at as Timestamp).toDate === "function";

  if (hasNewShape) {
    await touchLastActive(userId);
    return toUser(snap.id, data);
  }

  const fullName = (data.fullName as string) ?? input.fullName ?? "";
  const parts = fullName.split(/\s+/).filter(Boolean);
  const first_name = parts[0] ?? "";
  const last_name = parts.slice(1).join(" ") ?? "";
  const nowTs = now();
  await updateDoc(ref, {
    first_name,
    last_name,
    email: data.email ?? input.email,
    primary_clan: null,
    secondary_clans: [],
    tribe: null,
    region: "",
    ancestral_region: "",
    user_type: "user",
    verification_status: "pending",
    verified_by: null,
    verification_date: null,
    profile_image: "",
    documents: "",
    images: "",
    bio: "",
    languages_spoken: [],
    privacy_settings: DEFAULT_PRIVACY,
    account_status: "active",
    last_active: nowTs,
    created_at: nowTs,
    updated_at: nowTs,
  });
  const updated = await getDoc(ref);
  return updated.exists() ? toUser(updated.id, updated.data() as Record<string, unknown>) : null;
}

/**
 * Get a user by ID (Firebase Auth UID).
 */
export async function getUserById(userId: string): Promise<User | null> {
  const snap = await getDoc(userDoc(userId));
  if (!snap.exists()) return null;
  return toUser(snap.id, snap.data() as Record<string, unknown>);
}

/**
 * Update an existing user. Only provided fields are updated.
 * updated_at is set to server timestamp if not provided.
 */
export async function updateUser(userId: string, updates: UpdateUserInput): Promise<void> {
  const ref = userDoc(userId);
  const payload = { ...updates };
  if (payload.updated_at === undefined) {
    payload.updated_at = now() as Timestamp;
  }
  await updateDoc(ref, payload as Record<string, unknown>);
}

/**
 * Update last_active to server timestamp (e.g. on app open or activity).
 */
export async function touchLastActive(userId: string): Promise<void> {
  await updateUser(userId, { last_active: now() as Timestamp });
}

/**
 * Fetch users with optional filters. Returns at most `limit` results (default 50).
 * Filtering is applied in-memory to avoid composite index requirements.
 */
export type GetUsersOptions = {
  account_status?: AccountStatus;
  verification_status?: VerificationStatus;
  user_type?: UserType;
  limit?: number;
};

export async function getUsers(options: GetUsersOptions = {}): Promise<User[]> {
  const { account_status, verification_status, user_type, limit: limitOption = 50 } = options;
  const q = query(
    usersRef,
    orderBy("created_at", "desc"),
    firestoreLimit(Math.min(limitOption * 4, 200))
  );
  const snapshot = await getDocs(q);
  let list = snapshot.docs.map((d) => toUser(d.id, d.data() as Record<string, unknown>));
  if (account_status) list = list.filter((u) => u.account_status === account_status);
  if (verification_status) list = list.filter((u) => u.verification_status === verification_status);
  if (user_type) list = list.filter((u) => u.user_type === user_type);
  return list.slice(0, limitOption);
}

/**
 * Get all users (no filter). Use with care; prefer getUsers with filters for large collections.
 */
export async function getAllUsers(limitCount: number = 100): Promise<User[]> {
  const q = query(usersRef, orderBy("created_at", "desc"), firestoreLimit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toUser(d.id, d.data() as Record<string, unknown>));
}

/**
 * Set verification status and optionally verified_by and verification_date.
 */
export async function setVerificationStatus(
  userId: string,
  status: VerificationStatus,
  verifiedByUserId: string | null = null
): Promise<void> {
  const updates: UpdateUserInput = {
    verification_status: status,
    verified_by: verifiedByUserId,
    verification_date: now() as Timestamp,
  };
  await updateUser(userId, updates);
}

/**
 * Set account status (e.g. suspend or reactivate).
 */
export async function setAccountStatus(userId: string, status: AccountStatus): Promise<void> {
  await updateUser(userId, { account_status: status });
}
