import React, {useState, useEffect} from 'react';
import {Box, Flex, Button, Text} from 'native-base';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
} from 'date-fns';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {MenuProfile} from '../components/MenuProfile';
import {View, SafeAreaView} from 'react-native';
import {Header} from '../components/Header';
import {Select} from 'native-base';
import {ref, get} from 'firebase/database';
import db from '../firebase';

interface Cliente {
  name: string;
  cnpj: string;
}

interface StoreProfileProps {
  navigation: NavigationProp<Params>;
  route: any;
}

export function StoreProfile({route, navigation}: StoreProfileProps) {
  const {petshopData} = route.params;
  const [animal, setAnimal] = useState<string[]>([]);
  const [porte, setPorte] = useState<string[]>([]);
  const [servico, setServico] = useState<string[]>([]);
  const [animalSelecionado, setAnimalSelecionado] = useState<string>('');
  const [porteSelecionado, setPorteSelecionado] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [availableDays, setAvailableDays] = useState<
    {label: string; value: string; isToday: boolean}[]
  >([]);

  const [selectedTime, setSelectedTime] = useState('');

  // useEffect(() => {
  //   const fetchAvailableDays = async () => {
  //     try {
  //       const database = getDatabase();
  //       const databaseRef = ref(database);
  //       const diasRef = ref(
  //         databaseRef,
  //         'IpetClientsWeb/' + 'Pet Teste/' + 'agenda/', 'dias/',
  //       );
  //       const snapshot = await get(diasRef);

  //       if (snapshot.exists()) {
  //         const data: Record<string, any> = snapshot.val();
  //         const diasData = Object.keys(data);
  //         setAvailableDays(diasData);
  //       } else {
  //         console.log('Nenhum dado encontrado.');
  //       }
  //     } catch (error) {
  //       console.error('Erro ao buscar dados:', error);
  //     }
  //   };

  //   fetchAvailableDays();
  // }, []);

  const generateTimeOptions = (): string[] => {
    const timeOptions: string[] = [];

    for (let hour = 7; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        const time = `${formattedHour}:${formattedMinute}`;

        if (hour === 18 && minute === 30) {
          break; // Para evitar adicionar 18:30
        }

        timeOptions.push(time);
      }
    }

    return timeOptions;
  };

  const times = generateTimeOptions();

  useEffect(() => {
    const currentDate = new Date();
    const firstDayOfMonth = startOfMonth(currentDate);
    const lastDayOfMonth = endOfMonth(currentDate);

    const daysArray = eachDayOfInterval({
      start: firstDayOfMonth,
      end: lastDayOfMonth,
    }).map(day => ({
      label: format(day, 'd'), // 'd' para obter apenas o dia como string
      value: format(day, 'yyyy-MM-dd'), // formato que você desejar para armazenar no valor
      isToday: isToday(day),
    }));

    setAvailableDays(daysArray);
  }, []);

  useEffect(() => {
    const animaisRef = ref(db, 'animais');

    get(animaisRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data: string[] = snapshot.val();
          const listaDeAnimais = Object.values(data);
          setAnimal(listaDeAnimais);
        } else {
          console.log('Nenhum Animal encontrado.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar animais:', error);
      });
  }, []);

  useEffect(() => {
    const porteRef = ref(db, 'porte');

    get(porteRef)
      .then(snapshot => {
        if (snapshot.exists()) {
          const data: string[] = snapshot.val();
          const listaDePortes = Object.values(data);
          setPorte(listaDePortes);
        } else {
          console.log('Nenhum Animal encontrado.');
        }
      })
      .catch(error => {
        console.error('Erro ao buscar animais:', error);
      });
  }, []);

  const handleAgendarClick = () => {
    // Lógica de agendamento com os dias selecionados
    console.log('Dias selecionados:', selectedDays);
    console.log('Animais', animal);
    console.log('Dados do petshop:', petshopData);
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
              selectedValue={servico}
              minWidth="350"
              accessibilityLabel="Escolha um animal"
              placeholder="Escolha um servico"
              borderColor="#B3B3B3"
              borderRadius="10px"
              mt={1}
              onValueChange={itemValue => setServico(itemValue)}>
              <Select.Item label="Banho" value="Banho" />
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
              {animal.map((animalItem, index) => {
                return (
                  <Select.Item
                    key={index}
                    label={animalItem}
                    value={animalItem}
                  />
                );
              })}
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
              {porte.map((porteItem, index) => {
                return (
                  <Select.Item
                    key={index}
                    label={porteItem}
                    value={porteItem}
                  />
                );
              })}
            </Select>
          </Box>
          <Box marginBottom="15px">
            <Select
              minWidth="350"
              accessibilityLabel="Escolha um dia"
              placeholder="Escolha um dia "
              borderColor="#B3B3B3"
              borderRadius="10px"
              _selectedItem={{
                bg: 'amber.600',
              }}
              mt={1}
              onValueChange={itemValue => {
                // Verifique se itemValue já está na lista
                if (selectedDays.includes(itemValue)) {
                  // Se estiver, remova-o
                  setSelectedDays(
                    selectedDays.filter(day => day !== itemValue),
                  );
                } else {
                  // Se não estiver, adicione-o
                  setSelectedDays([...selectedDays, itemValue]);
                }
              }}
              // multiple
            >
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
                Giovanna Laís
              </Text>
              <Text fontSize="12" color="#565656">
                Cnpj 12.345.678/9876-542
              </Text>
            </Box>
          </Box>
          <Flex
            width="350px"
            flexDirection="row"
            justifyContent="space-between">
            <Text>Tempo do servico</Text>
            <Text>-</Text>
          </Flex>
          <Flex
            width="350px"
            flexDirection="row"
            justifyContent="space-between">
            <Text>Valor do servico</Text>
            <Text>-</Text>
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
            onPress={() => console.log(petshopData)}
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
