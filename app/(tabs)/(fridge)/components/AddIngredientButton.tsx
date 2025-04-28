import { PressableScale } from "@/app/components/PressableScale";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

interface Props {
  onPress: () => void;
}

export function AddIngredientButton({ onPress }: Props) {
  return (
    <PressableScale onPress={onPress} className="absolute bottom-20 right-4">
      <View className="bg-primary-normal w-14 h-14 rounded-full items-center justify-center">
        <MaterialIcons name="add" size={24} color="white" />
      </View>
    </PressableScale>
  );
}
