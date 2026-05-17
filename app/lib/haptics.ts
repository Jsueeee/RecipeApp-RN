import * as Haptics from "expo-haptics";
import { Platform } from "react-native";
import RNHapticFeedback from "react-native-haptic-feedback";

// 안드로이드에서는 RNHF 의 view-haptic 타입 (`virtualKey`, `longPress` 등) 을
// `ignoreAndroidSystemSettings: false` 로 호출해야 RNHF 가 내부에서
// `decorView.performHapticFeedback(HapticFeedbackConstants.X)` 경로를 탄다.
// 이 경로는 시스템 네비게이션 바 햅틱과 동일한 API 라, 일반 `Vibrator.vibrate`
// 경로가 OEM/Android 13+ 의 VibrationAttributes 정책으로 막혀 있어도 동작한다.
const ANDROID_OPTIONS = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
} as const;

// 가벼운 탭 (탭바, 토글 선택 등 짧고 또렷한 피드백)
export function selection(): void {
  if (Platform.OS === "ios") {
    Haptics.selectionAsync().catch(() => {});
    return;
  }
  if (Platform.OS === "android") {
    RNHapticFeedback.trigger("virtualKey", ANDROID_OPTIONS);
  }
}

// iOS impactLight ↔ Android virtualKey
export function impactLight(): void {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    return;
  }
  if (Platform.OS === "android") {
    RNHapticFeedback.trigger("virtualKey", ANDROID_OPTIONS);
  }
}

// iOS impactMedium ↔ Android longPress (조금 더 묵직한 view-haptic)
export function impactMedium(): void {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    return;
  }
  if (Platform.OS === "android") {
    RNHapticFeedback.trigger("longPress", ANDROID_OPTIONS);
  }
}

// iOS impactHeavy ↔ Android longPress
// (안드로이드 view-haptic 경로에는 Heavy 매핑이 따로 없어 longPress 로 통일)
export function impactHeavy(): void {
  if (Platform.OS === "ios") {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    return;
  }
  if (Platform.OS === "android") {
    RNHapticFeedback.trigger("longPress", ANDROID_OPTIONS);
  }
}
