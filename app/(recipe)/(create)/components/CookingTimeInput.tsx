import CookingTimeIcon from "@/assets/images/ic_cooking_time.svg";
import i18n from "@/lib/i18n";
import { Text, TextInput, View } from "react-native";

interface Props {
  cookingTime: number | null;
  onChanged: (time: number) => void;
}

export const CookingTimeInput = ({ cookingTime, onChanged }: Props) => (
  <View className="flex-row items-center">
    <CookingTimeIcon width={24} height={24} />

    <View className="h-full flex-row justify-center items-center">
      <View className="pl-3">
        <TextInput
          value={cookingTime?.toString()}
          onChangeText={(text) => onChanged(Number(text))}
          className="text-body4 text-text-normal py-0"
          multiline
          numberOfLines={1}
          placeholder="10"
          placeholderClassName="text-body4 text-text-assistive"
          keyboardType="number-pad"
          style={{
            height: 12,
            lineHeight: 12,
            minWidth: 10,
          }}
        />
      </View>

      <Text
        className="text-body4 text-text-normal pl-[2px]"
        style={{
          height: 12,
          lineHeight: 12,
          textAlignVertical: "center",
        }}
      >
        {i18n.t("recipe_my_create.cooking_time_input_suffix")}
      </Text>
    </View>
  </View>
);
