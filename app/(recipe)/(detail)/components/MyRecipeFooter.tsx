import { useDeleteMyRecipeMutation } from "@/app/hooks/mutations/useDeleteMyRecipeMutation";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import { CTAButton } from "@/components/CTAButton";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  recipeId: number | undefined;
}

export const MyRecipeFooter = ({ recipeId }: Props) => {
  const { deleteMyRecipe } = useDeleteMyRecipeMutation({
    onSuccess: () => {
      router.back();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const onDeleteButtonPress = () => {
    setIsDeleteDialogVisible(true);
  };

  const onDeleteCancelButtonPress = () => {
    setIsDeleteDialogVisible(false);
  };

  const onDeleteConfirmButtonPress = () => {
    if (!recipeId) return;

    setIsDeleteDialogVisible(false);
    deleteMyRecipe(recipeId);
  };

  const onEditButtonPress = () => {
    // TODO: 수정 화면으로 이동
  };

  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        className="flex-row w-full py-2 px-4 bg-white rounded-t-2xl border-t border-l border-r border-[#ECEFED] self-center gap-2"
        style={{
          paddingBottom: insets.bottom,
        }}
      >
        <CTAButton
          buttonLabel={i18n.t("recipe_detail.my_recipe_delete")}
          variant="danger"
          onPress={onDeleteButtonPress}
          className="w-[120px]"
        />

        <CTAButton
          buttonLabel={i18n.t("recipe_detail.my_recipe_edit")}
          onPress={onEditButtonPress}
          className="flex-1"
        />
      </View>

      {isDeleteDialogVisible && (
        <ChoiceDialog
          visible={isDeleteDialogVisible}
          title={i18n.t("recipe_detail.delete_dialog_title")}
          message={i18n.t("recipe_detail.delete_dialog_desc")}
          confirmText={i18n.t("recipe_detail.delete_dialog_confirm")}
          cancelText={i18n.t("recipe_detail.delete_dialog_cancel")}
          onConfirm={onDeleteConfirmButtonPress}
          onCancel={onDeleteCancelButtonPress}
        />
      )}
    </>
  );
};
