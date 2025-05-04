import i18n from "@/lib/i18n";
import { Modal, Pressable, Text, View } from "react-native";
import { CTAButton } from "./CTAButton";

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isConfirmLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ChoiceDialog({
  visible,
  title,
  message,
  confirmText,
  cancelText = i18n.t("common.close"),
  isConfirmLoading = false,
  onConfirm,
  onCancel,
}: Props) {
  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent={true}
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <Pressable
        className="flex-1 bg-material-dimmer justify-center items-center"
        onPress={handleCancel}
      >
        <Pressable
          className="bg-white rounded-[16px] p-4 w-[80%] max-w-[400px]"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-title4 text-text-normal mt-1">{title}</Text>

          {message && <Text className="text-body3 mt-3">{message}</Text>}

          <View className="flex-row gap-2 mt-6">
            <CTAButton
              buttonLabel={cancelText ?? ""}
              buttonLabelColor="text-text-alternative"
              backgroundColor="fill-subtle"
              onPress={handleCancel}
              className="flex-1"
            />

            <CTAButton
              buttonLabel={confirmText ?? ""}
              isLoading={isConfirmLoading}
              onPress={onConfirm}
              className="flex-1"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
