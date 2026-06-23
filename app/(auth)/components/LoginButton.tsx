import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import React from "react";
import { Image, Text, useWindowDimensions, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

export enum LoginMethod {
  KAKAO = "KAKAO",
  NAVER = "NAVER",
  GOOGLE = "GOOGLE",
  APPLE = "APPLE",
}

interface Props {
  method: LoginMethod;
  isOptional?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const DefaultLoginButton = ({
  method,
  isOptional = false,
  disabled = false,
  onClick: onPress,
}: Props) => {
  const getIcon = () => {
    switch (method) {
      case LoginMethod.KAKAO:
        return require("@/assets/images/ic_login_kakao.png");
      case LoginMethod.NAVER:
        return require("@/assets/images/ic_login_naver.png");
      case LoginMethod.GOOGLE:
        return require("@/assets/images/ic_login_google.png");
      case LoginMethod.APPLE:
        return require("@/assets/images/ic_login_apple.png");
    }
  };

  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={{
        width: "100%",
        padding: 16,
        backgroundColor: isOptional ? "white" : "#BFEDE2",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isOptional ? "#ECEFED" : "#BFEDE2",
        opacity: disabled ? 0.6 : 1,
      }}
      pressedStyle={{ backgroundColor: isOptional ? "#F7F8F7" : "#DFF6F0" }}
    >
      <View className="flex-row items-center justify-center">
        <Image
          source={getIcon()}
          className="w-5 h-5 absolute left-4"
          resizeMode="contain"
        />
        <Text className="text-title5 text-gray-800 text-center flex-1">
          {i18n.t(`login.with_${method}`)}
        </Text>
      </View>
    </PressableScale>
  );
};

interface LoginButtonColumnProps {
  onPressOptionalLogin: () => void;
  onPressGuest: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

interface LoginTextActionProps {
  label: string;
  onPress: () => void;
  disabled: boolean;
}

function LoginTextAction({
  label,
  onPress,
  disabled,
}: LoginTextActionProps) {
  return (
    <PressableScale
      onPress={onPress}
      disabled={disabled}
      style={{
        borderRadius: 8,
        opacity: disabled ? 0.6 : 1,
        paddingHorizontal: 8,
        paddingVertical: 6,
      }}
      pressedStyle={{ backgroundColor: "rgba(255, 255, 255, 0.28)" }}
    >
      <Text className="text-body2 text-text-normal">{label}</Text>
    </PressableScale>
  );
}

export default function LoginButtonColumn({
  onPressOptionalLogin,
  onPressGuest,
  setIsLoading,
}: LoginButtonColumnProps) {
  const { width } = useWindowDimensions();
  const { handleKakaoLogin, handleGoogleLogin, isAnyAuthPending } = useAuth({
    setIsLoading,
  });
  const shouldStackTextActions = width < 360;

  const onPressLogin = (loginMethod: LoginMethod) => {
    if (isAnyAuthPending) return;
    setIsLoading(true);

    switch (loginMethod) {
      case LoginMethod.KAKAO:
        handleKakaoLogin();
        break;
      case LoginMethod.GOOGLE:
        handleGoogleLogin();
        break;
    }
  };

  return (
    <View className="w-full max-w-[500px] items-center">
      <View className="w-full gap-3">
        <DefaultLoginButton
          method={LoginMethod.GOOGLE}
          disabled={isAnyAuthPending}
          onClick={() => onPressLogin(LoginMethod.GOOGLE)}
        />
        <DefaultLoginButton
          method={LoginMethod.KAKAO}
          disabled={isAnyAuthPending}
          onClick={() => onPressLogin(LoginMethod.KAKAO)}
        />
      </View>

      <View
        className={`mt-3 items-center justify-center ${
          shouldStackTextActions ? "gap-1" : "flex-row"
        }`}
      >
        <LoginTextAction
          label={i18n.t("login.continue_as_guest")}
          onPress={onPressGuest}
          disabled={isAnyAuthPending}
        />

        {!shouldStackTextActions && (
          <View
            className="mx-1"
            style={{
              backgroundColor: "rgba(63, 69, 66, 0.28)",
              height: 12,
              width: 1,
            }}
          />
        )}

        <LoginTextAction
          label={i18n.t("login.optional_login_button")}
          onPress={onPressOptionalLogin}
          disabled={isAnyAuthPending}
        />
      </View>
    </View>
  );
}
