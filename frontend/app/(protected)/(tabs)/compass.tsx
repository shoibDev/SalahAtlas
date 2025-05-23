import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Easing,
  ImageBackground
} from 'react-native';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import { getQiblaDirection } from '@/utils/qibla';
import { useTheme } from '@/context/ThemeContext';

const COMPASS_SIZE = 250;
const MARKER_SIZE = 24;

export default function CompassScreen() {
  const theme = useTheme();
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
        <View style={[styles.loader, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
    );
  }

  const angleToQibla = ((qiblaDirection - heading + 360) % 360) - 90;
  const angleRad = angleToQibla * (Math.PI / 180);
  const radius = COMPASS_SIZE / 2 - 30;
  const markerX = Math.cos(angleRad) * radius;
  const markerY = Math.sin(angleRad) * radius;

  return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.header, { color: theme.textPrimary }]}>Qibla Direction</Text>

        <View style={[styles.glowCircleWrapper, { shadowColor: theme.accent }]}>
          <View
              style={[
                styles.compassRing,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.accent,
                },
              ]}
          >
            <Animated.View
                style={[
                  styles.qiblaMarker,
                  {
                    transform: [{ scale: scaleAnim }],
                    left: COMPASS_SIZE / 2 + markerX - MARKER_SIZE / 2,
                    top: COMPASS_SIZE / 2 + markerY - MARKER_SIZE / 2,
                    backgroundColor: theme.accent,
                    shadowColor: isExactQibla ? theme.accent : 'transparent',
                    shadowOpacity: isExactQibla ? 1 : 0,
                    shadowRadius: isExactQibla ? 12 : 0,
                  },
                ]}
            />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.label, { color: theme.textSecondary }]}>Your Heading</Text>
          <Text style={[styles.value, { color: theme.textPrimary }]}>{Math.round(heading)}°</Text>

          <Text style={[styles.label, { color: theme.textSecondary }]}>Qibla From North</Text>
          <Text style={[styles.value, { color: theme.textPrimary }]}>{Math.round(qiblaDirection)}°</Text>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 150,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  glowCircleWrapper: {
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
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  qiblaMarker: {
    position: 'absolute',
    width: MARKER_SIZE,
    height: MARKER_SIZE,
    borderRadius: MARKER_SIZE / 2,
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowOpacity: 0.8,
    elevation: 10,
  },
  infoContainer: {
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
