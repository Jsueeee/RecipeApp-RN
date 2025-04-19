import { queryClient } from "@/app/lib/query/client";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { initializeKakaoSDK } from "@react-native-kakao/core";
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
import "react-native-reanimated";
import "../global.css";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

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
    initializeKakaoSDK("3cb89516c27c020802d2b85534cda074");
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

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
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
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </ThemeProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
