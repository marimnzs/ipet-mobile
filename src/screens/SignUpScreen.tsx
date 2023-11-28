import React, {useState} from 'react';
import {View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button, Input, Box, Text, Link} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface SignUpScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

export function SignUpScreen({navigation}: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function signUp() {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
        navigation.navigate('MyLocalization');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
        }

        console.error(error);
      });
  }

  return (
    <View>
      <Box height="full" justifyContent={'center'} padding="4">
        <Text
          textAlign="center"
          fontWeight="bold"
          letterSpacing="1.0"
          fontSize="50"
          color="#565656">
          ipet
        </Text>
        <Input
          placeholder="e-mail"
          value={email}
          onChangeText={setEmail}
          marginTop="4"
        />
        <Input
          placeholder="senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          marginTop="2"
        />

        <Button
          onPress={signUp}
          borderRadius="8"
          marginTop="4"
          backgroundColor="orange.400">
          Cadastrar
        </Button>

        <Box alignItems="center" marginTop="4">
          <Link onPress={() => navigation.navigate('SignInScreen')}>
            Voltar para o login
          </Link>
        </Box>
      </Box>
    </View>
  );
}
