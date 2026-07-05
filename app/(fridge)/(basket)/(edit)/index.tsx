import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import { useDeleteFridgeBasketIngredientMutation } from "@/app/hooks/mutations/useDeleteFridgeBasketIngredientMutation";
import { usePatchFridgeBasketIngredientMutation } from "@/app/hooks/mutations/usePatchFridgeBasketIngredientMutation";
import { useAuthStatus } from "@/app/hooks/useAuthStatus";
import {
  useGuestDeleteFridgeBasketIngredientMutation,
  useGuestPatchFridgeBasketIngredientMutation,
} from "@/app/lib/storage/guestFridge";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import { CTAButton } from "@/components/CTAButton";
import { ScreenLayout } from "@/components/layout/ScreenLayout";
import { FoodDataManager } from "@/constants/IngredientManager";
import { toDateOnlyRequestString } from "@/app/utils/DateTimeUtils";
import i18n from "@/lib/i18n";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { EditExpiredAtMenu } from "../../(edit)/components/EditExpiredAtMenu";
import { EditQuantityMenu } from "../../(edit)/components/EditQuantityMenu";
import { EditUnitMenu } from "../../(edit)/components/EditUnitMenu";

export default function BasketIngredientEditScreen() {
  const { id, ingredientName, ingredientIconId, expiredAt, quantity, unit } =
    useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuthStatus();

  const { deleteFridgeBasketIngredient, isDeletePending } =
    useDeleteFridgeBasketIngredientMutation({
      onSuccess: () => {
        router.back();
      },
    });
  const { deleteGuestFridgeBasketIngredient, isGuestDeletePending } =
    useGuestDeleteFridgeBasketIngredientMutation({
      onSuccess: () => {
        router.back();
      },
    });
  const { patchFridgeBasketIngredient, isPatchPending } =
    usePatchFridgeBasketIngredientMutation({
      onSuccess: () => {
        router.back();
      },
    });
  const { patchGuestFridgeBasketIngredient, isGuestPatchPending } =
    useGuestPatchFridgeBasketIngredientMutation({
      onSuccess: () => {
        router.back();
      },
    });

  const ingredient = {
    id: Number(id),
    ingredientName: ingredientName as string,
    ingredientIconId: Number(ingredientIconId),
    expiredAt: expiredAt as string,
    quantity: Number(quantity),
    unit: unit as string,
  };

  const Icon = FoodDataManager.getImageSource(ingredient.ingredientIconId);

  const [localData, setLocalData] = useState(ingredient);

  const [removeDialogVisible, setRemoveDialogVisible] = useState(false);

  useEffect(() => {
    setLocalData(ingredient);
  }, [id, ingredientName, ingredientIconId, expiredAt, quantity, unit]);

  const areIngredientsEqual = (a: typeof ingredient, b: typeof ingredient) => {
    return (
      a.expiredAt === b.expiredAt &&
      a.quantity === b.quantity &&
      a.unit === b.unit
    );
  };

  const onCTAClick = async () => {
    if (!localData) return;

    if (areIngredientsEqual(localData, ingredient)) {
      router.back();
      return;
    }

    try {
      if (!isAuthenticated) {
        await patchGuestFridgeBasketIngredient({
          id: Number(id),
          body: {
            expiredAt: localData.expiredAt,
            quantity: localData.quantity,
            unit: localData.unit,
          },
        });
        return;
      }

      await patchFridgeBasketIngredient({
        id: Number(id),
        body: {
          expiredAt: toDateOnlyRequestString(localData.expiredAt),
          quantity: localData.quantity,
          unit: localData.unit,
        },
      });
    } catch (error) {
      console.error("Failed to update fridge:", error);
    }
  };

  const onRemoveClick = () => {
    setRemoveDialogVisible(true);
  };

  const onRemoveDialogConfirm = async () => {
    setRemoveDialogVisible(false);

    if (!isAuthenticated) {
      deleteGuestFridgeBasketIngredient(Number(id));
      return;
    }

    deleteFridgeBasketIngredient(Number(id));
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
      isScrollEnabled={true}
      footer={
        <View className="fixed bottom-0 left-0 right-0 px-4 pb-[22px]">
          <DebouncedPressable
            className="items-center py-[14px]"
            onPress={onRemoveClick}
          >
            <Text className="text-title5 text-strong-destructive">
              {i18n.t("fridge_basket.remove")}
            </Text>
          </DebouncedPressable>

          <CTAButton
            buttonLabel={i18n.t("edit_food.cta")}
            isLoading={isAuthenticated ? isPatchPending : isGuestPatchPending}
            onPress={onCTAClick}
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
          onExpiredAtChanged={(expiredAt) => updateLocalData({ expiredAt })}
        />

        <EditUnitMenu
          unit={localData?.unit}
          onUnitChanged={(unit) => updateLocalData({ unit })}
        />
      </View>

      <ChoiceDialog
        visible={removeDialogVisible}
        title={i18n.t("fridge_basket.remove_dialog_title")}
        message={i18n.t("fridge_basket.remove_dialog_message")}
        confirmText={i18n.t("fridge_basket.remove_dialog_confirm")}
        isConfirmLoading={
          isAuthenticated ? isDeletePending : isGuestDeletePending
        }
        onConfirm={onRemoveDialogConfirm}
        onCancel={onRemoveDialogCancel}
      />
    </ScreenLayout>
  );
}
