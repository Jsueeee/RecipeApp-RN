import { format } from "date-fns";

const DATE_ONLY_PATTERN = /^(\d{4}-\d{2}-\d{2})/;

/**
 * 주로 재료의 유통기한 표시 시 사용
 * ~까지 표시
 */
export const toConvertExpiredAt = (dateStr: string | null): string | null => {
  if (!dateStr) return null;
  return convertDateString(dateStr, "yy.MM.dd") + " 까지";
};

export const convertDateString = (
  dateStr: string,
  outputPattern: string = "yyyy.MM.dd",
  inputPattern: string = "yyyy-MM-dd",
): string => {
  try {
    const date = new Date(dateStr);
    return format(date, outputPattern);
  } catch (e) {
    console.error(e);
    return "";
  }
};

export const toDateOnlyRequestString = (date: unknown): string | null => {
  if (date === null || date === undefined || date === "") return null;

  if (typeof date === "string") {
    const trimmedDate = date.trim();
    if (!trimmedDate) return null;

    const dateOnly = trimmedDate.match(DATE_ONLY_PATTERN)?.[1];
    if (dateOnly) return dateOnly;

    const parsedDate = new Date(trimmedDate);
    return Number.isNaN(parsedDate.getTime())
      ? null
      : format(parsedDate, "yyyy-MM-dd");
  }

  const dateLike = date as { toDate?: () => Date };
  const parsedDate =
    date instanceof Date
      ? date
      : typeof dateLike.toDate === "function"
        ? dateLike.toDate()
        : new Date(date as string | number);

  return Number.isNaN(parsedDate.getTime())
    ? null
    : format(parsedDate, "yyyy-MM-dd");
};
