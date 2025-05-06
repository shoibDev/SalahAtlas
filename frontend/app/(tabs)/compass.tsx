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
const MARKER_SIZE = 24;

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
          <ActivityIndicator size="large" color="#00ffcc" />
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
        <Text style={styles.header}>🕋 Qibla Direction</Text>

        <View style={styles.glowCircleWrapper}>
          <View style={styles.compassRing}>
            <Animated.View
                style={[
                  styles.qiblaMarker,
                  {
                    transform: [{ scale: scaleAnim }],
                    left: COMPASS_SIZE / 2 + markerX - MARKER_SIZE / 2,
                    top: COMPASS_SIZE / 2 + markerY - MARKER_SIZE / 2,
                    shadowColor: isExactQibla ? '#00ffcc' : 'transparent',
                    shadowOpacity: isExactQibla ? 1 : 0,
                    shadowRadius: isExactQibla ? 12 : 0,
                  },
                ]}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          {isExactQibla && (
              <View style={styles.qiblaCard}>
                <Text style={styles.qiblaCardText}>You're Facing Qibla 🕋</Text>
              </View>
          )}

          <Text style={styles.label}>Your Heading</Text>
          <Text style={styles.value}>{Math.round(heading)}°</Text>

          <Text style={styles.label}>Qibla From North</Text>
          <Text style={styles.value}>{Math.round(qiblaDirection)}°</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070b17',
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    color: '#f9f9f9',
    marginBottom: 30,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  glowCircleWrapper: {
    shadowColor: '#00ffcc',
    shadowOpacity: 0.3,
    shadowRadius: 50,
    shadowOffset: { width: 0, height: 0 },
    elevation: 12,
    marginBottom: 40,
  },
  compassRing: {
    width: COMPASS_SIZE,
    height: COMPASS_SIZE,
    borderRadius: COMPASS_SIZE / 2,
    backgroundColor: '#121c2c',
    borderWidth: 3,
    borderColor: '#00ffcc',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qiblaMarker: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    backgroundColor: '#00ffcc',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#00ffcc',
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  infoContainer: {
    alignItems: 'center',
  },
  qiblaCard: {
    backgroundColor: 'rgba(0,255,204,0.1)',
    borderColor: '#00ffcc',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 30,
    shadowColor: '#00ffcc',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  qiblaCardText: {
    color: '#00ffcc',
    fontSize: 18,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    color: '#a0a0a0',
    marginTop: 10,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
