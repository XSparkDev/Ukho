import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

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

export function BlockedUsersProvider({ children }: { children: React.ReactNode }) {
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BlockedUser[];
        setBlockedUsers(Array.isArray(parsed) ? parsed : []);
      } else {
        setBlockedUsers([]);
      }
    } catch {
      setBlockedUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addBlockedUser = useCallback(
    (user: Omit<BlockedUser, 'blockedAt'> & { blockType?: BlockedUser['blockType'] }) => {
      const newUser: BlockedUser = {
        ...user,
        blockedAt: 'Just now',
        blockType: user.blockType ?? 'fully_blocked',
      };
      setBlockedUsers((prev) => {
        const next = [...prev.filter((u) => u.id !== user.id), newUser];
        AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const removeBlockedUser = useCallback((id: string) => {
    setBlockedUsers((prev) => {
      const next = prev.filter((u) => u.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

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
