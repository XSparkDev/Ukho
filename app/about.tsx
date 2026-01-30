import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AnimatedCard } from '@/components/AnimatedCard';
import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

const ABOUT_SECTIONS = [
  { id: 'purpose', title: 'Our Purpose', icon: 'heart', description: 'Ukho connects you to your roots, kin, and cultural lineage through clan identity and community.' },
  { id: 'governance', title: 'Cultural Governance', icon: 'shield', description: 'We honour traditional structures and work with elders and cultural custodians to steward this space.' },
  { id: 'version', title: 'Version', icon: 'info', description: 'Ukho Network Mobile 1.0.0' },
  { id: 'legal', title: 'Legal', icon: 'file-text', description: 'Terms of Service and Privacy Policy', url: 'https://ukho.network/terms' },
  { id: 'contact', title: 'Contact & Support', icon: 'mail', description: 'Get help or send feedback', url: 'https://ukho.network/contact' },
];

export default function AboutScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const handlePress = (item: (typeof ABOUT_SECTIONS)[0]) => {
    if (item.url) {
      Linking.openURL(item.url).catch(() => {});
    } else {
      console.log(item.id);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} activeOpacity={0.8}>
            <Feather name="arrow-left" size={20} color={theme.textMain} />
          </TouchableOpacity>
          <View style={styles.iconBadge}>
            <Feather name="info" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText style={[styles.title, { color: theme.textMain, fontFamily: Typography.spaceGrotesk }]}>
              About Ukho
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: BrandColors.orange500 }]}>
              PURPOSE, GOVERNANCE & SUPPORT
            </ThemedText>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="about" />
          </View>
        </View>

        <View style={styles.sectionList}>
          {ABOUT_SECTIONS.map((item) => (
            <AnimatedCard
              key={item.id}
              onPress={() => handlePress(item)}
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
                </View>
                {item.url && <Feather name="external-link" size={18} color={theme.textDim} />}
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
});
