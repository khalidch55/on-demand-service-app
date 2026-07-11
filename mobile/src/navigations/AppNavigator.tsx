import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/theme';

import HomeScreen from '../screens/HomeScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import BookingHistoryScreen from '../screens/BookingHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

type HomeStackParamList = {
  ServicesList: undefined;
  ServiceDetail: { serviceId: number };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTitleStyle: { color: colors.text, fontWeight: '600' } }}>
      <HomeStack.Screen name="ServicesList" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="ServiceDetail" component={ServiceDetailScreen} options={{ title: 'Book Service' }} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Bookings') iconName = focused ? 'calendar' : 'calendar-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { color: colors.text, fontSize: 18, fontWeight: '600' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ tabBarLabel: 'Services' }} />
      <Tab.Screen name="Bookings" component={BookingHistoryScreen} options={{ title: 'My Bookings' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}