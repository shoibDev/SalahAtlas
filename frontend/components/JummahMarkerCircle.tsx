import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

const MARKER_SIZE = 24;

export default function JummahMarkerCircle({ verified }: { verified: boolean }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.4,
            duration: 700,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  return (
      <Animated.View style={[styles.base, { transform: [{ scale: scaleAnim }] }]}>
        <View
            style={[
              styles.inner,
              {
                backgroundColor: verified ? '#10b981' : '#133383',
                borderColor: '#fff',
              },
            ]}
        >
          <Image
              source={require('@/assets/images/crescent.png')}
              style={styles.icon}
          />
        </View>
      </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 10,
  },
  inner: {
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
});
