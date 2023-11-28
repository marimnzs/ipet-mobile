import React from 'react';
import {Box, Flex, Text} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../../components/MenuProfile';
import {Header} from '../../components/Header';
import {View, SafeAreaView} from 'react-native';

interface AdressesProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Adresses({navigation}: AdressesProps) {
  return (
    <View>
      <SafeAreaView>
        <Flex
          height="100%"
          width="100%"
          backgroundColor="#CFD2CC"
          alignItems="center">
          <Header />
          <Box
            flexDirection="row"
            justifyContent="space-between"
            borderRadius="10"
            backgroundColor="#F3F6F0"
            borderColor="#F3F6F0"
            padding="5"
            width="350px"
            marginTop="5">
            <Box>
              <Text fontWeight="medium" fontSize="18" color="#565656">
                Endereco
              </Text>
              <Text fontSize="12" color="#565656">
                Rua
              </Text>
              <Text fontSize="12" color="#565656">
                Numero
              </Text>
              <Text fontSize="12" color="#565656">
                CEP
              </Text>
            </Box>
          </Box>
          <Box position="absolute" bottom="2" width="350px">
            <MenuProfile navigation={navigation} />
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
