import React, { useRef } from 'react';
import {
  Animated,
  StyleProp,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

type AnimatedCardProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

/**
 * AnimatedCard
 *
 * Simple reusable card wrapper with a subtle press animation.
 * Matches the card usage patterns in account and other screens.
 */
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  style,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 0,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={[
          {
            transform: [{ scale }],
          },
          style,
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

