import { FAB } from "@/components/FAB";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";

export function AddIngredientButton() {
  const onPress = () => {
    router.push("/(ingredient)/(pick)");
  };

  return (
    <FAB
      icon={<MaterialIcons name="add" size={24} color="white" />}
      onPress={onPress}
    />
  );
}
