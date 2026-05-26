import { defaultStackScreenOptions } from "@/app/lib/navigation/stackOptions";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={defaultStackScreenOptions}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
