import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * 현재 앱의 버전을 가져옵니다.
 */
export const getCurrentAppVersion = (): string => {
  return Constants.expoConfig?.version || "0.0.0";
};

/**
 * 버전 문자열을 숫자로 변환합니다.
 * 예: "1.2.3" -> 123
 */
export const parseVersionToNumber = (version: string): number =>
  Number(version.replace(/\./g, ""));

/**
 * 두 버전을 비교합니다.
 * @param currentVersion 현재 버전
 * @param minimumVersion 최소 요구 버전
 * @returns true if currentVersion >= minimumVersion, false otherwise
 */
export const isVersionGreaterOrEqual = (
  currentVersion: string,
  minimumVersion: string
): boolean => {
  const current = parseVersionToNumber(currentVersion);
  const minimum = parseVersionToNumber(minimumVersion);

  return current >= minimum;
};

/**
 * 앱 스토어 URL을 생성합니다.
 */
export const getStoreUrl = (): string => {
  const bundleId = "com.recipe.android.recipeapp";

  // TODO : 링크 정리 하기

  if (Platform.OS === "ios") {
    // TODO : iOS App Store URL (실제 앱 ID로 변경 필요)
    return Constants.expoConfig?.ios?.appStoreUrl || "";
  } else {
    // GooglePlay Store URL
    // return Constants.expoConfig?.android?.playStoreUrl || "";
    return `https://play.google.com/store/apps/details?id=${bundleId}`;
  }
};
