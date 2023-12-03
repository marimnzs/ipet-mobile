import React, {useState} from 'react';
import {View} from 'react-native';
import auth from '@react-native-firebase/auth';
import {Button, Input, Box, Text, Link} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {ref, set} from 'firebase/database';
import {db} from '../firebase';

interface SignUpScreenProps {
  navigation: NavigationProp<ParamListBase>;
}

export function SignUpScreen({navigation}: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');

  function signUp() {
    if (!email || !password || !name || !document) {
      console.log('Por favor, preencha todos os campos.');
      return;
    }

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        return set(ref(db, 'IpetClientsMobile/' + user.uid), {
          userId: user.uid,
          document: document,
          email: email,
          name: name,
        });
      })
      .then(() => {
        console.log('Dados do usuário adicionados ao banco de dados!');
        navigation.navigate('MyLocalization');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('Este endereço de e-mail já está em uso!');
        } else if (error.code === 'auth/invalid-email') {
          console.log('Endereço de e-mail inválido!');
        } else {
          console.error(error);
        }
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
        <Input
          placeholder="nome"
          value={name}
          onChangeText={setName}
          marginTop="2"
        />
        <Input
          placeholder="CPF"
          value={document}
          onChangeText={setDocument}
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
