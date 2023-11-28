import {NativeBaseProvider} from 'native-base';
import React from 'react';
import {AuthContextProvider} from './src/contexts/AuthContext';
import {StoreProvider} from './src/contexts/StoreContext';
import Routes from './Routes';

const App = () => {
  return (
    <NativeBaseProvider>
      <AuthContextProvider>
        <StoreProvider>
          <Routes />
        </StoreProvider>
      </AuthContextProvider>
    </NativeBaseProvider>
  );
};

export default App;
