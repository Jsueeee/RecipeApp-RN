import IC_CAMERA from "@/assets/images/ic_camera.svg";
import React from "react";
import { TouchableOpacity } from "react-native";

export const AddRecipeThumbnail = () => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className="w-full max-w-[500px] aspect-square bg-gray-100 items-center justify-center"
    >
      <IC_CAMERA width={40} height={40} />
    </TouchableOpacity>
  );
};
