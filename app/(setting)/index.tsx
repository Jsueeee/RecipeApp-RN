import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import RightArrowIcon from "@/assets/images/ic_arrow_right.svg";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  AppState,
  Linking,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { PressableScale } from "../components/PressableScale";
import { useGoogleLogoutMutation } from "../hooks/mutations/useGoogleLogoutMutation";
import { useKaKaoLogoutMutation } from "../hooks/mutations/useKaKaoLogoutMutation";
import { useNaverLogoutMutation } from "../hooks/mutations/useNaverLogoutMutation";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";
import { useAppleLogoutMutation } from "../hooks/mutations/useAppleLogoutMutation";
import { AppSwitch } from "@/components/AppSwitch";
import {
  getExpirationNotificationEnabled,
  isNotificationPermissionGranted,
  requestNotificationPermission,
  updateExpirationNotificationEnabled,
} from "@/app/utils/NotificationUtils";

const TUTORIAL_HIGHLIGHT_EXPIRATION_NOTIFICATION = "expiration-notification";
const PUSH_ALARM_HIGHLIGHT_SWEEP_WIDTH_RATIO = 0.46;
const PUSH_ALARM_HIGHLIGHT_MIN_SWEEP_WIDTH = 128;

export default function SettingScreen() {
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionDialogVisible, setPermissionDialogVisible] = useState(false);
  const [updateFailedDialogVisible, setUpdateFailedDialogVisible] =
    useState(false);
  const [isExpirationNotificationOn, setIsExpirationNotificationOn] =
    useState(true);
  const [isNotificationSettingLoading, setIsNotificationSettingLoading] =
    useState(true);
  const [isNotificationSettingUpdating, setIsNotificationSettingUpdating] =
    useState(false);
  const [pushAlarmWidth, setPushAlarmWidth] = useState<number | null>(null);
  const { tutorialHighlight } = useLocalSearchParams<{
    tutorialHighlight?: string;
  }>();
  const shouldHighlightPushAlarm =
    tutorialHighlight === TUTORIAL_HIGHLIGHT_EXPIRATION_NOTIFICATION;
  const pushAlarmHighlightProgress = useSharedValue(0);

  const { userInfo } = useUserInfoQuery();
  const { kakaoLogout } = useKaKaoLogoutMutation();
  const { googleLogout } = useGoogleLogoutMutation();
  const { naverLogout } = useNaverLogoutMutation();
  const { appleLogout } = useAppleLogoutMutation();

  const refreshExpirationNotificationState = React.useCallback(async () => {
    const [isEnabled, hasPermission] = await Promise.all([
      getExpirationNotificationEnabled(),
      isNotificationPermissionGranted(),
    ]);

    setIsExpirationNotificationOn(isEnabled && hasPermission);
    setIsNotificationSettingLoading(false);
  }, []);

  React.useEffect(() => {
    void refreshExpirationNotificationState();

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        void refreshExpirationNotificationState();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [refreshExpirationNotificationState]);

  React.useEffect(() => {
    if (!shouldHighlightPushAlarm || !pushAlarmWidth) {
      pushAlarmHighlightProgress.value = 0;
      return;
    }

    pushAlarmHighlightProgress.value = 0;
    pushAlarmHighlightProgress.value = withTiming(1, {
      duration: 2600,
      easing: Easing.bezier(0.16, 1, 0.3, 1),
    });
  }, [pushAlarmHighlightProgress, pushAlarmWidth, shouldHighlightPushAlarm]);

  const pushAlarmCardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          pushAlarmHighlightProgress.value,
          [0, 0.14, 0.84, 1],
          [0, -4, -4, 0],
          Extrapolation.CLAMP,
        ),
      },
      {
        scale: interpolate(
          pushAlarmHighlightProgress.value,
          [0, 0.14, 0.84, 1],
          [1, 1.012, 1.012, 1],
          Extrapolation.CLAMP,
        ),
      },
    ],
    shadowOpacity: interpolate(
      pushAlarmHighlightProgress.value,
      [0, 0.14, 0.84, 1],
      [0, 0.18, 0.18, 0],
      Extrapolation.CLAMP,
    ),
    shadowRadius: interpolate(
      pushAlarmHighlightProgress.value,
      [0, 0.14, 0.84, 1],
      [0, 18, 18, 0],
      Extrapolation.CLAMP,
    ),
    elevation: interpolate(
      pushAlarmHighlightProgress.value,
      [0, 0.14, 0.84, 1],
      [0, 8, 8, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const pushAlarmGlowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      pushAlarmHighlightProgress.value,
      [0, 0.12, 0.56, 0.86, 1],
      [0, 0.32, 0.18, 0.26, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const pushAlarmBorderAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      pushAlarmHighlightProgress.value,
      [0, 0.1, 0.78, 1],
      [0, 1, 1, 0],
      Extrapolation.CLAMP,
    ),
  }));

  const pushAlarmSheenAnimatedStyle = useAnimatedStyle(() => {
    const cardWidth = pushAlarmWidth ?? 0;
    const sweepWidth = Math.max(
      PUSH_ALARM_HIGHLIGHT_MIN_SWEEP_WIDTH,
      cardWidth * PUSH_ALARM_HIGHLIGHT_SWEEP_WIDTH_RATIO,
    );

    return {
      width: sweepWidth,
      opacity: interpolate(
        pushAlarmHighlightProgress.value,
        [0, 0.16, 0.64, 0.78, 1],
        [0, 0, 0.72, 0, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateX: interpolate(
            pushAlarmHighlightProgress.value,
            [0, 0.16, 0.78, 1],
            [
              -sweepWidth * 1.2,
              -sweepWidth * 1.2,
              cardWidth + sweepWidth,
              cardWidth + sweepWidth,
            ],
            Extrapolation.CLAMP,
          ),
        },
        { rotate: "-8deg" },
      ],
    };
  });

  const onPushAlarmLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setPushAlarmWidth((prev) =>
      prev !== null && Math.abs(prev - width) < 0.5 ? prev : width,
    );
  }, []);

  const renderPushAlarmHighlight = () => {
    if (!shouldHighlightPushAlarm || !pushAlarmWidth) return null;

    return (
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.pushAlarmHighlightLayer]}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.pushAlarmGlow,
            pushAlarmGlowAnimatedStyle,
          ]}
        />
        <Animated.View
          style={[styles.pushAlarmSheen, pushAlarmSheenAnimatedStyle]}
        >
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0)",
              "rgba(149, 247, 219, 0.12)",
              "rgba(255, 255, 255, 0.82)",
              "rgba(149, 247, 219, 0.12)",
              "rgba(255, 255, 255, 0)",
            ]}
            locations={[0, 0.26, 0.5, 0.74, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.pushAlarmBorder,
            pushAlarmBorderAnimatedStyle,
          ]}
        />
      </Animated.View>
    );
  };

  const onCSEmailPress = () => {
    const email = "recipestorage2021@gmail.com";
    const subject = "[레시피 저장소] 문의";
    const body = "여기에 내용을 입력해 주세요.";
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      console.error("이메일 열기 실패:", err),
    );
  };

  const onLogoutPress = () => {
    setLogoutDialogVisible(true);
  };

  const onPermissionDialogConfirmPress = () => {
    setPermissionDialogVisible(false);
    void Linking.openSettings();
  };

  const onExpirationNotificationValueChange = async (nextValue: boolean) => {
    if (isNotificationSettingLoading || isNotificationSettingUpdating) {
      return;
    }

    const previousValue = isExpirationNotificationOn;

    setIsExpirationNotificationOn(nextValue);
    setIsNotificationSettingUpdating(true);

    if (nextValue) {
      const hasPermission = await requestNotificationPermission();

      if (!hasPermission) {
        setIsExpirationNotificationOn(false);
        await updateExpirationNotificationEnabled(false);
        setIsNotificationSettingUpdating(false);
        setPermissionDialogVisible(true);
        return;
      }
    }

    const didUpdate = await updateExpirationNotificationEnabled(nextValue);

    if (!didUpdate) {
      setIsExpirationNotificationOn(previousValue);
      setUpdateFailedDialogVisible(true);
    }

    setIsNotificationSettingUpdating(false);
  };

  const onLogoutConfirmPress = async () => {
    setIsLoading(true);
    setLogoutDialogVisible(false);

    if (userInfo?.loginProvider === "KAKAO") {
      await kakaoLogout();
    } else if (userInfo?.loginProvider === "GOOGLE") {
      await googleLogout();
    } else if (userInfo?.loginProvider === "NAVER") {
      await naverLogout();
    } else if (userInfo?.loginProvider === "APPLE") {
      await appleLogout();
    }
  };

  const renderCSEmail = () => {
    return (
      <PressableScale onPress={onCSEmailPress} hitSlop={8}>
        <View className="flex-row items-center justify-between">
          <Text className="text-utility2 text-text-strong">
            {i18n.t("setting.CSEmail")}
          </Text>

          <RightArrowIcon width={20} height={20} color="#3F4542" />
        </View>
      </PressableScale>
    );
  };

  const renderVersionInfo = () => {
    return (
      <View className="flex-row items-center justify-between">
        <Text className="text-utility2 text-text-strong">
          {i18n.t("setting.versionInfo")}
        </Text>
        <Text className="bg-primary-disable px-[6px] py-[3px] rounded-[6px] text-utility2 text-teal-600">
          {Constants.expoConfig?.version}
        </Text>
      </View>
    );
  };

  const renderPushAlarmSetting = () => {
    return (
      <View className="gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-utility2 text-text-strong">
            {i18n.t("setting.pushAlarm")}
          </Text>

          <AppSwitch
            disabled={
              isNotificationSettingLoading || isNotificationSettingUpdating
            }
            onValueChange={onExpirationNotificationValueChange}
            value={isExpirationNotificationOn}
          />
        </View>

        <Text className="text-body4 text-text-alternative">
          {i18n.t("setting.pushAlarm_description")}
        </Text>
      </View>
    );
  };

  const renderLogoutButton = () => {
    return (
      <PressableScale onPress={onLogoutPress} hitSlop={8}>
        <Text className="text-body2 text-text-strong">
          {i18n.t("setting.logout")}
        </Text>
      </PressableScale>
    );
  };

  const onDeleteAccountPress = () => {
    router.push("/(setting)/(delete-account)");
  };

  const renderDeleteAccountButton = () => {
    return (
      <PressableScale onPress={onDeleteAccountPress} hitSlop={8}>
        <Text className="text-body2 text-text-strong">
          {i18n.t("setting.delete_account")}
        </Text>
      </PressableScale>
    );
  };

  return (
    <ScreenLayout
      title={i18n.t("setting.title")}
      backgroundColor="background-alternative"
    >
      <View className="flex-1 px-4 py-3 gap-3">
        <View className="w-full" onLayout={onPushAlarmLayout}>
          <Animated.View
            className="w-full rounded-[12px]"
            style={[styles.pushAlarmCardFrame, pushAlarmCardAnimatedStyle]}
          >
            <View
              className="w-full bg-white rounded-[12px] p-4 gap-7"
              style={styles.pushAlarmCard}
            >
              {renderPushAlarmHighlight()}
              <View style={styles.pushAlarmContent}>
                {renderPushAlarmSetting()}
              </View>
            </View>
          </Animated.View>
        </View>

        <View className="w-full bg-white rounded-[12px] p-4 gap-7">
          {renderCSEmail()}
          {renderVersionInfo()}
        </View>

        <View className="w-full bg-white rounded-[12px] p-4 gap-7">
          {renderLogoutButton()}
          {renderDeleteAccountButton()}
        </View>
      </View>

      <ChoiceDialog
        visible={logoutDialogVisible}
        title={i18n.t("setting.logout_dialog_title")}
        confirmText={i18n.t("setting.logout_dialog_confirm")}
        cancelText={i18n.t("setting.logout_dialog_cancel")}
        onConfirm={onLogoutConfirmPress}
        onCancel={() => setLogoutDialogVisible(false)}
      />

      <ChoiceDialog
        visible={permissionDialogVisible}
        title={i18n.t("setting.pushAlarm_permission_title")}
        message={i18n.t("setting.pushAlarm_permission_message")}
        confirmText={i18n.t("setting.pushAlarm_permission_confirm")}
        cancelText={i18n.t("setting.pushAlarm_permission_cancel")}
        onConfirm={onPermissionDialogConfirmPress}
        onCancel={() => setPermissionDialogVisible(false)}
      />

      <ConfirmDialog
        visible={updateFailedDialogVisible}
        title={i18n.t("setting.pushAlarm_update_failed_title")}
        message={i18n.t("setting.pushAlarm_update_failed_message")}
        confirmText={i18n.t("common.close")}
        onConfirm={() => setUpdateFailedDialogVisible(false)}
      />

      {isLoading && <DotLoadingScreen />}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  pushAlarmCardFrame: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#159B80",
    shadowOffset: { width: 0, height: 0 },
  },
  pushAlarmCard: {
    position: "relative",
    overflow: "hidden",
  },
  pushAlarmContent: {
    position: "relative",
    zIndex: 2,
  },
  pushAlarmHighlightLayer: {
    zIndex: 1,
  },
  pushAlarmGlow: {
    backgroundColor: "#E8FFF8",
  },
  pushAlarmSheen: {
    position: "absolute",
    top: -28,
    bottom: -28,
  },
  pushAlarmBorder: {
    borderWidth: 1,
    borderColor: "rgba(75, 210, 176, 0.72)",
    borderRadius: 12,
  },
});
