import React from 'react';
import {useAuthContext} from '../src/contexts/AuthContext';
import LoggedRoutes from './LoggedRoutes';
import UnloggedRoutes from './UnloggedRoutes';
import {NavigationContainer} from '@react-navigation/native';
import {ActivityIndicator, View} from 'react-native';

const Routes = () => {
  const {isLoggedIn, initializing} = useAuthContext();

  if (initializing) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <LoggedRoutes /> : <UnloggedRoutes />}
    </NavigationContainer>
  );
};

export default Routes;
