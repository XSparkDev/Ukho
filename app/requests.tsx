import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

type RequestItem = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  timestamp: string;
};

const CONNECT_REQUESTS: RequestItem[] = [
  {
    id: 'r1',
    name: 'Thabo Dlamini',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
    online: true,
    timestamp: '5m ago',
  },
  {
    id: 'r2',
    name: 'Nomalanga Mntungwa',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150',
    online: false,
    timestamp: '1h ago',
  },
];

const SENT_REQUESTS: RequestItem[] = [
  {
    id: 's1',
    name: 'Sabelo Mabaso',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150',
    online: false,
    timestamp: '2h ago',
  },
];

export default function RequestsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>
            Connect Requests
          </ThemedText>
          {CONNECT_REQUESTS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.requestCard,
                { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
              ]}
            >
              <View style={styles.requestRow}>
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  {item.online && <View style={styles.onlineDot} />}
                </View>
                <View style={styles.requestMeta}>
                  <ThemedText style={[styles.requestName, { color: theme.textMain }]}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={[styles.requestTime, { color: theme.textDim }]}>
                    {item.timestamp}
                  </ThemedText>
                </View>
                <View style={styles.actions}>
                  <Pressable
                    style={[styles.acceptBtn, { backgroundColor: BrandColors.orange500 }]}
                    onPress={() => console.log('Accept', item.id)}
                  >
                    <ThemedText style={styles.acceptBtnText}>Accept</ThemedText>
                  </Pressable>
                  <Pressable
                    style={[styles.declineBtn, { borderColor: theme.borderColor }]}
                    onPress={() => console.log('Decline', item.id)}
                  >
                    <ThemedText style={[styles.declineBtnText, { color: theme.textMain }]}>
                      Decline
                    </ThemedText>
                  </Pressable>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>
            Sent Requests
          </ThemedText>
          {SENT_REQUESTS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.requestCard,
                { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
              ]}
            >
              <View style={styles.requestRow}>
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  {item.online && <View style={styles.onlineDot} />}
                </View>
                <View style={styles.requestMeta}>
                  <ThemedText style={[styles.requestName, { color: theme.textMain }]}>
                    {item.name}
                  </ThemedText>
                  <ThemedText style={[styles.requestTime, { color: theme.textDim }]}>
                    {item.timestamp}
                  </ThemedText>
                </View>
                <Pressable
                  style={[styles.cancelBtn, { borderColor: theme.borderColor }]}
                  onPress={() => console.log('Cancel', item.id)}
                >
                  <ThemedText style={[styles.cancelBtnText, { color: theme.textDim }]}>
                    Cancel
                  </ThemedText>
                </Pressable>
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
  section: { gap: Spacing[2] },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: Typography.letterSpacing.widest,
  },
  requestCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  avatarWrapper: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: BrandColors.orange500,
    borderWidth: 2,
    borderColor: '#fff',
  },
  requestMeta: { flex: 1 },
  requestName: { fontSize: 16, fontWeight: '700' },
  requestTime: { fontSize: Typography.fontSize.xs, marginTop: 2 },
  actions: { flexDirection: 'row', gap: Spacing[2] },
  acceptBtn: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
  },
  acceptBtnText: { color: '#fff', fontWeight: '700', fontSize: Typography.fontSize.sm },
  declineBtn: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  declineBtnText: { fontWeight: '600', fontSize: Typography.fontSize.sm },
  cancelBtn: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  cancelBtnText: { fontWeight: '600', fontSize: Typography.fontSize.sm },
});
