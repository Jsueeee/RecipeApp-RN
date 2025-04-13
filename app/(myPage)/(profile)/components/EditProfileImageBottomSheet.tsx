import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Text, View } from "react-native";

interface Props {
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

export default function EditProfileImageBottomSheet({
  bottomSheetModalRef,
}: Props) {
  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title="프로필 이미지 수정"
    >
      <View className="px-4 border">
        <Text>Select Image</Text>
        <Text>Select Image</Text>
        <Text>Select Image</Text>
      </View>
    </DefaultBottomSheetModal>
  );
}
