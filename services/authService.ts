import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, db } from "@/app/firebase/config";

export type LoginPayload = {
  cellNumber: string;
  password: string;
};

export type RegisterPayload = LoginPayload & {
  fullName: string;
  email: string;
};

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  cellNumber: string;
};

const usersRef = () => db;
const userDoc = (uid: string) => doc(usersRef(), "users", uid);
const usersByCellRef = (cell: string) =>
  doc(usersRef(), "usersByCell", cell.trim().toLowerCase());

function buildAuthUser(uid: string, data: Record<string, unknown>): AuthUser {
  return {
    id: uid,
    fullName: (data.fullName as string) ?? "",
    email: (data.email as string) ?? "",
    cellNumber: (data.cellNumber as string) ?? "",
  };
}

/** Get current Firebase Auth user (null if not signed in). */
export function getFirebaseUser(): User | null {
  return auth.currentUser;
}

/** Get current app user profile from Firestore (null if not signed in or no profile). */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const fb = auth.currentUser;
  if (!fb) return null;
  const snap = await getDoc(userDoc(fb.uid));
  if (!snap.exists()) return null;
  return buildAuthUser(snap.id, snap.data() as Record<string, unknown>);
}

export async function register(payload: RegisterPayload): Promise<AuthUser> {
  const { cellNumber, password, fullName, email } = payload;

  if (!fullName.trim() || !cellNumber.trim() || !password.trim() || !email.trim()) {
    throw new Error("All fields are required.");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

  const uid = credential.user.uid;
  const userData = {
    fullName: fullName.trim(),
    email: email.trim(),
    cellNumber: cellNumber.trim(),
  };

  await setDoc(userDoc(uid), userData);
  const cellKey = cellNumber.trim().toLowerCase();
  if (cellKey) {
    await setDoc(usersByCellRef(cellNumber), { uid });
  }

  return buildAuthUser(uid, userData);
}

/** Login: first field can be email or cell number; second is password. */
export async function login(payload: LoginPayload): Promise<AuthUser> {
  const { cellNumber, password } = payload;

  if (!cellNumber.trim() || !password.trim()) {
    throw new Error("Cell number (or email) and password are required.");
  }

  const input = cellNumber.trim();
  const isEmail = input.includes("@");

  let emailToUse: string;

  if (isEmail) {
    emailToUse = input;
  } else {
    const byCellSnap = await getDoc(usersByCellRef(input));
    if (!byCellSnap.exists()) {
      const err: Error & { code?: string } = new Error(
        "No account found for this cell number. Try signing in with your email."
      );
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
    const uid = (byCellSnap.data() as { uid?: string }).uid;
    if (!uid) {
      const err: Error & { code?: string } = new Error("Invalid account data.");
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
    const userSnap = await getDoc(userDoc(uid));
    if (!userSnap.exists()) {
      const err: Error & { code?: string } = new Error("Account not found.");
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
    const emailFromProfile = (userSnap.data() as { email?: string }).email;
    if (!emailFromProfile) {
      const err: Error & { code?: string } = new Error("Account missing email.");
      err.code = "INVALID_CREDENTIALS";
      throw err;
    }
    emailToUse = emailFromProfile;
  }

  if (!emailToUse) {
    throw new Error("Login failed. Please try again.");
  }
  await signInWithEmailAndPassword(auth, emailToUse, password);

  const user = auth.currentUser;
  if (!user) {
    throw new Error("Login failed. Please try again.");
  }

  const profileSnap = await getDoc(userDoc(user.uid));
  if (!profileSnap.exists()) {
    return {
      id: user.uid,
      fullName: "",
      email: emailToUse,
      cellNumber: input,
    };
  }

  return buildAuthUser(profileSnap.id, profileSnap.data() as Record<string, unknown>);
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}
