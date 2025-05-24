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
import CreateJummahForm from '../../../components/forms/CreateJummahForm';
import { getNearbyJummah } from '@/api/jummah';
import { JummahMapResponse } from '@/types/jummah';
import JummahMarkerCircle from "@/components/JummahMarkerCircle";
import { useRouter } from 'expo-router';
import Modal from 'react-native-modal';

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<LatLng | null>(null);
  const [currentRegion, setCurrentRegion] = useState<Region | null>(null);
  const [nearbyJummahs, setNearbyJummahs] = useState<JummahMapResponse[]>([]);
  const router = useRouter();

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
        const jummahs = await getNearbyJummah(loc.coords.latitude, loc.coords.longitude);
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
                Alert.alert('Zoom In', 'Please zoom in closer before selecting a location.');
              }
            }}
        >
          <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
          />

          {nearbyJummahs.map((jummah) => (
              <Marker
                  key={jummah.id}
                  coordinate={{
                    latitude: jummah.latitude,
                    longitude: jummah.longitude,
                  }}
                  anchor={{ x: 0.5, y: 0.5 }}
                  onPress={() => router.push(`/jummah/${jummah.id}`)}
              >
                <JummahMarkerCircle verified={jummah.isVerifiedOrganizer} />
              </Marker>
          ))}
        </MapView>

        {/* New Modal with animation */}
        <Modal
            isVisible={modalVisible}
            backdropColor="#000"
            backdropOpacity={0.6}
            animationIn="zoomIn"
            animationOut="zoomOut"
            useNativeDriver
            style={styles.modal}
            onBackdropPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <CreateJummahForm
                coords={selectedCoords}
                onClose={() => setModalVisible(false)}
            />
          </View>
        </Modal>
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
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: 500, // fixed height to prevent it filling the whole screen
    justifyContent: 'center',
  },
});

