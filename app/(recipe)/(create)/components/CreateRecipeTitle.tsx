import i18n from "@/lib/i18n";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface Props {
  title: string;
  description: string;
  onInputTitleChanged: (title: string) => void;
  onInputDescriptionChanged: (description: string) => void;
}

const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 300;

export const CreateRecipeTitle = ({
  title,
  description,
  onInputTitleChanged,
  onInputDescriptionChanged,
}: Props) => {
  return (
    <View className="w-full gap-y-[22px]">
      <TextInput
        value={title}
        onChangeText={onInputTitleChanged}
        className="text-heading1 text-text-strong"
        placeholder={i18n.t("recipe_my_create.title_input_hint")}
        placeholderTextColor="#B2BDB8"
        returnKeyType="done"
        selectTextOnFocus
        editable={true}
        multiline={false}
        maxLength={MAX_TITLE_LENGTH}
      />

      <TextInput
        value={description}
        onChangeText={onInputDescriptionChanged}
        className="text-body1 min-h-[20px] leading-[17px] p-0"
        placeholder={i18n.t("recipe_my_create.description_input_hint")}
        placeholderTextColor="#B2BDB8"
        returnKeyType="done"
        selectTextOnFocus
        editable={true}
        multiline={true}
        maxLength={MAX_DESCRIPTION_LENGTH}
      />

      <Text className="text-body3 text-text-assistive text-right">
        {description.length}/{MAX_DESCRIPTION_LENGTH}
      </Text>
    </View>
  );
};
