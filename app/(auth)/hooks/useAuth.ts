import { useAppleLoginMutation } from "@/app/hooks/mutations/useAppleLoginMutation";
import { useGoogleLoginMutation } from "@/app/hooks/mutations/useGoogleLoginMutation";
import { useLoginMutation } from "@/app/hooks/mutations/useLoginMutation";
import { useNaverLoginMutation } from "@/app/hooks/mutations/useNaverLoginMutation";
import { router } from "expo-router";
import { useRef } from "react";

interface Props {
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuth = ({ setIsLoading }: Props) => {
  const { kakaoLogin, isLoading: isKakaoPending } = useLoginMutation();
  const { googleLogin, isLoading: isGooglePending } = useGoogleLoginMutation();
  const { naverLogin, isLoading: isNaverPending } = useNaverLoginMutation();
  const { appleLogin, isLoading: isApplePending } = useAppleLoginMutation();

  // mutation isPending은 setState 후 다음 렌더에 반영되므로
  // 같은 렌더에서 빠르게 두 번 탭하는 경우 ref로 즉시 차단한다.
  const inFlightRef = useRef(false);

  const isAnyAuthPending =
    isKakaoPending || isGooglePending || isNaverPending || isApplePending;

  const runOnce = async (login: () => Promise<unknown>) => {
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    try {
      await login();
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      inFlightRef.current = false;
    }
  };

  const handleKakaoLogin = () => runOnce(kakaoLogin);
  const handleNaverLogin = () => runOnce(naverLogin);
  const handleGoogleLogin = () => runOnce(googleLogin);
  const handleAppleLogin = () => runOnce(appleLogin);

  return {
    handleKakaoLogin,
    handleNaverLogin,
    handleGoogleLogin,
    handleAppleLogin,
    isAnyAuthPending,
  };
};
