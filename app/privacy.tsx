import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { AnimatedCard } from '@/components/AnimatedCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [privacySettings, setPrivacySettings] = useState({
    whoCanContact: 'Everyone',
    whoCanSeeProfile: 'Everyone',
    whoCanSeeClan: 'Everyone',
  });

  const privacyOptions = [
    {
      id: 'who-can-contact',
      title: 'Who Can Contact Me',
      icon: 'message-square',
      description: 'Control who can send you messages',
      type: 'selector' as const,
      value: privacySettings.whoCanContact,
      onPress: () => {
        console.log('Open who can contact selector');
      },
    },
    {
      id: 'who-can-see-profile',
      title: 'Who Can See My Profile',
      icon: 'eye',
      description: 'Manage profile visibility settings',
      type: 'selector' as const,
      value: privacySettings.whoCanSeeProfile,
      onPress: () => {
        console.log('Open profile visibility selector');
      },
    },
    {
      id: 'who-can-see-clan',
      title: 'Who Can See My Clan',
      icon: 'users',
      description: 'Control clan information visibility',
      type: 'selector' as const,
      value: privacySettings.whoCanSeeClan,
      onPress: () => {
        console.log('Open clan visibility selector');
      },
    },
    {
      id: 'blocked-users',
      title: 'Blocked Users',
      icon: 'user-x',
      description: 'View and manage blocked accounts',
      type: 'navigation' as const,
      onPress: () => {
        console.log('Navigate to blocked users list');
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
            <Feather name="lock" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Privacy
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
              Control your privacy and security
            </ThemedText>
          </View>
        </View>

        <View style={styles.optionsList}>
          {privacyOptions.map((option) => (
            <AnimatedCard
              key={option.id}
              onPress={option.onPress}
              style={[
                CardStyles.base,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionIcon}>
                  <Feather name={option.icon as any} size={20} color={BrandColors.orange500} />
                </View>
                <View style={styles.optionContent}>
                  <ThemedText style={[styles.optionTitle, { color: theme.textMain }]}>
                    {option.title}
                  </ThemedText>
                  <ThemedText style={[styles.optionDescription, { color: theme.textDim }]}>
                    {option.description}
                  </ThemedText>
                </View>
                {option.type === 'selector' ? (
                  <View style={styles.selectorButton}>
                    <ThemedText style={[styles.selectorValue, { color: theme.textMain }]}>
                      {option.value}
                    </ThemedText>
                    <Feather name="chevron-right" size={16} color={theme.textDim} />
                  </View>
                ) : (
                  <Feather name="chevron-right" size={18} color={theme.textDim} />
                )}
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
  headerContent: {
    flex: 1,
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
  optionsList: {
    gap: Spacing[4],
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: {
    flex: 1,
    gap: Spacing[1],
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  optionDescription: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    opacity: 0.8,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[1],
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  selectorValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
});

