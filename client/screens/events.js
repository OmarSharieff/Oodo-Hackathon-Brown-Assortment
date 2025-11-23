import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/navigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  Modal, 
  Pressable,
  ActivityIndicator 
} from 'react-native';

const API_BASE_URL = 'https://78af770a0ec4.ngrok-free.app/api';
const EVENTS_API_URL = `${API_BASE_URL}/events`;




// Format date to readable string
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric' 
  });
}

// Format time (assumes HH:MM:SS format from backend)
function formatTime(timeString) {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

const EventCard = ({ item, onPress, onRSVP, currentUserId }) => {
  const hasRSVPd = item.participants?.includes(currentUserId);
  const rsvpCount = item.rsvp_count || 0;

  return (
    <TouchableOpacity disabled={!onPress} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.event}>
        <View style={styles.postHeader}>
          <View style={styles.leftGroup}>
            <Image source={require('../assets/pissbaby.png')} style={styles.userImg} />
            <View style={styles.headerInfo}>
              <Text style={styles.username}>{item.host_user?.name || 'Unknown'}</Text>
              <Text style={styles.eventName}>{item.name}</Text>
              <View style={styles.locationContainer}>
                <Image source={require('../assets/pin.png')} style={styles.pin} resizeMode="contain" />
                <Text style={styles.locationText}>
                  {item.location 
                    ? `${item.location.latitude}, ${item.location.longitude}` 
                    : 'Location TBD'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {item.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={3}>
              {item.description}
            </Text>
          </View>
        )}

        {/* Event details */}
        <View style={styles.postFooter}>
          <Text style={styles.eventDate}>
            {formatDate(item.event_date)} at {formatTime(item.event_time)}
          </Text>
          <TouchableOpacity
            style={[
              styles.rsvpButton,
              hasRSVPd && styles.rsvpButtonActive
            ]}
            onPress={() => onRSVP(item.id, hasRSVPd)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.rsvpText,
              hasRSVPd && styles.rsvpTextActive
            ]}>
              {hasRSVPd ? '✓ Going' : 'RSVP'} ({rsvpCount})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default function EventsScreen({ navigation }) {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const CURRENT_USER_ID = user.id;
  // Fetch events from backend
  // const fetchEvents = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch(`${EVENTS_API_URL}?page=1&limit=20&upcoming=true`);
      
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
      
  //     const json = await response.json();
      
  //     if (json.success && json.data) {
  //       setEvents(json.data);
  //     } else {
  //       throw new Error('Invalid response format');
  //     }
  //   } catch (e) {
  //     console.error('Fetch error:', e);
  //     setError('Could not load events. Check server connection.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // Fetch events directly from Supabase (instead of backend API)
const fetchEvents = async () => {
  setLoading(true);
  setError(null);
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
 
    if (error) {
      throw error;
    }

    if (data) {
      setEvents(data);
    } else {
      throw new Error("No events found");
    }
  } catch (e) {
    console.error("Supabase fetch error:", e);
    setError("Could not load events. Check Supabase connection.");
  } finally {
    setLoading(false);
  }
};


  // Handle RSVP toggle
  const toggleRsvp = async (eventId, isCurrentlyRSVPd) => {
    try {
      const url = `${EVENTS_API_URL}/${eventId}/rsvp`;
      const method = isCurrentlyRSVPd ? 'DELETE' : 'POST';
      
      // 1. Optimistic UI Update
      setEvents(prevEvents =>
        prevEvents.map(event => {
          if (event.id === eventId) {
            const newParticipants = isCurrentlyRSVPd
              ? event.participants.filter(id => id !== CURRENT_USER_ID)
              : [...(event.participants || []), CURRENT_USER_ID];
            
            return {
              ...event,
              participants: newParticipants,
              rsvp_count: newParticipants.length
            };
          }
          return event;
        })
      );

      // 2. API Call
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: CURRENT_USER_ID }),
      });

      if (!response.ok) {
        throw new Error('Failed to update RSVP');
      }

      const data = await response.json();
      console.log('RSVP response:', data);
      
    } catch (e) {
      console.error('RSVP error:', e);
      
      // 3. Revert on failure
      fetchEvents();
      alert('Failed to update RSVP. Please try again.');
    }
  };

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator 
          size="large" 
          color="#f4d171" 
          style={{ marginTop: 50 }} 
        />
      );
    }

    if (error) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ textAlign: 'center', color: 'red', marginBottom: 20 }}>
            {error}
          </Text>
          <TouchableOpacity 
            style={styles.rsvpButton} 
            onPress={fetchEvents}
          >
            <Text style={styles.rsvpText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (events.length === 0) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, color: '#666' }}>No upcoming events</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard 
            item={item} 
            onPress={() => setSelectedEvent(item)}
            onRSVP={toggleRsvp}
            currentUserId={CURRENT_USER_ID}
          />
        )}
        contentContainerStyle={styles.feedContainer}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, width: '100%'}} edges={['bottom']}>
      <View style={styles.eventContainer}>
        <View style={styles.header}>
            <Image source={require('../assets/pissBabyLogo.png')}style={styles.logo}></Image>
          {/* <Text style={styles.headerTitle}>Events</Text> */}
        </View>
        
        {renderContent()}
    
      </View>

      {/* Event Detail Modal */}
      <Modal
        visible={!!selectedEvent}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedEvent(null)}
      >
        <Pressable 
          style={styles.modalBackground} 
          onPress={() => setSelectedEvent(null)}
        >
          <Pressable 
            style={styles.modalContent} 
            onPress={() => {}}
          >
            {selectedEvent && (
              <View style={styles.modalEventCard}>
                <Text style={styles.modalEventName}>
                  {selectedEvent.name}
                </Text>
                
                <Text style={styles.modalHost}>
                  Hosted by {selectedEvent.host_user?.name}
                </Text>

                <View style={styles.modalDateTime}>
                  <Text style={styles.modalDateTimeText}>
                    📅 {formatDate(selectedEvent.event_date)}
                  </Text>
                  <Text style={styles.modalDateTimeText}>
                    🕐 {formatTime(selectedEvent.event_time)}
                  </Text>
                </View>

                {selectedEvent.location && (
                  <Text style={styles.modalLocation}>
                    📍 {selectedEvent.location.latitude}, {selectedEvent.location.longitude}
                  </Text>
                )}

                {selectedEvent.description && (
                  <Text style={styles.modalDescription}>
                    {selectedEvent.description}
                  </Text>
                )}

                <View style={styles.modalFooter}>
                  <Text style={styles.modalRSVPCount}>
                    {selectedEvent.rsvp_count || 0} {selectedEvent.rsvp_count === 1 ? 'person is' : 'people are'} going
                  </Text>
                  
                  <TouchableOpacity
                    style={[
                      styles.modalRSVPButton,
                      selectedEvent.participants?.includes(CURRENT_USER_ID) && 
                      styles.rsvpButtonActive
                    ]}
                    onPress={() => {
                      toggleRsvp(
                        selectedEvent.id,
                        selectedEvent.participants?.includes(CURRENT_USER_ID)
                      );
                      setSelectedEvent(null);
                    }}
                  >
                    <Text style={styles.modalRSVPButtonText}>
                      {selectedEvent.participants?.includes(CURRENT_USER_ID) 
                        ? 'Cancel RSVP' 
                        : 'RSVP Now'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    //backgroundColor: '#f9f9f9',
    
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingBottom: 10,
    padding: 20,
    //backgroundColor: '#f4d171',
    borderBottomWidth: .3,
    borderBottomColor: '#ccc',
  },
  headerTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    color: '#333',
  },
  
  logo:{
    width: 45,
    height: 45,
    borderRadius: 30,
    
  },
  feedContainer: {
    paddingVertical: 10,
  },
  userImg: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  event: {
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: .2,  
    borderColor: '#ccc', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 13,
    marginHorizontal: 12,
    marginBottom: 10,
  },
  rsvpButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginLeft: 'auto',
  },
  rsvpButtonActive: {
    backgroundColor: '#f4d171',
  },
  rsvpText: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  rsvpTextActive: {
    fontWeight: 'bold',
  },
  postHeader: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flexDirection: 'row',
  },
  locationText: {
    fontSize: 11,
  },
  pin: {
    height: 12,
    width: 12,
    marginTop: 1,
    marginRight: 2,
  },
  headerInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingLeft: 5,
  },
  descriptionContainer: {
    paddingRight: 10,
    paddingLeft: 10,
    marginTop: 5,
  },
  description: {
    fontSize: 14,
    color: '#444',
    paddingRight: 20,
    paddingLeft: 20,
  },
  postFooter: {
    flexDirection: 'row',
    alignContent: 'flex-start',
    marginTop: 8,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  username: {
    fontWeight: 'bold',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  // Modal styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalEventCard: {
    padding: 20,
  },
  modalEventName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalHost: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  modalDateTime: {
    marginBottom: 10,
  },
  modalDateTimeText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 5,
  },
  modalLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  modalDescription: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  modalRSVPCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  modalRSVPButton: {
    backgroundColor: '#f4d171',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalRSVPButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});