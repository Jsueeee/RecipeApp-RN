import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import React from "react";
import { Image, Text, View } from "react-native";
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
  onClick: () => void;
}

export const DefaultLoginButton = ({
  method,
  isOptional = false,
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
      style={{
        width: "100%",
        padding: 16,
        backgroundColor: isOptional ? "white" : "#BFEDE2",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: isOptional ? "#ECEFED" : "#BFEDE2",
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
  setIsLoading: (isLoading: boolean) => void;
}

export default function LoginButtonColumn({
  onPressOptionalLogin,
  setIsLoading,
}: LoginButtonColumnProps) {
  const { handleKakaoLogin, handleGoogleLogin } = useAuth({ setIsLoading });

  // 플랫폼별 설정
  const buttonHeight = 52; // p-4(16*2) + 텍스트(20) = 약 52px // TODO : 텍스트 크기 고정 고려하기
  const gap = 12;
  const totalHeight = 3 * buttonHeight + 2 * gap; // 3개 버튼 + 2개 간격의 고정 높이

  const onPressLogin = (loginMethod: LoginMethod) => {
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
    <View
      className="w-full max-w-[500px]"
      style={{
        gap: gap,
        height: totalHeight,
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View className="w-full gap-3">
        <DefaultLoginButton
          method={LoginMethod.GOOGLE}
          onClick={() => onPressLogin(LoginMethod.GOOGLE)}
        />
        <DefaultLoginButton
          method={LoginMethod.KAKAO}
          onClick={() => onPressLogin(LoginMethod.KAKAO)}
        />
      </View>

      <PressableScale
        onPress={onPressOptionalLogin}
        style={{
          paddingHorizontal: 10,
          paddingVertical: 6,
          borderRadius: 8,
        }}
        pressedStyle={{ backgroundColor: "#0000001A" }}
      >
        <Text className="text-body2 text-text-normal">
          {i18n.t("login.optional_login_button")}
        </Text>
      </PressableScale>
    </View>
  );
}
