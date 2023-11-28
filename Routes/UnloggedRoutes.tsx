import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SignUpScreen} from '../src/screens/SignUpScreen';
import {SignInScreen} from '../src/screens/SignInSCreen';

const Stack = createNativeStackNavigator();

const UnloggedRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignInScreen"
        component={SignInScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default UnloggedRoutes;
