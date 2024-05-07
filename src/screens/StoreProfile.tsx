import React, {useState, useEffect} from 'react';
import {Box, Flex, Button, Text, useToast} from 'native-base';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  getDay,
  addMonths,
} from 'date-fns';
import {NavigationProp} from '@react-navigation/native';
import {MenuProfile} from '../components/MenuProfile';
import {View, SafeAreaView} from 'react-native';
import {Header} from '../components/Header';
import {Select} from 'native-base';
import {ref, get, push, set} from 'firebase/database';
import {useAuthContext} from '../contexts/AuthContext';
import {pt} from 'date-fns/locale';
import db from '../firebase';

interface Servico {
  animais: string[];
  descricao: string;
  porte: string[];
  preco: string;
  servicos: string;
  tempo: string;
  numeroDeServicos: number;
}

interface Agendamento {
  animal: string;
  dia: string;
  horario: string;
  idCliente: string;
  nomeCliente: string;
  porte: string;
  servico: string;
  status: boolean;
}

interface ServicoProps {
  petshopData: PetshopData;
}

interface StoreProfileProps {
  navigation: NavigationProp<Params>;
  route: any;
}

export function StoreProfile({route, navigation}: StoreProfileProps) {
  const {petshopData} = route.params;
  const {user} = useAuthContext();
  const toast = useToast();
  const [name, setName] = useState('');
  const [servico, setServico] = useState<Servico[]>([]);
  const [agendamentoAtivos, setAgendamentoAtivos] = useState<Agendamento[]>([]);
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('');
  const [statusAgendamento, setStatusAgendamento] = useState<boolean>(true);
  const [statusCancelado, setStatusCancelado] = useState<boolean>(false);
  const [animalSelecionado, setAnimalSelecionado] = useState<string>('');
  const [porteSelecionado, setPorteSelecionado] = useState<string>('');
  const [availableDays, setAvailableDays] = useState<
    {label: string; value: string; isToday: boolean}[]
  >([]);
  const [animais, setAnimais] = useState<string[]>([]);
  const [portes, setPortes] = useState<string[]>([]);
  const [tempoServico, setTempoServico] = useState<string>('');
  const [valorServico, setValorServico] = useState<string>('');
  const [numeroServico, setNumeroServico] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  //renderiza apenas o horarios disponiveis
  const generateTimeOptions = (): string[] => {
    const timeOptions: string[] = [];

    if (
      petshopData.agenda &&
      servicoSelecionado &&
      selectedDay &&
      numeroServico
    ) {
      const servicoSelecionadoObj = servico.find(
        item => item.servicos === servicoSelecionado,
      );

      if (servicoSelecionadoObj && servicoSelecionadoObj.tempo) {
        const tempoDoServicoEmMinutos = parseInt(servicoSelecionadoObj.tempo);

        Object.values(petshopData.agenda).forEach((agendaItem: any) => {
          if (agendaItem.horarioInicio && agendaItem.horarioFim) {
            const startTime = new Date(
              `2023-01-01 ${agendaItem.horarioInicio}`,
            );
            const endTime = new Date(`2023-01-01 ${agendaItem.horarioFim}`);

            for (
              let currentTime = startTime;
              currentTime <= endTime;
              currentTime.setMinutes(
                currentTime.getMinutes() + tempoDoServicoEmMinutos,
              )
            ) {
              const formattedHour = currentTime
                .getHours()
                .toString()
                .padStart(2, '0');
              const formattedMinute = currentTime
                .getMinutes()
                .toString()
                .padStart(2, '0');
              const time = `${formattedHour}:${formattedMinute}`;

              // Verifique se é possível marcar mais serviços no mesmo horário
              const servicosNoMesmoHorario = agendamentoAtivos.filter(
                agendamento =>
                  agendamento.servico === servicoSelecionado &&
                  agendamento.dia === selectedDay &&
                  agendamento.horario === time,
              );

              if (servicosNoMesmoHorario.length < numeroServico) {
                timeOptions.push(time);
              }
            }
          }
        });
      }
    }

    return timeOptions;
  };

  const times = generateTimeOptions();
  //pegando nome do cliente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = ref(db, 'IpetClientsMobile/' + user?.uid);
        const docSnap = await get(docRef);

        if (docSnap.exists()) {
          const data = docSnap.val();
          setName(data.name || '');
        } else {
          console.log('Documento não encontrado!');
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, [user]);

  //renderiza as datas
  useEffect(() => {
    const currentDate = new Date();
    const firstDayOfCurrentMonth = startOfMonth(currentDate);
    const lastDayOfNextTwoMonths = addMonths(endOfMonth(currentDate), 2);

    const diasTrabalhados: string[] =
      petshopData && petshopData.agenda
        ? Object.values(petshopData.agenda)
            .map((item: any) => item.dias)
            .flat()
        : [];

    const nomesDiasSemana = [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quinta-feira',
      'Sexta-feira',
      'Sábado',
    ];

    const diasDisponiveis = eachDayOfInterval({
      start: currentDate,
      end: lastDayOfNextTwoMonths,
    }).filter(day => diasTrabalhados.includes(nomesDiasSemana[getDay(day)]));

    const daysArray = diasDisponiveis.map(day => ({
      label: `${format(day, 'd / M', {locale: pt})} (${format(day, 'EEEE', {
        locale: pt,
      })})`,
      value: format(day, 'dd-MM-yyyy'),
      isToday: isToday(day),
    }));

    setAvailableDays(daysArray);
  }, [petshopData]);

  //get servico e agendamentos do petshop
  useEffect(() => {
    if (!petshopData) {
      return;
    }

    const servicoRef = ref(
      db,
      'IpetClientsWeb/' + petshopData.name + '/servicos',
    );

    get(servicoRef)
      .then(servicoSnapshot => {
        if (servicoSnapshot.exists()) {
          const servicoData: Record<string, Servico> = servicoSnapshot.val();
          const arrayDeServicos = Object.values(servicoData);

          setServico(arrayDeServicos);
        } else {
          console.log('Nenhum serviço encontrado.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar serviços:', error);
      });

    const agendamentosRef = ref(
      db,
      'IpetClientsWeb/' + petshopData.name + '/agendamentos',
    );

    get(agendamentosRef)
      .then(agendamentoSnapshot => {
        if (agendamentoSnapshot.exists()) {
          const agendamentoData: Record<string, Agendamento> =
            agendamentoSnapshot.val();
          const arrayDeAgendamentos = Object.values(agendamentoData);

          setAgendamentoAtivos(arrayDeAgendamentos);
        } else {
          console.log('Nenhum agendamento encontrado.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar agendamentos:', error);
      });
  }, [petshopData]);

  //setando os campos
  useEffect(() => {
    if (servicoSelecionado) {
      const servicoSelecionadoObj = servico.find(
        item => item.servicos === servicoSelecionado,
      );
      if (servicoSelecionadoObj) {
        setAnimais(servicoSelecionadoObj.animais);
        setTempoServico(servicoSelecionadoObj.tempo);
        setPortes(servicoSelecionadoObj.porte);
        setValorServico(servicoSelecionadoObj.preco);
        setNumeroServico(servicoSelecionadoObj.numeroDeServicos);
      }
    }
  }, [servicoSelecionado, servico]);

  console.log(numeroServico);
  //realiza o agendamento
  const handleAgendarClick = () => {
    return new Promise<void>(async (resolve, reject) => {
      if (
        !servicoSelecionado ||
        !animalSelecionado ||
        !porteSelecionado ||
        !selectedDay ||
        !selectedTime ||
        !statusAgendamento
      ) {
        const error = new Error(
          toast.show({
            title: 'Preencha todos os campos',
            placement: 'bottom',
          }),
        );
        reject(error);
        return;
      }

      const idAleatorio = Math.random().toString(36).substring(2);

      try {
        const novoAgendamentoRefPetshop = push(
          ref(db, 'IpetClientsWeb/' + petshopData.name + '/agendamentos'),
        );

        const novoAgendamentoDataPetshop = {
          id: idAleatorio,
          servico: servicoSelecionado,
          animal: animalSelecionado,
          porte: porteSelecionado,
          dia: selectedDay,
          horario: selectedTime,
          idCliente: user?.uid,
          nomeCliente: name,
          status: statusAgendamento,
          cancelado: statusCancelado,
        };

        await set(novoAgendamentoRefPetshop, novoAgendamentoDataPetshop);

        const novoAgendamentoRefCliente = push(
          ref(db, 'IpetClientsMobile/' + user?.uid + '/agendamentos'),
        );

        const novoAgendamentoDataCliente = {
          id: idAleatorio,
          servico: servicoSelecionado,
          animal: animalSelecionado,
          porte: porteSelecionado,
          dia: selectedDay,
          horario: selectedTime,
          nomePetshop: petshopData.name,
          enderecoPetshop: petshopData.endereco,
          valor: valorServico,
          idCliente: user?.uid,
          status: statusAgendamento,
          cancelado: statusCancelado,
        };

        await set(novoAgendamentoRefCliente, novoAgendamentoDataCliente);

        console.log('Agendamento realizado com sucesso!');
        resolve();
        navigation.navigate('Reminder');
      } catch (error) {
        console.error(`Erro ao realizar agendamento: ${error.message}`);
        reject(error);
      }
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
          <Header />
          <Box marginBottom="15px">
            <Select
              selectedValue={servicoSelecionado}
              minWidth="350"
              accessibilityLabel="Escolha um servico"
              placeholder="Escolha um servico"
              borderColor="#B3B3B3"
              borderRadius="10px"
              mt={1}
              onValueChange={itemValue => setServicoSelecionado(itemValue)}>
              {servico.map((servicoItem, index) => {
                return (
                  <Select.Item
                    key={index}
                    label={servicoItem.servicos}
                    value={servicoItem.servicos}
                  />
                );
              })}
            </Select>
          </Box>
          <Box marginBottom="15px">
            <Select
              selectedValue={animalSelecionado}
              minWidth="350"
              accessibilityLabel="Escolha um animal"
              placeholder="Escolha um animal"
              borderColor="#B3B3B3"
              borderRadius="10px"
              mt={1}
              onValueChange={itemValue => setAnimalSelecionado(itemValue)}>
              {animais.map((animal, index) => (
                <Select.Item key={index} label={animal} value={animal} />
              ))}
            </Select>
          </Box>
          <Box marginBottom="15px">
            <Select
              selectedValue={porteSelecionado}
              minWidth="350"
              accessibilityLabel="Escolha um porte"
              placeholder="Porte do animal"
              borderColor="#B3B3B3"
              borderRadius="10px"
              mt={1}
              onValueChange={itemValue => setPorteSelecionado(itemValue)}>
              {portes.map((porte, index) => (
                <Select.Item key={index} label={porte} value={porte} />
              ))}
            </Select>
          </Box>
          <Box marginBottom="15px">
            <Select
              selectedValue={selectedDay}
              minWidth="350"
              accessibilityLabel="Escolha um dia"
              placeholder="Escolha um dia "
              borderColor="#B3B3B3"
              borderRadius="10px"
              _selectedItem={{
                bg: 'amber.600',
              }}
              mt={1}
              onValueChange={itemValue => setSelectedDay(itemValue)}>
              {availableDays.map(day => (
                <Select.Item
                  key={day.value}
                  label={`${day.label}`}
                  value={day.value}
                />
              ))}
            </Select>
          </Box>
          <Box marginBottom="15px">
            <Select
              selectedValue={selectedTime}
              minWidth="350"
              accessibilityLabel="Horários disponiveis"
              placeholder="Horários disponiveis"
              borderColor="#B3B3B3"
              borderRadius="10px"
              _selectedItem={{
                bg: 'teal.600',
                // endIcon: <CheckIcon size="5" />,
              }}
              mt={1}
              onValueChange={itemValue => setSelectedTime(itemValue)}>
              {times.map(time => (
                <Select.Item key={time} label={time} value={time} />
              ))}
            </Select>
          </Box>
          <Box marginBottom="10px">
            <Text fontWeight="medium" fontSize="18" color="#565656">
              Dados do estabelecimento
            </Text>
          </Box>
          <Box
            borderRadius="15px"
            borderColor="#B3B3B3"
            borderWidth="1px"
            marginBottom="15px"
            width="350px"
            paddingX="15px"
            paddingY="10px">
            <Box marginLeft="10px">
              <Text fontWeight="medium" fontSize="18" color="#565656">
                {petshopData.name}
              </Text>
              <Text fontSize="12" color="#565656">
                Cnpj {petshopData.cnpj}
              </Text>
            </Box>
          </Box>
          <Flex
            width="350px"
            flexDirection="row"
            justifyContent="space-between">
            <Text>Tempo do serviço</Text>
            <Text>{servicoSelecionado ? ` ${tempoServico} minutos` : '-'}</Text>
          </Flex>
          <Flex
            width="350px"
            flexDirection="row"
            justifyContent="space-between">
            <Text>Valor do servico</Text>
            <Text> {servicoSelecionado ? ` R$ ${valorServico}` : '-'}</Text>
          </Flex>
          <Flex
            width="350px"
            flexDirection="row"
            justifyContent="space-between">
            <Text>Pagamento</Text>
            <Text>direto na loja</Text>
          </Flex>
          <Button
            width="200px"
            paddingX="15px"
            backgroundColor="#FC822D"
            borderRadius="20"
            onPress={handleAgendarClick}
            position="absolute"
            bottom="24">
            Agendar
          </Button>
          <Box position="absolute" bottom="2" width="350px">
            <MenuProfile navigation={navigation} />
          </Box>
        </Flex>
      </SafeAreaView>
    </View>
  );
}
