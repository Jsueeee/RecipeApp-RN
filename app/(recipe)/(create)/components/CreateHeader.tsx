import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import { Text, View } from "react-native";

export const CreateRecipeHeader = () => {
  const onCancelButtonPress = () => {
    router.back();
  };

  const onRegisterButtonPress = () => {
    console.log("onRegisterButtonPress");
  };

  return (
    <View className="flex-row items-center justify-between px-4 py-2">
      <PressableScale onPress={onCancelButtonPress} hitSlop={10}>
        <Text className="text-title4 text-text-normal">
          {i18n.t("recipe_my_create.header_cancel_button")}
        </Text>
      </PressableScale>

      <PressableScale onPress={onRegisterButtonPress}>
        <View className="px-3 py-2 bg-primary-normal rounded-[20px]">
          <Text className="text-title4 text-white">
            {i18n.t("recipe_my_create.header_register_button")}
          </Text>
        </View>
      </PressableScale>
    </View>
  );
};
