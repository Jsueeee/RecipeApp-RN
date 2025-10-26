import { useUserInfoQuery } from "@/app/hooks/queries/useUserInfoQuery";
import RightArrowIcon from "@/assets/images/ic_arrow_right.svg";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import Constants from "expo-constants";
import { router } from "expo-router";
import React, { useState } from "react";
import { Linking, Text, View } from "react-native";
import { PressableScale } from "../components/PressableScale";
import { useGoogleLogoutMutation } from "../hooks/mutations/useGoogleLogoutMutation";
import { useKaKaoLogoutMutation } from "../hooks/mutations/useKaKaoLogoutMutation";
import { useNaverLogoutMutation } from "../hooks/mutations/useNaverLogoutMutation";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";

export default function SettingScreen() {
  const [logoutDialogVisible, setLogoutDialogVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { userInfo } = useUserInfoQuery();
  const { kakaoLogout } = useKaKaoLogoutMutation();
  const { googleLogout } = useGoogleLogoutMutation();
  const { naverLogout } = useNaverLogoutMutation();

  const onCSEmailPress = () => {
    const email = "recipestorage2021@gmail.com";
    const subject = "[레시피 저장소] 문의";
    const body = "여기에 내용을 입력해 주세요.";
    const url = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(url).catch((err) =>
      console.error("이메일 열기 실패:", err)
    );
  };

  const onLogoutPress = () => {
    setLogoutDialogVisible(true);
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

      {isLoading && <DotLoadingScreen />}
    </ScreenLayout>
  );
}
