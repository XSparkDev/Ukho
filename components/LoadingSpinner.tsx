import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

type LoadingSpinnerProps = {
  size?: 'small' | 'large' | number;
  color?: string;
};

export function LoadingSpinner({ size = 'small', color = '#ffffff' }: LoadingSpinnerProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

