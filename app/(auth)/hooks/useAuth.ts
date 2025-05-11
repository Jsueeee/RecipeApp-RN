import { useGoogleLoginMutation } from "@/app/hooks/mutations/useGoogleLoginMutation";
import { useLoginMutation } from "@/app/hooks/mutations/useLoginMutation";
import { router } from "expo-router";

export const useAuth = () => {
  const { kakaoLogin, isLoading, error } = useLoginMutation();
  const { googleLogin } = useGoogleLoginMutation();

  const handleKakaoLogin = async () => {
    try {
      await kakaoLogin();
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
    }
  };

  const handleNaverLogin = async () => {
    try {
      // 네이버 로그인 로직
    } catch (error) {
      // 에러 처리
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
    }
  };

  return {
    handleKakaoLogin,
    handleNaverLogin,
    handleGoogleLogin,
  };
};
