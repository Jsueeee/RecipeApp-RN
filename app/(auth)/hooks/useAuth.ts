import { useGoogleLoginMutation } from "@/app/hooks/mutations/useGoogleLoginMutation";
import { useLoginMutation } from "@/app/hooks/mutations/useLoginMutation";
import { useNaverLoginMutation } from "@/app/hooks/mutations/useNaverLoginMutation";
import { router } from "expo-router";

export const useAuth = () => {
  const { kakaoLogin, isLoading, error } = useLoginMutation();
  const { googleLogin } = useGoogleLoginMutation();
  const { naverLogin } = useNaverLoginMutation();

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
      await naverLogin();
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
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
