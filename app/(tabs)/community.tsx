import { Feather } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

type CommunityPost = {
  id: string;
  name: string;
  handle: string;
  clan: string;
  tribe: string;
  avatar: string;
  timeAgo: string;
  content: string;
  likes: number;
  comments: number;
};

const POSTS: CommunityPost[] = [
  {
    id: 'p1',
    name: 'Zandi Madiba',
    handle: '@zandile_m',
    clan: 'MADIBA',
    tribe: 'XHOSA',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '1h',
    content:
      'Just attended the clan gathering in Eastern Cape. The wisdom shared by the elders was profound. Unity is our strength. ✊🏾🇿🇦',
    likes: 420,
    comments: 24,
  },
  {
    id: 'p2',
    name: 'Banele Zulu',
    handle: '@banele_z',
    clan: 'ZULU',
    tribe: 'ZULU',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=150&h=150',
    timeAgo: '4h',
    content:
      'Looking for Khumalo clan contacts in Johannesburg for a traditional ceremony request. Any leads?',
    likes: 89,
    comments: 15,
  },
];

// People You May Know suggestions (derived from Possible/Nearby Kin concepts)
const PEOPLE_YOU_MAY_KNOW = [
  {
    id: 's1',
    name: 'Lungile Khumalo',
    clan: 'KHUMALO',
    hint: 'Direct Clan Match',
    avatar:
      'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 's2',
    name: 'Sabelo Mabaso',
    clan: 'MABASO',
    hint: 'Related Branch',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 's3',
    name: 'Nomalanga Mntungwa',
    clan: 'MNTUNGWA',
    hint: 'Shared Praises',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 's4',
    name: 'Thabo Dlamini',
    clan: 'DLAMINI',
    hint: 'Nearby in Soweto • 0.4km',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
  },
];

