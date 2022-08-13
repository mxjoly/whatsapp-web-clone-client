import dayjs from 'dayjs';

export const getDateLabel = (messageDate: Date, useHour = false) => {
  const today = dayjs().format('D/MM/YYYY');
  const yesterday = dayjs().subtract(1, 'day').format('D/MM/YYYY');
  const lastWeek = dayjs().subtract(7, 'day').valueOf();
  const messageDay = dayjs(messageDate).format('D/MM/YYYY');
  const messageTimestamp = dayjs(messageDate).valueOf();

  if (messageDay === today) {
    if (useHour) {
      return dayjs(messageDate).format('HH:mm');
    } else {
      return "Aujourd'hui";
    }
  } else if (messageDay === yesterday) {
    return 'hier';
  } else if (messageTimestamp >= lastWeek) {
    const day = dayjs(messageDate).day();
    switch (day) {
      case 0:
        return 'dimanche';
      case 1:
        return 'lundi';
      case 2:
        return 'mardi';
      case 3:
        return 'mercredi';
      case 4:
        return 'jeudi';
      case 5:
        return 'vendredi';
      case 6:
        return 'samedi';
    }
  } else {
    return dayjs(messageDate).format('D/MM/YYYY');
  }
};
