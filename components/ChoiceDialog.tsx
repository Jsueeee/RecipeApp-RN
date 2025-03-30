import i18n from "@/lib/i18n";
import { Modal, Text, View } from "react-native";
import { CTAButton } from "./CTAButton";

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ChoiceDialog({
  visible,
  title,
  message,
  confirmText = i18n.t("edit_food.remove_dialog_confirm"),
  cancelText = i18n.t("common.close"),
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-material-dimmer justify-center items-center">
        <View className="bg-white rounded-[16px] p-4 w-[80%] max-w-[400px]">
          <Text className="text-title4 text-text-normal mt-1">{title}</Text>

          {message && <Text className="text-body3 mt-2">{message}</Text>}

          <View className="flex-row gap-2 mt-5">
            <CTAButton
              buttonLabel={confirmText ?? ""}
              backgroundColor="bg-fill-normal"
              onClick={onCancel}
              className="flex-1"
            />

            <CTAButton
              buttonLabel={cancelText ?? ""}
              onClick={onConfirm}
              className="flex-1"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
