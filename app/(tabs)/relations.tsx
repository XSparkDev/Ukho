import React from 'react';
import { Image, ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/constants/Theme';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';

type Relation = {
  id: string;
  name: string;
  role: string;
  clan: string;
  avatar: string;
};

const RELATIONS: Relation[] = [
  {
    id: 'r1',
    name: 'Baba Mthimkhulu',
    role: 'Chief Elder',
    clan: 'Khumalo',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'r2',
    name: 'Gogo Dlamini',
    role: 'Genealogist',
    clan: 'Dlamini',
    avatar:
      'https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01?auto=format&fit=crop&q=80&w=150&h=150',
  },
  {
    id: 'r3',
    name: 'Nkosi Zwelithini',
    role: 'Traditional Council',
    clan: 'Zulu',
    avatar:
      'https://images.unsplash.com/photo-1507152832244-10d557b33b75?auto=format&fit=crop&q=80&w=150&h=150',
  },
];

export default function RelationsScreen() {
  const { theme } = useTheme();

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.panelBg,
              borderColor: theme.borderColor,
            },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <ThemedText style={[styles.title, { color: theme.textMain }]}>
                CLAN RELATIONS
              </ThemedText>
              <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
                Verified Representatives
              </ThemedText>
            </View>
            <Feather name="shield" size={22} color="#10b981" />
          </View>

          <View style={styles.list}>
            {RELATIONS.map((relation) => (
              <View
                key={relation.id}
                style={[
                  styles.row,
                  {
                    backgroundColor: theme.bgColor,
                    borderColor: theme.borderColor,
                  },
                ]}
              >
                <View style={styles.avatarWrapper}>
                  <Image source={{ uri: relation.avatar }} style={styles.avatar} />
                </View>
                <View style={styles.meta}>
                  <View style={styles.nameRow}>
                    <ThemedText
                      style={[styles.name, { color: theme.textMain }]}
                      numberOfLines={1}
                    >
                      {relation.name}
                    </ThemedText>
                    <Feather name="shield" size={14} color="#10b981" />
                  </View>
                  <ThemedText style={[styles.role, { color: theme.textDim }]} numberOfLines={1}>
                    {relation.role} • {relation.clan}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={styles.messageButton}
                  activeOpacity={0.8}
                  onPress={() => {}}
                >
                  <Feather name="message-square" size={18} color="#f97316" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.footerButton,
              {
                backgroundColor: theme.bgColor,
                borderColor: theme.borderColor,
              },
            ]}
            activeOpacity={0.85}
            onPress={() => {}}
          >
            <ThemedText style={[styles.footerText, { color: theme.textMain }]}>
              VIEW ALL RELATIONS
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: Spacing[4],
    paddingBottom: Spacing[8],
  },
  card: {
    borderRadius: BorderRadius['2.5rem'],
    padding: Spacing[5],
    borderWidth: 1,
    gap: Spacing[4],
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
  },
  subtitle: {
    marginTop: Spacing[1],
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    gap: Spacing[3],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing[4],
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    gap: Spacing[3],
  },
  avatarWrapper: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: BorderRadius['2xl'],
  },
  meta: {
    flex: 1,
    gap: Spacing[1],
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  role: {
    fontSize: 13,
    fontWeight: '600',
  },
  messageButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
  },
  footerButton: {
    marginTop: Spacing[2],
    borderRadius: BorderRadius['2.5rem'],
    paddingVertical: Spacing[4],
    alignItems: 'center',
    borderWidth: 1,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: Typography.letterSpacing.widest,
  },
});

