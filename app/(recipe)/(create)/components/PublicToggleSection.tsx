import { AppSwitch } from "@/components/AppSwitch";
import { View, Text } from "react-native";
import AlertIcon from "@/assets/images/ic_alert_desc.svg";
import i18n from "@/lib/i18n";

interface PublicToggleSectionProps {
  isPublic: boolean;
  onValueChange: (value: boolean) => void;
}

export function PublicToggleSection({
  isPublic,
  onValueChange,
}: PublicToggleSectionProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between">
        <Text className="text-title3 text-text-normal">
          {i18n.t("recipe_my_create.public_toggle_title")}
        </Text>

        <AppSwitch onValueChange={onValueChange} value={isPublic} />
      </View>

      <Text className="mt-2 text-body3 text-text-alternative flex-1">
        {i18n.t("recipe_my_create.public_toggle_desc")}
      </Text>

      <View className="flex-row items-center mt-5">
        <AlertIcon width={14} height={14} />

        <Text className="text-body4 text-red-400 ml-1 flex-1">
          {i18n.t("recipe_my_create.public_toggle_warning")}
        </Text>
      </View>
    </View>
  );
}
