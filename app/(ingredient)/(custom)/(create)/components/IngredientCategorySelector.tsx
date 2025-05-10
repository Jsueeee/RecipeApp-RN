import {
  CATEGORY_MAPPING,
  FridgeTabs,
} from "@/app/(tabs)/(fridge)/constants/fridgeTabs";
import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import { Text, View } from "react-native";

interface Props {
  selectedCategoryId: number | null;
  onCategoryChanged: (value: number) => void;
}

export function IngredientCategorySelector({
  selectedCategoryId,
  onCategoryChanged,
}: Props) {
  return (
    <View className="w-full">
      <Text className="text-title5 text-text-alternative w-[100px]">
        {i18n.t("custom_ingredient_create.category")}
      </Text>

      <CategorySelector
        selectedCategoryId={selectedCategoryId}
        onCategoryChanged={onCategoryChanged}
      />
    </View>
  );
}

const CATEGORY_LIST = Object.values(FridgeTabs).filter(
  (category) => category !== FridgeTabs.ALL
);

function CategorySelector({ selectedCategoryId, onCategoryChanged }: Props) {
  return (
    <View className="mt-3.5 flex-row flex-wrap gap-x-1.5 gap-y-2">
      {CATEGORY_LIST.map((category) => {
        const categoryId =
          CATEGORY_MAPPING[category as keyof typeof CATEGORY_MAPPING];
        return (
          <PressableScale
            key={category}
            onPress={() => onCategoryChanged(categoryId)}
          >
            <View
              className={`rounded-[20px] px-[20px] py-[9px] border border-1 ${
                categoryId === selectedCategoryId
                  ? "bg-teal-500 border-teal-500"
                  : "bg-white border-line-normal"
              }`}
            >
              <Text
                className={`text-utility2 ${
                  categoryId === selectedCategoryId
                    ? "text-white"
                    : "text-text-alternative"
                }`}
              >
                {category}
              </Text>
            </View>
          </PressableScale>
        );
      })}
    </View>
  );
}
