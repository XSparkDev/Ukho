/**
 * AnimatedCarousel Component
 * Horizontal carousel with momentum, snap behavior, and scale effects
 * Theme: Gentle, breath-like motion
 */

import React, { useRef, useState } from 'react';
import { Animated, FlatList, FlatListProps, ViewToken } from 'react-native';
import { CarouselAnimations } from '@/constants/Animations';

interface AnimatedCarouselProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  renderItem: (info: { item: T; index: number; isFocused: boolean }) => React.ReactElement;
  itemWidth?: number;
}

export function AnimatedCarousel<T>({
  renderItem,
  itemWidth = 200,
  ...flatListProps
}: AnimatedCarouselProps<T>) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        const index = viewableItems[0].index ?? 0;
        setFocusedIndex(index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <FlatList
      {...flatListProps}
      horizontal
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      snapToInterval={itemWidth}
      snapToAlignment="start"
      decelerationRate="fast"
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      renderItem={({ item, index }) => {
        const isFocused = index === focusedIndex;
        const inputRange = [
          (index - 1) * itemWidth,
          index * itemWidth,
          (index + 1) * itemWidth,
        ];

        const scale = scrollX.interpolate({
          inputRange,
          outputRange: [
            CarouselAnimations.unfocusedScale,
            isFocused ? CarouselAnimations.focusedScale : 1,
            CarouselAnimations.unfocusedScale,
          ],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            style={{
              transform: [{ scale }],
            }}
          >
            {renderItem({ item, index, isFocused })}
          </Animated.View>
        );
      }}
    />
  );
}

