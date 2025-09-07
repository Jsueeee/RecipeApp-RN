import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import { LayoutChangeEvent, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  onCTAButtonPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

export const CreateRecipeHeader = ({ onCTAButtonPress, onLayout }: Props) => {
  const onCancelButtonPress = () => {
    router.back();
  };

  return (
    <View
      className="flex-row items-center justify-between px-4 py-2 bg-white z-10 pt-safe"
      onLayout={onLayout}
    >
      <PressableScale onPress={onCancelButtonPress} hitSlop={10}>
        <Text className="text-title4 text-text-normal">
          {i18n.t("recipe_my_create.header_cancel_button")}
        </Text>
      </PressableScale>

      <PressableScale onPress={onCTAButtonPress}>
        <View className="px-3 py-2 bg-primary-normal rounded-[20px]">
          <Text className="text-title4 text-white">
            {i18n.t("recipe_my_create.header_register_button")}
          </Text>
        </View>
      </PressableScale>
    </View>
  );
};
