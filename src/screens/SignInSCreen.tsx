import React, {useState} from 'react';
import {View} from 'react-native';
import {Button, Input, Link, Box, Text} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useAuthContext} from '../contexts/AuthContext';

interface SignInScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

export function SignInScreen({navigation}: SignInScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {signIn} = useAuthContext();

  const handleSignIn = async () => {
    await signIn(email, password);
    navigation.navigate('Home');
  };

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
          onPress={handleSignIn}
          borderRadius="8"
          marginTop="4"
          backgroundColor="orange.400">
          Entrar
        </Button>

        <Box alignItems="center" marginTop="4">
          <Link onPress={() => navigation.navigate('SignUpScreen')}>
            Cadastrar
          </Link>
        </Box>
      </Box>
    </View>
  );
}
