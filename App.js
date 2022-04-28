import { withAuthenticator } from 'aws-amplify-react-native/dist/Auth';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './src/aws-exports';
import { Box, Button } from '@react-native-material/core';
import CallList from './src/components/CallList';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CallDelete from './src/components/CallDelete';

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

const HomeScreen = ({ navigation }) => {
  return (
    <>
      <Box h={5} />
      <CallList navigation={navigation} />
      <CallDelete />
    </>

  );
};
const ProfileScreen = ({ navigation, route }) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Nurse Call System' }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    // <Button title="Sign Out" onPress={signOut} />
    //   <StatusBar style="auto" />

  );
}

export default withAuthenticator(App);
