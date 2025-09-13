import { PressableScale } from "@/app/components/PressableScale";
import i18n from "@/lib/i18n";
import { router } from "expo-router";
import { LayoutChangeEvent, Text, View } from "react-native";

interface Props {
  onCTAButtonPress: () => void;
  onLayout: (event: LayoutChangeEvent) => void;
  isUploading?: boolean;
}

export const CreateRecipeHeader = ({
  onCTAButtonPress,
  onLayout,
  isUploading = false,
}: Props) => {
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

      <PressableScale onPress={onCTAButtonPress} disabled={isUploading}>
        <View
          className={`px-3 py-2 rounded-[20px] ${
            true ? "bg-primary-disable" : "bg-primary-normal"
          }`}
        >
          <Text className="text-title4 text-white">
            {i18n.t("recipe_my_create.header_register_button")}
          </Text>
        </View>
      </PressableScale>
    </View>
  );
};
