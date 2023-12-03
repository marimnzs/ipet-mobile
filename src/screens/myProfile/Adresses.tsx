import React, {useEffect, useState} from 'react';
import {Box, Flex, Text, Button, ScrollView} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../../components/MenuProfile';
import {Header} from '../../components/Header';
import {View, SafeAreaView} from 'react-native';
import {ref, get} from 'firebase/database';
import {db} from '../../firebase';
import {useAuthContext} from '../../contexts/AuthContext';

interface AdressesProps {
  navigation: NavigationProp<ParamListBase>;
}

interface Endereco {
  rua: string;
  latitude: string;
  longitude: string;
}

export function Adresses({navigation}: AdressesProps) {
  const [endereco, setEndereco] = useState<Endereco[]>([]);
  const {user} = useAuthContext();

  useEffect(() => {
    const fetchEndereco = async () => {
      try {
        const clientesRef = ref(
          db,
          'IpetClientsMobile/' + user?.uid + '/enderecos',
        );
        const snapshot = await get(clientesRef);

        if (snapshot.exists()) {
          const data: Record<string, Endereco> = snapshot.val();
          const listaDeEndereco = Object.values(data);

          setEndereco(listaDeEndereco);
        } else {
          console.log('Nenhum cliente encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchEndereco();
  }, [user?.uid]);

  return (
    <View>
      <SafeAreaView>
        <Flex
          height="100%"
          width="100%"
          backgroundColor="#CFD2CC"
          alignItems="center">
          <Header />
          <Box position="absolute" right="6" top="16">
            <Button
              backgroundColor="#FC822D"
              borderRadius="20"
              onPress={() => navigation.navigate('MyLocalization')}>
              Novo endereço
            </Button>
          </Box>
          <Box marginTop="8">
            <ScrollView maxHeight="600">
              {endereco.map((enderecos, index) => (
                <Box
                  key={index}
                  borderRadius="10"
                  backgroundColor="#F3F6F0"
                  borderColor="#F3F6F0"
                  padding="5"
                  width="350px"
                  marginTop="5">
                  <Box>
                    <Text fontWeight="medium" fontSize="18" color="#565656">
                      Endereço
                    </Text>
                    <Text fontSize="md" color="#565656">
                      Rua: {enderecos.rua}
                    </Text>
                  </Box>
                </Box>
              ))}
            </ScrollView>
          </Box>
          <Box position="absolute" bottom="2" width="350px">
            <MenuProfile navigation={navigation} />
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
