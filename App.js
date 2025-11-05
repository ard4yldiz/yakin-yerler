import React from 'react';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SettingsProvider } from './src/contexts/SettingsContext';
import MainScreen from './src/screens/MainScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, focused }) => (
  <Text style={{ fontSize: 24, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
);

export default function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <StatusBar style="light" backgroundColor="#007AFF" />
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={{
              tabBarActiveTintColor: '#007AFF',
              tabBarInactiveTintColor: '#8E8E93',
              tabBarStyle: {
                backgroundColor: '#FFFFFF',
                borderTopWidth: 1,
                borderTopColor: '#E5E5EA',
                paddingBottom: 25,
                paddingTop: 10,
                height: 85,
                position: 'absolute',
                bottom: 0,
              },
              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
                marginBottom: 5,
              },
              headerStyle: {
                backgroundColor: '#007AFF',
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
                fontSize: 18,
              },
            }}
          >
            <Tab.Screen
              name="Ana Sayfa"
              component={MainScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="🏠" focused={focused} />,
                headerTitle: '📍 Yakınımdaki Yerler',
              }}
            />
            <Tab.Screen
              name="Favoriler"
              component={FavoritesScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="❤️" focused={focused} />,
                headerTitle: '❤️ Favorilerim',
              }}
            />
            <Tab.Screen
              name="Ayarlar"
              component={SettingsScreen}
              options={{
                tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" focused={focused} />,
                headerTitle: '⚙️ Ayarlar',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}
