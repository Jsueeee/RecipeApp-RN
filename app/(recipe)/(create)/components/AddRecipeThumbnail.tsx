import { DebouncedTouchableOpacity } from "@/app/components/DebouncedPressable";
import IC_CAMERA from "@/assets/images/ic_camera.svg";
import { optimizeRecipeThumbnail } from "@/app/utils/RecipeImageUtils";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image } from "react-native";

interface Props {
  image: string | null;
  setImage: (image: string | null) => void;
}

export const AddRecipeThumbnail = ({ image, setImage }: Props) => {
  const [isPreparingImage, setIsPreparingImage] = useState(false);

  const pickImage = async () => {
    if (isPreparingImage) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];

      setIsPreparingImage(true);

      try {
        const optimizedUri = await optimizeRecipeThumbnail(asset);
        setImage(optimizedUri);
      } catch (error) {
        console.error("레시피 이미지 최적화 실패:", error);
        setImage(asset.uri);
      } finally {
        setIsPreparingImage(false);
      }
    }
  };
  return (
    <DebouncedTouchableOpacity
      activeOpacity={0.7}
      className="w-full h-full bg-gray-100 items-center justify-center"
      onPress={pickImage}
      disabled={isPreparingImage}
    >
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <IC_CAMERA width={40} height={40} />
      )}
    </DebouncedTouchableOpacity>
  );
};
