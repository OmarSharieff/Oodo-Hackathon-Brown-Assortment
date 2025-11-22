// // App.js
// import 'react-native-gesture-handler';
// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, View, ActivityIndicator } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';

// // Import Auth Context
// import { AuthProvider, useAuth } from './contexts/AuthContext';

// // Import Screens
// import LoginScreen from './screens/LoginScreen';
// import SignupScreen from './screens/SignupScreen';
// import HomeScreen from './screens/home';
// import EventsScreen from './screens/events';

// const Stack = createNativeStackNavigator();

// // Auth Stack (when user is NOT logged in)
// function AuthStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen name="Login" component={LoginScreen} />
//       <Stack.Screen name="Signup" component={SignupScreen} />
//     </Stack.Navigator>
//   );
// }

// // App Stack (when user IS logged in)
// function AppStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Stack.Screen name="Home" component={HomeScreen} />
//       <Stack.Screen name="Events" component={EventsScreen} />
//     </Stack.Navigator>
//   );
// }

// // Navigation that switches between Auth and App stacks
// function Navigation() {
//   const { user, loading } = useAuth();

//   // Show loading spinner while checking authentication
//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#f4d171" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {user ? <AppStack /> : <AuthStack />}
//     </NavigationContainer>
//   );
// }

// // Main App Component
// export default function App() {
//   return (
//     <SafeAreaProvider>
//       <AuthProvider>
//         <View style={styles.container}>
//           <Navigation />
//           <StatusBar style="auto" />
//         </View>
//       </AuthProvider>
//     </SafeAreaProvider>
//   );
// }
import { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/home';
import EventsScreen from './screens/events';
import NavigationBar from './components/navigationBar';

// Auth Stack (when user is NOT logged in)
function AuthStack() {
  return (
    <View style={{ flex: 1 }}>
      {/* You can decide whether to show Login or Signup here */}
      <LoginScreen />
      {/* Or conditionally <SignupScreen /> */}
    </View>
  );
}

// App Stack (manual navigation when user IS logged in)
function AppStack() {
  const [currentScreen, setCurrentScreen] = useState('Home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <HomeScreen />;
      case 'Events':
        return <EventsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <NavigationBar setCurrentScreen={setCurrentScreen} />
    </View>
  );
}

// Navigation that switches between Auth and App stacks
function Navigation() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f4d171" />
      </View>
    );
  }

  return user ? <AppStack /> : <AuthStack />;
}

// Main App Component
export default function App() {
  return (
     <SafeAreaView style={{ flex: 1, width: '100%' }} edges={['bottom']}>
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
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
});