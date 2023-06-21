export const monthStart = (date = new Date()) => {
  date.setDate(1);
  date.setHours(0, 0, 0, 0);

  return date;
};
