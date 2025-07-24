import { getStoreUrl } from "@/app/utils/VersionUtils";
import { ChoiceDialog } from "@/components/ChoiceDialog";
import i18n from "@/lib/i18n";
import { BackHandler, Linking, Platform } from "react-native";

interface Props {
  visible: boolean;
}

export const UpdateVersionDialog = ({ visible }: Props) => {
  const handleUpdatePress = async () => {
    try {
      const storeUrl = getStoreUrl();
      await Linking.openURL(storeUrl);
    } catch (error) {
      console.error("스토어 열기 실패:", error);
    }
  };

  const onCloseApp = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    }
  };

  return (
    <ChoiceDialog
      visible={visible}
      title={i18n.t("app.version_title")}
      message={i18n.t("app.version_message")}
      confirmText={i18n.t("app.version_confirm")}
      cancelText={i18n.t("app.version_cancel")}
      onConfirm={handleUpdatePress}
      onCancel={onCloseApp}
    />
  );
};
