import i18n from "@/lib/i18n";
import React from "react";
import { Image, Text } from "react-native";

export default function SplashLogo() {
  return (
    <>
      <Text className="text-heading1 text-teal-800 text-center mb-[34px]">
        {i18n.t("login.title")}
      </Text>

      <Image
        source={require("@/assets/images/img_splash.png")}
        className="w-[233px] h-[180px] resize-contain"
      />
    </>
  );
}
