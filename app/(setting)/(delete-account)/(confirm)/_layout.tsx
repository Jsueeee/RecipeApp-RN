import { Stack } from "expo-router";

export default function DeleteAccountConfirmLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
