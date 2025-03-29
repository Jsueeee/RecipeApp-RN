import React from "react";
import { Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface Props {
  onPress: () => void;
}

export function AddIngredientButton({ onPress }: Props) {
  return (
    <Pressable
      className="absolute bottom-20 right-4 bg-primary-normal w-14 h-14 rounded-full items-center justify-center"
      onPress={onPress}
    >
      <MaterialIcons name="add" size={24} color="white" />
    </Pressable>
  );
}
