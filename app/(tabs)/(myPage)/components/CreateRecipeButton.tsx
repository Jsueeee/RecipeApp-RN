import CreateRecipeFabIcon from "@/assets/images/ic_create_recipe_fab.svg";
import { FAB } from "@/components/FAB";
import { useRouter } from "expo-router";
import React from "react";

export function CreateRecipeButton() {
  const router = useRouter();

  const onButtonPress = () => {
    router.push("/(recipe)/(create)");
  };

  return (
    <FAB
      icon={<CreateRecipeFabIcon width={20} height={20} />}
      onPress={onButtonPress}
    />
  );
}
