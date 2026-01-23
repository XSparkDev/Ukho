import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AnimatedCard } from '@/components/AnimatedCard';
import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

type ConnectRequest = {
  id: string;
  name: string;
  avatar: string;
  clan: string;
  timestamp: string; // e.g., "2h ago", "yesterday"
  online: boolean;
  lastSeen?: string;
};

const CONNECT_REQUESTS: ConnectRequest[] = [
  {
    id: 'r1',
    name: 'Zandi Madiba',
    avatar:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=150&h=150',
    clan: 'MADIBA',
    timestamp: '2h ago',
    online: true,
  },
  {
    id: 'r2',
    name: 'Banele Zulu',
    avatar:
      'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=150&h=150',
    clan: 'ZULU',
    timestamp: '5h ago',
    online: false,
    lastSeen: '1h ago',
  },
  {
    id: 'r3',
    name: 'Lungile Khumalo',
    avatar:
      'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150',
    clan: 'KHUMALO',
    timestamp: '1d ago',
    online: true,
  },
];

const SENT_REQUESTS: ConnectRequest[] = [
  {
    id: 's1',
    name: 'Nomalanga Mntungwa',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150',
    clan: 'MNTUNGWA',
    timestamp: '3h ago',
    online: false,
    lastSeen: 'yesterday',
  },
  {
    id: 's2',
    name: 'Thabo Dlamini',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
    clan: 'DLAMINI',
    timestamp: '1d ago',
    online: true,
  },
  {
    id: 's3',
    name: 'Sabelo Mabaso',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150',
    clan: 'MABASO',
    timestamp: '2d ago',
    online: false,
    lastSeen: '2d ago',
  },
];

export default function RequestsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [connectRequests, setConnectRequests] = useState(CONNECT_REQUESTS);
  const [sentRequests, setSentRequests] = useState(SENT_REQUESTS);

  const handleAccept = (id: string) => {
    console.log('Accept request:', id);
    setConnectRequests((prev) => prev.filter((req) => req.id !== id));
    // In a real app, this would call an API to accept the request
  };

  const handleDecline = (id: string) => {
    console.log('Decline request:', id);
    setConnectRequests((prev) => prev.filter((req) => req.id !== id));
    // In a real app, this would call an API to decline the request
  };

  const handleCancel = (id: string) => {
    console.log('Cancel sent request:', id);
    setSentRequests((prev) => prev.filter((req) => req.id !== id));
    // In a real app, this would call an API to cancel the sent request
  };

  const renderConnectRequest = (request: ConnectRequest) => (
    <AnimatedCard
      key={request.id}
      style={[
        CardStyles.base,
        {
          backgroundColor: theme.panelBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <View style={styles.requestRow}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: request.avatar }} style={styles.avatar} />
          {request.online && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.requestInfo}>
          <View style={styles.nameRow}>
            <ThemedText style={[styles.name, { color: theme.textMain }]} numberOfLines={1}>
              {request.name}
            </ThemedText>
            {!request.online && request.lastSeen && (
              <ThemedText style={[styles.lastSeen, { color: theme.textDim }]}>
                • Last seen {request.lastSeen}
              </ThemedText>
            )}
          </View>
          <ThemedText style={styles.clan}>{request.clan} Clan</ThemedText>
          <ThemedText style={[styles.timestamp, { color: theme.textDim }]}>
            {request.timestamp}
          </ThemedText>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            onPress={() => handleAccept(request.id)}
            style={styles.acceptButton}
            activeOpacity={0.8}
          >
            <Feather name="check" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDecline(request.id)}
            style={styles.declineButton}
            activeOpacity={0.8}
          >
            <Feather name="x" size={18} color={theme.textMain} />
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedCard>
  );

  const renderSentRequest = (request: ConnectRequest) => (
    <AnimatedCard
      key={request.id}
      style={[
        CardStyles.base,
        {
          backgroundColor: theme.panelBg,
          borderColor: theme.borderColor,
        },
      ]}
    >
      <View style={styles.requestRow}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: request.avatar }} style={styles.avatar} />
          {request.online && <View style={styles.onlineDot} />}
        </View>
        <View style={styles.requestInfo}>
          <View style={styles.nameRow}>
            <ThemedText style={[styles.name, { color: theme.textMain }]} numberOfLines={1}>
              {request.name}
            </ThemedText>
            {!request.online && request.lastSeen && (
              <ThemedText style={[styles.lastSeen, { color: theme.textDim }]}>
                • Last seen {request.lastSeen}
              </ThemedText>
            )}
          </View>
          <ThemedText style={styles.clan}>{request.clan} Clan</ThemedText>
          <ThemedText style={[styles.timestamp, { color: theme.textDim }]}>
            Sent {request.timestamp}
          </ThemedText>
        </View>
        <TouchableOpacity
          onPress={() => handleCancel(request.id)}
          style={styles.cancelButton}
          activeOpacity={0.8}
        >
          <Feather name="x" size={18} color={theme.textMain} />
        </TouchableOpacity>
      </View>
    </AnimatedCard>
  );

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            activeOpacity={0.8}
          >
            <Feather name="arrow-left" size={20} color={theme.textMain} />
          </TouchableOpacity>
          <View style={styles.iconBadge}>
            <Feather name="inbox" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Requests
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: BrandColors.orange500 }]}>
              MANAGE YOUR CONNECTION REQUESTS
            </ThemedText>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="requests" />
          </View>
        </View>

        {/* Connect Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Feather name="inbox" size={20} color={BrandColors.orange500} />
              <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>
                CONNECT REQUESTS
              </ThemedText>
            </View>
            {connectRequests.length > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{connectRequests.length}</ThemedText>
              </View>
            )}
          </View>
          {connectRequests.length > 0 ? (
            <View style={styles.requestsList}>
              {connectRequests.map(renderConnectRequest)}
            </View>
          ) : (
            <View
              style={[
                CardStyles.base,
                styles.emptyState,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <Feather name="inbox" size={32} color={theme.textDim} />
              <ThemedText style={[styles.emptyStateText, { color: theme.textDim }]}>
                No pending requests
              </ThemedText>
            </View>
          )}
        </View>

        {/* Sent Requests Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Feather name="send" size={20} color={BrandColors.orange500} />
              <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>
                SENT REQUESTS
              </ThemedText>
            </View>
            {sentRequests.length > 0 && (
              <View style={styles.badge}>
                <ThemedText style={styles.badgeText}>{sentRequests.length}</ThemedText>
              </View>
            )}
          </View>
          {sentRequests.length > 0 ? (
            <View style={styles.requestsList}>
              {sentRequests.map(renderSentRequest)}
            </View>
          ) : (
            <View
              style={[
                CardStyles.base,
                styles.emptyState,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <Feather name="send" size={32} color={theme.textDim} />
              <ThemedText style={[styles.emptyStateText, { color: theme.textDim }]}>
                No sent requests
              </ThemedText>
            </View>
          )}
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
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  backButton: {
    padding: Spacing[2],
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
  },
  menuContainer: {
    marginLeft: Spacing[2],
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 4,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  section: {
    gap: Spacing[3],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[1],
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    backgroundColor: BrandColors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[2],
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    color: '#fff',
  },
  requestsList: {
    gap: Spacing[3],
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.xl,
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
  requestInfo: {
    flex: 1,
    gap: Spacing[1],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  lastSeen: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  clan: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: BrandColors.orange500,
  },
  timestamp: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: Spacing[2],
  },
  acceptButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[8],
    gap: Spacing[2],
  },
  emptyStateText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
});

