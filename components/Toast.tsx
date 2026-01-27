import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle, Easing } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing, Typography } from '@/constants/Styles';

type ToastProps = {
  message: string;
  backgroundColor: string;
  style?: ViewStyle;
};

export function Toast({ message, backgroundColor, style }: ToastProps) {
  const translateY = useRef(new Animated.Value(-80)).current;
  const translateX = useRef(new Animated.Value(40)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(translateX, {
      toValue: 0,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [translateY, translateX, opacity]);

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor },
        style,
        {
          transform: [{ translateY }, { translateX }],
          opacity,
        },
      ]}
    >
      <ThemedText style={styles.text}>{message}</ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Spacing[6],
    right: Spacing[4],
    maxWidth: '80%',
    paddingVertical: Spacing[3],
    paddingHorizontal: Spacing[4],
    borderRadius: BorderRadius['2.5rem'],
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: Typography.letterSpacing.widest,
    textTransform: 'uppercase',
  },
});

