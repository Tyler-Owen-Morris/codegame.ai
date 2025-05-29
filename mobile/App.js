import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import our screens
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import PuzzleScreen from './src/screens/PuzzleScreen';

// Import theme
import theme from './src/theme';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor={theme.colors.background} />

        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
              borderBottomWidth: 1,
              borderBottomColor: theme.colors.border,
            },
            headerTintColor: theme.colors.textPrimary,
            headerTitleStyle: {
              fontWeight: theme.typography.fontWeight.semibold,
              fontSize: theme.typography.fontSize.lg,
            },
            headerBackTitleVisible: false,
            cardStyle: {
              backgroundColor: theme.colors.background,
            },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: 'CodeGame.ai',
              headerStyle: {
                backgroundColor: theme.colors.surface,
                borderBottomWidth: 0,
              },
            }}
          />

          <Stack.Screen
            name="Scan"
            component={ScanScreen}
            options={{
              title: 'Scan QR Code',
              headerStyle: {
                backgroundColor: theme.colors.background,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              },
            }}
          />

          <Stack.Screen
            name="Puzzle"
            component={PuzzleScreen}
            options={{
              title: 'Solve Puzzle',
              headerStyle: {
                backgroundColor: theme.colors.background,
                borderBottomWidth: 1,
                borderBottomColor: theme.colors.border,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
