import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/ScreenContainer';
import { DropdownMenu } from '@/components/DropdownMenu';
import { useTheme } from '@/constants/Theme';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';

type Elder = {
  id: string;
  name: string;
  role: string;
  clan: string;
  avatar: string;
};

type Kin = {
  id: string;
  name: string;
  clan: string;
  matchReason: string;
  avatar: string;
};

type CollapsibleSectionProps = {
  label: string;
  icon: React.ReactNode;
  titleColor: string;
  chevronColor: string;
  children: React.ReactNode;
};

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  label,
  icon,
  titleColor,
  chevronColor,
  children,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animated, {
      toValue: expanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [expanded, animated]);

  const onLayoutContent = (event: any) => {
    const height = event.nativeEvent.layout.height;
    if (height > 0 && contentHeight === 0) {
      setContentHeight(height);
    }
  };

  const heightStyle =
    contentHeight === 0
      ? {}
      : {
          height: animated.interpolate({
            inputRange: [0, 1],
            outputRange: [0, contentHeight],
          }),
        };

  const chevronRotation = animated.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View>
      <TouchableOpacity
        style={styles.sectionHeader}
        onPress={() => setExpanded((prev) => !prev)}
        activeOpacity={0.8}
      >
        <View style={styles.sectionHeaderLeft}>
          {icon}
          <ThemedText style={[styles.sectionTitle, { color: titleColor }]}>{label}</ThemedText>
        </View>
        <Animated.View style={{ transform: [{ rotate: chevronRotation }] }}>
          <Feather name="chevron-right" size={16} color={chevronColor} />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={[{ overflow: 'hidden', opacity: animated }, heightStyle]}>
        <View onLayout={onLayoutContent}>{children}</View>
      </Animated.View>
    </View>
  );
};

const VERIFIED_ELDERS: Elder[] = [
  {
    id: 'c1',
    name: 'Baba Mthimkhulu',
    role: 'Chief Elder',
    clan: 'Khumalo',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'c2',
    name: 'Gogo Dlamini',
    role: 'Genealogist',
    clan: 'Dlamini',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'c3',
    name: 'Nkosi Zwelithini',
    role: 'Traditional Council',
    clan: 'Zulu',
    avatar:
      'https://images.unsplash.com/photo-1507152832244-10d557b33b75?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'c4',
    name: 'Mkhulu Gumede',
    role: 'History Keeper',
    clan: 'Gumede',
    avatar:
      'https://images.unsplash.com/photo-1523910088395-dce0fc364d70?auto=format&fit=crop&q=80&w=150&h=150',
  },
];

const POTENTIAL_KIN: Kin[] = [
  {
    id: 'r1',
    name: 'Lungile Khumalo',
    clan: 'Khumalo',
    matchReason: 'Direct Clan Match',
    avatar:
      'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'r2',
    name: 'Sabelo Mabaso',
    clan: 'Mabaso',
    matchReason: 'Related Branch',
    avatar:
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'r3',
    name: 'Nomalanga Mntungwa',
    clan: 'Mntungwa',
    matchReason: 'Shared Praises',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150',
  },
];

