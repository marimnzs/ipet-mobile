import React, {useState} from 'react';
import {Container, Box, Select} from 'native-base';

const DaysPicker: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('');

  const daysInMonth = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    const daysArray = Array.from(
      {length: lastDayOfMonth - currentDay + 1},
      (_, index) => (currentDay + index).toString(),
    );
    return daysArray;
  };

  const days = daysInMonth();

  return (
    <Container>
      <Box maxW="300">
        <Select
          selectedValue={selectedDay}
          minWidth="200"
          accessibilityLabel="Escolha um dia"
          placeholder="Escolha um dia "
          borderColor="#B3B3B3"
          borderRadius="10px"
          _selectedItem={{
            bg: 'amber.600',
            // endIcon: <CheckIcon size="5" />,
          }}
          mt={1}
          onValueChange={itemValue => setSelectedDay(itemValue)}>
          {days.map(day => (
            <Select.Item key={day} label={day} value={day} />
          ))}
        </Select>
      </Box>
    </Container>
  );
};

export default DaysPicker;
