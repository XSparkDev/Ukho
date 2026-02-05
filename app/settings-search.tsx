import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { AnimatedButton } from '@/components/AnimatedButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

const RECENT_SEARCHES_KEY = '@ukho_settings_recent_searches';
const MAX_RECENT = 10;

const SUGGESTIONS = [
  '#Account',
  '#Preferences',
  '#Notifications',
  '#Privacy',
  '#About',
  '#Security',
  '#Display',
  '#Language',
  '#Theme',
];

export default function SettingsSearchScreen() {
  const { theme, isLightMode } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const loadRecent = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecentSearches(parsed.slice(0, MAX_RECENT));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadRecent();
  }, [loadRecent]);

  const addToRecent = useCallback(
    (term: string) => {
      const trimmed = term.trim().toLowerCase();
      if (!trimmed) return;
      setRecentSearches((prev) => {
        const next = [trimmed, ...prev.filter((t) => t !== trimmed)].slice(0, MAX_RECENT);
        AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const removeRecent = useCallback(
    (term: string) => {
      setRecentSearches((prev) => {
        const next = prev.filter((t) => t !== term);
        AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    []
  );

  const clearAllRecent = useCallback(() => {
    setRecentSearches([]);
    AsyncStorage.removeItem(RECENT_SEARCHES_KEY).catch(() => {});
  }, []);

  const handleSubmit = useCallback(() => {
    addToRecent(query);
    setQuery('');
    // Optionally navigate to a results screen or filter; for now just add to recent
  }, [query, addToRecent]);

  const handleSuggestionPress = useCallback(
    (label: string) => {
      const term = label.replace(/^#/, '');
      setQuery(term);
      addToRecent(term);
    },
    [addToRecent]
  );

  const handleRecentPress = useCallback((term: string) => {
    setQuery(term);
  }, []);

  const chipBg = isLightMode ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.08)';

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={[styles.headerRow, { borderBottomColor: theme.borderColor }]}>
          <AnimatedButton onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={theme.textMain} />
          </AnimatedButton>
          <View style={styles.headerCenter}>
            <ThemedText
              style={[styles.headerTitle, { color: theme.textMain, fontFamily: Typography.spaceGrotesk }]}
            >
              Search
            </ThemedText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.headerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="mic" size={20} color={theme.textMain} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {}}
              style={styles.headerIconBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="more-vertical" size={20} color={theme.textMain} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search input */}
        <View
          style={[
            styles.searchInputWrap,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <Feather name="search" size={18} color={theme.textDim} style={styles.searchInputIcon} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search settings..."
            placeholderTextColor={theme.textDim}
            onSubmitEditing={handleSubmit}
            returnKeyType="search"
            style={[styles.searchInput, { color: theme.textMain }]}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearInputBtn} hitSlop={8}>
              <Feather name="x" size={18} color={theme.textDim} />
            </TouchableOpacity>
          )}
        </View>

        {/* Content panel (rounded top, slightly elevated) */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Recent searches */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ThemedText style={[styles.sectionTitle, { color: theme.textDim }]}>
                Recent searches
              </ThemedText>
              {recentSearches.length > 0 && (
                <TouchableOpacity onPress={clearAllRecent} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <ThemedText style={styles.clearAllText}>Clear all</ThemedText>
                </TouchableOpacity>
              )}
            </View>
            {recentSearches.length === 0 ? (
              <ThemedText style={[styles.emptyHint, { color: theme.textDim }]}>
                No recent searches
              </ThemedText>
            ) : (
              <View style={styles.chipRow}>
                {recentSearches.map((term) => (
                  <View
                    key={term}
                    style={[styles.recentChip, { backgroundColor: chipBg, borderColor: theme.borderColor }]}
                  >
                    <TouchableOpacity
                      onPress={() => handleRecentPress(term)}
                      style={styles.recentChipTextWrap}
                      activeOpacity={0.7}
                    >
                      <ThemedText style={[styles.recentChipText, { color: theme.textMain }]} numberOfLines={1}>
                        {term}
                      </ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeRecent(term)}
                      style={styles.recentChipRemove}
                      hitSlop={6}
                    >
                      <Feather name="x" size={14} color={theme.textDim} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Suggestions */}
          <View style={styles.section}>
            <ThemedText style={[styles.sectionTitle, { color: theme.textDim }]}>
              Suggestions
            </ThemedText>
            <View style={styles.chipRow}>
              {SUGGESTIONS.map((label) => (
                <TouchableOpacity
                  key={label}
                  onPress={() => handleSuggestionPress(label)}
                  style={[styles.suggestionChip, { borderColor: BrandColors.orange500 }]}
                  activeOpacity={0.7}
                >
                  <ThemedText style={styles.suggestionChipText} numberOfLines={1}>
                    {label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    minWidth: 80,
    justifyContent: 'flex-end',
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Spacing[4],
    marginTop: Spacing[4],
    marginBottom: Spacing[2],
    paddingHorizontal: Spacing[4],
    height: 48,
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  searchInputIcon: {
    marginRight: Spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    paddingVertical: Spacing[2],
    paddingHorizontal: 0,
  },
  clearInputBtn: {
    padding: Spacing[1],
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[6],
    paddingBottom: Spacing[10],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  section: {
    marginBottom: Spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  clearAllText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: BrandColors.orange500,
  },
  emptyHint: {
    fontSize: Typography.fontSize.sm,
    fontStyle: 'italic',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[2],
    paddingLeft: Spacing[3],
    paddingRight: Spacing[1],
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    maxWidth: '100%',
  },
  recentChipTextWrap: {
    maxWidth: 160,
  },
  recentChipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  recentChipRemove: {
    padding: Spacing[1],
    marginLeft: Spacing[1],
  },
  suggestionChip: {
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.full,
    borderWidth: 1.5,
  },
  suggestionChipText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: BrandColors.orange500,
  },
});
