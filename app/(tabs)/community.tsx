import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, FlatList, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AnimatedButton } from '@/components/AnimatedButton';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';
import { useBlockedUsers } from '@/context/BlockedUsersContext';
import { getRandomUsers, type UserProfile } from '@/services/userService';

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
  rating?: number; // Rating out of 5, only show if >= 3
};

type ClanArticle = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  tribe: string;
  clan: string;
  region: string[];
};

const CLAN_ARTICLES: ClanArticle[] = [
  {
    id: 'a1',
    title: 'The Legacy of the Khumalo Clan',
    excerpt: 'Exploring the rich history and traditions of the Khumalo clan, from their origins to modern-day contributions.',
    author: 'Elder Mthimkhulu',
    publishedAt: '2 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400',
    tribe: 'ZULU',
    clan: 'KHUMALO',
    region: ['KwaZulu-Natal', 'Gauteng'],
  },
  {
    id: 'a2',
    title: 'Xhosa Traditions: The Wisdom of the Elders',
    excerpt: 'A deep dive into Xhosa cultural practices and the role of elders in preserving ancestral knowledge.',
    author: 'Gogo Dlamini',
    publishedAt: '5 days ago',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    tribe: 'XHOSA',
    clan: 'MADIBA',
    region: ['Eastern Cape', 'Western Cape'],
  },
  {
    id: 'a3',
    title: 'The Zulu Royal Lineage',
    excerpt: 'Understanding the structure and significance of Zulu royal families and their impact on South African history.',
    author: 'Nkosi Zwelithini',
    publishedAt: '1 week ago',
    tribe: 'ZULU',
    clan: 'ZULU',
    region: ['KwaZulu-Natal'],
  },
  {
    id: 'a4',
    title: 'Clan Gatherings: Unity in Tradition',
    excerpt: 'How modern clan gatherings bridge the gap between ancestral traditions and contemporary community needs.',
    author: 'Baba Mthimkhulu',
    publishedAt: '2 weeks ago',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=400',
    tribe: 'ZULU',
    clan: 'GUMEDE',
    region: ['KwaZulu-Natal', 'Gauteng', 'Mpumalanga'],
  },
  {
    id: 'a5',
    title: 'The Dlamini Heritage',
    excerpt: 'Tracing the Dlamini clan\'s journey through Swaziland and South Africa, preserving their unique identity.',
    author: 'Gogo Dlamini',
    publishedAt: '3 weeks ago',
    tribe: 'SWAZI',
    clan: 'DLAMINI',
    region: ['Mpumalanga', 'KwaZulu-Natal'],
  },
];

type CollapsibleSectionProps = {
  label: string;
  icon: React.ReactNode;
  titleColor: string;
  chevronColor: string;
  children: React.ReactNode;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  label,
  icon,
  titleColor,
  chevronColor,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [expanded, animated]);

  const onLayoutContent = (event: any) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height);
    }
  };

  const heightStyle =
    contentHeight === 0
      ? {}
      : {
          height: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, contentHeight],
          }),
        };

  const chevronRotation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View>
      <AnimatedButton
        style={styles.collapsibleHeader}
        onPress={() => setExpanded((prev) => !prev)}
      >
        <View style={styles.collapsibleHeaderLeft}>
          {icon}
          <ThemedText style={[styles.collapsibleTitle, { color: titleColor }]}>{label}</ThemedText>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <Feather name="chevron-right" size={16} color={chevronColor} />
        </Animated.View>
      </AnimatedButton>

      <Animated.View style={[{ overflow: 'hidden', opacity: animated }, heightStyle]}>
        <View onLayout={onLayoutContent}>{children}</View>
      </Animated.View>
    </View>
  );
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
    rating: 4.7,
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
    rating: 3.5,
  },
];

