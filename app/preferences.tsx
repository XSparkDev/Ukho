import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

export default function PreferencesScreen() {
  const { theme, isLightMode, toggleTheme } = useTheme();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [selectedRegion, setSelectedRegion] = useState('South Africa');

  const preferenceOptions = [
    {
      id: 'theme',
      title: 'Light / Dark Mode',
      icon: 'moon',
      description: 'Choose your preferred theme',
      type: 'toggle' as const,
      value: isLightMode,
      onToggle: toggleTheme,
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'globe',
      description: 'Select your preferred language',
      type: 'selector' as const,
      value: selectedLanguage,
      onPress: () => {
        console.log('Open language selector');
      },
    },
    {
      id: 'region',
      title: 'Region Defaults',
      icon: 'map-pin',
      description: 'Set your default region and timezone',
      type: 'selector' as const,
      value: selectedRegion,
      onPress: () => {
        console.log('Open region selector');
      },
    },
    {
      id: 'content-display',
      title: 'Content Display Preferences',
      icon: 'layout',
      description: 'Customize how content is displayed',
      type: 'selector' as const,
      value: 'Default',
      onPress: () => {
        console.log('Open content display preferences');
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
            <Feather name="sliders" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Preferences
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
              Customize your Ukho experience
            </ThemedText>
          </View>
        </View>

        <View style={styles.optionsList}>
          {preferenceOptions.map((option) => (
            <View
              key={option.id}
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
                {option.type === 'toggle' ? (
                  <Switch
                    value={option.value}
                    onValueChange={option.onToggle}
                    trackColor={{
                      false: 'rgba(148, 163, 184, 0.3)',
                      true: 'rgba(249, 115, 22, 0.5)',
                    }}
                    thumbColor={option.value ? BrandColors.orange500 : '#f4f3f4'}
                    ios_backgroundColor="rgba(148, 163, 184, 0.3)"
                  />
                ) : (
                  <TouchableOpacity
                    onPress={option.onPress}
                    activeOpacity={0.8}
                    style={styles.selectorButton}
                  >
                    <ThemedText style={[styles.selectorValue, { color: theme.textMain }]}>
                      {option.value}
                    </ThemedText>
                    <Feather name="chevron-right" size={16} color={theme.textDim} />
                  </TouchableOpacity>
                )}
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

