import { useLoginMutation } from "@/app/hooks/mutations/useLoginMutation";
import { AUTH_KEYS } from "@/app/lib/storage/auth";
import * as SecureStore from "expo-secure-store";

export const useAuth = () => {
  const { kakaoLogin, isLoading, error } = useLoginMutation();

  const handleKakaoLogin = async () => {
    try {
      kakaoLogin();
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
      // 구글 로그인 로직
    } catch (error) {
      // 에러 처리
    }
  };

  return {
    handleKakaoLogin,
    handleNaverLogin,
    handleGoogleLogin,
  };
};
