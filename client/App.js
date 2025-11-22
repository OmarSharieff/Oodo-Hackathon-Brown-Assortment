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
        initialRouteName="Search" // 👈 This sets the Map page as the first screen
        screenOptions={{ 
          headerShown: false, 
          animation: 'fade'
        }}
      >
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        
        {/* Placeholders for other screens */}
        <Stack.Screen name="Notifications" component={HomeScreen} />
        <Stack.Screen name="Profile" component={HomeScreen} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}