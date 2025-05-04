import { FridgeTabs } from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import { Text, View } from "react-native";

interface Props {
  selectedCategory: string;
  onCategoryChanged: (value: string) => void;
}

export function IngredientCategorySelector({
  selectedCategory,
  onCategoryChanged,
}: Props) {
  return (
    <View className="w-full">
      <Text className="text-title5 text-text-alternative w-[100px]">
        {i18n.t("custom_ingredient_create.category")}
      </Text>

      <CategorySelector
        selectedCategory={selectedCategory}
        onCategoryChanged={onCategoryChanged}
      />
    </View>
  );
}

const CATEGORIES = Object.values(FridgeTabs);

function CategorySelector({ selectedCategory, onCategoryChanged }: Props) {
  return (
    <View className="mt-3.5 flex-row flex-wrap gap-x-1.5 gap-y-2">
      {CATEGORIES.map((category, index) => (
        <PressableScale
          key={category + index}
          onPress={() => onCategoryChanged(category)}
        >
          <View
            className={`rounded-[20px] px-[20px] py-[9px] border border-1 ${
              category === selectedCategory
                ? "bg-teal-500 border-teal-500"
                : "bg-white border-line-normal"
            }`}
          >
            <Text
              className={`text-utility2 ${
                category === selectedCategory
                  ? "text-white"
                  : "text-text-alternative"
              }`}
            >
              {category}
            </Text>
          </View>
        </PressableScale>
      ))}
    </View>
  );
}
