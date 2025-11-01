import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import i18n from "@/lib/i18n";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React from "react";
import { Platform, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { DefaultLoginButton, LoginMethod } from "./LoginButton";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

export const OptionalLoginBottomSheet = ({ bottomSheetModalRef }: Props) => {
  const { handleAppleLogin, handleKakaoLogin } = useAuth();
  const isIOS = Platform.OS === "ios";

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
            onClick={handleAppleLogin}
          />
        )}

        <DefaultLoginButton
          method={LoginMethod.NAVER}
          isOptional={true}
          onClick={handleKakaoLogin}
        />
      </View>
    </DefaultBottomSheetModal>
  );
};
