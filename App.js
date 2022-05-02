import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';

import { withAuthenticator } from 'aws-amplify-react-native/dist/Auth';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';

import CallList from './src/components/CallList';
import CallDelete from './src/components/CallDelete';


import { Box, Button, Dialog } from '@react-native-material/core';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import PatientList from './src/components/PatientList';

const Stack = createNativeStackNavigator();


Amplify.configure(awsconfig);
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});


async function signOut() {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log('error signing out: ', error);
  }
}


function CallsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch' }}>
      <CallList />
      {/* <CallDelete /> */}

    </View>
  );
}

function PatientScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <PatientList />
      <Text >hello</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
}

const Tab = createBottomTabNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Calls') {
              iconName = focused
                ? 'ios-information-circle'
                : 'ios-information-circle-outline';
            } else if (route.name === 'Patient') {
              iconName = focused ? 'ios-person' : 'ios-person-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'deepskyblue',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Calls" component={CallsScreen} />
        <Tab.Screen name="Patient" component={PatientScreen} />

      </Tab.Navigator>
    </NavigationContainer>

  );
}

const signUpConfig = {
  header: 'My Customized Sign Up',
  hideAllDefaults: true,
  defaultCountryCode: '1',
  signUpFields: [
    {
      label: 'Full name',
      key: 'name',
      required: true,
      displayOrder: 1,
      type: 'string'
    },
    {
      label: 'Password',
      key: 'password',
      required: true,
      displayOrder: 3,
      type: 'password'
    },
    {
      label: 'Email',
      key: 'email',
      required: true,
      displayOrder: 4,
      type: 'string'
    }
  ]
};
const usernameAttributes = 'Email';

export default withAuthenticator(App, {
  signUpConfig,
  usernameAttributes
});