import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';

import { AnimatedButton } from '@/components/AnimatedButton';
import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';
import { useBlockedUsers } from '@/context/BlockedUsersContext';

export default function BlockedScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { blockedUsers, isLoading, removeBlockedUser, refresh } = useBlockedUsers();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return blockedUsers;
    return blockedUsers.filter((u) => u.name.toLowerCase().includes(q));
  }, [blockedUsers, searchQuery]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={BrandColors.orange500}
          />
        }
      >
        <View style={styles.headerRow}>
          <AnimatedButton onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={theme.textMain} />
          </AnimatedButton>
          <View style={styles.iconBadge}>
            <Feather name="user-x" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Blocked Users
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: BrandColors.orange500 }]}>
              MANAGE BLOCKED ACCOUNTS
            </ThemedText>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="blocked" />
          </View>
        </View>

        {blockedUsers.length > 0 && (
          <View style={styles.searchRow}>
            <Feather name="search" size={18} color={theme.textDim} style={styles.searchIcon} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name..."
              placeholderTextColor={theme.textDim}
              style={[
                styles.searchInput,
                { color: theme.textMain, backgroundColor: theme.bgColor, borderColor: theme.borderColor },
              ]}
            />
          </View>
        )}

        {isLoading ? (
          <View style={styles.loadingState}>
            <ThemedText style={[styles.loadingText, { color: theme.textDim }]}>
              Loading blocked list...
            </ThemedText>
          </View>
        ) : filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconWrap, { backgroundColor: theme.panelBg }]}>
              <Feather name="user-check" size={40} color={theme.textDim} />
            </View>
            <ThemedText style={[styles.emptyTitle, { color: theme.textMain }]}>
              {searchQuery.trim() ? 'No matches' : 'No blocked users'}
            </ThemedText>
            <ThemedText style={[styles.emptyDescription, { color: theme.textDim }]}>
              {searchQuery.trim()
                ? 'Try a different name.'
                : 'People you block will appear here. You can unblock them anytime from their profile or from Privacy.'}
            </ThemedText>
          </View>
        ) : (
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textDim }]}>
              {filteredUsers.length} blocked {filteredUsers.length === 1 ? 'user' : 'users'}
            </ThemedText>
            {filteredUsers.map((user) => (
              <View
                key={user.id}
                style={[
                  styles.userCard,
                  { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
                ]}
              >
                <View style={styles.userRow}>
                  <Image source={{ uri: user.avatar }} style={styles.avatar} />
                  <View style={styles.userMeta}>
                    <ThemedText style={[styles.userName, { color: theme.textMain }]}>
                      {user.name}
                    </ThemedText>
                    <ThemedText style={[styles.userTime, { color: theme.textDim }]}>
                      Blocked {user.blockedAt}
                    </ThemedText>
                    {user.blockType && (
                      <ThemedText style={[styles.blockTypeLabel, { color: theme.textDim }]}>
                        {user.blockType === 'messages_only'
                          ? 'Messages only (no new chats)'
                          : 'Fully blocked (removed from connections)'}
                      </ThemedText>
                    )}
                  </View>
                  <AnimatedButton
                    style={[styles.unblockBtn, { borderColor: theme.borderColor }]}
                    onPress={() => removeBlockedUser(user.id)}
                  >
                    <ThemedText style={[styles.unblockBtnText, { color: BrandColors.orange500 }]}>
                      Unblock
                    </ThemedText>
                  </AnimatedButton>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
    gap: Spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: { flex: 1 },
  menuContainer: { marginLeft: Spacing[2] },
  title: { fontSize: 22, fontWeight: '900' },
  subtitle: {
    marginTop: 4,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    gap: Spacing[2],
  },
  searchIcon: { marginLeft: 4 },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    paddingVertical: Spacing[2],
    paddingHorizontal: 0,
  },
  loadingState: {
    paddingVertical: Spacing[8],
    alignItems: 'center',
  },
  loadingText: { fontSize: Typography.fontSize.sm },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
    gap: Spacing[4],
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  emptyTitle: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  emptyDescription: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
  section: { gap: Spacing[2] },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    marginBottom: Spacing[1],
  },
  userCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
  },
  userMeta: { flex: 1 },
  userName: { fontSize: 16, fontWeight: '700' },
  userTime: { fontSize: Typography.fontSize.xs, marginTop: 2 },
  blockTypeLabel: {
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
    fontStyle: 'italic',
  },
  unblockBtn: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  unblockBtnText: { fontWeight: '700', fontSize: Typography.fontSize.sm },
});
