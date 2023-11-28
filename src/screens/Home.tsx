import React, {useEffect, useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {Button, Box, Flex, Text, ScrollView, Link} from 'native-base';
import {ref, get} from 'firebase/database';
import {db} from '../firebase';
import {Header} from '../components/Header';
import {MenuProfile} from '../components/MenuProfile';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useStore} from '../contexts/StoreContext';

interface HomeProps {
  navigation: NavigationProp<ParamListBase>;
}

interface Cliente {
  name: string;
  cnpj: string;
}

export function Home({navigation}: HomeProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const {setStore} = useStore();

  useEffect(() => {
    const clientesRef = ref(db, 'IpetClientsWeb');

    get(clientesRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data: Record<string, Cliente> = snapshot.val();
          const listaDeClientes = Object.values(data);

          // Atualize o contexto usando a função de estado correta
          setStore(
            prevStore =>
              ({
                ...prevStore,
                cliente: listaDeClientes,
              } as StoreData),
          );
          // Atualize também o estado local
          setClientes(listaDeClientes);
        } else {
          console.log('Nenhum cliente encontrado.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
      });
  }, [setStore]);

  useEffect(() => {
    const clientesRef = ref(db, 'IpetClientsWeb');

    get(clientesRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data: Record<string, Cliente> = snapshot.val();
          const listaDeClientes = Object.values(data);

          const agendaId = Object.keys(listaDeClientes[0].agenda)[0];
          const result = listaDeClientes[0].agenda[agendaId]
          console.log(result);

          setClientes(listaDeClientes);
        } else {
          console.log('Nenhum cliente encontrado.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar clientes:', error);
      });
  }, []);

  const handleAgendarClick = cliente => {
    console.log(cliente)
    navigation.navigate('StoreProfile', {
      petshopData: cliente,
    });
  };

  return (
    <View>
      <SafeAreaView>
        <Flex
          height="100%"
          width="100%"
          backgroundColor="#CFD2CC"
          alignItems="center">
          <Box>
            <Header />
          </Box>

          <Flex flexDirection="row" justifyContent="space-around" marginTop="5">
            <Box
              backgroundColor="#FC822D"
              fontFamily="Inter"
              padding="3"
              borderRadius="20"
              marginRight="4">
              <Text fontSize="12" fontWeight="medium">
                Aberto
              </Text>
            </Box>

            <Box
              backgroundColor="#FC822D"
              fontFamily="Inter"
              padding="3"
              borderRadius="20"
              marginRight="4">
              <Text fontSize="12" fontWeight="medium">
                Mais próximos
              </Text>
            </Box>

            <Box
              backgroundColor="#FC822D"
              fontFamily="Inter"
              padding="3"
              borderRadius="20">
              <Text fontSize="12" fontWeight="medium">
                Melhor avaliado
              </Text>
            </Box>
          </Flex>

          <Box alignItems="center">
            <ScrollView maxHeight="540">
              {clientes.map((cliente, index) => (
                <Link
                  key={index}
                  onPress={() =>
                    navigation.navigate('StoreProfile', {storeData: cliente})
                  }>
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
                        {cliente.name}
                      </Text>
                      <Text fontSize="12" color="#565656">
                        {cliente.cnpj}
                      </Text>
                    </Box>

                    <Button
                      backgroundColor="#FC822D"
                      borderRadius="20"
                      onPress={() => handleAgendarClick(cliente)}>
                      Agendar
                    </Button>
                  </Box>
                </Link>
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
