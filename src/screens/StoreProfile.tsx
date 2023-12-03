import React, {useState, useEffect} from 'react';
import {Box, Flex, Button, Text} from 'native-base';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  getDay,
} from 'date-fns';
import {NavigationProp} from '@react-navigation/native';
import {MenuProfile} from '../components/MenuProfile';
import {View, SafeAreaView} from 'react-native';
import {Header} from '../components/Header';
import {Select} from 'native-base';
import {ref, get, push, set} from 'firebase/database';
import {useAuthContext} from '../contexts/AuthContext';
import db from '../firebase';

interface Servico {
  animais: string;
  descricao: string;
  porte: string;
  preco: string;
  servicos: string;
  tempo: string;
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
  const [name, setName] = useState('');
  const [servico, setServico] = useState<Servico[]>([]);
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('');
  const [animalSelecionado, setAnimalSelecionado] = useState<string>('');
  const [porteSelecionado, setPorteSelecionado] = useState<string>('');
  const [availableDays, setAvailableDays] = useState<
    {label: string; value: string; isToday: boolean}[]
  >([]);
  const [animaisAceitos, setAnimaisAceitos] = useState<string>('');
  const [tempoServico, setTempoServico] = useState<string>('');
  const [valorServico, setValorServico] = useState<string>('');
  const [portesAceitos, setPortesAceitos] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  const generateTimeOptions = (): string[] => {
    const timeOptions: string[] = [];

    if (petshopData.agenda && servicoSelecionado) {
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

              timeOptions.push(time);
            }
          }
        });
      }
    }

    return timeOptions;
  };

  const times = generateTimeOptions();

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

  useEffect(() => {
    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const diasTrabalhados: string[] = Object.values(petshopData.agenda)
      .map((item: any) => item.dias)
      .flat();

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
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    }).filter(day => diasTrabalhados.includes(nomesDiasSemana[getDay(day)]));

    const daysArray = diasDisponiveis.map(day => ({
      label: format(day, 'd'),
      value: format(day, 'dd-MM-yyyy'),
      isToday: isToday(day),
    }));

    setAvailableDays(daysArray);
  }, [petshopData]);

  useEffect(() => {
    if (!petshopData) {
      return;
    }

    const servicoRef = ref(
      db,
      'IpetClientsWeb/' + petshopData.name + '/servicos',
    );

    get(servicoRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data: Record<string, Servico> = snapshot.val();
          const arrayDeServicos = Object.values(data);
          setServico(arrayDeServicos);
        } else {
          console.log('Nenhum serviço encontrado.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar serviços:', error);
      });
  }, [petshopData]);

  useEffect(() => {
    if (servicoSelecionado) {
      const servicoSelecionadoObj = servico.find(
        item => item.servicos === servicoSelecionado,
      );
      if (servicoSelecionadoObj) {
        setAnimaisAceitos(servicoSelecionadoObj.animais);
        setTempoServico(servicoSelecionadoObj.tempo);
        setPortesAceitos(servicoSelecionadoObj.porte);
        setValorServico(servicoSelecionadoObj.preco);
      }
    }
  }, [servicoSelecionado, servico]);

  const handleAgendarClick = () => {
    return new Promise<void>(async (resolve, reject) => {
      if (
        !servicoSelecionado ||
        !animalSelecionado ||
        !porteSelecionado ||
        !selectedDay ||
        !selectedTime
      ) {
        const error = new Error(
          'Por favor, preencha todos os campos para prosseguir.',
        );
        reject(error);
        return;
      }

      try {
        const novoAgendamentoRefPetshop = push(
          ref(db, 'IpetClientsWeb/' + petshopData.name + '/agendamentos'),
        );

        const novoAgendamentoDataPetshop = {
          servico: servicoSelecionado,
          animal: animalSelecionado,
          porte: porteSelecionado,
          dia: selectedDay,
          horario: selectedTime,
          idCliente: user?.uid,
          nomeCliente: name,
        };

        await set(novoAgendamentoRefPetshop, novoAgendamentoDataPetshop);

        const novoAgendamentoRefCliente = push(
          ref(db, 'IpetClientsMobile/' + user?.uid + '/agendamentos'),
        );

        const novoAgendamentoDataCliente = {
          servico: servicoSelecionado,
          animal: animalSelecionado,
          porte: porteSelecionado,
          dia: selectedDay,
          horario: selectedTime,
          nomePetshop: petshopData.name,
          enderecoPetshop: petshopData.endereco,
          valor: valorServico,
          idCliente: user?.uid,
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
              <Select.Item label={animaisAceitos} value={animaisAceitos} />
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
              <Select.Item label={portesAceitos} value={portesAceitos} />
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
                  label={day.label}
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
            <Text
              fontWeight="medium"
              fontSize="18"
              color="#565656"
              textAlign="start">
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
