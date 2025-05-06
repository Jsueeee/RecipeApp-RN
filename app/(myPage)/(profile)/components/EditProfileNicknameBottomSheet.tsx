import { useUpdateUserMutation } from "@/app/hooks/mutations/useUpdateUserMutation";
import CancelIcon from "@/assets/images/ic_profile_nickname_cancel.svg";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import i18n from "@/lib/i18n";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Keyboard, Text, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

interface Props {
  currentImageUrl: string;
  currentNickname: string;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

export default function EditProfileNicknameBottomSheet({
  currentImageUrl,
  currentNickname,
  bottomSheetModalRef,
}: Props) {
  // input 값 자음 모음 분리 현상 때문에 defaultValue 를 사용하고, inputValue, inputRef 로 관리한다
  const [inputValue, setInputValue] = useState(currentNickname);
  const inputRef = useRef<TextInput>(null);

  const { updateUserInfo, isPending } = useUpdateUserMutation({
    onSuccess: () => {
      bottomSheetModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onCTAPress = () => {
    Keyboard.dismiss();

    if (!inputValue) return;

    updateUserInfo({
      profileImgUrl: currentImageUrl,
      nickname: inputValue,
    });
  };

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={i18n.t("profile.edit_profile_nickname")}
      footer={
        <CTAButton
          buttonLabel={i18n.t("profile.edit_profile_nickname_cta")}
          onPress={onCTAPress}
          disabled={!inputValue || isPending}
          isLoading={isPending}
        />
      }
    >
      <View className="w-full px-4">
        <View className="w-full mt-[30px] flex-row justify-between items-center">
          <BottomSheetTextInput
            ref={inputRef}
            defaultValue={currentNickname}
            onChangeText={setInputValue}
            className="flex-1 text-title3 text-text-strong p-0"
            placeholder={i18n.t("profile.edit_profile_nickname_hint")}
            placeholderTextColor="#BAC4BF"
            returnKeyType="done"
            selectTextOnFocus
            selectionColor="transparent"
            editable={true}
          />

          <TouchableOpacity
            onPress={() => {
              inputRef.current?.clear();
              setInputValue("");
            }}
          >
            <CancelIcon width={32} height={32} />
          </TouchableOpacity>
        </View>

        <Text className="text-body3 text-text-assistive mt-3 self-end">
          {inputValue.length}/25
        </Text>
      </View>
    </DefaultBottomSheetModal>
  );
}
