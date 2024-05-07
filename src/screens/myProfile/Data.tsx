import React, {useState, useEffect} from 'react';
import {Box, Flex, Input, FormControl, Stack, Button, Text} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../../components/MenuProfile';
import {Header} from '../../components/Header';
import {View, SafeAreaView} from 'react-native';
import {ref, set, get} from 'firebase/database';
import {db} from '../../firebase';
import {useAuthContext} from '../../contexts/AuthContext';
import {maskCpf} from '../../utils/masks';

interface DataProps {
  navigation: NavigationProp<ParamListBase>;
}

export function Data({navigation}: DataProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [document, setDocument] = useState('');
  const {user} = useAuthContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = ref(db, 'IpetClientsMobile/' + user?.uid);
        const docSnap = await get(docRef);

        if (docSnap.exists()) {
          const data = docSnap.val();
          setEmail(data.email || '');
          setName(data.name || '');
          setDocument(data.document || '');
        } else {
          console.log('Documento não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [user]);

  const updateFirebaseData = async () => {
    try {
      const docRef = ref(db, 'IpetClientsMobile/' + user?.uid);

      if (email || name || document) {
        await set(docRef, {
          email: email,
          name: name,
          document: document,
        });
        console.log('Dados atualizados no Firebase!');
      }
    } catch (error) {
      console.error('Erro ao atualizar dados no Firebase:', error);
    }
  };

  const handleSaveButtonClick = () => {
    updateFirebaseData();
  };

  return (
    <View>
      <SafeAreaView>
        <Flex
          height="100%"
          width="100%"
          backgroundColor="#CFD2CC"
          alignItems="center">
          <Header />
          <Text fontSize="18" fontWeight="medium" color="#565656">
            Meus dados
          </Text>
          <Box>
            <FormControl>
              <Stack mx="4">
                <FormControl.Label>Nome</FormControl.Label>
                <Input
                  type="text"
                  placeholder="nome"
                  width="350px"
                  value={name}
                  onChangeText={setName}
                />
              </Stack>
              <Stack mx="4">
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  type="text"
                  placeholder="email"
                  width="350px"
                  value={email}
                  onChangeText={setEmail}
                />
              </Stack>
              <Stack mx="4">
                <FormControl.Label>CPF</FormControl.Label>
                <Input
                  type="text"
                  placeholder="CPF"
                  width="350px"
                  value={maskCpf(document)}
                  onChangeText={setDocument}
                />
              </Stack>
            </FormControl>
          </Box>

          <Box position="absolute" bottom="2" width="350px">
            <MenuProfile navigation={navigation} />
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
