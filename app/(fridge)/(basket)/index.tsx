import { useFridgeBasketQuery } from "@/app/hooks/queries/useFridgeBasketQuery";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { View } from "react-native";

export default function IngredientBasketScreen() {
  const { basketCount, categorizedFridgeBaskets, isLoading, isError } =
    useFridgeBasketQuery();

  return (
    <ScreenLayout
      title={i18n.t("fridge_basket.header")}
      backgroundColor="bg-alternative"
    >
      <View className="flex-1"></View>
    </ScreenLayout>
  );
}
