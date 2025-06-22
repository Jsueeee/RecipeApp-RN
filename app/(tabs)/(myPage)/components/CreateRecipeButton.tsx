import { PressableScale } from "@/app/components/PressableScale";
import CreateRecipeFabIcon from "@/assets/images/ic_create_recipe_fab.svg";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";

export function CreateRecipeButton() {
  const router = useRouter();

  const onButtonPress = () => {
    router.push("/(recipe)/(create)");
  };

  return (
    <PressableScale
      onPress={onButtonPress}
      className="absolute bottom-20 right-4"
    >
      <View className="items-center justify-center w-12 h-12 bg-primary-normal rounded-full">
        <CreateRecipeFabIcon width={20} height={20} />
      </View>
    </PressableScale>
  );
}
