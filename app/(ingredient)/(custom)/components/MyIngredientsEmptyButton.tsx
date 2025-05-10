import CheeseImage from "@/assets/images/img_cheese.svg";
import { SecondaryButton } from "@/components/SecondaryButton";
import i18n from "@/lib/i18n";
import React from "react";
import { View } from "react-native";

interface MyIngredientsEmptyButtonProps {
  onPress: () => void;
}

export const MyIngredientsEmptyButton = ({
  onPress,
}: MyIngredientsEmptyButtonProps) => {
  return (
    <View className="absolute top-0 left-0 right-0 bottom-10 items-center justify-center gap-3">
      <CheeseImage width={100} height={100} />

      <SecondaryButton
        buttonLabel={i18n.t(
          "custom_ingredient.create_custom_ingredient_button"
        )}
        onPress={onPress}
      />
    </View>
  );
};
