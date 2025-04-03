import i18n from "@/lib/i18n";
import { View, Text, TouchableOpacity, Image } from "react-native";
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

  return (
    <View className="w-full max-w-[500px] mx-auto px-4 pb-6 gap-2 mb-8 ">
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
