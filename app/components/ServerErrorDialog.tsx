import { ConfirmDialog } from "@/components/ConfirmDialog";
import i18n from "@/lib/i18n";
import { BackHandler, Platform } from "react-native";

interface Props {
  visible: boolean;
}

export const ServerErrorDialog = ({ visible }: Props) => {
  const onCloseApp = () => {
    if (Platform.OS === "android") {
      BackHandler.exitApp();
    }
  };

  return (
    <ConfirmDialog
      visible={visible}
      title={i18n.t("app.server_error_title")}
      message={i18n.t("app.server_error_content")}
      confirmText={i18n.t("app.server_error_cta")}
      onConfirm={onCloseApp}
    />
  );
};
