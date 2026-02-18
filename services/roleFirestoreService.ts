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
// Permission (what a role is allowed to do)
// ---------------------------------------------------------------------------

export type Permission =
  | "verify_ancestry"
  | "manage_members"
  | "edit_clan_profile"
  | "publish_history"
  | "manage_privacy"
  | "assign_roles"
  | "moderate_content"
  | "view_analytics";

// ---------------------------------------------------------------------------
// Scope
// ---------------------------------------------------------------------------

export type RoleScope = "global" | "clan" | "lineage";

// ---------------------------------------------------------------------------
// Role document (Firestore `roles` collection)
// ---------------------------------------------------------------------------

export type Role = {
  role_id: string;
  role_name: string;
  display_name: string;
  description: string;
  scope: RoleScope;
  permissions: Permission[];
  rank_level: number;
  assigned_to: { user_id: string }[];
  clan_id: string | null;
  can_verify_ancestry: boolean;
  can_manage_members: boolean;
  can_edit_clan_profile: boolean;
  can_publish_history: boolean;
  can_manage_privacy: boolean;
  created_by: string;
  created_at: Timestamp;
  updated_at: Timestamp;
};

export type CreateRoleInput = {
  role_id: string;
  role_name: string;
  display_name: string;
  description: string;
  scope: RoleScope;
  permissions?: Permission[];
  rank_level?: number;
  assigned_to?: { user_id: string }[];
  clan_id?: string | null;
  can_verify_ancestry?: boolean;
  can_manage_members?: boolean;
  can_edit_clan_profile?: boolean;
  can_publish_history?: boolean;
  can_manage_privacy?: boolean;
  created_by: string;
};

export type UpdateRoleInput = Partial<
  Omit<Role, "role_id" | "created_at" | "created_by">
> & { updated_at?: Timestamp };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const rolesRef = collection(db, "roles");

function roleDoc(roleId: string) {
  return doc(db, "roles", roleId);
}

function toRole(docId: string, data: Record<string, unknown>): Role {
  const getTs = (v: unknown): Timestamp | null =>
    v != null && typeof (v as Timestamp).toDate === "function" ? (v as Timestamp) : null;
  return {
    role_id: docId,
    role_name: (data.role_name as string) ?? "",
    display_name: (data.display_name as string) ?? "",
    description: (data.description as string) ?? "",
    scope: (data.scope as RoleScope) ?? "global",
    permissions: Array.isArray(data.permissions) ? (data.permissions as Permission[]) : [],
    rank_level: typeof data.rank_level === "number" ? data.rank_level : 0,
    assigned_to: Array.isArray(data.assigned_to)
      ? (data.assigned_to as { user_id: string }[])
      : [],
    clan_id: (data.clan_id as string) ?? null,
    can_verify_ancestry: Boolean(data.can_verify_ancestry),
    can_manage_members: Boolean(data.can_manage_members),
    can_edit_clan_profile: Boolean(data.can_edit_clan_profile),
    can_publish_history: Boolean(data.can_publish_history),
    can_manage_privacy: Boolean(data.can_manage_privacy),
    created_by: (data.created_by as string) ?? "",
    created_at: getTs(data.created_at) ?? ({} as Timestamp),
    updated_at: getTs(data.updated_at) ?? ({} as Timestamp),
  };
}

function now(): ReturnType<typeof serverTimestamp> {
  return serverTimestamp() as ReturnType<typeof serverTimestamp>;
}

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

/**
 * Create a role document. Firestore will create the `roles` collection on first write.
 */
export async function createRole(input: CreateRoleInput): Promise<Role> {
  const ref = roleDoc(input.role_id);
  const nowTs = now();
  const docData: Omit<Role, "role_id"> & { role_id: string } = {
    role_id: input.role_id,
    role_name: input.role_name,
    display_name: input.display_name,
    description: input.description,
    scope: input.scope,
    permissions: input.permissions ?? [],
    rank_level: input.rank_level ?? 0,
    assigned_to: input.assigned_to ?? [],
    clan_id: input.clan_id ?? null,
    can_verify_ancestry: input.can_verify_ancestry ?? false,
    can_manage_members: input.can_manage_members ?? false,
    can_edit_clan_profile: input.can_edit_clan_profile ?? false,
    can_publish_history: input.can_publish_history ?? false,
    can_manage_privacy: input.can_manage_privacy ?? false,
    created_by: input.created_by,
    created_at: nowTs as Timestamp,
    updated_at: nowTs as Timestamp,
  };
  await setDoc(ref, docData);
  const snap = await getDoc(ref);
  if (!snap.exists()) throw new Error("Role document was not created.");
  return toRole(snap.id, snap.data() as Record<string, unknown>);
}

/**
 * Get a role by ID.
 */
export async function getRoleById(roleId: string): Promise<Role | null> {
  const snap = await getDoc(roleDoc(roleId));
  if (!snap.exists()) return null;
  return toRole(snap.id, snap.data() as Record<string, unknown>);
}

