import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text, Alert, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationBar from '../components/navigationBar';

// Backend URL - Updated for physical device testing
// Use localhost for simulator, WiFi IP for physical device
const API_URL = 'https://a66c310b8089.ngrok-free.app';

export default function SearchScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    try {
      // 1. Request Location Permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        Alert.alert(
          'Permission Required',
          'Please allow location access to see nearby spots.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // 2. Get User's Current Location
      let userLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation(userLocation.coords);

      // 3. Fetch Nearby Locations from Backend
      await fetchLocations(userLocation.coords.latitude, userLocation.coords.longitude);
    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize map');
      setLoading(false);
    }
  };

  const fetchLocations = async (lat, long) => {
    try {
      const response = await fetch(
        `${API_URL}/api/locations/nearby?latitude=${lat}&longitude=${long}&radius=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      
      if (json.success && json.data) {
        setLocations(json.data);
        console.log(`✅ Loaded ${json.data.length} locations from database`);
      } else {
        console.warn('No locations found in response');
        setLocations([]);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
      setError('Failed to load locations');
      // Set empty array so map still renders
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshLocations = () => {
    if (location) {
      setLoading(true);
      fetchLocations(location.latitude, location.longitude);
    }
  };

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4d171" />
        <Text style={styles.loadingText}>Finding nearby locations...</Text>
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsScale={true}
        >
          {locations.map((loc) => (
            <Marker
              key={loc.id}
              coordinate={{
                latitude: parseFloat(loc.latitude),
                longitude: parseFloat(loc.longitude),
              }}
              title={loc.hotspot ? "🔥 Hotspot" : "📍 Location"}
              description={loc.near_greenery ? "Near Greenery 🌿" : ""}
            >
              <Image
                source={
                  loc.hotspot
                    ? require('../assets/fire.png')
                    : require('../assets/pin.png')
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

        {/* Refresh Button */}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshLocations}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>

        {/* Location Count */}
        <View style={styles.locationCount}>
          <Text style={styles.locationCountText}>
            {locations.length} location{locations.length !== 1 ? 's' : ''} nearby
          </Text>
        </View>

        {/* Navigation Bar */}
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
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    marginTop: 10,
    fontSize: 14,
    color: '#ff3b30',
    textAlign: 'center',
    paddingHorizontal: 20,
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
  refreshButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#f4d171',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButtonText: {
    fontSize: 24,
  },
  locationCount: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(244, 209, 113, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  locationCountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});