import CookingTimeIcon from "@/assets/images/ic_cooking_time.svg";
import i18n from "@/lib/i18n";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";

interface Props {
  cookingTime: number | null;
  onChanged: (time: number) => void;
  onFocus?: () => void;
}

export const CookingTimeInput = ({ cookingTime, onChanged, onFocus }: Props) => (
  <View className="flex-row items-center">
    <CookingTimeIcon width={26} height={26} />

    <View className="h-full flex-row justify-center items-center">
      <View className="ml-3 bg-gray-50 rounded-[8px] h-[25px]">
        <TextInput
          value={cookingTime?.toString()}
          onChangeText={(text) => onChanged(Number(text))}
          style={styles.input}
          numberOfLines={1}
          textAlign="center"
          keyboardType="number-pad"
          placeholder="10"
          placeholderTextColor="#9FADA6"
          onFocus={onFocus}
        />
      </View>

      <Text className="text-body2 text-text-normal pl-2">
        {i18n.t("recipe_my_create.cooking_time_input_suffix")}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  input: {
    fontFamily: "pretendard_medium", // text-body2
    fontSize: 14, // text-body2
    color: "#3f4542", // text-body2
    height: 25,
    padding: 0,
    paddingHorizontal: 16,
    ...Platform.select({
      android: {
        textAlignVertical: "center",
        includeFontPadding: false,
      },
    }),
  },
});
