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

export default function SettingsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const sections = [
    {
      id: 'account',
      title: 'Account',
      icon: 'user',
      description: 'Profile, email, password, and account details',
      onPress: () => {
        router.push('/account');
      },
    },
    {
      id: 'preferences',
      title: 'Preferences',
      icon: 'sliders',
      description: 'Language, region, and display preferences',
      onPress: () => {
        router.push('/preferences');
      },
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'bell',
      description: 'Manage alerts, messages, and updates',
      onPress: () => {
        router.push('/notifications');
      },
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: 'lock',
      description: 'Data privacy, visibility, and security',
      onPress: () => {
        router.push('/privacy');
      },
    },
    {
      id: 'about',
      title: 'About Ukho',
      icon: 'info',
      description: 'Version, terms, and support information',
      onPress: () => {
        router.push('/about');
      },
    },
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
            <ThemedText style={[styles.subtitle, { color: BrandColors.orange500 }]}>
              MANAGE YOUR UKHO EXPERIENCE
            </ThemedText>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="settings" />
          </View>
        </View>

        <View style={styles.sectionList}>
          {sections.map((section) => (
            <AnimatedCard
              key={section.id}
              onPress={section.onPress}
              style={[
                CardStyles.base,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcon}>
                  <Feather name={section.icon as any} size={20} color={BrandColors.orange500} />
                </View>
                <View style={styles.sectionContent}>
                  <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>
                    {section.title}
                  </ThemedText>
                  <ThemedText style={[styles.sectionDescription, { color: theme.textDim }]}>
                    {section.description}
                  </ThemedText>
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
    color: BrandColors.orange500,
  },
  sectionList: {
    gap: Spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContent: {
    flex: 1,
    gap: Spacing[1],
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionDescription: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    opacity: 0.8,
  },
});


