import i18n from "@/lib/i18n";
import React from "react";
import { TextInput, View } from "react-native";

interface Props {
  title: string;
  onInputTitleChanged: (title: string) => void;
}

export const CreateRecipeTitle = ({ title, onInputTitleChanged }: Props) => {
  return (
    <View className="w-full px-4">
      <TextInput
        value={title}
        onChangeText={onInputTitleChanged}
        className="text-heading1 text-text-strong"
        placeholder={i18n.t("recipe_my_create.title_input_hint")}
        placeholderTextColor="#9FADA6"
        returnKeyType="done"
        selectTextOnFocus
        editable={true}
        multiline={true}
        maxLength={100}
      />
    </View>
  );
};
