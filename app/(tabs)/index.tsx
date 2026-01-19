import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/constants/Theme';
import { UkhoGradient } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { getAncestralWisdom } from '@/services/geminiService';

export default function PlazaScreen() {
  const { theme } = useTheme();
  const [wisdom, setWisdom] = useState('Connecting to the roots...');

  useEffect(() => {
    (async () => {
      const text = await getAncestralWisdom();
      setWisdom(text || 'Umuntu ngumuntu ngabantu.');
    })();
  }, []);

  return (
    <ThemedView style={[styles.screen, { backgroundColor: theme.bgColor }]}>
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
          <View>
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
        </View>

        {/* Ancestral Wisdom Card */}
        <View
          style={[
            styles.glassCard,
            styles.wisdomCard,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <View style={styles.wisdomTopBar} />
          <View style={styles.wisdomHeaderRow}>
            <Feather name="shield" size={18} color="#f97316" />
            <ThemedText style={styles.wisdomLabel}>ANCESTRAL WISDOM</ThemedText>
          </View>
          <ThemedText style={[styles.wisdomText, { color: theme.textMain }]}>
            “{wisdom}”
          </ThemedText>
        </View>

        {/* Clan Search Card (simplified first pass) */}
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
            <ThemedText style={[styles.fakeInput, { color: theme.textDim }]}>
              Enter surname or clan name...
            </ThemedText>
          </View>
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
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
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
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  wisdomCard: {
    borderBottomWidth: 4,
    borderBottomColor: '#f97316',
    position: 'relative',
    overflow: 'hidden',
  },
  wisdomTopBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#f97316',
    opacity: 0.3,
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
  bodyCopy: {
    fontSize: 13,
    opacity: 0.8,
    marginTop: Spacing[2],
  },
});
