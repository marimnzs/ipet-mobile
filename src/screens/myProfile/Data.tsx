import React from 'react';
import {Box, Flex, Input, FormControl, Stack, Button} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../../components/MenuProfile';
import {Header} from '../../components/Header';
import {View, SafeAreaView} from 'react-native';

interface DataProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Data({navigation}: DataProps) {
  return (
    <View>
      <SafeAreaView>
        <Flex
          height="100%"
          width="100%"
          backgroundColor="#CFD2CC"
          alignItems="center">
          <Header />

          <Box>
            <FormControl isRequired>
              <Stack mx="4">
                <FormControl.Label>Nome</FormControl.Label>
                <Input type="text" placeholder="nome" width="350px" />
                <FormControl.HelperText>
                  Must be atleast 6 characters.
                </FormControl.HelperText>
                <FormControl.ErrorMessage>
                  Atleast 6 characters are required.
                </FormControl.ErrorMessage>
              </Stack>
              <Stack mx="4">
                <FormControl.Label>Email</FormControl.Label>
                <Input type="text" placeholder="email" width="350px" />
                <FormControl.HelperText>
                  Must be atleast 6 characters.
                </FormControl.HelperText>
                <FormControl.ErrorMessage>
                  Atleast 6 characters are required.
                </FormControl.ErrorMessage>
              </Stack>
              <Stack mx="4">
                <FormControl.Label>CPF</FormControl.Label>
                <Input type="text" placeholder="nome" width="350px" />
                <FormControl.HelperText>
                  Must be atleast 6 characters.
                </FormControl.HelperText>
                <FormControl.ErrorMessage>
                  Atleast 6 characters are required.
                </FormControl.ErrorMessage>
              </Stack>
            </FormControl>
          </Box>
          <Button
            width="200px"
            backgroundColor="#FC822D"
            borderRadius="20"
            position="absolute"
            bottom="24">
            Salvar
          </Button>
          <Box position="absolute" bottom="2" width="350px">
            <MenuProfile navigation={navigation} />
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
