import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ImageBackground,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeScreen() {
  const theme = useTheme();
  const [isDarkVisual, setIsDarkVisual] = useState(true);
  const translateX = useRef(new Animated.Value(isDarkVisual ? 28 : 0)).current;
  const bgColor = useRef(new Animated.Value(isDarkVisual ? 1 : 0)).current;


  const handleToggle = () => {
    const next = !isDarkVisual;
    setIsDarkVisual(next);
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: next ? 28 : 0,
        duration: 300,
        easing: Easing.out(Easing.circle),
        useNativeDriver: true,
      }),
      Animated.timing(bgColor, {
        toValue: next ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const toggleBackground = bgColor.interpolate({
    inputRange: [0, 1],
    outputRange: ['#E5E7EB', '#1F2937'],
  });

  return (
      <ImageBackground
          source={theme.absurdityTexture}
          style={styles.screen}
          imageStyle={{ opacity: 0.1 }}
          resizeMode="cover"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Appearance</Text>
          <Text style={styles.description}>Switch between Light and Dark mode.</Text>
          <View style={styles.row}>
            <Feather
                name="sun"
                size={24}
                color={!isDarkVisual ? '#FBBF24' : '#9CA3AF'}
                style={{ marginRight: 12 }}
            />
            <Animated.View
                style={[styles.toggleContainer, { backgroundColor: toggleBackground }]}
            >
              <TouchableOpacity onPress={handleToggle} activeOpacity={0.9}>
                <View style={styles.touchArea}>
                  <Animated.View
                      style={[
                        styles.toggleThumb,
                        {
                          transform: [{ translateX }],
                          shadowColor: isDarkVisual ? '#C084FC' : '#FBBF24',
                        },
                      ]}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
            <Feather
                name="moon"
                size={24}
                color={isDarkVisual ? '#C084FC' : '#9CA3AF'}
                style={{ marginLeft: 12 }}
            />
          </View>
        </View>
      </ImageBackground>
  );
}
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0D2B35',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: '#122E38',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#F3E9E2',
    fontWeight: '700',
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#C9886B',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleContainer: {
    width: 60,
    height: 32,
    borderRadius: 999,
    justifyContent: 'center',
    paddingHorizontal: 2,
    backgroundColor: '#1F2937',
  },
  touchArea: {
    flex: 1,
    justifyContent: 'center',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3E9E2',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },
});
