import { DebouncedGesturePressable } from "@/app/components/DebouncedPressable";
import { View } from "react-native";

interface Props {
  icon: React.ReactNode;
  onPress: () => void;
}

export function FAB({ icon, onPress }: Props) {
  return (
    <DebouncedGesturePressable
      onPress={onPress}
      style={({ pressed }) => ({
        position: "absolute",
        bottom: 80,
        right: 16,
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: pressed ? "#30C09C" : "#4BD2B0",
        alignItems: "center",
        justifyContent: "center",
      })}
    >
      <View>{icon}</View>
    </DebouncedGesturePressable>
  );
}
