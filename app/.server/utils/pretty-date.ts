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

const offsetDate = (timestamp: Timestamp, offset: number) => {
  const date = new Date(timestamp);
  date.setMinutes(date.getMinutes() + offset);
  return date;
};

const getPrettyDate = (timestamp: Timestamp, clockOffset: number) => {
  const date = offsetDate(timestamp, clockOffset);
  return `${getMonthName(date)} ${date.getDate()}, ${date.getFullYear()}`;
};

export { getPrettyDate };
