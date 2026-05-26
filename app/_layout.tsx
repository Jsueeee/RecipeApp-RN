import { TutorialProvider } from "@/app/tutorial";
import { queryClient } from "@/app/lib/query/client";
import {
  googleLoginWebClientId,
  kakaoNativeAppKey,
  naverLoginClientId,
  naverLoginClientSecret,
  validatePublicEnv,
} from "@/app/lib/config/env";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { initializeKakaoSDK } from "@react-native-kakao/core";
import NaverLogin from "@react-native-seoul/naver-login";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import mobileAds from "react-native-google-mobile-ads";
import "react-native-reanimated";
import ToastManager from "toastify-react-native";
import "../global.css";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(auth)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    pretendard: require("../assets/fonts/pretendard_regular.otf"),
    pretendard_medium: require("../assets/fonts/pretendard_medium.otf"),
    pretendard_semi_bold: require("../assets/fonts/pretendard_semi_bold.otf"),
    pretendard_bold: require("../assets/fonts/pretendard_bold.otf"),
    cafe24: require("../assets/fonts/cafe24.otf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    validatePublicEnv();

    initializeKakaoSDK(kakaoNativeAppKey);

    GoogleSignin.configure({
      webClientId: googleLoginWebClientId,
      scopes: ["email", "profile"],
      offlineAccess: true,
    });

    NaverLogin.initialize({
      appName: "레시피 저장소",
      consumerKey: naverLoginClientId,
      consumerSecret: naverLoginClientSecret,
      serviceUrlSchemeIOS: "com.recipe.android.recipeapp",
      disableNaverAppAuthIOS: true,
    });

    mobileAds()
      .setRequestConfiguration({
        testDeviceIdentifiers: __DEV__ ? ["EMULATOR"] : [],
      })
      .then(() => {
        mobileAds().initialize();
      })
      .catch((error) => {
        console.error("Request configuration error", error);
      });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}

const toastConfig = {
  success: (props: any) => (
    <View className="w-[80%] px-4 py-4 bg-fill-strong rounded-[12px] mt-[20px]">
      <Text className="text-body2 text-text-inverse">{props.text1}</Text>
      {props.text2 && (
        <Text className="text-body4 text-text-inverse">{props.text2}</Text>
      )}
    </View>
  ),
  error: (
    // TODO : 나중에 커스텀하기
    props: any,
  ) => (
    <View className="w-[80%] px-4 py-4 bg-fill-strong rounded-[12px]">
      <Text className="text-body2 text-text-inverse">{props.text1}</Text>
      {props.text2 && (
        <Text className="text-body4 text-text-inverse">{props.text2}</Text>
      )}
    </View>
  ),
};

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SystemBars style="auto" />
      <BottomSheetModalProvider>
        <TutorialProvider>
          <ThemeProvider
            value={colorScheme.colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(fridge)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(fridge)/(edit)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(recipe)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(recipe)/(detail)"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(search)" options={{ headerShown: false }} />
            <Stack.Screen name="(myPage)" options={{ headerShown: false }} />
            <Stack.Screen
              name="(myPage)/(profile)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(myPage)/(myRecipe)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(setting)"
              options={{
                headerShown: false,
                gestureEnabled: false,
                fullScreenGestureEnabled: false,
              }}
            />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
          </ThemeProvider>
        </TutorialProvider>
      </BottomSheetModalProvider>

      <ToastManager
        config={toastConfig}
        animationType="slide"
        duration={1500}
        useModal={false}
      />
    </GestureHandlerRootView>
  );
}
