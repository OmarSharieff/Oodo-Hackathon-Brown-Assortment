import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

export default function NavigationBar({ navigation }) {
  return (
    <View style={styles.navigationBar}>
      {/* Home */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
        <Image source={require('../assets/home.png')} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>

      {/* Map */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Search')}>
        <Image source={require('../assets/map.png')} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>

      {/* Add Post */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Notifications')}>
        <Image source={require('../assets/add.png')} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>

      {/* Profile */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Profile')}>
        <Image source={require('../assets/profile.png')} style={styles.icon} resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',   // evenly space buttons
    alignItems: 'center',
    height: 50,
    backgroundColor: '#f4d171',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 25,
    height: 25,
  },
});

