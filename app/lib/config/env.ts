export const appEnv = process.env.EXPO_PUBLIC_ENV ?? "dev";
export const isProdEnv = appEnv === "prod";

export const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? "";
export const googleLoginWebClientId =
  process.env.EXPO_PUBLIC_GOOGLE_LOGIN_WEB_CLIENT_ID ?? "";
export const naverLoginClientId =
  process.env.EXPO_PUBLIC_NAVER_LOGIN_CLIENT_ID ?? "";
export const naverLoginClientSecret =
  process.env.EXPO_PUBLIC_NAVER_LOGIN_CLIENT_SECRET ?? "";
export const kakaoNativeAppKey =
  process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? "";
export const admobNativeIosId =
  process.env.EXPO_PUBLIC_ADMOB_NATIVE_IOS_ID ?? "";
export const admobNativeAndroidId =
  process.env.EXPO_PUBLIC_ADMOB_NATIVE_ANDROID_ID ?? "";
export const admobSearchKeywordNativeIosId =
  process.env.EXPO_PUBLIC_ADMOB_SEARCH_KEYWORD_NATIVE_IOS_ID ?? "";
export const admobSearchKeywordNativeAndroidId =
  process.env.EXPO_PUBLIC_ADMOB_SEARCH_KEYWORD_NATIVE_ANDROID_ID ?? "";

let didValidate = false;

export function validatePublicEnv() {
  if (didValidate) {
    return [];
  }

  didValidate = true;

  const missing = [
    ["EXPO_PUBLIC_API_BASE_URL", apiBaseUrl],
    ["EXPO_PUBLIC_GOOGLE_LOGIN_WEB_CLIENT_ID", googleLoginWebClientId],
    ["EXPO_PUBLIC_NAVER_LOGIN_CLIENT_ID", naverLoginClientId],
    ["EXPO_PUBLIC_NAVER_LOGIN_CLIENT_SECRET", naverLoginClientSecret],
    ["EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY", kakaoNativeAppKey],
    ...(isProdEnv
      ? [
          ["EXPO_PUBLIC_ADMOB_NATIVE_IOS_ID", admobNativeIosId],
          ["EXPO_PUBLIC_ADMOB_NATIVE_ANDROID_ID", admobNativeAndroidId],
          [
            "EXPO_PUBLIC_ADMOB_SEARCH_KEYWORD_NATIVE_IOS_ID",
            admobSearchKeywordNativeIosId,
          ],
          [
            "EXPO_PUBLIC_ADMOB_SEARCH_KEYWORD_NATIVE_ANDROID_ID",
            admobSearchKeywordNativeAndroidId,
          ],
        ]
      : []),
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(`Missing public environment variables: ${missing.join(", ")}`);
  }

  return missing;
}
