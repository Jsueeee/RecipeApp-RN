import type { NativeStackNavigationOptions } from "@react-navigation/native-stack";

export const defaultStackScreenOptions = {
  headerShown: false,
  animation: "ios_from_right",
} satisfies NativeStackNavigationOptions;
