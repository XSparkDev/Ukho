import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { ScreenContainer } from '@/components/ScreenContainer';
import { ThemedText } from '@/components/themed-text';
import { BrandColors } from '@/constants/Colors';
import { BorderRadius, CardStyles, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();

  const [notificationSettings, setNotificationSettings] = useState({
    messages: true,
    connectRequests: true,
    clanActivity: true,
    eventReminders: false,
  });

  const notificationOptions = [
    {
      id: 'messages',
      title: 'Messages',
      icon: 'message-circle',
      description: 'Get notified when you receive new messages',
      value: notificationSettings.messages,
      onToggle: (value: boolean) => {
        setNotificationSettings((prev) => ({ ...prev, messages: value }));
        console.log('Messages notifications:', value);
      },
    },
    {
      id: 'connect-requests',
      title: 'Connect Requests',
      icon: 'user-plus',
      description: 'Alert when someone sends you a connection request',
      value: notificationSettings.connectRequests,
      onToggle: (value: boolean) => {
        setNotificationSettings((prev) => ({ ...prev, connectRequests: value }));
        console.log('Connect requests notifications:', value);
      },
    },
    {
      id: 'clan-activity',
      title: 'Clan Activity',
      icon: 'users',
      description: 'Updates about your clan and community events',
      value: notificationSettings.clanActivity,
      onToggle: (value: boolean) => {
        setNotificationSettings((prev) => ({ ...prev, clanActivity: value }));
        console.log('Clan activity notifications:', value);
      },
    },
    {
      id: 'event-reminders',
      title: 'Event Reminders',
      icon: 'calendar',
      description: 'Reminders for upcoming ceremonies and gatherings',
      value: notificationSettings.eventReminders,
      onToggle: (value: boolean) => {
        setNotificationSettings((prev) => ({ ...prev, eventReminders: value }));
        console.log('Event reminders notifications:', value);
      },
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
            <Feather name="bell" size={18} color="#fff" />
          </View>
          <View style={styles.headerContent}>
            <ThemedText
              style={[
                styles.title,
                { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
              ]}
            >
              Notifications
            </ThemedText>
            <ThemedText style={[styles.subtitle, { color: theme.textDim }]}>
              Control your notification preferences
            </ThemedText>
          </View>
        </View>

        <View style={styles.optionsList}>
          {notificationOptions.map((option) => (
            <View
              key={option.id}
              style={[
                CardStyles.base,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              <View style={styles.optionHeader}>
                <View style={styles.optionIcon}>
                  <Feather name={option.icon as any} size={20} color={BrandColors.orange500} />
                </View>
                <View style={styles.optionContent}>
                  <ThemedText style={[styles.optionTitle, { color: theme.textMain }]}>
                    {option.title}
                  </ThemedText>
                  <ThemedText style={[styles.optionDescription, { color: theme.textDim }]}>
                    {option.description}
                  </ThemedText>
                </View>
                <Switch
                  value={option.value}
                  onValueChange={option.onToggle}
                  trackColor={{
                    false: 'rgba(148, 163, 184, 0.3)',
                    true: 'rgba(249, 115, 22, 0.5)',
                  }}
                  thumbColor={option.value ? BrandColors.orange500 : '#f4f3f4'}
                  ios_backgroundColor="rgba(148, 163, 184, 0.3)"
                />
              </View>
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
});

