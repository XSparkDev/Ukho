import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { DropdownMenu } from '@/components/DropdownMenu';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { UkhoGradient } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';
import { createClan, getAllClans, type Clan } from '@/services/clanService';

export default function PlazaScreen() {
  const { theme, isLightMode } = useTheme();
  const wisdom = 'Umuntu ngumuntu ngabantu. A person is a person through other people.';
  const [searchQuery, setSearchQuery] = useState('');
  const [clans, setClans] = useState<Clan[]>([]);
  const [clansDropdownOpen, setClansDropdownOpen] = useState(false);
  const [loadingClans, setLoadingClans] = useState(true);
  const [showCreateClanModal, setShowCreateClanModal] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createTribe, setCreateTribe] = useState('');
  const [createHouse, setCreateHouse] = useState('');
  const [createTotem, setCreateTotem] = useState('');
  const [createBranch, setCreateBranch] = useState('');
  const [createRegion, setCreateRegion] = useState('');
  const [advancedSectionOpen, setAdvancedSectionOpen] = useState(false);
  const [advancedFields, setAdvancedFields] = useState<Record<string, string>>({});
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const setAdvancedField = (key: string, value: string) => {
    setAdvancedFields((prev) => ({ ...prev, [key]: value }));
  };

  const loadClans = useCallback(async () => {
    setLoadingClans(true);
    try {
      const list = await getAllClans();
      setClans(list);
    } catch (e) {
      console.warn('Failed to load clans:', e);
      setClans([]);
    } finally {
      setLoadingClans(false);
    }
  }, []);

  useEffect(() => {
    loadClans();
  }, [loadClans]);

  const searchResults = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return [];
    return clans.filter((clan) => {
      const haystack = [
        clan.name,
        clan.tribe ?? '',
        clan.house ?? '',
        clan.branch ?? '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [clans, searchQuery]);

  const handleSearchSubmit = () => {
  };

  const openCreateModal = () => {
    setCreateError(null);
    setCreateName('');
    setCreateTribe('');
    setCreateHouse('');
    setCreateTotem('');
    setCreateBranch('');
    setCreateRegion('');
    setAdvancedSectionOpen(false);
    setAdvancedFields({});
    setShowCreateClanModal(true);
  };

  const closeCreateModal = () => {
    if (!creating) setShowCreateClanModal(false);
  };

  const handleCreateClan = async () => {
    const name = createName.trim();
    const tribe = createTribe.trim();
    if (!name) {
      setCreateError('Clan name is required.');
      return;
    }
    if (!tribe) {
      setCreateError('Tribe is required.');
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const clanId = `${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      const regionList = createRegion.trim()
        ? createRegion.split(',').map((r) => r.trim()).filter(Boolean)
        : [];
      const clan: Clan = {
        clan_id: clanId,
        name,
        house: createHouse.trim() || null,
        branch: createBranch.trim() || null,
        founder: null,
        region: regionList,
        association: [],
        lineage_type: 'patrilineal',
        descendants: [],
        tribe: tribe || null,
        totem: createTotem.trim() || null,
      };
      const mc = advancedFields.member_count?.trim();
      if (advancedFields.clan_praise_name?.trim()) clan.clan_praise_name = advancedFields.clan_praise_name.trim();
      if (advancedFields.totem_image?.trim()) clan.totem_image = advancedFields.totem_image.trim();
      if (advancedFields.clan_colors?.trim()) clan.clan_colors = advancedFields.clan_colors.trim();
      if (advancedFields.origin_story?.trim()) clan.origin_story = advancedFields.origin_story.trim();
      if (advancedFields.ancestral_territory?.trim()) clan.ancestral_territory = advancedFields.ancestral_territory.trim();
      if (advancedFields.current_regions?.trim()) clan.current_regions = advancedFields.current_regions.trim();
      if (advancedFields.clan_symbol?.trim()) clan.clan_symbol = advancedFields.clan_symbol.trim();
      if (advancedFields.traditional_leadership?.trim()) clan.traditional_leadership = advancedFields.traditional_leadership.trim();
      if (mc !== undefined && mc !== '') {
        const n = parseInt(mc, 10);
        if (!Number.isNaN(n)) clan.member_count = n;
      }
      if (advancedFields.founded_date?.trim()) clan.founded_date = advancedFields.founded_date.trim();
      if (advancedFields.cultural_practices?.trim()) clan.cultural_practices = advancedFields.cultural_practices.trim();
      if (advancedFields.ceremonies?.trim()) clan.ceremonies = advancedFields.ceremonies.trim();
      if (advancedFields.traditions?.trim()) clan.traditions = advancedFields.traditions.trim();
      if (advancedFields.praise_poetry?.trim()) clan.praise_poetry = advancedFields.praise_poetry.trim();
      if (advancedFields.clan_history?.trim()) clan.clan_history = advancedFields.clan_history.trim();
      if (advancedFields.notable_ancestors?.trim()) clan.notable_ancestors = advancedFields.notable_ancestors.trim();
      await createClan(clan);
      await loadClans();
      closeCreateModal();
    } catch (e) {
      console.warn('Create clan error:', e);
      setCreateError(e instanceof Error ? e.message : 'Failed to create clan.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Ukho Header Badge (mobile top bar analogue) */}
        <View style={styles.headerRow}>
          <LinearGradient
            colors={[UkhoGradient.start, UkhoGradient.end]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBadge}
          >
            <ThemedText style={styles.logoGlyph}>ü</ThemedText>
          </LinearGradient>
          <View style={styles.brandContainer}>
            <ThemedText
              type="title"
              style={[
                styles.brandTitle,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Ukho
            </ThemedText>
            <ThemedText style={styles.brandTagline}>CONNECT YOUR ROOTS</ThemedText>
          </View>
          <View style={styles.menuContainer}>
            <DropdownMenu currentRoute="index" />
          </View>
        </View>

        {/* Clan Search Card (simplified first pass) */}
        <View
          style={[
            styles.glassCard,
            styles.essentialCardBorder,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconPill}>
              <Feather name="search" size={22} color="#f97316" />
            </View>
            <View>
              <ThemedText style={[styles.cardTitle, { color: theme.textMain }]}>
                Clan Search
              </ThemedText>
              <ThemedText style={styles.cardSubtitle}>Find Your Origins</ThemedText>
            </View>
          </View>

          <View style={styles.inputRow}>
            <Feather
              name="map-pin"
              size={18}
              color="rgba(249, 115, 22, 0.6)"
              style={styles.inputIcon}
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Enter surname or clan name..."
              placeholderTextColor={theme.textDim}
              returnKeyType="search"
              onSubmitEditing={handleSearchSubmit}
              style={[styles.fakeInput, { color: theme.textMain, flex: 1 }]}
            />
          </View>

          {/* Search results (filtered from clans loaded once on mount) */}
          {searchQuery.trim() ? (
            <View style={styles.searchResultsWrap}>
              {loadingClans ? (
                <View style={styles.searchResultsLoading}>
                  <ActivityIndicator size="small" color="#f97316" />
                  <ThemedText style={[styles.searchResultsLoadingText, { color: theme.textDim }]}>
                    Loading clans…
                  </ThemedText>
                </View>
              ) : searchResults.length === 0 ? (
                <ThemedText style={[styles.searchResultsEmpty, { color: theme.textDim }]}>
                  No clans found. Try a different name or create a clan below.
                </ThemedText>
              ) : (
                <View style={styles.searchResultsList}>
                  {searchResults.map((c) => (
                    <View
                      key={c.clan_id}
                      style={[styles.searchResultRow, { borderTopColor: theme.borderColor }]}
                    >
                      <ThemedText style={[styles.searchResultName, { color: theme.textMain }]} numberOfLines={1}>
                        {c.name}
                      </ThemedText>
                      {(c.tribe || c.house || c.branch) && (
                        <ThemedText style={[styles.searchResultMeta, { color: theme.textDim }]} numberOfLines={1}>
                          {[c.tribe, c.house, c.branch].filter(Boolean).join(' · ')}
                        </ThemedText>
                      )}
                    </View>
                  ))}
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* Clans dropdown + Create clan */}
        <View
          style={[
            styles.clansDropdownCard,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.clansDropdownHeader}
            onPress={() => setClansDropdownOpen((o) => !o)}
            activeOpacity={0.8}
          >
            <View style={styles.clansDropdownHeaderLeft}>
              <Feather
                name="chevron-right"
                size={20}
                color="#f97316"
                style={{ transform: [{ rotate: clansDropdownOpen ? '90deg' : '0deg' }] }}
              />
              <ThemedText style={[styles.clansDropdownTitle, { color: theme.textMain }]}>
                My clans
              </ThemedText>
            </View>
            <TouchableOpacity
              style={styles.createClanButton}
              onPress={openCreateModal}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={18} color="#fff" />
              <ThemedText style={styles.createClanButtonText}>Create clan</ThemedText>
            </TouchableOpacity>
          </TouchableOpacity>

          {clansDropdownOpen && (
            <View style={styles.clansDropdownContent}>
              {loadingClans ? (
                <View style={styles.clansLoading}>
                  <ActivityIndicator size="small" color="#f97316" />
                  <ThemedText style={[styles.clansLoadingText, { color: theme.textDim }]}>
                    Loading clans…
                  </ThemedText>
                </View>
              ) : clans.length === 0 ? (
                <ThemedText style={[styles.clansEmptyText, { color: theme.textDim }]}>
                  No clans yet. Create one above.
                </ThemedText>
              ) : (
                clans.map((c) => (
                  <View
                    key={c.clan_id}
                    style={[styles.clanRow, { borderTopColor: theme.borderColor }]}
                  >
                    <ThemedText style={[styles.clanRowName, { color: theme.textMain }]} numberOfLines={1}>
                      {c.name}
                    </ThemedText>
                    {(c.tribe || c.house || c.branch) && (
                      <ThemedText style={[styles.clanRowMeta, { color: theme.textDim }]} numberOfLines={1}>
                        {[c.tribe, c.house, c.branch].filter(Boolean).join(' · ')}
                      </ThemedText>
                    )}
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        {/* Izithakazelo teaser (placeholder for full praises card) */}
        <View
          style={[
            styles.glassCard,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconPill}>
              <Feather name="volume-2" size={22} color="#f97316" />
            </View>
            <View>
              <ThemedText style={[styles.cardTitle, { color: theme.textMain }]}>
                Izithakazelo
              </ThemedText>
              <ThemedText style={styles.cardSubtitle}>Recite Your Roots</ThemedText>
            </View>
          </View>
          <ThemedText style={styles.bodyCopy}>
            Soon you&apos;ll be able to pick your clan and have praises recited with Gemini TTS,
            just like on the web Plaza.
          </ThemedText>
        </View>

        {/* Ancestral Wisdom Card */}
        <View
          style={[
            styles.glassCard,
            styles.essentialCardBorder,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <View style={styles.wisdomHeaderRow}>
            <Feather name="shield" size={18} color="#f97316" />
            <ThemedText style={styles.wisdomLabel}>ANCESTRAL WISDOM</ThemedText>
          </View>
          <ThemedText style={[styles.wisdomText, { color: theme.textMain }]}>
            "{wisdom}"
          </ThemedText>
        </View>
      </ScrollView>

      {/* Create Clan modal */}
      <Modal
        visible={showCreateClanModal}
        transparent
        animationType="fade"
        onRequestClose={closeCreateModal}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeCreateModal}
        >
          <TouchableOpacity
            style={[
              styles.createModalCard,
              {
                backgroundColor: theme.panelBg,
                borderColor: theme.borderColor,
              },
            ]}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.createModalHeader}>
              <ThemedText style={[styles.createModalTitle, { color: theme.textMain }]}>
                Create a clan
              </ThemedText>
              <TouchableOpacity onPress={closeCreateModal} hitSlop={12}>
                <Feather name="x" size={24} color={theme.textDim} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.createModalForm} keyboardShouldPersistTaps="handled">
              <View style={styles.createModalField}>
                <ThemedText style={[styles.createModalLabel, { color: theme.textDim }]}>
                  Clan name *
                </ThemedText>
                <TextInput
                  value={createName}
                  onChangeText={setCreateName}
                  placeholder="e.g. Khumalo"
                  placeholderTextColor={theme.textDim}
                  style={[
                    styles.createModalInput,
                    {
                      color: theme.textMain,
                      borderColor: theme.borderColor,
                      backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                    },
                  ]}
                />
              </View>
              <View style={styles.createModalField}>
                <ThemedText style={[styles.createModalLabel, { color: theme.textDim }]}>
                  Tribe *
                </ThemedText>
                <TextInput
                  value={createTribe}
                  onChangeText={setCreateTribe}
                  placeholder="e.g. Zulu, Xhosa"
                  placeholderTextColor={theme.textDim}
                  style={[
                    styles.createModalInput,
                    {
                      color: theme.textMain,
                      borderColor: theme.borderColor,
                      backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                    },
                  ]}
                />
              </View>
              <View style={styles.createModalField}>
                <ThemedText style={[styles.createModalLabel, { color: theme.textDim }]}>
                  House (optional)
                </ThemedText>
                <TextInput
                  value={createHouse}
                  onChangeText={setCreateHouse}
                  placeholder="e.g. Royal House"
                  placeholderTextColor={theme.textDim}
                  style={[
                    styles.createModalInput,
                    {
                      color: theme.textMain,
                      borderColor: theme.borderColor,
                      backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                    },
                  ]}
                />
              </View>
              <View style={styles.createModalField}>
                <ThemedText style={[styles.createModalLabel, { color: theme.textDim }]}>
                  Totem (optional)
                </ThemedText>
                <TextInput
                  value={createTotem}
                  onChangeText={setCreateTotem}
                  placeholder="e.g. animal or symbol"
                  placeholderTextColor={theme.textDim}
                  style={[
                    styles.createModalInput,
                    {
                      color: theme.textMain,
                      borderColor: theme.borderColor,
                      backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                    },
                  ]}
                />
              </View>
              <View style={styles.createModalField}>
                <ThemedText style={[styles.createModalLabel, { color: theme.textDim }]}>
                  Branch (optional)
                </ThemedText>
                <TextInput
                  value={createBranch}
                  onChangeText={setCreateBranch}
                  placeholder="e.g. Ntungwa"
                  placeholderTextColor={theme.textDim}
                  style={[
                    styles.createModalInput,
                    {
                      color: theme.textMain,
                      borderColor: theme.borderColor,
                      backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                    },
                  ]}
                />
              </View>
              <View style={styles.createModalField}>
                <ThemedText style={[styles.createModalLabel, { color: theme.textDim }]}>
                  Regions (optional, comma-separated)
                </ThemedText>
                <TextInput
                  value={createRegion}
                  onChangeText={setCreateRegion}
                  placeholder="e.g. KwaZulu-Natal, Gauteng"
                  placeholderTextColor={theme.textDim}
                  style={[
                    styles.createModalInput,
                    {
                      color: theme.textMain,
                      borderColor: theme.borderColor,
                      backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                    },
                  ]}
                />
              </View>

              {/* Advanced collapsible */}
              <View style={[styles.advancedSection, { borderColor: theme.borderColor }]}>
                <TouchableOpacity
                  style={styles.advancedHeader}
                  onPress={() => setAdvancedSectionOpen((o) => !o)}
                  activeOpacity={0.8}
                >
                  <ThemedText style={[styles.advancedHeaderText, { color: theme.textMain }]}>
                    More
                  </ThemedText>
                  <Feather
                    name="chevron-down"
                    size={20}
                    color={theme.textDim}
                    style={{ transform: [{ rotate: advancedSectionOpen ? '180deg' : '0deg' }] }}
                  />
                </TouchableOpacity>
                {advancedSectionOpen && (
                  <View style={styles.advancedContent}>
                    {[
                      { key: 'clan_praise_name', label: 'Clan praise name' },
                      { key: 'totem_image', label: 'Totem image (URL)' },
                      { key: 'clan_colors', label: 'Clan colors' },
                      { key: 'origin_story', label: 'Origin story' },
                      { key: 'ancestral_territory', label: 'Ancestral territory' },
                      { key: 'current_regions', label: 'Current regions' },
                      { key: 'clan_symbol', label: 'Clan symbol' },
                      { key: 'traditional_leadership', label: 'Traditional leadership' },
                      { key: 'member_count', label: 'Member count' },
                      { key: 'founded_date', label: 'Founded date' },
                      { key: 'cultural_practices', label: 'Cultural practices' },
                      { key: 'ceremonies', label: 'Ceremonies' },
                      { key: 'traditions', label: 'Traditions' },
                      { key: 'praise_poetry', label: 'Praise poetry' },
                      { key: 'clan_history', label: 'Clan history' },
                      { key: 'notable_ancestors', label: 'Notable ancestors' },
                    ].map(({ key, label }) => (
                      <View key={key} style={styles.createModalField}>
                        <ThemedText style={[styles.createModalLabel, { color: theme.textDim }]}>
                          {label} (optional)
                        </ThemedText>
                        <TextInput
                          value={advancedFields[key] ?? ''}
                          onChangeText={(v) => setAdvancedField(key, v)}
                          placeholder={key === 'member_count' ? 'e.g. 100' : `Enter ${label.toLowerCase()}`}
                          placeholderTextColor={theme.textDim}
                          keyboardType={key === 'member_count' ? 'number-pad' : 'default'}
                          multiline={['origin_story', 'clan_history', 'praise_poetry', 'cultural_practices', 'ceremonies', 'traditions'].includes(key)}
                          style={[
                            styles.createModalInput,
                            {
                              color: theme.textMain,
                              borderColor: theme.borderColor,
                              backgroundColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.08)',
                            },
                          ]}
                        />
                      </View>
                    ))}
                  </View>
                )}
              </View>

              {createError ? (
                <ThemedText style={styles.createModalError}>{createError}</ThemedText>
              ) : null}
              <TouchableOpacity
                style={[styles.createModalSubmit, creating && styles.createModalSubmitDisabled]}
                onPress={handleCreateClan}
                disabled={creating}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={[UkhoGradient.start, UkhoGradient.end]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.createModalSubmitGradient}
                >
                  {creating ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <>
                      <Feather name="check" size={18} color="#fff" />
                      <ThemedText style={styles.createModalSubmitText}>Create clan</ThemedText>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[8],
    gap: Spacing[6],
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing[3],
    marginBottom: Spacing[2],
  },
  brandContainer: {
    flex: 1,
  },
  menuContainer: {
    marginLeft: 'auto',
  },
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlyph: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'lowercase',
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '900',
    fontStyle: 'italic',
  },
  brandTagline: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: '#f97316',
  },
  glassCard: {
    borderRadius: BorderRadius['2.5rem'],
    padding: Spacing[5],
    marginVertical: Spacing[2],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  essentialCardBorder: {
    borderBottomWidth: 4,
    borderBottomColor: '#f97316',
  },
  wisdomHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing[2],
  },
  wisdomLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: '#f97316',
  },
  wisdomText: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  iconPill: {
    padding: Spacing[3],
    borderRadius: BorderRadius['2xl'],
    backgroundColor: 'rgba(249, 115, 22, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: '#64748b',
    marginTop: 2,
  },
  inputRow: {
    marginTop: Spacing[2],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.4)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  inputIcon: {
    marginLeft: 4,
  },
  fakeInput: {
    fontSize: Typography.fontSize.base,
    opacity: 0.7,
  },
  searchResultsWrap: {
    marginTop: Spacing[4],
    paddingTop: Spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.3)',
  },
  searchResultsLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[3],
  },
  searchResultsLoadingText: {
    fontSize: Typography.fontSize.sm,
  },
  searchResultsEmpty: {
    fontSize: Typography.fontSize.sm,
    paddingVertical: Spacing[3],
  },
  searchResultsList: {
    maxHeight: 220,
  },
  searchResultRow: {
    paddingVertical: Spacing[2],
    borderTopWidth: 1,
  },
  searchResultName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
  searchResultMeta: {
    fontSize: Typography.fontSize.sm,
    marginTop: 2,
  },
  bodyCopy: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: Spacing[2],
  },
  clansDropdownCard: {
    borderRadius: BorderRadius['2xl'],
    padding: Spacing[4],
    borderWidth: 1,
    marginVertical: Spacing[2],
  },
  clansDropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clansDropdownHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  clansDropdownTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  createClanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[3],
    borderRadius: BorderRadius.xl,
    backgroundColor: '#f97316',
  },
  createClanButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: Typography.letterSpacing.widest,
  },
  clansDropdownContent: {
    marginTop: Spacing[4],
    paddingTop: Spacing[3],
  },
  clansLoading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[4],
  },
  clansLoadingText: {
    fontSize: Typography.fontSize.sm,
  },
  clansEmptyText: {
    fontSize: Typography.fontSize.sm,
    paddingVertical: Spacing[4],
  },
  clanRow: {
    paddingVertical: Spacing[2],
    borderTopWidth: 1,
  },
  clanRowName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
  clanRowMeta: {
    fontSize: Typography.fontSize.sm,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[4],
  },
  createModalCard: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '85%',
    borderRadius: BorderRadius['2.5rem'],
    borderWidth: 1,
    padding: Spacing[5],
  },
  createModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[4],
  },
  createModalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  createModalForm: {
    maxHeight: 480,
  },
  createModalField: {
    marginBottom: Spacing[4],
  },
  createModalLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: Spacing[1],
  },
  createModalInput: {
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    fontSize: Typography.fontSize.base,
  },
  advancedSection: {
    marginTop: Spacing[2],
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  advancedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
  },
  advancedHeaderText: {
    fontSize: 14,
    fontWeight: '800',
  },
  advancedContent: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.3)',
  },
  createModalError: {
    fontSize: Typography.fontSize.sm,
    color: '#dc2626',
    marginBottom: Spacing[2],
  },
  createModalSubmit: {
    marginTop: Spacing[2],
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  createModalSubmitDisabled: {
    opacity: 0.7,
  },
  createModalSubmitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[4],
  },
  createModalSubmitText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: Typography.letterSpacing.widest,
  },
});
