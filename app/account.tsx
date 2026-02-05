import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { AnimatedButton } from '@/components/AnimatedButton';
import { AnimatedCard } from '@/components/AnimatedCard';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { ROUTES } from '@/constants/routes';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';
import { useAuth } from '@/context/AuthContext';

const ACCOUNT_OPTIONS = [
    {
      id: 'edit-profile',
      title: 'Edit profile',
      icon: 'user',
      description: 'Update your profile picture, bio, and personal information',
      onPress: () => {
        console.log('Navigate to Edit Profile');
      },
    },
    {
      id: 'change-email',
      title: 'Change email',
      icon: 'mail',
      description: 'Update your email address for account recovery',
      onPress: () => {
        console.log('Navigate to Change Email');
      },
    },
    {
      id: 'change-password',
      title: 'Change password',
      icon: 'key',
      description: 'Update your account password for security',
      onPress: () => {
        console.log('Navigate to Change Password');
      },
    },
    {
      id: 'manage-clan',
      title: 'Manage clan affiliation',
      icon: 'users',
      description: 'Link your profile to clans',
      keywords: 'clan affiliation lineage',
      onPress: () => {
        console.log('Navigate to Manage Clan Affiliations');
      },
    },
  ].map((o) => ({ ...o, keywords: (o as { keywords?: string }).keywords ?? o.title }));

function useAccountHandlers(router: ReturnType<typeof useRouter>) {
  const { signOut } = useAuth();
  const handleSignOut = async () => {
    await signOut();
    router.replace(ROUTES.AUTH as any);
  };
  return { handleSignOut };
}

export default function AccountScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { handleSignOut } = useAccountHandlers(router);

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    // TODO: Call Firebase to delete user + Firestore data, then sign out
    await handleSignOut();
  };

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <AnimatedButton onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color={theme.textMain} />
          </AnimatedButton>
          <View style={styles.iconBadge}>
            <Feather name="user" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Account
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
              Manage your account settings
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
          {ACCOUNT_OPTIONS.map((option) => {
            const isDeleteAccount = option.id === 'delete-account';
            return (
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
                  <View
                    style={[
                      styles.optionIcon,
                      isDeleteAccount && { backgroundColor: '#ef444415' },
                    ]}
                  >
                    <Feather
                      name={option.icon as any}
                      size={20}
                      color={isDeleteAccount ? '#ef4444' : BrandColors.orange500}
                    />
                  </View>
                  <View style={styles.optionContent}>
                    <ThemedText
                      style={[
                        styles.optionTitle,
                        { color: isDeleteAccount ? '#ef4444' : theme.textMain },
                      ]}
                    >
                      {option.title}
                    </ThemedText>
                    <ThemedText style={[styles.optionDescription, { color: theme.textDim }]}>
                      {option.description}
                    </ThemedText>
                  </View>
                  <Feather name="chevron-right" size={18} color={theme.textDim} />
                </View>
              </AnimatedCard>
            );
          })}
          <AnimatedCard
            onPress={handleSignOut}
            style={[
              CardStyles.base,
              {
                backgroundColor: theme.panelBg,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <View style={styles.optionHeader}>
              <View style={[styles.optionIcon, { backgroundColor: 'rgba(249, 115, 22, 0.1)' }]}>
                <Feather name="log-out" size={20} color={BrandColors.orange500} />
              </View>
              <View style={styles.optionContent}>
                <ThemedText style={[styles.optionTitle, { color: theme.textMain }]}>
                  Sign out
                </ThemedText>
                <ThemedText style={[styles.optionDescription, { color: theme.textDim }]}>
                  Sign out of your account on this device
                </ThemedText>
              </View>
              <Feather name="chevron-right" size={18} color={theme.textDim} />
            </View>
          </AnimatedCard>
        </View>
      </ScrollView>

      {/* Delete Account Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: theme.panelBg,
                borderColor: theme.borderColor,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: '#ef444415' }]}>
                <Feather name="alert-triangle" size={24} color="#ef4444" />
              </View>
              <ThemedText style={[styles.modalTitle, { color: theme.textMain }]}>
                Delete Account
              </ThemedText>
              <ThemedText style={[styles.modalDescription, { color: theme.textDim }]}>
                This action cannot be undone. All your data, connections, and clan information will
                be permanently deleted.
              </ThemedText>
            </View>

            <View style={styles.modalActions}>
              <AnimatedButton
                onPress={() => setShowDeleteModal(false)}
                style={[
                  styles.modalButton,
                  styles.modalButtonCancel,
                  {
                    backgroundColor: theme.bgColor,
                    borderColor: theme.borderColor,
                  },
                ]}
              >
                <ThemedText style={[styles.modalButtonText, { color: theme.textMain }]}>
                  Cancel
                </ThemedText>
              </AnimatedButton>
              <AnimatedButton
                onPress={handleDeleteAccount}
                style={[styles.modalButton, styles.modalButtonDelete]}
              >
                <ThemedText style={styles.modalButtonTextDelete}>Delete Account</ThemedText>
              </AnimatedButton>
            </View>
          </View>
        </View>
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
  headerContent: {
    flex: 1,
    minWidth: 0,
  },
  searchIconButton: {
    width: 40,
    height: 40,
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[4],
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: BorderRadius['2.5rem'],
    padding: Spacing[5],
    borderWidth: 1,
    gap: Spacing[4],
  },
  modalHeader: {
    alignItems: 'center',
    gap: Spacing[3],
  },
  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: Typography.fontSize.base,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  modalButton: {
    flex: 1,
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    borderWidth: 1,
  },
  modalButtonDelete: {
    backgroundColor: '#ef4444',
  },
  modalButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
  },
  modalButtonTextDelete: {
    fontSize: Typography.fontSize.base,
    fontWeight: '800',
    color: '#fff',
  },
});

