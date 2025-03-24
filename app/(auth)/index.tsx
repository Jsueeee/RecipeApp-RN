import LoginButtonColumn from "@/app/(auth)/components/LoginButton";
import i18n from "@/lib/i18n";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SplashLogo from "./components/SplashLogo";

export default function Login() {
  const logoAnimation = useRef(new Animated.Value(0)).current;
  const buttonAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const [buttonHeight, setButtonHeight] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (buttonHeight > 0) {
        console.log("buttonHeight", buttonHeight);
        Animated.parallel([
          Animated.timing(logoAnimation, {
            toValue: 1,
            duration: 800,
            useNativeDriver: false,
          }),
          Animated.timing(buttonAnimation, {
            toValue: 1,
            duration: 800,
            delay: 500,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 1300,
            delay: 500,
            useNativeDriver: false,
          }),
        ]).start();
      }
    };

    initialize();
  }, [buttonHeight]);

  return (
    <SafeAreaView className="flex-1 bg-teal-300" edges={["top", "bottom"]}>
      <StatusBar style="dark" />

      <View className="flex-1 justify-between">
        <Animated.View
          style={{
            transform: [
              {
                translateY: logoAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -(buttonHeight / 2)],
                }),
              },
            ],
          }}
          className="flex-1 items-center justify-center"
        >
          <SplashLogo />
        </Animated.View>

        <Animated.Text
          style={{
            transform: [
              {
                translateY: logoAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -buttonHeight],
                }),
              },
            ],
          }}
          className="text-heading2 font-cafe24 text-white text-center mb-9"
        >
          {i18n.t("app.name")}
        </Animated.Text>
      </View>

      <Animated.View
        style={{
          opacity: opacityAnimation,
          transform: [
            {
              translateY: buttonAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        }}
        className="absolute bottom-0 left-0 right-0 w-full px-4 pb-6 overflow-hidden"
        onLayout={(event) => {
          setButtonHeight(event.nativeEvent.layout.height);
        }}
      >
        <LoginButtonColumn />
      </Animated.View>
    </SafeAreaView>
  );
}
