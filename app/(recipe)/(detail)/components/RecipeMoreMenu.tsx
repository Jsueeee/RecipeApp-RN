import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import { PressableScale } from "@/app/components/PressableScale";
import { UnscaledModalRoot } from "@/components/UnscaledModalRoot";
import i18n from "@/lib/i18n";
import React from "react";
import { Animated, Modal, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  visible: boolean;
  onClose: () => void;
  onReport: () => void;
  onDelete: () => void;
  isMyRecipe: boolean;
}

export function RecipeMoreMenu({
  visible,
  onClose,
  onReport,
  onDelete,
  isMyRecipe,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <UnscaledModalRoot>
      <Modal
        visible={visible}
        transparent
        statusBarTranslucent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <DebouncedPressable className="flex-1 bg-black/20" onPress={onClose}>
          <Pressable
            className="bg-white rounded-[12px] overflow-hidden min-w-[120px] absolute top-[48px] right-4 p-2 border-b border-gray-100"
            onPress={(e) => e.stopPropagation()}
            style={{
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              marginTop: insets.top,
            }}
          >
            {/* 내 레시피가 아닐 때 신고하기 */}
            {!isMyRecipe && (
              <PressableScale onPress={onReport}>
                <View className="px-2 py-1">
                  <Text className="text-body2 text-text-normal">
                    {i18n.t("recipe_detail.report_dialog_confirm")}
                  </Text>
                </View>
              </PressableScale>
            )}

            {/* 내 레시피일 때 수정하기 / 삭제하기 */}
            {isMyRecipe && (
              <View className="flex-column gap-2">
                <PressableScale onPress={onDelete}>
                  <View className="px-2 py-1">
                    <Text className="text-body2 text-text-normal">
                      {i18n.t("recipe_detail.my_recipe_edit")}
                    </Text>
                  </View>
                </PressableScale>

                <PressableScale onPress={onDelete}>
                  <View className="px-2 py-1">
                    <Text className="text-body2 text-text-normal">
                      {i18n.t("recipe_detail.my_recipe_delete")}
                    </Text>
                  </View>
                </PressableScale>
              </View>
            )}
          </Pressable>
        </DebouncedPressable>
      </Modal>
    </UnscaledModalRoot>
  );
}
