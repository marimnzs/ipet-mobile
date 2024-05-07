export const maskCpf = (value: string): string => {
  const cleanedValue: string = value.replace(/\D/g, '');

  if (cleanedValue.length >= 11) {
    return `${cleanedValue.slice(0, 3)}.${cleanedValue.slice(
      3,
      6,
    )}.${cleanedValue.slice(6, 9)}-${cleanedValue.slice(9, 11)}`;
  }

  return cleanedValue;
};
