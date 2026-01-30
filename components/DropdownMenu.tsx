import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    Modal,
    Pressable,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { BrandColors, UkhoGradient } from '@/constants/Colors';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';
import { useTheme } from '@/constants/Theme';

interface MenuItem {
  id: string;
  label: string;
  icon: keyof typeof Feather.glyphMap;
  route?: string;
  onPress?: () => void;
}

interface DropdownMenuProps {
  currentRoute?: string;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ currentRoute = 'index' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(10)).current;
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [pressedItem, setPressedItem] = useState<string | null>(null);
  const { theme, isLightMode, toggleTheme } = useTheme();
  const router = useRouter();

  const menuItems: MenuItem[] = [
    {
      id: 'plaza',
      label: 'Plaza',
      icon: 'home',
      route: '/(tabs)',
    },
    {
      id: 'contacts',
      label: 'Contacts',
      icon: 'users',
      route: '/(tabs)/explore',
    },
    {
      id: 'relations',
      label: 'Connect',
      icon: 'message-circle',
      route: '/(tabs)/relations',
    },
    {
      id: 'community',
      label: 'Community',
      icon: 'message-circle',
      route: '/(tabs)/community',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'settings',
      route: '/settings',
    },
    // Temporarily hidden - can be restored when ready
    // {
    //   id: 'isibongo',
    //   label: 'Isibongo',
    //   icon: 'book-open',
    //   onPress: () => {
    //     // Placeholder for future Isibongo screen
    //     console.log('Isibongo - Coming soon');
    //   },
    // },
  ];

  const handleMenuToggle = () => {
    if (isOpen) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 10,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => setIsOpen(false));
    } else {
      setIsOpen(true);
      translateAnim.setValue(10);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleMenuItemPress = (item: MenuItem) => {
    if (item.route) {
      router.push(item.route as any);
    } else if (item.onPress) {
      item.onPress();
    }
    handleMenuToggle();
  };

  const handleExit = () => {
    router.replace('/auth');
    handleMenuToggle();
  };

  const isActive = (itemId: string) => {
    if (itemId === 'plaza' && currentRoute === 'index') return true;
    if (itemId === 'contacts' && currentRoute === 'explore') return true;
    if (itemId === 'relations' && currentRoute === 'relations') return true;
    if (itemId === 'community' && currentRoute === 'community') return true;
    if (itemId === 'settings' && currentRoute === 'settings') return true;
    return false;
  };

  return (
    <>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        onPress={handleMenuToggle}
        onPressIn={() => setIsButtonPressed(true)}
        onPressOut={() => setIsButtonPressed(false)}
        style={[
          styles.menuButton,
          {
            backgroundColor: isButtonPressed
              ? isLightMode
                ? 'rgba(0,0,0,0.08)'
                : 'rgba(255,255,255,0.15)'
              : theme.panelBg,
            borderColor: theme.borderColor,
          },
        ]}
        activeOpacity={0.7}
      >
        <Feather
          name="menu"
          size={20}
          color={theme.textMain}
        />
      </TouchableOpacity>

      {/* Dropdown Menu Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleMenuToggle}
      >
        <Pressable style={styles.modalOverlay} onPress={handleMenuToggle}>
          <Animated.View
            style={[
              styles.menuContainer,
              {
                opacity: fadeAnim,
                backgroundColor: theme.panelBg,
                transform: [{ translateY: translateAnim }],
              },
            ]}
            onStartShouldSetResponder={() => true}
          >
            {/* Blur Background Effect */}
            <BlurView
              intensity={20}
              tint={isLightMode ? 'light' : 'dark'}
              style={StyleSheet.absoluteFill}
            />

            {/* Close Button */}
            <TouchableOpacity
              onPress={handleMenuToggle}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={24} color={theme.textMain} />
            </TouchableOpacity>

            {/* Logo Section */}
            <View style={styles.logoSection}>
              <LinearGradient
                colors={[UkhoGradient.start, UkhoGradient.end]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.logoGradient}
              >
                <ThemedText style={styles.logoGlyph}>ü</ThemedText>
              </LinearGradient>
              <ThemedText
                style={[
                  styles.networkTitle,
                  { color: theme.textMain, fontFamily: Typography.spaceGrotesk },
                ]}
              >
                Ukho Network
              </ThemedText>
              <ThemedText style={styles.tagline}>CONNECT YOUR ROOTS</ThemedText>
            </View>

            {/* Menu Items */}
            <View style={styles.menuItems}>
              {menuItems.map((item) => {
                const active = isActive(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => handleMenuItemPress(item)}
                    onPressIn={() => setPressedItem(item.id)}
                    onPressOut={() => setPressedItem(null)}
                    style={[
                      styles.menuItem,
                      active && {
                        backgroundColor: BrandColors.orange500,
                        borderRadius: BorderRadius.xl,
                      },
                      !active &&
                        pressedItem === item.id && {
                          backgroundColor: isLightMode
                            ? 'rgba(0,0,0,0.05)'
                            : 'rgba(255,255,255,0.08)',
                      },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Feather
                      name={item.icon}
                      size={20}
                      color={active ? '#fff' : theme.textMain}
                    />
                    <ThemedText
                      style={[
                        styles.menuItemText,
                        {
                          color: active ? '#fff' : theme.textMain,
                          fontWeight: active ? '700' : '500',
                        },
                      ]}
                    >
                      {item.label}
                    </ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Footer Buttons */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={toggleTheme}
                style={[
                  styles.footerButton,
                  {
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderColor,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Feather
                  name={isLightMode ? 'moon' : 'sun'}
                  size={18}
                  color={BrandColors.orange500}
                />
                <ThemedText
                  style={[styles.footerButtonText, { color: BrandColors.orange500 }]}
                >
                  {isLightMode ? 'Dark' : 'Light'}
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleExit}
                style={[
                  styles.footerButton,
                  {
                    backgroundColor: theme.panelBg,
                    borderColor: theme.borderColor,
                  },
                ]}
                activeOpacity={0.7}
              >
                <Feather name="log-out" size={18} color={BrandColors.red500} />
                <ThemedText
                  style={[styles.footerButtonText, { color: BrandColors.red500 }]}
                >
                  Log Out
                </ThemedText>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  menuButton: {
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
    elevation: 5, // Android shadow
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: BorderRadius['2.5rem'],
    padding: Spacing[6],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 40,
    elevation: 20,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: Spacing[4],
    right: Spacing[4],
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: Spacing[4],
    marginBottom: Spacing[8],
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  logoGlyph: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    textTransform: 'lowercase',
  },
  networkTitle: {
    fontSize: 24,
    fontWeight: '900',
    fontStyle: 'italic',
    marginBottom: Spacing[1],
  },
  tagline: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: Typography.letterSpacing.widest,
    color: BrandColors.orange500,
  },
  menuItems: {
    gap: Spacing[2],
    marginBottom: Spacing[6],
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    borderRadius: BorderRadius.xl,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    gap: Spacing[3],
    marginTop: Spacing[4],
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing[2],
    paddingVertical: Spacing[4],
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
  },
  footerButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
});

