import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
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
import { useBlockedUsers } from '@/context/BlockedUsersContext';

export default function ChatScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; name?: string; avatar?: string }>();
  const id = params.id ?? '';
  const name = params.name ?? 'Elder';
  const avatar = params.avatar ?? '';

  const [message, setMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [messages] = useState<{ id: string; text: string; fromMe: boolean }[]>([]);

  const { addBlockedUser } = useBlockedUsers();

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    setMessage('');
    // Placeholder: in a real app you would append to messages and send to backend
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.borderColor }]}>
          <AnimatedButton onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={22} color={theme.textMain} />
          </AnimatedButton>
          <TouchableOpacity style={styles.headerCenter} activeOpacity={1}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.headerAvatar} />
            ) : (
              <View style={[styles.headerAvatarPlaceholder, { backgroundColor: theme.borderColor }]}>
                <Feather name="user" size={20} color={theme.textDim} />
              </View>
            )}
            <View style={styles.headerTextWrap}>
              <ThemedText
                style={[styles.headerName, { color: theme.textMain }]}
                numberOfLines={1}
              >
                {name}
              </ThemedText>
              <ThemedText style={[styles.headerHint, { color: theme.textDim }]}>
                Verified Elder
              </ThemedText>
            </View>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => setMenuOpen((prev) => !prev)}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <Feather name="more-vertical" size={20} color={theme.textMain} />
            </TouchableOpacity>
          </View>
        </View>

        {menuOpen && (
          <View
            style={[
              styles.menuContainer,
              {
                backgroundColor: theme.panelBg,
                borderColor: theme.borderColor,
              },
            ]}
          >
            {[
              'View contact',
              'Search',
              'Media, links and docs',
              'Mute notifications',
              'Report',
              'Clear chat',
              'Block',
              'Add to favorites',
            ].map((label) => (
              <TouchableOpacity
                key={label}
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (label === 'Block' && id) {
                    addBlockedUser({
                      id,
                      name,
                      avatar: avatar || '',
                      blockType: 'fully_blocked',
                    });
                    setMenuOpen(false);
                    router.push('/blocked');
                    return;
                  }
                  // Placeholder for other menu actions
                  setMenuOpen(false);
                }}
              >
                <ThemedText style={[styles.menuItemText, { color: theme.textMain }]}>
                  {label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Messages */}
        <ScrollView
          style={styles.messagesScroll}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {messages.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Feather name="message-circle" size={40} color={theme.textDim} />
              <ThemedText style={[styles.emptyText, { color: theme.textDim }]}>
                No messages yet. Say hello.
              </ThemedText>
            </View>
          ) : (
            messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.bubbleWrap,
                  m.fromMe ? styles.bubbleWrapMe : styles.bubbleWrapThem,
                ]}
              >
                <View
                  style={[
                    styles.bubble,
                    m.fromMe
                      ? { backgroundColor: BrandColors.orange500 }
                      : { backgroundColor: theme.panelBg, borderColor: theme.borderColor },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.bubbleText,
                      { color: m.fromMe ? '#fff' : theme.textMain },
                    ]}
                  >
                    {m.text}
                  </ThemedText>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        {/* Input */}
        <View
          style={[
            styles.inputRow,
            {
              backgroundColor: theme.panelBg,
              borderTopColor: theme.borderColor,
            },
          ]}
        >
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Message..."
            placeholderTextColor={theme.textDim}
            style={[
              styles.input,
              {
                color: theme.textMain,
                backgroundColor: theme.bgColor,
                borderColor: theme.borderColor,
              },
            ]}
            multiline
            maxLength={500}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={[styles.sendBtn, { backgroundColor: BrandColors.orange500 }]}
            activeOpacity={0.8}
          >
            <Feather name="send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: {
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginLeft: Spacing[2],
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerHint: {
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
    alignItems: 'flex-end',
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContainer: {
    position: 'absolute',
    top: Spacing[4] + 44, // below header
    right: Spacing[4],
    borderRadius: BorderRadius['2xl'],
    borderWidth: 1,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[2],
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    gap: Spacing[1],
  },
  menuItem: {
    paddingVertical: Spacing[1],
    paddingHorizontal: Spacing[2],
  },
  menuItemText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
  },
  messagesScroll: {
    flex: 1,
  },
  messagesContent: {
    padding: Spacing[4],
    paddingBottom: Spacing[6],
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[12],
    gap: Spacing[3],
  },
  emptyText: {
    fontSize: Typography.fontSize.sm,
  },
  bubbleWrap: {
    marginBottom: Spacing[2],
  },
  bubbleWrapMe: {
    alignItems: 'flex-end',
  },
  bubbleWrapThem: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  bubbleText: {
    fontSize: Typography.fontSize.base,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 100,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    fontSize: Typography.fontSize.base,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
