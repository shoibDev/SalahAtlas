import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, { LinearTransition } from 'react-native-reanimated';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useTheme } from '@/context/ThemeContext';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ICONS: Record<string, React.ComponentProps<typeof FontAwesome>['name']> = {
  compass: 'compass',
  index: 'home',
  settings: 'cog',
};

const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, navigation }) => {
  const theme = useTheme();

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

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
                    {
                      backgroundColor: isFocused ? theme.accent : 'transparent',
                    },
                  ]}
              >
                <FontAwesome
                    name={ICONS[route.name] ?? 'circle'}
                    size={24}
                    color={isFocused ? theme.surface : theme.textSecondary}
                />
                {isFocused && (
                    <Text style={[styles.label, { color: theme.surface }]}>
                      {route.name}
                    </Text>
                )}
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
    marginLeft: 8,
    fontSize: 14,
    textTransform: 'capitalize',
  },
});

export default CustomNavBar;
