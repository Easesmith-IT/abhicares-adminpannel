const BUSINESS_TIME_ZONE = "Asia/Kolkata";
const BUSINESS_OFFSET = "+05:30";

const DATE_ONLY_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_24H_RE = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
const TIME_12H_RE = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

const BUSINESS_DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: BUSINESS_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const BUSINESS_DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: BUSINESS_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const BUSINESS_LONG_DATE_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: BUSINESS_TIME_ZONE,
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const BUSINESS_TIME_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: BUSINESS_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const BUSINESS_TIME_24H_FORMAT = new Intl.DateTimeFormat("en-GB", {
  timeZone: BUSINESS_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const BUSINESS_DATE_PARTS_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: BUSINESS_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const BUSINESS_DATE_TIME_PARTS_FORMAT = new Intl.DateTimeFormat("en-IN", {
  timeZone: BUSINESS_TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
});

const pad = (value) => String(value).padStart(2, "0");

const isValidDate = (value) =>
  value instanceof Date && !Number.isNaN(value.getTime());

const toDate = (value) => {
  if (!value) return null;

  if (isValidDate(value)) {
    return new Date(value.getTime());
  }

  const parsed = new Date(value);
  return isValidDate(parsed) ? parsed : null;
};

const getDatePartsFromFormatter = (formatter, value) => {
  const date = toDate(value);
  if (!date) return null;

  const parts = formatter.formatToParts(date);
  const read = (type) => parts.find((part) => part.type === type)?.value || "";

  return {
    day: read("day"),
    month: read("month"),
    year: read("year"),
    hour: read("hour"),
    minute: read("minute"),
    dayPeriod: read("dayPeriod").toUpperCase(),
  };
};

const getBusinessDateParts = (value) => {
  if (!value) return null;

  if (typeof value === "string" && DATE_ONLY_RE.test(value.trim())) {
    const [year, month, day] = value.trim().split("-");
    return {
      year,
      month,
      day,
    };
  }

  return getDatePartsFromFormatter(BUSINESS_DATE_PARTS_FORMAT, value);
};

const parseClockValue = (value) => {
  if (!value || typeof value !== "string") return null;

  const trimmed = value.trim();
  const time12hMatch = trimmed.match(TIME_12H_RE);
  if (time12hMatch) {
    const [, rawHours, rawMinutes, modifier] = time12hMatch;
    let hours = Number(rawHours);

    if (modifier.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (modifier.toUpperCase() === "AM" && hours === 12) hours = 0;

    return {
      hours: pad(hours),
      minutes: rawMinutes,
    };
  }

  const time24hMatch = trimmed.match(TIME_24H_RE);
  if (time24hMatch) {
    const [, rawHours, rawMinutes] = time24hMatch;
    return {
      hours: pad(rawHours),
      minutes: rawMinutes,
    };
  }

  const parsed = toDate(trimmed);
  if (!parsed) return null;

  const parts = getDatePartsFromFormatter(BUSINESS_DATE_TIME_PARTS_FORMAT, parsed);
  if (!parts?.hour || !parts?.minute) return null;

  const hourValue = Number(parts.hour);
  const normalizedHours =
    parts.dayPeriod === "PM" && hourValue !== 12
      ? hourValue + 12
      : parts.dayPeriod === "AM" && hourValue === 12
        ? 0
        : hourValue;

  return {
    hours: pad(normalizedHours),
    minutes: parts.minute,
  };
};

const buildTokenMap = ({ year, month, day, hour12, hour24, minute, dayPeriod }) => ({
  yyyy: year,
  MMMM: month.long,
  MMM: month.short,
  MM: month.numeric,
  dd: day,
  HH: hour24,
  hh: hour12,
  mm: minute,
  aa: dayPeriod,
  a: dayPeriod,
});

const replaceTokens = (pattern, tokenMap) =>
  Object.entries(tokenMap)
    .sort((left, right) => right[0].length - left[0].length)
    .reduce(
      (output, [token, value]) => output.replaceAll(token, value),
      pattern,
    );

const getMonthNames = (date) => ({
  short: BUSINESS_DATE_FORMAT.format(date).replace(/^\d+\s/, "").replace(/\s\d{4}$/, ""),
  long: BUSINESS_LONG_DATE_FORMAT.format(date).replace(/^\d+\s/, "").replace(/\s\d{4}$/, ""),
});

const formatDateWithPattern = (value, pattern, fallback = "-") => {
  const dateParts = getBusinessDateParts(value);
  if (!dateParts) return fallback;

  const anchor = new Date(
    `${dateParts.year}-${dateParts.month}-${dateParts.day}T00:00:00${BUSINESS_OFFSET}`,
  );
  const monthNames = getMonthNames(anchor);

  return replaceTokens(pattern, {
    yyyy: dateParts.year,
    MMMM: monthNames.long,
    MMM: monthNames.short,
    MM: dateParts.month,
    dd: dateParts.day,
  });
};

const formatTimeWithPattern = (value, pattern = "hh:mm aa", fallback = "-") => {
  const directClock = parseClockValue(value);
  let hour24;
  let minute;
  let dayPeriod;

  if (directClock) {
    hour24 = directClock.hours;
    minute = directClock.minutes;
    const hourNumber = Number(hour24);
    dayPeriod = hourNumber >= 12 ? "PM" : "AM";
  } else {
    const parts = getDatePartsFromFormatter(BUSINESS_DATE_TIME_PARTS_FORMAT, value);
    if (!parts?.hour || !parts?.minute) return fallback;

    const hourValue = Number(parts.hour);
    hour24 =
      parts.dayPeriod === "PM" && hourValue !== 12
        ? pad(hourValue + 12)
        : parts.dayPeriod === "AM" && hourValue === 12
          ? "00"
          : pad(hourValue);
    minute = parts.minute;
    dayPeriod = parts.dayPeriod;
  }

  const hour12Value = Number(hour24) % 12 || 12;

  return replaceTokens(pattern, {
    HH: hour24,
    hh: pad(hour12Value),
    mm: minute,
    aa: dayPeriod,
    a: dayPeriod,
  });
};

const formatDateTimeWithPattern = (value, pattern, fallback = "-") => {
  const date = toDate(value);
  if (!date) return fallback;

  const parts = getDatePartsFromFormatter(BUSINESS_DATE_TIME_PARTS_FORMAT, date);
  if (!parts?.day || !parts?.month || !parts?.year || !parts?.hour || !parts?.minute) {
    return fallback;
  }

  const monthAnchor = new Date(
    `${parts.year}-${parts.month}-${parts.day}T00:00:00${BUSINESS_OFFSET}`,
  );
  const tokenMap = buildTokenMap({
    year: parts.year,
    month: {
      numeric: parts.month,
      ...getMonthNames(monthAnchor),
    },
    day: parts.day,
    hour12: pad(Number(parts.hour) % 12 || 12),
    hour24:
      parts.dayPeriod === "PM" && Number(parts.hour) !== 12
        ? pad(Number(parts.hour) + 12)
        : parts.dayPeriod === "AM" && Number(parts.hour) === 12
          ? "00"
          : pad(parts.hour),
    minute: parts.minute,
    dayPeriod: parts.dayPeriod,
  });

  return replaceTokens(pattern, tokenMap);
};

export const formatDateOnly = (value, pattern = "dd MMM yyyy", fallback = "-") =>
  formatDateWithPattern(value, pattern, fallback);

export const formatSlotTime = (value, pattern = "hh:mm aa", fallback = "-") =>
  formatTimeWithPattern(value, pattern, fallback);

export const formatInstant = (
  value,
  pattern = "dd MMM yyyy, hh:mm aa",
  fallback = "-",
) => formatDateTimeWithPattern(value, pattern, fallback);

export const toDateInputValue = (value) => {
  const parts = getBusinessDateParts(value);
  return parts ? `${parts.year}-${parts.month}-${parts.day}` : "";
};

export const toCalendarDate = (value) => {
  const parts = getBusinessDateParts(value);
  if (!parts) return null;

  const date = new Date(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    12,
    0,
    0,
    0,
  );

  return isValidDate(date) ? date : null;
};

export const getLocalYmd = (value = new Date()) => {
  const date = toDate(value) || new Date();
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

export const getBusinessTodayYmd = () => {
  const parts = getDatePartsFromFormatter(BUSINESS_DATE_PARTS_FORMAT, new Date());
  return parts ? `${parts.year}-${parts.month}-${parts.day}` : getLocalYmd();
};

export const combineBusinessDateAndTime = (dateValue, timeValue) => {
  const ymd = DATE_ONLY_RE.test(String(dateValue || "").trim())
    ? String(dateValue).trim()
    : getLocalYmd(dateValue);
  const clock = parseClockValue(timeValue);

  if (!ymd || !clock) return null;

  const combined = new Date(
    `${ymd}T${clock.hours}:${clock.minutes}:00${BUSINESS_OFFSET}`,
  );

  return isValidDate(combined) ? combined.toISOString() : null;
};

export const isPastBusinessDate = (value) => {
  const ymd = toDateInputValue(value);
  if (!ymd) return true;

  return ymd < getBusinessTodayYmd();
};

export const isPastBusinessSlot = (dateValue, timeValue) => {
  const combinedIso = combineBusinessDateAndTime(dateValue, timeValue);
  if (!combinedIso) return true;

  return new Date(combinedIso).getTime() < Date.now();
};

const resolveSlotStartAt = (booking) => {
  if (!booking) return null;

  return (
    toDate(booking.slotStartAt) ||
    toDate(booking.bookingTime) ||
    (() => {
      if (!booking.bookingDate || !booking.bookingTime) return null;
      const combinedIso = combineBusinessDateAndTime(
        toDateInputValue(booking.bookingDate) || booking.bookingDate,
        booking.bookingTime,
      );
      return toDate(combinedIso);
    })() ||
    toDate(booking.bookingDate)
  );
};

export const getBookingSlotWindow = (booking, fallbackDurationMinutes = 60) => {
  const slotStartAt = resolveSlotStartAt(booking);
  const slotDurationMinutes = Number(booking?.slotDurationMinutes) > 0
    ? Number(booking.slotDurationMinutes)
    : fallbackDurationMinutes;

  const slotEndAt =
    toDate(booking?.slotEndAt) ||
    (slotStartAt
      ? new Date(slotStartAt.getTime() + slotDurationMinutes * 60 * 1000)
      : null);

  return {
    slotStartAt,
    slotEndAt,
    slotDurationMinutes,
  };
};

export const isBookingOverdue = (booking, now = new Date()) => {
  if (!booking || ["completed", "cancelled"].includes(booking.status)) {
    return false;
  }

  const { slotStartAt, slotEndAt } = getBookingSlotWindow(booking);
  const comparisonPoint = slotEndAt || slotStartAt;

  return Boolean(comparisonPoint && comparisonPoint.getTime() < now.getTime());
};

export const formatSlotRange = (slotStartAt, slotEndAt, fallback = "-") => {
  if (!slotStartAt || !slotEndAt) return fallback;
  return `${formatSlotTime(slotStartAt, "HH:mm")} - ${formatSlotTime(slotEndAt, "HH:mm")}`;
};

export { BUSINESS_OFFSET, BUSINESS_TIME_ZONE, toDate };
