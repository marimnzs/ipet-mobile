import React from 'react';
import {Box, Flex} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../../components/MenuProfile';
import {Header} from '../../components/Header';
import {View, SafeAreaView} from 'react-native';

interface PaymentsProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Payments({navigation}: PaymentsProps) {
  return (
    <View>
      <SafeAreaView>
        <Flex
          height="100%"
          width="100%"
          backgroundColor="#CFD2CC"
          alignItems="center">
          <Header />
          <Box position="absolute" bottom="2" width="350px">
            <MenuProfile navigation={navigation} />
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
