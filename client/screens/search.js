import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  Text, 
  Alert, 
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  FlatList
} from 'react-native';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigationBar from '../components/navigationBar';
import LeafletMapView from '../components/LeafletMapView';

const API_URL = 'http://10.0.2.2:3000';
const { width, height } = Dimensions.get('window');

export default function SearchScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapillaryModalVisible, setMapillaryModalVisible] = useState(false);
  const [showLocationsList, setShowLocationsList] = useState(false);
  const [useMockLocation, setUseMockLocation] = useState(true);

  useEffect(() => {
    initializeMap();
  }, []);

  const initializeMap = async () => {
    setLoading(true);
    setError(null);
    


    const mockCoords = {
      latitude: 50.82055797368375,
      longitude: 4.402875123647935,
    };
    
    // For testing: use mock location immediately
    if (useMockLocation) {
      console.log('🧪 Using mock location for testing');
      setLocation(mockCoords);
      await fetchLocations(mockCoords.latitude, mockCoords.longitude);
      setLoading(false);
      return;
    }
    
    // Try real location only if mock is disabled
    console.log('📍 Attempting to get real location...');
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      console.log('Permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'Please grant location permission to use real location.',
          [{ text: 'OK' }]
        );
        console.log('Permission denied, using mock');
        setLocation(mockCoords);
        await fetchLocations(mockCoords.latitude, mockCoords.longitude);
        setLoading(false);
        return;
      }

      console.log('Requesting current position...');
      
      // Try with better options for emulator
      const userLocation = await Promise.race([
        Location.getCurrentPositionAsync({ 
          accuracy: Location.Accuracy.Low,
          maximumAge: 10000, // Accept cached location up to 10 seconds old
          timeout: 15000, // Longer timeout
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Location request timeout after 15s')), 15000)
        )
      ]);
      
      console.log('✅ Got real location:', userLocation.coords);
      
      Alert.alert(
        'Real Location Found! 🎉',
        `Lat: ${userLocation.coords.latitude.toFixed(5)}\nLon: ${userLocation.coords.longitude.toFixed(5)}`,
        [{ text: 'Great!' }]
      );
      
      setLocation(userLocation.coords);
      await fetchLocations(userLocation.coords.latitude, userLocation.coords.longitude);
    } catch (err) {
      console.error('Location error:', err);
      
      Alert.alert(
        'Could Not Get Location',
        `Error: ${err.message}\n\nMake sure you've set location in emulator Extended Controls (⋮ → Location → Send coordinates)`,
        [
          { text: 'Use Mock', onPress: () => {
            setUseMockLocation(true);
            setLocation(mockCoords);
            fetchLocations(mockCoords.latitude, mockCoords.longitude);
          }},
          { text: 'Retry', onPress: () => initializeMap() }
        ]
      );
      
      // Fallback to mock
      setLocation(mockCoords);
      await fetchLocations(mockCoords.latitude, mockCoords.longitude);
    } finally {
      setLoading(false);
    }
  };

