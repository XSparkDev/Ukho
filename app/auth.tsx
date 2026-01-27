import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ScreenContainer } from '@/components/ScreenContainer';
import { useTheme } from '@/constants/Theme';
import { UkhoGradient } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { LinearGradient } from 'expo-linear-gradient';
import { login, register } from '../services/authService';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Toast } from '@/components/Toast';
import { ROUTES } from '@/constants/routes';

type AuthMode = 'login' | 'register';

export default function AuthScreen() {
  const router = useRouter();
  const { isLightMode, theme } = useTheme();
  const [mode, setMode] = useState<AuthMode>('login');
  const [cellNumber, setCellNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastState, setToastState] = useState<{ message: string; color: string } | null>(
    null
  );

  const isRegister = mode === 'register';

  const getToastColor = (code?: string | null) => {
    switch (code) {
      case 'INVALID_CREDENTIALS':
        return '#dc2626'; // red-600
      case 'EMAIL_TAKEN':
        return '#f97316'; // orange-500
      case 'VALIDATION_ERROR':
        return '#eab308'; // yellow-500
      default:
        return '#ef4444'; // red-500 generic error
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (isRegister) {
        await register({ cellNumber, password, fullName, email });
      } else {
        await login({ cellNumber, password });
      }

      router.replace(ROUTES.TABS_ROOT);
    } catch (error) {
      const err: any = error;
      console.warn('Auth error:', err);
      const message =
        (err && typeof err.message === 'string' && err.message) ||
        'Something went wrong. Please try again.';
      const code = err && typeof err.code === 'string' ? err.code : undefined;
      const color = getToastColor(code);

      setToastState({ message, color });
      setTimeout(() => {
        setToastState(null);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer style={styles.root}>
      {/* Tribal Background Elements */}
      <View pointerEvents="none" style={styles.backgroundDecor}>
        <View style={styles.orangeBlurCircle} />
        <View style={styles.purpleBlurCircle} />
        {/* Diagonal lines overlay - simplified */}
        <View style={styles.lineOverlay} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          <View style={styles.cardWrapper}>
            {/* Logo + Title */}
            <View style={styles.header}>
              <LinearGradient
                colors={[UkhoGradient.start, UkhoGradient.end]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <ThemedText style={styles.logoGlyph}>ü</ThemedText>
              </LinearGradient>
              <ThemedText
                type="title"
                style={[
                  styles.brandTitle,
                  { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
                ]}
              >
                UKHO
              </ThemedText>
              <ThemedText
                style={[
                  styles.tagline,
                  { color: '#f97316', letterSpacing: Typography.letterSpacing.widest },
                ]}
              >
                CONNECT YOUR ROOTS
              </ThemedText>
            </View>

            {/* Glass Panel Card */}
            <View
              style={[
                styles.glassCard,
                {
                  backgroundColor: theme.panelBg,
                  borderColor: theme.borderColor,
                },
              ]}
            >
              {/* Toggle */}
              <View style={styles.toggleRow}>
                <ThemedText
                  style={[
                    styles.toggleText,
                    mode === 'login'
                      ? styles.toggleActive
                      : { color: theme.textDim, borderBottomWidth: 0 },
                  ]}
                  onPress={() => setMode('login')}
                >
                  LOGIN
                </ThemedText>
                <ThemedText
                  style={[
                    styles.toggleText,
                    mode === 'register'
                      ? styles.toggleActive
                      : { color: theme.textDim, borderBottomWidth: 0 },
                  ]}
                  onPress={() => setMode('register')}
                >
                  REGISTER
                </ThemedText>
              </View>

              {/* Form */}
              <View style={styles.form}>
                {isRegister && (
                  <View style={styles.registerBlock}>
                    {/* Full Name */}
                    <View style={styles.inputWrapper}>
                      <Feather
                        name="user"
                        size={18}
                        color="rgba(249, 115, 22, 0.6)"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Full Name"
                        placeholderTextColor={theme.textDim}
                        style={[
                          styles.input,
                          {
                            color: theme.textMain,
                            borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                            backgroundColor: isLightMode
                              ? 'rgba(0,0,0,0.05)'
                              : 'rgba(0,0,0,0.2)',
                          },
                        ]}
                      />
                    </View>
                    {/* Email */}
                    <View style={styles.inputWrapper}>
                      <Feather
                        name="mail"
                        size={18}
                        color="rgba(249, 115, 22, 0.6)"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        placeholderTextColor={theme.textDim}
                        keyboardType="email-address"
                        style={[
                          styles.input,
                          {
                            color: theme.textMain,
                            borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                            backgroundColor: isLightMode
                              ? 'rgba(0,0,0,0.05)'
                              : 'rgba(0,0,0,0.2)',
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}

                {/* Cell Number */}
                <View style={styles.inputWrapper}>
                  <Feather
                    name="phone"
                    size={18}
                    color="rgba(249, 115, 22, 0.6)"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={cellNumber}
                    onChangeText={setCellNumber}
                    placeholder="Cell Number"
                    placeholderTextColor={theme.textDim}
                    keyboardType="phone-pad"
                    style={[
                      styles.input,
                      {
                        color: theme.textMain,
                        borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                        backgroundColor: isLightMode
                          ? 'rgba(0,0,0,0.05)'
                          : 'rgba(0,0,0,0.2)',
                      },
                    ]}
                  />
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                  <Feather
                    name="lock"
                    size={18}
                    color="rgba(249, 115, 22, 0.6)"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Secure Key"
                    placeholderTextColor={theme.textDim}
                    secureTextEntry
                    style={[
                      styles.input,
                      {
                        color: theme.textMain,
                        borderColor: isLightMode ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                        backgroundColor: isLightMode
                          ? 'rgba(0,0,0,0.05)'
                          : 'rgba(0,0,0,0.2)',
                      },
                    ]}
                  />
                </View>

                {/* Submit */}
                <LinearGradient
                  colors={[UkhoGradient.start, UkhoGradient.end]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                    styles.submitButton,
                    isSubmitting && { opacity: 0.7 },
                  ]}
                >
                  <ThemedText
                    onPress={isSubmitting ? undefined : handleSubmit}
                    style={styles.submitText}
                  >
                    {isSubmitting
                      ? isRegister
                        ? 'ALIGNING ANCESTRAL LINES...'
                        : 'ASCENDING...'
                      : isRegister
                        ? 'JOIN THE LINEAGE'
                        : 'ASCEND TO PLAZA'}
                  </ThemedText>
                  {isSubmitting ? (
                    <LoadingSpinner size="small" color="#ffffff" />
                  ) : (
                    <Feather name="chevron-right" size={18} color="#fff" />
                  )}
                </LinearGradient>
              </View>

              <ThemedText
                style={[
                  styles.footerNote,
                  {
                    color: theme.textDim,
                    letterSpacing: Typography.letterSpacing.widest,
                  },
                ]}
              >
                POWERED BY THE ANCESTORS & VIBRANIUM TECH
              </ThemedText>
            </View>

            {/* Bottom shield label */}
            <View style={styles.bottomRow}>
              <Feather name="shield" size={16} color="rgba(249, 115, 22, 0.4)" />
              <ThemedText style={styles.bottomText}>ENCRYPTED TRANSMISSIONS</ThemedText>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {toastState && (
        <Toast message={toastState.message} backgroundColor={toastState.color} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    position: 'relative',
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.15,
  },
  orangeBlurCircle: {
    position: 'absolute',
    top: '-10%',
    left: '-10%',
    width: '40%',
    height: '40%',
    borderWidth: 20,
    borderColor: '#f97316',
    borderRadius: 9999,
  },
  purpleBlurCircle: {
    position: 'absolute',
    bottom: '-10%',
    right: '-10%',
    width: '40%',
    height: '40%',
    borderWidth: 20,
    borderColor: '#a855f7',
    borderRadius: 9999,
  },
  lineOverlay: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing[4],
    justifyContent: 'center',
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing[6],
  },
  logoGradient: {
    width: 112,
    height: 112,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  logoGlyph: {
    fontSize: 52,
    color: '#fff',
    fontWeight: '900',
    textTransform: 'lowercase',
  },
  brandTitle: {
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontStyle: 'italic',
  },
  tagline: {
    marginTop: 8,
    fontSize: 10,
    fontWeight: '900',
  },
  glassCard: {
    borderRadius: BorderRadius['3rem'],
    padding: Spacing[6],
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: Spacing[6],
  },
  toggleText: {
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    paddingBottom: 8,
    paddingHorizontal: 12,
    letterSpacing: Typography.letterSpacing.widest,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  toggleActive: {
    color: '#f97316',
    borderBottomColor: '#f97316',
  },
  form: {
    gap: Spacing[4],
  },
  registerBlock: {
    marginBottom: Spacing[2],
    gap: Spacing[4],
  },
  inputWrapper: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 16,
    top: '50%',
    marginTop: -9,
  },
  input: {
    paddingVertical: Spacing[4],
    paddingHorizontal: 16 + 16, // left icon
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    fontSize: Typography.fontSize.base,
  },
  submitButton: {
    marginTop: Spacing[4],
    borderRadius: BorderRadius['2.5rem'],
    paddingVertical: Spacing[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#f97316',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  submitText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: Typography.letterSpacing.widest,
  },
  footerNote: {
    marginTop: Spacing[6],
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
    opacity: 0.6,
  },
  bottomRow: {
    marginTop: Spacing[6],
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  bottomText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: 'rgba(249, 115, 22, 0.6)',
  },
});