export default function ContactsScreen() {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredElders = useMemo(
    () =>
      VERIFIED_ELDERS.filter(
        (e) =>
          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.clan.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header card */}
        <View
          style={[
            styles.headerCard,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <View style={styles.headerTopRow}>
            <View style={styles.headerTitleContainer}>
              <ThemedText
                style={[
                  styles.headerTitle,
                  { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
                ]}
              >
                DISCOVER
              </ThemedText>
              <ThemedText style={styles.headerSubtitle}>FIND YOUR KIN</ThemedText>
            </View>
            <View style={styles.menuContainer}>
              <DropdownMenu currentRoute="explore" />
            </View>
          </View>
          <View style={styles.searchRow}>
            <Feather
              name="search"
              size={18}
              color={theme.textDim}
              style={styles.searchIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search ancestors or kin..."
              placeholderTextColor={theme.textDim}
              style={[
                styles.searchInput,
                {
                  color: theme.textMain,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderColor: 'rgba(0,0,0,0.05)',
                },
              ]}
            />
          </View>
        </View>

        {/* Verified Elders (collapsible) */}
        <CollapsibleSection
          label="VERIFIED ELDERS"
          icon={<Feather name="shield" size={20} color="#10b981" />}
          titleColor={theme.textMain}
          chevronColor={theme.textDim}
        >
          <View style={styles.eldersGrid}>
            {filteredElders.map((elder) => (
              <View
                key={elder.id}
                style={[
                  styles.elderCard,
                  {
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderColor,
                  },
                ]}
              >
                <View style={styles.elderRow}>
                  <View style={styles.elderAvatarWrapper}>
                    <Image source={{ uri: elder.avatar }} style={styles.elderAvatar} />
                    <View style={styles.verifyDot}>
                      <Feather name="shield" size={10} color="#fff" />
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={[styles.elderName, { color: theme.textMain }]}>
                      {elder.name}
                    </ThemedText>
                    <ThemedText style={styles.elderClan}>{elder.clan} Clan</ThemedText>
                    <ThemedText style={styles.elderRole}>{elder.role}</ThemedText>
                  </View>
                  <View>
                    <View style={styles.messageButton}>
                      <Feather name="message-circle" size={18} color="#f97316" />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </CollapsibleSection>

        {/* Potential Kin (compact grid, collapsible) */}
        {!searchQuery && (
          <CollapsibleSection
            label="POTENTIAL KIN"
            icon={<Feather name="star" size={20} color="#f97316" />}
            titleColor={theme.textMain}
            chevronColor={theme.textDim}
          >
            <View
              style={[
                styles.potentialCard,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <View style={styles.kinGrid}>
                {POTENTIAL_KIN.map((kin) => (
                  <View key={kin.id} style={styles.kinCard}>
                    <Image source={{ uri: kin.avatar }} style={styles.kinAvatar} />
                    <ThemedText style={[styles.kinName, { color: theme.textMain }]}>
                      {kin.name}
                    </ThemedText>
                    <ThemedText style={styles.kinClan}>{kin.clan}</ThemedText>
                    <ThemedText style={styles.kinReason} numberOfLines={2}>
                      “{kin.matchReason}”
                    </ThemedText>
                    <View style={styles.kinButton}>
                      <Feather name="user-plus" size={14} color="#fff" />
                      <ThemedText style={styles.kinButtonText}>SEND LINK</ThemedText>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </CollapsibleSection>
        )}
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
  headerCard: {
    borderRadius: BorderRadius['2.5rem'],
    padding: Spacing[5],
    borderWidth: 1,
    borderBottomWidth: 4,
    borderBottomColor: '#f97316',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[4],
  },
  headerTitleContainer: {
    flex: 1,
  },
  menuContainer: {
    marginLeft: Spacing[3],
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  headerSubtitle: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: Typography.letterSpacing.widest,
    color: '#64748b',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4] + 20,
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    fontSize: Typography.fontSize.base,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[1],
    marginTop: Spacing[4],
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
  },
  eldersGrid: {
    marginTop: Spacing[2],
    gap: Spacing[3],
  },
  elderCard: {
    borderRadius: BorderRadius['2.5rem'],
    padding: Spacing[5],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  elderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  elderAvatarWrapper: {
    position: 'relative',
  },
  elderAvatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
  },
  verifyDot: {
    position: 'absolute',
    right: -4,
    bottom: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  elderName: {
    fontSize: 16,
    fontWeight: '700',
  },
  elderClan: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: '#f97316',
    marginTop: 2,
  },
  elderRole: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  messageButton: {
    padding: Spacing[3],
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  potentialCard: {
    borderRadius: BorderRadius['2.5rem'],
    padding: Spacing[5],
    borderWidth: 1,
    marginTop: Spacing[2],
  },
  kinGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
    justifyContent: 'space-between',
  },
  kinCard: {
    width: '48%',
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    backgroundColor: 'rgba(15,23,42,0.03)',
    alignItems: 'center',
    gap: Spacing[1],
  },
  kinAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: Spacing[2],
  },
  kinName: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  kinClan: {
    fontSize: 10,
    fontWeight: '900',
    color: '#f97316',
    letterSpacing: Typography.letterSpacing.widest,
  },
  kinReason: {
    fontSize: 11,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  kinButton: {
    marginTop: Spacing[2],
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    backgroundColor: '#f97316',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  kinButtonText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: Typography.letterSpacing.widest,
  },
});
