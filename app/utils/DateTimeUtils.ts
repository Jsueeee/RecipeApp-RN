import { format } from "date-fns";

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
  inputPattern: string = "yyyy-MM-dd"
): string => {
  try {
    const date = new Date(dateStr);
    return format(date, outputPattern);
  } catch (e) {
    console.error(e);
    return "";
  }
};
