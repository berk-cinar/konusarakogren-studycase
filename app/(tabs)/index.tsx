import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FontAwesome } from '@expo/vector-icons';

import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView, StyleSheet } from 'react-native';
import store from '../store/store';
import Homepage from "../pages/Homepage";
import Details from '../pages/Details';
import Character from '../pages/Character';
import Favorites from '../pages/Favorites';

const queryClient = new QueryClient();
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export type RootStackParamList = {
  Home: undefined;
  Details: { characterId: string };
  Character: { characterId: string };
  Favorites: undefined;
};

function DetailsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Homepage" component={Homepage} options={{ headerShown: false }} />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{
          headerStyle: {
            height: 80,
          },
          headerTitleStyle: {
            fontSize: 22,
            marginTop: -2
          },
        }}
      />
      <Stack.Screen options={{
        headerStyle: {
          height: 80,
        },
        headerTitleStyle: {
          fontSize: 22,
          marginTop: -2
        },
      }} name="Character" component={Character} />
    </Stack.Navigator>
  );
}

export default function Index() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaView style={styles.container}>
          <Tab.Navigator>
            <Tab.Screen
              name="Home"
              component={DetailsStack}
              options={{
                headerShown: false,
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="home" color={color} size={size} />
                ),
              }}
            />
            <Tab.Screen
              name="Favorites"
              component={Favorites}
              options={{
                tabBarLabel: 'Favorites',
                tabBarIcon: ({ color, size }) => (
                  <FontAwesome name="star" color={color} size={size} />
                ),
              }}
            />
          </Tab.Navigator>
        </SafeAreaView>
      </QueryClientProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
