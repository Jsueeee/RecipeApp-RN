import { RecipeIngredientInput } from "@/app/types/api/recipe";
import IC_DELETE from "@/assets/images/ic_selected_cancel.svg";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

interface IngredientItemProps {
  item: RecipeIngredientInput;
  onPress: () => void;
  onDeleteButtonPress: () => void;
}

interface Props {
  ingredients: RecipeIngredientInput[];
  onPress: (item: RecipeIngredientInput) => void;
  onDeleteButtonPress: (item: RecipeIngredientInput) => void;
}

export function IngredientItem({
  item,
  onPress,
  onDeleteButtonPress,
}: IngredientItemProps) {
  const Icon = FoodDataManager.getImageSource(item.ingredientIconId);

  return (
    <Pressable className="flex-row items-center p-2 pr-4" onPress={onPress}>
      <View className="w-12 h-12 justify-center items-center">
        {Icon && <Icon width={40} height={40} />}
      </View>

      <View className="flex-1 ml-1 mr-4 gap-[2px]">
        <Text className="text-title5 text-text-strong">
          {item.ingredientName}
        </Text>

        <View className="flex-row items-center">
          <Text className="text-body3 text-text-alternative">
            {item.quantity}
            {item.unit}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onDeleteButtonPress}
        style={{ alignSelf: "flex-start" }}
      >
        <IC_DELETE width={24} height={24} />
      </TouchableOpacity>
    </Pressable>
  );
}

export const IngredientsSection = ({
  ingredients = [],
  onPress,
  onDeleteButtonPress,
}: Props) => {
  return (
    <View className="w-full">
      <Text className="text-title3 text-text-normal">
        {i18n.t("recipe_my_create.cooking_ingredients_title")}
      </Text>

      <View className="h-[10px]" />

      {ingredients.map((item, index) => (
        <IngredientItem
          key={index}
          item={item}
          onPress={() => onPress(item)}
          onDeleteButtonPress={() => onDeleteButtonPress(item)}
        />
      ))}
    </View>
  );
};
