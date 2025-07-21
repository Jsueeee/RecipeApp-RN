import i18n from "@/lib/i18n";
import React from "react";
import { TextInput, View } from "react-native";

interface Props {
  title: string;
  description: string;
  onInputTitleChanged: (title: string) => void;
  onInputDescriptionChanged: (description: string) => void;
}

export const CreateRecipeTitle = ({
  title,
  description,
  onInputTitleChanged,
  onInputDescriptionChanged,
}: Props) => {
  return (
    <View className="w-full px-4 gap-y-[22px]">
      <TextInput
        value={title}
        onChangeText={onInputTitleChanged}
        className="text-heading1 text-text-strong"
        placeholder={i18n.t("recipe_my_create.title_input_hint")}
        placeholderTextColor="#B2BDB8"
        returnKeyType="done"
        selectTextOnFocus
        editable={true}
        multiline={true}
        maxLength={100}
      />

      <TextInput
        value={description}
        onChangeText={onInputDescriptionChanged}
        className="text-body1 text-text-normal"
        placeholder={i18n.t("recipe_my_create.description_input_hint")}
        placeholderTextColor="#B2BDB8"
        returnKeyType="done"
        selectTextOnFocus
        editable={true}
        multiline={true}
        maxLength={300}
      />
    </View>
  );
};
