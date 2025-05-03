import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { Text, View } from "react-native";

export default function DeleteAccountConfirmScreen() {
  return (
    <ScreenLayout
      title={i18n.t("delete_account_confirm.app_bar_title")}
      isScrollEnabled={true}
    >
      <View className="flex-1 px-4">
        <Text className="text-title3 text-text-strong mt-3">
          {i18n.t("delete_account_confirm.title")}
        </Text>

        <Text className="text-body2 text-text-alternative mt-2">
          {i18n.t("delete_account_confirm.message")}
        </Text>
      </View>
    </ScreenLayout>
  );
}
