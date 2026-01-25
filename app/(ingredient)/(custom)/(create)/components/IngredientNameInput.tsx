import i18n from "@/lib/i18n";
import { Text, TextInput, View } from "react-native";

interface Props {
  name: string;
  onNameChanged: (value: string) => void;
}

export function IngredientNameInput({ name, onNameChanged }: Props) {
  return (
    <View className="w-full flex-row items-center">
      <Text className="text-title5 text-text-alternative w-[100px]">
        {i18n.t("custom_ingredient_create.name")}
      </Text>

      <NameInput name={name} onNameChanged={onNameChanged} />
    </View>
  );
}

function NameInput({ name, onNameChanged }: Props) {
  return (
    <View className="flex-1 flex-row items-center justify-between py-2">
      <TextInput
        value={name}
        onChangeText={onNameChanged}
        className="flex-1 text-utility2 min-h-[20px] leading-[17px] p-0"
        returnKeyType="done"
        selectTextOnFocus
        editable={true}
        placeholder={i18n.t("custom_ingredient_create.input_name_hint")}
        placeholderTextColor="#9FADA6"
      />
    </View>
  );
}
