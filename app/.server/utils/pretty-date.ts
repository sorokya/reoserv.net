type Timestamp = string | number | Date;

const getMonthName = (date: Date) => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ] as const;
  return monthNames[date.getMonth()];
};

const getPrettyDate = (timestamp: Timestamp) => {
  const date = new Date(timestamp);
  return `${getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`;
};

export { getPrettyDate };
