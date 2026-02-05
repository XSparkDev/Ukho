import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

type PossibleKin = {
  id: string;
  name: string;
  clan: string;
  matchType: string;
  avatar: string;
};

const POSSIBLE_KIN: PossibleKin[] = [
  {
    id: 'pk1',
    name: 'Lungile Khumalo',
    clan: 'KHUMALO',
    matchType: 'Direct Clan Match',
    avatar:
      'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'pk2',
    name: 'Sabelo Mabaso',
    clan: 'MABASO',
    matchType: 'Related Branch',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'pk3',
    name: 'Nomalanga Mntungwa',
    clan: 'MNTUNGWA',
    matchType: 'Shared Praises',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150',
  },
];

export default function PossibleKinScreen() {
  const { theme } = useTheme();

  const handleConnect = (kinId: string) => {
    // Placeholder for connect functionality
    console.log('Connect with kin:', kinId);
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Feather name="star" size={20} color={BrandColors.orange500} strokeWidth={2} />
            <View style={styles.headerTextContainer}>
              <ThemedText
                style={[
                  styles.headerTitle,
                  { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
                ]}
              >
                Possible Kin
              </ThemedText>
              <ThemedText style={[styles.headerSubtitle, { color: theme.textDim }]}>
                PEOPLE WHO MIGHT BE YOUR PEOPLE
              </ThemedText>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="possible-kin" />
          </View>
        </View>

        {/* Kin Cards List */}
        <View style={styles.kinList}>
          {POSSIBLE_KIN.map((kin) => (
            <View
              key={kin.id}
              style={[
                styles.kinCard,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              {/* Profile Picture */}
              <Image source={{ uri: kin.avatar }} style={styles.avatar} />

              {/* Kin Info */}
              <View style={styles.kinInfo}>
                <ThemedText style={[styles.kinName, { color: theme.textMain }]}>
                  {kin.name}
                </ThemedText>
                <ThemedText style={[styles.kinClan, { color: BrandColors.orange500 }]}>
                  {kin.clan}
                </ThemedText>
                <ThemedText style={[styles.kinMatchType, { color: theme.textDim }]}>
                  {kin.matchType}
                </ThemedText>
              </View>

              {/* Connect Button */}
              <TouchableOpacity
                onPress={() => handleConnect(kin.id)}
                style={styles.connectButton}
                activeOpacity={0.8}
              >
                <Feather name="user-plus" size={16} color="#fff" />
                <ThemedText style={styles.connectButtonText}>CONNECT</ThemedText>
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[2],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing[3],
    flex: 1,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: Spacing[1],
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
  menuContainer: {
    marginLeft: Spacing[2],
  },
  kinList: {
    gap: Spacing[4],
  },
  kinCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    gap: Spacing[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.xl,
  },
  kinInfo: {
    flex: 1,
  },
  kinName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  kinClan: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
    marginBottom: Spacing[1],
  },
  kinMatchType: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  connectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    backgroundColor: BrandColors.orange500,
    shadowColor: BrandColors.orange500,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  connectButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
});

