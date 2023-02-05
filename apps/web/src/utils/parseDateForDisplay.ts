import dayjs from "dayjs";

export const parseDateForDisplay = (
  date: Date | null,
  format: string = "DD/MM/YYYY"
) => {
  if (!date) return null;
  return dayjs(date).format(format);
};
