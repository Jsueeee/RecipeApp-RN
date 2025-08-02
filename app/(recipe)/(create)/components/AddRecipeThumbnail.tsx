import IC_CAMERA from "@/assets/images/ic_camera.svg";
import React, { useState } from "react";
import { Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";

export const AddRecipeThumbnail = () => {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="w-full max-w-[500px] aspect-square bg-gray-100 items-center justify-center"
      onPress={pickImage}
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
    </TouchableOpacity>
  );
};
