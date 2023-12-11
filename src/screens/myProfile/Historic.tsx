import React, {useState, useEffect} from 'react';
import {Box, Flex, Text, ScrollView, Select} from 'native-base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {MenuProfile} from '../../components/MenuProfile';
import {Header} from '../../components/Header';
import {View, SafeAreaView} from 'react-native';
import {useAuthContext} from '../../contexts/AuthContext';
import {ref, get, set, push} from 'firebase/database';
import {db} from '../../firebase';

interface HistoricProps {
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
  avaliado?: boolean;
}

export function Historic({navigation}: HistoricProps) {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [feedback, setFeedback] = useState<string>('');
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
          return (
            agendamento.status === false && agendamento.cancelado === false
          );
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

  const avaliarAgendamento =
    (agendamento: Agendamento) => async (valor: string) => {
      const clientesRef = ref(
        db,
        'IpetClientsWeb/' + agendamento.nomePetshop + '/agendamentos',
      );
      const snapshot = await get(clientesRef);
      if (!snapshot.exists()) {
        return;
      }

      const agendamentosPetshop = snapshot.val() as Agendamento[];

      const agendamentoPetshop = Object.entries(agendamentosPetshop).find(
        entry => {
          return entry[1].id === agendamento.id;
        },
      );
      if (!agendamentoPetshop) {
        return;
      }

      const feedbacksPetshopRef = push(
        ref(db, 'IpetClientsWeb/' + agendamento.nomePetshop + '/feedbacks'),
      );

      await set(feedbacksPetshopRef, {
        nota: valor,
        id: agendamentoPetshop[1].id,
      });

      // const agendamentosRef = ref(
      //   db,
      //   'IpetClientsMobile/' +
      //     user?.uid +
      //     '/agendamentos' +
      //     `/${agendamento.id}`,
      // );

      // await set(agendamentosRef, {
      //   ...(agendamento as Agendamento),
      //   avaliado: true,
      // });
      // await fetchAgendamentos();
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
            Histórico de agendamentos
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
                </Box>
                {!agendamento.avaliado && (
                  <Select
                    minWidth="150"
                    accessibilityLabel="Escolha um dia"
                    placeholder="Avaliar serviço"
                    borderColor="#B3B3B3"
                    borderRadius="10px"
                    _selectedItem={{
                      bg: 'amber.600',
                    }}
                    mt={1}
                    onValueChange={avaliarAgendamento(agendamento)}>
                    <Select.Item label="1 - Mal" value="1" />
                    <Select.Item label="2 - Regular" value="2" />
                    <Select.Item label="3 - Bom" value="3" />
                    <Select.Item label="4 - Muito Bom" value="4" />
                    <Select.Item label="5 - Excelente" value="5" />
                  </Select>
                )}
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
