import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import MapView, { Marker, LatLng, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import ModalScreen from '../modal';
import CreateJummahForm from '../../components/forms/CreateJummahForm';
import { getNearbyJummah } from '@/api/jummahApi';
import { JummahMapResponse } from '@/types/JummahTypes';
import JummahMarkerCircle from "@/components/JummahMarkerCircle";

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<LatLng | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [nearbyJummahs, setNearbyJummahs] = useState<JummahMapResponse[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use the map.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      try {
        // const jummahs = await getNearbyJummah(loc.coords.latitude, loc.coords.longitude);
        const jummahs = [
          {
            id: '7944b79b-46bd-449d-b3ab-298b0d552a03',
            latitude: 43.433852577433456,
            longitude: -80.50930431118407,
            isVerifiedOrganizer: false,
          },
        ];
        setNearbyJummahs(Array.isArray(jummahs) ? jummahs : []);
      } catch (err) {
        console.error('Failed to fetch nearby Jummahs', err);
        Alert.alert('Error', 'Unable to load nearby Jummahs');
      }
    })();
  }, []);

  if (!location) {
    return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" />
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
            onRegionChangeComplete={(region) => setCurrentRegion(region)}
            onLongPress={(event) => {
              if (currentRegion && currentRegion.latitudeDelta < 0.01) {
                setSelectedCoords(event.nativeEvent.coordinate);
                setModalVisible(true);
              } else {
                Alert.alert(
                    'Zoom In',
                    'Please zoom in closer before selecting a location for higher accuracy.'
                );
              }
            }}
        >
          {/* User location marker */}
          <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
          />

          {/* Nearby Jummahs */}
          {Array.isArray(nearbyJummahs) &&
              nearbyJummahs.map((jummah) => (
                  <Marker
                      key={jummah.id}
                      coordinate={{
                        latitude: jummah.latitude,
                        longitude: jummah.longitude,
                      }}
                      anchor={{ x: 0.5, y: 0.5 }}
                  >
                    <JummahMarkerCircle verified={jummah.isVerifiedOrganizer} />
                  </Marker>

              ))}
        </MapView>

        <ModalScreen
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            title="Create Jummah"
        >
          <CreateJummahForm
              coords={selectedCoords}
              onClose={() => setModalVisible(false)}
          />
        </ModalScreen>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
