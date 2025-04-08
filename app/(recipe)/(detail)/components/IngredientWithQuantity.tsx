import { RecipeIngredient } from "@/app/types/domain/recipe";
import { FoodDataManager } from "@/constants/IngredientManager";
import { Text, View } from "react-native";

export const IngredientWithQuantity: React.FC<{
  item: RecipeIngredient;
}> = ({ item }) => {
  const Icon = FoodDataManager.getImageSource(item.iconId);

  return (
    <View className="items-center flex-1 mt-1">
      <View className="w-12 h-12 justify-center items-center">
        {Icon && <Icon width={60} height={60} />}
      </View>

      <Text className="text-utility3 text-text-normal mt-2">{item.name}</Text>

      <Text className="text-body4 text-text-assistive">
        {item.quantity}
        {item.unit}
      </Text>
    </View>
  );
};
