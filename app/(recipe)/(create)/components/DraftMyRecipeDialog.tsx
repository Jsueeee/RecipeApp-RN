import { ChoiceDialog } from "@/components/ChoiceDialog";
import i18n from "@/lib/i18n";

interface Props {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DraftMyRecipeDialog = ({
  visible,
  onConfirm,
  onCancel,
}: Props) => {
  return (
    <ChoiceDialog
      visible={visible}
      title={i18n.t("recipe_my_create.draft_dialog_title")}
      message={i18n.t("recipe_my_create.draft_dialog_desc")}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};
