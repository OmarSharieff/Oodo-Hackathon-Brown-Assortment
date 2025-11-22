import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.homeContainer}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Recent Activity</Text>
             <Button
        title="Friends"
        onPress={() => alert('Button pressed!')}
      />
        </View>
        <View style={styles.feedContainer}>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
//   button: {

//   }
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 16,
//     //backgroundColor: '#ffffffff',
//     borderBottomWidth: 1,       // 👈 line divider
//     borderBottomColor: '#ccc',  // 👈 divider color
//   },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
});
