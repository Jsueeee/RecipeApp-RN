import { defaultStackScreenOptions } from "@/app/lib/navigation/stackOptions";
import { Stack } from "expo-router";

export default function DeleteAccountSuccessLayout() {
  return (
    <Stack
      screenOptions={{
        ...defaultStackScreenOptions,
        gestureEnabled: false,
        fullScreenGestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
