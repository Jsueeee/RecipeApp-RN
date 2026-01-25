import { View, Text, Switch, Platform } from "react-native";
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

        <Switch
          trackColor={{ false: "#E9E9EA", true: "#4BD2B0" }}
          thumbColor={"#FFFFFF"}
          onValueChange={onValueChange}
          value={isPublic}
          style={{
            transform: [
              {
                scale: Platform.OS === "ios" ? 0.8 : 1.3,
              },
            ],
            marginRight: Platform.OS === "ios" ? 0 : 4,
          }}
        />
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
