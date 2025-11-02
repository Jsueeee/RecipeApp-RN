import RightArrowIcon from "@/assets/images/ic_arrow_right.svg";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import i18n from "@/lib/i18n";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Linking, Platform, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { DefaultLoginButton, LoginMethod } from "./LoginButton";
import { PressableScale } from "@/app/components/PressableScale";
import { router } from "expo-router";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  setIsLoading: (isLoading: boolean) => void;
}

export const OptionalLoginBottomSheet = ({
  bottomSheetModalRef,
  setIsLoading,
}: Props) => {
  const { handleAppleLogin, handleNaverLogin } = useAuth({ setIsLoading });
  const isIOS = Platform.OS === "ios";

  const onPressLogin = (loginMethod: LoginMethod) => {
    setIsLoading(true);

    switch (loginMethod) {
      case LoginMethod.NAVER:
        handleNaverLogin();
        break;
      case LoginMethod.APPLE:
        handleAppleLogin();
        break;
    }
  };

  const onPressCSEmail = () => {
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

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={i18n.t("login.optional_login_button")}
      onDismiss={() => {}}
    >
      <View className="w-full px-4 py-2 gap-3">
        {isIOS && (
          <DefaultLoginButton
            method={LoginMethod.APPLE}
            isOptional={true}
            onClick={() => onPressLogin(LoginMethod.APPLE)}
          />
        )}

        <DefaultLoginButton
          method={LoginMethod.NAVER}
          isOptional={true}
          onClick={() => onPressLogin(LoginMethod.NAVER)}
        />

        <PressableScale
          onPress={onPressCSEmail}
          className="self-start self-center my-4"
          style={{
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
          pressedStyle={{ backgroundColor: "#0000001A" }}
        >
          <Text className="text-body2 text-text-normal">
            {i18n.t("setting.CSEmail")}
          </Text>

          <RightArrowIcon width={20} height={20} color="#3F4542" />
        </PressableScale>
      </View>
    </DefaultBottomSheetModal>
  );
};
