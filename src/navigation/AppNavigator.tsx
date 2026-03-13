import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import SessionScreen from '../screens/SessionScreen';
import HomeworkScreen from '../screens/HomeworkScreen';
import ProgressScreen from '../screens/ProgressScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, { focused: IoniconName; unfocused: IoniconName }> = {
  Home: { focused: 'home', unfocused: 'home-outline' },
  Session: { focused: 'headset', unfocused: 'headset-outline' },
  Hausaufgaben: { focused: 'book', unfocused: 'book-outline' },
  Fortschritt: { focused: 'bar-chart', unfocused: 'bar-chart-outline' },
  Einstellungen: { focused: 'settings', unfocused: 'settings-outline' },
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = TAB_ICONS[route.name];
          const iconName = focused ? icons.focused : icons.unfocused;
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4a90d9',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#e8e8e8',
          paddingBottom: 4,
          height: 60,
        },
        headerStyle: { backgroundColor: '#1e3a5f' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Session" component={SessionScreen} options={{ title: 'Session' }} />
      <Tab.Screen name="Hausaufgaben" component={HomeworkScreen} options={{ title: 'Hausaufgaben' }} />
      <Tab.Screen name="Fortschritt" component={ProgressScreen} options={{ title: 'Fortschritt' }} />
      <Tab.Screen name="Einstellungen" component={SettingsScreen} options={{ title: 'Einstellungen' }} />
    </Tab.Navigator>
  );
}
