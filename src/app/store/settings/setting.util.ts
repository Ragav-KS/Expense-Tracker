export const monthStart = () => {
  let monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  return monthStart;
};
