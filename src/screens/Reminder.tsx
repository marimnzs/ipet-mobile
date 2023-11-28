import React from 'react';
import {Box, Flex, Text, Button} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../components/MenuProfile';
import {View, SafeAreaView} from 'react-native';
import {Header} from '../components/Header';

interface ReminderProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Reminder({navigation}: ReminderProps) {
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
              Giovanna Laís
              </Text>
              <Text fontSize="12" color="#565656">
                Endereco: Regente Feijo, 500
              </Text>
              <Text fontSize="12" color="#565656">
                Dia: 25/11/2023
              </Text>
              <Text fontSize="12" color="#565656">
                Horario: 14:00
              </Text>
              <Flex flexDirection="row" marginTop="15px">
                <Button backgroundColor="#FC822D" borderRadius="20">
                  Remarcar
                </Button>
                <Button
                  backgroundColor="#565656"
                  borderRadius="20"
                  marginLeft="25px">
                  Cancelar agendamento
                </Button>
              </Flex>
            </Box>
          </Box>
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
              Pet Teste
              </Text>
              <Text fontSize="12" color="#565656">
                Endereco: Rua Sebastião Martins
              </Text>
              <Text fontSize="12" color="#565656">
                Dia: 25/11/2023
              </Text>
              <Text fontSize="12" color="#565656">
                Horario: 14:00
              </Text>
              <Flex flexDirection="row" marginTop="15px">
                <Button backgroundColor="#FC822D" borderRadius="20">
                  Remarcar
                </Button>
                <Button
                  backgroundColor="#565656"
                  borderRadius="20"
                  marginLeft="25px">
                  Cancelar agendamento
                </Button>
              </Flex>
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
