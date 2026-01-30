import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const sections: { id: string; title: string; icon: string; route: string }[] = [
    { id: 'account', title: 'Account', icon: 'user', route: '/account' },
    { id: 'preferences', title: 'Preferences', icon: 'sliders', route: '/preferences' },
    { id: 'notifications', title: 'Notifications', icon: 'bell', route: '/notifications' },
    { id: 'privacy', title: 'Privacy', icon: 'lock', route: '/privacy' },
    { id: 'about', title: 'About Ukho', icon: 'info', route: '/about' },
  ];

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
            <Feather name="settings" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Settings
            </ThemedText>
            <ThemedText style={styles.subtitle}>MANAGE YOUR UKHO EXPERIENCE</ThemedText>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="settings" />
          </View>
        </View>

        <View style={styles.sectionList}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              activeOpacity={0.8}
              onPress={() => router.push(section.route)}
              style={[
                styles.sectionCard,
                { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
              ]}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Feather name={section.icon as any} size={16} color={BrandColors.orange500} />
                </View>
                <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>
                  {section.title}
                </ThemedText>
                <Feather name="chevron-right" size={18} color={theme.textDim} />
              </View>
              <ThemedText style={[styles.sectionHint, { color: theme.textDim }]}>
                Tap to open {section.title.toLowerCase()} settings.
              </ThemedText>
            </TouchableOpacity>
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
    marginBottom: Spacing[1],
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
  headerContent: {
    flex: 1,
  },
  menuContainer: {
    marginLeft: 'auto',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 4,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: BrandColors.orange500,
  },
  sectionList: {
    gap: Spacing[3],
  },
  sectionCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    borderWidth: 1,
    gap: Spacing[1],
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionHint: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    marginTop: Spacing[1],
  },
});


