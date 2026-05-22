import Constants from "expo-constants";
import { Platform } from "react-native";

/**
 * 현재 앱의 버전을 가져옵니다.
 */
export const getCurrentAppVersion = (): string => {
  return Constants.expoConfig?.version || "0.0.0";
};

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
  const current = currentVersion.split(".").map((value) => Number(value) || 0);
  const minimum = minimumVersion.split(".").map((value) => Number(value) || 0);
  const length = Math.max(current.length, minimum.length);

  for (let index = 0; index < length; index++) {
    const currentPart = current[index] ?? 0;
    const minimumPart = minimum[index] ?? 0;

    if (currentPart > minimumPart) return true;
    if (currentPart < minimumPart) return false;
  }

  return true;
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