/**
 * Get all roles, optionally filtered by scope or clan_id.
 */
export async function getRoles(options?: {
  scope?: RoleScope;
  clan_id?: string | null;
  limit?: number;
}): Promise<Role[]> {
  const limitOption = options?.limit ?? 100;
  const q = query(
    rolesRef,
    orderBy("rank_level", "desc"),
    firestoreLimit(limitOption)
  );
  const snapshot = await getDocs(q);
  let list = snapshot.docs.map((d) => toRole(d.id, d.data() as Record<string, unknown>));
  if (options?.scope) list = list.filter((r) => r.scope === options.scope);
  if (options?.clan_id !== undefined)
    list = list.filter((r) => r.clan_id === options.clan_id);
  return list;
}

/**
 * Update a role. Only provided fields are updated; updated_at set to server time if omitted.
 */
export async function updateRole(roleId: string, updates: UpdateRoleInput): Promise<void> {
  const ref = roleDoc(roleId);
  const payload = { ...updates };
  if (payload.updated_at === undefined) payload.updated_at = now() as Timestamp;
  await updateDoc(ref, payload as Record<string, unknown>);
}

/**
 * Assign a user to a role (add to assigned_to).
 */
export async function assignUserToRole(roleId: string, userId: string): Promise<void> {
  const role = await getRoleById(roleId);
  if (!role) throw new Error("Role not found.");
  const exists = role.assigned_to.some((a) => a.user_id === userId);
  if (exists) return;
  const next = [...role.assigned_to, { user_id: userId }];
  await updateRole(roleId, { assigned_to: next });
}

/**
 * Remove a user from a role.
 */
export async function unassignUserFromRole(roleId: string, userId: string): Promise<void> {
  const role = await getRoleById(roleId);
  if (!role) throw new Error("Role not found.");
  const next = role.assigned_to.filter((a) => a.user_id !== userId);
  await updateRole(roleId, { assigned_to: next });
}

/**
 * Get roles assigned to a user.
 */
export async function getRolesForUser(userId: string): Promise<Role[]> {
  const all = await getRoles({ limit: 200 });
  return all.filter((r) => r.assigned_to.some((a) => a.user_id === userId));
}

// ---------------------------------------------------------------------------
// Seed default roles (creates `roles` collection with initial documents)
// ---------------------------------------------------------------------------

const DEFAULT_ROLES: Omit<CreateRoleInput, "created_by">[] = [
  {
    role_id: "member",
    role_name: "member",
    display_name: "Member",
    description: "Default member of Ukho; can view and participate within their scope.",
    scope: "global",
    permissions: [],
    rank_level: 0,
    assigned_to: [],
    clan_id: null,
    can_verify_ancestry: false,
    can_manage_members: false,
    can_edit_clan_profile: false,
    can_publish_history: false,
    can_manage_privacy: false,
  },
  {
    role_id: "elder",
    role_name: "elder",
    display_name: "Clan Elder",
    description: "Elder who can verify ancestry and guide lineage within clan or lineage scope.",
    scope: "clan",
    permissions: ["verify_ancestry", "moderate_content"],
    rank_level: 2,
    assigned_to: [],
    clan_id: null,
    can_verify_ancestry: true,
    can_manage_members: false,
    can_edit_clan_profile: false,
    can_publish_history: true,
    can_manage_privacy: false,
  },
  {
    role_id: "clan_admin",
    role_name: "clan_admin",
    display_name: "Clan Administrator",
    description: "Administers a clan: members, profile, and privacy.",
    scope: "clan",
    permissions: ["manage_members", "edit_clan_profile", "manage_privacy", "assign_roles"],
    rank_level: 3,
    assigned_to: [],
    clan_id: null,
    can_verify_ancestry: true,
    can_manage_members: true,
    can_edit_clan_profile: true,
    can_publish_history: true,
    can_manage_privacy: true,
  },
  {
    role_id: "historian",
    role_name: "historian",
    display_name: "Historian",
    description: "Curates and publishes clan and lineage history.",
    scope: "lineage",
    permissions: ["publish_history", "edit_clan_profile"],
    rank_level: 1,
    assigned_to: [],
    clan_id: null,
    can_verify_ancestry: false,
    can_manage_members: false,
    can_edit_clan_profile: true,
    can_publish_history: true,
    can_manage_privacy: false,
  },
];

/**
 * Ensure the roles collection exists with default roles. Idempotent: only creates roles that do not exist.
 * Call once on app init (e.g. in root _layout or a setup flow). Pass created_by (e.g. "system" or first admin user_id).
 * This creates the Firestore `roles` collection and seeds member, elder, clan_admin, historian.
 */
export async function ensureDefaultRoles(createdBy: string = "system"): Promise<void> {
  for (const r of DEFAULT_ROLES) {
    const existing = await getRoleById(r.role_id);
    if (existing) continue;
    await createRole({ ...r, created_by: createdBy });
  }
}
