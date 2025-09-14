import { View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

interface Props {
  icon: React.ReactNode;
  onPress: () => void;
}

export function FAB({ icon, onPress }: Props) {
  return (
    <Pressable
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
    </Pressable>
  );
}
