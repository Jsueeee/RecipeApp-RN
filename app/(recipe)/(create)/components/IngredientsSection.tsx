import { PressableScale } from "@/app/components/PressableScale";
import { RecipeIngredientInput } from "@/app/types/api/recipe";
import IC_PLUS from "@/assets/images/ic_plus_bold.svg";
import IC_DELETE from "@/assets/images/ic_selected_cancel.svg";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { EmptyIngredientsPlaceholder } from "../../(detail)/components/EmptyIngredientsPlaceholder";
import { IngredientFridgeType } from "../../(detail)/components/RecipeIngredients";
import { IngredientWithIndex } from "..";

interface IngredientItemProps {
  item: RecipeIngredientInput;
  onPress: () => void;
  onDeleteButtonPress: () => void;
}

interface Props {
  ingredients: IngredientWithIndex[];
  onPress: (item: IngredientWithIndex) => void;
  onDeleteButtonPress: (item: IngredientWithIndex) => void;
  onAddButtonPress: () => void;
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

const PlusButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <PressableScale onPress={onPress} hitSlop={10}>
      <View className="flex-row items-center gap-x-1">
        <IC_PLUS width={12} height={12} color="#4BD2B0" />

        <Text className="text-utility2 text-primary-normal">
          {i18n.t("recipe_my_create.ingredients_add_icon")}
        </Text>
      </View>
    </PressableScale>
  );
};

export const IngredientsSection = ({
  ingredients = [],
  onPress,
  onDeleteButtonPress,
  onAddButtonPress,
}: Props) => {
  return (
    <View className="w-full">
      <Text className="text-title3 text-text-normal">
        {i18n.t("recipe_my_create.cooking_ingredients_title")}
      </Text>

      <View className="h-[10px]" />

      {ingredients.length === 0 ? (
        <EmptyIngredientsPlaceholder
          type={IngredientFridgeType.CREATE_RECIPE}
        />
      ) : (
        <>
          {ingredients.map((item, index) => (
            <IngredientItem
              key={index}
              item={item.ingredient}
              onPress={() => onPress(item)}
              onDeleteButtonPress={() => onDeleteButtonPress(item)}
            />
          ))}
        </>
      )}

      <View className="items-center">
        <PlusButton onPress={onAddButtonPress} />
      </View>
    </View>
  );
};
