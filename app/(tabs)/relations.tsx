import React, { useMemo } from 'react';
import { FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/constants/Theme';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';

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
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&h=150',
    lastMessage: 'Unity is our strength. ✊🏾🇿🇦',
    timestamp: '2m',
    unread: true,
  },
  {
    id: 'c2',
    name: 'Banele Zulu',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=150&h=150',
    lastMessage: 'Looking for Khumalo contacts in Joburg...',
    timestamp: '1h',
    unread: false,
  },
  {
    id: 'c3',
    name: 'Lungile Khumalo',
    avatar:
      'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150',
    lastMessage: 'Let’s set up a call to discuss clan records.',
    timestamp: '4h',
    unread: false,
  },
];

export default function RelationsScreen() {
  const { theme } = useTheme();

  const sortedChats = useMemo(() => CHATS, []);

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

  const renderChat = ({ item }: { item: Chat }) => (
    <Pressable
      style={[
        styles.chatRow,
        { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
      ]}
      onPress={() => {
        // keep existing messaging/nav logic intact; placeholder action
        console.log('Open chat:', item.id);
      }}
    >
      <View style={styles.chatAvatarWrapper}>
        <Image source={{ uri: item.avatar }} style={styles.chatAvatar} />
      </View>
      <View style={styles.chatMeta}>
        <View style={styles.chatHeader}>
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
          <ThemedText style={[styles.chatTimestamp, { color: theme.textDim }]}>
            {item.timestamp}
          </ThemedText>
        </View>
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
      </View>
    </Pressable>
  );

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Requests */}
        <View style={styles.headerRow}>
          <View>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              CONNECT
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
              Messaging and outreach hub
            </ThemedText>
          </View>
          <Pressable
            style={[
              styles.requestsButton,
              { borderColor: theme.borderColor, backgroundColor: theme.panelBg },
            ]}
            onPress={() => {
              console.log('Open requests');
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
  title: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
  },
  subtitle: {
    marginTop: Spacing[1],
    fontSize: 12,
    fontWeight: '600',
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
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
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
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    padding: Spacing[4],
    gap: Spacing[3],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  chatAvatarWrapper: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  chatAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.xl,
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
  chatName: {
    fontSize: 16,
  },
  chatTimestamp: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  chatPreview: {
    fontSize: Typography.fontSize.sm,
  },
});

