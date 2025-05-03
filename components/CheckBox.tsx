import CheckBoxIcon from "@/assets/images/ic_check_box.svg";
import { View } from "react-native";

interface Props {
  isChecked: boolean;
}

export function CheckBox({ isChecked }: Props) {
  return (
    <View className="w-[24px] h-[24px] p-[3px]">
      <View
        className={`w-full h-full rounded-[6px] border-2 ${
          isChecked ? "border-[#4BD2B0]" : "border-[#E3E8E5]"
        } items-center justify-center`}
      >
        {isChecked && <View className="w-full h-full bg-teal-500 absolute" />}

        {isChecked && <CheckBoxIcon color="#FFFFFF" />}
      </View>
    </View>
  );
}
