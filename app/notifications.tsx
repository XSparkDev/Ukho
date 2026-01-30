import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';

import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

const NOTIFICATION_ITEMS = [
  { id: 'messages', title: 'Messages', icon: 'message-circle', description: 'New chat and connection messages' },
  { id: 'connect-requests', title: 'Connect Requests', icon: 'user-plus', description: 'When someone wants to connect' },
  { id: 'clan-activity', title: 'Clan Activity', icon: 'users', description: 'Updates from your clan and elders' },
  { id: 'event-reminders', title: 'Event Reminders', icon: 'calendar', description: 'Gatherings and ceremony reminders' },
];

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    messages: true,
    'connect-requests': true,
    'clan-activity': false,
    'event-reminders': true,
  });

  const setToggle = (id: string, value: boolean) => {
    setToggles((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
            <Feather name="arrow-left" size={20} color={theme.textMain} />
          </TouchableOpacity>
          <View style={styles.iconBadge}>
            <Feather name="bell" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText style={[styles.title, { color: theme.textMain, fontFamily: Typography.spaceGrotesk }]}>
              Notifications
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: BrandColors.orange500 }]}>
              MANAGE ALERTS AND UPDATES
            </ThemedText>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="notifications" />
          </View>
        </View>

        <View style={styles.sectionList}>
          {NOTIFICATION_ITEMS.map((item) => (
            <View
              key={item.id}
              style={[
                styles.sectionCard,
                { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
              ]}
            >
              <View style={styles.cardRow}>
                <View style={styles.cardIcon}>
                  <Feather name={item.icon as any} size={20} color={BrandColors.orange500} />
                </View>
                <View style={styles.cardContent}>
                  <ThemedText style={[styles.cardTitle, { color: theme.textMain }]}>
                    {item.title}
                  </ThemedText>
                  <ThemedText style={[styles.cardDescription, { color: theme.textDim }]}>
                    {item.description}
                  </ThemedText>
                </View>
                <Switch
                  value={toggles[item.id] ?? false}
                  onValueChange={(v) => setToggle(item.id, v)}
                  trackColor={{ false: theme.borderColor, true: BrandColors.orange500 }}
                  thumbColor="#fff"
                />
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
  sectionList: { gap: Spacing[4] },
  sectionCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '800' },
  cardDescription: { fontSize: Typography.fontSize.sm, marginTop: 2, opacity: 0.8 },
});
