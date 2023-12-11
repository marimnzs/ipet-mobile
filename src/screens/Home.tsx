import React, {useEffect, useMemo, useState} from 'react';
import {View, SafeAreaView} from 'react-native';
import {Button, Box, Flex, Text, ScrollView, Link, Select} from 'native-base';
import {ref, get} from 'firebase/database';
import {db} from '../firebase';
import {Header} from '../components/Header';
import {MenuProfile} from '../components/MenuProfile';
import {LocalizacaoMobile, useAuthContext} from '../contexts/AuthContext';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

interface HomeProps {
  navigation: NavigationProp<ParamListBase>;
}

interface LocalizacaoWeb {
  address: string;
  addressNumber: string;
  cep: string;
  city: string;
  complement: string;
  latitude: string;
  longitude: string;
  neighborhood: string;
  uf: string;
}
interface Cliente {
  name: string;
  cnpj: string;
  endereco: Record<string, LocalizacaoWeb>;
}

const RAIO_BUSCA_KM = 5;

export function Home({navigation}: HomeProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const {userAddresses} = useAuthContext();
  const [userSelectedAddress, setUserSelectedAddress] =
    useState<LocalizacaoMobile | null>(null);

  useEffect(() => {
    setUserSelectedAddress(userAddresses[0] || null);
  }, [userAddresses]);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const clientesRef = ref(db, 'IpetClientsWeb');
        const snapshot = await get(clientesRef);

        if (snapshot.exists()) {
          const data: Record<string, Cliente> = snapshot.val();
          const listaDeClientes = Object.values(data);

          setClientes(listaDeClientes);
        } else {
          console.log('Nenhum cliente encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  const handleAgendarClick = (cliente: Cliente) => {
    navigation.navigate('StoreProfile', {
      petshopData: cliente,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function calcularDistancia(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const raioTerra = 6371; // raio médio da Terra em quilômetros

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distancia = raioTerra * c;
    return distancia;
  }

  function toRad(valor: number): number {
    return (valor * Math.PI) / 180;
  }

  const filteredClients = useMemo(() => {
    if (!userSelectedAddress) {
      return clientes;
    }

    const estabelecimentosProximos: Cliente[] = [];

    for (const cliente of clientes) {
      const key = Object.keys(cliente.endereco)[0];
      const endereco = cliente.endereco[key];
      if (!endereco?.latitude || !endereco?.longitude) {
        continue;
      }

      const distanciaKm = calcularDistancia(
        userSelectedAddress.latitude,
        userSelectedAddress.longitude,
        Number(endereco.latitude),
        Number(endereco.longitude),
      );

      if (distanciaKm <= RAIO_BUSCA_KM) {
        estabelecimentosProximos.push(cliente);
      }
    }

    return estabelecimentosProximos;
  }, [calcularDistancia, clientes, userSelectedAddress]);

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
          <Text fontSize="16" fontWeight="medium" color="#565656">
            Lojas mais proximas a sua localizacao
          </Text>
          <Box marginBottom="15px">
            {userSelectedAddress && (
              <Select
                selectedValue={userSelectedAddress.rua}
                minWidth="350"
                accessibilityLabel="Escolha sua melhor localização"
                placeholder="Escolha sua melhor localização"
                borderColor="#B3B3B3"
                borderRadius="10px"
                mt={1}
                onValueChange={rua => {
                  const endereco = userAddresses.find(
                    address => address.rua === rua,
                  );
                  setUserSelectedAddress(endereco || null);
                }}>
                {userAddresses.map((enderecoItem, index) => {
                  return (
                    <Select.Item
                      key={index}
                      label={enderecoItem.rua}
                      value={enderecoItem.rua}
                    />
                  );
                })}
              </Select>
            )}
          </Box>
          <Box alignItems="center">
            <ScrollView maxHeight="540">
              {filteredClients.map((cliente, index) => (
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
