import { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';

import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/home';
import SearchScreen from './screens/search';
import EventsScreen from './screens/events';
import NavigationBar from './components/navigationBar';
import ProfileScreen from './screens/Profile';
import PostReviewScreen from './screens/PostReview';

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
      case 'Map':
        return <SearchScreen/>;
      case 'Profile':
        return <ProfileScreen/>;
      case 'Post':
        return <PostReviewScreen/>;
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