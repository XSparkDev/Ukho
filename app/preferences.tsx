import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AnimatedCard } from '@/components/AnimatedCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

export default function PreferencesScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showComingSoonModal, setShowComingSoonModal] = useState(false);

  const preferenceOptions = [
    {
      id: 'theme',
      title: 'Light/Dark mode',
      icon: 'moon',
      description: 'Switch between light and dark Ukho experiences',
      onPress: () => setShowComingSoonModal(true),
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'globe',
      description: 'Choose your preferred language for Ukho',
      onPress: () => setShowComingSoonModal(true),
    },
    {
      id: 'region-defaults',
      title: 'Region defaults',
      icon: 'map-pin',
      description: 'Set your default region for content and clans',
      onPress: () => setShowComingSoonModal(true),
    },
    {
      id: 'contact-display',
      title: 'Contact display preferences',
      icon: 'users',
      description: 'Control how contacts and relations are shown to you',
      onPress: () => setShowComingSoonModal(true),
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
            <ThemedText style={[styles.title, { color: theme.textMain }]}>
              Preferences
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
              Tune how Ukho feels
            </ThemedText>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/settings-search')}
            style={styles.searchIconButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="search" size={22} color={theme.textMain} />
          </TouchableOpacity>
        </View>

        <View style={styles.optionsList}>
          {preferenceOptions.map((option) => (
            <AnimatedCard
              key={option.id}
              onPress={option.onPress}
              style={[
                styles.optionCard,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionIcon}>
                  <Feather
                    name={option.icon as any}
                    size={20}
                    color={BrandColors.orange500}
                  />
                </View>

                <View style={styles.optionContent}>
                  <ThemedText style={[styles.optionTitle, { color: theme.textMain }]}>
                    {option.title}
                  </ThemedText>
                  <ThemedText style={[styles.optionDescription, { color: theme.textDim }]}>
                    {option.description}
                  </ThemedText>
                </View>

                <Feather name="chevron-right" size={18} color={theme.textDim} />
              </View>
            </AnimatedCard>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={showComingSoonModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowComingSoonModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.panelBg }]}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIcon}>
                <Feather name="sliders" size={24} color={BrandColors.orange500} />
              </View>

              <ThemedText style={[styles.modalTitle, { color: theme.textMain }]}>
                Preferences coming soon
              </ThemedText>

              <ThemedText style={[styles.modalDescription, { color: theme.textDim }]}>
                These controls will be available in a future release.
              </ThemedText>
            </View>

            <TouchableOpacity
              onPress={() => setShowComingSoonModal(false)}
              style={styles.modalButton}
            >
              <ThemedText style={{ color: theme.textMain }}>Got it</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing[4],
    gap: Spacing[4],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.orange500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: { flex: 1, minWidth: 0 },
  searchIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 22, fontWeight: '900' },
  subtitle: { fontSize: 14, fontWeight: '600' },
  optionsList: { gap: Spacing[4] },
  optionCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    borderWidth: 1,
  },
  optionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing[3] },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionContent: { flex: 1 },
  optionTitle: { fontSize: 16, fontWeight: '800' },
  optionDescription: { fontSize: 14, opacity: 0.8 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[5],
  },
  modalHeader: { alignItems: 'center', gap: Spacing[3] },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: '900' },
  modalDescription: { textAlign: 'center' },
  modalButton: {
    marginTop: Spacing[4],
    padding: Spacing[4],
    alignItems: 'center',
    borderRadius: BorderRadius['2xl'],
  },
});

