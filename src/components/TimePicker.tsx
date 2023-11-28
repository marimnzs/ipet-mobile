import React, {useState} from 'react';
import {Container, Box, Select} from 'native-base';

const TimePicker: React.FC = () => {
  const [selectedTime, setSelectedTime] = useState('');

  const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const formattedHour = hour.toString().padStart(2, '0');
        const formattedMinute = minute.toString().padStart(2, '0');
        timeOptions.push(`${formattedHour}:${formattedMinute}`);
      }
    }
    return timeOptions;
  };

  const times = generateTimeOptions();

  return (
    <Container>
      <Box maxW="300">
        <Select
          selectedValue={selectedTime}
          minWidth="200"
          accessibilityLabel="Escolha um horário"
          placeholder="Escolha um horário"
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
    </Container>
  );
};

export default TimePicker;
