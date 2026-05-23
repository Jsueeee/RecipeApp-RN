import { useUpdateUserMutation } from "@/app/hooks/mutations/useUpdateUserMutation";
import {
  getProfileAvatarSource,
  isProfileAvatarUrl,
  PROFILE_AVATARS,
} from "@/constants/ProfileAvatar";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import i18n from "@/lib/i18n";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useEffect, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { impactLight } from "@/app/lib/haptics";

interface Props {
  currentImageUrl: string | null | undefined;
  currentNickname: string;
  bottomSheetModalRef: React.RefObject<BottomSheetModal | null>;
}

export default function EditProfileImageBottomSheet({
  currentImageUrl,
  currentNickname,
  bottomSheetModalRef,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentImageUrl ?? null,
  );

  useEffect(() => {
    setSelectedImage(currentImageUrl ?? null);
  }, [currentImageUrl]);

  useEffect(() => {
    if (!currentImageUrl || isProfileAvatarUrl(currentImageUrl)) return;

    Image.prefetch(currentImageUrl).catch((error) => {
      console.warn("프로필 이미지 프리로드 실패:", error);
    });
  }, [currentImageUrl]);

  const { updateUserInfo, isPending } = useUpdateUserMutation({
    onSuccess: () => {
      bottomSheetModalRef.current?.dismiss();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    impactLight();
  };

  const onCTAPress = () => {
    if (!selectedImage) return;

    updateUserInfo({
      profileImgUrl: selectedImage,
      nickname: currentNickname,
    });
  };

  const onDismiss = () => {
    setSelectedImage(currentImageUrl ?? null);
  };

  const selectedImageSource = getProfileAvatarSource(selectedImage);

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={i18n.t("profile.edit_profile_image")}
      onDismiss={onDismiss}
      footer={
        <CTAButton
          buttonLabel={i18n.t("profile.edit_profile_image_cta")}
          onPress={onCTAPress}
          disabled={!selectedImage || isPending}
          isLoading={isPending}
        />
      }
    >
      <View className="px-4">
        {selectedImageSource && (
          <View className="items-center">
            <Image
              source={selectedImageSource}
              className="w-[100px] h-[100px] rounded-[20px] mt-[22px]"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="flex-row flex-wrap justify-between mt-6">
          {PROFILE_AVATARS.map((avatar) => {
            const isSelected = selectedImage === avatar.url;

            return (
              <TouchableOpacity
                key={avatar.url}
                onPress={() => handleImageSelect(avatar.url)}
                className="w-[22%] aspect-square mb-5 rounded-[25px] overflow-hidden"
              >
                <Image
                  source={avatar.source}
                  className="w-full h-full rounded-[25px]"
                  resizeMode="cover"
                />

                {isSelected && (
                  <View className="absolute inset-0 rounded-[25px] border-2 border-primary-normal" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </DefaultBottomSheetModal>
  );
}
