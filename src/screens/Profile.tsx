import React from 'react';
import {Box, Flex, Button, Text, Pressable} from 'native-base';
import {MenuProfile} from '../components/MenuProfile';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {View, SafeAreaView} from 'react-native';
import {Header} from '../components/Header';
import Feather from 'react-native-vector-icons/Feather';
import {useAuthContext} from '../contexts/AuthContext';

interface ProfileProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Profile({navigation}: ProfileProps) {
  const {signOut} = useAuthContext();

  return (
    <View>
      <SafeAreaView>
        <Flex
          height="100%"
          width="100%"
          backgroundColor="#CFD2CC"
          alignItems="center">
          <Header />
          <Pressable width="100%" onPress={() => navigation?.navigate('Data')}>
            <Flex
              flexDirection="row"
              alignItems="center"
              borderColor="#565656"
              borderWidth="0.5"
              paddingY="2">
              <Box marginLeft="4">
                <Feather name="file-text" size={30} color="#565656" />
              </Box>
              <Box marginLeft="4">
                <Text fontWeight="600" fontSize="15px">
                  Meus dados
                </Text>
                <Text>Minhas informações de conta</Text>
              </Box>
            </Flex>
          </Pressable>
          <Pressable
            width="100%"
            onPress={() => navigation?.navigate('Adresses')}>
            <Flex
              flexDirection="row"
              width="100%"
              alignItems="center"
              borderColor="#565656"
              borderWidth="0.5"
              paddingY="2"
              marginBottom="4">
              <Box marginLeft="4">
                <Feather name="map-pin" size={30} color="#565656" />
              </Box>
              <Box marginLeft="4">
                <Text fontWeight="600" fontSize="15px">
                  Endereços
                </Text>
                <Text>Meus endereços cadastrados</Text>
              </Box>
            </Flex>
          </Pressable>

          <Button onPress={signOut} width="350px" backgroundColor="orange.400">
            Sair
          </Button>
          <Box position="absolute" bottom="2" width="350px">
            <MenuProfile navigation={navigation} />
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
