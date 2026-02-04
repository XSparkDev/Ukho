import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

type NearbyKin = {
  id: string;
  name: string;
  clan: string;
  location: string;
  distance: string;
};

const NEARBY_KIN: NearbyKin[] = [
  {
    id: 'k1',
    name: 'Thabo Dlamini',
    clan: 'DLAMINI',
    location: 'Soweto',
    distance: '0.4km',
  },
  {
    id: 'k2',
    name: 'Nomusa Zulu',
    clan: 'ZULU',
    location: 'Durban',
    distance: '1.2km',
  },
  {
    id: 'k3',
    name: 'Lerato Mofokeng',
    clan: 'MOFOKENG',
    location: 'Johannesburg',
    distance: '2.5km',
  },
  {
    id: 'k4',
    name: 'Sizwe Madiba',
    clan: 'MADIBA',
    location: 'Mthatha',
    distance: '3.1km',
  },
  {
    id: 'k5',
    name: 'Kopano Tswana',
    clan: 'TSWANA',
    location: 'Pretoria',
    distance: '4.8km',
  },
  {
    id: 'k6',
    name: 'Zanele Khumalo',
    clan: 'KHUMALO',
    location: 'Soweto',
    distance: '0.9km',
  },
];

export default function NearbyKinScreen() {
  const { theme, isLightMode } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKin = useMemo(
    () =>
      NEARBY_KIN.filter(
        (kin) =>
          kin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kin.clan.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kin.location.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const handleAddKin = (kinId: string) => {
    // Placeholder for add kin functionality
    console.log('Add kin:', kinId);
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
            <Feather name="map-pin" size={20} color={BrandColors.orange500} />
            <ThemedText
              style={[
                styles.headerTitle,
                { color: BrandColors.orange500, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              NEARBY KIN
            </ThemedText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
              activeOpacity={0.7}
            >
              <Feather name="filter" size={18} color={theme.textDim} />
            </TouchableOpacity>
            <View style={styles.menuContainer}>
              <DropdownMenu currentRoute="nearby" />
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <Feather
            name="search"
            size={18}
            color={theme.textDim}
            style={styles.searchIcon}
          />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search name or clan..."
            placeholderTextColor={theme.textDim}
            style={[
              styles.searchInput,
              {
                color: theme.textMain,
              },
            ]}
          />
        </View>

        {/* Kin List */}
        <View style={styles.kinList}>
          {filteredKin.map((kin) => (
            <View
              key={kin.id}
              style={[
                styles.kinItem,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <View style={styles.kinInfo}>
                <ThemedText style={[styles.kinName, { color: theme.textMain }]}>
                  {kin.name}
                </ThemedText>
                <View style={styles.kinDetails}>
                  <ThemedText style={[styles.kinDetailText, { color: theme.textDim }]}>
                    {kin.clan}
                  </ThemedText>
                  <ThemedText style={[styles.kinDetailText, { color: theme.textDim }]}>
                    {' • '}
                  </ThemedText>
                  <ThemedText style={[styles.kinDetailText, { color: theme.textDim }]}>
                    {kin.location}
                  </ThemedText>
                  <View
                    style={[
                      styles.distanceBadge,
                      {
                        backgroundColor: isLightMode
                          ? 'rgba(0, 0, 0, 0.05)'
                          : 'rgba(255, 255, 255, 0.1)',
                      },
                    ]}
                  >
                    <ThemedText style={[styles.distanceText, { color: theme.textDim }]}>
                      {kin.distance}
                    </ThemedText>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleAddKin(kin.id)}
                style={styles.addButton}
                activeOpacity={0.7}
              >
                <Feather name="user-plus" size={18} color={BrandColors.orange500} />
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
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.widest,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  menuContainer: {
    marginLeft: Spacing[1],
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    gap: Spacing[3],
  },
  searchIcon: {
    marginLeft: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
  },
  kinList: {
    gap: Spacing[3],
  },
  kinItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  kinInfo: {
    flex: 1,
  },
  kinName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  kinDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing[1],
  },
  kinDetailText: {
    fontSize: Typography.fontSize.sm,
  },
  distanceBadge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: BorderRadius.md,
    marginLeft: Spacing[1],
  },
  distanceText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing[3],
  },
});

