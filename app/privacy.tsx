import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AnimatedCard } from '@/components/AnimatedCard';
import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

const PRIVACY_ITEMS = [
  { id: 'who-contact', title: 'Who Can Contact Me', icon: 'message-circle', description: 'Control who can send you connection requests', value: 'Kin & Elders' },
  { id: 'who-profile', title: 'Who Can See My Profile', icon: 'user', description: 'Choose who can view your profile and clan', value: 'Connections' },
  { id: 'who-clan', title: 'Who Can See My Clan', icon: 'users', description: 'Visibility of your clan affiliation', value: 'Connections' },
  { id: 'blocked', title: 'Blocked Users', icon: 'user-x', description: 'Manage blocked users', route: '' },
];

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
            <Feather name="arrow-left" size={20} color={theme.textMain} />
          </TouchableOpacity>
          <View style={styles.iconBadge}>
            <Feather name="lock" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText style={[styles.title, { color: theme.textMain, fontFamily: Typography.spaceGrotesk }]}>
              Privacy
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: BrandColors.orange500 }]}>
              DATA PRIVACY AND VISIBILITY
            </ThemedText>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="privacy" />
          </View>
        </View>

        <View style={styles.sectionList}>
          {PRIVACY_ITEMS.map((item) => (
            <AnimatedCard
              key={item.id}
              onPress={() => {
                if ('route' in item && typeof item.route === 'string' && item.route) {
                  router.push(item.route);
                } else {
                  console.log('Privacy option:', item.id);
                }
              }}
              style={[
                CardStyles.base,
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
                  {'value' in item && (
                    <ThemedText style={[styles.cardValue, { color: theme.textDim }]}>
                      {(item as { value: string }).value}
                    </ThemedText>
                  )}
                </View>
                <Feather name="chevron-right" size={18} color={theme.textDim} />
              </View>
            </AnimatedCard>
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
  cardValue: { fontSize: Typography.fontSize.sm, marginTop: 2, fontStyle: 'italic' },
});
