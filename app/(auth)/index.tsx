import LoginButtonColumn from "@/app/(auth)/components/LoginButton";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { SafeAreaView } from "react-native-safe-area-context";
import { ServerErrorDialog } from "../components/ServerErrorDialog";
import { UpdateVersionDialog } from "../components/UpdateVersionDialog";
import { useDefaultBottomSheetModal } from "../hooks/useDefaultBottomSheetModal";
import { useVersionCheck } from "../hooks/useVersionCheck";
import SplashParallax from "./components/SplashParallax";
import { useAutoLogin } from "./hooks/useAutoLogin";
import { OptionalLoginBottomSheet } from "./components/OptionalLoginBottomSheet";
import { DotLoadingScreen } from "@/components/DotLoadingScreen";

const DUR = {
  ENTRANCE: 1000, // 등장(요구사항 유지: 1초)
  HOLD_AFTER_ENTRANCE: 1000, // 등장 후 잠깐 멈춤
  LIFT: 1600, // 위로 올리기(패럴랙스) → 느리게
  BTN_SLIDE: 900, // 버튼 슬라이드
  BTN_OPACITY: 1100, // 버튼 페이드
  BTN_DELAY: 400, // 리프트 시작 후 버튼 슬라이드 지연
  BTN_OPACITY_DELAY: 550, // 리프트 시작 후 버튼 페이드 지연
};

export default function LoginScreen() {
  const { checkAuth } = useAutoLogin();

  // ⬇️ 등장/패럴랙스/버튼 애니메이션 값
  const entrance = useRef(new Animated.Value(0)).current; // 0→1 : 1초 페이드(등장)
  const lift = useRef(new Animated.Value(0)).current; // 0→1 : 위로 올리는 진행도(패럴랙스용)
  const buttonSlide = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const [buttonHeight, setButtonHeight] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const { isShowUpdateDialog, isErrorAppVersion } = useVersionCheck();

  const { ref: bottomSheetModalRef, open: openBottomSheetModal } =
    useDefaultBottomSheetModal();

  // 자동 로그인 시도는 마운트 동안 단 1번만 실행되어야 한다.
  // buttonHeight onLayout / StrictMode 더블 마운트 / 기타 deps 변화에
  // 의해 중복 실행되면 OAuth/리프레시가 2번 일어날 수 있음.
  const hasAttemptedAutoLoginRef = useRef(false);

  // 1) 처음 진입 시 1초 동안 "스르륵 등장"
  useEffect(() => {
    Animated.timing(entrance, {
      toValue: 1,
      duration: DUR.ENTRANCE,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // 2) 버전 체크/자동로그인 판별 후 → 실패 시 위로 올리며 버튼 노출
  useEffect(() => {
    const initialize = async () => {
      if (
        isShowUpdateDialog === undefined ||
        isShowUpdateDialog ||
        isErrorAppVersion
      ) {
        return;
      }
      if (buttonHeight === 0) return;
      if (hasAttemptedAutoLoginRef.current) return;

      hasAttemptedAutoLoginRef.current = true;

      const isAutoLoginSuccess = await checkAuth();
      if (isAutoLoginSuccess) {
        router.replace("/(tabs)");
      } else {
        startLoginReveal();
      }
    };

    initialize();
  }, [buttonHeight, isShowUpdateDialog, isErrorAppVersion]);

  const startLoginReveal = () => {
    Animated.sequence([
      Animated.delay(DUR.HOLD_AFTER_ENTRANCE), // ✅ 잠깐 멈췄다가
      Animated.parallel([
        // 리프트: 더 길고 천천히, 감속 곡선(Material Deceleration)
        Animated.timing(lift, {
          toValue: 1,
          duration: DUR.LIFT,
          easing: Easing.bezier(0.0, 0.0, 0.2, 1),
          useNativeDriver: true,
        }),
        // 버튼: 리프트 시작을 기준으로 여유 있게 등장
        Animated.timing(buttonSlide, {
          toValue: 1,
          duration: DUR.BTN_SLIDE,
          delay: DUR.BTN_DELAY,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: DUR.BTN_OPACITY,
          delay: DUR.BTN_OPACITY_DELAY,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-teal-300">
        <SystemBars style="dark" />
        <View className="flex-1 items-center justify-center">
          <SplashParallax entrance={entrance} lift={lift} liftDistance={100} />
        </View>

        <Animated.View
          style={{
            opacity: buttonOpacity,
            transform: [
              {
                translateY: buttonSlide.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          }}
          className="absolute bottom-0 left-0 right-0 w-full px-4 pb-6 mb-safe overflow-hidden items-center"
          onLayout={(e) => setButtonHeight(e.nativeEvent.layout.height)}
        >
          <LoginButtonColumn
            onPressOptionalLogin={openBottomSheetModal}
            setIsLoading={setIsLoading}
          />
        </Animated.View>
      </SafeAreaView>

      <OptionalLoginBottomSheet
        bottomSheetModalRef={bottomSheetModalRef}
        setIsLoading={setIsLoading}
      />

      <UpdateVersionDialog visible={Boolean(isShowUpdateDialog)} />
      <ServerErrorDialog visible={isErrorAppVersion} />

      {isLoading && <DotLoadingScreen isShowDim={true} />}
    </>
  );
}
