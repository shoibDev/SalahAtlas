import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { LinearTransition } from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY = '#1f2937';
const SECONDARY = '#133383';

const ICONS: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
  compass: 'compass',
  index: 'home',
  settings: 'cog',
};

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  return (
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const iconColor = isFocused ? PRIMARY : SECONDARY;

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
              <AnimatedTouchable
                  key={route.key}
                  onPress={onPress}
                  layout={LinearTransition.springify()}
                  style={[
                    styles.tabItem,
                    { backgroundColor: isFocused ? SECONDARY : 'transparent' },
                  ]}
              >
                <FontAwesome
                    name={ICONS[route.name] ?? 'circle'}
                    size={24}
                    color={iconColor}
                />
                {isFocused && <Text style={styles.label}>{route.name}</Text>}
              </AnimatedTouchable>
          );
        })}
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PRIMARY,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingHorizontal: 25,
    borderRadius: 30,
  },
  label: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

export default CustomNavBar;
