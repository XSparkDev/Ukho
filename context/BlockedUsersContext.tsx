import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { db } from '@/app/firebase/config';
import { useAuth } from '@/context/AuthContext';

const STORAGE_KEY = '@ukho_blocked_users';

export type BlockedUser = {
  id: string;
  name: string;
  avatar: string;
  blockedAt: string;
  blockType?: 'messages_only' | 'fully_blocked';
};

type BlockedUsersContextValue = {
  blockedUsers: BlockedUser[];
  isLoading: boolean;
  addBlockedUser: (user: Omit<BlockedUser, 'blockedAt'> & { blockType?: BlockedUser['blockType'] }) => void;
  removeBlockedUser: (id: string) => void;
  isBlocked: (id: string) => boolean;
  refresh: () => Promise<void>;
};

const BlockedUsersContext = createContext<BlockedUsersContextValue | null>(null);

function blockedRef(uid: string) {
  return collection(db, 'users', uid, 'blocked');
}

export function BlockedUsersProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser } = useAuth();
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      if (authUser?.id) {
        const snapshot = await getDocs(blockedRef(authUser.id));
        const list = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          blockedAt: (d.data() as BlockedUser).blockedAt ?? 'Just now',
        })) as BlockedUser[];
        setBlockedUsers(list);
      } else {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as BlockedUser[];
          setBlockedUsers(Array.isArray(parsed) ? parsed : []);
        } else {
          setBlockedUsers([]);
        }
      }
    } catch {
      setBlockedUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [authUser?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const addBlockedUser = useCallback(
    async (user: Omit<BlockedUser, 'blockedAt'> & { blockType?: BlockedUser['blockType'] }) => {
      const newUser: BlockedUser = {
        ...user,
        blockedAt: 'Just now',
        blockType: user.blockType ?? 'fully_blocked',
      };
      if (authUser?.id) {
        try {
          const ref = doc(db, 'users', authUser.id, 'blocked', user.id);
          await setDoc(ref, {
            name: newUser.name,
            avatar: newUser.avatar,
            blockedAt: newUser.blockedAt,
            blockType: newUser.blockType,
          });
          setBlockedUsers((prev) => [...prev.filter((u) => u.id !== user.id), newUser]);
        } catch {
          setBlockedUsers((prev) => [...prev.filter((u) => u.id !== user.id), newUser]);
        }
      } else {
        setBlockedUsers((prev) => {
          const next = [...prev.filter((u) => u.id !== user.id), newUser];
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
          return next;
        });
      }
    },
    [authUser?.id]
  );

  const removeBlockedUser = useCallback(
    async (id: string) => {
      if (authUser?.id) {
        try {
          await deleteDoc(doc(db, 'users', authUser.id, 'blocked', id));
        } catch {}
        setBlockedUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        setBlockedUsers((prev) => {
          const next = prev.filter((u) => u.id !== id);
          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
          return next;
        });
      }
    },
    [authUser?.id]
  );

  const isBlocked = useCallback(
    (id: string) => blockedUsers.some((u) => u.id === id),
    [blockedUsers]
  );

  const refresh = useCallback(async () => {
    setIsLoading(true);
    await load();
  }, [load]);

  return (
    <BlockedUsersContext.Provider
      value={{
        blockedUsers,
        isLoading,
        addBlockedUser,
        removeBlockedUser,
        isBlocked,
        refresh,
      }}
    >
      {children}
    </BlockedUsersContext.Provider>
  );
}

export function useBlockedUsers() {
  const ctx = useContext(BlockedUsersContext);
  if (!ctx) throw new Error('useBlockedUsers must be used within BlockedUsersProvider');
  return ctx;
}
