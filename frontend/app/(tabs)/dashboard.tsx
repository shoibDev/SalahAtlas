import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ModelScreen from '../modal';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to use the map.');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
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
            onLongPress={(event) => {
              setSelectedCoords(event.nativeEvent.coordinate);
              setModalVisible(true);
            }}
        >
          <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="You are here"
          />
        </MapView>

        <ModelScreen
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            coords={selectedCoords}
        />
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
