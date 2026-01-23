import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

export default function AboutScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const appVersion = Constants.expoConfig?.version || '1.0.0';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const aboutSections = [
    {
      id: 'purpose',
      title: 'Our Purpose',
      icon: 'heart',
      type: 'content' as const,
      content: 'Ukho connects you to your roots, your clan, and your community. We honor ancestral wisdom while building bridges across generations and geographies.',
    },
    {
      id: 'governance',
      title: 'Cultural Governance',
      icon: 'shield',
      type: 'content' as const,
      content: 'Ukho is guided by cultural advisors and elders who ensure our platform respects and uplifts African traditions, languages, and values.',
    },
    {
      id: 'version',
      title: 'Version',
      icon: 'info',
      type: 'version' as const,
      version: appVersion,
      build: Constants.expoConfig?.ios?.buildNumber || Constants.expoConfig?.android?.versionCode || 'N/A',
    },
    {
      id: 'legal',
      title: 'Legal',
      icon: 'file-text',
      type: 'actions' as const,
      actions: [
        {
          label: 'Terms of Service',
          onPress: () => {
            console.log('Open Terms of Service');
            // handleOpenLink('https://ukho.network/terms');
          },
        },
        {
          label: 'Privacy Policy',
          onPress: () => {
            console.log('Open Privacy Policy');
            // handleOpenLink('https://ukho.network/privacy');
          },
        },
      ],
    },
    {
      id: 'contact',
      title: 'Contact & Support',
      icon: 'mail',
      type: 'actions' as const,
      actions: [
        {
          label: 'Help Center',
          onPress: () => {
            console.log('Open Help Center');
            // handleOpenLink('https://ukho.network/help');
          },
        },
        {
          label: 'Contact Us',
          onPress: () => {
            console.log('Open Contact Form');
            // handleOpenLink('mailto:support@ukho.network');
          },
        },
      ],
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
            <Feather name="info" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              About Ukho
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
              Learn more about our mission
            </ThemedText>
          </View>
        </View>

        <View style={styles.sectionsList}>
          {aboutSections.map((section) => (
            <View
              key={section.id}
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
                <ThemedText style={[styles.sectionTitle, { color: theme.textMain }]}>
                  {section.title}
                </ThemedText>
              </View>

              {section.type === 'content' && (
                <ThemedText style={[styles.sectionContent, { color: theme.textDim }]}>
                  {section.content}
                </ThemedText>
              )}

              {section.type === 'version' && (
                <View style={styles.versionInfo}>
                  <View style={styles.versionRow}>
                    <ThemedText style={[styles.versionLabel, { color: theme.textDim }]}>
                      Version
                    </ThemedText>
                    <ThemedText style={[styles.versionValue, { color: theme.textMain }]}>
                      {section.version}
                    </ThemedText>
                  </View>
                  <View style={styles.versionRow}>
                    <ThemedText style={[styles.versionLabel, { color: theme.textDim }]}>
                      Build
                    </ThemedText>
                    <ThemedText style={[styles.versionValue, { color: theme.textMain }]}>
                      {section.build}
                    </ThemedText>
                  </View>
                </View>
              )}

              {section.type === 'actions' && (
                <View style={styles.actionsList}>
                  {section.actions.map((action, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={action.onPress}
                      activeOpacity={0.8}
                      style={[
                        styles.actionButton,
                        {
                          backgroundColor: theme.bgColor,
                          borderColor: theme.borderColor,
                        },
                      ]}
                    >
                      <ThemedText style={[styles.actionButtonText, { color: theme.textMain }]}>
                        {action.label}
                      </ThemedText>
                      <Feather name="chevron-right" size={16} color={theme.textDim} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
  sectionsList: {
    gap: Spacing[4],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius['2xl'],
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  sectionContent: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    lineHeight: 22,
    opacity: 0.9,
  },
  versionInfo: {
    gap: Spacing[2],
  },
  versionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  versionValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  actionsList: {
    gap: Spacing[2],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
  },
});

