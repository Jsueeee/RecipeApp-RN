import { DebouncedPressable } from "@/app/components/DebouncedPressable";
import { useDebouncedPress } from "@/app/hooks/useDebouncedPress";
import { CTAButton } from "@/components/CTAButton";
import { Modal, Pressable, Text, View } from "react-native";

interface Props {
  visible: boolean;
  title: string;
  message?: string;
  confirmText?: string;
  isConfirmLoading?: boolean;
  onConfirm: () => void;
}

/**
 * 확인 버튼 한개만 있는 다이얼로그
 */
export const ConfirmDialog = ({
  visible,
  title,
  message,
  confirmText,
  isConfirmLoading = false,
  onConfirm,
}: Props) => {
  const debouncedConfirm = useDebouncedPress(onConfirm);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent={true}
      animationType="fade"
    >
      <DebouncedPressable
        className="flex-1 bg-material-dimmer justify-center items-center"
        onPress={debouncedConfirm}
        disablePressDebounce
      >
        <Pressable
          className="bg-white rounded-[16px] p-4 w-[80%] max-w-[400px]"
          onPress={(e) => e.stopPropagation()}
        >
          <Text className="text-title4 text-text-normal mt-1">{title}</Text>

          {message && <Text className="text-body3 mt-3">{message}</Text>}

          <View className="flex-row gap-2 mt-6">
            <CTAButton
              buttonLabel={confirmText ?? ""}
              isLoading={isConfirmLoading}
              onPress={debouncedConfirm}
              className="flex-1"
            />
          </View>
        </Pressable>
      </DebouncedPressable>
    </Modal>
  );
};
