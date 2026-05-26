import { Stack } from "expo-router";

export default function DeleteAccountSuccessLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        fullScreenGestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}
