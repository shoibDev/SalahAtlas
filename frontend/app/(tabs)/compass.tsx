import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { getQiblaDirection } from '@/utils/qibla';

const COMPASS_SIZE = 250;
const MARKER_SIZE = 16;

export default function CompassScreen() {
  const [heading, setHeading] = useState(0);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExactQibla, setIsExactQibla] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    let headingSub: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Location permission is required.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const qiblaDeg = getQiblaDirection(
          location.coords.latitude,
          location.coords.longitude
      );
      setQiblaDirection(qiblaDeg);
      setLoading(false);

      headingSub = await Location.watchHeadingAsync((data) => {
        const currentHeading = data.magHeading ?? 0;
        setHeading(currentHeading);

        const delta = Math.abs((qiblaDeg - currentHeading + 360) % 360);
        const isFacingQibla = delta <= 10 || delta >= 350;
        const isExact = delta <= 2 || delta >= 358;
        setIsExactQibla(isExact);

        if (isFacingQibla) {
          if (!animRef.current) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

            const animation = Animated.loop(
                Animated.sequence([
                  Animated.timing(scaleAnim, {
                    toValue: 1.5,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                  }),
                  Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 500,
                    easing: Easing.ease,
                    useNativeDriver: true,
                  }),
                ])
            );

            animation.start();
            animRef.current = animation;
          }
        } else {
          if (animRef.current) {
            animRef.current.stop();
            animRef.current = null;
            scaleAnim.setValue(1);
          }
        }
      });
    })();

    return () => {
      headingSub?.remove();
      if (animRef.current) {
        animRef.current.stop();
        animRef.current = null;
      }
      scaleAnim.setValue(1);
    };
  }, []);

  if (loading || qiblaDirection === null) {
    return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
    );
  }

  const angleToQibla = ((qiblaDirection - heading + 360) % 360) - 90;
  const angleRad = angleToQibla * (Math.PI / 180);
  const radius = COMPASS_SIZE / 2 - 30;

  const markerX = Math.cos(angleRad) * radius;
  const markerY = Math.sin(angleRad) * radius;

  return (
      <View style={styles.container}>
        <Text style={styles.title}>Qibla Compass</Text>

        <View style={styles.compassContainer}>
          <View style={styles.compassBase} />

          <Animated.View
              style={[
                styles.marker,
                {
                  transform: [{ scale: scaleAnim }],
                  left: COMPASS_SIZE / 2 + markerX - MARKER_SIZE / 2,
                  top: COMPASS_SIZE / 2 + markerY - MARKER_SIZE / 2,
                  shadowColor: isExactQibla ? '#00ffcc' : 'transparent',
                  shadowOpacity: isExactQibla ? 1 : 0,
                  shadowRadius: isExactQibla ? 15 : 0,
                  shadowOffset: { width: 0, height: 0 },
                },
              ]}
          />
        </View>

        {isExactQibla && (
            <View style={styles.qiblaHighlight}>
              <Text style={styles.qiblaText}>You're Facing Qibla 🕋</Text>
            </View>
        )}

        <Text style={styles.headingText}>Your Heading: {Math.round(heading)}°</Text>
        <Text style={styles.directionText}>
          Qibla is {Math.round(qiblaDirection)}° from Magnetic North
        </Text>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0c10',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    marginBottom: 40,
  },
  compassContainer: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compassBase: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    borderWidth: 4,
    borderColor: '#1e90ff',
    backgroundColor: '#121417',
    position: 'absolute',
    shadowColor: '#1e90ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  marker: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: 'green',
    borderWidth: 2,
    borderColor: 'white',
  },
  headingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#ddd',
  },
  directionText: {
    marginTop: 10,
    color: '#aaa',
    fontSize: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaHighlight: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#00ffcc22',
    borderColor: '#00ffcc',
    borderWidth: 2,
    borderRadius: 12,
    shadowColor: '#00ffcc',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  qiblaText: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});