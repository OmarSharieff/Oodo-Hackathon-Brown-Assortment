import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import Screens
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/home';
import SearchScreen from './screens/search';
import EventsScreen from './screens/events';

const Stack = createNativeStackNavigator();

// Auth Stack (when user is NOT logged in)
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}

// App Stack (when user IS logged in)
function AppStack() {
  return (
    <Stack.Navigator
      initialRouteName="Search" // Map screen is the first screen after login
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      {/* Map Screen - First Screen */}
      <Stack.Screen name="Search" component={SearchScreen} />
      
      {/* Home/Feed Screen */}
      <Stack.Screen name="Home" component={HomeScreen} />
      
      {/* Events Screen */}
      <Stack.Screen name="Events" component={EventsScreen} />
      
      {/* Placeholder screens - replace with actual components later */}
      <Stack.Screen name="Notifications" component={HomeScreen} />
      <Stack.Screen name="Profile" component={HomeScreen} />
    </Stack.Navigator>
  );
}

// Navigation that switches between Auth and App stacks
function Navigation() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f4d171" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

// Main App Component
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <View style={styles.container}>
          <Navigation />
          <StatusBar style="auto" />
        </View>
      </AuthProvider>
    </SafeAreaProvider>
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