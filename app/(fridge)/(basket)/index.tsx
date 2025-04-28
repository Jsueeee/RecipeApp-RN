import { useFridgeBasketQuery } from "@/app/hooks/queries/useFridgeBasketQuery";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { Text, View } from "react-native";

export default function IngredientBasketScreen() {
  const { basketCount, categorizedFridgeBaskets, isLoading, isError } =
    useFridgeBasketQuery();

  return (
    <ScreenLayout title="냉장고 바구니">
      <View>
        <Text>냉장고 바구니</Text>
      </View>
    </ScreenLayout>
  );
}
