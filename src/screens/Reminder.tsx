import React, {useState, useEffect} from 'react';
import {Box, Flex, Text, Button, ScrollView, Select} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../components/MenuProfile';
import {View, SafeAreaView} from 'react-native';
import {Header} from '../components/Header';

import {ref, get, set} from 'firebase/database';
import {db} from '../firebase';
import {useAuthContext} from '../contexts/AuthContext';

interface ReminderProps {
  navigation: NavigationProp<ParamListBase>;
}
interface Agendamento {
  id: string;
  animal: string;
  dia: string;
  horario: string;
  idCliente: string;
  nomePetshop: string;
  porte: string;
  servico: string;
  valor: string;
  status: boolean;
  cancelado: boolean;
}

export function Reminder({navigation}: ReminderProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const {user} = useAuthContext();

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

        const agendamentosAtivos = listaDeClientes.filter(agendamento => {
          return agendamento.status === true && agendamento.cancelado === false;
        });

        setAgendamentos(agendamentosAtivos);
      } else {
        console.log('Nenhum cliente encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
  }, [user?.uid]);

  const cancelarAgendamento = (agendamento: Agendamento) => async () => {
    if (!agendamento.id || !agendamento.nomePetshop) {
      return;
    }

    const cancelarPetshop = async () => {
      const agendamentosPetshopRef = ref(
        db,
        'IpetClientsWeb/' + agendamento.nomePetshop + '/agendamentos',
      );

      const snapshot = await get(agendamentosPetshopRef);
      if (!snapshot.exists()) {
        return;
      }

      const agendamentoPetshop = Object.entries(snapshot.val()).find(entry => {
        const ag = entry[1] as Agendamento;
        return ag.id === agendamento.id;
      });

      if (!agendamentoPetshop) {
        return;
      }

      const docRef = ref(
        db,
        'IpetClientsWeb/' +
          agendamento.nomePetshop +
          '/agendamentos' +
          `/${agendamentoPetshop[0]}`,
      );

      await set(docRef, {
        ...(agendamentoPetshop[1] as Agendamento),
        cancelado: true,
      });
      console.log('Dados atualizados no Firebase!');
    };

    const cancelarReminder = async () => {
      const clientesRef = ref(
        db,
        'IpetClientsMobile/' + user?.uid + '/agendamentos',
      );
      const snapshot = await get(clientesRef);
      if (!snapshot.exists()) {
        return;
      }

      const reminder = Object.entries(snapshot.val()).find(entry => {
        const ag = entry[1] as Agendamento;
        return ag.id === agendamento.id;
      });

      if (!reminder) {
        return;
      }

      const docRef = ref(
        db,
        'IpetClientsMobile/' + user?.uid + '/agendamentos' + `/${reminder[0]}`,
      );

      await set(docRef, {
        ...(reminder[1] as Agendamento),
        cancelado: true,
      });
      console.log('Dados atualizados no Firebase!');
    };

    await Promise.all([cancelarPetshop(), cancelarReminder()]);
    await fetchAgendamentos();
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
                    <Button
                      backgroundColor="#565656"
                      borderRadius="20"
                      onPress={cancelarAgendamento(agendamento)}>
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
