export const generateTimeOptions = ({
  startHour = 0,
  endHour = 24,
  intervalMinutes = 15,
  includeEnd = false,
} = {}) => {
  const times = [];
  const start = startHour * 60;
  const end = endHour * 60;
  const comparator = includeEnd
    ? (minutes) => minutes <= end
    : (minutes) => minutes < end;

  for (let minutes = start; comparator(minutes); minutes += intervalMinutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const period = hours < 12 ? "AM" : "PM";
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const displayMins = mins < 10 ? `0${mins}` : mins;

    times.push(`${displayHours}:${displayMins} ${period}`);
  }

  return times;
};
