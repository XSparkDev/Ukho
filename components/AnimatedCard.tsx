/**
 * AnimatedCard Component
 * Provides press feedback with scale and shadow animation
 * Theme: Breath-like, not bouncy
 */

import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';
import { CardPressAnimations, AnimationDurations, AnimationEasing } from '@/constants/Animations';

interface AnimatedCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  onPress,
  style,
  disabled = false,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shadowOpacityAnim = useRef(new Animated.Value(0.08)).current;
  const shadowRadiusAnim = useRef(new Animated.Value(20)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: CardPressAnimations.scale.pressed,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: CardPressAnimations.shadow.pressed.shadowOpacity,
        duration: AnimationDurations.fast,
        easing: AnimationEasing.easeOut,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadiusAnim, {
        toValue: CardPressAnimations.shadow.pressed.shadowRadius,
        duration: AnimationDurations.fast,
        easing: AnimationEasing.easeOut,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: CardPressAnimations.scale.normal,
        useNativeDriver: true,
        tension: 300,
        friction: 20,
      }),
      Animated.timing(shadowOpacityAnim, {
        toValue: CardPressAnimations.shadow.normal.shadowOpacity,
        duration: AnimationDurations.fast,
        easing: AnimationEasing.easeIn,
        useNativeDriver: false,
      }),
      Animated.timing(shadowRadiusAnim, {
        toValue: CardPressAnimations.shadow.normal.shadowRadius,
        duration: AnimationDurations.fast,
        easing: AnimationEasing.easeIn,
        useNativeDriver: false,
      }),
    ]).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleAnim }],
            shadowOpacity: shadowOpacityAnim,
            shadowRadius: shadowRadiusAnim,
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
};

