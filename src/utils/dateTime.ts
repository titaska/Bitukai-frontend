export const getDateYMD = (rawDate: string) => {
  const date = new Date(rawDate);

  return date.toISOString().split('T')[0];
};

export const getHoursAndMinutes = (rawDate: string) => {
  const date = new Date(rawDate);

  return date.toLocaleTimeString('lt-LT', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Vilnius',
  });
};