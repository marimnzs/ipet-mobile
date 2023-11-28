import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {Box, Flex, IconButton} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface MenuProfileProps {
  navigation?: NavigationProp<ParamListBase>;
}

export function MenuProfile({navigation}: MenuProfileProps) {
  return (
    <>
      <Box backgroundColor="#565656" padding="2" borderRadius="30">
        <Flex flexDirection="row" justifyContent="space-around">
          <IconButton
            onPress={() => navigation?.navigate('Home')}
            _icon={{
              as: Feather,
              name: 'home',
              size: '6',
              color: '#FC822D',
            }}
          />
          <IconButton
            onPress={() => navigation?.navigate('MyLocalization')}
            _icon={{
              as: Feather,
              name: 'map-pin',
              size: '6',
              color: '#FC822D',
            }}
          />
          <IconButton
            onPress={() => navigation?.navigate('Reminder')}
            _icon={{
              as: Feather,
              name: 'calendar',
              size: '6',
              color: '#FC822D',
            }}
          />
          <IconButton
            onPress={() => navigation?.navigate('Profile')}
            _icon={{
              as: Feather,
              name: 'user',
              size: '6',
              color: '#FC822D',
            }}
          />
        </Flex>
      </Box>
    </>
  );
}
