import { login } from "@react-native-kakao/user";

export const useAuth = () => {
  const handleKakaoLogin = async () => {
    try {
      const result = await login();

      console.log("result", result);
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
