import { useUpdateUserMutation } from "@/app/hooks/mutations/useUpdateUserMutation";
import { CTAButton } from "@/components/CTAButton";
import DefaultBottomSheetModal from "@/components/DefaultBottomSheetModal";
import i18n from "@/lib/i18n";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";

interface Props {
  currentImageUrl: string | null | undefined;
  currentNickname: string;
  bottomSheetModalRef: React.RefObject<BottomSheetModal>;
}

const iconList = [
  "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar.png?alt=media&token=d29802a8-9c30-41f1-ab04-5ccf62c3dad4",
  "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(1).png?alt=media&token=4eec78f8-597b-40af-8a8f-436ee80d60d6",
  "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(2).png?alt=media&token=b91f794c-1f83-4910-b146-29a1343906a3",
  "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(3).png?alt=media&token=9ccba668-6eef-4fa7-8c8d-396aa251d12f",
  "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(4).png?alt=media&token=18073140-e65d-46c0-a397-a65951ec075b",
  "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(5).png?alt=media&token=71a5f924-3e8b-4549-be70-9b03246017b1",
  "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(6).png?alt=media&token=6d51c5ce-d610-4a04-9729-976851bfeead",
  "https://firebasestorage.googleapis.com/v0/b/recipeapp-a79ed.appspot.com/o/profile_icon%2Favatar%20(7).png?alt=media&token=27890682-4c8f-4749-98fd-d99b232ab0e3",
];

export default function EditProfileImageBottomSheet({
  currentImageUrl,
  currentNickname,
  bottomSheetModalRef,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    currentImageUrl ?? null
  );

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
  };

  const onCTAPress = () => {
    if (!selectedImage) return;

    updateUserInfo({
      profileImgUrl: selectedImage,
      nickname: currentNickname,
    });
  };

  return (
    <DefaultBottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      title={i18n.t("profile.edit_profile_image")}
    >
      <View className="px-4">
        {selectedImage && (
          <View className="items-center">
            <Image
              source={{ uri: selectedImage }}
              className="w-[100px] h-[100px] rounded-[20px] mt-[22px]"
              resizeMode="cover"
            />
          </View>
        )}

        <View className="flex-row flex-wrap justify-between mt-6">
          {iconList.map((iconUrl, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImageSelect(iconUrl)}
              className={`w-[22%] aspect-square mb-5 rounded-[25px] ${
                selectedImage === iconUrl
                  ? "border-2 border-primary-normal"
                  : ""
              }`}
            >
              <Image
                source={{ uri: iconUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>

        <CTAButton
          buttonLabel={i18n.t("profile.edit_profile_image_cta")}
          onPress={onCTAPress}
          className="mt-5 mb-[22px]"
          disabled={!selectedImage || isPending}
          isLoading={isPending}
        />
      </View>
    </DefaultBottomSheetModal>
  );
}
