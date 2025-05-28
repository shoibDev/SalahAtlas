import React, { useRef } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

interface ScrollWheelProps {
  data: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS_BEFORE_AFTER = 2;

export const ScrollWheel = ({ data, selectedValue, onSelect }: ScrollWheelProps) => {
  const flatListRef = useRef<FlatList>(null);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
    const newValue = data[clampedIndex];

    if (newValue !== selectedValue) {
      onSelect(newValue);
    }

    // Snap scroll back to exact position
    flatListRef.current?.scrollToIndex({ index: clampedIndex, animated: true });
  };

  return (
      <View style={styles.container}>
        <FlatList
            ref={flatListRef}
            data={data}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            snapToAlignment="center"
            decelerationRate="fast"
            snapToInterval={ITEM_HEIGHT}
            onMomentumScrollEnd={handleScrollEnd}
            style={styles.list}
            contentContainerStyle={{
              paddingVertical: ITEM_HEIGHT * VISIBLE_ITEMS_BEFORE_AFTER,
            }}
            renderItem={({ item }) => (
                <TouchableOpacity onPress={() => onSelect(item)}>
                  <View style={[styles.item, selectedValue === item && styles.selected]}>
                    <Text style={[styles.text, selectedValue === item && styles.selectedText]}>
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
            )}
            getItemLayout={(_, index) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * index,
              index,
            })}
            initialScrollIndex={Math.max(data.indexOf(selectedValue), 0)}
        />
        <View style={styles.overlayLineTop} pointerEvents="none" />
        <View style={styles.overlayLineBottom} pointerEvents="none" />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT * (VISIBLE_ITEMS_BEFORE_AFTER * 2 + 1),
    width: 80,
    position: 'relative',
  },
  list: {
    flexGrow: 0,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selected: {
    transform: [{ scale: 1.2 }],
  },
  text: {
    fontSize: 18,
    color: '#999',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '700',
  },
  overlayLineTop: {
    position: 'absolute',
    top: ITEM_HEIGHT * VISIBLE_ITEMS_BEFORE_AFTER,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#666',
    opacity: 0.3,
  },
  overlayLineBottom: {
    position: 'absolute',
    top: ITEM_HEIGHT * (VISIBLE_ITEMS_BEFORE_AFTER + 1),
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#666',
    opacity: 0.3,
  },
});
