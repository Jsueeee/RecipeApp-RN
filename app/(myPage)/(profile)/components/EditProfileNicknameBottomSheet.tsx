import { DebouncedTouchableOpacity } from "@/app/components/DebouncedPressable";
import { useUpdateUserMutation } from "@/app/hooks/mutations/useUpdateUserMutation";
import CancelIcon from "@/assets/images/ic_profile_nickname_cancel.svg";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import i18n from "@/lib/i18n";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useRef, useState } from "react";
import { Keyboard, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

const MAX_NICKNAME_LENGTH = 25;

interface Props {
  currentImageUrl: string;
  currentNickname: string;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

export default function EditProfileNicknameBottomSheet({
  currentImageUrl,
  currentNickname,
  bottomSheetModalRef,
}: Props) {
  const [inputValue, setInputValue] = useState(currentNickname);
  const inputRef = useRef<TextInput>(null);
  const latestCurrentNicknameRef = useRef(currentNickname);

  latestCurrentNicknameRef.current = currentNickname;

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

  const clearInput = () => {
    inputRef.current?.clear();
    setInputValue("");
  };

  const handleOpen = () => {
    const nickname = latestCurrentNicknameRef.current;

    inputRef.current?.setNativeProps({ text: nickname });
    setInputValue(nickname);
  };

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={i18n.t("profile.edit_profile_nickname")}
      onOpen={handleOpen}
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
            onChangeText={setInputValue}
            maxLength={MAX_NICKNAME_LENGTH}
            className="flex-1 text-title3 text-text-strong p-0"
            placeholder={i18n.t("profile.edit_profile_nickname_hint")}
            placeholderTextColor="#BAC4BF"
            returnKeyType="done"
            selectTextOnFocus
            selectionColor="#BAC4BF"
            cursorColor="#BAC4BF"
            editable={true}
            autoFocus
          />

          <DebouncedTouchableOpacity onPress={clearInput}>
            <CancelIcon width={32} height={32} />
          </DebouncedTouchableOpacity>
        </View>

        <Text className="text-body3 text-text-assistive mt-3 self-end">
          {inputValue.length}/{MAX_NICKNAME_LENGTH}
        </Text>
      </View>
    </DefaultBottomSheetModal>
  );
}
