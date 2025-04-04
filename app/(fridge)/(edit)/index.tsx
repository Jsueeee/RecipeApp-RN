import { useDeleteFridgeMutation } from "@/app/hooks/mutations/useDeleteFridgeMutation";
import { useFridgeDetailQuery } from "@/app/hooks/queries/useFridgeDetailQuery";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FoodDataManager } from "@/constants/IngredientManager";
import i18n from "@/lib/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { EditExpiredAtMenu } from "./components/EditExpiredAtMenu";
import { EditQuantityMenu } from "./components/EditQuantityMenu";
import { EditUnitMenu } from "./components/EditUnitMenu";
import { usePatchFridgeMutation } from "@/app/hooks/mutations/usePatchFridgeMutation";

export default function IngredientEditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const {
    data: ingredient,
    isLoading,
    error,
  } = useFridgeDetailQuery(Number(id));

  const Icon = FoodDataManager.getImageSource(ingredient?.ingredientIconId);

  const [localData, setLocalData] = useState(ingredient);

  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);

  const deleteFridgeMutation = useDeleteFridgeMutation();
  const patchFridgeMutation = usePatchFridgeMutation();

  useEffect(() => {
    setLocalData(ingredient);
  }, [ingredient]);

  const onCTAClick = async () => {
    if (!localData) return;

    try {
      await patchFridgeMutation.mutateAsync({
        fridgeId: Number(id),
        expiredAt: localData.expiredAt,
        quantity: localData.quantity,
        unit: localData.unit,
      });

      router.back();
    } catch (error) {
      console.error("Failed to update fridge:", error);
    }
  };

  const onRemoveClick = () => {
    setRemoveDialogVisible(true);
  };

  const onRemoveDialogConfirm = async () => {
    setRemoveDialogVisible(false);
    try {
      await deleteFridgeMutation.mutateAsync(Number(id));
      router.back();
    } catch (error) {
      console.error("Failed to delete fridge:", error);
    }
  };

  const onRemoveDialogCancel = () => {
    setRemoveDialogVisible(false);
  };

  const updateLocalData = (update: Partial<typeof localData>) => {
    if (localData) {
      setLocalData({ ...localData, ...update });
    }
  };

  if (!ingredient) return null;

  return (
    <ScreenLayout
      title={ingredient.ingredientName}
      footer={
        <View className="fixed bottom-0 left-0 right-0 px-4 pb-[22px]">
          <Pressable className="items-center py-[14px]" onPress={onRemoveClick}>
            <Text className="text-title5 text-strong-destructive">
              {i18n.t("edit_food.remove")}
            </Text>
          </Pressable>

          <CTAButton
            buttonLabel={i18n.t("edit_food.cta")}
            onClick={onCTAClick}
            disabled={!localData?.quantity || localData.quantity <= 0}
            className="mt-2"
          />
        </View>
      }
    >
      <View className="flex-1 px-4 pt-3 items-center">
        {Icon && <Icon width={100} height={100} className="rounded-full" />}

        <View className="h-3" />

        <EditQuantityMenu
          quantity={localData?.quantity ?? 0}
          onQuantityChanged={(quantity) => updateLocalData({ quantity })}
        />

        <EditExpiredAtMenu
          expiredAt={localData?.expiredAt}
          onExpiredAtChanged={(expiredAt) => {
            const date = new Date(expiredAt);
            const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
            updateLocalData({ expiredAt: kstDate.toISOString() });
          }}
        />

        <EditUnitMenu
          unit={localData?.unit}
          onUnitChanged={(unit) => updateLocalData({ unit })}
        />
      </View>

      <ChoiceDialog
        visible={removeDialogVisible}
        title={i18n.t("edit_food.remove_dialog_title")}
        message={i18n.t("edit_food.remove_dialog_message")}
        confirmText={i18n.t("edit_food.delete_dialog_confirm")}
        onConfirm={onRemoveDialogConfirm}
        onCancel={onRemoveDialogCancel}
      />
    </ScreenLayout>
  );
}
