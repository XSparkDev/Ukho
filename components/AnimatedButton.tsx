import React, { useRef } from 'react';
import {
    Animated,
    Pressable,
    StyleProp,
    ViewStyle,
} from 'react-native';

type AnimatedButtonProps = {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const SCALE_PRESSED = 1.05;
const LIFT_PRESSED = -4;
const DURATION = 150;

/**
 * Unified button with hover/press feedback: slightly bigger + floating lift.
 * Use for all primary buttons across the app.
 */
export function AnimatedButton({
  children,
  onPress,
  style,
  disabled = false,
}: AnimatedButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.parallel([
      Animated.timing(scale, {
        toValue: SCALE_PRESSED,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: LIFT_PRESSED,
        duration: DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={({ pressed }) => [{ opacity: disabled ? 0.6 : pressed ? 1 : 1 }]}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [
              { scale },
              { translateY },
            ],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
