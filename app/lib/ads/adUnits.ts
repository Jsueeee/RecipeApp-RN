import { Platform } from "react-native";
import { TestIds } from "react-native-google-mobile-ads";
import {
  admobNativeAndroidId,
  admobNativeIosId,
  isProdEnv,
} from "@/app/lib/config/env";

export function getNativeAdUnitId(): string | null {
  if (__DEV__ || !isProdEnv) {
    return TestIds.NATIVE;
  }

  const adUnitId = Platform.select({
    android: admobNativeAndroidId,
    ios: admobNativeIosId,
    default: "",
  });

  return adUnitId || null;
}
