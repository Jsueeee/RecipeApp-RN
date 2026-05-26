import { defaultStackScreenOptions } from "@/app/lib/navigation/stackOptions";
import { Stack } from "expo-router";

export default function DeleteAccountLayout() {
  return (
    <Stack screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="(success)"
        options={{
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        }}
      />
    </Stack>
  );
}
