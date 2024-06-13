import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splashscreen from './screens/splash';
import Signup from './screens/signup';
import LoginPage from './screens/loginpage';
import Intro from './screens/intro';
import Dscrn from './screens/Dscrn';
import Pass from './screens/Pass';
import Driver from './screens/Driver';
import PassengerMenu from './screens/PassenegerMenu';
import PassengerHomePage from './screens/PHomeScreen';
import Details from './screens/details';
import Status from './screens/Status';
import 'react-native-gesture-handler';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splashscreen"
          component={Splashscreen}
          options={{ headerShown: false }} // Hide the header for Splashscreen
        />
        <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }}/>
        <Stack.Screen name="Signup" component={Signup} options={{ headerShown: false }}/>
        <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }}/>
        <Stack.Screen name="Dscrn" component={Dscrn} options={{ headerShown: false }}/>
        <Stack.Screen name="Details" component={Details}options={{ headerShown: false }} />
        <Stack.Screen name="PassengerHomePage" component={PassengerHomePage} options={{ headerShown: false }}/>
        <Stack.Screen name="Status" component={Status} options={{ headerShown: false }}/>
        <Stack.Screen name="Pass" component={Pass} options={{ headerShown: false }}/>
        <Stack.Screen name="Driver" component={Driver} options={{ headerShown: false }}/>
        <Stack.Screen name="PassengerMenu" component={PassengerMenu} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
