import { getStoreUrl } from "@/app/utils/VersionUtils";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import i18n from "@/lib/i18n";
import { Linking } from "react-native";

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

  return (
    <ConfirmDialog
      visible={visible}
      title={i18n.t("app.version_title")}
      message={i18n.t("app.version_message")}
      confirmText={i18n.t("app.version_confirm")}
      onConfirm={handleUpdatePress}
    />
  );
};