export default function CommunityScreen() {
  const { theme } = useTheme();

  const handleConnectKin = (postId: string) => {
    // Placeholder for future connect logic
    console.log('Connect kin for post:', postId);
  };

  const handleConnectSuggestion = (id: string) => {
    // Mirrors connect behaviour from Possible/Nearby Kin screens
    console.log('Connect suggestion:', id);
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Feather name="users" size={20} color={BrandColors.orange500} />
            <View>
              <ThemedText
                style={[
                  styles.headerTitle,
                  { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
                ]}
              >
                Community Stories
              </ThemedText>
              <ThemedText style={[styles.headerSubtitle, { color: theme.textDim }]}>
                Voices from the Ukho network
              </ThemedText>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="community" />
          </View>
        </View>

        {/* People You May Know */}
        <View style={styles.suggestionsSection}>
          <View style={styles.suggestionsHeaderRow}>
            <ThemedText style={[styles.suggestionsTitle, { color: theme.textMain }]}>
              People You May Know
            </ThemedText>
            <ThemedText style={[styles.suggestionsSubtitle, { color: theme.textDim }]}>
              Possible & Nearby Kin
            </ThemedText>
          </View>
          <FlatList
            horizontal
            data={PEOPLE_YOU_MAY_KNOW}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.suggestionsList}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.suggestionCard,
                  { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
                ]}
              >
                <Image source={{ uri: item.avatar }} style={styles.suggestionAvatar} />
                <ThemedText
                  style={[styles.suggestionName, { color: theme.textMain }]}
                  numberOfLines={1}
                >
                  {item.name}
                </ThemedText>
                <ThemedText style={styles.suggestionClan} numberOfLines={1}>
                  {item.clan}
                </ThemedText>
                <ThemedText
                  style={[styles.suggestionHint, { color: theme.textDim }]}
                  numberOfLines={2}
                >
                  {item.hint}
                </ThemedText>
                <TouchableOpacity
                  onPress={() => handleConnectSuggestion(item.id)}
                  style={styles.suggestionConnectButton}
                  activeOpacity={0.8}
                >
                  <Feather name="user-plus" size={14} color="#fff" />
                  <ThemedText style={styles.suggestionConnectText}>CONNECT</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        {/* Posts */}
        <View style={styles.postList}>
          {POSTS.map((post) => (
            <View
              key={post.id}
              style={[
                styles.postCard,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              {/* Header row */}
              <View style={styles.postHeaderRow}>
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: post.avatar }} style={styles.avatar} />
                  <View style={styles.verifiedBadge}>
                    <Feather name="shield" size={10} color="#fff" />
                  </View>
                </View>

                <View style={styles.postMeta}>
                  <View style={styles.nameHandleRow}>
                    <ThemedText style={[styles.name, { color: theme.textMain }]}>
                      {post.name}
                    </ThemedText>
                    <ThemedText style={[styles.handle, { color: theme.textDim }]}>
                      {post.handle}
                    </ThemedText>
                  </View>
                  <View style={styles.clanRow}>
                    <View style={styles.clanTag}>
                      <ThemedText style={styles.clanTagText}>{post.clan}</ThemedText>
                    </View>
                    <View style={styles.clanTagMuted}>
                      <ThemedText style={styles.clanTagMutedText}>{post.tribe}</ThemedText>
                    </View>
                  </View>
                </View>

                <ThemedText style={[styles.timeAgo, { color: theme.textDim }]}>
                  {post.timeAgo}
                </ThemedText>
              </View>

              {/* Content */}
              <ThemedText style={[styles.postContent, { color: theme.textMain }]}>
                {post.content}
              </ThemedText>

              {/* Placeholder media area */}
              <View
                style={[
                  styles.mediaPlaceholder,
                  {
                    borderColor: theme.borderColor,
                  },
                ]}
              >
                <ThemedText style={[styles.mediaText, { color: theme.textDim }]}>
                  Post content
                </ThemedText>
              </View>

              {/* Footer / actions */}
              <View style={styles.footerRow}>
                <View style={styles.metricsRow}>
                  <View style={styles.metric}>
                    <Feather name="heart" size={18} color={theme.textDim} />
                    <ThemedText style={[styles.metricText, { color: theme.textDim }]}>
                      {post.likes}
                    </ThemedText>
                  </View>
                  <View style={styles.metric}>
                    <Feather name="message-circle" size={18} color={theme.textDim} />
                    <ThemedText style={[styles.metricText, { color: theme.textDim }]}>
                      {post.comments}
                    </ThemedText>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => handleConnectKin(post.id)}
                  style={styles.connectKinButton}
                  activeOpacity={0.8}
                >
                  <Feather name="user-plus" size={16} color="#fff" />
                  <ThemedText style={styles.connectKinText}>CONNECT KIN</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
    justifyContent: 'space-between',
    marginBottom: Spacing[2],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
  menuContainer: {
    marginLeft: Spacing[2],
  },
  suggestionsSection: {
    marginTop: Spacing[2],
    marginBottom: Spacing[4],
  },
  suggestionsHeaderRow: {
    marginBottom: Spacing[2],
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  suggestionsSubtitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  suggestionsList: {
    gap: Spacing[3],
  },
  suggestionCard: {
    width: 200,
    padding: Spacing[4],
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    marginRight: Spacing[3],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  suggestionAvatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing[3],
  },
  suggestionName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  suggestionClan: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: BrandColors.orange500,
    textTransform: 'uppercase',
    marginBottom: Spacing[1],
  },
  suggestionHint: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
    marginBottom: Spacing[3],
  },
  suggestionConnectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.orange500,
  },
  suggestionConnectText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: Typography.letterSpacing.widest,
  },
  postList: {
    gap: Spacing[4],
  },
  postCard: {
    borderRadius: BorderRadius['2.5rem'],
    padding: Spacing[5],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  avatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginRight: Spacing[3],
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.xl,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BrandColors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  postMeta: {
    flex: 1,
    gap: Spacing[1],
  },
  nameHandleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  handle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  clanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  clanTag: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: BrandColors.orange500,
  },
  clanTagText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: Typography.letterSpacing.widest,
  },
  clanTagMuted: {
    paddingHorizontal: Spacing[3],
    paddingVertical: 4,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
  },
  clanTagMutedText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    color: '#e2e8f0',
    letterSpacing: Typography.letterSpacing.widest,
  },
  timeAgo: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  postContent: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: Spacing[3],
  },
  mediaPlaceholder: {
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    paddingVertical: Spacing[6],
    paddingHorizontal: Spacing[4],
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  mediaText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  metricText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  connectKinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  connectKinText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: '#e2e8f0',
  },
});


