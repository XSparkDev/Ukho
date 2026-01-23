import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AnimatedCard } from '@/components/AnimatedCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

type Person = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
};

type Chat = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string; // relative (e.g., 2m, 1h)
  unread: boolean;
  online: boolean;
  lastSeen?: string; // e.g., "2h ago", "yesterday"
};

const PEOPLE_YOU_KNOW: Person[] = [
  {
    id: 'p1',
    name: 'Zandi Madiba',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&h=150',
    online: true,
  },
  {
    id: 'p2',
    name: 'Banele Zulu',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=150&h=150',
    online: false,
  },
  {
    id: 'p3',
    name: 'Lungile Khumalo',
    avatar:
      'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150',
    online: true,
  },
  {
    id: 'p4',
    name: 'Sabelo Mabaso',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150',
    online: false,
  },
];

const CHATS: Chat[] = [
  {
    id: 'c1',
    name: 'Zandi Madiba',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&h=150',
    lastMessage: 'Unity is our strength. ✊🏾🇿🇦',
    timestamp: '2m',
    unread: true,
    online: true,
  },
  {
    id: 'c2',
    name: 'Banele Zulu',
    avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=150&h=150',
    lastMessage: 'Looking for Khumalo contacts in Joburg...',
    timestamp: '1h',
    unread: false,
    online: false,
    lastSeen: '2h ago',
  },
  {
    id: 'c3',
    name: 'Lungile Khumalo',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150',
    lastMessage: "Let's set up a call to discuss clan records.",
    timestamp: '4h',
    unread: false,
    online: true,
  },
];

export default function RelationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const sortedChats = useMemo(() => CHATS, []);

  // Simulate typing indicators (in a real app, this would come from a presence service)
  useEffect(() => {
    // Simulate typing for demo purposes
    const interval = setInterval(() => {
      // Randomly show/hide typing for online users
      const onlineChats = sortedChats.filter((chat) => chat.online);
      if (onlineChats.length > 0 && Math.random() > 0.7) {
        const randomChat = onlineChats[Math.floor(Math.random() * onlineChats.length)];
        setTypingUsers(new Set([randomChat.id]));
        setTimeout(() => {
          setTypingUsers(new Set());
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [sortedChats]);

  const renderPerson = ({ item }: { item: Person }) => (
    <View
      style={[
        styles.personCard,
        { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
      ]}
    >
      <View style={styles.personAvatarWrapper}>
        <Image source={{ uri: item.avatar }} style={styles.personAvatar} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
      <ThemedText style={[styles.personName, { color: theme.textMain }]} numberOfLines={1}>
        {item.name}
      </ThemedText>
    </View>
  );

  const renderChat = ({ item }: { item: Chat }) => {
    const isTyping = typingUsers.has(item.id);
    
    return (
      <AnimatedCard
        onPress={() => {
          // keep existing messaging/nav logic intact; placeholder action
          setSelectedChatId(item.id);
          console.log('Open chat:', item.id);
        }}
        style={[
          CardStyles.base,
          styles.chatRow,
          { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
        ]}
      >
        <View style={styles.chatAvatarWrapper}>
          <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
          {item.online && <View style={styles.chatOnlineDot} />}
        </View>
        <View style={styles.chatMeta}>
          <View style={styles.chatHeader}>
            <View style={styles.chatNameRow}>
              <ThemedText
                style={[
                  styles.chatName,
                  {
                    color: theme.textMain,
                    fontWeight: item.unread ? '800' : '700',
                  },
                ]}
                numberOfLines={1}
              >
                {item.name}
              </ThemedText>
              {!item.online && item.lastSeen && (
                <ThemedText style={[styles.lastSeen, { color: theme.textDim }]}>
                  • Last seen {item.lastSeen}
                </ThemedText>
              )}
            </View>
            <ThemedText style={[styles.chatTimestamp, { color: theme.textDim }]}>
              {item.timestamp}
            </ThemedText>
          </View>
          {isTyping ? (
            <ThemedText
              style={[styles.typingIndicator, { color: BrandColors.orange500 }]}
              numberOfLines={1}
            >
              {item.name} is typing...
            </ThemedText>
          ) : (
            <ThemedText
              style={[
                styles.chatPreview,
                {
                  color: theme.textDim,
                  fontWeight: item.unread ? '700' : '500',
                },
              ]}
              numberOfLines={1}
            >
              {item.lastMessage}
            </ThemedText>
          )}
        </View>
      </AnimatedCard>
    );
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Requests */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Feather name="message-circle" size={20} color={BrandColors.orange500} />
            <View>
              <ThemedText
                style={[
                  styles.title,
                  { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
                ]}
              >
                CONNECT
              </ThemedText>
              <ThemedText style={[styles.subtitle, { color: BrandColors.orange500 }]}>
                MESSAGING AND OUTREACH HUB
              </ThemedText>
            </View>
          </View>
          <Pressable
            style={[
              styles.requestsButton,
              { borderColor: theme.borderColor, backgroundColor: theme.panelBg },
            ]}
            onPress={() => {
              router.push('/requests');
            }}
          >
            <Feather name="inbox" size={16} color={theme.textMain} />
            <ThemedText style={[styles.requestsText, { color: theme.textMain }]}>
              Requests
            </ThemedText>
          </Pressable>
        </View>

        {/* People You May Know / Active */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>
              People You May Know
            </ThemedText>
          </View>
          <FlatList
            horizontal
            data={PEOPLE_YOU_KNOW}
            keyExtractor={(item) => item.id}
            renderItem={renderPerson}
            contentContainerStyle={styles.personList}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Chat List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>Chats</ThemedText>
          </View>
          <FlatList
            data={sortedChats}
            keyExtractor={(item) => item.id}
            renderItem={renderChat}
            ItemSeparatorComponent={() => <View style={{ height: Spacing[2] }} />}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Typing Indicator Banner (fixed at bottom when a chat is selected and user is typing) */}
      {selectedChatId && typingUsers.has(selectedChatId) && (
        <View style={[styles.typingBanner, { backgroundColor: theme.panelBg, borderColor: theme.borderColor }]}>
          <ThemedText style={[styles.typingBannerText, { color: BrandColors.orange500 }]}>
            {sortedChats.find((c) => c.id === selectedChatId)?.name} is typing...
          </ThemedText>
        </View>
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing[4],
    paddingBottom: Spacing[8],
    gap: Spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
  },
  subtitle: {
    marginTop: Spacing[1],
    fontSize: 12,
    fontWeight: '600',
    color: BrandColors.orange500,
  },
  requestsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  requestsText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  section: {
    gap: Spacing[2],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: Typography.letterSpacing.widest,
  },
  personList: {
    gap: Spacing[3],
  },
  personCard: {
    width: 100,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[3],
    borderWidth: 1,
    alignItems: 'center',
  },
  personAvatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: Spacing[2],
  },
  personAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BrandColors.orange500,
    borderWidth: 2,
    borderColor: '#fff',
  },
  personName: {
    fontSize: 12,
    fontWeight: '700',
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  chatAvatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  chatAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.xl,
  },
  chatOnlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: BrandColors.orange500,
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatMeta: {
    flex: 1,
    gap: Spacing[1],
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chatNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    flex: 1,
  },
  chatName: {
    fontSize: 16,
  },
  lastSeen: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  chatTimestamp: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  chatPreview: {
    fontSize: Typography.fontSize.sm,
  },
  typingIndicator: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  typingBanner: {
    position: 'absolute',
    bottom: Spacing[4],
    left: Spacing[4],
    right: Spacing[4],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  typingBannerText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

