import {View, StyleSheet, TouchableOpacity} from 'react-native';
import { useLinkBuilder, useTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Animated, {FadeIn, LinearTransition} from "react-native-reanimated";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const PRIMARY_COLOUR = '#1f2937';
const SECONDARY_COLOUR = '#133383';


const CustomNavBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const { colors } = useTheme();
  const { buildHref } = useLinkBuilder();

  return (
      <View style={styles.container}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
              options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                      ? options.title
                      : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          return (
              <AnimatedTouchableOpacity
                  layout={LinearTransition.springify()}
                  key={route.key}
                  onPress={onPress}
                  style={[styles.tabItem, {backgroundColor: isFocused ? SECONDARY_COLOUR : 'transparent'}]}
              >
                {getTabBarIcon(route.name, isFocused ? PRIMARY_COLOUR : SECONDARY_COLOUR)}
                {isFocused && (
                  <Animated.Text
                      style={styles.text}
                  >
                    {label as string}
                  </Animated.Text>
                )}
              </AnimatedTouchableOpacity>
          );
        })}
      </View>
  );

  function getTabBarIcon(routeName: string, colour: string) {
    let iconName: React.ComponentProps<typeof FontAwesome>['name'];

    switch (routeName) {
      case 'compass':
        iconName = 'compass';
        break;
      case 'dashboard':
        iconName = 'home';
        break;
      case 'settings':
        iconName = 'cog';
        break;
      default:
        iconName = 'circle';
    }
    return <FontAwesome name={iconName} size={24} color={colour} />;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: PRIMARY_COLOUR,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '80%',
    alignSelf: 'center',
    bottom: 40,
    borderRadius: 40,
    paddingHorizontal: 12,
    paddingVertical: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  text: {
    color: 'white',
    marginLeft: 8,
  }
});

export default CustomNavBar;