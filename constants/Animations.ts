/**
 * Ukho Motion System
 * Sacred, modern, and spontaneous animations
 * Theme: Animations should feel like breath, not bounce
 */

import { Easing } from 'react-native';

// Animation Durations
export const AnimationDurations = {
  fast: 200,
  normal: 300,
  slow: 400,
  screenTransition: 300, // 250-350ms range, using 300ms
};

// Easing Functions
export const AnimationEasing = {
  // Smooth, breath-like easing
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1), // Material Design standard
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  // Spring-like but controlled
  gentle: Easing.bezier(0.25, 0.1, 0.25, 1),
};

// Card Press Animation Values
export const CardPressAnimations = {
  scale: {
    pressed: 0.97,
    normal: 1,
  },
  shadow: {
    pressed: {
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    normal: {
      shadowOpacity: 0.08,
      shadowRadius: 20,
    },
  },
};

// Screen Transition Config
export const ScreenTransitionConfig = {
  duration: AnimationDurations.screenTransition,
  easing: AnimationEasing.easeInOut,
  slideDistance: 20, // pixels
};

// Carousel Animation Config
export const CarouselAnimations = {
  snapVelocity: 0.3,
  snapDamping: 0.8,
  focusedScale: 1.02,
  unfocusedScale: 0.98,
};

