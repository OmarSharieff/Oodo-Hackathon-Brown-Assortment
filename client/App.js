import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import Screens
import HomeScreen from './screens/home.js';
import SearchScreen from './screens/search.js';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Search" // Map page is the first screen
        screenOptions={{ 
          headerShown: false, 
          animation: 'fade'
        }}
      >
        {/* Map Screen - First Screen */}
        <Stack.Screen name="Search" component={SearchScreen} />
        
        {/* Home/Feed Screen */}
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Placeholder screens - replace with actual components later */}
        <Stack.Screen name="Notifications" component={HomeScreen} />
        <Stack.Screen name="Profile" component={HomeScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}