import { useFridgeDetailQuery } from "@/app/hooks/queries/useFridgeDetailQuery";
import { CTAButton } from "@/components/CTAButton";
import { Header } from "@/components/Header";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { router, useLocalSearchParams } from "expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";

export default function IngredientEditScreen() {
  const { id } = useLocalSearchParams();

  const {
    data: ingredient,
    isLoading,
    error,
  } = useFridgeDetailQuery(Number(id));

  const Icon = FoodDataManager.getImageSource(ingredient?.ingredientIconId);

  const onCTAClick = () => {
    console.log("CTA clicked");
  };

  if (!ingredient) return null;

  return (
    <ScreenLayout
      title={ingredient.ingredientName}
      footer={
        <View className="fixed bottom-0 left-0 right-0 px-4 pb-safe">
          <Pressable className="items-center py-[14px]">
            <Text className="text-title5 text-strong-destructive">
              {i18n.t("edit_food.remove")}
            </Text>
          </Pressable>

          <CTAButton
            buttonLabel={i18n.t("edit_food.cta")}
            onClick={onCTAClick}
            disabled={ingredient.quantity <= 0}
            className="mt-2"
          />
        </View>
      }
    >
      <View className="flex-1 px-4 pt-3 items-center">
        {Icon && <Icon width={100} height={100} className="rounded-full" />}
      </View>
    </ScreenLayout>
  );
}
