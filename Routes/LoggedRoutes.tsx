import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Home} from '../src/screens/Home';
import {Reminder} from '../src/screens/Reminder';
import {Profile} from '../src/screens/Profile';
import {Scheduling} from '../src/screens/Scheduling';
import {MyLocalization} from '../src/screens/MyLocalization';
import {Data} from '../src/screens/myProfile/Data';
import {Adresses} from '../src/screens/myProfile/Adresses';
import {Historic} from '../src/screens/myProfile/Historic';
import {Payments} from '../src/screens/myProfile/Payments';
import {StoreProfile} from '../src/screens/StoreProfile';

const Stack = createNativeStackNavigator();

const LoggedRoutes = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Reminder"
        component={Reminder}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Scheduling"
        component={Scheduling}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MyLocalization"
        component={MyLocalization}
        options={{
          headerShown: false,
        }}
      />

      {/* menu profile */}
      <Stack.Screen
        name="Data"
        component={Data}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Adresses"
        component={Adresses}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Historic"
        component={Historic}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Payments"
        component={Payments}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="StoreProfile"
        component={StoreProfile}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default LoggedRoutes;
