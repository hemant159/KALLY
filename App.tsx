import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import HomeScreen from './src/screens/HomeScreen';
import DayView from './src/screens/DayView';
import YearScreen from './src/screens/YearScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import { Colors } from './src/theme';

export type RootStackParamList = {
  Home: { scrollToYear?: number; scrollToMonth?: number } | undefined;
  NewAppointment: { date?: string };
  AppointmentDetail: { appointmentId: string };
  DayView: { date: string };
  YearScreen: { initialYear: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const KallyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.blue,
    background: '#F2F2F7',
    card: '#FFFFFF',
    text: '#000000',
    border: '#E5E5EA',
    notification: Colors.red,
  },
};

const KallyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: Colors.blue,
    background: '#000000',
    card: '#1C1C1E',
    text: '#FFFFFF',
    border: '#38383A',
    notification: Colors.red,
  },
};

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <NavigationContainer theme={isDark ? KallyDarkTheme : KallyLightTheme}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
              name="NewAppointment"
              component={PlaceholderScreen}
              options={{ presentation: 'modal', headerShown: false }}
            />
            <Stack.Screen
              name="AppointmentDetail"
              component={PlaceholderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DayView"
              component={DayView}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="YearScreen"
              component={YearScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
