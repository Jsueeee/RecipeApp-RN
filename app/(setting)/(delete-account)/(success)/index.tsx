import { ScreenLayout } from "@/components/layout/ScreenLayout";
import i18n from "@/lib/i18n";
import { Text } from "react-native";

export default function DeleteAccountSuccessScreen() {
  return (
    <ScreenLayout isShowHeader={false}>
      <Text>{i18n.t("delete_account_success.title")}</Text>
    </ScreenLayout>
  );
}
