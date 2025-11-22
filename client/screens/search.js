import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationBar from '../components/navigationBar';

// REPLACE with your computer's local IP if testing on physical device/Android Emulator
// e.g., 'http://192.168.1.5:3000'
const API_URL = 'http://localhost:3000'; 

export default function SearchScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 1. Request Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to see nearby spots.');
        setLoading(false);
        return;
      }

      // 2. Get User Location
      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      // 3. Fetch Nearby Locations from your Backend
      fetchLocations(userLocation.coords.latitude, userLocation.coords.longitude);
    })();
  }, []);

  const fetchLocations = async (lat, long) => {
    try {
      // Using your backend route: /api/locations/nearby
      const response = await fetch(
        `${API_URL}/api/locations/nearby?latitude=${lat}&longitude=${long}&radius=10`
      );
      const json = await response.json();
      
      if (json.success) {
        setLocations(json.data); // Your backend returns { data: [...] }
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4d171" />
        <Text>Finding nearby vibes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE} // Remove this line if using Apple Maps on iOS
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01, // Zoom level
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{
                latitude: parseFloat(loc.latitude),
                longitude: parseFloat(loc.longitude),
              }}
              title={loc.hotspot ? "Hotspot!" : "Spot"}
              description={loc.near_greenery ? "Near Greenery 🌿" : ""}
            >
              {/* Custom Marker Images based on data */}
              <Image
                source={
                  loc.hotspot
                    ? require('../assets/fire.png') // Hotspot gets Fire icon
                    : require('../assets/pin.png')  // Regular gets Pin icon
                }
                style={{
                  width: loc.hotspot ? 35 : 30,
                  height: loc.hotspot ? 35 : 30,
                  resizeMode: 'contain'
                }}
              />
            </Marker>
          ))}
        </MapView>

        {/* Navigation Bar pinned to bottom */}
        <View style={styles.navContainer}>
          <NavigationBar navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});