const fetchLocations = async (lat, long) => {
  try {
    const [mapillaryResponse, postsResponse] = await Promise.all([
      fetch(
        `${API_URL}/api/mapillary/nearby-cached?latitude=${lat}&longitude=${long}&radius=4`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      ),
      fetch(
        `${API_URL}/api/locations/with-images?latitude=${lat}&longitude=${long}&radius=4`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
    ]);
    
    const mapillaryJson = await mapillaryResponse.json();
    const postsJson = await postsResponse.json();

    console.log('📊 Raw Mapillary response:', JSON.stringify(mapillaryJson, null, 2));
    console.log('📊 Raw Posts response:', JSON.stringify(postsJson, null, 2));

    let allLocations = [];

    // Add Mapbox/Mapillary locations with validation
    if (mapillaryJson.success && mapillaryJson.data && Array.isArray(mapillaryJson.data)) {
      const mapillaryLocations = mapillaryJson.data
        .filter(loc => loc.latitude && loc.longitude) // ✅ Filter out invalid data
        .map(loc => ({
          id: loc.mapillary_image_id || loc.id,
          type: 'mapillary',
          latitude: parseFloat(loc.latitude),
          longitude: parseFloat(loc.longitude),
          image_url: loc.mapillary_image_url,
          thumb_url: loc.mapillary_thumb_url,
          // Convert Unix timestamp (bigint in milliseconds) to Date string
          captured_at: loc.mapillary_captured_at 
            ? new Date(parseInt(loc.mapillary_captured_at)).toISOString() 
            : null,
          compass_angle: loc.mapillary_compass_angle,
          distance: loc.distance || 0,
          hotspot: loc.hotspot || false,
          near_greenery: loc.near_greenery || false,
          halal: loc.halal || false,
          crowded: loc.crowded || false,
        }))
        .filter(loc => !isNaN(loc.latitude) && !isNaN(loc.longitude)); // ✅ Ensure valid numbers
      
      allLocations = [...allLocations, ...mapillaryLocations];
      console.log(`✅ Loaded ${mapillaryLocations.length} valid Mapbox images`);
    }

    // Add user posts with images with validation
    if (postsJson.success && postsJson.data && Array.isArray(postsJson.data)) {
      const postLocations = postsJson.data
        .filter(post => post.latitude && post.longitude) // ✅ Filter out invalid data
        .map(post => ({
          id: post.id,
          type: 'post',
          latitude: parseFloat(post.latitude),
          longitude: parseFloat(post.longitude),
          image_url: post.image_url,
          thumb_url: post.image_url,
          description: post.description,
          rating: post.rating,
          created_at: post.created_at,
          distance: post.distance || 0,
          hotspot: post.hotspot || false,
          near_greenery: post.near_greenery || false,
          halal: post.halal || false,
          crowded: post.crowded || false,
        }))
        .filter(loc => !isNaN(loc.latitude) && !isNaN(loc.longitude)); // ✅ Ensure valid numbers
      
      allLocations = [...allLocations, ...postLocations];
      console.log(`✅ Loaded ${postLocations.length} valid user posts`);
    }

    // Sort by distance
    allLocations.sort((a, b) => a.distance - b.distance);
    
    setLocations(allLocations);
    console.log(`✅ Total valid locations: ${allLocations.length}`);
    
    if (allLocations.length === 0) {
      setError('No locations with images found nearby');
    }
  } catch (error) {
    console.error('Error fetching locations:', error);
    setError('Failed to load locations with images');
    setLocations([]);
  }
};

  const refreshLocations = () => {
    if (location) {
      setLoading(true);
      fetchLocations(location.latitude, location.longitude);
    }
  };

  const handleMarkerPress = (loc) => {
    setSelectedLocation(loc);
    setMapillaryModalVisible(true);
  };

  const closeMapillaryModal = () => {
    setMapillaryModalVisible(false);
    setSelectedLocation(null);
  };

  const toggleLocationsList = () => {
    setShowLocationsList(!showLocationsList);
  };

  const toggleMockLocation = () => {
    setUseMockLocation(!useMockLocation);
    Alert.alert(
      'Location Mode Changed',
      `Switched to ${!useMockLocation ? 'Mock' : 'Real'} location. Pull down to refresh.`,
      [
        { 
          text: 'Refresh Now', 
          onPress: () => initializeMap() 
        },
        { text: 'Later' }
      ]
    );
  };

  if (loading || !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4d171" />
        <Text style={styles.loadingText}>Finding nearby locations...</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={styles.container}>
        {/* Map */}
        <LeafletMapView
          latitude={location.latitude}
          longitude={location.longitude}
          locations={locations}
          onMarkerPress={handleMarkerPress}
        />

        {/* Mock Location Toggle Button (Top Left) */}
        <TouchableOpacity 
          style={styles.mockToggle}
          onPress={toggleMockLocation}
        >
          <Text style={styles.mockToggleText}>
            {useMockLocation ? '🧪' : '📍'}
          </Text>
        </TouchableOpacity>

        {/* Refresh Button (Top Right) */}
        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={refreshLocations}
        >
          <Text style={styles.refreshButtonText}>🔄</Text>
        </TouchableOpacity>

        {/* Floating List Button (Bottom Right, above nav) */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={toggleLocationsList}
        >
          <Text style={styles.floatingButtonText}>📍</Text>
          <Text style={styles.floatingButtonCount}>{locations.length}</Text>
        </TouchableOpacity>

        {/* Locations List Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showLocationsList}
          onRequestClose={toggleLocationsList}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.listModalContent}>
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderTitle}>
                  📍 Nearby Street Views ({locations.length})
                </Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={toggleLocationsList}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <FlatList
                data={locations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.listLocationCard}
                    onPress={() => {
                      setShowLocationsList(false);
                      handleMarkerPress(item);
                    }}
                  >
                    {item.thumb_url && (
                      <Image
                        source={{ uri: item.thumb_url }}
                        style={styles.listThumbnail}
                        resizeMode="cover"
                      />
                    )}
                    <View style={styles.listCardContent}>
                      <View style={styles.typeContainer}>
                        <Text style={styles.listCardTitle}>
                          {item.hotspot ? "🔥 Hotspot" : "📍 Location"}
                        </Text>
                        <Text style={styles.typeBadge}>
                          {item.type === 'mapillary' ? '📷 Street View' : '👤 User Post'}
                        </Text>
                      </View>
                      {item.description && (
                        <Text style={styles.description} numberOfLines={2}>
                          {item.description}
                        </Text>
                      )}
                      {item.rating && (
                        <Text style={styles.rating}>⭐ {item.rating}/5</Text>
                      )}
                      {item.near_greenery && (
                        <Text style={styles.listGreenBadge}>🌿 Near Greenery</Text>
                      )}
                      <Text style={styles.listCoordinates}>
                        {(item.latitude && item.longitude) 
                          ? `${parseFloat(item.latitude).toFixed(5)}, ${parseFloat(item.longitude).toFixed(5)}`
                          : 'Coordinates unavailable'}
                      </Text>
                      {item.distance > 0 && (
                        <Text style={styles.listDistance}>
                          📏 {item.distance.toFixed(2)} km away
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyList}>
                    <Text style={styles.emptyListText}>No locations found</Text>
                  </View>
                }
              />
            </View>
          </View>
        </Modal>

        {/* Mapillary Detail Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={mapillaryModalVisible}
          onRequestClose={closeMapillaryModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={closeMapillaryModal}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>

                <Text style={styles.modalTitle}>
                  {selectedLocation?.hotspot ? "🔥 Hotspot" : "📍 Location"}
                </Text>
                
                <Text style={styles.locationTypeBadge}>
                  {selectedLocation?.type === 'mapillary' ? '📷 Street View' : '👤 User Post'}
                </Text>
                
                {selectedLocation?.near_greenery && (
                  <Text style={styles.greeneryBadge}>🌿 Near Greenery</Text>
                )}

                {selectedLocation?.image_url ? (
                  <View style={styles.streetViewContainer}>
                    <Text style={styles.sectionTitle}>
                      {selectedLocation.type === 'mapillary' ? 'Street View' : 'Photo'}
                    </Text>
                    <Image
                      source={{ uri: selectedLocation.image_url }}
                      style={styles.streetViewImage}
                      resizeMode="cover"
                    />
                    {selectedLocation.captured_at && (
                      <Text style={styles.capturedDate}>
                        {selectedLocation.type === 'mapillary' ? 'Captured' : 'Posted'}: {new Date(selectedLocation.captured_at || selectedLocation.created_at).toLocaleDateString()}
                      </Text>
                    )}
                    {selectedLocation.description && (
                      <Text style={styles.descriptionText}>{selectedLocation.description}</Text>
                    )}
                    {selectedLocation.rating && (
                      <Text style={styles.ratingText}>⭐ Rating: {selectedLocation.rating}/5</Text>
                    )}
                  </View>
                ) : (
                  <View style={styles.noStreetView}>
                    <Text style={styles.noStreetViewText}>
                      📸 No image available
                    </Text>
                  </View>
                )}

                <View style={styles.detailsContainer}>
                  <Text style={styles.sectionTitle}>Details</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Coordinates:</Text>
                    <Text style={styles.detailValue}>
                      {(selectedLocation?.latitude && selectedLocation?.longitude)
                        ? `${parseFloat(selectedLocation.latitude).toFixed(5)}, ${parseFloat(selectedLocation.longitude).toFixed(5)}`
                        : 'Not available'}
                    </Text>
                  </View>
                  {selectedLocation?.distance > 0 && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Distance:</Text>
                      <Text style={styles.detailValue}>
                        {selectedLocation.distance.toFixed(2)} km
                      </Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Navigation Bar */}
        <View style={styles.navContainer}>
          
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
  mockToggle: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(244, 209, 113, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mockToggleText: {
    fontSize: 20,
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
    zIndex: 1000,
  },
  refreshButtonText: {
    fontSize: 24,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 15,
    backgroundColor: '#f4d171',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 1000,
  },
  floatingButtonText: {
    fontSize: 24,
  },
  floatingButtonCount: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: -2,
  },
  navContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  listModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: height * 0.7,
    paddingTop: 20,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  listHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#333',
  },
  listLocationCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  listThumbnail: {
    width: 100,
    height: 100,
  },
  listCardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  listCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listGreenBadge: {
    color: '#4CAF50',
    fontSize: 12,
    marginBottom: 3,
  },
  listCoordinates: {
    fontSize: 11,
    color: '#666',
    marginBottom: 3,
  },
  listDistance: {
    fontSize: 11,
    color: '#999',
  },
  emptyList: {
    padding: 40,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 16,
    color: '#666',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  greeneryBadge: {
    fontSize: 16,
    color: '#4CAF50',
    marginBottom: 15,
  },
  streetViewContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  streetViewImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 5,
  },
  capturedDate: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  noStreetView: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 20,
  },
  noStreetViewText: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    marginTop: 10,
  },
  detailRow: {
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  typeBadge: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  locationTypeBadge: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 15,
    color: '#333',
    marginTop: 10,
    lineHeight: 22,
  },
  rating: {
    fontSize: 12,
    color: '#f4d171',
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingText: {
    fontSize: 16,
    color: '#f4d171',
    fontWeight: '600',
    marginTop: 5,
  },
});