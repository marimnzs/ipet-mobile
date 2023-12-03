import React, {useState, useEffect} from 'react';
import {Box, Flex, Text, Button, ScrollView} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../components/MenuProfile';
import {View, SafeAreaView} from 'react-native';
import {Header} from '../components/Header';

import {ref, get} from 'firebase/database';
import {db} from '../firebase';
import {useAuthContext} from '../contexts/AuthContext';

interface ReminderProps {
  navigation: NavigationProp<ParamListBase>;
}

interface Agendamento {
  animal: string;
  dia: string;
  horario: string;
  idCliente: string;
  nomePetshop: string;
  porte: string;
  servico: string;
  valor: string;
}

export function Reminder({navigation}: ReminderProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const {user} = useAuthContext();

  useEffect(() => {
    const fetchAgendamentos = async () => {
      try {
        const clientesRef = ref(
          db,
          'IpetClientsMobile/' + user?.uid + '/agendamentos',
        );
        const snapshot = await get(clientesRef);

        if (snapshot.exists()) {
          const data: Record<string, Agendamento> = snapshot.val();
          const listaDeClientes = Object.values(data);

          setAgendamentos(listaDeClientes);
        } else {
          console.log('Nenhum cliente encontrado.');
        }
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
      }
    };

    fetchAgendamentos();
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
          <Text fontSize="18" fontWeight="medium" color="#565656">
            Meus agendamentos
          </Text>
          <ScrollView maxHeight="600">
            {agendamentos.map((agendamento, index) => (
              <Box
                key={index}
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
                    {agendamento.nomePetshop}
                  </Text>
                  <Text fontSize="12" color="#565656">
                    Dia: {agendamento.dia}
                  </Text>
                  <Text fontSize="12" color="#565656">
                    Horario: {agendamento.horario}
                  </Text>
                  <Text fontSize="12" color="#565656">
                    Valor: R${agendamento.valor}
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
            ))}
          </ScrollView>
          <Box position="absolute" bottom="2" width="350px">
            <MenuProfile navigation={navigation} />
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
