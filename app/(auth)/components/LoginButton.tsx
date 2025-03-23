import i18n from "@/lib/i18n";
import { View, Text, TouchableOpacity, Image } from "react-native";

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
        <Text className="text-title5 font-pretendard text-gray-800 text-center flex-1">
          {i18n.t(`login.with_${method}`)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function LoginButtonColumn() {
  // TODO : 훅으로 분리
  const handleKakaoLogin = async () => {
    // TODO : 카카오 로그인 로직
    console.log("Kakao login");
  };

  const handleNaverLogin = async () => {
    // TODO : 네이버 로그인 로직
    console.log("Naver login");
  };

  const handleGoogleLogin = async () => {
    // TODO : 구글 로그인 로직
    console.log("Google login");
  };

  return (
    <View className="w-full max-w-[500px] mx-auto px-4 pb-6 gap-2 ">
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
