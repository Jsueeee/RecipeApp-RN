import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import i18n from "@/lib/i18n";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Platform, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { DefaultLoginButton, LoginMethod } from "./LoginButton";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
  setIsLoading: (isLoading: boolean) => void;
}

export const OptionalLoginBottomSheet = ({
  bottomSheetModalRef,
  setIsLoading,
}: Props) => {
  const { handleAppleLogin, handleNaverLogin } = useAuth();
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
      </View>
    </DefaultBottomSheetModal>
  );
};
