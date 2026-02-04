export const generateTimeOptions = () => {
  const times = [];
  const intervals = 15; // 15-minute intervals
  const start = 0; // Start at 12:00 AM
  const end = 24 * 60; // End at 11:45 PM (1440 minutes in a day)

  for (let minutes = start; minutes < end; minutes += intervals) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours < 12 ? 'AM' : 'PM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMins = mins < 10 ? `0${mins}` : mins;

    times.push(`${displayHours}:${displayMins} ${period}`);
  }

  return times;
};