export default function CommunityScreen() {
  const { theme, isLightMode } = useTheme();
  const router = useRouter();
  const { isBlocked } = useBlockedUsers();
  const [randomUsers, setRandomUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [userPreferences, setUserPreferences] = useState<{
    tribe?: string;
    clan?: string;
    region?: string;
  }>({});

  // Load user preferences from AsyncStorage
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const [tribe, clan, region] = await Promise.all([
          AsyncStorage.getItem('@ukho_user_tribe'),
          AsyncStorage.getItem('@ukho_user_clan'),
          AsyncStorage.getItem('@ukho_user_region'),
        ]);
        setUserPreferences({
          tribe: tribe || undefined,
          clan: clan || undefined,
          region: region || undefined,
        });
      } catch (error) {
        console.error('Failed to load user preferences:', error);
      }
    };

    loadPreferences();
  }, []);

  // Fetch random users on mount and reshuffle each time screen loads
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true);
      try {
        const users = await getRandomUsers(12); // Fetch 12 random users
        setRandomUsers(users);
      } catch (error) {
        console.error('Failed to load random users:', error);
        setRandomUsers([]);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    loadUsers();
  }, []); // Empty deps - reshuffle on mount only

  const filteredSuggestions = useMemo(
    () => randomUsers.filter((user) => !isBlocked(user.id)),
    [randomUsers, isBlocked]
  );
  const filteredPosts = useMemo(() => POSTS.filter((p) => !isBlocked(p.id)), [isBlocked]);

  // Filter articles based on user preferences (tribe, clan, region)
  const filteredArticles = useMemo(() => {
    if (!userPreferences.tribe && !userPreferences.clan && !userPreferences.region) {
      // If no preferences set, show all articles
      return CLAN_ARTICLES;
    }

    return CLAN_ARTICLES.filter((article) => {
      const matchesTribe = !userPreferences.tribe || article.tribe === userPreferences.tribe;
      const matchesClan = !userPreferences.clan || article.clan === userPreferences.clan;
      const matchesRegion =
        !userPreferences.region || article.region.includes(userPreferences.region);

      // Show article if it matches any of the user's preferences
      return matchesTribe || matchesClan || matchesRegion;
    });
  }, [userPreferences]);

  // Create a mixed feed with posts and randomly inserted "People You May Know" sections
  const mixedFeed = useMemo(() => {
    const feed: Array<{ type: 'post' | 'suggestions'; data: any; id: string }> = [];
    
    // Add all posts to the feed
    filteredPosts.forEach((post) => {
      feed.push({ type: 'post', data: post, id: `post-${post.id}` });
    });

    // Randomly insert "People You May Know" sections between posts
    // Insert 2-3 suggestion sections randomly in the feed
    const numSuggestions = Math.min(3, Math.max(2, Math.floor(filteredPosts.length / 2)));
    const suggestionIndices: number[] = [];
    
    // Generate random positions (avoiding first position)
    for (let i = 0; i < numSuggestions && filteredSuggestions.length > 0; i++) {
      let position;
      do {
        position = Math.floor(Math.random() * (feed.length + 1));
      } while (position === 0 || suggestionIndices.includes(position));
      
      suggestionIndices.push(position);
    }

    // Sort indices in descending order to insert from end to beginning
    suggestionIndices.sort((a, b) => b - a);

    // Insert suggestion sections at random positions
    suggestionIndices.forEach((index) => {
      feed.splice(index, 0, {
        type: 'suggestions',
        data: filteredSuggestions,
        id: `suggestions-${index}-${Date.now()}`,
      });
    });

    return feed;
  }, [filteredPosts, filteredSuggestions]);

  const handleConnectKin = (postId: string) => {
    console.log('Connect kin for post:', postId);
  };

  const handleConnectSuggestion = (id: string) => {
    console.log('Connect suggestion:', id);
  };

  const handleProfileTap = (user: UserProfile) => {
    // Navigate to profile screen - placeholder for now
    // TODO: Create profile screen route
    console.log('Open profile:', user.id);
    // router.push({ pathname: '/profile', params: { userId: user.id } });
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
              <ThemedText style={[styles.headerSubtitle, { color: BrandColors.orange500 }]}>
                Home of your kin
              </ThemedText>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="community" />
          </View>
        </View>

        {/* Clan Articles - Collapsible */}
        <CollapsibleSection
          label="CLAN STORIES & ARTICLES"
          icon={<Feather name="book-open" size={20} color={BrandColors.orange500} />}
          titleColor={theme.textMain}
          chevronColor={theme.textDim}
        >
          {filteredArticles.length === 0 ? (
            <View style={styles.emptyArticlesContainer}>
              <Feather name="book-open" size={32} color={theme.textDim} />
              <ThemedText style={[styles.emptyArticlesText, { color: theme.textDim }]}>
                No articles match your preferences. Set your tribe, clan, or region in Settings to see
                personalized stories.
              </ThemedText>
            </View>
          ) : (
            <View style={styles.articlesList}>
              {filteredArticles.map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={[
                    styles.articleCard,
                    { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
                  ]}
                  activeOpacity={0.9}
                  onPress={() => {
                    // TODO: Navigate to article detail screen
                    console.log('Open article:', article.id);
                  }}
                >
                  {article.imageUrl && (
                    <Image source={{ uri: article.imageUrl }} style={styles.articleImage} />
                  )}
                  <View style={styles.articleContent}>
                    <View style={styles.articleHeader}>
                      <View style={styles.articleTags}>
                        <View style={styles.articleTag}>
                          <ThemedText style={styles.articleTagText}>{article.tribe}</ThemedText>
                        </View>
                        <View style={[styles.articleTag, styles.articleTagClan]}>
                          <ThemedText style={styles.articleTagTextClan}>{article.clan}</ThemedText>
                        </View>
                      </View>
                      <ThemedText style={[styles.articleDate, { color: theme.textDim }]}>
                        {article.publishedAt}
                      </ThemedText>
                    </View>
                    <ThemedText
                      style={[styles.articleTitle, { color: theme.textMain }]}
                      numberOfLines={2}
                    >
                      {article.title}
                    </ThemedText>
                    <ThemedText
                      style={[styles.articleExcerpt, { color: theme.textDim }]}
                      numberOfLines={3}
                    >
                      {article.excerpt}
                    </ThemedText>
                    <View style={styles.articleFooter}>
                      <Feather name="user" size={14} color={theme.textDim} />
                      <ThemedText style={[styles.articleAuthor, { color: theme.textDim }]}>
                        {article.author}
                      </ThemedText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </CollapsibleSection>

        {/* Mixed Feed: Posts and Randomly Inserted "People You May Know" Sections */}
        <View style={styles.postList}>
          {mixedFeed.map((item) => {
            if (item.type === 'post') {
              const post = item.data as CommunityPost;
              return (
                <View
                  key={item.id}
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
                      {post.rating && post.rating >= 3 && (
                        <View style={styles.ratingBadge}>
                          <Feather name="star" size={12} color={BrandColors.amber500} />
                        </View>
                      )}
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
                        <View
                          style={[
                            styles.clanTagMuted,
                            {
                              backgroundColor: isLightMode
                                ? 'rgba(148, 163, 184, 0.3)'
                                : 'rgba(148, 163, 184, 0.15)',
                            },
                          ]}
                        >
                          <ThemedText
                            style={[
                              styles.clanTagMutedText,
                              { color: isLightMode ? '#475569' : '#e2e8f0' },
                            ]}
                          >
                            {post.tribe}
                          </ThemedText>
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

                    <AnimatedButton
                      onPress={() => handleConnectKin(post.id)}
                      style={styles.connectKinButton}
                    >
                      <View style={styles.connectKinButtonInner}>
                        <Feather name="user-plus" size={16} color="#fff" />
                        <ThemedText style={styles.connectKinText}>CONNECT KIN</ThemedText>
                      </View>
                    </AnimatedButton>
                  </View>
                </View>
              );
            } else {
              // "People You May Know" section
              const suggestions = item.data as UserProfile[];
              return (
                <View key={item.id} style={styles.suggestionsSection}>
                  <View style={styles.suggestionsHeaderRow}>
                    <ThemedText style={[styles.suggestionsTitle, { color: theme.textMain }]}>
                      People You May Know
                    </ThemedText>
                    <ThemedText style={[styles.suggestionsSubtitle, { color: theme.textDim }]}>
                      Possible & Nearby Kin
                    </ThemedText>
                  </View>
                  {isLoadingUsers ? (
                    <View style={styles.loadingContainer}>
                      <LoadingSpinner size="small" color={BrandColors.orange500} />
                      <ThemedText style={[styles.loadingText, { color: theme.textDim }]}>
                        Loading suggestions...
                      </ThemedText>
                    </View>
                  ) : suggestions.length === 0 ? (
                    <View style={styles.emptyContainer}>
                      <Feather name="users" size={32} color={theme.textDim} />
                      <ThemedText style={[styles.emptyText, { color: theme.textDim }]}>
                        No suggestions available
                      </ThemedText>
                    </View>
                  ) : (
                    <FlatList
                      horizontal
                      data={suggestions}
                      keyExtractor={(user) => user.id}
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.suggestionsList}
                      renderItem={({ item: user }) => (
                        <TouchableOpacity
                          style={[
                            styles.suggestionCard,
                            { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
                          ]}
                          onPress={() => handleProfileTap(user)}
                          activeOpacity={0.9}
                        >
                          <View style={styles.suggestionAvatarWrapper}>
                            {user.avatar ? (
                              <Image source={{ uri: user.avatar }} style={styles.suggestionAvatar} />
                            ) : (
                              <View
                                style={[
                                  styles.suggestionAvatarPlaceholder,
                                  { backgroundColor: theme.borderColor },
                                ]}
                              >
                                <Feather name="user" size={24} color={theme.textDim} />
                              </View>
                            )}
                            {user.rating && user.rating >= 3 && (
                              <View style={styles.ratingBadge}>
                                <Feather name="star" size={12} color={BrandColors.amber500} />
                              </View>
                            )}
                          </View>
                          <ThemedText
                            style={[styles.suggestionName, { color: theme.textMain }]}
                            numberOfLines={1}
                          >
                            {user.displayName}
                          </ThemedText>
                          {user.clan && (
                            <ThemedText style={styles.suggestionClan} numberOfLines={1}>
                              {user.clan}
                            </ThemedText>
                          )}
                          <View style={styles.suggestionActions}>
                            <AnimatedButton
                              onPress={() => handleConnectSuggestion(user.id)}
                              style={styles.suggestionConnectButton}
                            >
                              <View style={styles.suggestionConnectInner}>
                                <Feather name="user-plus" size={14} color="#fff" />
                                <ThemedText style={styles.suggestionConnectText}>CONNECT</ThemedText>
                              </View>
                            </AnimatedButton>
                          </View>
                        </TouchableOpacity>
                      )}
                    />
                  )}
                </View>
              );
            }
          })}
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[6],
    gap: Spacing[2],
  },
  loadingText: {
    fontSize: Typography.fontSize.sm,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[6],
    gap: Spacing[2],
  },
  emptyText: {
    fontSize: Typography.fontSize.sm,
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
  suggestionAvatarWrapper: {
    position: 'relative',
    marginBottom: Spacing[3],
  },
  suggestionAvatar: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
  },
  suggestionAvatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: BrandColors.amber500,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
  suggestionActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginTop: Spacing[2],
  },
  suggestionConnectButton: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.orange500,
  },
  suggestionConnectInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  blockIconBtn: {
    padding: Spacing[1],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
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
    overflow: 'visible',
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
    zIndex: 1,
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
  },
  clanTagMutedText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
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
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
  },
  connectKinButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  connectKinText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: '#e2e8f0',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[2],
    marginTop: Spacing[4],
  },
  collapsibleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  collapsibleTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
  },
  emptyArticlesContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[8],
    paddingHorizontal: Spacing[4],
    gap: Spacing[3],
  },
  emptyArticlesText: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  articlesList: {
    gap: Spacing[4],
    marginTop: Spacing[2],
  },
  articleCard: {
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  articleImage: {
    width: '100%',
    height: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  articleContent: {
    padding: Spacing[4],
    gap: Spacing[2],
  },
  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[1],
  },
  articleTags: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  articleTag: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 4,
    borderRadius: BorderRadius.lg,
    backgroundColor: BrandColors.orange500,
  },
  articleTagClan: {
    backgroundColor: 'rgba(249, 115, 22, 0.15)',
  },
  articleTagText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: Typography.letterSpacing.widest,
  },
  articleTagTextClan: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    color: BrandColors.orange500,
    letterSpacing: Typography.letterSpacing.widest,
  },
  articleDate: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  articleTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '800',
    lineHeight: 22,
  },
  articleExcerpt: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 18,
    marginTop: Spacing[1],
  },
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    marginTop: Spacing[2],
  },
  articleAuthor: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
});


