import { useFridgeDetailQuery } from "@/app/hooks/queries/useFridgeDetailQuery";
import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { EditExpiredAtMenu } from "./components/EditExpiredAtMenu";
import { EditQuantityMenu } from "./components/EditQuantityMenu";
import { EditUnitMenu } from "./components/EditUnitMenu";

export default function IngredientEditScreen() {
  const { id } = useLocalSearchParams();

  const {
    data: ingredient,
    isLoading,
    error,
  } = useFridgeDetailQuery(Number(id));

  const Icon = FoodDataManager.getImageSource(ingredient?.ingredientIconId);

  const [localQuantity, setLocalQuantity] = useState(ingredient?.quantity);
  const [localUnit, setLocalUnit] = useState(ingredient?.unit);
  const [localExpiredAt, setLocalExpiredAt] = useState(
    ingredient?.expiredAt ? new Date(ingredient.expiredAt) : null
  );
  const quantityErrorAnim = useRef(new Animated.Value(0)).current;

  const onCTAClick = () => {
    console.log("CTA clicked");
  };

  useEffect(() => {
    Animated.timing(quantityErrorAnim, {
      toValue: localQuantity === 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [localQuantity]);

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
            disabled={!localQuantity || localQuantity <= 0}
            className="mt-2"
          />
        </View>
      }
    >
      <View className="flex-1 px-4 pt-3 items-center">
        {Icon && <Icon width={100} height={100} className="rounded-full" />}

        <View className="h-3" />

        <EditQuantityMenu
          quantity={localQuantity ?? 0}
          onQuantityChanged={setLocalQuantity}
        />

        <Animated.Text
          style={[
            {
              opacity: quantityErrorAnim,
              height: quantityErrorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 20],
              }),
            },
          ]}
          className="text-body3 text-strong-destructive"
        >
          {i18n.t("edit_food.quantity_error")}
        </Animated.Text>

        <EditExpiredAtMenu
          expiredAt={localExpiredAt}
          onExpiredAtChanged={setLocalExpiredAt}
        />

        <EditUnitMenu unit={localUnit} onUnitChanged={setLocalUnit} />
      </View>
    </ScreenLayout>
  );
}
