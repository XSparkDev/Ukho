import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AnimatedButton } from '@/components/AnimatedButton';
import { AnimatedCard } from '@/components/AnimatedCard';
import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

const PRIVACY_OPTIONS = ['Everyone', 'Connections', 'Kin only', 'No one'] as const;
type PrivacyOption = (typeof PRIVACY_OPTIONS)[number];

const STORAGE_KEYS = {
  who_contact: '@ukho_privacy_who_contact',
  who_profile: '@ukho_privacy_who_profile',
  who_clan: '@ukho_privacy_who_clan',
} as const;

type SelectorId = 'who-contact' | 'who-profile' | 'who-clan';

const PRIVACY_ITEMS: {
  id: string;
  title: string;
  icon: string;
  description: string;
  storageKey?: keyof typeof STORAGE_KEYS;
  route?: string;
}[] = [
  { id: 'who-contact', title: 'Who Can Contact Me', icon: 'message-circle', description: 'Control who can send you connection requests', storageKey: 'who_contact' },
  { id: 'who-profile', title: 'Who Can See My Profile', icon: 'user', description: 'Choose who can view your profile and clan', storageKey: 'who_profile' },
  { id: 'who-clan', title: 'Who Can See My Clan', icon: 'users', description: 'Visibility of your clan affiliation', storageKey: 'who_clan' },
  { id: 'blocked', title: 'Blocked Users', icon: 'user-x', description: 'Manage blocked users', route: '/blocked' },
];

const DEFAULT_VALUE: PrivacyOption = 'Connections';

export default function PrivacyScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [values, setValues] = useState<Record<SelectorId, PrivacyOption>>({
    'who-contact': DEFAULT_VALUE,
    'who-profile': DEFAULT_VALUE,
    'who-clan': DEFAULT_VALUE,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<SelectorId | null>(null);

  const loadStored = useCallback(async () => {
    try {
      const [contact, profile, clan] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.who_contact),
        AsyncStorage.getItem(STORAGE_KEYS.who_profile),
        AsyncStorage.getItem(STORAGE_KEYS.who_clan),
      ]);
      setValues((prev) => ({
        ...prev,
        'who-contact': (contact as PrivacyOption) || DEFAULT_VALUE,
        'who-profile': (profile as PrivacyOption) || DEFAULT_VALUE,
        'who-clan': (clan as PrivacyOption) || DEFAULT_VALUE,
      }));
    } catch {}
  }, []);

  useEffect(() => {
    loadStored();
  }, [loadStored]);

  const openSelector = (id: SelectorId) => {
    setEditingId(id);
    setModalVisible(true);
  };

  const selectOption = async (option: PrivacyOption) => {
    if (!editingId) return;
    const key = PRIVACY_ITEMS.find((i) => i.id === editingId)?.storageKey;
    if (key) {
      setValues((prev) => ({ ...prev, [editingId]: option }));
      try {
        await AsyncStorage.setItem(STORAGE_KEYS[key], option);
      } catch {}
    }
    setModalVisible(false);
    setEditingId(null);
  };

  const getDisplayValue = (item: (typeof PRIVACY_ITEMS)[0]) => {
    if (item.route) return null;
    const id = item.id as SelectorId;
    return values[id] ?? DEFAULT_VALUE;
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <AnimatedButton onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={theme.textMain} />
          </AnimatedButton>
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
          <TouchableOpacity
            onPress={() => router.push('/settings-search')}
            style={styles.searchIconButton}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Feather name="search" size={22} color={theme.textMain} />
          </TouchableOpacity>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="privacy" />
          </View>
        </View>

        <View style={styles.sectionList}>
          {PRIVACY_ITEMS.map((item) => (
            <AnimatedCard
              key={item.id}
              onPress={() => {
                if (item.route) {
                  router.push(item.route);
                } else if (item.storageKey) {
                  openSelector(item.id as SelectorId);
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
                  {getDisplayValue(item) && (
                    <ThemedText style={[styles.cardValue, { color: theme.textDim }]}>
                      {getDisplayValue(item)}
                    </ThemedText>
                  )}
                </View>
                <Feather name="chevron-right" size={18} color={theme.textDim} />
              </View>
            </AnimatedCard>
          ))}
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.panelBg, borderColor: theme.borderColor }]}>
            <ThemedText style={[styles.modalTitle, { color: theme.textMain }]}>
              {editingId && PRIVACY_ITEMS.find((i) => i.id === editingId)?.title}
            </ThemedText>
            {PRIVACY_OPTIONS.map((option) => (
              <AnimatedButton
                key={option}
                style={[
                  styles.optionRow,
                  { borderColor: theme.borderColor },
                  values[editingId!] === option && { backgroundColor: 'rgba(249, 115, 22, 0.1)' },
                ]}
                onPress={() => selectOption(option)}
              >
                <View style={styles.optionRowInner}>
                  <ThemedText style={[styles.optionText, { color: theme.textMain }]}>{option}</ThemedText>
                  {values[editingId!] === option && (
                    <Feather name="check" size={20} color={BrandColors.orange500} />
                  )}
                </View>
              </AnimatedButton>
            ))}
            <AnimatedButton
              style={[styles.modalCancel, { borderColor: theme.borderColor }]}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText style={[styles.modalCancelText, { color: theme.textMain }]}>Cancel</ThemedText>
            </AnimatedButton>
          </View>
        </Pressable>
      </Modal>
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
  headerContent: { flex: 1, minWidth: 0 },
  searchIconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: Spacing[4],
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    borderWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', marginBottom: Spacing[3] },
  optionRow: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    marginBottom: Spacing[2],
  },
  optionRowInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: { fontSize: 16, fontWeight: '600' },
  modalCancel: {
    marginTop: Spacing[2],
    paddingVertical: Spacing[3],
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
  },
  modalCancelText: { fontWeight: '600' },
});
