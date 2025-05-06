import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  Pressable,
  View,
  Easing,
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Screens
import Compass from './compass';
import Dashboard from './dashboard';
import Settings from './settings';

const Tab = createBottomTabNavigator();

const getIcon = (name: string) => {
  switch (name) {
    case 'compass':
      return 'compass';
    case 'dashboard':
      return 'home';
    case 'settings':
      return 'cog';
    default:
      return 'circle';
  }
};

// 🔹 Icon + Label with inner animated border
const AnimatedIconWithLabel = ({
                                 isFocused,
                                 iconName,
                                 label,
                               }: {
  isFocused: boolean;
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
}) => {
  const iconShift = useRef(new Animated.Value(0)).current;
  const labelSlide = useRef(new Animated.Value(6)).current;
  const labelOpacity = useRef(new Animated.Value(0)).current;
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      Animated.parallel([
        Animated.timing(iconShift, {
          toValue: -6,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(labelSlide, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(labelOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(borderAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(iconShift, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease),
        }),
        Animated.timing(labelSlide, {
          toValue: 6,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(labelOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(borderAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [isFocused]);

  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 2],
  });

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(0,0,0,0)', 'white'],
  });

  return (
      <Animated.View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth,
            borderColor,
            backgroundColor: isFocused ? '#9ca3af' : 'transparent',
            borderRadius: 30,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
      >
        <Animated.View style={{ transform: [{ translateX: iconShift }] }}>
          <FontAwesome
              name={iconName}
              size={24}
              color={isFocused ? '#ffffff' : '#9ca3af'}
          />
        </Animated.View>
        <Animated.Text
            style={{
              marginLeft: 4,
              marginHorizontal: 4,
              fontSize: 14,
              color: '#ffffff',
              transform: [{ translateX: labelSlide }],
              opacity: labelOpacity,
            }}
        >
          {label}
        </Animated.Text>
      </Animated.View>
  );
};

// 🔸 Individual tab pressable
const AnimatedTabItem = ({
                           isFocused,
                           onPress,
                           children,
                         }: {
  isFocused: boolean;
  onPress: () => void;
  children: React.ReactNode;
}) => {
  return (
      <View
          style={{
            flex: 1,
            justifyContent: 'center',
            marginHorizontal: -20,
          }}
      >
        <Pressable
            onPress={onPress}
            style={{
              flex: 1,
              height: 60,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 12,
              backgroundColor: 'transparent',
              borderRadius: 12,
            }}
        >
          {children}
        </Pressable>
      </View>
  );
};

// 🧭 Full custom dark tab bar
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
      <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#1f2937', // dark background
            borderTopWidth: 0.5,
            borderTopColor: '#374151',
            height: 85,
            paddingHorizontal: 4,
            paddingVertical: 8,
          }}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const iconName = getIcon(route.name);
          const label = options.title ?? route.name;

          const onPress = () => {
            if (!isFocused) navigation.navigate(route.name);
          };

          return (
              <AnimatedTabItem
                  key={route.key}
                  isFocused={isFocused}
                  onPress={onPress}
              >
                <AnimatedIconWithLabel
                    isFocused={isFocused}
                    iconName={iconName}
                    label={label}
                />
              </AnimatedTabItem>
          );
        })}
      </View>
  );
};

export default function TabLayout() {
  return (
      <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />}>
        <Tab.Screen
            name="compass"
            component={Compass}
            options={{ title: 'Compass' }}
        />
        <Tab.Screen
            name="dashboard"
            component={Dashboard}
            options={{ title: 'Dashboard' }}
        />
        <Tab.Screen
            name="settings"
            component={Settings}
            options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
  );
}
