import { useUpdateUserMutation } from "@/app/hooks/mutations/useUpdateUserMutation";
import CancelIcon from "@/assets/images/ic_profile_nickname_cancel.svg";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import i18n from "@/lib/i18n";
import { BottomSheetModal, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Props {
  currentImageUrl: string;
  currentNickname: string;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

export default function EditProfileImageBottomSheet({
  currentImageUrl,
  currentNickname,
  bottomSheetModalRef,
}: Props) {
  const [nickname, setNickname] = useState(currentNickname);

  const { updateUserInfo, isPending } = useUpdateUserMutation({
    onSuccess: () => {
      bottomSheetModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const onCTAPress = () => {
    if (!nickname) return;

    updateUserInfo({
      profileImgUrl: currentImageUrl,
      nickname: nickname,
    });
  };

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={i18n.t("profile.edit_profile_nickname")}
    >
      <View className="w-full px-4">
        <View className="w-full mt-[30px] flex-row justify-between items-center">
          <BottomSheetTextInput
            value={nickname}
            onChangeText={setNickname}
            className="flex-1 text-title3 text-text-strong p-0"
            placeholder={i18n.t("profile.edit_profile_nickname_hint")}
            placeholderTextColor="#BAC4BF"
            returnKeyType="done"
            selectTextOnFocus
            selectionColor="transparent"
            editable={true}
            caretHidden={true}
          />

          <TouchableOpacity onPress={() => setNickname("")}>
            <CancelIcon width={32} height={32} />
          </TouchableOpacity>
        </View>

        <Text className="text-body3 text-text-assistive mt-3 self-end">
          {nickname.length}/25
        </Text>

        <CTAButton
          buttonLabel={i18n.t("profile.edit_profile_nickname_cta")}
          onPress={onCTAPress}
          className="mt-5 mb-[22px]"
          disabled={!nickname || isPending}
          isLoading={isPending}
        />
      </View>
    </DefaultBottomSheetModal>
  );
}
