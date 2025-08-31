import i18n from "@/lib/i18n";
import { Image, Platform, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../hooks/useAuth";

enum LoginMethod {
  KAKAO = "KAKAO",
  NAVER = "NAVER",
  GOOGLE = "GOOGLE",
}

interface Props {
  method: LoginMethod;
  onClick: () => void;
}

const DefaultLoginButton = ({ method, onClick: onPress }: Props) => {
  const getIcon = () => {
    switch (method) {
      case LoginMethod.KAKAO:
        return require("@/assets/images/ic_login_kakao.png");
      case LoginMethod.NAVER:
        return require("@/assets/images/ic_login_naver.png");
      case LoginMethod.GOOGLE:
        return require("@/assets/images/ic_login_google.png");
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="w-full rounded-xl bg-teal-200 p-4"
    >
      <View className="flex-row items-center justify-center">
        <Image source={getIcon()} className="w-5 h-5 absolute left-4" />
        <Text className="text-title5 text-gray-800 text-center flex-1">
          {i18n.t(`login.with_${method}`)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function LoginButtonColumn() {
  const { handleKakaoLogin, handleNaverLogin, handleGoogleLogin } = useAuth();

  // 플랫폼별 설정
  const isIOS = Platform.OS === "ios";
  const buttonHeight = 52; // p-4(16*2) + 텍스트(20) = 약 52px // TODO : 텍스트 크기 고정 고려하기
  const gap = 8;
  const totalHeight = 4 * buttonHeight + 3 * gap; // 4개 버튼 + 3개 간격의 고정 높이

  return (
    <View
      className="w-full max-w-[500px]"
      style={{
        gap: gap,
        height: totalHeight,
      }}
    >
      {isIOS ? (
        <DefaultLoginButton
          method={LoginMethod.KAKAO} // TODO : 애플 로그인으로 변경
          onClick={handleKakaoLogin}
        />
      ) : (
        <View className="h-[52px]" />
      )}
      <DefaultLoginButton
        method={LoginMethod.KAKAO}
        onClick={handleKakaoLogin}
      />
      <DefaultLoginButton
        method={LoginMethod.NAVER}
        onClick={handleNaverLogin}
      />
      <DefaultLoginButton
        method={LoginMethod.GOOGLE}
        onClick={handleGoogleLogin}
      />
    </View>
  );
}
