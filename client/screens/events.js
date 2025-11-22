
import NavigationBar from '../components/navigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Modal, Pressable } from 'react-native';
const events = [
  {
    id: '1',
    user_id: 'Ivanna',
    name: 'Hackathon Kickoff',
    date: '2025-11-25',
    time: '18:00',
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
    location: '92 Rue Dupont, Schaerbeek BE',
    rsvp: [],
  },
  {
    id: '2',
    user_id: 'Alex',
    name: 'React Native Workshop',
    date: '2025-11-28',
    time: '14:00',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

    location: 'Rue Scarron, Ixelles BE',
    rsvp: [],
  },
  {
    id: '3',
    user_id: 'Ivanna',
    name: 'Closing Ceremony',
    date: '2025-11-30',
    time: '20:00',
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",

    location: 'Grand Place, Brussels BE',
    rsvp: [],
  },
];

function toggleRsvp(eventId, currentUser = 'me') {
  setEvents(prevEvents =>
    prevEvents.map(event => {
      if (event.id === eventId) {
        const alreadyRsvped = event.rsvp.includes(currentUser);
        return {
          ...event,
          rsvpedUsers: alreadyRsvped
            ? event.rsvpedUsers.filter(u => u !== currentUser) // remove
            : [...event.rsvp, currentUser],             // add
        };
      }
      return event;
    })
  );
}

const EventCard = ({ item, onPress, expanded = false }) => (
  <TouchableOpacity disabled={!onPress} onPress={onPress} activeOpacity={0.8}>
    <View style={styles.event}>
      <View style={styles.postHeader}>
        <View style={styles.leftGroup}>
          <Image source={require('../assets/pissbaby.png')} style={styles.userImg} />
          <View style={styles.headerInfo}>
            <Text style={styles.username}>{item.user_id}</Text>
            <Text style={styles.eventName}>{item.name}</Text>
            <View style={styles.locationContainer}>
              <Image source={require('../assets/pin.png')} style={styles.pin} resizeMode="contain" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>
            {item.description}
        </Text>
      </View>

      {/* Event details */}
      <View style={styles.postFooter}>
        <Text style={styles.eventDate}>
          {item.date} at {item.time}
        </Text>
        <TouchableOpacity
            style={styles.rsvpButton}
            onPress={() => toggleRsvp(item.id)}
            activeOpacity={0.7}
            >
            <Text style={styles.rsvpText}>
                RSVP ({item.rsvp.length})
            </Text>
        </TouchableOpacity>

      </View>
    </View>
  </TouchableOpacity>
);

export default function EventsScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, width: '100%'}} edges={['bottom']}>
      <View style={styles.eventContainer}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Events</Text>
        </View>
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <EventCard item={item} onPress={() => setSelectedEvent(item)} />
          )}
          contentContainerStyle={styles.feedContainer}
        />
        <NavigationBar></NavigationBar>
        </View>
        </SafeAreaView>
      
  );
}

const styles = StyleSheet.create({
  eventContainer: {
    flex: 1,
    //flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 50,
    paddingBottom: 10,
    padding: 20,
    //backgroundColor: '#ffffffff',
    borderBottomWidth: .3,       // 👈 line divider
    borderBottomColor: '#ccc',  // 👈 divider color
  },
   title: {
    //justifyContent: 'flex-end',
    fontFamily: 'Montserrat-Bold',
    fontSize: 24,
    //fontWeight: 'bold',npx react-native-assetnpx react-native-asset
    color: '#333',
  },
  
  userImg: {
    width: 30,
    height: 30,
    borderRadius: 30,
  },
  event: {
    backgroundColor: '#fff',
    //marginBottom: 20,
    //borderRadius: 10,
    overflow: 'hidden',
    borderWidth: .2,  
    borderColor: '#ccc', 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    padding: 13,
   
  },
  rsvpButton: {
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 6,
  backgroundColor: '#eee',
  marginLeft: 'auto',   
},

rsvpText: {
  fontSize: 13,
  color: '#333',
  fontWeight: '500',
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

  description: {
    paddingRight: 20,
    paddingLeft: 20
  },
  descriptionContainer:{
 paddingRight: 10,
    paddingLeft: 10
  },

  postFooter: {
    flexDirection: 'row',
  alignContent: 'flex-start',
  marginTop: 8,
  paddingBottom: 5,
   paddingRight: 10,
    paddingLeft: 10
  },
  description: {
    fontSize: 14,
    color: '#444',
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
    // The width of the page was weird but this is very hacky solution
  },

});
