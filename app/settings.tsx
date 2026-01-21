import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

export default function SettingsScreen() {
  const { theme } = useTheme();

  const sections = [
    { id: 'account', title: 'Account', icon: 'user' },
    { id: 'notifications', title: 'Notifications', icon: 'bell' },
    { id: 'appearance', title: 'Appearance', icon: 'sun' },
    { id: 'privacy', title: 'Privacy', icon: 'lock' },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.iconBadge}>
            <Feather name="settings" size={18} color="#fff" />
          </View>
          <View>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Settings
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
              Manage your Ukho experience
            </ThemedText>
          </View>
        </View>

        <View style={styles.sectionList}>
          {sections.map((section) => (
            <View
              key={section.id}
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
              </View>
              <ThemedText style={[styles.sectionHint, { color: theme.textDim }]}>
                Placeholder content for {section.title.toLowerCase()} settings.
              </ThemedText>
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
    marginBottom: Spacing[1],
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
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


